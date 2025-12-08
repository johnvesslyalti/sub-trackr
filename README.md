# SubTrackr 🟣

**SubTrackr** is a modern, server-actions-first application designed to help users track, manage, and analyze their recurring subscriptions. Built with the latest Next.js 15 features, it offers a seamless mobile-first experience with powerful data visualization and automated email reminders.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

- **🔐 Secure Authentication**: Seamless Google OAuth login powered by **Better Auth**.
- **📝 Subscription Management**: Add, edit, and delete subscriptions with an intuitive UI.
- **📅 Flexible Billing**: Support for Weekly, Monthly, Yearly, and Custom billing cycles.
- **🔔 Smart Notifications**: Automated email reminders sent via **Resend** before renewals.
- **📊 Interactive Dashboard**: Visualize spending habits using **Apache Echarts**.
- **📂 History & Analytics**: detailed history of previous payments and platform-based filtering.
- **⚡ Server Actions-First**: Highly efficient data mutations without external API overhead.
- **🎨 Themeable UI**: Beautiful Light/Dark mode support using **Shadcn UI**.
- **📱 Mobile-First**: Fully responsive design optimized for all devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Visualization**: [Apache Echarts](https://echarts.apache.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Email**: [Resend](https://resend.com/)
- **Architecture**: Next.js Server Actions & API Routes

### Deployment
- **Provider**: [Vercel](https://vercel.com/)

## 📂 Project Structure

```bash
├── public/              # Static assets
├── prisma/              # Database schema and migrations
├── src/
│   ├── app/             # Next.js App Router pages & layouts
│   │   ├── (auth)/      # Authentication routes
│   │   ├── (dashboard)/ # Protected dashboard routes
│   │   └── api/         # API routes (webhooks, auth endpoints)
│   ├── components/      # Reusable UI components (Shadcn)
│   │   ├── ui/          # Primitives (buttons, inputs)
│   │   └── charts/      # Echarts configurations
│   ├── lib/             # Utility functions & configs
│   │   ├── auth.ts      # Better Auth configuration
│   │   ├── prisma.ts    # Prisma client singleton
│   │   └── utils.ts     # Helper functions
│   ├── server/          # Server Actions (Business Logic)
│   │   ├── actions/     # Mutations (Add, Edit, Delete)
│   │   └── queries/     # Data fetching functions
│   ├── store/           # Zustand stores
│   └── types/           # Global TypeScript definitions
├── .env                 # Environment variables
└── package.json
````

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1\. Clone the repository

```bash
git clone [https://github.com/yourusername/sub-trackr.git](https://github.com/yourusername/sub-trackr.git)
cd sub-trackr
```

### 2\. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3\. Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/subtrackr?schema=public"

# Auth (Better Auth)
BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email (Resend)
RESEND_API_KEY="re_123456789"
```

### 4\. Database Setup

Initialize the Prisma ORM and push the schema to your database.

```bash
npx prisma generate
npx prisma db push
```

### 5\. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 🧪 Scripts

  - `npm run dev`: Starts the development server.
  - `npm run build`: Builds the app for production.
  - `npm run start`: Runs the built app in production mode.
  - `npm run lint`: Lints the codebase.
  - `npx prisma studio`: Opens a GUI to view and edit database data.

## 🤝 Contributing

Contributions are welcome\! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

Made with ❤️ using Next.js and Prisma.

```
```