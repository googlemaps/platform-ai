[![npm](https://img.shields.io/npm/v/@googlemaps/code-assist-mcp)][npm-pkg]
![Alpha](https://img.shields.io/badge/release-alpha-orange)

[![License](https://img.shields.io/github/license/googlemaps/platform-ai?color=blue)][license]
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]

# Google Maps Platform Code Assist MCP toolkit (Alpha)

**European Economic Area (EEA) developers**
If your billing address is in the European Economic Area, effective on 8 July 2025, the [Google Maps Platform EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

## **Description**

This repository contains code for a Model Context Protocol (MCP) server provides a tool (**retrieve-google-maps-platform-docs**) that retrieves context from fresh versions of Google Maps Platform documentation and code samples (including guides, API references, GitHub code sample repositories, and Terms of Service).

When used with an AI agent for coding assistance, this MCP server helps ground implementation plans and generated code in relevant, up-to-date, official Google Maps Platform guidance.

## **Requirements**

* An MCP client, such as the MCP clients built into [Gemini CLI](https://github.com/google-gemini/gemini-cli), [Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#configure-mcp-servers), [Cline](https://cline.bot/), [Roo Code](https://github.com/RooCodeInc/Roo-Code), [Claude Code](https://www.npmjs.com/package/@anthropic-ai/claude-code), [Cursor](https://cursor.sh/), [Windsurf's Cascade](https://windsurf.com/cascade), [Firebase Studio](https://firebase.google.com/docs/studio/customize-workspace#mcp) and other AI coding assistants.
*   A local machine on which to clone and run the MCP server that the MCP client can access.
*   Node.js and npm ([install](https://nodejs.org/en/download)) on the local machine.

## **Installation**

### **Install for MCP clients that support npm installation**

For any MCP client that supports installation via npm, use the command line to install the [@googlemaps/code-assist-mcp](https://www.npmjs.com/package/@googlemaps/code-assist-mcp) MCP server to your local machine:

```
npx -y @googlemaps/code-assist-mcp
```

### **Install via JSON configuration (all other MCP clients)**

Most MCP clients have a JSON file for their MCP configuration such as **mcp.json** (e.g. VSCode, Cursor) or **mcp_config.json** (Windsurf). Add the following to the MCP configuration file.

```
{
  "mcpServers": {
    "google-maps-platform-code-assist": {
      "command": "npx",
      "args": ["-y", "@googlemaps/code-assist-mcp"]
    }
  }
}
```

To deploy it in **Gemini Code Assist** follow these [instructions](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#configure-mcp-servers).

## **MCP Tools and Resources**

This toolkit provides tools and resources to ground AI-generated code in official, up-to-date Google Maps Platform guidance.

*   **`retrieve-google-maps-platform-docs` (Tool)**: Submits a query to a hosted Retrieval Augmented Generation (RAG) engine that searches fresh versions of Google Maps Platform official documentation and code samples and returns relevant text or code to augment the context of generative AI responses.

*   **`retrieve-instructions` (Tool) / `instructions` (Resource)**: Used by the MCP client to get crucial system instructions and a preamble before calling **`retrieve-google-maps-platform-docs`**.

The intended use of these tools is to enrich the context of Generative AI models with the goal of reducing model hallucinations containing incorrect, irrelevant, inappropriate, or nonsensical content regarding Google Maps Platform. As your use of Google Maps Platform must comply with the Google Maps Platform Terms of Service, you should [evaluate the performance](https://ai.google.dev/responsible/docs/evaluation) of your model with the Google Maps Platform Code Assist toolkit against the [Google Maps Platform documentation](developers.google.com/maps) and the Google Maps Platform Terms of Service to verify compliance. To learn more about some best practices, [see Responsible AI](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/responsible-ai).

This tool sends information including the MCP client's query and IP address to a Google-hosted RAG service. Use of this service is subject to the [Google Privacy Policy](https://policies.google.com/privacy).

## Configuration

You can specify a port for the HTTP server using the `--port` flag.

**Example:**
```sh
npx -y @googlemaps/code-assist-mcp -- --port 8080
```

If no port is specified, the server will default to port `3000`. If port `3000` is already in use, it will automatically try the next available port (3001, 3002, and so on).

## Development

To test that the library will work with `npx` once published, run `npx .` from the package/code-assist root directory. The `package.json` referenced `bin` object specifies the executeable location, and the first line of the built server must contain it's first line as `#!/usr/bin/env node` in order for npx to know that it should use `node` to run the server. The package.json file contains a `build:prepare` script that automatically adds this line to the built server.



## **Contributing**

Contributions are welcome. If you'd like to contribute, send us a [pull request](https://github.com/googlemaps/platform-ai/compare) and refer to our [code of conduct](https://github.com/googlemaps/.github/blob/master/?tab=coc-ov-file#readme) and [contributing guide](https://github.com/googlemaps/.github/blob/master/CONTRIBUTING.md).

## **Terms of Service**

This toolkit provides tools to describe the use of Google Maps Platform services. Use of Google Maps Platform services is subject to the Google Maps Platform [Terms of Service](https://cloud.google.com/maps-platform/terms), however, if your billing address is in the European Economic Area, the Google Maps Platform [EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

This toolkit is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this repository or the RAG service called by it.

## **Support**

This toolkit is offered via an open source [license](https://github.com/googlemaps/.github/blob/master/LICENSE). It is not governed by the Google Maps Platform Support (Technical Support Services Guidelines, the SLA, or the [Deprecation Policy](https://cloud.google.com/maps-platform/terms)). However, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service.

This library adheres to [semantic versioning](https://semver.org/) to indicate when backwards-incompatible changes are introduced. Accordingly, while the toolkit is in version 0.x, backwards-incompatible changes may be introduced at any time.

If you find a bug, or have a feature request, please [file an issue](https://github.com/googlemaps/platform-ai/issues/new/choose) on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels](https://developers.google.com/maps/developer-community). If you'd like to contribute, please check the [contributing guide](https://github.com/googlemaps/.github/blob/master/CONTRIBUTING.md).

You can also discuss this toolkit on our [Discord server](https://discord.gg/hYsWbmk).

<!--repo-specific anchor links-->
[npm-pkg]: <https://npmjs.com/package/@googlemaps/code-assist-mcp>

<!--constant anchor links-->
[Discord server]: https://discord.gg/hYsWbmk
[license]: LICENSE
