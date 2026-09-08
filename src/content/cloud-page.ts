import { Server, Cloud, DatabaseZap, Container } from "@lucide/astro";
import type { Lang } from "../i18n/ui";
import type { ServicePageContent } from "./service-pages";
export const cloudPages: Record<Lang, ServicePageContent> = {
  ro: {
    title: "Infrastructură & Cloud — Smart Control",
    description:
      "Arhitectură enterprise, infrastructură fizică, cloud privat și hibrid. Planificăm modernizarea și coordonăm implementarea, migrarea și operarea.",
    canonicalPath: "/servicii/cloud/",
    schemaName: "Infrastructură & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      eyebrow: "Infrastructură & Cloud",
      lead: "O bază solidă.",
      accent: "Loc pentru evoluție.",
      body: "Conectăm infrastructura fizică, platformele și aplicațiile într-o arhitectură adaptată organizației. Pornim de la ce există și planificăm ce urmează.",
      secondary: "Explorează expertiza",
    },
    capabilities: {
      eyebrow: "Ce acoperim",
      heading: "De la data center la cloud.",
      items: [
        {
          title: "Infrastructură fizică",
          body: "Design de data center, compute, storage și cablare structurată, dimensionate pentru mediul organizației.",
          Icon: Server,
        },
        {
          title: "Cloud privat & hibrid",
          body: "Virtualizare și integrarea mediilor on-premise și cloud, cu migrare selectivă a aplicațiilor.",
          Icon: Cloud,
        },
        {
          title: "Date & continuitate",
          body: "Storage, backup și disaster recovery, planificate în funcție de dependențe și cerințele de recuperare.",
          Icon: DatabaseZap,
        },
        {
          title: "Modernizarea aplicațiilor",
          body: "Re-arhitecturare, containerizare și pipeline-uri de livrare, împreună cu expertiza software și DevSecOps.",
          Icon: Container,
        },
      ],
    },
    flow: {
      eyebrow: "Modernizare în cinci etape",
      heading: "Schimbări planificate. Tranziție controlată.",
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
          title: "Definim direcția",
          body: "Arhitectură țintă și ordinea schimbărilor, pe baza datelor colectate.",
        },
        {
          label: "Pregătire",
          title: "Pregătim livrarea",
          body: "Containerizare, pipeline-uri, testare în staging și plan de rollback.",
        },
        {
          label: "Migrare",
          title: "Implementăm controlat",
          body: "Migrare selectivă, integrare hibridă și transfer de cunoștințe.",
        },
        {
          label: "Optimizare",
          title: "Validăm și îmbunătățim",
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
      "Enterprise architecture, physical infrastructure, private and hybrid cloud. We plan modernisation and coordinate implementation, migration and operations.",
    canonicalPath: "/en/servicii/cloud/",
    schemaName: "Infrastructure & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      eyebrow: "Infrastructure & Cloud",
      lead: "A solid foundation.",
      accent: "Room to evolve.",
      body: "We connect physical infrastructure, platforms and applications in an architecture that fits your organisation. We start with what exists and plan what comes next.",
      secondary: "Explore expertise",
    },
    capabilities: {
      eyebrow: "Scope",
      heading: "From data centre to cloud.",
      items: [
        {
          title: "Physical infrastructure",
          body: "Data centre design, compute, storage and structured cabling, sized around the organisation’s environment.",
          Icon: Server,
        },
        {
          title: "Private & hybrid cloud",
          body: "Virtualisation and integration of on-premise and cloud environments, with selective application migration.",
          Icon: Cloud,
        },
        {
          title: "Data & continuity",
          body: "Storage, backup and disaster recovery, planned around dependencies and recovery requirements.",
          Icon: DatabaseZap,
        },
        {
          title: "Application modernisation",
          body: "Re-architecture, containerisation and delivery pipelines, connected with software and DevSecOps expertise.",
          Icon: Container,
        },
      ],
    },
    flow: {
      eyebrow: "Five stages of modernisation",
      heading: "Planned change. Controlled transition.",
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
          title: "Define the direction",
          body: "Target architecture and a sequence of changes based on the collected data.",
        },
        {
          label: "Preparation",
          title: "Prepare delivery",
          body: "Containerisation, pipelines, staging tests and a rollback plan.",
        },
        {
          label: "Migration",
          title: "Implement with control",
          body: "Selective migration, hybrid integration and knowledge transfer.",
        },
        {
          label: "Optimisation",
          title: "Validate and improve",
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
