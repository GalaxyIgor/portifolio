import { Link } from "@/i18n/navigation";
import { findSkill, skillAnchor } from "@/lib/skillConnections";

/** Devolve o visitante à skill correspondente no inventário da home. */
export function SkillLinks({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {stack.map((technology) => {
        const skill = findSkill(technology);
        return (
          <li key={technology}>
            {skill ? (
              <Link
                href={{ pathname: "/", hash: skillAnchor(skill) }}
                className="skill-tag ritual-control inline-flex border border-line px-3 py-1 text-base"
              >
                {technology}{" "}
                <span aria-hidden="true" className="ml-2">
                  ↗
                </span>
              </Link>
            ) : (
              <span className="inline-flex border border-line px-3 py-1 text-base text-muted">
                {technology}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
