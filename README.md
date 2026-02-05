This is a **clickable prototype** built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), and [ShadCN UI](https://ui.shadcn.com).

### Stack
- **Next.js 16** (App Router)
- **Tailwind CSS 4**
- **ShadCN UI** (Button, Card, Tabs, Badge, Input, Label)

### Prototype flow
- **Home** (`/`) — Overview, tabs, and sample cards
- **Browse** (`/browse`) — List of items with search
- **Item detail** (`/item/[id]`) — Detail view for items 1, 2, 3

Add more ShadCN components with: `npx shadcn@latest add [component]`

### Design guidelines

This project includes [Vercel’s Web Interface Guidelines](https://vercel.com/design/guidelines) as a local reference:

- **Location:** [`docs/WEB_INTERFACE_GUIDELINES.md`](docs/WEB_INTERFACE_GUIDELINES.md)

To reinstall the Cursor review command: `curl -fsSL https://vercel.com/design/guidelines/install | bash`, then run `/web-interface-guidelines <file>` to audit UI code.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
