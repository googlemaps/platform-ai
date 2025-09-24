[![npm](https://img.shields.io/npm/v/@googlemaps/maps-grounding-essentials-mcp)][npm-pkg]
![Alpha](https://img.shields.io/badge/release-alpha-orange)
[![License](https://img.shields.io/github/license/googlemaps/platform-ai?color=blue)][license]
[![Discord](https://img.shields.io/discord/676948200904589322?color=6A7EC2&logo=discord&logoColor=ffffff)][Discord server]
[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=google-maps-platform&config=eyJjb21tYW5kIjoibnB4IC15IEBnb29nbGVtYXBzL21hcHMtZ3JvdW5kaW5nLWVzc2VudGlhbHMtbWNwIn0)
<a href="https://studio.firebase.google.com/new/gemini-maps">
  <img
    height="28"
    alt="Try in Firebase Studio"
    src="https://cdn.firebasestudio.dev/btn/try_dark_32.svg">
</a>

# <img height="48" width="48" src="https://avatars.githubusercontent.com/u/3717923?s=200&v=4" alt="Google Maps Platform Logo" /> Google Maps Platform Maps Grounding Essentials Toolkit
*Alpha version*

## Description

The Google Maps Platform Maps Grounding Essentials toolkit is a Model Context Protocol (MCP) server that provides essential Google Maps Platform functionalities, such as Places Search, Route Computation, and Weather Lookup. This toolkit enhances the responses from large language models (LLMs) used for developing applications with the Google Maps Platform by giving them direct access to these functionalities.

Since the MCP server accesses the content when the model is prompted, the LLM's context regarding Google Maps Platform does not have to be limited to the available data at the model's training date.

## 🔧 Tools Provided

The MCP server exposes the following tools for AI clients:

  1. **`GoogleMapsPlatformWeatherLookup`**: Provides current conditions, hourly, and daily forecasts for any location.
  2. **`GoogleMapsPlatformPlacesSearchText`**: Searches for places using a text query.
  3. **`GoogleMapsPlatformComputeRoutes`**: Computes a travel route between a specified origin and destination.

-----

## 🛠️ Supported MCP Transports

This server supports the following standard MCP communication protocol:

  * **`stdio`**: This is the default transport used when a client invokes the server via a `command`. It communicates over the standard input/output streams, making it ideal for local command-line execution.

-----

## 🚀 Usage

You can run the Maps Grounding Essentials MCP server on your local development machine.

### Requirements

In order to use the Google Maps Platform Maps Grounding Essentials toolkit, you need an environment with [Node.js](https://nodejs.org/en/download/) (LTS version recommended) and npm installed in order to clone and run the server, as well as an MCP client to access the server.

### Use Maps Grounding Essentials as a Local MCP Server with `stdio` transport (Recommended)

Run the server on your local machine and connect clients using `stdio` protocol for use with AI-assisted IDEs (like VS Code, Android Studio, Cursor) or desktop AI applications (like Gemini CLI). This is the simplest and most common setup.

#### Configure Your Client

Add the server to your preferred AI client's MCP configuration file. Find your client below for specific, verified instructions.

1. **[Gemini Code Assist & Gemini CLI](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#configure-mcp-servers)**
    * Option 1 - Add the server directly from your command line (assuming you have Gemini CLI already installed):
        ```bash
         gemini mcp add google-maps-platform-maps-tool npx -y @googlemaps/maps-grounding-essentials-mcp@latest
        ```
      * Verify the installation by running `gemini mcp list`.
    * Option 2 - Add the MCP server config manually to your `~/.gemini/settings.json` file.
    ```json
    {
      "mcpServers": {
        "google-maps-platform-maps-tool": {
          "command": "npx",
          "args": ["-y", "@googlemaps/maps-grounding-essentials-mcp@latest"]
        }
      }
    }
    ```

2. **[Claude Code](https://docs.anthropic.com/en/docs/claude-code/mcp)**
    * Option 1 - Add the server directly from your command line (assuming you have Claude Code already installed):
        ```bash
            claude mcp add google-maps-platform-maps-tool -- npx -y @googlemaps/maps-grounding-essentials-mcp@latest
        ```
        * Verify the installation by running `claude mcp list`.
        * **Windows Users:** On native Windows (not WSL), you must use the `cmd /c` wrapper for `npx` commands to work correctly.
        ```bash
        claude mcp add google-maps-platform-maps-tool -- cmd /c "npx -y @googlemaps/maps-grounding-essentials-mcp@latest"
        ```
    * Option 2 - Add the sever manually to your Claude config file `~/.claude.json`
    ```json
    "mcpServers": {
        "google-maps-platform-maps-tool": {
          "command": "npx",
          "args": [
            "-y", "@googlemaps/maps-grounding-essentials-mcp@latest"
          ]
        }
      }
    ```

3. **[Cursor](https://docs.cursor.com/en/context/mcp)**
    * [![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=google-maps-platform&config=eyJjb21tYW5kIjoibnB4IC15IEBnb29nbGVtYXBzL21hcHMtZ3JvdW5kaW5nLWVzc2VudGlhbHMtbWNwIn0) <-- If you already have Cursor installed, click here to install Google Maps Platform Maps Grounding Essentials MCP directly.
    * Otherwise, add it to your workspace's `.cursor-settings/mcp.json` file.
    ```json
    {
      "mcpServers": {
        "google-maps-platform-maps-tool": {
          "command": "npx",
          "args": ["-y", "@googlemaps/maps-grounding-essentials-mcp@latest"]
        }
      }
    }
    ```

4. **[Firebase Studio](https://firebase.google.com/docs/studio/customize-workspace)**
    * <a href="https://studio.firebase.google.com/new/gemini-maps"> <img height="28" alt="Try in Firebase Studio" src="https://cdn.firebasestudio.dev/btn/try_dark_32.svg"></a> with Maps Grounding Essentials MCP installed
    * Add to your project's `mcp.json` file in the `.idx` folder in your Firebase Studio workspace
    ```json
    {
      "mcpServers": {
        "google-maps-platform-maps-tool": {
          "command": "npx",
          "args": ["-y", "@googlemaps/maps-grounding-essentials-mcp@latest"]
        }
      }
    }
    ```

5. **[Android Studio](https://developer.android.com/studio/gemini/add-mcp-server)**
    * Create a `mcp.json` file and place it in the [configuration directory](https://developer.android.com/studio/troubleshoot#directories) of Android Studio. Add the Maps Grounding Essentials server to the list:
    ```json
    {
      "mcpServers": {
        "google-maps-platform-maps-tool": {
          "command": "npx",
          "args": ["-y", "@googlemaps/maps-grounding-essentials-mcp@latest"]
        }
      }
    }
    ```
6. **[Cline](https://docs.cline.bot/mcp/configuring-mcp-servers)**
    * Option 1: install using the [Cline MCP GUI](https://docs.cline.bot/mcp/configuring-mcp-servers)
    * Option 2: manually / programatically install using the Cline MCP config file. The config file is located at:
        * **macOS:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
        *   **Windows:** `%APPDATA%/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
        *   **Linux:** `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
        *   Add the following to your MCP configuration in `cline_mcp_settings.json`:
            ```json
            {
              "mcpServers": {
                "google-maps-platform-maps-tool": {
                  "command": "npx",
                  "args": ["-y", "@googlemaps/maps-grounding-essentials-mcp@latest"]
                },
                "alwaysAllow": [
                  "GoogleMapsPlatformWeatherLookup",
                  "GoogleMapsPlatformPlacesSearchText",
                  "GoogleMapsPlatformComputeRoutes"
                ]
              }
            }
            ```
7. **[Roo Code](https://docs.roocode.com/features/mcp/using-mcp-in-roo)**
    * Option 1: install using the [Roo MCP GUI](https://docs.roocode.com/features/mcp/using-mcp-in-roo)
    * Option 2: manually / programatically install using the Roo Code config file. The config file is located at:
        * **macOS:** `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`
        * **Windows:** `%APPDATA%\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`
        * **Linux:** `~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`
        * Add the following to your MCP configuration in `mcp_settings.json`:
            ```json
            {
              "mcpServers": {
                "google-maps-platform-maps-tool": {
                  "command": "npx",
                  "args": ["-y", "@googlemaps/maps-grounding-essentials-mcp@latest"]
                },
                "alwaysAllow": [
                  "GoogleMapsPlatformWeatherLookup",
                  "GoogleMapsPlatformPlacesSearchText",
                  "GoogleMapsPlatformComputeRoutes"
                ]
              }
            }
            ```

8. **[Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp)**
    * When in Agent mode, Click "Tools" and then in the top header "Configure Tools" then "Install from an NPM package name" (See screenshots below)
    * <img width="597" height="199" alt="image" src="https://github.com/user-attachments/assets/061e685b-749a-4267-a471-3845c80e16b5" />

    * <img width="738" height="114" alt="image" src="https://github.com/user-attachments/assets/1f8b2879-639f-4d47-b440-a0f7b539ed09" />
    * <img width="718" height="217" alt="image" src="https://github.com/user-attachments/assets/0c3c89d0-35ab-4c31-bd39-cf21d7c0724e" />
    * Enter pacakge name `@googlemaps/maps-grounding-essentials-mcp` and ENTER, accepting the install and using the default port 3000, then ENTER one last time to confirm the change
    * <img width="717" height="114" alt="image" src="https://github.com/user-attachments/assets/d6ba49d2-0207-4bdc-9637-18f7307f767c" />


9. **[Windsurf](https://docs.windsurf.com/windsurf/cascade/mcp)**
    * Similar to Cursor instructions above.
      
10. **[Kilo Code](https://kilocode.ai/docs/features/mcp/using-mcp-in-kilo-code)**
    * Similar to the Cline and Roo Code instructions above

-----

## **Terms of Service**

This toolkit provides tools to describe the use of Google Maps Platform services. Use of Google Maps Platform services is subject to the Google Maps Platform [Terms of Service](https://cloud.google.com/maps-platform/terms), however, if your billing address is in the European Economic Area, the Google Maps Platform [EEA Terms of Service](https://cloud.google.com/terms/maps-platform/eea) will apply to your use of the Services. Functionality varies by region. [Learn more](https://developers.google.com/maps/comms/eea/faq).

This toolkit is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this repository or the RAG service called by it.

## **Support**

This toolkit is offered via an open source [license](https://github.com/googlemaps/.github/blob/master/LICENSE). It is not governed by the Google Maps Platform Support (Technical Support Services Guidelines, the SLA, or the [Deprecation Policy](https://cloud.google.com/maps-platform/terms)). However, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service.

If you find a bug, or have a feature request, please [file an issue](https://github.com/googlemaps/platform-ai/issues/new/choose) on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels](https://developers.google.com/maps/developer-community). If you'd like to contribute, please check the [contributing guide](https://github.com/googlemaps/.github/blob/master/CONTRIBUTING.md).

You can also discuss this toolkit on our [Discord server](https://discord.gg/hYsWbmk).

<!--repo-specific anchor links-->
[npm-pkg]: <https://npmjs.com/package/@googlemaps/maps-grounding-essentials-mcp>

<!--constant anchor links-->
[Discord server]: https://discord.gg/hYsWbmk
[license]: LICENSE
