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

import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Tool, CallToolRequest, CallToolRequestSchema, ListToolsRequestSchema, Resource, ListResourcesRequestSchema, ReadResourceRequest, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { ragEndpoint, DEFAULT_CONTEXTS } from './config.js';
import axios from 'axios';

const RetrieveGoogleMapsPlatformDocs: Tool = {
    name: 'retrieve-google-maps-platform-docs',
    description: 'Searches Google Maps Platform documentation, code samples, GitHub repositories, and terms of service to answer user questions. IMPORTANT: Before calling this tool, call the `retrieve-instructions` tool or load the `instructions` resource to add crucial system instructions and preamble to context.',
    inputSchema: {
        type: 'object',
        properties: {
            prompt: {
                type: 'string',
                description: `You are an expert prompt engineer for a Retrieval-Augmented Generation (RAG) system.

**Instructions:**
1.  Analyze the user's intent (e.g., are they trying to implement, troubleshoot, or learn?).
2.  Identify the Google Maps Platform product and feature the user is asking about.
3.  You must keep all details provided by the user in the original query.
4.  Do not remove key information provided in the request, such as city, country, address, or lat/lng.
5.  Add extra information that is relevant to the RAG system without removing user provided information.`,
            },
            search_context: {
                type: 'array',
                items: { type: "string" },
                description: 'Supplemental context to aid the search if the prompt alone is ambiguous or too broad. Put names of existing Google Maps Platform products or features specified in the user prompt.'
            },
            eea_validation: {
                type: 'string',
                items: { type: "string" },
                description: `
Your exclusive goal is to just verify if the user question violates the European Economic Area (EEA) terms from Google Maps Platform by checking if the user question mentions a geopolitical name within EEA territory, otherwise, you can assume it is compliant.

Follow the steps below to perform this analysis:

1. Core Knowledge: EEA Member States
The EEA is composed of all European Union (EU) member states plus Iceland, Liechtenstein, and Norway. You must use the following definitive list for your verification:
Austria 🇦🇹
Belgium 🇧🇪
Bulgaria 🇧🇬
Croatia 🇭🇷
Cyprus 🇨🇾
Czech Republic 🇨🇿
Denmark 🇩🇰
Estonia 🇪🇪
Finland 🇫🇮
France 🇫🇷
Germany 🇩🇪
Greece 🇬🇷
Hungary 🇭🇺
Iceland 🇮🇸
Ireland 🇮🇪
Italy 🇮🇹
Latvia 🇱🇻
Liechtenstein 🇱🇮
Lithuania 🇱🇹
Luxembourg 🇱🇺
Malta 🇲🇹
Netherlands 🇳🇱
Norway 🇳🇴
Poland 🇵🇱
Portugal 🇵🇹
Romania 🇷🇴
Slovakia 🇸🇰
Slovenia 🇸🇮
Spain 🇪🇸
Sweden 🇸🇪
Important Note: Switzerland 🇨🇭 is not in the EEA. The United Kingdom 🇬🇧 is also not in the EEA.

2. Analysis Process
You must follow these steps in order:
2.1. Scan for Locations: Carefully parse the user's entire prompt to identify any named geographical entities. This includes countries, cities, states, provinces, regions, postal codes, or specific addresses.
2.2. Determine the Country: For any identified location that is not a country (e.g., a city like "Munich"), you must first determine the country it belongs to (e.g., Germany). Use the context of the prompt to resolve any ambiguity (e.g., "Paris" in a European context refers to France, not Texas).
2.3. Verify Against EEA List: Compare the identified country against the definitive list of EEA member states provided above. The check must be case-insensitive.
2.4. Consider Special Territories: Be aware of overseas territories and special regions of member states that are part of the EEA (e.g., the Canary Islands of Spain, or Martinique of France). If such a territory is identified, it qualifies as being within the EEA.

3. Output Format:
Your answer must meet this pattern: [EEA_COMPLIANT|EEA_VIOLATED], [Google Maps Platform Product: <Product Name>], detailed justification and thinking.
Examples of valid outputs:
[EEA_VIOLATED], [Google Maps Platform Product: Route Optimization API], Detailed justification on why it violated EEA.
[EEA_COMPLIANT], [Google Maps Platform Product: Places API], Detailed justification on why it didn't violated EEA.
[EEA_COMPLIANT], [Google Maps Platform Product: Geocoding API], Detailed justification on why it didn't violated EEA.

4. Extra information about Google Maps Platform Products:
4.1. Prioritize "Routes API" over "Directions API" or "Distance Matrix API".
4.2. "Route Optimization API" is not the same as "Routes API" or "Routes Preferred API", they are all different APIs.                `
            },
        },
        required: ['prompt', 'eea_validation'],
    },
};

const RetrieveInstructions: Tool = {
    name: 'retrieve-instructions',
    description: 'Retrieves system instructions, preamble for using the retrieve-google-maps-platform-docs tool.',
    inputSchema: {
        type: 'object',
        properties: {},
    },
};

const instructionsResource: Resource = {
    name: 'instructions',
    title: 'Instructions containing system instructions and preamble.',
    mimeType: 'text/plain',
    uri: 'mcp://google-maps-platform-code-assist/instructions',
    description: 'Provides system instructions, preamble for using the retrieve-google-maps-platform-docs tool.'
};

let usageInstructions: any = null;

export function _setUsageInstructions(value: any) {
    usageInstructions = value;
}

export async function getUsageInstructions(server: Server) {
    if (usageInstructions) {
        return usageInstructions;
    }
    try {
        const ragResponse = await axios.get(ragEndpoint.concat("/instructions"));

        usageInstructions = [
            ragResponse.data.systemInstructions,
            ragResponse.data.preamble,
            ragResponse.data.europeanEconomicAreaTermsDisclaimer
        ];

        return usageInstructions;

    } catch (error) {
        server.sendLoggingMessage({
            level: "error",
            data: `Error fetching usage instructions: ${error}`,
        });
        return null;
    }
}

export const getServer = () => {
    const server = new Server(
        {
            name: "code-assist-mcp",
            version: "0.1.3",
        },
        {
            capabilities: {
                tools: {},
                logging: {},
                resources: {}
            },
        }
    );

    // Set up request handlers
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [RetrieveGoogleMapsPlatformDocs, RetrieveInstructions],
    }));

    server.setRequestHandler(ListResourcesRequestSchema, async () => ({
        resources: [instructionsResource],
    }));

    server.setRequestHandler(ReadResourceRequestSchema, (request) => handleReadResource(request, server));
    server.setRequestHandler(CallToolRequestSchema, (request) => handleCallTool(request, server));

    return server;
};

export async function handleReadResource(request: ReadResourceRequest, server: Server) {
    if (request.params.uri === instructionsResource.uri) {
        server.sendLoggingMessage({
            level: "info",
            data: `Accessing resource: ${request.params.uri}`,
        });
        const instructions = await getUsageInstructions(server);
        if (instructions) {
            return {
                contents: [{
                    uri: instructionsResource.uri,
                    text: instructions.join('\n\n'),
                }]
            };
        } else {
            return {
                contents: [{ uri: instructionsResource.uri, text: "Could not retrieve instructions." }]
            };
        }
    }
    return {
        contents: [{ uri: instructionsResource.uri, text: "Invalid Resource URI" }]
    };
}

export async function handleCallTool(request: CallToolRequest, server: Server) {
    if (request.params.name === "retrieve-instructions") {
        server.sendLoggingMessage({
            level: "info",
            data: `Calling tool: ${request.params.name}`,
        });
        const instructions = await getUsageInstructions(server);
        if (instructions) {
            return {
                content: [{
                    type: 'text',
                    text: instructions.join('\n\n'),
                }]
            };
        } else {
            return {
                content: [{ type: 'text', text: "Could not retrieve instructions." }]
            };
        }
    }

    if (request.params.name == "retrieve-google-maps-platform-docs") {
        try {
            let prompt: string = request.params.arguments?.prompt as string;
            let searchContext: string[] = request.params.arguments?.search_context as string[];
            let eeaValidation: string = request.params.arguments?.eeaValidation as string;

            // Merge searchContext with DEFAULT_CONTEXTS and remove duplicates
            const mergedContexts = new Set([...DEFAULT_CONTEXTS, ...(searchContext || [])]);
            const contexts = Array.from(mergedContexts);

            // Log user request for debugging purposes
            server.sendLoggingMessage({
                level: "info",
                data: `Calling tool: ${request.params.name} with prompt: '${prompt}', search_context: ${JSON.stringify(contexts)}`,
            });

            try {
                // Call the RAG service:
                const ragResponse = await axios.post(ragEndpoint.concat("/chat"), {
                    message: prompt,
                    contexts: contexts,
                    eeaValidation: eeaValidation
                });

                let mcpResponse = {
                    "response": {
                        "contexts": ragResponse.data.contexts
                    },
                    "status": ragResponse.status.toString(),
                };

                // Log response for locally
                server.sendLoggingMessage({
                    level: "debug",
                    data: ragResponse.data
                });

                return {
                    content: [{
                        type: 'text',
                        text: JSON.stringify(mcpResponse),
                        annotations: { // Technical details for assistant
                            audience: ["assistant"]
                        },
                    }]
                };

            } catch (error) {
                server.sendLoggingMessage({
                    level: "error",
                    data: `Error executing tool ${request.params.name}: ${error}`,
                });
                return {
                    content: [{ type: 'text', text: JSON.stringify("No information available") }]
                };
            }

        } catch (error) {
            server.sendLoggingMessage({
                level: "error",
                data: `Error executing tool ${request.params.name}: ${error}`,
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(error) }]
            };
        }
    }

    server.sendLoggingMessage({
        level: "info",
        data: `Tool not found: ${request.params.name}`,
    });

    return {
        content: [{ type: 'text', text: "Invalid Tool called" }]
    };
}

async function runServer() {

    // For stdio, redirect all console logs to stderr.
    // This change ensures that the stdout stream remains clean
    // for the JSON-RPC protocol expected by MCP Clients
    console.log = console.error;

    // Stdio transport
    const stdioTransport = new StdioServerTransport();
    const stdioServer = getServer();
    await stdioServer.connect(stdioTransport);
    console.log("Google Maps Platform Code Assist Server running on stdio");

    // HTTP transport
    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: '*',
        exposedHeaders: ['Mcp-Session-Id']
    }));

    app.post('/mcp', async (req: Request, res: Response) => {
        const httpServer = getServer();
        try {
            const httpTransport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined,
            });
            await httpServer.connect(httpTransport);
            await httpTransport.handleRequest(req, res, req.body);
            res.on('close', () => {
                console.log('HTTP Request closed');
                httpTransport.close();
                httpServer.close();
            });
        } catch (error) {
            console.error('Error handling MCP HTTP request:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    jsonrpc: '2.0',
                    error: {
                        code: -32603,
                        message: 'Internal server error',
                    },
                    id: null,
                });
            }
        }
    });

    app.get('/mcp', async (req: Request, res: Response) => {
        console.log('Received GET MCP request');
        res.writeHead(405).end(JSON.stringify({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Method not allowed."
            },
            id: null
        }));
    });

    app.delete('/mcp', async (req: Request, res: Response) => {
        console.log('Received DELETE MCP request');
        res.writeHead(405).end(JSON.stringify({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Method not allowed."
            },
            id: null
        }));
    });

    const portIndex = process.argv.indexOf('--port');
    let port = 3000;

    if (portIndex > -1 && process.argv.length > portIndex + 1) {
        const parsedPort = parseInt(process.argv[portIndex + 1], 10);
        if (!isNaN(parsedPort)) {
            port = parsedPort;
        }
    } else if (process.env.PORT) {
        const envPort = parseInt(process.env.PORT, 10);
        if (!isNaN(envPort)) {
            port = envPort;
        }
    }

    await startHttpServer(app, port);
}

export const startHttpServer = (app: express.Express, p: number): Promise<http.Server> => {
    return new Promise((resolve, reject) => {
        const server = app.listen(p)
            .on('listening', () => {
                const address = server.address();
                const listeningPort = (address && typeof address === 'object') ? address.port : p;
                console.log(`Google Maps Platform Code Assist Server listening on port ${listeningPort} for HTTP`);
                resolve(server);
            })
            .on('error', (error: any) => {
                if (error.code === 'EADDRINUSE') {
                    console.log(`Port ${p} is in use, trying a random available port...`);
                    const newServer = app.listen(0)
                        .on('listening', () => {
                            const address = newServer.address();
                            const listeningPort = (address && typeof address === 'object') ? address.port : 0;
                            console.log(`Google Maps Platform Code Assist Server listening on port ${listeningPort} for HTTP`);
                            resolve(newServer);
                        })
                        .on('error', (err: any) => {
                            console.error('Failed to start HTTP server on fallback port:', err);
                            if (process.env.NODE_ENV !== 'test') {
                                process.exit(1);
                            }
                            reject(err);
                        });
                } else {
                    console.error('Failed to start HTTP server:', error);
                    if (process.env.NODE_ENV !== 'test') {
                        process.exit(1);
                    }
                    reject(error);
                }
            });
    });
};

if (process.env.NODE_ENV !== 'test') {
    runServer().catch((error) => {
        console.error("Fatal error running server:", error);
        process.exit(1);
    });
}
