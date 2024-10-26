import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Nathael Bonnal",
  DESCRIPTION: "Welcome to my website, where you will find my passions, my projects, my articles and my experiences.",
  AUTHOR: "Nathael Bonnal",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "nathael@bonnal.cloud",
    HREF: "mailto:nathael@bonnal.cloud",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "nathaelb",
    HREF: "https://github.com/nathaelb"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "nathael-bonnal",
    HREF: "https://www.linkedin.com/in/nathael-bonnal/",
  },
]

