[![npm](https://img.shields.io/npm/v/@googlemaps/code-assist-mcp)][npm-pkg]
![Alpha](https://img.shields.io/badge/release-alpha-orange)
![Contributors](https://img.shields.io/github/contributors/googlemaps/platform-ai?color=green)

# Google Maps Platform resources for AI

## **Description**

This repository contains the [Google Maps Platform Code Assist toolkit](packages/code-assist/README.md), a Model Context Protocol (MCP) server that enhances the responses from large language models (LLMs) used for developing applications with the Google Maps Platform by grounding them in the official, up-to-date documentation and code samples.

## Install the Google Maps Platform Code Assist extension for [Gemini CLI](https://geminicli.com/)

1. Install the Gemini CLI ([alternative installation methods](https://geminicli.com/docs/get-started/deployment/))

```bash
npm install -g @google/gemini-cli
```

2. Install the Google Maps Platform extension

    * Option 1 - Install Code Assist as a Gemini CLI extension with static preamble, the MCP tool, and basic Google Maps theme:
        ```bash
        gemini extensions install https://github.com/googlemaps/platform-ai.git
        ```
      * Verify the installation by running `gemini mcp list`.
    * Option 2 - Add the MCP server config manually to your `~/.gemini/settings.json` file.
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

## Install the Google Maps Platform Code Assist toolkit for other MCP clients.

For information about installing and using the toolkit with any MCP client, as well as terms of use, see the [Code Assist toolkit README](packages/code-assist/README.md).

## Sample Prompts

Use these example prompts to get started with the Code Assist MCP server or supported AI agents:

- Show me how to use the Routes API in Node.js.
- What are the authentication options for Google Maps Platform?
- Give me a code sample for displaying a map with markers.
- Explain the difference between Place Autocomplete and Place Search.
- How do I set up billing for Google Maps Platform?

<!--repo-specific anchor links-->
[npm-pkg]: <https://npmjs.com/package/@googlemaps/code-assist-mcp>
