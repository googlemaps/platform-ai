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
import cors from 'cors';
import { createServer } from 'http';
import { Command } from 'commander';
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
            }
        },
        required: ['prompt'],
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
                    contexts: contexts
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

export function runServer() {
    return new Promise<void>((resolve, reject) => {
        // Parse CLI arguments
        const program = new Command();
        program
            .option('--port <number>', 'port for HTTP transport', '3000')
            .allowUnknownOption() // Allow other flags to pass through
            .parse(process.argv);

        const cliOptions = program.opts();
        const initialPort = parseInt(cliOptions.port, 10);

        // Stdio transport
        const stdioTransport = new StdioServerTransport();
        const stdioServer = getServer();
        stdioServer.connect(stdioTransport).then(() => {
            console.info("Google Maps Platform Code Assist Server running on stdio");
        });

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

        const httpServer = createServer(app);

        const startHttpServer = (port: number, maxAttempts = 11) => {
            // Stop if we've exceeded the max number of retries
            if (port >= initialPort + maxAttempts) {
                const errorMessage = `Failed to start HTTP server: Could not find an open port after ${maxAttempts} attempts, starting from port ${initialPort}.`;
                console.error(errorMessage);
                if (process.env.NODE_ENV === 'test') {
                    return reject(new Error(errorMessage)); // Return to stop execution
                }
                return process.exit(1); // Return to stop execution
            }

            httpServer.once('error', (err: NodeJS.ErrnoException) => {
                if (err.code === 'EADDRINUSE') {
                    console.warn(`Port ${port} is in use, trying port ${port + 1}...`);
                    startHttpServer(port + 1, maxAttempts);
                } else {
                    const errorMessage = `Failed to start HTTP server: ${err.message}`;
                    console.error(errorMessage);
                    if (process.env.NODE_ENV === 'test') {
                        reject(new Error(errorMessage));
                    } else {
                        process.exit(1);
                    }
                }
            });

            httpServer.listen(port, () => {
                console.info(`Google Maps Platform Code Assist Server listening on port ${port} for HTTP`);
                resolve();
            });
        };

        startHttpServer(initialPort);
    });
}

if (process.env.NODE_ENV !== 'test') {
    runServer().catch((error) => {
        console.error("Fatal error running server:", error);
        process.exit(1);
    });
}
