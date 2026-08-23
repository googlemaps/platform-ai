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
import { randomUUID } from "node:crypto";
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Tool, CallToolRequest, CallToolRequestSchema, ListToolsRequestSchema, Resource, ListResourcesRequestSchema, ReadResourceRequest, ReadResourceRequestSchema, isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { ragEndpoint, DEFAULT_CONTEXTS, SOURCE } from './config.js';
import axios from 'axios';

// MCP Streamable HTTP compliance: Accept header validation
function validateAcceptHeader(req: Request): boolean {
    const acceptHeader = req.headers.accept;
    if (!acceptHeader) return false;

    const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
    return acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');
}

// Feature 4: Origin header validation for DNS rebinding protection
function validateOriginHeader(req: Request): boolean {
    const origin = req.headers.origin;

    // Allow requests without Origin header (server-to-server)
    if (!origin) return true;

    // For development, allow localhost origins
    if (process.env.NODE_ENV !== 'production') {
        return origin.startsWith('http://localhost') || origin.startsWith('https://localhost');
    }

    // In production, validate against allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    return allowedOrigins.includes(origin);
}

const RetrieveGoogleMapsPlatformDocs: Tool = {
    name: 'retrieve-google-maps-platform-docs',
    description: 'Searches Google Maps Platform documentation, code samples, architecture center, trust center, GitHub repositories (including sample code and client libraries for react-google-maps, flutter, compose, utilities, swiftui, and more), and terms of service to answer user questions. CRITICAL: You MUST call the `retrieve-instructions` tool or load the `instructions` resource BEFORE using this tool. This provides essential context required for this tool to function correctly.',
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
            }
        },
        required: ['prompt'],
    },
};

const RetrieveInstructions: Tool = {
    name: 'retrieve-instructions',
    description: 'CRITICAL: Call this tool first for any queries related to location, mapping, addresses, routing, points of interest, location analytics, or geospatial data (e.g., Google Earth). It provides the foundational context on Google Maps Platform (APIs for maps, routes, and places) and best practices that are essential for the other tools to function correctly. This tool MUST be called before any other tool.',
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
    description: 'Contains critical system instructions and context for Google Maps Platform (APIs for maps, routes, and places), Location Analytics, Google Earth, and Google Earth Engine. You MUST load this resource or call the `retrieve-instructions` tool before using any other tool, especially `retrieve-google-maps-platform-docs`, to understand how to handle location-based use cases.'
};

let usageInstructions: any = null;

// Session management for StreamableHTTP transport
const transports = new Map<string, StreamableHTTPServerTransport>();

export function _setUsageInstructions(value: any) {
    usageInstructions = value;
}

export async function getUsageInstructions(server: Server) {
    if (usageInstructions) {
        return usageInstructions;
    }
    try {
        const ragResponse = await axios.get(ragEndpoint.concat("/instructions"), {
            params: {
                source: SOURCE
            }
        });

        usageInstructions = [
            ragResponse.data.systemInstructions,
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
            version: "0.1.7",
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
                    source: SOURCE
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

    // HTTP transport with session management
    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: '*',
        exposedHeaders: ['Mcp-Session-Id']
    }));

    app.all('/mcp', async (req: Request, res: Response) => {
        if (!validateOriginHeader(req)) {
            return res.status(403).json({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Forbidden: Invalid or missing Origin header', data: { code: 'INVALID_ORIGIN' } },
                id: null,
            });
        }

        if (!validateAcceptHeader(req)) {
            return res.status(406).json({
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Not Acceptable: Accept header must include both application/json and text/event-stream', data: { code: 'INVALID_ACCEPT_HEADER' } },
                id: null,
            });
        }

        const sessionId = req.headers['mcp-session-id'] as string | undefined;
        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports.has(sessionId)) {
            transport = transports.get(sessionId)!;
        } else if (!sessionId && isInitializeRequest(req.body)) {
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                onsessioninitialized: (newSessionId) => {
                    transports.set(newSessionId, transport);
                    console.log(`StreamableHTTP session initialized: ${newSessionId}`);
                }
            });

            transport.onclose = () => {
                const sid = transport.sessionId;
                if (sid && transports.has(sid)) {
                    transports.delete(sid);
                    console.log(`Transport closed for session ${sid}`);
                }
            };

            const server = getServer();
            await server.connect(transport);
        } else {
            const errorData = sessionId ? { code: 'SESSION_NOT_FOUND', message: 'Not Found: Invalid session ID' } : { code: 'BAD_REQUEST', message: 'Bad Request: No valid session ID provided for non-init request' };
            const statusCode = sessionId ? 404 : 400;
            return res.status(statusCode).json({
                jsonrpc: '2.0',
                error: { code: -32000, message: errorData.message, data: { code: errorData.code } },
                id: null,
            });
        }

        try {
            await transport.handleRequest(req, res, req.body);
        } catch (error) {
            console.error(`Error handling MCP ${req.method} request:`, error);
            if (!res.headersSent) {
                res.status(500).json({
                    jsonrpc: '2.0',
                    error: { code: -32603, message: 'Internal server error' },
                    id: null,
                });
            }
        }
    });

    // Health check endpoint
    app.get('/health', (req: Request, res: Response) => {
        res.json({
            status: 'healthy',
            activeSessions: Object.keys(transports).length,
            timestamp: new Date().toISOString()
        });
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

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    for (const transport of transports.values()) {
        try {
            await transport.close();
        } catch (error) {
            console.error(`Error closing transport for session ${transport.sessionId}:`, error);
        }
    }
    transports.clear();
    console.log('Server shutdown complete');
    process.exit(0);
});

if (process.env.NODE_ENV !== 'test') {
    runServer().catch((error) => {
        console.error("Fatal error running server:", error);
        process.exit(1);
    });
}
