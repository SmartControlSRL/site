import {
  AppWindow,
  BadgeCheck,
  Bot,
  Cloud,
  ClipboardList,
  Code,
  Container,
  Crosshair,
  DatabaseZap,
  Factory,
  FileCheck,
  FileCode,
  Gauge,
  GitBranch,
  Headset,
  KeyRound,
  Layers,
  ListChecks,
  MessageSquare,
  Network,
  Route,
  Scale,
  ScanSearch,
  Server,
  Shield,
  ShieldCheck,
  Users,
  Wrench,
} from '@lucide/astro';
import type { Lang } from '../i18n/ui';
import type { FlowStep } from '../components/RouteFlowVisual.astro';

type IconComponent = typeof Server;

export type ServiceArtwork = 'architecture-light' | 'network-security' | 'software-automation' | 'managed-services';

export type ServicePageKey = 'security' | 'software' | 'managed';

export interface Capability {
  title: string;
  body: string;
  items?: string[];
  Icon: IconComponent;
}

export interface SupportingCard {
  name: string;
  body: string;
  href: string;
  linkLabel: string;
  Icon: IconComponent;
}

export interface ServicePageContent {
  title: string;
  description: string;
  canonicalPath: string;
  schemaName: string;
  schemaServiceType: string | string[];
  hero: {
    artwork: ServiceArtwork;
    eyebrow: string;
    lead: string;
    accent: string;
    tail?: string;
    body: string;
    secondary: string;
  };
  context?: Array<{ title: string; body: string }>;
  scope?: {
    heading: string;
    body?: string;
    items: string[];
  };
  flow: {
    eyebrow: string;
    heading: string;
    description: string;
    caption: string;
    steps: FlowStep[];
  };
  capabilities: {
    eyebrow: string;
    heading: string;
    description?: string;
    items: Capability[];
  };
  proof?: {
    heading: string;
    body?: string;
    items: Capability[];
  };
  supporting?: {
    eyebrow?: string;
    heading: string;
    body: string;
    cards: SupportingCard[];
  };
  cta: { heading: string; body: string };
}

const security: Record<Lang, ServicePageContent> = {
  ro: {
    title: 'Networking & Cybersecurity — Smart Control',
    description: 'Proiectăm, securizăm și operăm rețele enterprise, cloud hibrid și Kubernetes: monitorizare SOC/NOC, teste de penetrare, suport pentru conformitate NIS 2 și securitate OT.',
    canonicalPath: '/servicii/securitate/',
    schemaName: 'Networking & Cybersecurity',
    schemaServiceType: ['Enterprise Networking', 'Network Security', 'Managed Security Operations', 'Penetration Testing', 'NIS 2 Compliance Support'],
    hero: { artwork: 'network-security',
      eyebrow: 'Networking & Cybersecurity',
      lead: 'Rețea solidă.',
      accent: 'Securitate operată.',
      body: 'Proiectăm, securizăm și operăm rețele enterprise — de la campus și data center până la sucursale, cloud și OT. Echipa care construiește infrastructura răspunde și de monitorizarea ei, cu niveluri de serviciu agreate contractual.',
      secondary: 'Vezi capabilitățile',
    },
    context: [
      { title: 'NIS 2 este lege în România', body: 'OUG 155/2024 obligă entitățile esențiale și importante să se înregistreze la DNSC, să gestioneze riscurile și să raporteze incidentele. Conducerea are responsabilități directe.' },
      { title: 'Perimetrul nu mai e la birou', body: 'Utilizatorii lucrează de oriunde, aplicațiile stau în cloud și SaaS. Firewall-ul de la intrare nu mai vede tot traficul.' },
      { title: 'IT și OT s-au conectat', body: 'Liniile de producție, rețelele energetice și clădirile inteligente sunt acum ținte accesibile din rețeaua de birou.' },
    ],
    flow: {
      eyebrow: 'NOC + SOC',
      heading: 'Disponibilitate și securitate, monitorizate de aceeași echipă',
      description: 'Multe incidente încep ca o anomalie de rețea: un link saturat, un echipament care se repornește, un trafic nou spre exterior. Când NOC-ul și SOC-ul lucrează separat, semnalul se poate pierde între ele. La noi, aceeași echipă vede ambele imagini și acționează.',
      caption: 'Acoperirea, timpii de triere și răspuns și escaladările sunt agreate contractual.',
      steps: [
        { label: 'Detectare', title: 'Colectăm loguri și telemetrie', body: 'Logurile, telemetria de rețea și alertele de la echipamentele de securitate ajung în SEKNET.' },
        { label: 'Triere', title: 'Separăm zgomotul de incidentele reale', body: 'Analistul confirmă incidentul și stabilește prioritatea în timpii agreați.' },
        { label: 'Răspuns', title: 'Izolăm, blocăm sau escaladăm', body: 'Acțiunile urmează playbook-ul agreat cu echipa voastră.' },
        { label: 'Raportare', title: 'Documentăm incidentul', body: 'Primiți raportul incidentului și suport pentru notificarea către DNSC.' },
      ],
    },
    scope: {
      heading: 'Rețele enterprise',
      body: 'Infrastructură de rețea proiectată pentru disponibilitate și ușor de operat — baza pe care se sprijină restul securității.',
      items: ['LAN de campus', 'Wi-Fi enterprise', 'WAN și SD-WAN', 'Rețele de data center', 'Load balancing', 'Automatizare rețea'],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Nouă capabilități, o singură echipă responsabilă',
      description: 'Le puteți contracta separat sau ca program integrat. În ambele cazuri, aveți un singur interlocutor pentru rețea și securitate.',
      items: [
        { title: 'Securitatea rețelei și a perimetrului', body: 'Control asupra a ce intră, ce iese și ce circulă între zone: next-generation firewall și IPS, segmentare, NAC, WAF și protecție API, NDR.', items: ['Next-generation firewall și IPS', 'Segmentare și microsegmentare', 'Control acces în rețea (NAC)', 'Web Application Firewall și protecție API', 'Detecție și răspuns la nivel de rețea (NDR)'], Icon: Shield },
        { title: 'Acces Zero Trust și identitate', body: 'Fiecare acces verificat, indiferent de unde vine: ZTNA și SASE, acces remote cu S-VPN, MFA, Enterprise SSO, PKI și PAM.', items: ['ZTNA și SASE', 'Acces remote securizat cu S-VPN', 'MFA, Enterprise SSO și PKI', 'Gestionarea conturilor privilegiate (PAM)'], Icon: KeyRound },
        { title: 'SOC și NOC', body: 'Monitorizarea disponibilității și a securității, triere și răspuns la incidente conform playbook-urilor agreate, cu vizibilitate unificată în SEKNET.', items: ['Monitorizare și triere', 'Răspuns conform playbook-urilor agreate', 'Platforma SEKNET', 'Rapoarte lunare pentru IT și conducere'], Icon: ScanSearch },
        { title: 'Protecția datelor și a stațiilor', body: 'Data Leakage Prevention, EDR / XDR pentru stații și servere, securitatea e-mailului, criptare și managementul cheilor.', items: ['Data Leakage Prevention (DLP)', 'EDR / XDR', 'Securitatea e-mailului', 'Criptare și managementul cheilor'], Icon: DatabaseZap },
        { title: 'Securitate OT și industrială', body: 'Protecție pentru sisteme care nu se pot opri pentru un patch: inventarul activelor OT, segmentare IT / OT și monitorizare pasivă, aliniate la IEC 62443.', items: ['Inventarul activelor OT', 'Segmentare IT / OT', 'Monitorizare pasivă', 'Aliniere la IEC 62443'], Icon: Factory },
        { title: 'Cloud și hybrid cloud', body: 'Aceleași reguli de securitate în data center și în cloud: conectivitate hibridă, segmentare în cloud, CSPM și identitate unificată între on-premise, cloud și SaaS.', items: ['Conectivitate hibridă', 'Arhitecturi multi-cloud', 'Firewall și segmentare în cloud', 'CSPM și protecția workload-urilor', 'Identitate unificată'], Icon: Cloud },
        { title: 'Kubernetes și cloud-native', body: 'Rețea, microsegmentare și vizibilitate pentru clustere cu Cilium, Hubble și Tetragon, de la BGP spre data center până la securitate la runtime.', items: ['Cilium ca CNI și Gateway API', 'Politici L3–L7 între aplicații', 'Criptare transparentă între noduri', 'Vizibilitate pe fluxuri cu Hubble', 'Securitate la runtime cu Tetragon'], Icon: Container },
        { title: 'Testare ofensivă', body: 'Găsim breșele înaintea atacatorilor: teste de penetrare pentru rețea, aplicații web și Wi-Fi, managementul vulnerabilităților, simulări de phishing și retestare după remediere.', items: ['Teste de penetrare', 'Managementul vulnerabilităților', 'Simulări de phishing', 'Retestare după remediere'], Icon: Crosshair },
        { title: 'Conformitate și guvernanță', body: 'Cerințele legale transformate în măsuri concrete: suport pentru NIS 2, DORA, ISO 27001 și GDPR, politici, analiză de risc, planuri de răspuns și instruire.', items: ['Plan de conformitate NIS 2', 'Suport DORA, ISO 27001 și GDPR', 'Politici și analiză de risc', 'Instruire pentru conducere și angajați'], Icon: Scale },
      ],
    },
    proof: {
      heading: 'Conformitate NIS 2 fără hârtii inutile',
      body: 'OUG 155/2024 cere măsuri tehnice reale, nu doar documente. Pentru că implementăm și operăm acele măsuri, planul de conformitate poate fi și executat, nu doar scris.',
      items: [
        { title: 'Încadrare', body: 'Verificăm dacă intrați sub incidență și ca entitate esențială sau importantă.', Icon: ListChecks },
        { title: 'Analiză de decalaj', body: 'Comparăm situația actuală cu măsurile de gestionare a riscurilor cerute.', Icon: ClipboardList },
        { title: 'Plan de remediere', body: 'Priorități ordonate după risc, efort și buget.', Icon: Route },
        { title: 'Implementare', body: 'Segmentare, MFA, backup, monitorizare și răspuns la incidente.', Icon: Wrench },
        { title: 'Dovadă și audit', body: 'Documentație, instruirea conducerii și pregătirea pentru auditul de securitate.', Icon: FileCheck },
      ],
    },
    supporting: {
      eyebrow: 'Produse proprii',
      heading: 'SEKNET și S-VPN, integrate în serviciu',
      body: 'Produsele proprii completează serviciile atunci când contextul tehnic și comercial o cere.',
      cards: [
        { name: 'SEKNET', body: 'Monitorizare, securitate și control al infrastructurii, dintr-un singur loc.', href: '/solutii/seknet', linkLabel: 'Vezi SEKNET', Icon: ShieldCheck },
        { name: 'S-VPN', body: 'Acces remote sigur, administrat centralizat, integrat în politicile voastre.', href: '/solutii/s-vpn', linkLabel: 'Vezi S-VPN', Icon: Network },
      ],
    },
    cta: { heading: 'Aflați unde sunteți expuși, înainte să afle altcineva', body: 'Assessment-ul inițial clarifică riscurile prioritare, situația față de NIS 2 și pașii următori.' },
  },
  en: {
    title: 'Networking & Cybersecurity — Smart Control',
    description: 'We design, secure, and operate enterprise networks, hybrid cloud, and Kubernetes: SOC/NOC monitoring, penetration testing, NIS 2 compliance support, and OT security.',
    canonicalPath: '/en/servicii/securitate/',
    schemaName: 'Networking & Cybersecurity',
    schemaServiceType: ['Enterprise Networking', 'Network Security', 'Managed Security Operations', 'Penetration Testing', 'NIS 2 Compliance Support'],
    hero: { artwork: 'network-security',
      eyebrow: 'Networking & Cybersecurity',
      lead: 'A solid network.',
      accent: 'Security, operated.',
      body: 'We design, secure, and operate enterprise networks — from campus and data centre to branch offices, cloud, and OT. The team that builds the infrastructure is also responsible for monitoring it, under contractually agreed service levels.',
      secondary: 'View capabilities',
    },
    context: [
      { title: 'NIS 2 is law in Romania', body: 'Emergency Ordinance 155/2024 requires essential and important entities to register with DNSC, manage risk, and report incidents. Management carries direct responsibility.' },
      { title: 'The perimeter has left the office', body: 'Users work from anywhere and applications run in cloud and SaaS. The firewall at the edge no longer sees all the traffic.' },
      { title: 'IT and OT are now connected', body: 'Production lines, energy networks, and smart buildings are now targets reachable from the office network.' },
    ],
    flow: {
      eyebrow: 'NOC + SOC',
      heading: 'Availability and security, monitored by the same team',
      description: 'Many incidents start as a network anomaly: a saturated link, a device that reboots, new outbound traffic. When the NOC and SOC work apart, the signal can get lost between them. With us, the same team sees both pictures and acts on them.',
      caption: 'Coverage, triage and response times, and escalations are agreed contractually.',
      steps: [
        { label: 'Detect', title: 'Collect logs and telemetry', body: 'Logs, network telemetry, and alerts from security devices flow into SEKNET.' },
        { label: 'Triage', title: 'Separate noise from real incidents', body: 'The analyst confirms the incident and sets its priority within the agreed times.' },
        { label: 'Respond', title: 'Isolate, block, or escalate', body: 'Actions follow the playbook agreed with your team.' },
        { label: 'Report', title: 'Document the incident', body: 'You receive the incident report and support for notifying DNSC.' },
      ],
    },
    scope: {
      heading: 'Enterprise networks',
      body: 'Network infrastructure designed for availability and easy to operate — the foundation the rest of security builds on.',
      items: ['Campus LAN', 'Enterprise Wi-Fi', 'WAN and SD-WAN', 'Data centre networks', 'Load balancing', 'Network automation'],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'Nine capabilities, one accountable team',
      description: 'Contract them separately or as an integrated programme. Either way, you have a single point of contact for network and security.',
      items: [
        { title: 'Network & perimeter security', body: 'Control over what comes in, what goes out, and what moves between zones: next-generation firewall and IPS, segmentation, NAC, WAF and API protection, NDR.', items: ['Next-generation firewall and IPS', 'Segmentation and microsegmentation', 'Network access control (NAC)', 'Web Application Firewall and API protection', 'Network detection and response (NDR)'], Icon: Shield },
        { title: 'Zero Trust access & identity', body: 'Every access verified, wherever it comes from: ZTNA and SASE, remote access with S-VPN, MFA, Enterprise SSO, PKI, and PAM.', items: ['ZTNA and SASE', 'Secure remote access with S-VPN', 'MFA, Enterprise SSO and PKI', 'Privileged access management (PAM)'], Icon: KeyRound },
        { title: 'SOC & NOC', body: 'Availability and security monitoring, triage, and incident response following agreed playbooks, with unified visibility in SEKNET.', items: ['Monitoring and triage', 'Response following agreed playbooks', 'The SEKNET platform', 'Monthly reports for IT and management'], Icon: ScanSearch },
        { title: 'Data & endpoint protection', body: 'Data Leakage Prevention, EDR / XDR for workstations and servers, email security, encryption, and key management.', items: ['Data Leakage Prevention (DLP)', 'EDR / XDR', 'Email security', 'Encryption and key management'], Icon: DatabaseZap },
        { title: 'OT & industrial security', body: 'Protection for systems that cannot stop for a patch: OT asset inventory, IT / OT segmentation, and passive monitoring, aligned with IEC 62443.', items: ['OT asset inventory', 'IT / OT segmentation', 'Passive monitoring', 'Alignment with IEC 62443'], Icon: Factory },
        { title: 'Cloud & hybrid cloud', body: 'The same security rules in the data centre and in the cloud: hybrid connectivity, cloud segmentation, CSPM, and unified identity across on-premises, cloud, and SaaS.', items: ['Hybrid connectivity', 'Multi-cloud architectures', 'Cloud firewalling and segmentation', 'CSPM and workload protection', 'Unified identity'], Icon: Cloud },
        { title: 'Kubernetes & cloud-native', body: 'Networking, microsegmentation, and visibility for clusters with Cilium, Hubble, and Tetragon, from BGP to the data centre through to runtime security.', items: ['Cilium as CNI and Gateway API', 'L3–L7 policies between applications', 'Transparent node-to-node encryption', 'Flow visibility with Hubble', 'Runtime security with Tetragon'], Icon: Container },
        { title: 'Offensive testing', body: 'We find the gaps before attackers do: network, web application, and Wi-Fi penetration tests, vulnerability management, phishing simulations, and retesting after remediation.', items: ['Penetration testing', 'Vulnerability management', 'Phishing simulations', 'Retesting after remediation'], Icon: Crosshair },
        { title: 'Compliance & governance', body: 'Legal requirements turned into concrete measures: NIS 2, DORA, ISO 27001, and GDPR support, policies, risk analysis, response plans, and training.', items: ['NIS 2 compliance plan', 'DORA, ISO 27001 and GDPR support', 'Policies and risk analysis', 'Training for management and staff'], Icon: Scale },
      ],
    },
    proof: {
      heading: 'NIS 2 compliance without needless paperwork',
      body: 'Emergency Ordinance 155/2024 requires real technical measures, not just documents. Because we implement and operate those measures, your compliance plan can be executed, not just written.',
      items: [
        { title: 'Scoping', body: 'We check whether you are in scope, and whether as an essential or an important entity.', Icon: ListChecks },
        { title: 'Gap analysis', body: 'We compare the current state with the required risk-management measures.', Icon: ClipboardList },
        { title: 'Remediation plan', body: 'Priorities ordered by risk, effort, and budget.', Icon: Route },
        { title: 'Implementation', body: 'Segmentation, MFA, backup, monitoring, and incident response.', Icon: Wrench },
        { title: 'Evidence & audit', body: 'Documentation, management training, and preparation for the security audit.', Icon: FileCheck },
      ],
    },
    supporting: {
      eyebrow: 'Proprietary products',
      heading: 'SEKNET and S-VPN, built into the service',
      body: 'Our proprietary products complement the services when the technical and commercial context calls for them.',
      cards: [
        { name: 'SEKNET', body: 'Monitoring, security, and infrastructure control from a single place.', href: '/solutii/seknet', linkLabel: 'View SEKNET', Icon: ShieldCheck },
        { name: 'S-VPN', body: 'Secure, centrally managed remote access that fits your policies.', href: '/solutii/s-vpn', linkLabel: 'View S-VPN', Icon: Network },
      ],
    },
    cta: { heading: 'Find out where you are exposed, before someone else does', body: 'The initial assessment clarifies your priority risks, your NIS 2 position, and the next steps.' },
  },
};

const software: Record<Lang, ServicePageContent> = {
  ro: {
    title: 'Software & Automatizare — Smart Control',
    description: 'Dezvoltare software end-to-end: aplicații custom, DevSecOps, modernizare și automatizare cu AI, de la arhitectură la punerea în producție și suport.',
    canonicalPath: '/servicii/software/',
    schemaName: 'Software & Automatizare',
    schemaServiceType: ['Custom Software Development', 'DevOps', 'DevSecOps', 'Application Modernisation', 'AI Automation'],
    hero: { artwork: 'software-automation', eyebrow: 'Software & Automatizare', lead: 'Dezvoltare software', accent: 'end-to-end', body: 'De la arhitectura inițială până la punerea în producție: dezvoltare custom, DevSecOps, modernizare și automatizare cu AI, cu responsabilități clare pe întregul ciclu de livrare.', secondary: 'Vezi capabilitățile' },
    flow: {
      eyebrow: 'Ciclu de livrare',
      heading: 'Un traseu clar de la problemă la operare',
      description: 'Etapele și livrabilele se adaptează proiectului, dar punctele de control rămân explicite.',
      caption: 'Diagrama descrie un ciclu de livrare conceptual; tehnologiile, calendarul și criteriile de acceptanță se definesc pentru fiecare proiect.',
      steps: [
        { label: 'Clarificare', title: 'Definim problema și constrângerile', body: 'Obiectivele, utilizatorii, integrările și limitele operaționale devin criterii de lucru.' },
        { label: 'Construcție', title: 'Livrăm incremental', body: 'Arhitectura, codul și automatizările evoluează în pași verificabili, cu feedback regulat.' },
        { label: 'Validare', title: 'Testăm calitatea și securitatea', body: 'Controalele sunt alese pentru riscurile și cerințele stabilite, nu aplicate generic.' },
        { label: 'Operare', title: 'Predăm și susținem soluția', body: 'Documentația, accesul la cod și suportul sunt definite contractual pentru livrabilele aplicabile.' },
      ],
    },
    proof: {
      heading: 'Livrare software cu limite și responsabilități explicite',
      items: [
        { title: 'Acces la codul sursă', body: 'Pentru livrabilele software aplicabile, accesul la cod și documentație este definit contractual.', Icon: FileCode },
        { title: 'Indicatori agreați', body: 'Timpii, disponibilitatea și indicatorii relevanți sunt definiți explicit în contract.', Icon: Gauge },
        { title: 'Abordare consultativă', body: 'Arhitectura și prioritățile pornesc de la cerințele reale.', Icon: MessageSquare },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Cinci domenii de livrare',
      items: [
        { title: 'Dezvoltare software custom & API', body: 'Aplicații și integrări adaptate proceselor și sistemelor existente.', Icon: Code },
        { title: 'DevOps / DevSecOps & CI/CD', body: 'Fluxuri automatizate, testare și controale de securitate integrate.', Icon: GitBranch },
        { title: 'Migrare & modernizare aplicații', body: 'Refactoring, re-platforming și evoluția controlată a aplicațiilor existente.', Icon: Layers },
        { title: 'Automatizare cu AI / LLM', body: 'Automatizări pentru documente, raportare și asistență operațională.', Icon: Bot },
        { title: 'Consultanță & Staff Augmentation', body: 'Arhitectură, prioritizare și specialiști integrați în echipa clientului, cu niveluri de serviciu agreate contractual.', Icon: Users },
      ],
    },
    cta: { heading: 'Discutăm arhitectura și constrângerile proiectului', body: 'Clarificăm arhitectura, integrările și constrângerile. Livrabilele software aplicabile și predarea acestora sunt definite contractual.' },
  },
  en: {
    title: 'Software & Automation — Smart Control',
    description: 'End-to-end software delivery: custom applications, DevSecOps, modernisation, and AI automation from architecture through deployment and support.',
    canonicalPath: '/en/servicii/software/',
    schemaName: 'Software & Automation',
    schemaServiceType: ['Custom Software Development', 'DevOps', 'DevSecOps', 'Application Modernisation', 'AI Automation'],
    hero: { artwork: 'software-automation', eyebrow: 'Software & Automation', lead: 'End-to-end', accent: 'software delivery', body: 'From initial architecture to production deployment: custom development, DevSecOps, modernisation, and AI automation, with clear responsibilities across the delivery lifecycle.', secondary: 'View capabilities' },
    flow: {
      eyebrow: 'Delivery lifecycle',
      heading: 'A clear path from problem to operation',
      description: 'Stages and deliverables adapt to the project, while control points remain explicit.',
      caption: 'This diagram describes a conceptual delivery lifecycle; technologies, schedule, and acceptance criteria are defined for each project.',
      steps: [
        { label: 'Discover', title: 'Define the problem and constraints', body: 'Objectives, users, integrations, and operational limits become working criteria.' },
        { label: 'Build', title: 'Deliver incrementally', body: 'Architecture, code, and automation evolve through verifiable steps and regular feedback.' },
        { label: 'Validate', title: 'Test quality and security', body: 'Controls are selected for agreed risks and requirements rather than applied generically.' },
        { label: 'Operate', title: 'Hand over and support the solution', body: 'Documentation, source-code access, and support are defined contractually for applicable deliverables.' },
      ],
    },
    proof: {
      heading: 'Software delivery with explicit boundaries and responsibilities',
      items: [
        { title: 'Source-code access', body: 'For applicable software deliverables, access to source code and documentation is defined contractually.', Icon: FileCode },
        { title: 'Agreed indicators', body: 'Timelines, availability, and relevant indicators are explicitly defined in the contract.', Icon: Gauge },
        { title: 'Consultative approach', body: 'Architecture and priorities start from real requirements.', Icon: MessageSquare },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'Five delivery domains',
      items: [
        { title: 'Custom software development & APIs', body: 'Applications and integrations adapted to existing processes and systems.', Icon: Code },
        { title: 'DevOps / DevSecOps & CI/CD', body: 'Automated delivery, testing, and integrated security controls.', Icon: GitBranch },
        { title: 'Application migration & modernisation', body: 'Refactoring, re-platforming, and controlled evolution of existing applications.', Icon: Layers },
        { title: 'AI / LLM automation', body: 'Automation for document processing, reporting, and operational assistance.', Icon: Bot },
        { title: 'Consulting & Staff Augmentation', body: 'Architecture, prioritisation, and specialists integrated with the client team under contractually agreed service levels.', Icon: Users },
      ],
    },
    cta: { heading: 'Discuss your project architecture and constraints', body: 'We clarify architecture, integrations and constraints. Applicable software deliverables and their handover are defined contractually.' },
  },
};

const managed: Record<Lang, ServicePageContent> = {
  ro: {
    title: 'Servicii Gestionate — Smart Control',
    description: 'Servicii IT gestionate pentru service desk, infrastructură, rețea, securitate, suport cloud și automatizare, cu niveluri de serviciu contractuale.',
    canonicalPath: '/servicii/managed/',
    schemaName: 'Servicii Gestionate — Smart Control',
    schemaServiceType: 'Managed IT Services',
    hero: { artwork: 'managed-services', eyebrow: 'Servicii Gestionate', lead: 'Infrastructura ta,', accent: 'operată de echipa noastră.', body: 'Preluăm operarea, monitorizarea și securizarea infrastructurii IT, cu responsabilități și niveluri de serviciu definite contractual.', secondary: 'Vezi capabilitățile' },
    flow: {
      eyebrow: 'Model operațional',
      heading: 'Un ciclu comun pentru operare și îmbunătățire',
      description: 'Monitorizăm serviciile agreate, prioritizăm cererile, coordonăm intervențiile și raportăm rezultatele.',
      caption: 'Diagrama este un model de colaborare; instrumentele, acoperirea, timpii și escaladările sunt definite în acordul de servicii.',
      steps: [
        { label: 'Observare', title: 'Monitorizăm serviciile agreate', body: 'Sursele, intervalele și responsabilitățile sunt stabilite pentru mediul inclus în contract.' },
        { label: 'Prioritizare', title: 'Separăm urgențele de lucrul planificat', body: 'Evenimentele și cererile intră într-un flux comun de clasificare și escaladare.' },
        { label: 'Remediere', title: 'Executăm sau coordonăm intervenția', body: 'Acțiunile urmează limitele de acces, aprobările și nivelurile de serviciu convenite.' },
        { label: 'Îmbunătățire', title: 'Raportăm și ajustăm', body: 'Rezultatele operaționale susțin prioritizarea schimbărilor și a măsurilor preventive.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Ce acoperă serviciile Smart Control',
      items: [
        { title: 'Service Desk Outsourcing', body: 'Suport L1 / L2 / L3 pentru utilizatori și raportare, cu ținte contractuale de răspuns și rezolvare.', items: ['Suport L1 / L2 / L3', 'Niveluri de serviciu contractuale', 'Raportare'], Icon: Headset },
        { title: 'Managed Infrastructure Operations', body: 'Operarea și mentenanța proactive ale infrastructurii critice: monitorizare, actualizări, backup și recuperarea datelor.', items: ['Monitorizare', 'Patch management', 'Backup și recovery'], Icon: Server },
        { title: 'Network Managed Services', body: 'Operarea rețelei cu vizibilitate asupra traficului și incidentelor.', items: ['Disponibilitate', 'Gestionarea echipamentelor', 'Politici de acces'], Icon: Network },
        { title: 'Cyber Security Managed Services', body: 'Monitorizare, analiză și răspuns coordonat la incidente.', items: ['Evenimente de securitate', 'Răspuns la incidente', 'Rapoarte'], Icon: ShieldCheck },
        { title: 'Outsourced Systems Support', body: 'Asistență on-site și remote în limitele nivelurilor de serviciu agreate.', items: ['Intervenție on-site', 'Acces remote securizat', 'Documentație'], Icon: Wrench },
        { title: 'Cloud Based System Support', body: 'Operarea și optimizarea continuă a mediilor cloud.', items: ['Operațiuni cloud', 'Optimizarea resurselor', 'Suport pentru migrare'], Icon: Cloud },
        { title: 'Software Automation', body: 'Automatizarea proceselor repetitive, integrărilor și raportării.', items: ['Fluxuri automatizate', 'Integrări', 'Procesarea documentelor'], Icon: Bot },
      ],
    },
    supporting: {
      heading: 'Produse proprii pentru contexte de operare gestionată',
      body: 'SEKNET și S-VPN pot completa serviciile gestionate. Potrivirea și configurația se stabilesc după analiza mediului clientului.',
      cards: [
        { name: 'SEKNET', body: 'Produs proprietar pentru monitorizarea și protejarea mediilor IT.', href: '/solutii/seknet', linkLabel: 'Explorează SEKNET', Icon: ShieldCheck },
        { name: 'S-VPN', body: 'Produs proprietar pentru acces remote securizat.', href: '/solutii/s-vpn', linkLabel: 'Explorează S-VPN', Icon: Network },
      ],
    },
    cta: { heading: 'Clarificăm modelul operațional potrivit', body: 'Discutăm serviciile incluse, limitele de responsabilitate, escaladările și indicatorii care trebuie definiți contractual.' },
  },
  en: {
    title: 'Managed Services — Smart Control',
    description: 'Managed IT services for service desk, infrastructure, networks, security, cloud support, and automation under contractual service levels.',
    canonicalPath: '/en/servicii/managed/',
    schemaName: 'Managed Services — Smart Control',
    schemaServiceType: 'Managed IT Services',
    hero: { artwork: 'managed-services', eyebrow: 'Managed Services', lead: 'Your infrastructure,', accent: 'operated by our team.', body: 'We take over operation, monitoring, and security for IT infrastructure, with responsibilities and service levels defined contractually.', secondary: 'View capabilities' },
    flow: {
      eyebrow: 'Operating model',
      heading: 'One cycle for operations and improvement',
      description: 'We monitor agreed services, prioritise requests, coordinate interventions and report the results.',
      caption: 'This diagram is a collaboration model; tools, coverage, response targets, and escalations are defined in the service agreement.',
      steps: [
        { label: 'Observe', title: 'Monitor agreed services', body: 'Sources, intervals, and responsibilities are established for the environment included in the contract.' },
        { label: 'Prioritise', title: 'Separate urgency from planned work', body: 'Events and requests enter a shared classification and escalation flow.' },
        { label: 'Remediate', title: 'Execute or coordinate intervention', body: 'Actions follow agreed access limits, approvals, and service levels.' },
        { label: 'Improve', title: 'Report and adjust', body: 'Operational results support prioritisation of changes and preventive measures.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'What Smart Control services cover',
      items: [
        { title: 'Service Desk Outsourcing', body: 'L1 / L2 / L3 user support and reporting, with contractual response and resolution targets.', items: ['L1 / L2 / L3 support', 'Contractual service levels', 'Reporting'], Icon: Headset },
        { title: 'Managed Infrastructure Operations', body: 'Proactive operation and maintenance of critical infrastructure: monitoring, updates, backup and data recovery.', items: ['Monitoring', 'Patch management', 'Backup and recovery'], Icon: Server },
        { title: 'Network Managed Services', body: 'Network operation with visibility over traffic and incidents.', items: ['Availability', 'Equipment management', 'Access policies'], Icon: Network },
        { title: 'Cyber Security Managed Services', body: 'Coordinated security monitoring, analysis, and incident response.', items: ['Security events', 'Incident response', 'Reporting'], Icon: ShieldCheck },
        { title: 'Outsourced Systems Support', body: 'On-site and remote assistance within agreed service levels.', items: ['On-site intervention', 'Secure remote access', 'Documentation'], Icon: Wrench },
        { title: 'Cloud Based System Support', body: 'Continuous operation and optimisation of cloud environments.', items: ['Cloud operations', 'Resource optimisation', 'Migration support'], Icon: Cloud },
        { title: 'Software Automation', body: 'Automation of repetitive processes, integrations, and reporting.', items: ['Automated workflows', 'Integrations', 'Document processing'], Icon: Bot },
      ],
    },
    supporting: {
      heading: 'Proprietary products for managed-operation contexts',
      body: 'SEKNET and S-VPN can complement managed services. Product fit and configuration are defined after reviewing the client environment.',
      cards: [
        { name: 'SEKNET', body: 'A proprietary product for monitoring and protecting IT environments.', href: '/solutii/seknet', linkLabel: 'Explore SEKNET', Icon: ShieldCheck },
        { name: 'S-VPN', body: 'A proprietary product for secure remote access.', href: '/solutii/s-vpn', linkLabel: 'Explore S-VPN', Icon: Network },
      ],
    },
    cta: { heading: 'Clarify the right operating model', body: 'We discuss included services, responsibility boundaries, escalations, and the indicators to define contractually.' },
  },
};

export const servicePages: Record<ServicePageKey, Record<Lang, ServicePageContent>> = {
  security,
  software,
  managed,
};

export function getServicePage(key: ServicePageKey, lang: Lang): ServicePageContent {
  return servicePages[key][lang];
}
