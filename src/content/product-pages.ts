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
        "SEKNET monitorizează infrastructura IT și centralizează evenimentele de securitate pentru analiză și intervenție.",
      headline: "Monitorizare și securitate IT.",
      intro:
        "Urmărește infrastructura IT și centralizează evenimentele de securitate pentru analiză și intervenție.",
      signal: ["Infrastructură", "Evenimente & context", "Analiză & răspuns"],
      capabilities: [
        {
          title: "Monitorizare operațională",
          body: "Urmărește starea infrastructurii și identifică situațiile care cer atenție.",
        },
        {
          title: "Evenimente de securitate",
          body: "Reunește evenimentele de securitate pentru investigații și intervenții.",
        },
        {
          title: "Control centralizat",
          body: "Organizează informațiile într-un singur loc pentru echipele de operațiuni și securitate.",
        },
      ],
      contextTitle: "Pentru echipe de operațiuni și securitate",
      context:
        "SEKNET ajută echipele să urmărească infrastructura distribuită și să prioritizeze alertele. Configurația ține cont de sistemele monitorizate și de responsabilitățile echipelor.",
      journey: [
        {
          title: "Înțelegem mediul",
          body: "Stabilim ce sisteme trebuie monitorizate și ce informații sunt necesare.",
        },
        {
          title: "Configurăm produsul",
          body: "Configurăm integrarea cu sistemele existente și verificăm datele colectate.",
        },
        {
          title: "Stabilim suportul",
          body: "Agreăm asistența tehnică, mentenanța și responsabilitățile fiecărei echipe.",
        },
      ],
      relatedTitle: "Servicii Gestionate",
      relatedBody:
        "Echipa Smart Control poate prelua monitorizarea și suportul pentru sistemele incluse în contract.",
      relatedHref: "/servicii/managed",
    },
    en: {
      name: "SEKNET",
      title: "SEKNET — Monitoring and security | Smart Control",
      description:
        "SEKNET monitors IT infrastructure and brings security events together for analysis and response.",
      headline: "IT monitoring and security.",
      intro:
        "Monitor IT infrastructure and bring security events together for analysis and response.",
      signal: ["Infrastructure", "Events & context", "Analysis & response"],
      capabilities: [
        {
          title: "Operational monitoring",
          body: "Tracks infrastructure status and identifies situations that need attention.",
        },
        {
          title: "Security events",
          body: "Brings security events together for investigation and response.",
        },
        {
          title: "Centralised control",
          body: "Organises information in one place for operations and security teams.",
        },
      ],
      contextTitle: "For operations and security teams",
      context:
        "SEKNET helps teams monitor distributed infrastructure and prioritise alerts. Configuration reflects the monitored systems and each team’s responsibilities.",
      journey: [
        {
          title: "Understand the environment",
          body: "Agree which systems to monitor and what information is needed.",
        },
        {
          title: "Configure the product",
          body: "Configure integration with existing systems and check the collected data.",
        },
        {
          title: "Agree support",
          body: "Agree technical support, maintenance and each team’s responsibilities.",
        },
      ],
      relatedTitle: "Managed Services",
      relatedBody:
        "The Smart Control team can take on monitoring and support for the systems included in your contract.",
      relatedHref: "/servicii/managed",
    },
  },
  "s-vpn": {
    ro: {
      name: "S-VPN",
      title: "S-VPN — Acces remote securizat | Smart Control",
      description:
        "S-VPN asigură acces remote securizat la resursele companiei, cu administrare centralizată și integrare în infrastructura existentă.",
      headline: "Acces remote securizat.",
      intro:
        "Conectează utilizatorii la resursele companiei, conform politicilor de acces administrate de echipa IT.",
      signal: ["Utilizator", "Acces securizat", "Resurse IT"],
      capabilities: [
        {
          title: "Acces sigur",
          body: "Conectarea utilizatorilor la resursele necesare, conform politicilor organizației.",
        },
        {
          title: "Administrare centralizată",
          body: "Echipa IT administrează accesul utilizatorilor dintr-un singur loc.",
        },
        {
          title: "Integrare în mediul existent",
          body: "Configurarea ține cont de infrastructură și de regulile de securitate existente.",
        },
      ],
      contextTitle: "Acces pentru echipe distribuite",
      context:
        "S-VPN le permite utilizatorilor din afara sediului să acceseze resursele companiei. Echipa IT stabilește și administrează accesul necesar.",
      journey: [
        {
          title: "Definim cerințele",
          body: "Stabilim cine are nevoie de acces, la ce resurse și în ce condiții.",
        },
        {
          title: "Configurăm și integrăm",
          body: "Configurăm produsul în infrastructura existentă și verificăm accesul.",
        },
        {
          title: "Stabilim suportul",
          body: "Stabilim asistența tehnică, mentenanța și actualizările necesare.",
        },
      ],
      relatedTitle: "Networking & Security",
      relatedBody:
        "Putem include accesul remote într-un proiect de rețea, administrare a identităților și securitate.",
      relatedHref: "/servicii/securitate",
    },
    en: {
      name: "S-VPN",
      title: "S-VPN — Secure remote access | Smart Control",
      description:
        "S-VPN provides secure remote access to company resources, with centralised administration and integration with existing infrastructure.",
      headline: "Secure remote access.",
      intro:
        "Connect users to company resources under the access policies managed by your IT team.",
      signal: ["User", "Secure access", "IT resources"],
      capabilities: [
        {
          title: "Secure access",
          body: "Connects users to the resources they need, according to organisational policies.",
        },
        {
          title: "Centralised administration",
          body: "The IT team manages user access from one place.",
        },
        {
          title: "Integration with your environment",
          body: "Configuration takes account of existing infrastructure and security rules.",
        },
      ],
      contextTitle: "Access for distributed teams",
      context:
        "S-VPN lets users outside the office access company resources. The IT team defines and manages the access they need.",
      journey: [
        {
          title: "Define requirements",
          body: "Agree who needs access, to which resources and under what conditions.",
        },
        {
          title: "Configure and integrate",
          body: "Configure the product in your existing infrastructure and test access.",
        },
        {
          title: "Agree support",
          body: "Agree the technical assistance, maintenance and updates required.",
        },
      ],
      relatedTitle: "Networking & Security",
      relatedBody:
        "We can include remote access in a project covering networks, identity management and security.",
      relatedHref: "/servicii/securitate",
    },
  },
};
