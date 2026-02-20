/**
 * Central site metadata — single source of truth.
 * Update this file when identity or social links change.
 */

export const SITE = {
  name: "Nathael B.",
  title: "Nathael B. — Software Engineer · Distributed Systems",
  description:
    "Software engineer designing cloud-native architectures, leading open-source initiatives, and building identity systems at scale. Kubernetes-native, distributed systems, IAM.",
  url: "https://bonnal.cloud",
  author: "Nathael Bonnal",
  locale: "en_US",
  twitterHandle: "@nathaelb",

  // Structured data (JSON-LD)
  jobTitle: "Software Engineer",
  sameAs: [
    "https://github.com/nathael-bonnal",
    "https://linkedin.com/in/nathael-bonnal",
  ],
} as const;

export type SiteMeta = {
  title?: string;
  description?: string;
  ogImage?: string;
  noindex?: boolean;
  canonical?: string;
};
