# Finance Management SaaS

MERN implementation of the scope-locked V1 SRS.

## Run

```bash
npm run install:all
copy server\.env.example server\.env
npm run seed:admin
npm run dev
```

Server: `http://localhost:5000/api/v1`
Client: `http://localhost:5173`

## V1 Rules Implemented

- Two fixed roles: `Super Admin`, `User`
- Access token plus DB-backed refresh token model
- Per-user isolation for financial records, with Super Admin read-only oversight
- Static categories and USD-only settings validation
- Model, controller, service, route, and validation files per module
- Standard `{ success, message, data, errors }` API responses
