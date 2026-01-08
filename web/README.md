# JaZeR Master Flow Knowledge Hub - Web Interface

A modern, animated web interface for exploring the JaZeR Knowledge Hub and Rap Dictionary.

## Features

- **Interactive Knowledge Hub Explorer**: Browse 25+ domain categories
- **Rap Dictionary**: A-Z word bank with definitions and usage
- **Smooth Animations**: GSAP-powered transitions and effects
- **Responsive Design**: Works seamlessly on all devices
- **SVG Logo Integration**: Professional branding with custom logos

## Assets

The web interface uses the following brand assets:

- **`/public/logo.svg`**: Main logo (450 x 150 px) - Used in headers and hero sections
- **`/public/icon.svg`**: Icon version (100 x 100 px) - Used in footers, favicons, and small spaces

### Logo Usage

The Logo component provides easy access to both variants:

```jsx
import { Logo } from './components/common/Logo';

// Full logo (default)
<Logo variant="full" size="large" />

// Icon version
<Logo variant="icon" size="small" />
```

Available sizes: `small`, `medium`, `large`, `xlarge`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool with HMR
- **GSAP**: GreenSock Animation Platform for smooth animations
- **CSS3**: Custom properties and modern layouts

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
