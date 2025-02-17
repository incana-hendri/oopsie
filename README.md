# Oopsie - Squad Infraction Management System

A modern, type-safe infraction management system built with Next.js, TypeScript, and PostgreSQL.

## Technology Stack

- **Frontend:**

  - Next.js 15 with App Router
  - React 19
  - TypeScript
  - Tailwind CSS
  - Storybook for component documentation

- **Backend:**

  - PostgreSQL 15
  - Drizzle ORM
  - NextAuth.js for authentication
  - Zod for validation

- **Development Tools:**
  - ESLint with TypeScript and Prettier integration
  - Husky for Git hooks
  - Commitlint for conventional commits
  - Docker for local development

## Prerequisites

- Node.js v20.11.1 (specified in .nvmrc)
- Docker and Docker Compose
- pnpm (recommended package manager)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd oopsie
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update the values in `.env` with your configuration.

4. **Start the development environment:**

   ```bash
   # Start Docker services
   docker-compose up -d

   # Start the development server
   pnpm dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - MailHog (email testing): http://localhost:8025

## Development Guidelines

### Code Style

We use ESLint and Prettier to maintain code quality and consistency. The configuration enforces:

- TypeScript strict mode
- React hooks best practices
- Accessibility standards
- Import sorting
- Consistent formatting

Pre-commit hooks will automatically format and lint your code.

### Git Workflow

1. **Branch Naming:**

   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Refactor: `refactor/description`

2. **Commit Messages:**
   We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

   ```
   type(scope): description

   [optional body]
   [optional footer]
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Testing Strategy

1. **Unit Tests:**

   - Components: Test rendering and interactions
   - Hooks: Test state management and side effects
   - Utils: Test pure functions and business logic

2. **Integration Tests:**

   - API endpoints
   - Authentication flows
   - Database operations

3. **E2E Tests:**
   - Critical user journeys
   - Multi-step workflows

### Component Development

1. **Create new components in `src/components`**
2. **Add Storybook stories for all components**
3. **Ensure accessibility compliance**
4. **Document props and usage**

## Environment Variables

| Variable            | Description                  | Required | Default               |
| ------------------- | ---------------------------- | -------- | --------------------- |
| `POSTGRES_USER`     | Database username            | Yes      | -                     |
| `POSTGRES_PASSWORD` | Database password            | Yes      | -                     |
| `POSTGRES_DB`       | Database name                | Yes      | -                     |
| `DATABASE_URL`      | Full database connection URL | Yes      | -                     |
| `NEXTAUTH_SECRET`   | NextAuth.js secret key       | Yes      | -                     |
| `NEXTAUTH_URL`      | NextAuth.js URL              | No       | http://localhost:3000 |
| `SMTP_HOST`         | SMTP server host             | Yes      | localhost             |
| `SMTP_PORT`         | SMTP server port             | Yes      | 1025                  |
| `SMTP_FROM`         | Default sender email         | Yes      | -                     |

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm storybook` - Start Storybook
- `pnpm build-storybook` - Build Storybook for deployment

## Deployment

1. **Build the application:**

   ```bash
   pnpm build
   ```

2. **Environment setup:**

   - Set up production database
   - Configure environment variables
   - Set up email service

3. **Start the application:**
   ```bash
   pnpm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
