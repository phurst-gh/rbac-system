src/
├── auth/               ← User management domain
│   ├── controllers/
│   ├── services/authService.ts
│   ├── middleware/requireAuth.ts
│   ├── lib/jwt.ts & cookies.ts
│   ├── routes.ts
│   └── index.ts
├── users/              ← User management domain
├── rbac/               ← Role-based access domain
├── shared/
└── routes/index.ts