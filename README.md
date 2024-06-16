# About

I'm Kuzma, I live with your finances. I take responsibility and help you with emotions. You and I will make finances simple and understandable.

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build --preset=firebase
```

Deploy

```bash
firebase deploy --only functions:server,hosting 
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
