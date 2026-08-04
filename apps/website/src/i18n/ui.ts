export const defaultLang = 'en' as const

export const ui = {
  en: {
    // Page
    'page.title': 'Nathaël Bonnal',
    'page.description': 'Software Engineer specialized in designing robust, scalable products through thoughtful software architecture tailored to your product.',
    'footer.text': 'Built with Explainer v2',

    // Navbar
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.articles': 'Articles',
    'nav.contact': 'Contact',

    // Hero
    'hero.badge': 'Rust, IAM and distributed systems',
    'hero.title': 'Nathaël Bonnal,',
    'hero.headline': 'architect for robust and scalable systems',
    'hero.description': 'I build IAM primitives, distributed architectures and production systems. From the first API contract to the last alert resolved.',
    'hero.primaryAction': 'View my projects',
    'hero.secondaryAction': 'GitHub',
    'hero.tag1': 'Rust',
    'hero.tag2': 'IAM and security',
    'hero.tag3': 'Open source lead',
    'hero.currentlyAt': 'Currently at',
    'hero.employer': 'Cloud IAM',
    'hero.index': 'Profile',
    'hero.spec.k1': 'Stack',
    'hero.spec.v1': 'Rust · IAM · Kubernetes · OIDC',
    'hero.spec.k2': 'Scope',
    'hero.spec.v2': 'Distributed systems & security',
    'hero.spec.k3': 'Ref',
    'hero.spec.v3': 'FerrisKey · lead-maintainer',

    // FerrisKey Spotlight
    'ferriskey.label': 'Flagship Product',
    'ferriskey.title': 'FerrisKey',
    'ferriskey.subtitle': 'Open-source IAM platform, built in Rust',
    'ferriskey.description': "FerrisKey is an identity and access management platform built for production, the kind of system where correctness isn't optional. I co-founded it, designed the architecture, wrote the core, and I still own the production stack.",
    'ferriskey.proof1.title': 'Architecture',
    'ferriskey.proof1.description': 'Hexagonal architecture in Rust. Service boundaries designed before the first line of code. API contracts that the entire stack depends on.',
    'ferriskey.proof2.title': 'Distributed',
    'ferriskey.proof2.description': 'Multiple services on Kubernetes. Event-driven coordination, eventual consistency, and horizontal scalability by design.',
    'ferriskey.proof3.title': 'Production',
    'ferriskey.proof3.description': 'GitHub Actions CI/CD, Prometheus + Loki for observability, all held to SLO discipline so nothing just ships and gets forgotten.',
    'ferriskey.cta.website': 'Visit ferriskey.rs',
    'ferriskey.cta.github': 'View on GitHub',

    // Pillars (replaces Principles)
    'pillars.label': 'What I Do',
    'pillars.title': "Three things I'm built for",
    'pillars.description': 'Not a list of frameworks. What I actually deliver, end to end: get the system design right, make it work at scale, and keep it running in production.',
    'pillars.card1.title': 'Identity & Architecture',
    'pillars.card1.description': "I design systems at the domain level: service boundaries, API contracts, and data ownership, before I touch a framework. My IAM expertise (OIDC, policies, multi-tenancy) comes from building FerrisKey, an identity platform where correctness isn't optional.",
    'pillars.card2.title': 'Distributed Systems',
    'pillars.card2.description': 'I build services that coordinate reliably at scale: event-driven architectures, Kubernetes orchestration, and consistency models designed for failure, not just for the happy path.',
    'pillars.card3.title': 'Production Lifecycle',
    'pillars.card3.description': "I don't stop at the deploy. CI/CD pipelines, structured observability with Prometheus and Loki, and the mindset of an owner, not a contractor. If it pages at 3am, I'm the one who fixed the design that caused it.",

    // About (kept for i18n completeness, section removed from page)
    'about.label': 'About',
    'about.title': 'Who I am',
    'about.description': 'Designing systems that scale, one architecture decision at a time.',
    'about.bio1': "I'm a software engineer with over 10 years of experience designing systems that balance performance, maintainability, and developer experience. I care about making the right trade-offs, not just shipping features.",
    'about.bio2': 'I work across the full stack, but my focus is at the architecture level: defining service boundaries, choosing the right patterns for the problem, and designing APIs that teams can build on. From event-driven backends in Rust to modular frontend architectures, I design for the long term.',
    'about.bio3': 'I build open-source tools that reflect these principles and write about software architecture to help other engineers think beyond the code.',
    'about.stat1.value': '10+',
    'about.stat1.label': 'Years designing systems',
    'about.stat2.value': '15+',
    'about.stat2.label': 'Architectures designed',
    'about.stat3.value': '30+',
    'about.stat3.label': 'Open-source repos',
    'about.stat4.value': '5+',
    'about.stat4.label': 'Teams mentored',

    // Projects
    'projects.label': 'Projects',
    'projects.title': 'Open source products, not demo code',
    'projects.description': 'Each project is a system decision made concrete: an architecture choice, a protocol design, years of upkeep.',
    'projects.viewAll': 'View all on GitHub',
    'projects.ferriskey.title': 'FerrisKey',
    'projects.ferriskey.description': "IAM platform built in Rust: OIDC, multi-tenancy, a policy engine, and Kubernetes-native, for systems where correctness isn't optional.",
    'projects.ferriscord.title': 'Ferriscord',
    'projects.ferriscord.description': 'An open-source, Discord-like communication platform: servers, channels, and realtime chat, built in Rust.',
    'projects.mestier.title': 'Mestier',
    'projects.mestier.description': 'An open-source SaaS platform that centralizes core business tools: CRM, ERP, HR, and messaging, in one system.',
    'projects.ferriskv.title': 'FerrisKV',
    'projects.ferriskv.description': 'A distributed, multi-tenant key-value database in Rust, built to expose wire-compatible protocols, Postgres among them, on top of its storage engine.',
    'projects.more.title': 'And many more...',
    'projects.more.description': 'Discover all my open-source projects on GitHub.',

    // Expertise (IAM section)
    'expertise.label': 'Expertise',
    'expertise.title': 'From identity to distributed platforms.',
    'expertise.description': 'I focus on the parts of a system where product design, security constraints and operational reality meet.',
    'expertise.iam.title': 'IAM & OIDC',
    'expertise.iam.description': 'OIDC, OAuth2, FerrisKey, token lifecycle, multi-tenant realms and secure product boundaries. Protocol implementation from spec',
    'expertise.authz.title': 'Authorization & policy',
    'expertise.authz.description': 'OPA, RBAC, ABAC, delegated authorization and policy-as-code. Fine-grained access control that stays auditable when security teams need answers.',
    'expertise.platform.title': 'Platform identity',
    'expertise.platform.description': 'Kubernetes-native identity, service-to-service auth, mTLS and SPIFFE/SPIRE between workloads. IAM at the infrastructure layer.',
    'expertise.distributed.title': 'Distributed security',
    'expertise.distributed.description': 'Event-driven auth flows, Kafka-based audit pipelines, and consistency decisions for systems that stay explainable under failure.',
    'expertise.ops.title': 'Operational security',
    'expertise.ops.description': 'Auth systems that are observable and recoverable. Structured audit logs, token flow metrics, and SLOs for security-critical infrastructure.',

    // Experience
    'experience.label': 'Experience',
    'experience.title': 'Professional Journey',
    'experience.description': 'From writing code to designing the systems around it.',
    'experience.entry1.date': '2025 - Present',
    'experience.entry1.role': 'Software Engineer',
    'experience.entry1.company': 'Cloud IAM',
    'experience.entry1.description': 'Design and build identity and access management infrastructure. Work spans API design, distributed systems, and production operations.',
    'experience.entry2.date': '2022 - Present',
    'experience.entry2.role': 'Software Architect & Lead Maintainer',
    'experience.entry2.company': 'FerrisKey & Open Source',
    'experience.entry2.description': 'Co-founded FerrisKey, an open-source IAM platform in Rust. Designed the architecture, defined service boundaries and API contracts, and still own the full production stack, from CI/CD to observability.',
    'experience.entry3.date': '2019 - 2022',
    'experience.entry3.role': 'Software Engineer & System Designer',
    'experience.entry3.company': 'Company',
    'experience.entry3.description': 'Designed and built web application architectures with Vue.js and AdonisJS. Defined CI/CD pipelines, data models, and mentored developers on clean architecture practices.',
    'experience.entry4.date': '2016 - 2019',
    'experience.entry4.role': 'Software Developer',
    'experience.entry4.company': 'Company',
    'experience.entry4.description': 'Built web applications and discovered the importance of well-structured codebases and the open-source ecosystem.',

    // Skills (band)
    'skills.label': 'Stack',

    // Articles
    'articles.label': 'Blog',
    'articles.title': 'Latest articles',
    'articles.description': 'Stay up to date with the latest news and updates.',
    'articles.viewAll': 'View all articles',

    // Contact
    'contact.title': "Let's design something together",
    'contact.description': 'Have a system to design, an architecture to review, or just want to talk tech? Feel free to reach out.',
    'contact.email': 'Send an email',
    'contact.linkedin': 'LinkedIn',
  },
} as const

export type UiKey = keyof (typeof ui)['en']
