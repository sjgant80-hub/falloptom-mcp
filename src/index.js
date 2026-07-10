#!/usr/bin/env node
// falloptom-mcp · MCP stdio server wrapping falloptom-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'falloptom-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'falloptom_load_config',
    description: 'loadConfig · from falloptom-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadConfig } = await import('@ai-native-solutions/falloptom-sdk');
      return typeof loadConfig === 'function' ? await loadConfig(args) : { error: 'loadConfig not callable' };
    }
  },
  {
    name: 'falloptom_save_config',
    description: 'saveConfig · from falloptom-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { saveConfig } = await import('@ai-native-solutions/falloptom-sdk');
      return typeof saveConfig === 'function' ? await saveConfig(args) : { error: 'saveConfig not callable' };
    }
  },
  {
    name: 'falloptom_$',
    description: '$ · from falloptom-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { $ } = await import('@ai-native-solutions/falloptom-sdk');
      return typeof $ === 'function' ? await $(args) : { error: '$ not callable' };
    }
  },
  {
    name: 'falloptom_esc',
    description: 'esc · from falloptom-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { esc } = await import('@ai-native-solutions/falloptom-sdk');
      return typeof esc === 'function' ? await esc(args) : { error: 'esc not callable' };
    }
  },
  {
    name: 'falloptom_ai_tier',
    description: 'aiTier · from falloptom-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { aiTier } = await import('@ai-native-solutions/falloptom-sdk');
      return typeof aiTier === 'function' ? await aiTier(args) : { error: 'aiTier not callable' };
    }
  },
  {
    name: 'falloptom_render_ai_chip',
    description: 'renderAiChip · from falloptom-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderAiChip } = await import('@ai-native-solutions/falloptom-sdk');
      return typeof renderAiChip === 'function' ? await renderAiChip(args) : { error: 'renderAiChip not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('falloptom-mcp v1.0.0 · stdio ready');
