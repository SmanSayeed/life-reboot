# Life Reboot

A modern web application to help you transform your life through habit tracking, task management, and daily reflection.

## Features

- 🔐 Secure authentication with Supabase
- 📊 Track daily habits with morning, afternoon, and evening routines
- ✅ Manage tasks with a Kanban-style board
- 📝 Write daily reflections with a rich text editor
- 📱 Responsive design for desktop and mobile
- 🎨 Beautiful UI with Shadcn components
- 🌙 Light and dark mode support

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Auth**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: TailwindCSS
- **Components**: Shadcn UI
- **Rich Text Editor**: TipTap
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: date-fns

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/life-reboot.git
   cd life-reboot
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a Supabase project:
   - Go to [Supabase](https://supabase.com) and create a new project
   - Get your project URL and anon key from the project settings
   - Copy the SQL from `schema.sql` and run it in the Supabase SQL editor

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
life-reboot/
├── app/                   # Next.js app directory
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # Shadcn UI components
│   └── editor.tsx       # Rich text editor
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
│   └── supabase/       # Supabase client
├── public/             # Static files
├── styles/            # Global styles
└── types/             # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 