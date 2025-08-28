# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.6] - 2025-08-28

### ✨ Features

*   **Streamable HTTP Support:** Implemented full support for the MCP Streamable HTTP transport, including advanced compliance features from the latest spec. Your favorite AI assistants can now connect to the Code Assist server remotely!
*   **Health Check Endpoint:** Added a `/health` endpoint to the HTTP server for monitoring and infrastructure health checks.

### 🛠️ Fixes

*   Corrected formatting and terminology in the `README.md` for Streamable HTTP instructions.
*   Fixed JSON configuration for Cline and Roo Code MCP clients.
*   Removed trailing slash from the Gemini CLI MCP installation command for consistency.

### 📚 Documentation

*   **Major README Overhaul:** Reorganized sections and significantly enhanced the `README.md` with detailed instructions for:
    *   All supported MCP transports (`stdio` and `Streamable HTTP`).
    *   Connecting GCP services to a remote Cloud Run deployment.
    *   New security features and compliance details.
    *   Step-by-step instructions for Microsoft Copilot integration.
*   Added a "Try in Firebase Studio" button to the `README.md`.
*   Clarified Cloud Run deployment settings and security instructions.