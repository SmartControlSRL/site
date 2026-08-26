// Enforce the time-bounded dependency-risk register without mutating the tree.
// Runs both the complete audit and the production-omitted view. Accepted
// build/editor advisories remain visible; any new or expired finding fails CI.
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const policyPath = process.argv[2] || 'config/dependency-risk-acceptance.json';
const policy = JSON.parse(await readFile(policyPath, 'utf8'));
const requiredFields = ['id', 'package', 'severity', 'affectedRange', 'affectedPath', 'reachability', 'exposure', 'rationale', 'owner', 'reviewBy'];
const today = new Date().toISOString().slice(0, 10);

function npmAudit(extraArgs = []) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npm, ['audit', ...extraArgs, '--json'], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    throw new Error(`npm audit did not return JSON:\n${result.stderr || result.stdout}`);
  }
  if (report.error) throw new Error(`npm audit failed: ${report.error.summary || report.error.message || 'unknown error'}`);
  return report;
}

function advisoriesIn(report) {
  const advisories = new Map();
  for (const vulnerability of Object.values(report.vulnerabilities || {})) {
    for (const item of vulnerability.via || []) {
      if (typeof item !== 'object' || !item.url) continue;
      const id = item.url.match(/GHSA-[\w-]+/i)?.[0]?.toUpperCase();
      if (id) advisories.set(id, { ...item, id });
    }
  }
  return advisories;
}

const policyById = new Map();
const policyErrors = [];
for (const acceptance of policy.acceptedAdvisories || []) {
  for (const field of requiredFields) {
    if (!acceptance[field]) policyErrors.push(`${acceptance.id || '<missing id>'}: missing ${field}`);
  }
  const normalizedId = acceptance.id?.toUpperCase();
  if (policyById.has(normalizedId)) policyErrors.push(`${acceptance.id}: duplicate acceptance`);
  policyById.set(normalizedId, acceptance);
  if (acceptance.reviewBy < today) policyErrors.push(`${acceptance.id}: acceptance expired ${acceptance.reviewBy}`);
}
if (!policy.owner || !policy.reviewBy) policyErrors.push('policy: owner and reviewBy are required');
if (policy.reviewBy < today) policyErrors.push(`policy: review expired ${policy.reviewBy}`);

const full = npmAudit();
const production = npmAudit(['--omit=dev']);
const current = advisoriesIn(full);
const unknown = [...current.keys()].filter((id) => !policyById.has(id));
const productionCount = production.metadata?.vulnerabilities?.total ?? 0;

for (const [id, advisory] of current) {
  const acceptance = policyById.get(id);
  if (!acceptance) continue;
  if (acceptance.package !== advisory.name) {
    policyErrors.push(`${id}: package drifted from ${acceptance.package} to ${advisory.name}`);
  }
  if (acceptance.severity.toLowerCase() !== advisory.severity.toLowerCase()) {
    policyErrors.push(`${id}: severity drifted from ${acceptance.severity} to ${advisory.severity}`);
  }
  if (acceptance.affectedRange !== advisory.range) {
    policyErrors.push(`${id}: affected range drifted from ${acceptance.affectedRange} to ${advisory.range}`);
  }
}

console.log(`Dependency audit: ${full.metadata?.vulnerabilities?.total ?? 0} vulnerable packages, ${current.size} advisory IDs`);
console.log(`Production-omitted audit: ${productionCount} vulnerable packages`);
console.log(`Accepted until ${policy.reviewBy}: ${[...current.keys()].filter((id) => policyById.has(id)).length} active advisory IDs`);

if (unknown.length) policyErrors.push(`unaccepted advisories: ${unknown.join(', ')}`);
if (productionCount) policyErrors.push(`production dependency view contains ${productionCount} vulnerable package(s)`);

if (policyErrors.length) {
  console.error(policyErrors.map((error) => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

const stale = [...policyById.keys()].filter((id) => !current.has(id));
if (stale.length) console.log(`Review removable policy entries: ${stale.join(', ')}`);
console.log('OK: every active advisory is explicitly accepted and the production dependency view is clean');
