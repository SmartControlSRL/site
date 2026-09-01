import { Code, Server, Settings2, ShieldCheck } from '@lucide/astro';
import type { Lang } from '../i18n/ui';
import type { FlowStep } from '../components/RouteFlowVisual.astro';

type IconComponent = typeof Server;

export interface ServicePillar {
  index: string;
  title: string;
  href: string;
  body: string;
  items: string[];
  linkLabel: string;
  Icon: IconComponent;
}

export interface ServicesHubContent {
  title: string;
  description: string;
  schemaName: string;
  hero: { eyebrow: string; lead: string; accent: string; body: string; primary: string; secondary: string };
  portfolio: { eyebrow: string; heading: string; body: string };
  pillars: ServicePillar[];
  process: { eyebrow: string; heading: string; description: string; caption: string; steps: FlowStep[] };
  cta: { heading: string; body: string };
}

export interface ProductSummary {
  name: string;
  description: string;
  href: string;
  linkLabel: string;
  suitedFor: string;
}

export interface SolutionsHubContent {
  title: string;
  description: string;
  hero: { eyebrow: string; lead: string; accent: string; body: string };
  productsHeading: string;
  productsBody: string;
  products: ProductSummary[];
  principles: { eyebrow: string; heading: string; body: string; items: Array<{ title: string; body: string }> };
  cta: { heading: string; body: string };
}

export const servicesHub: Record<Lang, ServicesHubContent> = {
  ro: {
    title: 'Servicii IT Enterprise — Smart Control',
    description: 'Portofoliu integrat de servicii IT: Infrastructură & Cloud, Networking & Security, Software & Automatizare și Servicii Gestionate.',
    schemaName: 'Servicii Smart Control',
    hero: {
      eyebrow: 'Servicii',
      lead: 'Un portofoliu integrat,',
      accent: 'de la infrastructură până la aplicații.',
      body: 'Patru piloni de servicii coordonați într-un cadru comun. Abordarea este consultativă, iar limitele de livrare și responsabilitățile sunt definite pentru fiecare proiect.',
      primary: 'Solicită assessment',
      secondary: 'Explorează pilonii',
    },
    portfolio: {
      eyebrow: 'Portofoliu',
      heading: 'Patru piloni de servicii enterprise',
      body: 'Infrastructura, securitatea, software-ul și operarea pot fi abordate separat sau coordonate într-un program comun.',
    },
    pillars: [
      { index: '01', title: 'Infrastructură & Cloud', href: '/servicii/cloud', body: 'Proiectare, consolidare și modernizare pentru infrastructuri hibride și cloud.', items: ['Data Center Design & Implementation', 'Consolidare & Virtualizare', 'Private & Hybrid Cloud', 'Business Continuity & Disaster Recovery'], linkLabel: 'Explorează Cloud', Icon: Server },
      { index: '02', title: 'Networking & Security', href: '/servicii/securitate', body: 'Protecție pentru rețea, identitate, aplicații și operațiuni de securitate.', items: ['Perimeter & Endpoint Security', 'Enterprise SSO / PKI', 'Monitorizare și raportare', 'Managed Security Operations'], linkLabel: 'Explorează Security', Icon: ShieldCheck },
      { index: '03', title: 'Software & Automatizare', href: '/servicii/software', body: 'Aplicații custom, modernizare, DevSecOps și automatizări adaptate proceselor existente.', items: ['Custom software & API', 'DevOps / DevSecOps & CI/CD', 'Modernizare aplicații', 'Automatizare cu AI / LLM'], linkLabel: 'Explorează Software', Icon: Code },
      { index: '04', title: 'Servicii Gestionate', href: '/servicii/managed', body: 'Operare continuă pentru infrastructură, aplicații și utilizatori, în limite contractuale clare.', items: ['Managed Infrastructure', 'Service Desk', 'Managed Security', 'Cloud Support'], linkLabel: 'Explorează serviciile gestionate', Icon: Settings2 },
    ],
    process: {
      eyebrow: 'Cadru de livrare',
      heading: 'Un parcurs compact, cu decizii verificabile',
      description: 'În locul unei liste repetitive de promisiuni, proiectele urmează trei puncte de control care clarifică responsabilitatea și rezultatul.',
      caption: 'Fiecare etapă produce o decizie sau un livrabil convenit; domeniul, calendarul și criteriile de acceptanță rămân specifice proiectului.',
      steps: [
        { label: 'Context', title: 'Măsurăm și delimităm', body: 'Clarificăm mediul, obiectivele, riscurile și responsabilitățile înainte de a propune soluția.' },
        { label: 'Plan', title: 'Prioritizăm și proiectăm', body: 'Transformăm constatările într-un plan cu livrabile, dependențe și criterii de acceptanță.' },
        { label: 'Livrare', title: 'Implementăm și predăm', body: 'Executăm în pași verificabili, documentăm și stabilim operarea sau suportul ulterior.' },
      ],
    },
    cta: { heading: 'Un assessment care clarifică punctul de pornire', body: 'Analizăm infrastructura, securitatea, aplicațiile și operarea curentă, apoi recomandăm primul pas cu limite și livrabile clare.' },
  },
  en: {
    title: 'Enterprise IT Services — Smart Control',
    description: 'Integrated IT services portfolio: Infrastructure & Cloud, Networking & Security, Software & Automation, and Managed Services.',
    schemaName: 'Smart Control Services',
    hero: {
      eyebrow: 'Services',
      lead: 'An integrated portfolio,',
      accent: 'from infrastructure to applications.',
      body: 'Four service pillars coordinated within one delivery framework. The approach is consultative, with delivery boundaries and responsibilities defined for each project.',
      primary: 'Request an assessment',
      secondary: 'Explore the pillars',
    },
    portfolio: {
      eyebrow: 'Portfolio',
      heading: 'Four enterprise service pillars',
      body: 'Infrastructure, security, software, and operations can be addressed independently or coordinated within one programme.',
    },
    pillars: [
      { index: '01', title: 'Infrastructure & Cloud', href: '/servicii/cloud', body: 'Design, consolidation, and modernisation for hybrid and cloud infrastructure.', items: ['Data Center Design & Implementation', 'Consolidation & Virtualisation', 'Private & Hybrid Cloud', 'Business Continuity & Disaster Recovery'], linkLabel: 'Explore Cloud', Icon: Server },
      { index: '02', title: 'Networking & Security', href: '/servicii/securitate', body: 'Protection for networks, identity, applications, and security operations.', items: ['Perimeter & Endpoint Security', 'Enterprise SSO / PKI', 'Monitoring and reporting', 'Managed Security Operations'], linkLabel: 'Explore Security', Icon: ShieldCheck },
      { index: '03', title: 'Software & Automation', href: '/servicii/software', body: 'Custom applications, modernisation, DevSecOps, and automation adapted to existing processes.', items: ['Custom software & APIs', 'DevOps / DevSecOps & CI/CD', 'Application modernisation', 'AI / LLM automation'], linkLabel: 'Explore Software', Icon: Code },
      { index: '04', title: 'Managed Services', href: '/servicii/managed', body: 'Continuous operations for infrastructure, applications, and users within clear contractual boundaries.', items: ['Managed Infrastructure', 'Service Desk', 'Managed Security', 'Cloud Support'], linkLabel: 'Explore Managed Services', Icon: Settings2 },
    ],
    process: {
      eyebrow: 'Delivery framework',
      heading: 'A compact path with verifiable decisions',
      description: 'Instead of a repetitive wall of promises, projects follow three control points that clarify responsibility and outcome.',
      caption: 'Each stage produces an agreed decision or deliverable; scope, schedule, and acceptance criteria remain project-specific.',
      steps: [
        { label: 'Context', title: 'Measure and define boundaries', body: 'We clarify the environment, objectives, risks, and responsibilities before proposing a solution.' },
        { label: 'Plan', title: 'Prioritise and design', body: 'Findings become a plan with deliverables, dependencies, and acceptance criteria.' },
        { label: 'Deliver', title: 'Implement and hand over', body: 'We execute in verifiable steps, document the outcome, and define subsequent operations or support.' },
      ],
    },
    cta: { heading: 'An assessment that clarifies where to start', body: 'We review infrastructure, security, applications, and current operations, then recommend a first step with clear boundaries and deliverables.' },
  },
};

export const solutionsHub: Record<Lang, SolutionsHubContent> = {
  ro: {
    title: 'Soluții proprietare — SEKNET & S-VPN | Smart Control',
    description: 'Produse software proprii pentru monitorizarea și protejarea mediilor IT și pentru acces remote securizat.',
    hero: { eyebrow: 'Soluții proprietare', lead: 'Software propriu,', accent: 'integrat în contextul organizației.', body: 'SEKNET și S-VPN sunt dezvoltate și susținute de Smart Control. Configurația și condițiile comerciale sunt stabilite după analiza mediului și cerințelor.' },
    productsHeading: 'Două produse, două contexte distincte',
    productsBody: 'Alege produsul după problema operațională; detaliile tehnice sensibile sunt prezentate numai într-un cadru controlat.',
    products: [
      { name: 'SEKNET', description: 'Monitorizare și protecție pentru medii IT care cer vizibilitate operațională și coordonarea răspunsului.', href: '/solutii/seknet', linkLabel: 'Explorează SEKNET', suitedFor: 'Potrivit pentru: vizibilitate și prioritizarea evenimentelor' },
      { name: 'S-VPN', description: 'Acces remote securizat, administrat în acord cu infrastructura și politicile organizației.', href: '/solutii/s-vpn', linkLabel: 'Explorează S-VPN', suitedFor: 'Potrivit pentru: acces controlat al utilizatorilor distribuiți' },
    ],
    principles: {
      eyebrow: 'Principii de integrare',
      heading: 'Valoarea vine din potrivire, nu dintr-o listă generică de funcții',
      body: 'Produsele sunt prezentate fără a publica topologii, protocoale, capacități sau configurații sensibile.',
      items: [
        { title: 'Context înainte de configurație', body: 'Cerințele, mediul și responsabilitățile sunt analizate înaintea opțiunilor tehnice.' },
        { title: 'Integrare controlată', body: 'Dependențele și limitele de acces sunt stabilite împreună cu echipa clientului.' },
        { title: 'Operare susținută', body: 'Serviciile de implementare, mentenanță și suport sunt definite pentru configurația convenită.' },
      ],
    },
    cta: { heading: 'Discutăm despre produsul potrivit', body: 'Menționează SEKNET sau S-VPN în mesaj, iar solicitarea ajunge la echipa potrivită pentru o discuție contextuală.' },
  },
  en: {
    title: 'Proprietary Solutions — SEKNET & S-VPN | Smart Control',
    description: 'Proprietary software products for monitoring and protecting IT environments and for secure remote access.',
    hero: { eyebrow: 'Proprietary solutions', lead: 'Proprietary software,', accent: 'integrated into the organisation’s context.', body: 'SEKNET and S-VPN are developed and supported by Smart Control. Configuration and commercial terms are defined after reviewing the environment and requirements.' },
    productsHeading: 'Two products for two distinct contexts',
    productsBody: 'Choose the product by the operational problem; sensitive technical details are presented only in a controlled setting.',
    products: [
      { name: 'SEKNET', description: 'Monitoring and protection for IT environments that require operational visibility and coordinated response.', href: '/solutii/seknet', linkLabel: 'Explore SEKNET', suitedFor: 'Best suited to: visibility and event prioritisation' },
      { name: 'S-VPN', description: 'Secure remote access administered in line with the organisation’s infrastructure and policies.', href: '/solutii/s-vpn', linkLabel: 'Explore S-VPN', suitedFor: 'Best suited to: controlled access for distributed users' },
    ],
    principles: {
      eyebrow: 'Integration principles',
      heading: 'Value comes from fit, not a generic feature list',
      body: 'Products are presented without publishing sensitive topologies, protocols, capacity, or configuration details.',
      items: [
        { title: 'Context before configuration', body: 'Requirements, environment, and responsibilities are reviewed before technical options.' },
        { title: 'Controlled integration', body: 'Dependencies and access boundaries are defined with the client team.' },
        { title: 'Supported operations', body: 'Implementation, maintenance, and support services are defined for the agreed configuration.' },
      ],
    },
    cta: { heading: 'Discuss the right product', body: 'Mention SEKNET or S-VPN in your message and the request will reach the right team for a contextual discussion.' },
  },
};
