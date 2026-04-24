import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Type } from "typebox";

const MCP_SERVER_URL = "https://mcp.docs.astro.build/mcp";

export default async function (pi: ExtensionAPI) {
  let client: Client | null = null;
  let connected = false;

  pi.on("session_start", async (_event, ctx) => {
    try {
      const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
      client = new Client({ name: "pi-astro-mcp", version: "1.0.0" });
      await client.connect(transport);
      connected = true;

      const { tools } = await client.listTools();
      ctx.ui.notify(`🚀 Astro Docs MCP: connected (${tools.length} tool${tools.length !== 1 ? "s" : ""})`, "info");
    } catch (err) {
      ctx.ui.notify(`Astro Docs MCP: connection failed — ${err}`, "error");
      connected = false;
    }
  });

  pi.on("session_shutdown", async () => {
    if (client) {
      try {
        await client.close();
      } catch {
        // ignore close errors on shutdown
      }
      client = null;
      connected = false;
    }
  });

  pi.registerTool({
    name: "search_astro_docs",
    label: "Search Astro Docs",
    description:
      "Search the official Astro framework documentation. Returns relevant docs content for the given query. " +
      "Use this tool when the user asks about Astro, Astro components, Astro configurations, Astro islands, " +
      "Astro SSR, Astro integrations, or any Astro-related topic.",
    promptSnippet: "Search Astro docs for framework questions",
    promptGuidelines: [
      "Use search_astro_docs when the user asks about Astro framework topics, configuration, components, SSR, islands, integrations, or deployment.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "Search query for Astro documentation" }),
    }),
    async execute(_toolCallId, params, signal, _onUpdate, ctx) {
      if (!connected || !client) {
        // Attempt reconnect
        try {
          const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));
          client = new Client({ name: "pi-astro-mcp", version: "1.0.0" });
          await client.connect(transport);
          connected = true;
        } catch (err) {
          return {
            content: [
              {
                type: "text",
                text: `Astro Docs MCP server is not connected. Attempted reconnect but failed: ${err}`,
              },
            ],
            details: { error: String(err) },
          };
        }
      }

      try {
        const result = await client.callTool(
          { name: "search_astro_docs", arguments: { query: params.query } },
          undefined,
          { signal }
        );

        // Extract text content from MCP result
        const textParts: string[] = [];
        for (const part of result.content) {
          if (part.type === "text") {
            textParts.push(part.text);
          }
        }

        const text = textParts.join("\n");

        return {
          content: [{ type: "text", text: text || "No results found." }],
          details: { query: params.query },
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Error searching Astro docs: ${err}`,
            },
          ],
          details: { error: String(err), query: params.query },
        };
      }
    },
  });
}