-- Convierte los grupos históricos en cursos padre sin eliminar módulos,
-- ejercicios ni progreso. Puede ejecutarse más de una vez.

CREATE TABLE IF NOT EXISTS public.courses (
  key          text PRIMARY KEY,
  name         text NOT NULL,
  description  text,
  icon         text,
  color        text,
  position     int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS course_key text;

WITH grouped_modules AS (
  SELECT DISTINCT
    COALESCE("group", 'Otros') AS group_name,
    CASE COALESCE("group", 'Otros')
      WHEN 'AWS' THEN 'aws'
      WHEN 'Buenas Practicas' THEN 'best-practices'
      WHEN 'SOLID & Clean Code' THEN 'solid-clean-code'
      WHEN 'Frontend' THEN 'frontend'
      WHEN 'Backend & Datos' THEN 'backend-data'
      WHEN 'Cloud & Serverless' THEN 'cloud-serverless'
      WHEN 'DevOps & Git' THEN 'devops-git'
      WHEN 'APIs & Seguridad' THEN 'apis-security'
      WHEN 'Testing & Calidad' THEN 'testing-quality'
      WHEN 'TypeScript' THEN 'typescript'
      WHEN 'TS Arrays' THEN 'typescript-arrays'
      ELSE 'course-' || substr(md5(COALESCE("group", 'Otros')), 1, 12)
    END AS course_key
  FROM public.modules
)
INSERT INTO public.courses (key, name, position, is_published)
SELECT
  grouped_modules.course_key,
  grouped_modules.group_name,
  COALESCE((
    SELECT min(m.position)
    FROM public.modules m
    WHERE COALESCE(m."group", 'Otros') = grouped_modules.group_name
  ), 0),
  true
FROM grouped_modules
ON CONFLICT (key) DO NOTHING;

UPDATE public.modules
SET course_key = CASE COALESCE("group", 'Otros')
  WHEN 'AWS' THEN 'aws'
  WHEN 'Buenas Practicas' THEN 'best-practices'
  WHEN 'SOLID & Clean Code' THEN 'solid-clean-code'
  WHEN 'Frontend' THEN 'frontend'
  WHEN 'Backend & Datos' THEN 'backend-data'
  WHEN 'Cloud & Serverless' THEN 'cloud-serverless'
  WHEN 'DevOps & Git' THEN 'devops-git'
  WHEN 'APIs & Seguridad' THEN 'apis-security'
  WHEN 'Testing & Calidad' THEN 'testing-quality'
  WHEN 'TypeScript' THEN 'typescript'
  WHEN 'TS Arrays' THEN 'typescript-arrays'
  ELSE 'course-' || substr(md5(COALESCE("group", 'Otros')), 1, 12)
END
WHERE course_key IS NULL;

ALTER TABLE public.modules ALTER COLUMN course_key SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'modules_course_key_fkey'
      AND conrelid = 'public.modules'::regclass
  ) THEN
    ALTER TABLE public.modules
      ADD CONSTRAINT modules_course_key_fkey
      FOREIGN KEY (course_key) REFERENCES public.courses(key)
      ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_key);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
  user_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_key     text NOT NULL REFERENCES public.courses(key) ON UPDATE CASCADE ON DELETE CASCADE,
  enrolled_at    timestamptz NOT NULL DEFAULT now(),
  last_opened_at timestamptz,
  PRIMARY KEY (user_id, course_key)
);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_user
  ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course
  ON public.course_enrollments(course_key);

-- Deduplica las inscripciones históricas de módulos en su curso padre.
-- `progress` no se modifica: sus claves de módulo y ejercicio siguen vigentes.
INSERT INTO public.course_enrollments (
  user_id,
  course_key,
  enrolled_at,
  last_opened_at
)
SELECT
  e.user_id,
  m.course_key,
  min(e.enrolled_at),
  max(e.last_opened_at)
FROM public.enrollments e
JOIN public.modules m ON m.key = e.module_key
GROUP BY e.user_id, m.course_key
ON CONFLICT (user_id, course_key) DO UPDATE
SET enrolled_at = LEAST(
      public.course_enrollments.enrolled_at,
      EXCLUDED.enrolled_at
    ),
    last_opened_at = CASE
      WHEN public.course_enrollments.last_opened_at IS NULL
        THEN EXCLUDED.last_opened_at
      WHEN EXCLUDED.last_opened_at IS NULL
        THEN public.course_enrollments.last_opened_at
      ELSE GREATEST(
        public.course_enrollments.last_opened_at,
        EXCLUDED.last_opened_at
      )
    END;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS courses_select_published_or_admin ON public.courses;
CREATE POLICY courses_select_published_or_admin ON public.courses
  FOR SELECT TO anon, authenticated
  USING (is_published OR public.is_admin());

DROP POLICY IF EXISTS courses_insert_admin ON public.courses;
CREATE POLICY courses_insert_admin ON public.courses
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS courses_update_admin ON public.courses;
CREATE POLICY courses_update_admin ON public.courses
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS courses_delete_admin ON public.courses;
CREATE POLICY courses_delete_admin ON public.courses
  FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS course_enrollments_select_own_or_admin
  ON public.course_enrollments;
CREATE POLICY course_enrollments_select_own_or_admin
  ON public.course_enrollments
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

DROP POLICY IF EXISTS course_enrollments_insert_own
  ON public.course_enrollments;
CREATE POLICY course_enrollments_insert_own
  ON public.course_enrollments
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.key = course_enrollments.course_key
        AND c.is_published
    )
  );

DROP POLICY IF EXISTS course_enrollments_update_own
  ON public.course_enrollments;
CREATE POLICY course_enrollments_update_own
  ON public.course_enrollments
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS course_enrollments_delete_own
  ON public.course_enrollments;
CREATE POLICY course_enrollments_delete_own
  ON public.course_enrollments
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- El contenido completo del ejercicio exige inscripción al curso padre.
DROP POLICY IF EXISTS exercises_select_published_or_admin ON public.exercises;
DROP POLICY IF EXISTS exercises_select_enrolled_or_admin ON public.exercises;
CREATE POLICY exercises_select_enrolled_or_admin ON public.exercises
  FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR (
      exercises.is_published
      AND EXISTS (
        SELECT 1
        FROM public.modules m
        JOIN public.courses c ON c.key = m.course_key
        JOIN public.course_enrollments ce
          ON ce.course_key = m.course_key
         AND ce.user_id = (SELECT auth.uid())
        WHERE m.key = exercises.module_key
          AND m.is_published
          AND c.is_published
      )
    )
  );

-- Guardar o modificar progreso también depende de la inscripción al curso.
DROP POLICY IF EXISTS progress_insert_enrolled ON public.progress;
CREATE POLICY progress_insert_enrolled ON public.progress
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1
      FROM public.modules m
      JOIN public.course_enrollments ce
        ON ce.course_key = m.course_key
       AND ce.user_id = (SELECT auth.uid())
      WHERE m.key = progress.module_key
    )
  );

DROP POLICY IF EXISTS progress_update_enrolled ON public.progress;
CREATE POLICY progress_update_enrolled ON public.progress
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1
      FROM public.modules m
      JOIN public.course_enrollments ce
        ON ce.course_key = m.course_key
       AND ce.user_id = (SELECT auth.uid())
      WHERE m.key = progress.module_key
    )
  );

DROP POLICY IF EXISTS progress_delete_enrolled ON public.progress;
CREATE POLICY progress_delete_enrolled ON public.progress
  FOR DELETE TO authenticated
  USING (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1
      FROM public.modules m
      JOIN public.course_enrollments ce
        ON ce.course_key = m.course_key
       AND ce.user_id = (SELECT auth.uid())
      WHERE m.key = progress.module_key
    )
  );

-- Catálogo público deliberadamente reducido. No devuelve code_snippet,
-- inputs, complete_code, format_payload, simulation ni explicaciones.
CREATE OR REPLACE FUNCTION public.get_public_course_curriculum(
  p_course_key text DEFAULT NULL
)
RETURNS TABLE (
  course_key text,
  course_name text,
  course_description text,
  course_icon text,
  course_color text,
  course_position int,
  curriculum jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    c.key,
    c.name,
    c.description,
    c.icon,
    c.color,
    c.position,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'key', m.key,
          'name', m.name,
          'icon', m.icon,
          'badge', m.badge,
          'color', m.color,
          'description', m.description,
          'topics', m.topics,
          'position', m.position,
          'exercises', (
            SELECT COALESCE(
              jsonb_agg(
                jsonb_build_object(
                  'exercise_ref', e.exercise_ref,
                  'title', e.title,
                  'stars', e.stars,
                  'category', e.category,
                  'step', e.step,
                  'description', e.description,
                  'objective', e.objective,
                  'tags', e.tags,
                  'position', e.position
                )
                ORDER BY e.position, e.exercise_ref
              ),
              '[]'::jsonb
            )
            FROM public.exercises e
            WHERE e.module_key = m.key
              AND e.is_published
          )
        )
        ORDER BY m.position, m.key
      ) FILTER (WHERE m.key IS NOT NULL),
      '[]'::jsonb
    )
  FROM public.courses c
  LEFT JOIN public.modules m
    ON m.course_key = c.key
   AND m.is_published
  WHERE c.is_published
    AND (p_course_key IS NULL OR c.key = p_course_key)
  GROUP BY c.key, c.name, c.description, c.icon, c.color, c.position
  ORDER BY c.position, c.key;
$$;

REVOKE ALL ON public.courses,
              public.course_enrollments
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.course_enrollments TO authenticated;
GRANT UPDATE (last_opened_at) ON public.course_enrollments TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_public_course_curriculum(text)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_course_curriculum(text)
  TO anon, authenticated;
