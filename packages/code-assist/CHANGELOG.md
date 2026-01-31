# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### ✨ Features

*   **Agent Skill (AgentSkills.io):** Added a Google Maps Platform Agent Skill following the [AgentSkills.io](https://agentskills.io) specification. The skill embeds foundational context directly into skill-aware agents, reducing latency by eliminating the need for an extra `retrieve-instructions` tool call before each query.
    *   `skills/google-maps-platform/SKILL.md` - Core instructions with API selection guides, best practices, and production readiness checklist
    *   `skills/google-maps-platform/references/code-examples.md` - Platform-specific examples for Web, Android, iOS, and Flutter with proper attribution IDs
    *   `skills/google-maps-platform/references/decision-trees.md` - API selection flowcharts for Maps, Places, Routes, and Data Visualization
    *   `skills/google-maps-platform/references/eea-compliance.md` - EU Digital Markets Act requirements
    *   `skills/google-maps-platform/references/attribution.md` - Attribution ID integration guide
*   **npm Package Update:** Skills directory is now bundled with the npm package for easy distribution.

### 📚 Documentation

*   Added Agent Skill section to `README.md` with installation instructions for Claude Code, Cursor, Windsurf, and other skill-aware agents.

## [0.1.7] - 2025-08-28

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