// Orientative NIS 2 scoping under OUG 155/2024 as consolidated after Legea
// 124/2025. Size follows art. 8: Legea 346/2004 art. 4 alin. (1) lit. c)
// thresholds, with partner/linked enterprises aggregated and without the
// art. 4^5 public-ownership exclusion. Pure so it can be checked in Node.

/** How an activity is treated by arts. 5–6 beyond the plain size rules. */
export type ActivityRule =
  | 'annex1' // large → essential, medium → important
  | 'annex2' // large or medium → important
  | 'dora' // annex 1 sizing; DORA supersedes the security obligations (art. 2 alin. (3))
  | 'always-essential' // DNS, TLD, qualified trust services (art. 5 alin. (1))
  | 'public-admin' // central public administration (art. 5 alin. (1) lit. a))
  | 'trust' // non-qualified trust services: large → essential, else important
  | 'ecomm' // public e-comms: large/medium → essential, small → important
  | 'mssp' // managed security services: large/medium → essential
  | 'none';

export type Size = 'large' | 'medium' | 'small';
export type Outcome = 'essential' | 'important' | 'designated' | 'out';

export interface Nis2Input {
  rule: ActivityRule;
  /** Average annual headcount, previous financial year, group-aggregated. */
  employees: number;
  /** Net annual turnover, million EUR. */
  turnover: number;
  /** Total assets (balance sheet), million EUR. */
  assets: number;
  /** Identified by the authority under art. 9 or designated a critical entity. */
  designated: boolean;
}

export interface Nis2Result {
  outcome: Outcome;
  size: Size;
  /** Medium only through the financial limbs with under 50 employees. */
  borderline: boolean;
  /** Article that grounds the outcome, e.g. "art. 5 alin. (2)". */
  basis: string;
  dora: boolean;
}

export const sizeIndependent = (rule: ActivityRule) =>
  rule === 'always-essential' || rule === 'public-admin' || rule === 'none';

export function classifySize({ employees, turnover, assets }: Pick<Nis2Input, 'employees' | 'turnover' | 'assets'>) {
  // Large = above the medium ceiling (250 staff, or €50M turnover and €43M
  // assets). Medium starts at 50 staff, or above €10M on both financials.
  if (employees >= 250 || (turnover > 50 && assets > 43)) return { size: 'large' as const, borderline: false };
  if (employees >= 50) return { size: 'medium' as const, borderline: false };
  if (turnover > 10 && assets > 10) return { size: 'medium' as const, borderline: true };
  return { size: 'small' as const, borderline: false };
}

export function classify(input: Nis2Input): Nis2Result {
  const { size, borderline } = classifySize(input);
  const [outcome, basis] = scope(input.rule, size);
  // An art. 9 identification or a critical-entity designation can only raise
  // the category; the authority's decision then sets it.
  const raised = input.designated && outcome !== 'essential';
  return {
    outcome: raised ? 'designated' : outcome,
    basis: raised ? 'art. 5 alin. (1) lit. b)–c), art. 6 alin. (2)' : basis,
    size,
    borderline,
    dora: input.rule === 'dora',
  };
}

function scope(rule: ActivityRule, size: Size): [Outcome, string] {
  switch (rule) {
    case 'always-essential':
      return ['essential', 'art. 5 alin. (1)'];
    case 'public-admin':
      return ['essential', 'art. 5 alin. (1) lit. a)'];
    case 'trust':
      return size === 'large' ? ['essential', 'art. 5 alin. (2)'] : ['important', 'art. 6 alin. (2)'];
    case 'ecomm':
      if (size === 'large') return ['essential', 'art. 5 alin. (2)'];
      if (size === 'medium') return ['essential', 'art. 5 alin. (3)'];
      return ['important', 'art. 6 alin. (2)'];
    case 'mssp':
      if (size === 'large') return ['essential', 'art. 5 alin. (2)'];
      if (size === 'medium') return ['essential', 'art. 5 alin. (4)'];
      break;
    case 'annex1':
    case 'dora':
      if (size === 'large') return ['essential', 'art. 5 alin. (2)'];
      if (size === 'medium') return ['important', 'art. 6 alin. (1)'];
      break;
    case 'annex2':
      if (size !== 'small') return ['important', 'art. 6 alin. (1)'];
      break;
    case 'none':
      return ['out', 'art. 5–6'];
  }
  return ['out', 'art. 8'];
}
