import { Icon } from "@iconify/react";
import { OrbitingCircles } from "./orbiting-circles";

const innerOrbit = [
  { name: "TypeScript", icon: "devicon:typescript" },
  { name: "Rust", icon: "devicon:rust" },
  { name: "React", icon: "devicon:react" },
  { name: "Vue", icon: "devicon:vuejs" },
  { name: "Dart", icon: "devicon:dart" },
];

const middleOrbit = [
  { name: "AdonisJS", icon: "devicon:adonisjs" },
  { name: "Tailwind", icon: "devicon:tailwindcss" },
  { name: "PostgreSQL", icon: "devicon:postgresql" },
  { name: "Docker", icon: "devicon:docker" },
  { name: "Node.js", icon: "devicon:nodejs" },
  { name: "Axum", icon: "devicon:rust" },
];

const outerOrbit = [
  { name: "GitHub", icon: "mdi:github" },
  { name: "Affinity", icon: "vscode-icons:file-type-affinity" },
  { name: "Linux", icon: "devicon:linux" },
  { name: "Git", icon: "devicon:git" },
  { name: "Vite", icon: "devicon:vitejs" },
  { name: "Claude", icon: "vscode-icons:file-type-claude" },
  { name: "Redis", icon: "devicon:redis" },
  { name: "Kubernetes", icon: "devicon:kubernetes" },
];

export default function SkillsOrbit() {
  return (
    <div className="relative flex h-125 sm:h-[550px] w-full items-center justify-center overflow-hidden">
      <span className="text-3xl sm:text-4xl font-bold text-foreground pointer-events-none select-none">
        <Icon icon="lucide:code-xml" />
      </span>

      {/* Inner orbit - core languages */}
      <OrbitingCircles radius={100} iconSize={40} speed={0.8}>
        {innerOrbit.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center justify-center size-10 rounded-full border border-border bg-card shadow-sm"
            title={tech.name}
          >
            <Icon icon={tech.icon} className="size-6" />
          </div>
        ))}
      </OrbitingCircles>

      {/* Middle orbit - frameworks & tools */}
      <OrbitingCircles radius={180} iconSize={44} reverse speed={0.6}>
        {middleOrbit.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center justify-center size-11 rounded-full border border-border bg-card shadow-sm"
            title={tech.name}
          >
            <Icon icon={tech.icon} className="size-6" />
          </div>
        ))}
      </OrbitingCircles>

      {/* Outer orbit - ecosystem */}
      <OrbitingCircles radius={260} iconSize={36} speed={0.4}>
        {outerOrbit.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center justify-center size-9 rounded-full border border-border bg-card shadow-sm"
            title={tech.name}
          >
            <Icon icon={tech.icon} className="size-5" />
          </div>
        ))}
      </OrbitingCircles>
    </div>
  );
}
