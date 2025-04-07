# Front-end for [voluntar.xyz](https://voluntar.xyz)

<img src="public/assets/favicon.svg">

**Să facem să fie bine!**

A centralized platform for discovering volunteering opportunities.

## Getting Started

### Prerequisites

- Node.js v16+
- npm/yarn/pnpm

### Installation

```bash
git clone https://github.com/voluntar-xyz-main/front_one
cd front_one
pnpm install
pnpm run dev
```

### Contributing

We welcome all contributions! Here's how to help:

- Code Contributions:

  1. Fork the repository
  2. Create a feature branch (`git checkout -b feature/amazing-feature`)
  3. Submit a PR with clear description

- Non-Code Contributions:

  1. Report bugs via Issues
  2. Suggest improvements via Issues

- Reach out at [salut@voluntar.xyz](mailto:salut@voluntar.xyz)

## Project Structure

```
src/
├── App.tsx          # Main application entry point
├── config/          # Routing & navigation configuration
├── data/            # Data layer (currently Supabase integration)
├── components/      # Reusable UI components
└── layouts/         # Page layout templates
```

### Key Files Explained

- **`src/data/`**: Contains all data source integrations
  - Current implementation uses Supabase (PostgreSQL)
- **`src/components/`**: Presentational components
- **`src/layouts/`**: Page scaffolding with responsive handling

## Good First Issues

Help wanted from all skill levels! Here are starter suggestions:

| Issue                                                                                 | Skill Level | Tags             |
| ------------------------------------------------------------------------------------- | ----------- | ---------------- |
| [🌱 Lightweight Code Review](https://github.com/voluntar-xyz-main/front_one/issues/2) | Any         | Review, Feedback |

## Docs

| Doc                                                              | Type | Tags |
| ---------------------------------------------------------------- | ---- | ---- |
| [ADR000: Architecture for Early-Stage](docs/decisions/ADR000.md) | ADR  |      |

## Tech Stack

- **Frontend**: React + TypeScript
- **State Management**: Context API, React Query, hooks
- **Styling**: Tailwind
- **Data Layer**: Supabase
