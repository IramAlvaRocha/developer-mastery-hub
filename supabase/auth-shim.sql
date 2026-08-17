-- ============================================================================
-- Shim de compatibilidad Supabase para Postgres vanilla (solo pruebas).
-- Prepara lo que GoTrue y supabase/schema.sql necesitan:
--   roles anon / authenticated / service_role / authenticator / supabase_auth_admin
--   schema auth (GoTrue crea auth.users y el resto al migrar)
--   auth.uid() (en Supabase lo crea el init del Postgres, no GoTrue)
-- ============================================================================

CREATE ROLE anon NOLOGIN NOBYPASSRLS;
CREATE ROLE authenticated NOLOGIN NOBYPASSRLS;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE ROLE authenticator LOGIN NOINHERIT NOBYPASSRLS PASSWORD 'postgres';
CREATE ROLE supabase_auth_admin LOGIN NOINHERIT CREATEROLE NOBYPASSRLS PASSWORD 'postgres';

GRANT anon, authenticated, service_role TO authenticator;

-- GoTrue necesita estas extensiones para los defaults de auth.users.
CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION supabase_auth_admin;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA auth;

-- Nota: auth.uid() y auth.role() las crea la migración de GoTrue
-- (como supabase_auth_admin), por eso no se definen aquí.

ALTER ROLE supabase_auth_admin SET search_path = 'auth';

-- Privilegios para que PostgREST funcione como en Supabase:
-- service_role tiene acceso total (BYPASSRLS + GRANTs) sobre lo que
-- supabase/schema.sql cree después.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
