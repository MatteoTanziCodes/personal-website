import { GitHubIcon } from "@/components/icons";
import StaggerReveal from "@/components/StaggerReveal";

interface ProjectCardProps {
  title: string;
  description: string;
  year: number;
  builtWith: string[];
  github?: string;
  onClick?: () => void;
  delayOrder?: number;
}

export default function ProjectCard({
  title,
  description,
  year,
  builtWith,
  github,
  onClick,
  delayOrder = 0,
}: ProjectCardProps) {
  return (
    <StaggerReveal delayOrder={delayOrder}>
      <div
        className={`block rounded-lg p-4 mb-6 shadow-sm border border-[var(--border)]
        ${onClick ? "cursor-pointer hover:border-[#60A5FA]" : ""} 
        transition-colors`}
        onClick={onClick}
      >
        <div className="flex justify-between items-start">
          <span className="text-sm text-[var(--muted)]">{year}</span>
          {github && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(github, "_blank", "noopener,noreferrer");
              }}
              className="cursor-pointer text-xs text-[#60A5FA] flex items-center gap-1"
            >
              <GitHubIcon size={14} />
              GitHub
            </button>
          )}
        </div>
        <h3 className="text-lg font-semibold mt-1 text-[var(--fg)]">{title}</h3>
        <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {builtWith.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-[var(--card)] text-[var(--fg)] px-2 py-0.5 rounded border border-[var(--border)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </StaggerReveal>
  );
}
