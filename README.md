[![npm](https://img.shields.io/npm/v/@googlemaps/code-assist-mcp)][npm-pkg]
![Alpha](https://img.shields.io/badge/release-alpha-orange)
![Contributors](https://img.shields.io/github/contributors/googlemaps/platform-ai?color=green)

# Google Maps Platform resources for AI

## **Description**

> [!WARNING]
> We will be deprecating the NPM version of Code Assit, and it will no longer be available as of [XX date - to be completed]. Please use the securely hosted remote MCP version docuemnted in this README as the primary method of connection.

This repository contains the [Google Maps Platform Code Assist toolkit](packages/code-assist/README.md), a Model Context Protocol (MCP) server that enhances the responses from large language models (LLMs) used for developing applications with the Google Maps Platform by grounding them in the official, up-to-date documentation and code samples.

## **🔧 Available MCP Tools (gmp-code-assist)**

You have access to the `gmp-code-assist` MCP server with these essential tools:

- **`retrieve-google-maps-platform-docs`**: Searches Google Maps Platform documentation, code samples, architecture center, and GitHub repositories via RAG.
  - _Parameters_: `llmQuery` (Required string query), `filter` (Optional API/product area filter), `source` (Optional string caller identifier up to 64 chars).
- **`retrieve-instructions`**: Retrieves foundational context on Google Maps Platform best practices.
  - _Parameters_: `name` (Required string, expected format is simply "instructions").

## Install the Google Maps Platform Code Assist extension for [Gemini CLI](https://geminicli.com/)

1. Install the Gemini CLI ([alternative installation methods](https://geminicli.com/docs/get-started/installation/))

```bash
npm install -g @google/gemini-cli
```

2. Install the Google Maps Platform extension
   - Option 1 - Install Code Assist as a Gemini CLI extension with a skill, the Code Assist MCP tool, and a Google Maps Platform CLI theme:
     ```bash
     gemini extensions install https://github.com/googlemaps/platform-ai.git
     ```

     - Verify the installation by running `gemini mcp list`.
   - Option 2 - Add the MCP server config manually to your `~/.gemini/settings.json` file to securely connect to the Google-hosted remote service:
     ```json
     {
       "mcpServers": {
         "gmp-code-assist": {
           "httpUrl": "https://mapscodeassist.googleapis.com/mcp"
         }
       }
     }
     ```

## Install the Google Maps Platform Code Assist toolkit for other MCP clients.

For information about installing and using the toolkit with any MCP client, as well as terms of use, see the [Code Assist toolkit README](packages/code-assist/README.md).

## Sample Prompts

Use these example prompts to get started with the Code Assist MCP server or supported AI agents:

- Show me how to use the Routes API and display it on a Map in React + Typescript.
- I'm upgrading my map from 2D to 3D Phtotorealistic - what are my options and how would I do that with my existing codebase?
- Change my Places API (new) Text Search API implementtaion to use Places UI Kit. Estimate the amount of cost savings per user this change will make.
- Explain the difference between Address Validation and Geocoding. Which one should I apply for my current codebase for an ecommmerce checkout use case and why? 
- I need an API key - can you get one and add it to my app envrionment secrets?
