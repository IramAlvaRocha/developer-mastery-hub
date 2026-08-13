import { useEffect, useState } from "react";
import {
  buildCourses,
  curriculumFromModules,
  type Course,
  type CurriculumItem,
} from "@/lib/courseCatalog";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Exercise, Module } from "@/lib/types";

interface PublicExercise {
  exercise_ref: number;
  title: string;
  stars: number;
  category: string;
  step: number | null;
  description: string;
  objective: string;
  tags: string[] | null;
  position: number;
}

interface PublicModule {
  key: string;
  name: string;
  icon: string;
  badge: string;
  color: string;
  description: string;
  topics: string[] | null;
  position: number;
  exercises: PublicExercise[];
}

interface PublicCourseRow {
  course_key: string;
  course_name: string;
  course_description: string;
  course_icon: string;
  course_color: string;
  course_position: number;
  curriculum: PublicModule[];
}

function exerciseSummary(row: PublicExercise): Exercise {
  return {
    id: row.exercise_ref,
    title: row.title,
    stars: row.stars,
    category: row.category,
    step: row.step ?? undefined,
    description: row.description,
    objective: row.objective,
    tags: row.tags ?? [],
    fileName: "",
    explanationText: "",
    codeSnippet: "",
    inputs: {},
    completeCode: "",
  };
}

function courseFromRow(row: PublicCourseRow): Course {
  const modules = (row.curriculum ?? []).map(
    (module): Module => ({
      key: module.key,
      name: module.name,
      icon: module.icon,
      badge: module.badge,
      color: module.color,
      group: row.course_name,
      courseKey: row.course_key,
      desc: module.description,
      topics: module.topics ?? [],
      exercises: (module.exercises ?? []).map(exerciseSummary),
    }),
  );
  return {
    key: row.course_key,
    name: row.course_name,
    description: row.course_description,
    icon: row.course_icon,
    color: row.course_color,
    position: row.course_position,
    modules,
    topics: Array.from(
      new Set(modules.flatMap((module) => module.topics)),
    ).slice(0, 12),
    exerciseCount: modules.reduce(
      (total, module) => total + module.exercises.length,
      0,
    ),
  };
}

async function loadDevelopmentFallback(): Promise<Course[]> {
  if (!import.meta.env.DEV) return [];
  const { ALL_MODULES } = await import("@/data");
  return buildCourses(ALL_MODULES);
}

export function useCourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!isSupabaseConfigured) {
        const fallback = await loadDevelopmentFallback();
        if (active) {
          setCourses(fallback);
          setLoading(false);
        }
        return;
      }
      const supabase = getSupabase();
      if (!supabase) return;
      const { data, error: requestError } = await supabase.rpc(
        "get_public_course_curriculum",
        { p_course_key: null },
      );
      if (!active) return;
      if (requestError) {
        setError(requestError.message);
        setCourses(await loadDevelopmentFallback());
        setLoading(false);
        return;
      }
      setCourses(
        ((data ?? []) as PublicCourseRow[])
          .map(courseFromRow)
          .sort((a, b) => a.position - b.position),
      );
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { courses, loading, error };
}

export function useCourseCurriculum(courseKey: string) {
  const [items, setItems] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      if (!isSupabaseConfigured) {
        const fallback = await loadDevelopmentFallback();
        const course = fallback.find((item) => item.key === courseKey);
        if (active) {
          setItems(course ? curriculumFromModules(course.modules) : []);
          setLoading(false);
        }
        return;
      }
      const supabase = getSupabase();
      if (!supabase) return;
      const { data, error } = await supabase.rpc(
        "get_public_course_curriculum",
        { p_course_key: courseKey },
      );
      if (!active) return;
      if (error) {
        setItems([]);
        setLoading(false);
        return;
      }
      const row = ((data ?? []) as PublicCourseRow[])[0];
      const course = row ? courseFromRow(row) : null;
      setItems(course ? curriculumFromModules(course.modules) : []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [courseKey]);

  return { items, loading };
}

