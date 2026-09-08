import { Container, GitBranch, Cloud, Gauge } from "@lucide/astro";
import type { Lang } from "../i18n/ui";
import type { ServicePageContent } from "./service-pages";
/** Cloud copy restored from origin/main (c551648), retaining the Infrastructure & Cloud navigation. */
export const cloudPages: Record<Lang, ServicePageContent> = {
  ro: {
    title: "Cloud & Modernizare — Re-arhitecturare | Smart Control",
    description:
      "Hardware-ul se scumpește. Propunem o abordare de re-arhitecturare, containerizare și migrare selectivă în cloud pentru performanță și costuri predictibile.",
    canonicalPath: "/servicii/cloud/",
    schemaName: "Infrastructură & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      artwork: "architecture-light",
      eyebrow: "Infrastructură & Cloud",
      lead: "Hardware-ul se scumpește.",
      accent: "Propunem următoarea abordare.",
      body: "Prețurile componentelor critice cresc sub presiunea cererii pentru infrastructură AI, iar bugetele de refresh nu mai ajung. Re-arhitecturarea și optimizarea aplicațiilor devin strategia principală — obții mai multă performanță din infrastructura existentă, înainte să cumperi una nouă.",
      secondary: "Vezi fluxul în 5 etape",
    },
    capabilities: {
      eyebrow: "Ce acoperim",
      heading: "Ce livrăm concret",
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
      heading: "Propunem 5 etape",
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
    title: "Cloud & Modernisation — Re-architecture | Smart Control",
    description:
      "Hardware is getting more expensive. We propose an application re-architecture, containerisation and selective cloud migration approach for performance and predictable costs.",
    canonicalPath: "/en/servicii/cloud/",
    schemaName: "Infrastructure & Cloud",
    schemaServiceType: "Enterprise infrastructure and cloud services",
    hero: {
      artwork: "architecture-light",
      eyebrow: "Infrastructure & Cloud",
      lead: "Hardware is getting more expensive.",
      accent: "We propose the following approach.",
      body: "Critical component prices are rising under pressure from AI infrastructure demand. Application re-architecture and optimisation help obtain more performance from existing infrastructure before buying new hardware.",
      secondary: "See the 5 stages",
    },
    capabilities: {
      eyebrow: "Scope",
      heading: "What we deliver",
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
      heading: "We propose 5 stages",
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
