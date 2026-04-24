# pi-astro-mcp

A [pi](https://pi.dev) extension that connects to the [Astro Docs MCP server](https://mcp.docs.astro.build/) and exposes a `search_astro_docs` tool for searching the official Astro framework documentation.

## Features

- **Search Astro Docs** — sends queries to the Astro Docs MCP server and returns relevant documentation content
- **Auto-connects** on session start, auto-reconnects on failure
- **Auto-discovered** — no setup beyond installing the package

## Install

```bash
pi install npm:pi-astro-mcp
```

Or install from git:

```bash
pi install git:github.com/<your-user>/pi-astro-mcp
```

## Usage

Once installed, the `search_astro_docs` tool is available to the LLM automatically. Just ask about Astro:

```
How do I use Astro view transitions?
What are Astro content collections?
How does SSR work in Astro?
```

## Uninstall

```bash
pi remove npm:pi-astro-mcp
```

## Development

To work on the extension locally:

```bash
# Test with the local extension
pi -e ./extensions/index.ts

# Or install as a local package
pi install /path/to/pi-astro-mcp
```

## License

MIT