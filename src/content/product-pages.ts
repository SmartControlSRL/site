import type { Lang } from "../i18n/ui";
export type ProductKey = "seknet" | "s-vpn";
export type ProductArtwork = "seknet-observability" | "svpn-connection";
export const productArtwork: Record<ProductKey, ProductArtwork> = {
  seknet: "seknet-observability",
  "s-vpn": "svpn-connection",
};
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
  journey: Array<{ label: string; title: string; body: string }>;
  journeyEyebrow: string;
  journeyTitle: string;
  journeyIntro: string;
  associatedServices?: {
    eyebrow: string;
    heading: string;
    body: string;
    items: string[];
  };
  cta: { heading: string; body: string };
  relatedTitle: string;
  relatedBody: string;
  relatedHref: string;
}
/** Main-approved product copy (c551648), with the owner-approved editorial audit revision. */
export const productPages: Record<ProductKey, Record<Lang, ProductContent>> = {
  seknet: {
    ro: {
      name: "SEKNET",
      title: "SEKNET — Monitorizare, securitate și control | Smart Control",
      description:
        "SEKNET este soluția Smart Control pentru monitorizarea și protejarea infrastructurii IT, cu vizibilitate operațională și control centralizat.",
      headline: "Monitorizare. Securitate. Control.",
      intro:
        "O perspectivă unificată asupra infrastructurii IT, care sprijină echipele în monitorizarea operațiunilor, identificarea riscurilor și coordonarea răspunsului.",
      signal: ["Infrastructură", "Evenimente & context", "Analiză & răspuns"],
      capabilities: [
        {
          title: "Monitorizare operațională",
          body: "O imagine coerentă asupra stării infrastructurii, astfel încât echipele să identifice mai repede situațiile care necesită atenție.",
        },
        {
          title: "Protecție integrată",
          body: "Evenimentele relevante sunt reunite pentru analiză și pentru coordonarea răspunsului dintr-un punct central.",
        },
        {
          title: "Control centralizat",
          body: "Evenimentele sunt grupate și prioritizate pentru rolurile care trebuie să analizeze și să decidă.",
        },
      ],
      contextTitle: "Monitorizarea și protejarea infrastructurii IT",
      context:
        "SEKNET centralizează informațiile relevante pentru operarea și protejarea infrastructurii IT, într-o experiență configurată în funcție de mediul și cerințele organizației.",
      journey: [
        {
          label: "Observare",
          title: "Reunim semnalele relevante",
          body: "Vizibilitatea este configurată pentru mediul și responsabilitățile stabilite împreună cu organizația.",
        },
        {
          label: "Context",
          title: "Organizăm informația operațională",
          body: "Informațiile tehnice sunt organizate pentru rolurile operaționale și de securitate.",
        },
        {
          label: "Coordonare",
          title: "Susținem acțiunea potrivită",
          body: "Echipele folosesc contextul comun pentru investigație, răspuns și raportare în limitele procesului agreat.",
        },
      ],
      relatedTitle: "Servicii Gestionate",
      relatedBody:
        "Operare continuă pentru infrastructură, aplicații și utilizatori, în limite contractuale clare.",
      relatedHref: "/servicii/managed",
      journeyEyebrow: "Context conceptual",
      journeyTitle: "De la semnal la context operațional",
      journeyIntro:
        "Flux orientativ: de la monitorizarea infrastructurii la analiză și coordonarea răspunsului.",
      cta: {
        heading: "Vezi SEKNET în contextul infrastructurii tale",
        body: "Îți prezentăm platforma și discutăm cerințele, integrarea și configurația potrivită pentru mediul tău.",
      },
    },
    en: {
      name: "SEKNET",
      title: "SEKNET — Monitoring, security and control | Smart Control",
      description:
        "SEKNET is the Smart Control solution for monitoring and protecting IT infrastructure, with operational visibility and centralised control.",
      headline: "Monitoring. Security. Control.",
      intro:
        "A unified view of IT infrastructure that helps teams monitor operations, identify risks and coordinate response.",
      signal: ["Infrastructure", "Events & context", "Analysis & response"],
      capabilities: [
        {
          title: "Operational monitoring",
          body: "A coherent view of infrastructure health, helping teams identify situations that require attention sooner.",
        },
        {
          title: "Integrated protection",
          body: "Relevant events are brought together for analysis and coordinated response from a central point.",
        },
        {
          title: "Centralised control",
          body: "Events are grouped and prioritised for the roles that need to analyse and decide.",
        },
      ],
      contextTitle: "Monitoring and protecting IT infrastructure",
      context:
        "SEKNET centralises information relevant to operating and protecting IT infrastructure, configured around the organisation’s environment and requirements.",
      journey: [
        {
          label: "Observe",
          title: "Bring relevant signals together",
          body: "Visibility is configured for the environment and responsibilities agreed with the organisation.",
        },
        {
          label: "Context",
          title: "Organise operational information",
          body: "Technical information is organised for operational and security roles.",
        },
        {
          label: "Coordinate",
          title: "Support the appropriate action",
          body: "Teams use shared context for investigation, response, and reporting within the agreed process.",
        },
      ],
      relatedTitle: "Managed Services",
      relatedBody:
        "Continuous operations for infrastructure, applications, and users within clear contractual boundaries.",
      relatedHref: "/servicii/managed",
      journeyEyebrow: "Conceptual context",
      journeyTitle: "From signal to operational context",
      journeyIntro:
        "An indicative workflow: from infrastructure monitoring to analysis and coordinated response.",
      cta: {
        heading: "See SEKNET in the context of your infrastructure",
        body: "We present the platform and discuss the requirements, integration and configuration appropriate for your environment.",
      },
    },
  },
  "s-vpn": {
    ro: {
      name: "S-VPN",
      title: "S-VPN — Acces remote sigur, integrat | Smart Control",
      description:
        "S-VPN este soluția Smart Control pentru acces remote securizat, administrare simplificată și adaptare la cerințele organizației.",
      headline: "Acces remote sigur.",
      intro:
        "S-VPN oferă organizațiilor o modalitate sigură și ușor de administrat pentru conectarea utilizatorilor la resursele de lucru, adaptată infrastructurii și politicilor existente.",
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
      contextTitle: "Acces remote adaptat organizației",
      context:
        "O abordare unitară pentru conectarea sigură a utilizatorilor și administrarea accesului, configurată în funcție de mediul și cerințele fiecărei organizații.",
      journey: [
        {
          label: "Solicitare",
          title: "Utilizatorul inițiază accesul",
          body: "Punctul de pornire este o nevoie legitimă de conectare la resursele organizației.",
        },
        {
          label: "Verificare",
          title: "Politicile validează contextul",
          body: "Identitatea și condițiile de acces sunt evaluate conform regulilor stabilite de organizație.",
        },
        {
          label: "Conectare",
          title: "Accesul este acordat controlat",
          body: "Utilizatorul ajunge la resursele permise în limitele configurației aprobate.",
        },
        {
          label: "Revizuire",
          title: "Echipa păstrează vizibilitatea",
          body: "Administrarea și auditul susțin revizuirea accesului.",
        },
      ],
      relatedTitle: "Networking & Security",
      relatedBody:
        "Protecție pentru rețea, identitate, aplicații și operațiuni de securitate.",
      relatedHref: "/servicii/securitate",
      journeyEyebrow: "Parcurs conceptual",
      journeyTitle: "Acces de la solicitare la revizuire",
      journeyIntro:
        "Parcurs orientativ al accesului: solicitare, verificare, conectare și revizuire.",
      associatedServices: {
        eyebrow: "Servicii asociate",
        heading: "Asistență pe parcursul implementării și operării",
        body: "Echipa Smart Control asigură servicii pentru configurarea, integrarea și utilizarea soluției în mediul organizației. Serviciile necesare se stabilesc în funcție de proiect.",
        items: [
          "Analiză inițială și configurare",
          "Integrare în mediul existent",
          "Asistență tehnică",
          "Mentenanță și actualizări",
        ],
      },
      cta: {
        heading: "Discută cu noi despre S-VPN",
        body: "Evaluăm contextul organizației tale și îți prezentăm modul în care S-VPN poate susține accesul remote securizat.",
      },
    },
    en: {
      name: "S-VPN",
      title: "S-VPN — Secure remote access, integrated | Smart Control",
      description:
        "S-VPN is Smart Control’s solution for secure remote access, simplified administration and adaptation to organisational requirements.",
      headline: "Secure remote access.",
      intro:
        "S-VPN gives organisations a secure and straightforward way to connect users to work resources, adapted to their existing infrastructure and policies.",
      signal: ["User", "Secure access", "IT resources"],
      capabilities: [
        {
          title: "Secure access",
          body: "Connect users to the resources they need, in line with organisational policies.",
        },
        {
          title: "Simplified administration",
          body: "Centralised control and operational visibility for the IT team.",
        },
        {
          title: "Integration with the existing environment",
          body: "Configuration adapted to existing infrastructure, processes and security requirements.",
        },
      ],
      contextTitle: "Remote access adapted to your organisation",
      context:
        "A unified approach to secure user connectivity and access administration, configured for each organisation’s environment and requirements.",
      journey: [
        {
          label: "Request",
          title: "The user initiates access",
          body: "The journey starts with a legitimate need to connect to organisational resources.",
        },
        {
          label: "Verify",
          title: "Policies validate the context",
          body: "Identity and access conditions are evaluated against rules established by the organisation.",
        },
        {
          label: "Connect",
          title: "Access is granted in a controlled way",
          body: "The user reaches permitted resources within the approved configuration.",
        },
        {
          label: "Review",
          title: "The team retains visibility",
          body: "Administration and audit support access review.",
        },
      ],
      relatedTitle: "Networking & Security",
      relatedBody:
        "Protection for networks, identity, applications, and security operations.",
      relatedHref: "/servicii/securitate",
      journeyEyebrow: "Conceptual journey",
      journeyTitle: "Access from request to review",
      journeyIntro:
        "An indicative access journey: request, verification, connection and review.",
      associatedServices: {
        eyebrow: "Associated services",
        heading: "Support throughout implementation and operation",
        body: "The Smart Control team provides services to configure, integrate and use the solution within the organisation’s environment. The services needed are defined for each project.",
        items: [
          "Initial assessment and configuration",
          "Integration with the existing environment",
          "Technical assistance",
          "Maintenance and updates",
        ],
      },
      cta: {
        heading: "Talk to us about S-VPN",
        body: "We assess your organisation’s context and show how S-VPN can support secure remote access.",
      },
    },
  },
};
