import type { Course } from "@/lib/courseCatalog";
import { moduleColorStyle } from "@/lib/moduleColors";
import { useAnimatedWidth } from "@/lib/useReducedMotion";

interface Props {
  course: Course;
  progress?: number;
  recentLabel?: string;
}

export default function CourseCard({ course, progress, recentLabel }: Props) {
  const width = useAnimatedWidth(progress ?? 0);
  return (
    <a
      href={`/cursos/${course.key}`}
      style={moduleColorStyle(course.color)}
      className="course-card group mod-card-hover flex h-full flex-col rounded-[26px] border border-line bg-surface p-5 text-left transition-all hover:-translate-y-1 hover:shadow-float"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="mod-icon-bg flex h-12 w-12 items-center justify-center rounded-[18px] font-mono text-lg font-bold mod-text">
          {course.icon}
        </span>
        <span className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
          {course.modules.length} módulos
        </span>
      </div>
      <div className="mt-5 flex-1">
        <h2 className="mod-title-hover text-lg font-semibold tracking-tight text-ink transition-colors">
          {course.name}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
          {course.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {course.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-1 text-[10px] text-muted"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-5 border-t border-line-soft pt-4">
        {progress == null ? (
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted">
              {course.exerciseCount > 0
                ? `${course.exerciseCount} ejercicios`
                : "Temario incluido"}
            </span>
            <span className="mod-text">Ver curso →</span>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="truncate text-muted">
                {recentLabel ?? "Tu progreso"}
              </span>
              <span className="font-bold mod-text">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="mod-progress" style={{ width: `${width}%` }} />
            </div>
          </>
        )}
      </div>
    </a>
  );
}

