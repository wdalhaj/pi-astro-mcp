# pi-astro-mcp

A [pi](https://pi.dev) extension that connects to the [Astro Docs MCP server](https://mcp.docs.astro.build/) and exposes a `search_astro_docs` tool for searching the official Astro framework documentation.

Works on **macOS**, **Linux**, and **Windows** — no native binaries, no shell commands, just HTTPS.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [pi](https://pi.dev) — install with:

```bash
npm install -g @mariozechner/pi-coding-agent
```

> **New to pi?** Run `pi` after installing, then `/login` to authenticate with your preferred provider (Anthropic, OpenAI, etc.). See [pi providers](https://pi.dev) for the full list.

## Install

```bash
pi install git:github.com/wdalhaj/pi-astro-mcp
```

That's it. `pi install` clones the repo and runs `npm install` automatically.

<details>
<summary>Other install methods</summary>

**Pin to a specific version (tag or commit):**

```bash
pi install git:github.com/wdalhaj/pi-astro-mcp@v1.0.0
```

**Local path (for development):**

```bash
pi install /path/to/pi-astro-mcp
```

</details>

## Usage

Start pi as normal:

```bash
pi
```

The extension auto-connects to the Astro Docs MCP server on startup. You'll see a notification:

```
🚀 Astro Docs MCP: connected (1 tool)
```

Then just ask about Astro — the LLM will use `search_astro_docs` automatically:

```
How do I use Astro view transitions?
What are Astro content collections?
How does SSR work in Astro?
Explain Astro islands architecture
```

If the connection drops, the extension auto-reconnects on the next tool call.

## Troubleshooting

**"connection failed" on startup**

The Astro Docs MCP server is at `https://mcp.docs.astro.build/mcp`. Make sure you have internet access and the server is reachable:

```bash
curl -s -o /dev/null -w "%{http_code}" https://mcp.docs.astro.build/mcp
# Should return 200 or 405
```

**"Cannot find module" errors**

Reinstall to re-fetch dependencies:

```bash
pi install git:github.com/wdalhaj/pi-astro-mcp
```

**Extension not loading**

Check that pi can see it:

```bash
pi list
```

If it doesn't appear, reinstall. If it does appear but doesn't work, try:

```bash
pi -e git:github.com/wdalhaj/pi-astro-mcp   # test without auto-discovery
```

## Uninstall

```bash
pi remove git:github.com/wdalhaj/pi-astro-mcp
```

## Development

Clone and test locally:

```bash
git clone https://github.com/wdalhaj/pi-astro-mcp.git
cd pi-astro-mcp
npm install

# Test with the local extension
pi -e ./extensions/index.ts

# Or install as a local package
pi install /path/to/pi-astro-mcp
```

## How It Works

The extension uses the [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) to connect to the remote Astro Docs MCP server. No local server process is needed — the extension connects directly over HTTPS on each session start.

```
pi  →  extension  →  StreamableHTTPClientTransport  →  https://mcp.docs.astro.build/mcp
```

The MCP server exposes a single tool (`search_astro_docs`) which the extension registers with pi so the LLM can call it like any other tool.

## Publish (maintainers)

```bash
npm version patch    # bump version
git push && git push --tags
npm publish
```

Users update with `pi update git:github.com/wdalhaj/pi-astro-mcp`.

## License

MIT