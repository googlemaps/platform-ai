[![npm](https://img.shields.io/npm/v/@googlemaps/code-assist-mcp)][npm-pkg]
![Alpha](https://img.shields.io/badge/release-alpha-orange)
[![License](https://img.shields.io/github/license/googlemaps/platform-ai?color=blue)][license]
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]
[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=google-maps-platform&config=eyJjb21tYW5kIjoibnB4IC15IEBnb29nbGVtYXBzL2NvZGUtYXNzaXN0LW1jcCJ9)


# <img height="48" width="48" src="https://avatars.githubusercontent.com/u/3717923?s=200&v=4" alt="Google Maps Platform Logo" /> Google Maps Platform Code Assist Toolkit 
*Alpha version*

<!-- [START code-assist_Description] -->
## Description

The Google Maps Platform Code Assist toolkit is a Model Context Protocol (MCP) server that enhances the responses from large language models (LLMs) used for developing applications with the Google Maps Platform by grounding the responses in the official, up-to-date documentation and code samples.

Since the MCP server accesses the content when the model is prompted, the LLM's context regarding Google Maps Platform does not have to be limited to the available data at the model's training date.

Google Maps Platform resources that the MCP server can access include:

- Google Maps Platform Documentation
- Google Maps Platform Terms of Service
- Google Maps Platform Trust Center
- Code repositories in Google Maps Platform official GitHub organizations
<!-- [END code-assist_Description] -->

<!-- [START code-assist_CTA_Developers] -->
## Developers

- 🪄 Make your favorite AI assistant or IDE a Google Maps Platform expert. With Code Assist, AI Agents like Gemini CLI, Claude Code, and Cursor can generate code and answer developer questions grounded in up-to-date, official Google Maps Platform documentation and code samples -- directly in your dev workflow.

- 🚀 Whether you are making precision AI-Assisted code changes or vibecoding a new app prototype - Code Assist can help you accomplish your task faster and easier.

Below is an example MCP Client response to a user's question with Code Assist MCP installed:

![](./code-assist-preview.jpg) 

> [\!NOTE]
> This is the repository for an MCP server that provides access to Google Maps Platform documentation via a RAG service. It is not a Google Maps Platform Core Service.
<!-- [END code-assist_CTA_Developers] -->

-----

<!-- [START code-assist_Tools] -->
## 🔧 Tools Provided

The MCP server exposes the following tools for AI clients:

  1. **`retrieve-instructions`**: A helper tool used by the client to get crucial system instructions on how to best reason about user intent and formulate effective calls to the `retrieve-google-maps-platform-docs` tool.
  2. **`retrieve-google-maps-platform-docs`**: The primary tool. It takes a natural language query and submits it to a hosted Retrieval Augmented Generation (RAG) engine. The RAG engine searches fresh versions of official Google Maps Platform documentation, tutorials, and code samples, returning relevant context to the AI to generate an accurate response.
<!-- [END code-assist_Tools] -->

-----

<!-- [START code-assist_Local_Setup] -->
## 🚀 Usage

You can run the Code Assist MCP server either on your local machine or remotely on Google Cloud Run.

### Requirements

In order to use the Google Maps Platform Code Assist toolkit, you need a local machine with [Node.js](https://nodejs.org/en/download/) (LTS version recommended) and npm installed in order to clone and run the server, as well as an MCP client to access the server.

### Use as a Local MCP Server (Recommended)

Run the server on your local machine for use with AI-assisted IDEs (like VS Code, Android Studio, Cursor) or desktop AI applications (like Gemini CLI). This is the simplest and most common setup.

#### Configure Your Client

Add the server to your preferred AI client's MCP configuration file. Find your client below for specific, verified instructions.

* **[Gemini Code Assist & Gemini CLI](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#configure-mcp-servers)**
    * Option 1 - Add the server directly from your command line (assuming you have Gemini CLI already installed):
        ```bash
         gemini mcp add google-maps-platform-code-assist npx -y @googlemaps/code-assist-mcp@latest
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

* **[Claude Code](https://docs.anthropic.com/en/docs/claude-code/mcp)**
    * Option 1 - Add the server directly from your command line (assuming you have Claude Code already installed):
        ```bash
            claude mcp add google-maps-platform-code-assist -- npx -y @googlemaps/code-assist@latest
        ```
        * Verify the installation by running `claude mcp list`.
        * **Windows Users:** On native Windows (not WSL), you must use the `cmd /c` wrapper for `npx` commands to work correctly.
        ```bash
        claude mcp add google-maps-platform-code-assist -- cmd /c "npx -y @googlemaps/code-assist-mcp@latest"
        ```
    * Option 2 - Add the sever manually to your Claude config file `~/.claude.json`
    ```json
    "mcpServers": {
        "google-maps-platform-code-assist": {
          "command": "npx",
          "args": [
            "-y", "@googlemaps/code-assist-mc@latest"
          ]
        }
      }
    ```

* **[Cursor](https://docs.cursor.com/en/context/mcp)**
    * [![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=google-maps-platform&config=eyJjb21tYW5kIjoibnB4IC15IEBnb29nbGVtYXBzL2NvZGUtYXNzaXN0LW1jcCJ9) <-- If you already have Cursor installed, click here to install Google Maps Platform Code Assist MCP directly.
    * Otherwise, add it to your workspace's `.cursor-settings/mcp.json` file.
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

* **[Firebase Studio](https://firebase.google.com/docs/studio/customize-workspace)**
    * Add to your project's `mcp.json` file in the `.idx` folder in your Firebase Studio workspace
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

* **[Android Studio](https://developer.android.com/studio/gemini/add-mcp-server)**
    * Create a `mcp.json` file and place it in the [configuration directory](https://developer.android.com/studio/troubleshoot#directories) of Android Studio. Add the Code Assist server to the list:
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
* **[Cline](https://docs.cline.bot/mcp/configuring-mcp-servers)**
    * Option 1: install using the [Cline MCP GUI](https://docs.cline.bot/mcp/configuring-mcp-servers)
    * Option 2: manually / programatically install using the Cline MCP config file. The config file is located at:
        * **macOS:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
        *   **Windows:** `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
        *   **Linux:** `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
        *   Add the following to your MCP configuration in `cline_mcp_settings.json`: 
            ```json
            {
              "mcpServers": {
                "google-maps-platform-code-assist": {
                  "command": "npx",
                  "args": ["-y", "@googlemaps/code-assist-mcp@latest"]
                },
                "alwaysAllow": [
                  "retrieve-instructions",
                  "retrieve-google-maps-platform-docs"
                ]
              }
            }
            ```
* **[Roo Code](https://docs.roocode.com/features/mcp/using-mcp-in-roo)**
    * Option 1: install using the [Roo MCP GUI](https://docs.roocode.com/features/mcp/using-mcp-in-roo)
    * Option 2: manually / programatically install using the Roo Code config file. The config file is located at:
        * **macOS:** `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`
        * **Windows:** `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`
        * **Linux:** `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`
        * Add the following to your MCP configuration in `mcp_settings.json`: 
            ```json
            {
              "mcpServers": {
                "google-maps-platform-code-assist": {
                  "command": "npx",
                  "args": ["-y", "@googlemaps/code-assist-mcp@latest"]
                },
                "alwaysAllow": [
                  "retrieve-instructions",
                  "retrieve-google-maps-platform-docs"
                ]
              }
            }
            ```

* **[Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp)**
    * When in Agent mode, Click "Tools" and then in the top header "Configure Tools" then "Install from an NPM package name" (See screenshots below)
    * <img width="597" height="199" alt="image" src="https://github.com/user-attachments/assets/061e685b-749a-4267-a471-3845c80e16b5" />

    * <img width="738" height="114" alt="image" src="https://github.com/user-attachments/assets/1f8b2879-639f-4d47-b440-a0f7b539ed09" />
    * <img width="718" height="217" alt="image" src="https://github.com/user-attachments/assets/0c3c89d0-35ab-4c31-bd39-cf21d7c0724e" />
    * Enter pacakge name `@googlemaps/code-assist-mcp` and ENTER, accepting the install and using the default port 3000, then ENTER one last time to confirm the change
    * <img width="717" height="114" alt="image" src="https://github.com/user-attachments/assets/d6ba49d2-0207-4bdc-9637-18f7307f767c" />


* **[Windsurf](https://docs.windsurf.com/windsurf/cascade/mcp)**
    * Similar to Cursor instructions above.
      
* **[Kilo Code](https://kilocode.ai/docs/features/mcp/using-mcp-in-kilo-code)**
    * Similar to the Cline and Roo Code instructions above 

<!-- [END code-assist_Local_Setup] -->

-----

<!-- [START code-assist_Remote_Setup] -->

### Use as a Remote MCP Server

Run the server on Google Cloud Run and connect to it from your local machine. This is useful if your client requires a remotely-hosted, streamable HTTP endpoint.

> [\!WARNING]
> These instructions secure the server so only you can access it. **Do not deploy a remote MCP server without authentication** to prevent unauthorized access and potential costs.

**1. Prerequisites**

Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and authenticate your account:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**2. Deploy to Cloud Run**

This command deploys the server from this repository's source code and ensures it is **not** publicly accessible.

```bash
gcloud run deploy google-maps-code-assist-mcp --source . --no-allow-unauthenticated
```

When prompted, select a region (e.g., `us-central1`).

**3. Connect Securely**

Run a Cloud Run proxy on your local machine. This creates a secure tunnel from a local port to your remote server, authenticated with your `gcloud` identity.

```bash
gcloud run services proxy google-maps-code-assist-mcp --port=8080 --region=YOUR_REGION
```

Now, `http://localhost:8080` on your machine securely connects to your Cloud Run service.

**4. Configure Your Client**

Update your client's MCP configuration to point to the local proxy.

  * If your client supports the `url` attribute for SSE:

    ```json
    "google-maps-platform-code-assist": {
      "url": "http://localhost:8080/mcp"
    }
    ```

  * If your client only supports `command`, use [`mcp-remote`](https://www.google.com/search?q=%5Bhttps://www.npmjs.com/package/mcp-remote%5D\(https://www.npmjs.com/package/mcp-remote\)) as a bridge:

    ```json
    "google-maps-platform-code-assist": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:8080/mcp"]
    }
    ```

<!-- [END code-assist_Remote_Setup] -->

-----

<!-- [START code-assist_Settings] -->

## ⚙️ Available Settings

### Port Configuration

By default, the server runs on port `3000`. You can specify a different port using the `--port` flag or a `PORT` environment variable. The `--port` flag takes precedence.

**Example: Use port `5000`**

In your `mcp.json`:

```json
"google-maps-platform-code-assist": {
  "command": "npx",
  "args": ["-y", "@googlemaps/code-assist-mcp@latest", "--port", "5000"]
}
```

Or with an environment variable:

```json
"google-maps-platform-code-assist": {
  "command": "npx",
  "args": ["-y", "@googlemaps/code-assist-mcp@latest"],
  "env": {
    "PORT": "5000"
  }
}
```

If the specified port is unavailable, the server will automatically find and start on a random available port.

<!-- [END code-assist_Settings] -->

-----

<!-- [START code-assist_Transports] -->

## 🛠️ Supported MCP Transports

This server supports two standard MCP communication protocols:

  * **`stdio`**: This is the default transport used when a client invokes the server via a `command`. It communicates over the standard input/output streams, making it ideal for local command-line execution.
  * **`Streamable-HTTP`**: The server exposes a `/mcp` endpoint that accepts POST requests. This is used by clients that connect via a `url` and is the standard for remote server connections. Our implementation supports streaming for real-time, interactive responses.

<!-- [END code-assist_Transports] -->

-----

<!-- [START code-assist_Terms] -->

## **Terms of Service**

This toolkit provides tools to describe the use of Google Maps Platform services. Use of Google Maps Platform services is subject to the Google Maps Platform [Terms of Service](https://cloud.google.com/maps-platform/terms), however, if your billing address is in the European Economic Area, the Google Maps Platform [EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

This toolkit is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this repository or the RAG service called by it.

<!-- [END code-assist_Terms] -->

## **Support**

<!-- [START code-assist_Support] -->

This toolkit is offered via an open source [license](https://github.com/googlemaps/.github/blob/master/LICENSE). It is not governed by the Google Maps Platform Support (Technical Support Services Guidelines, the SLA, or the [Deprecation Policy](https://cloud.google.com/maps-platform/terms)). However, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service.

If you find a bug, or have a feature request, please [file an issue](https://github.com/googlemaps/platform-ai/issues/new/choose) on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels](https://developers.google.com/maps/developer-community). If you'd like to contribute, please check the [contributing guide](https://github.com/googlemaps/.github/blob/master/CONTRIBUTING.md).

You can also discuss this toolkit on our [Discord server](https://discord.gg/hYsWbmk).

<!--repo-specific anchor links-->
[npm-pkg]: <https://npmjs.com/package/@googlemaps/code-assist-mcp>

<!--constant anchor links-->
[Discord server]: https://discord.gg/hYsWbmk
[license]: LICENSE

<!-- [END code-assist_Support] -->
