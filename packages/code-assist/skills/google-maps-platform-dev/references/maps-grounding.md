# Maps Grounding for AI (2026 Guide)

Two distinct options exist for grounding AI agents with Google Maps data. Choose based on your infrastructure (Client vs. Server) and scale.

## Comparison Matrix

| Feature | **Grounding Lite** (MCP) | **Grounding in Vertex AI** |
| :--- | :--- | :--- |
| **Best For** | Prototyping, Client-side Agents (Claude, IDEs), Low volume. | Production Enterprise Apps, Server-side RAG, High volume. |
| **Architecture** | **Model Context Protocol (MCP)** Server. Runs locally or via proxy. | **Vertex AI Service**. Fully managed server-side integration. |
| **Dataset** | Live Places API, Routes (Basic), Weather. | Full 250M+ Places Database, highly optimized for RAG. |
| **Pricing** | **Free** (during Experimental phase). Quotas apply. | **Tiered.** Free daily tier (~1.5k req), then ~$25 per 1k requests. |
| **Models** | Any LLM supporting MCP (Claude 3.5, Gemini 2.0/3.0). | Gemini Models on Vertex AI (Pro/Flash). |
| **Setup** | `npm install @googlemaps/code-assist-mcp` | Enable via Google Cloud Console > Vertex AI. |

---

## 1. Grounding Lite (The "Hacker's Choice")

**Status:** Experimental
**Cost:** Free (Usage quotas apply: ~100 req/min)

A lightweight MCP server that exposes specific Google Maps tools to your agent.

### Capabilities
*   **Search Places:** Text search returning Place IDs, locations, and summaries.
*   **Lookup Weather:** Current, hourly, and daily forecasts.
*   **Compute Routes:** Distance and duration *only* (No turn-by-turn steps).

### Installation
**Gemini CLI:**
```bash
gemini mcp add google-maps-platform npx -y @googlemaps/code-assist-mcp
```

**Claude Desktop / IDEs:**
Add to your config:
```json
"google-maps-platform": {
  "command": "npx",
  "args": ["-y", "@googlemaps/code-assist-mcp"]
}
```

---

## 2. Grounding in Vertex AI (The "Enterprise Choice")

**Status:** Preview / GA
**Cost:** Pay-as-you-go (~$0.025 per query)

A managed RAG (Retrieval-Augmented Generation) service integrated directly into the Vertex AI Studio and SDKs.

### Capabilities
*   **Deep RAG:** Automatically retrieves, ranks, and synthesizes data from 250 million+ places.
*   **Fact Verification:** Reduces hallucinations by grounding responses in real-world data.
*   **Vertex Integration:** Works seamlessly with `Gemini 2.5 Pro`, `Gemini 3.0`.

### Python SDK Example
```python
from vertexai.preview.generative_models import GenerativeModel, Tool, grounding

# Define the Google Maps tool
maps_tool = Tool.from_google_maps_retrieval(
    retrieval=grounding.GoogleMapsRetrieval()
)

model = GenerativeModel("gemini-2.5-pro-preview-0409")

response = model.generate_content(
    "Find a quiet coffee shop in Chelsea, NYC open past 8 PM",
    tools=[maps_tool]
)

print(response.text)
```