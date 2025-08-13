# Overview

This is a prompt comparison tool built with React and Express.js that allows users to compare two text prompts side by side. The application features a modern UI built with shadcn/ui components and Tailwind CSS, providing functionality to input, edit, and analyze differences between prompt texts. The system includes real-time statistics tracking (word count, character count, line count) and comparison tools for highlighting differences and calculating similarity scores.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React hooks (useState, useCallback, useMemo) for local component state
- **Routing**: Wouter for client-side routing
- **Data Fetching**: TanStack Query (React Query) for server state management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Hot reload with Vite integration for full-stack development

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: 
  - Users table with authentication fields (id, username, password)
  - Prompts table linked to users with content and metadata
- **Migrations**: Drizzle Kit for schema migrations

## Component Structure
- **Layout**: Responsive design with resizable panels for side-by-side comparison
- **Core Components**: 
  - PromptPanel: Text input/preview with markdown support
  - ComparisonTools: Statistics display and comparison utilities
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, tooltips, and data display components

## Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development**: Hot module replacement and error overlay for development experience

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **Build Tools**: Vite, TypeScript, esbuild for production builds
- **UI Library**: Radix UI primitives, Lucide React icons, class-variance-authority for component variants

## Database and Backend
- **Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for runtime type validation and schema validation

## Styling and UI
- **CSS Framework**: Tailwind CSS with PostCSS and Autoprefixer
- **Component System**: shadcn/ui with Radix UI primitives
- **Fonts**: Google Fonts integration (Inter, JetBrains Mono)

## Development and Utilities
- **Package Manager**: npm with package-lock.json for dependency locking
- **Development Tools**: tsx for TypeScript execution, Replit-specific plugins for cloud development
- **Text Processing**: React Markdown for markdown rendering, date-fns for date utilities