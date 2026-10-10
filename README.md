# SoakinGarri AI — Web App

React + TypeScript + Vite front end for SoakinGarri AI: cited, RAG-grounded answers on African history.

```bash
npm install
npm run dev      # local dev server; /api is proxied to api.soakingarri.com
npm run build    # typecheck + production build
npm run lint     # oxlint
```

## Project structure

The code is organised **by feature**, not by file type. Everything one feature needs (its pages, components, hooks and API calls) lives in that feature's folder.

```
src/
├── main.tsx                 Entry point
├── styles/index.css         Tailwind setup, brand tokens, global classes
│
├── app/                     Wiring that ties features together
│   ├── App.tsx
│   ├── providers.tsx        React Query + antd theme
│   ├── router.tsx           Every route, grouped under its layout
│   ├── theme.ts             antd themes (app-wide and auth/gold)
│   └── layouts/
│       ├── AuthLayout/      Signed-out screens: artwork + form panel
│       └── MainLayout/      Signed-in app: sidebar + page area
│
├── features/
│   ├── auth/                Login, sign-up, password reset, email verification
│   ├── chat/                Ask sessions, messages, file attachments
│   ├── dashboard/           Home screen
│   ├── history/             Past chat sessions
│   ├── settings/            Settings screen
│   └── profile/             Profile screen
│
└── shared/                  Feature-agnostic code any feature may use
    ├── api/                 Axios client (auth + token refresh), endpoints, error helpers
    ├── config/routes.ts     All client-side paths (ROUTES)
    ├── lib/format.ts        Date, size and name formatters
    └── ui/                  Reusable UI: Button, Input, PageHeader, FormError…
```

Each feature folder uses the same layout, and only creates the folders it needs:

```
features/<name>/
├── index.ts         Public API: the only file other code may import from
├── pages/           Route-level screens
├── components/      UI used by this feature (with an index.ts barrel)
├── hooks/           Stateful logic pulled out of pages
├── api/             React Query hooks + server types for this feature
├── utils/           Pure helpers
├── types.ts         UI-side types
└── data.ts          Static content / placeholders until the API serves it
```

## Rules of the road

1. **Import other features only through their `index.ts`.** Write `import { useUser } from '@/features/auth'`, never `'@/features/auth/api/useAuth'`. That lets a feature reorganise its internals freely.
2. **`shared/` never imports from `features/` or `app/`.** If shared code needs something feature-specific, it isn't shared code.
3. **Use the `@/` alias** (`@/shared/ui`) instead of long `../../../` paths.
4. **Link with `ROUTES`**, not string literals: `navigate(ROUTES.chatSession(id))`. Use `withQuery(ROUTES.checkEmail, { email })` for query strings.
5. **Pages don't wrap themselves in a layout.** The router places each route under `AuthLayout` or `MainLayout`.
6. **Recolor antd components through `app/theme.ts`**, not Tailwind classes. antd's styles are unlayered, so they override Tailwind utilities.

## Adding a feature

1. Create `src/features/<name>/` with `pages/` and an `index.ts` that exports the page.
2. Add its path to `ROUTES` in `shared/config/routes.ts`.
3. Add a `<Route>` under the right layout in `app/router.tsx`.
4. If it belongs in the sidebar, add an entry to `NAV_PRIMARY` or `NAV_SECONDARY` in `app/layouts/MainLayout/Sidebar.tsx`.
