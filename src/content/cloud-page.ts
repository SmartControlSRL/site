import { Container, GitBranch, Cloud, Gauge } from "@lucide/astro";
import type { Lang } from "../i18n/ui";
import type { ServicePageContent } from "./service-pages";
/** Full pillar scope from main (c551648), with modernisation as a dedicated offering. */
export const cloudPages: Record<Lang, ServicePageContent> = {
  ro: {
    title: "Infrastructură & Cloud — Smart Control",
    description:
      "Proiectare și operare de centre de date, virtualizare, cloud privat și hibrid, continuitate și modernizarea infrastructurii IT.",
    canonicalPath: "/servicii/cloud/",
    schemaName: "Infrastructură & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      artwork: "architecture-light",
      eyebrow: "Infrastructură & Cloud",
      lead: "Proiectăm și operăm",
      accent: "infrastructuri IT.",
      body: "Proiectăm și consolidăm centre de date, virtualizăm și operăm medii de cloud privat și hibrid.",
      secondary: "Vezi fluxul în 5 etape",
    },
    scope: {
      heading: "Ce acoperim",
      items: [
        "Proiectare și implementare de centre de date",
        "Consolidare și virtualizare",
        "Cloud privat și hibrid",
        "Continuitatea activității și recuperare în caz de dezastru",
      ],
    },
    capabilities: {
      eyebrow: "Modernizare",
      heading: "Re-arhitecturare și migrare selectivă",
      description: "Analizăm infrastructura și aplicațiile existente pentru a stabili ce poate fi optimizat, re-arhitecturat sau migrat în cloud.",
      items: [
        {
          title: "Containerizare & orchestrare",
          items: [
            "Prioritizarea aplicațiilor",
            "Migrare controlată",
            "Rollback planificat",
          ],
          body: "",
          Icon: Container,
        },
        {
          title: "DevSecOps & CI/CD",
          items: [
            "Pipeline-uri de livrare",
            "Testare automată în staging",
            "Infrastructure-as-Code",
          ],
          body: "",
          Icon: GitBranch,
        },
        {
          title: "Integrare hibridă",
          items: [
            "Integrare on-premise și cloud",
            "Migrare selectivă",
            "Costuri predictibile",
          ],
          body: "",
          Icon: Cloud,
        },
        {
          title: "Monitorizare & suport",
          items: [
            "Suport proactiv",
            "Monitorizare continuă",
            "Urmărirea indicatorilor propuși",
          ],
          body: "",
          Icon: Gauge,
        },
      ],
    },
    flow: {
      eyebrow: "Abordare",
      heading: "Modernizare în 5 etape",
      description:
        "Pentru clienții cu un context tehnic deja cunoscut, o propunere de re-arhitecturare poate fi pregătită ca traseu Fast Track. Aceasta este o opțiune, nu o etapă universală și nu înlocuiește validarea datelor de intrare.",
      caption:
        "Metodologia este un cadru de livrare, nu o promisiune de calendar, economii sau rezultat. Aria și indicatorii sunt agreați pentru fiecare proiect.",
      steps: [
        {
          label: "Assessment inițial",
          title: "Assessment inițial & quick wins",
          body: "Inventarierea infrastructurii, analiza de performanță și evaluarea gap-urilor.",
        },
        {
          label: "Arhitectură",
          title: "Design țintă de re-arhitecturare",
          body: "Definirea arhitecturii țintă și prioritizarea schimbărilor pe baza datelor colectate în assessment.",
        },
        {
          label: "DevSecOps",
          title: "Containerizare & pregătirea livrării",
          body: "Refactoring, containerizare, pipeline-uri de livrare, testare în staging și plan de rollback.",
        },
        {
          label: "Implementare",
          title: "Migrare controlată & transfer de cunoștințe",
          body: "Migrare selectivă, integrare hibridă, validarea ferestrelor de schimbare, workshop-uri și documentație.",
        },
        {
          label: "Indicatori propuși",
          title: "Validare & optimizare continuă",
          body: "Măsurarea rezultatelor și optimizarea continuă în raport cu indicatorii agreați pentru proiect.",
        },
      ],
    },
    cta: {
      heading: "Cât te costă infrastructura actuală și cât ai putea economisi",
      body: "Assessment-ul inițial este configurat în funcție de infrastructură, obiective și aria agreată. Livrabilele și termenii sunt confirmați înainte de începere.",
    },
  },
  en: {
    title: "Infrastructure & Cloud — Smart Control",
    description:
      "Data centre design and operation, virtualisation, private and hybrid cloud, business continuity and IT infrastructure modernisation.",
    canonicalPath: "/en/servicii/cloud/",
    schemaName: "Infrastructure & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      artwork: "architecture-light",
      eyebrow: "Infrastructure & Cloud",
      lead: "We design and operate",
      accent: "IT infrastructure.",
      body: "We design and consolidate data centres, virtualise and operate private and hybrid cloud environments.",
      secondary: "See the 5 stages",
    },
    scope: {
      heading: "What we cover",
      items: [
        "Data centre design and implementation",
        "Consolidation and virtualisation",
        "Private and hybrid cloud",
        "Business continuity and disaster recovery",
      ],
    },
    capabilities: {
      eyebrow: "Modernisation",
      heading: "Re-architecture and selective migration",
      description: "We review existing infrastructure and applications to identify what can be optimised, re-architected or migrated to the cloud.",
      items: [
        {
          title: "Containerisation & orchestration",
          items: [
            "Application prioritisation",
            "Controlled migration",
            "Planned rollback",
          ],
          body: "",
          Icon: Container,
        },
        {
          title: "DevSecOps & CI/CD",
          items: [
            "Delivery pipelines",
            "Automated staging tests",
            "Infrastructure-as-Code",
          ],
          body: "",
          Icon: GitBranch,
        },
        {
          title: "Hybrid integration",
          items: [
            "On-premise and cloud integration",
            "Selective migration",
            "Predictable costs",
          ],
          body: "",
          Icon: Cloud,
        },
        {
          title: "Monitoring & support",
          items: [
            "Proactive support",
            "Continuous monitoring",
            "Tracking agreed indicators",
          ],
          body: "",
          Icon: Gauge,
        },
      ],
    },
    flow: {
      eyebrow: "Approach",
      heading: "Modernisation in 5 stages",
      description:
        "For clients whose technical context is already understood, a re-architecture proposal can follow a Fast Track path. This is optional, not a universal stage, and does not replace validation of the input data.",
      caption:
        "This methodology is a delivery framework, not a promise of schedule, savings, or outcome. Scope and indicators are agreed for each project.",
      steps: [
        {
          label: "Initial assessment",
          title: "Initial assessment & quick wins",
          body: "Infrastructure inventory, performance analysis, and gap assessment.",
        },
        {
          label: "Architecture",
          title: "Target re-architecture design",
          body: "Define the target architecture and prioritise changes using data gathered during the assessment.",
        },
        {
          label: "DevSecOps",
          title: "Containerisation & delivery preparation",
          body: "Refactoring, containerisation, delivery pipelines, staging tests, and a rollback plan.",
        },
        {
          label: "Implementation",
          title: "Controlled migration & knowledge transfer",
          body: "Selective migration, hybrid integration, validated change windows, workshops, and documentation.",
        },
        {
          label: "Agreed indicators",
          title: "Validation & continuous optimisation",
          body: "Measure outcomes and continuously optimise against the indicators agreed for the project.",
        },
      ],
    },
    cta: {
      heading:
        "What does your current infrastructure cost and where could it be optimised",
      body: "The initial assessment is configured around your infrastructure, objectives, and agreed scope. Deliverables and terms are confirmed before work begins.",
    },
  },
};
