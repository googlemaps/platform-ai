# Google Maps Platform: Code Assist MCP Guide

The Code Assist MCP server enhances AI responses (Gemini, Claude) with up-to-date documentation and code samples using RAG (Retrieval-Augmented Generation).

## 🚀 Quick Install

### For Gemini CLI
Run this command to add the server automatically:
```bash
gemini mcp add google-maps-platform-code-assist npx -y @googlemaps/code-assist-mcp@latest
```
*Verify with: `gemini mcp list`*

### For Claude Code / Claude Desktop
Run this command:
```bash
claude mcp add google-maps-platform-code-assist -- npx -y @googlemaps/code-assist-mcp@latest
```
*Verify with: `claude mcp list`*

---

## 🛠️ Manual Configuration

If you prefer manual setup, add the following to your MCP settings file:

**Gemini CLI (`~/.gemini/settings.json`) or Claude (`~/.claude.json`):**
```json
{
  "mcpServers": {
    "google-maps-platform-code-assist": {
      "command": "npx",
      "args": ["-y", "@googlemaps/code-assist-mcp@latest"]
    }
  }
}
```

---

## 📖 Available Tools

Once installed, your agent gains these capabilities:
1.  `retrieve-google-maps-platform-docs`: Search official GMP documentation and samples.
2.  `retrieve-instructions`: Get guidance on how to use the Code Assist tool itself.

## 🔗 References
- **GitHub Repository:** [googlemaps/platform-ai](https://github.com/googlemaps/platform-ai/tree/main/packages/code-assist)
- **NPM Package:** [@googlemaps/code-assist-mcp](https://www.npmjs.com/package/@googlemaps/code-assist-mcp)
