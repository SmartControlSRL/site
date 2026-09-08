import type { Lang } from "../i18n/ui";
export type ProductKey = "seknet" | "s-vpn";
interface ProductContent {
  name: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  signal: string[];
  capabilities: Array<{ title: string; body: string }>;
  contextTitle: string;
  context: string;
  journey: Array<{ title: string; body: string }>;
  relatedTitle: string;
  relatedBody: string;
  relatedHref: string;
}
export const productPages: Record<ProductKey, Record<Lang, ProductContent>> = {
  seknet: {
    ro: {
      name: "SEKNET",
      title: "SEKNET — Monitorizare și securitate | Smart Control",
      description:
        "SEKNET reunește monitorizarea și protecția infrastructurii IT, cu vizibilitate operațională și control centralizat, adaptate mediului organizației.",
      headline: "Vezi contextul. Coordonează răspunsul.",
      intro:
        "O perspectivă comună asupra infrastructurii, evenimentelor și riscurilor. Pentru echipele care coordonează operațiunile și securitatea.",
      signal: ["Infrastructură", "Evenimente & context", "Analiză & răspuns"],
      capabilities: [
        {
          title: "Monitorizare operațională",
          body: "Reunește informațiile despre infrastructură pentru a identifica situațiile care necesită atenție.",
        },
        {
          title: "Protecție integrată",
          body: "Aduce evenimentele relevante într-un context comun pentru analiză și coordonarea răspunsului.",
        },
        {
          title: "Control centralizat",
          body: "Organizează informațiile tehnice într-o experiență adaptată rolurilor operaționale și de securitate.",
        },
      ],
      contextTitle: "O perspectivă comună pentru echipele tale.",
      context:
        "Pentru medii distribuite, alerte care trebuie prioritizate și operațiuni care au nevoie de trasabilitate. Configurația se stabilește în funcție de infrastructură și de responsabilitățile echipelor.",
      journey: [
        {
          title: "Înțelegem mediul",
          body: "Clarificăm cerințele de vizibilitate și procesele operaționale.",
        },
        {
          title: "Configurăm împreună",
          body: "Adaptăm integrarea și informațiile la mediul organizației.",
        },
        {
          title: "Susținem operarea",
          body: "Stabilim asistența, mentenanța și responsabilitățile necesare.",
        },
      ],
      relatedTitle: "Servicii Gestionate",
      relatedBody:
        "Conectează vizibilitatea oferită de produs cu monitorizarea, suportul și îmbunătățirea continuă a mediului IT.",
      relatedHref: "/servicii/managed",
    },
    en: {
      name: "SEKNET",
      title: "SEKNET — Monitoring and security | Smart Control",
      description:
        "SEKNET brings IT infrastructure monitoring and protection together, with operational visibility and centralised control adapted to your organisation.",
      headline: "See the context. Coordinate the response.",
      intro:
        "A shared perspective on infrastructure, events and risks. For the teams coordinating operations and security.",
      signal: ["Infrastructure", "Events & context", "Analysis & response"],
      capabilities: [
        {
          title: "Operational monitoring",
          body: "Brings infrastructure information together to identify situations that need attention.",
        },
        {
          title: "Integrated protection",
          body: "Places relevant events in a shared context for analysis and coordinated response.",
        },
        {
          title: "Centralised control",
          body: "Organises technical information in an experience adapted to operational and security roles.",
        },
      ],
      contextTitle: "A shared perspective for your teams.",
      context:
        "For distributed environments, alerts that need prioritising and operations that require traceability. Configuration follows the infrastructure and the responsibilities of your teams.",
      journey: [
        {
          title: "Understand the environment",
          body: "Clarify visibility requirements and operational processes.",
        },
        {
          title: "Configure together",
          body: "Adapt integration and information to your organisation’s environment.",
        },
        {
          title: "Support operations",
          body: "Agree the assistance, maintenance and responsibilities required.",
        },
      ],
      relatedTitle: "Managed Services",
      relatedBody:
        "Connect the visibility provided by the product with monitoring, support and ongoing improvement across your IT environment.",
      relatedHref: "/servicii/managed",
    },
  },
  "s-vpn": {
    ro: {
      name: "S-VPN",
      title: "S-VPN — Acces remote securizat | Smart Control",
      description:
        "S-VPN conectează utilizatorii la resursele organizației prin acces remote securizat, cu administrare centralizată și integrare adaptată mediului IT.",
      headline: "Echipe distribuite. Acces controlat.",
      intro:
        "Conectează utilizatorii la resursele de lucru, cu acces securizat adaptat infrastructurii și politicilor organizației.",
      signal: ["Utilizator", "Acces securizat", "Resurse IT"],
      capabilities: [
        {
          title: "Acces sigur",
          body: "Conectarea utilizatorilor la resursele necesare, conform politicilor organizației.",
        },
        {
          title: "Administrare simplificată",
          body: "Control centralizat și vizibilitate operațională pentru echipa IT.",
        },
        {
          title: "Integrare în mediul existent",
          body: "Configurare adaptată infrastructurii, proceselor și cerințelor de securitate existente.",
        },
      ],
      contextTitle: "Accesul urmează nevoile organizației.",
      context:
        "Pentru organizații cu utilizatori și locații distribuite, care au nevoie de administrare coerentă a accesului și vizibilitate pentru echipa IT.",
      journey: [
        {
          title: "Definim cerințele",
          body: "Clarificăm utilizatorii, resursele și politicile relevante pentru acces.",
        },
        {
          title: "Configurăm și integrăm",
          body: "Adaptăm soluția la mediul existent și validăm configurația agreată.",
        },
        {
          title: "Susținem utilizarea",
          body: "Stabilim asistența tehnică, mentenanța și actualizările necesare.",
        },
      ],
      relatedTitle: "Networking & Security",
      relatedBody:
        "Integrează accesul remote în planul mai amplu pentru rețea, identitate și protecția informațiilor.",
      relatedHref: "/servicii/securitate",
    },
    en: {
      name: "S-VPN",
      title: "S-VPN — Secure remote access | Smart Control",
      description:
        "S-VPN connects users to organisational resources through secure remote access, with centralised administration and integration adapted to the IT environment.",
      headline: "Distributed teams. Controlled access.",
      intro:
        "Connect users to the resources they need, with secure access adapted to your organisation’s infrastructure and policies.",
      signal: ["User", "Secure access", "IT resources"],
      capabilities: [
        {
          title: "Secure access",
          body: "Connects users to the resources they need, according to organisational policies.",
        },
        {
          title: "Simplified administration",
          body: "Centralised control and operational visibility for the IT team.",
        },
        {
          title: "Integration with your environment",
          body: "Configuration adapted to existing infrastructure, processes and security requirements.",
        },
      ],
      contextTitle: "Access follows your organisation’s needs.",
      context:
        "For organisations with distributed users and locations that need consistent access administration and visibility for the IT team.",
      journey: [
        {
          title: "Define requirements",
          body: "Clarify the users, resources and policies relevant to access.",
        },
        {
          title: "Configure and integrate",
          body: "Adapt the solution to the existing environment and validate the agreed configuration.",
        },
        {
          title: "Support ongoing use",
          body: "Agree the technical assistance, maintenance and updates required.",
        },
      ],
      relatedTitle: "Networking & Security",
      relatedBody:
        "Integrate remote access into the wider plan for networking, identity and information protection.",
      relatedHref: "/servicii/securitate",
    },
  },
};
