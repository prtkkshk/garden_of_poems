# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Run linting**: `npm run lint`
- **Install dependencies**: `npm install`

## 🏗️ Architecture Overview

This is a Next.js 14 application using the App Router with Tailwind CSS and Supabase.

### Core Structure
- **`app/`**: Next.js App Router pages
  - `page.tsx`: Main garden dashboard showing all poems
  - `layout.tsx`: Root layout with Google Fonts (Lora + Nunito)
  - `globals.css`: Design tokens, utilities, and global styles
  - `secret-garden/page.tsx`: Admin login page (protected route)
- **`components/`**: Reusable UI components
  - `PoemCard.tsx`: Displays individual poems with admin controls
  - `PoemModal.tsx`: Modal for reading poems (with water animation)
  - `PlantModal.tsx`: Form for creating/editing poems
  - `TagBadge.tsx`: Colored tag chips for categorization
  - `SkeletonCard.tsx`: Loading state placeholder
  - `EmptyState.tsx`: Illustration shown when no poems exist
- **`lib/`**: Utility and service files
  - `supabase.ts`: Supabase client initialization, types, constants
  - `auth.ts`: Admin password verification and session management

### Key Features
- **Supabase Integration**: Database storage for poems with Row Level Security
- **Admin System**: Password-protected `/secret-garden` route for managing content
- **Animations**: Framer Motion for interactive UI elements
- **Responsive Design**: Mobile-friendly with bottom sheet modals on small screens

### Development Notes
- Supabase setup requires running `setup.sql` in the Supabase SQL editor first
- No environment variables needed for deployment (Supabase keys are baked in for this private project)
- Admin logout is via the "Gardener" badge in the top-right corner