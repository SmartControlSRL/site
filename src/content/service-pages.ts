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
    hero: { artwork: 'network-security',
      eyebrow: 'Networking & Security',
      lead: 'Monitorizăm rețeaua.',
      accent: 'Coordonăm răspunsul.',
      body: 'Acoperim protecția rețelei, prevenirea scurgerilor de date, securitatea identității și operațiuni de securitate gestionate, cu experiență în infrastructuri enterprise.',
      secondary: 'Vezi capabilitățile',
    },
    context: [
      { title: 'Suprafața de atac se extinde', body: 'Infrastructurile distribuite cer vizibilitate și politici coerente.' },
      { title: 'Răspunsul trebuie coordonat', body: 'Echipele au nevoie de informații clare pentru a prioritiza și trata incidentele.' },
    ],
    flow: {
      eyebrow: 'Flux operațional conceptual',
      heading: 'De la semnal la răspuns coordonat',
      description: 'Un model de lucru orientativ pentru structurarea deciziilor. Configurația reală este stabilită numai după analiza mediului clientului.',
      caption: 'Diagrama descrie etapele de colaborare, nu o topologie, o configurație de produs sau un timp de răspuns garantat.',
      steps: [
        { label: 'Detectare', title: 'Colectăm semnalele relevante', body: 'Sursele și nivelul de vizibilitate sunt selectate în funcție de mediul și responsabilitățile convenite.' },
        { label: 'Triere', title: 'Stabilim contextul și prioritatea', body: 'Evenimentele sunt analizate pentru a separa zgomotul operațional de situațiile care cer acțiune.' },
        { label: 'Răspuns', title: 'Coordonăm acțiunile agreate', body: 'Echipele urmează responsabilitățile, canalele de escaladare și indicatorii stabiliți contractual.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilități',
      heading: 'Șase domenii de Networking & Security',
      items: [
        { title: 'Data Leakage Prevention', body: 'Protecția datelor sensibile și vizibilitate asupra transferurilor.', items: ['Politici pentru date sensibile', 'Monitorizare și investigații', 'Rapoarte pentru audit și investigații'], Icon: DatabaseZap },
        { title: 'Acces remote securizat', body: 'Acces configurat în funcție de politicile și cerințele organizației.', items: ['Control centralizat al accesului', 'Autentificare consolidată', 'Politici adaptate rolurilor'], Icon: KeyRound },
        { title: 'Enterprise SSO & PKI', body: 'Control coerent al identității și accesului în infrastructuri enterprise.', items: ['Administrarea identităților', 'Single sign-on', 'Certificate și chei'], Icon: BadgeCheck },
        { title: 'Securitate perimetrală & endpoint', body: 'Protecție stratificată pentru rețele, stații și servere.', items: ['Politici de acces', 'Protecție endpoint', 'Evaluarea gap-urilor'], Icon: Shield },
        { title: 'Web Application Firewall', body: 'Protejarea aplicațiilor web în arhitectura de securitate existentă.', items: ['Protecție aplicații web', 'Reguli adaptate aplicației', 'Integrare controlată'], Icon: AppWindow },
        { title: 'Managed Security Operations', body: 'Monitorizare și răspuns coordonat la evenimente de securitate.', items: ['Monitorizare continuă', 'Analiză și investigație', 'Răspuns la incidente'], Icon: ScanSearch },
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
    hero: { artwork: 'network-security',
      eyebrow: 'Networking & Security',
      lead: 'We monitor the network.',
      accent: 'We coordinate the response.',
      body: 'We cover network protection, data leakage prevention, identity security, and managed security operations, with experience in enterprise infrastructure.',
      secondary: 'View capabilities',
    },
    context: [
      { title: 'The attack surface is expanding', body: 'Distributed infrastructure requires visibility and consistent policies.' },
      { title: 'Response must be coordinated', body: 'Teams need clear information to prioritise and handle incidents.' },
    ],
    flow: {
      eyebrow: 'Conceptual operating flow',
      heading: 'From signal to coordinated response',
      description: 'An indicative working model for structuring decisions. The actual configuration is defined only after reviewing the client environment.',
      caption: 'This diagram describes collaboration stages, not a topology, product configuration, or guaranteed response time.',
      steps: [
        { label: 'Detect', title: 'Collect relevant signals', body: 'Sources and visibility are selected for the environment and the agreed responsibilities.' },
        { label: 'Triage', title: 'Establish context and priority', body: 'Events are analysed to separate operational noise from situations that require action.' },
        { label: 'Respond', title: 'Coordinate agreed actions', body: 'Teams follow the responsibilities, escalation paths, and indicators defined contractually.' },
      ],
    },
    capabilities: {
      eyebrow: 'Capabilities',
      heading: 'Six Networking & Security domains',
      items: [
        { title: 'Data Leakage Prevention', body: 'Sensitive-data protection and visibility over transfers.', items: ['Sensitive-data policies', 'Monitoring and investigation', 'Audit and investigation reporting'], Icon: DatabaseZap },
        { title: 'Secure remote access', body: 'Access configured for organisational policies and requirements.', items: ['Centralised access control', 'Stronger authentication', 'Role-based policies'], Icon: KeyRound },
        { title: 'Enterprise SSO & PKI', body: 'Consistent identity and access control for enterprise infrastructure.', items: ['Identity administration', 'Single sign-on', 'Certificates and keys'], Icon: BadgeCheck },
        { title: 'Perimeter & endpoint security', body: 'Layered protection for networks, workstations, and servers.', items: ['Access policies', 'Endpoint protection', 'Gap assessment'], Icon: Shield },
        { title: 'Web Application Firewall', body: 'Web application protection integrated into the existing security architecture.', items: ['Web application protection', 'Application-aware rules', 'Controlled integration'], Icon: AppWindow },
        { title: 'Managed Security Operations', body: 'Coordinated monitoring and response for security events.', items: ['Continuous monitoring', 'Analysis and investigation', 'Incident response'], Icon: ScanSearch },
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
    description: 'Dezvoltare software end-to-end: aplicații custom, DevSecOps, modernizare și automatizare cu AI, de la arhitectură la deployment și suport.',
    canonicalPath: '/servicii/software/',
    schemaName: 'Software & Automatizare',
    schemaServiceType: ['Custom Software Development', 'DevOps', 'DevSecOps', 'Application Modernisation', 'AI Automation'],
    hero: { artwork: 'software-automation', eyebrow: 'Software & Automatizare', lead: 'Dezvoltare software', accent: 'end-to-end', body: 'De la arhitectura inițială până la deployment în producție: dezvoltare custom, DevSecOps, modernizare și automatizare cu AI, cu responsabilități clare pe întregul ciclu de livrare.', secondary: 'Vezi capabilitățile' },
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
      body: 'Angajamentele comerciale și tehnice se stabilesc contractual pentru proiectul concret.',
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
    cta: { heading: 'Discutăm arhitectura și constrângerile proiectului', body: 'Clarificăm arhitectura, integrările și constrângerile, cu livrabilele software aplicabile și handover-ul definite contractual.' },
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
        { label: 'Operate', title: 'Handover and support the solution', body: 'Documentation, source-code access, and support are defined contractually for applicable deliverables.' },
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
      heading: 'Five delivery domains',
      items: [
        { title: 'Custom software development & APIs', body: 'Applications and integrations adapted to existing processes and systems.', Icon: Code },
        { title: 'DevOps / DevSecOps & CI/CD', body: 'Automated delivery, testing, and integrated security controls.', Icon: GitBranch },
        { title: 'Application migration & modernisation', body: 'Refactoring, re-platforming, and controlled evolution of existing applications.', Icon: Layers },
        { title: 'AI / LLM automation', body: 'Automation for document processing, reporting, and operational assistance.', Icon: Bot },
        { title: 'Consulting & Staff Augmentation', body: 'Architecture, prioritisation, and specialists integrated with the client team under contractually agreed service levels.', Icon: Users },
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
    hero: { artwork: 'managed-services', eyebrow: 'Servicii Gestionate', lead: 'Infrastructura ta,', accent: 'operată de echipa noastră.', body: 'Preluăm operarea, monitorizarea și securizarea infrastructurii IT, cu responsabilități și niveluri de serviciu definite contractual.', secondary: 'Vezi capabilitățile' },
    flow: {
      eyebrow: 'Model operațional',
      heading: 'Un ciclu comun pentru operare și îmbunătățire',
      description: 'Capabilitățile sunt grupate într-un model operațional clar, configurat în jurul responsabilităților agreate.',
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
        { title: 'Service Desk Outsourcing', body: 'Suport pentru utilizatori cu ținte contractuale de răspuns și rezolvare.', items: ['Suport L1 / L2 / L3', 'Niveluri de serviciu contractuale', 'Raportare'], Icon: Headset },
        { title: 'Managed Infrastructure Operations', body: 'Operarea și mentenanța proactive ale infrastructurii critice.', items: ['Monitorizare', 'Patch management', 'Backup și recovery'], Icon: Server },
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
    cta: { heading: 'Clarificăm modelul operațional potrivit', body: 'Discutăm serviciile incluse, limitele de responsabilitate, escaladările și indicatorii care trebuie definiți contractual. Contactul rămâne disponibil direct prin email.' },
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
      description: 'Capabilities are grouped into a clear operating model configured around agreed responsibilities.',
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
        { title: 'Service Desk Outsourcing', body: 'User support with contractual response and resolution targets.', items: ['L1 / L2 / L3 support', 'Contractual service levels', 'Reporting'], Icon: Headset },
        { title: 'Managed Infrastructure Operations', body: 'Proactive operation and maintenance of critical infrastructure.', items: ['Monitoring', 'Patch management', 'Backup and recovery'], Icon: Server },
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
