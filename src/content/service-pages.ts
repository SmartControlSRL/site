import {
  AppWindow,
  BadgeCheck,
  Bot,
  Cloud,
  Code,
  DatabaseZap,
  FileCode,
  Gauge,
  GitBranch,
  Headset,
  KeyRound,
  Layers,
  MessageSquare,
  Network,
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

export type ServicePageKey = 'security' | 'software' | 'managed';
export type ServiceArtwork = 'architecture-light' | 'network-security' | 'software-automation' | 'managed-services';

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
    items: Capability[];
  };
  proof?: {
    heading: string;
    body: string;
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
    title: 'Networking & Security — Smart Control',
    description: 'Networking & Security pentru protecția rețelei, prevenirea scurgerilor de date, securitatea identității și operațiuni de securitate gestionate.',
    canonicalPath: '/servicii/securitate/',
    schemaName: 'Networking & Security',
    schemaServiceType: 'Enterprise Networking and Security Services',
    hero: {
      artwork: 'network-security',
      eyebrow: 'Networking & Security',
      lead: 'Securitate pentru',
      accent: 'rețele, date și acces.',
      body: 'Implementăm măsuri de protecție pentru rețele și date, administrăm identitățile și accesul și coordonăm monitorizarea și răspunsul la incidente.',
      secondary: 'Vezi serviciile',
    },
    context: [
      { title: 'Suprafața de atac se extinde', body: 'Infrastructurile distribuite cer vizibilitate și politici coerente.' },
      { title: 'Răspunsul trebuie coordonat', body: 'Echipele au nevoie de informații clare pentru a prioritiza și trata incidentele.' },
    ],
    flow: {
      eyebrow: 'Cum lucrăm',
      heading: 'Cum tratăm evenimentele de securitate',
      description: 'Stabilim ce monitorizăm, cum prioritizăm evenimentele și cine intervine.',
      caption: 'Etape orientative. Acoperirea, responsabilitățile și timpii de răspuns se stabilesc prin contract.',
      steps: [
        { label: 'Detectare', title: 'Colectăm evenimentele', body: 'Stabilim sursele de date și sistemele care vor fi monitorizate.' },
        { label: 'Triere', title: 'Stabilim contextul și prioritatea', body: 'Analizăm evenimentele și identificăm situațiile care necesită intervenție.' },
        { label: 'Răspuns', title: 'Coordonăm acțiunile agreate', body: 'Intervenim și implicăm echipele necesare, conform responsabilităților și procedurilor agreate.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Ce putem implementa și administra',
      items: [
        { title: 'Data Leakage Prevention', body: 'Definim politici pentru protejarea datelor sensibile și monitorizarea transferurilor.', items: ['Politici pentru date sensibile', 'Monitorizare și investigații', 'Rapoarte pentru audit și investigații'], Icon: DatabaseZap },
        { title: 'Acces remote securizat', body: 'Configurăm accesul utilizatorilor la resursele organizației, pe baza rolurilor și politicilor interne.', items: ['Control centralizat al accesului', 'Autentificare consolidată', 'Politici adaptate rolurilor'], Icon: KeyRound },
        { title: 'Enterprise SSO & PKI', body: 'Administrăm identități, autentificare unică, certificate și chei.', items: ['Administrarea identităților', 'Single sign-on', 'Certificate și chei'], Icon: BadgeCheck },
        { title: 'Securitate perimetrală & endpoint', body: 'Configurăm protecția rețelelor, stațiilor de lucru și serverelor.', items: ['Politici de acces', 'Protecție endpoint', 'Evaluarea gap-urilor'], Icon: Shield },
        { title: 'Web Application Firewall', body: 'Configurăm reguli de protecție pentru aplicațiile web și le integrăm cu sistemele existente.', items: ['Protecție aplicații web', 'Reguli adaptate aplicației', 'Integrare controlată'], Icon: AppWindow },
        { title: 'Managed Security Operations', body: 'Monitorizăm evenimentele de securitate, le analizăm și coordonăm intervențiile.', items: ['Monitorizare continuă', 'Analiză și investigație', 'Răspuns la incidente'], Icon: ScanSearch },
      ],
    },
    supporting: {
      eyebrow: 'Livrare coordonată',
      heading: 'Securitate integrată cu infrastructura și operarea',
      body: 'Produsele proprii pot completa serviciile numai după validarea contextului tehnic și comercial.',
      cards: [{ name: 'SEKNET', body: 'Produs proprietar pentru monitorizarea și protejarea mediilor IT, configurat pentru contextul organizației.', href: '/solutii/seknet', linkLabel: 'Descoperă SEKNET', Icon: ShieldCheck }],
    },
    cta: { heading: 'Evaluăm arhitectura de securitate', body: 'Assessment-ul inițial clarifică prioritățile tehnice, responsabilitățile și pașii următori.' },
  },
  en: {
    title: 'Networking & Security — Smart Control',
    description: 'Networking & Security for network protection, data leakage prevention, identity security, and managed security operations.',
    canonicalPath: '/en/servicii/securitate/',
    schemaName: 'Networking & Security',
    schemaServiceType: 'Enterprise Networking and Security Services',
    hero: {
      artwork: 'network-security',
      eyebrow: 'Networking & Security',
      lead: 'Security for',
      accent: 'networks, data and access.',
      body: 'We implement network and data protection, manage identities and access, and coordinate security monitoring and incident response.',
      secondary: 'View services',
    },
    context: [
      { title: 'The attack surface is expanding', body: 'Distributed infrastructure requires visibility and consistent policies.' },
      { title: 'Response must be coordinated', body: 'Teams need clear information to prioritise and handle incidents.' },
    ],
    flow: {
      eyebrow: 'How we work',
      heading: 'How we handle security events',
      description: 'We agree what to monitor, how to prioritise events and who will respond.',
      caption: 'Indicative stages. Coverage, responsibilities and response times are defined in the contract.',
      steps: [
        { label: 'Detect', title: 'Collect events', body: 'We agree the data sources and systems to be monitored.' },
        { label: 'Triage', title: 'Establish context and priority', body: 'We analyse events and identify situations that need intervention.' },
        { label: 'Respond', title: 'Coordinate agreed actions', body: 'We respond and involve the relevant teams, following the agreed responsibilities and procedures.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'What we can implement and manage',
      items: [
        { title: 'Data Leakage Prevention', body: 'We define policies to protect sensitive data and monitor transfers.', items: ['Sensitive-data policies', 'Monitoring and investigation', 'Audit and investigation reporting'], Icon: DatabaseZap },
        { title: 'Secure remote access', body: 'We configure access to organisational resources based on user roles and internal policies.', items: ['Centralised access control', 'Stronger authentication', 'Role-based policies'], Icon: KeyRound },
        { title: 'Enterprise SSO & PKI', body: 'We manage identities, single sign-on, certificates and keys.', items: ['Identity administration', 'Single sign-on', 'Certificates and keys'], Icon: BadgeCheck },
        { title: 'Perimeter & endpoint security', body: 'We configure protection for networks, workstations and servers.', items: ['Access policies', 'Endpoint protection', 'Gap assessment'], Icon: Shield },
        { title: 'Web Application Firewall', body: 'We configure web application protection rules and integrate them with existing systems.', items: ['Web application protection', 'Application-aware rules', 'Controlled integration'], Icon: AppWindow },
        { title: 'Managed Security Operations', body: 'We monitor security events, analyse them and coordinate the response.', items: ['Continuous monitoring', 'Analysis and investigation', 'Incident response'], Icon: ScanSearch },
      ],
    },
    supporting: {
      eyebrow: 'Coordinated delivery',
      heading: 'Security integrated with infrastructure and operations',
      body: 'Proprietary products can complement services only after technical and commercial context is validated.',
      cards: [{ name: 'SEKNET', body: 'A proprietary product for monitoring and protecting IT environments, configured for the organisation’s context.', href: '/solutii/seknet', linkLabel: 'Discover SEKNET', Icon: ShieldCheck }],
    },
    cta: { heading: 'Assess your security architecture', body: 'The initial assessment clarifies technical priorities, responsibilities, and next steps.' },
  },
};

const software: Record<Lang, ServicePageContent> = {
  ro: {
    title: 'Software & Automatizare — Smart Control',
    description: 'Dezvoltare de aplicații custom, integrări API, DevSecOps și automatizare pentru documente și raportare. Arhitectură, testare, deployment și suport.',
    canonicalPath: '/servicii/software/',
    schemaName: 'Software & Automatizare',
    schemaServiceType: ['Custom Software Development', 'DevOps', 'DevSecOps', 'Application Modernisation', 'AI Automation'],
    hero: { artwork: 'software-automation', eyebrow: 'Software & Automatizare', lead: 'Dezvoltare software', accent: 'și automatizare.', body: 'Dezvoltăm aplicații, conectăm sistemele existente și automatizăm procese. Acoperim arhitectura, testarea, deployment-ul și suportul.', secondary: 'Vezi serviciile' },
    flow: {
      eyebrow: 'Ciclu de livrare',
      heading: 'Cum lucrăm la un proiect software',
      description: 'Stabilim cerințele cu echipa ta, dezvoltăm în etape și testăm înainte de lansare.',
      caption: 'Etape orientative. Calendarul, livrabilele și criteriile de acceptanță se stabilesc pentru fiecare proiect.',
      steps: [
        { label: 'Clarificare', title: 'Definim problema și constrângerile', body: 'Stabilim cine va folosi aplicația, ce trebuie să facă și cu ce sisteme se va conecta.' },
        { label: 'Dezvoltare', title: 'Dezvoltăm în etape', body: 'Construim și testăm funcționalitățile pe rând, cu feedback din partea echipei tale.' },
        { label: 'Validare', title: 'Testăm calitatea și securitatea', body: 'Verificăm funcționalitățile, integrările și cerințele de securitate agreate.' },
        { label: 'Operare', title: 'Predăm aplicația și stabilim suportul', body: 'Documentația, accesul la cod și suportul sunt definite contractual pentru livrabilele aplicabile.' },
      ],
    },
    proof: {
      heading: 'Livrare software cu limite și responsabilități explicite',
      body: 'Angajamentele comerciale și tehnice se stabilesc contractual pentru proiectul concret.',
      items: [
        { title: 'Acces la codul sursă', body: 'Pentru livrabilele software aplicabile, accesul la cod și documentație este definit contractual.', Icon: FileCode },
        { title: 'Indicatori agreați', body: 'Timpii, disponibilitatea și indicatorii relevanți sunt definiți explicit în contract.', Icon: Gauge },
        { title: 'Abordare consultativă', body: 'Arhitectura și prioritățile pornesc de la cerințele reale.', Icon: MessageSquare },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Servicii de dezvoltare software',
      items: [
        { title: 'Dezvoltare software custom & API', body: 'Aplicații și integrări adaptate proceselor și sistemelor existente.', Icon: Code },
        { title: 'DevOps / DevSecOps & CI/CD', body: 'Fluxuri automatizate, testare și controale de securitate integrate.', Icon: GitBranch },
        { title: 'Migrare & modernizare aplicații', body: 'Refactoring și re-platforming pentru adaptarea aplicațiilor existente.', Icon: Layers },
        { title: 'Automatizare cu AI / LLM', body: 'Automatizări pentru documente, raportare și asistență operațională.', Icon: Bot },
        { title: 'Consultanță & Staff Augmentation', body: 'Consultanță de arhitectură și specialiști care lucrează cu echipa ta, în condițiile agreate contractual.', Icon: Users },
      ],
    },
    cta: { heading: 'Discutăm arhitectura și constrângerile proiectului', body: 'Clarificăm arhitectura, integrările și constrângerile, cu livrabilele software aplicabile și handover-ul definite contractual.' },
  },
  en: {
    title: 'Software & Automation — Smart Control',
    description: 'Custom applications, API integration, DevSecOps and automation for documents and reporting. Architecture, testing, deployment and support.',
    canonicalPath: '/en/servicii/software/',
    schemaName: 'Software & Automation',
    schemaServiceType: ['Custom Software Development', 'DevOps', 'DevSecOps', 'Application Modernisation', 'AI Automation'],
    hero: { artwork: 'software-automation', eyebrow: 'Software & Automation', lead: 'Software development', accent: 'and automation.', body: 'We develop applications, connect existing systems and automate processes. Our work covers architecture, testing, deployment and support.', secondary: 'View services' },
    flow: {
      eyebrow: 'Delivery lifecycle',
      heading: 'How we work on a software project',
      description: 'We agree requirements with your team, develop in stages and test before launch.',
      caption: 'Indicative stages. The schedule, deliverables and acceptance criteria are agreed for each project.',
      steps: [
        { label: 'Discover', title: 'Define the problem and constraints', body: 'We establish who will use the application, what it needs to do and which systems it will connect to.' },
        { label: 'Build', title: 'Develop in stages', body: 'We build and test features in stages, with feedback from your team.' },
        { label: 'Validate', title: 'Test quality and security', body: 'We check features, integrations and the agreed security requirements.' },
        { label: 'Operate', title: 'Hand over the application and agree support', body: 'Documentation, source-code access, and support are defined contractually for applicable deliverables.' },
      ],
    },
    proof: {
      heading: 'Software delivery with explicit boundaries and responsibilities',
      body: 'Commercial and technical commitments are defined contractually for the specific project.',
      items: [
        { title: 'Source-code access', body: 'For applicable software deliverables, access to source code and documentation is defined contractually.', Icon: FileCode },
        { title: 'Agreed indicators', body: 'Timelines, availability, and relevant indicators are explicitly defined in the contract.', Icon: Gauge },
        { title: 'Consultative approach', body: 'Architecture and priorities start from real requirements.', Icon: MessageSquare },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'Software development services',
      items: [
        { title: 'Custom software development & APIs', body: 'Applications and integrations adapted to existing processes and systems.', Icon: Code },
        { title: 'DevOps / DevSecOps & CI/CD', body: 'Automated delivery, testing, and integrated security controls.', Icon: GitBranch },
        { title: 'Application migration & modernisation', body: 'Refactoring and re-platforming to adapt existing applications.', Icon: Layers },
        { title: 'AI / LLM automation', body: 'Automation for document processing, reporting, and operational assistance.', Icon: Bot },
        { title: 'Consulting & Staff Augmentation', body: 'Architecture advice and specialists working with your team under the agreed contract terms.', Icon: Users },
      ],
    },
    cta: { heading: 'Discuss your project architecture and constraints', body: 'We clarify architecture, integrations, and constraints, with applicable software deliverables and handover defined contractually.' },
  },
};

const managed: Record<Lang, ServicePageContent> = {
  ro: {
    title: 'Servicii Gestionate — Smart Control',
    description: 'Servicii IT gestionate pentru service desk, infrastructură, rețea, securitate, suport cloud și automatizare, cu niveluri de serviciu contractuale.',
    canonicalPath: '/servicii/managed/',
    schemaName: 'Servicii Gestionate — Smart Control',
    schemaServiceType: 'Managed IT Services',
    hero: { artwork: 'managed-services', eyebrow: 'Servicii Gestionate', lead: 'Administrare și suport', accent: 'pentru echipa ta IT.', body: 'Monitorizăm și administrăm sistemele IT și preluăm solicitările de suport. Serviciile incluse și nivelurile de serviciu se stabilesc prin contract.', secondary: 'Vezi serviciile' },
    flow: {
      eyebrow: 'Model operațional',
      heading: 'Cum organizăm administrarea și suportul',
      description: 'Stabilim ce sisteme preluăm, cum tratăm solicitările și când implicăm echipa ta.',
      caption: 'Etape orientative. Sistemele acoperite, timpii de răspuns și procedurile de escaladare sunt definite în acordul de servicii.',
      steps: [
        { label: 'Observare', title: 'Monitorizăm serviciile agreate', body: 'Urmărim sistemele și serviciile incluse în contract, la intervalele stabilite.' },
        { label: 'Prioritizare', title: 'Prioritizăm solicitările', body: 'Clasificăm incidentele și cererile de suport și stabilim ordinea intervențiilor.' },
        { label: 'Remediere', title: 'Intervenim și coordonăm echipele', body: 'Acțiunile urmează limitele de acces, aprobările și nivelurile de serviciu convenite.' },
        { label: 'Îmbunătățire', title: 'Raportăm și ajustăm', body: 'Analizăm incidentele și lucrările efectuate, apoi propunem măsuri preventive.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Servicii de administrare și suport',
      items: [
        { title: 'Service desk', body: 'Preluăm cererile utilizatorilor și urmărim răspunsul și rezolvarea lor.', items: ['Suport L1 / L2 / L3', 'Niveluri de serviciu contractuale', 'Raportare'], Icon: Headset },
        { title: 'Administrarea infrastructurii', body: 'Monitorizare, patch management, backup și recovery pentru infrastructura IT.', items: ['Monitorizare', 'Patch management', 'Backup și recovery'], Icon: Server },
        { title: 'Administrarea rețelei', body: 'Operarea rețelei cu vizibilitate asupra traficului și incidentelor.', items: ['Disponibilitate', 'Gestionarea echipamentelor', 'Politici de acces'], Icon: Network },
        { title: 'Operațiuni de securitate', body: 'Monitorizare, analiză și răspuns coordonat la incidente.', items: ['Evenimente de securitate', 'Răspuns la incidente', 'Rapoarte'], Icon: ShieldCheck },
        { title: 'Suport on-site și remote', body: 'Intervenții on-site și asistență remote pentru utilizatori și sisteme.', items: ['Intervenție on-site', 'Acces remote securizat', 'Documentație'], Icon: Wrench },
        { title: 'Administrare cloud', body: 'Administrăm mediile cloud și ajustăm resursele în funcție de utilizare.', items: ['Operațiuni cloud', 'Optimizarea resurselor', 'Suport pentru migrare'], Icon: Cloud },
        { title: 'Automatizarea operațiunilor', body: 'Automatizarea proceselor repetitive, integrărilor și raportării.', items: ['Fluxuri automatizate', 'Integrări', 'Procesarea documentelor'], Icon: Bot },
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
    cta: { heading: 'Clarificăm modelul operațional potrivit', body: 'Discutăm serviciile incluse, limitele de responsabilitate, escaladările și indicatorii care trebuie definiți contractual. Contactul rămâne disponibil direct prin email.' },
  },
  en: {
    title: 'Managed Services — Smart Control',
    description: 'Managed IT services for service desk, infrastructure, networks, security, cloud support, and automation under contractual service levels.',
    canonicalPath: '/en/servicii/managed/',
    schemaName: 'Managed Services — Smart Control',
    schemaServiceType: 'Managed IT Services',
    hero: { artwork: 'managed-services', eyebrow: 'Managed Services', lead: 'Management and support', accent: 'for your IT team.', body: 'We monitor and manage IT systems and handle support requests. Included services and service levels are defined in the contract.', secondary: 'View services' },
    flow: {
      eyebrow: 'Operating model',
      heading: 'How we organise management and support',
      description: 'We agree which systems to manage, how to handle requests and when to involve your team.',
      caption: 'Indicative stages. Covered systems, response times and escalation procedures are defined in the service agreement.',
      steps: [
        { label: 'Observe', title: 'Monitor agreed services', body: 'We monitor the systems and services included in the contract at the agreed intervals.' },
        { label: 'Prioritise', title: 'Prioritise requests', body: 'We classify incidents and support requests and decide the order of response.' },
        { label: 'Remediate', title: 'Respond and coordinate teams', body: 'Actions follow agreed access limits, approvals, and service levels.' },
        { label: 'Improve', title: 'Report and adjust', body: 'We review incidents and completed work, then recommend preventive measures.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'Management and support services',
      items: [
        { title: 'Service desk', body: 'We handle user requests and track their response and resolution.', items: ['L1 / L2 / L3 support', 'Contractual service levels', 'Reporting'], Icon: Headset },
        { title: 'Infrastructure management', body: 'Monitoring, patch management, backup and recovery for IT infrastructure.', items: ['Monitoring', 'Patch management', 'Backup and recovery'], Icon: Server },
        { title: 'Network management', body: 'Network operation with visibility over traffic and incidents.', items: ['Availability', 'Equipment management', 'Access policies'], Icon: Network },
        { title: 'Security operations', body: 'Coordinated security monitoring, analysis, and incident response.', items: ['Security events', 'Incident response', 'Reporting'], Icon: ShieldCheck },
        { title: 'On-site and remote support', body: 'On-site and remote assistance for users and systems.', items: ['On-site intervention', 'Secure remote access', 'Documentation'], Icon: Wrench },
        { title: 'Cloud management', body: 'We manage cloud environments and adjust resources based on usage.', items: ['Cloud operations', 'Resource optimisation', 'Migration support'], Icon: Cloud },
        { title: 'Operations automation', body: 'Automation of repetitive processes, integrations, and reporting.', items: ['Automated workflows', 'Integrations', 'Document processing'], Icon: Bot },
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
    cta: { heading: 'Clarify the right operating model', body: 'We discuss included services, responsibility boundaries, escalations, and the indicators to define contractually. Direct email contact remains visible and available.' },
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
