![Alpha](https://img.shields.io/badge/release-alpha-orange)
[![License](https://img.shields.io/github/license/googlemaps/platform-ai?color=blue)][license]
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]
[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=google-maps-platform&config=eyJ0eXBlIjoic3NlIiwidXJsIjoiaHR0cHM6Ly9tYXBzY29kZWFzc2lzdC5nb29nbGVhcGlzLmNvbS9tY3AifQ==)

# <img height="48" width="48" src="https://avatars.githubusercontent.com/u/3717923?s=200&v=4" alt="Google Maps Platform Logo" /> Google Maps Platform Code Assist Toolkit

_Alpha version_

<!-- [START maps_Description] -->

## Description

The Google Maps Platform Code Assist toolkit is a Model Context Protocol (MCP) server that enhances the responses from large language models (LLMs) used for developing applications with the Google Maps Platform by grounding the responses in the official, up-to-date documentation and code samples.

Since the MCP server accesses the content when the model is prompted, the LLM's context regarding Google Maps Platform does not have to be limited to the available data at the model's training date.

Google Maps Platform resources that the MCP server can access include:

- Google Maps Platform Documentation
- Google Maps Platform Terms of Service
- Google Maps Platform Trust Center
- Code repositories in Google Maps Platform official GitHub organizations
<!-- [END maps_Description] -->

<!-- [START maps_CTADevelopers] -->

## Benefits

- Make your favorite AI assistant or IDE an expert on the Google Maps Platform. With Code Assist, AI Agents like Gemini CLI, Claude Code, and Cursor can generate code and answer developer questions grounded in up-to-date, official Google Maps Platform documentation and code samples -- directly in your dev workflow.

- Whether you are making precision AI-Assisted code changes or vibecoding a new app prototype - Code Assist can help you accomplish your task faster and easier.

<!-- [START_EXCLUDE] -->

Below is an example MCP Client response to a user's question with Code Assist MCP installed:

![](./code-assist-preview.jpg)

> [\!NOTE]
> This is the repository for an MCP server that provides access to Google Maps Platform documentation via a RAG service. It is not a Google Maps Platform Core Service.

<!-- [END_EXCLUDE] -->
<!-- [END maps_CTADevelopers] -->

---

<!-- [START maps_Tools] -->

## Tools Provided

The MCP server exposes the following tools for AI clients:

1. **`retrieve-instructions`**: A helper tool used by the client to get crucial system instructions on how to best reason about user intent and formulate effective calls to the `retrieve-google-maps-platform-docs` tool.
2. **`retrieve-google-maps-platform-docs`**: The primary tool. It takes a natural language query and submits it to a hosted Retrieval Augmented Generation (RAG) engine. The RAG engine searches fresh versions of official Google Maps Platform documentation, tutorials, and code samples, returning relevant context to the AI to generate an accurate response.
<!-- [END maps_Tools] -->

---

<!-- [START maps_Transports] -->

## Supported MCP Transports

This remote server supports standard MCP communication protocols:

- **`streamable HTTP`**: The server exposes a `/mcp` endpoint that accepts POST requests over the HTTPS protocol. This is used by clients that connect via a `url` and is the standard for remote server connections. Our implementation supports Server-Sent Events (SSE) for real-time, interactive responses.

<!-- [END maps_Transports] -->

---

<!-- [START maps_RemoteSetup] -->

## Usage

The Code Assist MCP server is securely hosted by Google. To use it, you must configure your AI client to connect to the remote URL via Server-Sent Events (SSE).

### Configure Your Client

Add the remote server URL to your preferred AI client's MCP configuration file or settings UI. Find your client below for specific, verified instructions.

1. **Gemini CLI**
   - Option 1 (Recommended) - Install the Code Assist MCP server as a Gemini CLI extension. This provides the most complete experience, including specialized developer skills:
     ```bash
     gemini extensions install https://github.com/googlemaps/platform-ai.git
     ```
   - Option 2 - Use the `mcp add` CLI command to add the server cleanly:
     ```bash
     gemini mcp add --transport sse google-maps-platform-code-assist https://mapscodeassist.googleapis.com/mcp
     ```
   - Option 3 - Add the MCP server config manually to your `~/.gemini/settings.json` file (or `.gemini/settings.json` in your project root).

   ```json
   {
     "mcpServers": {
       "google-maps-platform-code-assist": {
         "url": "https://mapscodeassist.googleapis.com/mcp"
       }
     }
   }
   ```

2. **Claude Code**
   - The cleanest way to add the remote server is via the `mcp add` CLI command:
     ```bash
     claude mcp add google-maps-platform-code-assist sse https://mapscodeassist.googleapis.com/mcp
     ```
   - Alternatively, add the server manually to your Claude config file `~/.claude.json`:

   ```json
   {
     "mcpServers": {
       "google-maps-platform-code-assist": {
         "type": "sse",
         "url": "https://mapscodeassist.googleapis.com/mcp"
       }
     }
   }
   ```

3. **Cursor**
   - [![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=google-maps-platform&config=eyJ0eXBlIjoic3NlIiwidXJsIjoiaHR0cHM6Ly9tYXBzY29kZWFzc2lzdC5nb29nbGVhcGlzLmNvbS9tY3AifQ==) <-- If you already have Cursor installed, click here to install the Google Maps Platform Code Assist MCP directly.
   - Otherwise, add it to your workspace's `.cursor/mcp.json` file.

   ```json
   {
     "mcpServers": {
       "google-maps-platform-code-assist": {
         "type": "sse",
         "url": "https://mapscodeassist.googleapis.com/mcp"
       }
     }
   }
   ```

4. **Codex**
   - The easiest way to connect Codex to the remote server is via the CLI:
     ```bash
     codex mcp add google-maps-platform-code-assist --url https://mapscodeassist.googleapis.com/mcp
     ```
   - If you prefer manual configuration, add the following to your `~/.codex/config.toml` or your project's `.codex/config.toml`:

   ```toml
   [mcp_servers.google-maps-platform-code-assist]
   url = "https://mapscodeassist.googleapis.com/mcp"
   ```

5. **Antigravity**
   - In your Antigravity configuration or workspace settings, add the streamable HTTP endpoint:
   ```json
   {
     "mcpServers": {
       "google-maps-platform-code-assist": {
         "type": "sse",
         "url": "https://mapscodeassist.googleapis.com/mcp"
       }
     }
   }
   ```

<!-- [END maps_RemoteSetup] -->

---

<!-- [START maps_Terms] -->

## **Terms of Service**

This toolkit provides tools to describe the use of Google Maps Platform services. Use of Google Maps Platform services is subject to the Google Maps Platform [Terms of Service](https://cloud.google.com/maps-platform/terms). If your billing address is in the European Economic Area, the Google Maps Platform [EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region.

This toolkit is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (such as Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this repository or the RAG service called by it.

<!-- [END maps_Terms] -->

## **Support**

<!-- [START maps_Support] -->

This toolkit is offered via an open source [license](https://github.com/googlemaps/.github/blob/master/LICENSE). It is not governed by the Google Maps Platform Support (Technical Support Services Guidelines, the SLA, or the [Deprecation Policy](https://cloud.google.com/maps-platform/terms)). However, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service.

If you find a bug, or have a feature request, please [file an issue](https://github.com/googlemaps/platform-ai/issues/new/choose) on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels](https://developers.google.com/maps/developer-community). If you'd like to contribute, please check the [contributing guide](https://github.com/googlemaps/.github/blob/master/CONTRIBUTING.md).

You can also discuss this toolkit on our [Discord server](https://discord.gg/hYsWbmk).

<!--constant anchor links-->

[Discord server]: https://discord.gg/hYsWbmk
[license]: LICENSE

<!-- [END maps_Support] -->
