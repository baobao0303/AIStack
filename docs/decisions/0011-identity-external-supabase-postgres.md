# Architectural Decision Record (ADR): 0011 Identity Service External Supabase PostgreSQL

- **Date**: 2026-05-30
- **Status**: Accepted
- **Context**: The Identity service was configured for a local PostgreSQL instance with a plaintext password committed in `appsettings.json` (see Harness backlog #5). We want to point it at an external managed Supabase PostgreSQL instance without leaking credentials into the repository or breaking the existing Npgsql/EF Core setup.

---

## 1. Decision

The Identity service keeps using **Npgsql + EF Core 6** (no provider change). The
connection target moves to an external **Supabase PostgreSQL** instance.

Credentials are supplied at runtime via **environment variables**, never via
tracked files. .NET maps double-underscore env vars onto nested config keys, so:

```
ConnectionStrings__DefaultConnection   overrides ConnectionStrings:DefaultConnection
ConnectionStrings__RedisConnection     overrides ConnectionStrings:RedisConnection
Jwt__Secret                            overrides Jwt:Secret
```

A non-secret template lives at `Identity.Api/.env.example`. The real `.env` is
gitignored.

## 2. Supabase connection requirements

- Host: `db.<project-ref>.supabase.co`, Port `5432`, Database `postgres`, User `postgres`.
- Supabase enforces TLS, so the Npgsql string MUST include
  `SSL Mode=Require;Trust Server Certificate=true`.
- Migrations are applied with `dotnet ef database update` against the same env-provided connection string.

## 3. Security consequences

- The plaintext password in committed `appsettings.json` is replaced by a
  placeholder; real values come from the environment only.
- A live Supabase credential was shared over an insecure channel during intake.
  It MUST be rotated in the Supabase dashboard and treated as compromised.
- This ADR does not change the JWT hardcoded-secret fallback (backlog #4); that
  remains tracked separately.

## 4. Validation

- `scripts/validate-quick.sh dotnet` (build + unit tests) must stay green.
- A live connectivity check (`dotnet ef database update` or a startup probe)
  is run only after the credential is rotated and exported in the environment.
