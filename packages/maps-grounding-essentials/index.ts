/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { GoogleMapsPlatformWeatherLookup, handleGoogleMapsPlatformWeatherLookup } from './weather-lookup.js';
import { GoogleMapsPlatformPlacesSearchText, handleGoogleMapsPlatformPlacesSearchText } from './places-search-text.js';
import { GoogleMapsPlatformComputeRoutes, handleGoogleMapsPlatformComputeRoutes } from './routes-compute.js';


export function getServer(): Server {
    return new Server(
        {
            name: "google-maps-platform-maps-tools",
            version: "0.0.1",
        },
        {
            capabilities: {
                tools: {},
                logging: {},
                resources: {}
            },
        }
    );
}

const server = getServer();

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [GoogleMapsPlatformWeatherLookup, GoogleMapsPlatformPlacesSearchText, GoogleMapsPlatformComputeRoutes],
}));

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {

    if (request.params.name == "GoogleMapsPlatformWeatherLookup") {
        return handleGoogleMapsPlatformWeatherLookup(request, server);
    } else if (request.params.name == "GoogleMapsPlatformPlacesSearchText") {
        return handleGoogleMapsPlatformPlacesSearchText(request, server);
    } else if (request.params.name == "GoogleMapsPlatformComputeRoutes") {
        return handleGoogleMapsPlatformComputeRoutes(request, server);
    }
    else {
        server.sendLoggingMessage({
            level: "info",
            data: `Tool not found: ${request.params.name}`,
        });

        return {
            content: [{ type: 'text', text: "Invalid Tool called" }]
        };
    }
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.info("Google Maps Platform Maps Tools MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});
