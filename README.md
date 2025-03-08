# CarePulse Backend

A robust and scalable backend service for the CarePulse platform, handling authentication and appointment management.

## Technology Stack

- **Runtime**: [Bun](https://bun.sh/) - A fast JavaScript runtime and toolkit
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript
- **Framework**: [Express.js](https://expressjs.com/) - Web framework for Node.js
- **Database**: [Neon Postgres](https://neon.tech/) - Serverless Postgres database
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for SQL databases

## Features

- **Authentication System**

  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, Patient)

- **Appointment Management**
  - Create, read, manage appointments status
  - Appointment scheduling and availability checking

## Getting Started

### Prerequisites

- Bun installed (version 1.0.0 or later)
- Neon Postgres database account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/its-dorra/carepulse-backend.git
   cd carepulse-backend
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your Neon Postgres credentials and other configuration values.

4. Run database migrations:

   ```bash
   bun run migrate
   ```

5. Start the development server:
   ```bash
   bun run dev
   ```
