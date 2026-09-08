import { Server, Cloud, DatabaseZap, Container } from "@lucide/astro";
import type { Lang } from "../i18n/ui";
import type { ServicePageContent } from "./service-pages";
export const cloudPages: Record<Lang, ServicePageContent> = {
  ro: {
    title: "Infrastructură & Cloud — Smart Control",
    description:
      "Proiectare și modernizare de infrastructură IT: data center, cloud privat și hibrid, backup și migrarea aplicațiilor.",
    canonicalPath: "/servicii/cloud/",
    schemaName: "Infrastructură & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      artwork: "architecture-light",
      eyebrow: "Infrastructură & Cloud",
      lead: "Proiectăm și modernizăm",
      accent: "infrastructura IT.",
      body: "Evaluăm infrastructura existentă și stabilim ce trebuie extins, înlocuit sau migrat. Implementăm medii on-premises, cloud privat și hibrid.",
      secondary: "Vezi serviciile",
    },
    capabilities: {
      eyebrow: "Ce acoperim",
      heading: "De la data center la cloud.",
      items: [
        {
          title: "Infrastructură fizică",
          body: "Proiectăm data center-e și dimensionăm resursele de compute, storage și cablare.",
          Icon: Server,
        },
        {
          title: "Cloud privat & hibrid",
          body: "Implementăm virtualizarea, integrăm mediile on-premises și cloud și migrăm aplicațiile selectate.",
          Icon: Cloud,
        },
        {
          title: "Storage, backup & recovery",
          body: "Planificăm stocarea, backup-ul și disaster recovery în funcție de aplicații și cerințele de recuperare.",
          Icon: DatabaseZap,
        },
        {
          title: "Modernizarea aplicațiilor",
          body: "Adaptăm arhitectura aplicațiilor și configurăm containere și pipeline-uri de livrare.",
          Icon: Container,
        },
      ],
    },
    flow: {
      eyebrow: "Modernizare în cinci etape",
      heading: "Cum pregătim și realizăm migrarea",
      description:
        "Recomandările pornesc de la măsurători în infrastructura clientului. Etapele sunt adaptate scopului și dependențelor proiectului.",
      caption:
        "Planul de migrare, responsabilitățile și indicatorii sunt agreați pentru fiecare proiect.",
      steps: [
        {
          label: "Assessment",
          title: "Înțelegem mediul",
          body: "Inventariere, analiză de performanță și identificarea priorităților.",
        },
        {
          label: "Arhitectură",
          title: "Proiectăm arhitectura",
          body: "Arhitectură țintă și ordinea schimbărilor, pe baza datelor colectate.",
        },
        {
          label: "Pregătire",
          title: "Pregătim migrarea",
          body: "Containerizare, pipeline-uri, testare în staging și plan de rollback.",
        },
        {
          label: "Migrare",
          title: "Migrăm aplicațiile",
          body: "Migrare selectivă, integrare hibridă și transfer de cunoștințe.",
        },
        {
          label: "Optimizare",
          title: "Verificăm rezultatele",
          body: "Urmărim rezultatele în raport cu indicatorii agreați.",
        },
      ],
    },
    cta: {
      heading: "Pornim de la mediul tău IT.",
      body: "Stabilim împreună pașii următori.",
    },
  },
  en: {
    title: "Infrastructure & Cloud — Smart Control",
    description:
      "IT infrastructure design and modernisation: data centres, private and hybrid cloud, backup and application migration.",
    canonicalPath: "/en/servicii/cloud/",
    schemaName: "Infrastructure & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      artwork: "architecture-light",
      eyebrow: "Infrastructure & Cloud",
      lead: "Designing and modernising",
      accent: "IT infrastructure.",
      body: "We assess your infrastructure and identify what needs expanding, replacing or migrating. We implement on-premises, private and hybrid cloud environments.",
      secondary: "View services",
    },
    capabilities: {
      eyebrow: "Scope",
      heading: "From data centre to cloud.",
      items: [
        {
          title: "Physical infrastructure",
          body: "We design data centres and size compute, storage and cabling resources.",
          Icon: Server,
        },
        {
          title: "Private & hybrid cloud",
          body: "We implement virtualisation, integrate on-premises and cloud environments and migrate selected applications.",
          Icon: Cloud,
        },
        {
          title: "Storage, backup & recovery",
          body: "We plan storage, backup and disaster recovery around your applications and recovery requirements.",
          Icon: DatabaseZap,
        },
        {
          title: "Application modernisation",
          body: "We adapt application architecture and configure containers and delivery pipelines.",
          Icon: Container,
        },
      ],
    },
    flow: {
      eyebrow: "Five stages of modernisation",
      heading: "How we prepare and carry out a migration",
      description:
        "Recommendations start with measurements in the client’s infrastructure. We adapt the stages to the scope and dependencies of each project.",
      caption:
        "Migration plans, responsibilities and indicators are agreed for each project.",
      steps: [
        {
          label: "Assessment",
          title: "Understand the environment",
          body: "Inventory, performance analysis and identification of priorities.",
        },
        {
          label: "Architecture",
          title: "Design the architecture",
          body: "Target architecture and a sequence of changes based on the collected data.",
        },
        {
          label: "Preparation",
          title: "Prepare the migration",
          body: "Containerisation, pipelines, staging tests and a rollback plan.",
        },
        {
          label: "Migration",
          title: "Migrate applications",
          body: "Selective migration, hybrid integration and knowledge transfer.",
        },
        {
          label: "Optimisation",
          title: "Check the results",
          body: "Track results against the agreed indicators.",
        },
      ],
    },
    cta: {
      heading: "Start with your environment.",
      body: "Together, we define the next steps.",
    },
  },
};
