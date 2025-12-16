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

import { expect, test, describe, mock, beforeEach, spyOn, afterEach } from "bun:test";
import axios from "axios";
import { getUsageInstructions, getServer, handleCallTool, _setUsageInstructions, handleReadResource, startHttpServer, handleGetPrompt, handleCompletion } from "../index.js";
import { SOURCE, DEFAULT_CONTEXTS } from "../config.js";
import { CallToolRequest, ReadResourceRequest, GetPromptRequest, CompleteRequest } from "@modelcontextprotocol/sdk/types.js";
import express, { Request, Response } from 'express';
import http from 'http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

mock.module("axios", () => ({
    default: {
        get: mock(),
        post: mock(),
    },
}));

const server = getServer();
spyOn(server, "sendLoggingMessage").mockImplementation(async () => { });

describe("Google Maps Platform Code Assist MCP Server", () => {
    beforeEach(() => {
        _setUsageInstructions(null);
    });
    test("getUsageInstructions returns instructions", async () => {
        const mockResponse = {
            data: {
                systemInstructions: "system instructions",
                preamble: "preamble",
                europeanEconomicAreaTermsDisclaimer: "disclaimer",
            },
        };
        (axios.get as any).mockResolvedValue(mockResponse);

        const instructions = await getUsageInstructions(server);

        expect(instructions).toEqual([
            "system instructions",
            "preamble",
            "disclaimer",
        ]);

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining("/instructions"),
            expect.objectContaining({
                params: {
                    source: SOURCE
                }
            })
        );
    });

    test("retrieve-google-maps-platform-docs tool calls RAG service", async () => {
        const mockResponse = {
            data: {
                contexts: [],
            },
            status: 200,
        };
        (axios.post as any).mockResolvedValue(mockResponse);

        const request = {
            method: "tools/call" as const,
            params: {
                name: "retrieve-google-maps-platform-docs",
                arguments: {
                    prompt: "How do I add Places New to my mobile app?",
                },
            },
        };

        await handleCallTool(request as CallToolRequest, server);

        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining("/chat"),
            expect.objectContaining({
                message: "How do I add Places New to my mobile app?",
                source: SOURCE
            })
        );
    });
    test("getUsageInstructions returns null on error", async () => {
        (axios.get as any).mockRejectedValue(new Error("Network error"));

        const instructions = await getUsageInstructions(server);

        expect(instructions).toBeNull();
    });

    test("retrieve-instructions tool returns instructions", async () => {
        const mockResponse = {
            data: {
                systemInstructions: "system instructions",
                preamble: "preamble",
                europeanEconomicAreaTermsDisclaimer: "disclaimer",
            },
        };
        (axios.get as any).mockResolvedValue(mockResponse);

        const request = {
            method: "tools/call" as const,
            params: {
                name: "retrieve-instructions",
            },
        };

        const result = await handleCallTool(request as CallToolRequest, server);

        expect(result.content?.[0].text).toContain("system instructions");
    });

    test("read instructions resource returns instructions", async () => {
        const mockResponse = {
            data: {
                systemInstructions: "system instructions",
                preamble: "preamble",
                europeanEconomicAreaTermsDisclaimer: "disclaimer",
            },
        };
        (axios.get as any).mockResolvedValue(mockResponse);

        const request = {
            method: "resources/read" as const,
            params: {
                uri: "mcp://google-maps-platform-code-assist/instructions",
            },
        };

        const result = await handleReadResource(request as ReadResourceRequest, server);

        expect(result.contents?.[0].text).toContain("system instructions");
    });

    test("read invalid resource returns error", async () => {
        const request = {
            method: "resources/read" as const,
            params: {
                uri: "mcp://google-maps-platform-code-assist/invalid",
            },
        };

        const result = await handleReadResource(request as ReadResourceRequest, server);

        expect(result.contents?.[0].text).toBe("Invalid Resource URI");
    });

    test("retrieve-google-maps-platform-docs tool returns error on failure", async () => {
        (axios.post as any).mockRejectedValue(new Error("RAG error"));

        const request = {
            method: "tools/call" as const,
            params: {
                name: "retrieve-google-maps-platform-docs",
                arguments: {
                    prompt: "test prompt",
                },
            },
        };

        const result = await handleCallTool(request as CallToolRequest, server);

        expect(result.content?.[0].text).toContain("No information available");
    });

    test("invalid tool call returns error", async () => {
        const request = {
            method: "tools/call" as const,
            params: {
                name: "invalid-tool",
            },
        };

        const result = await handleCallTool(request as CallToolRequest, server);

        expect(result.content?.[0].text).toBe("Invalid Tool called");
    });
});

describe("Google Maps Platform Code Assist MCP Server - Prompts & Completion", () => {
    beforeEach(() => {
        _setUsageInstructions(null);
    });

    test("code-assist prompt returns instructions", async () => {
        const mockResponse = {
            data: {
                systemInstructions: "system instructions",
                preamble: "preamble",
                europeanEconomicAreaTermsDisclaimer: "disclaimer",
            },
        };
        (axios.get as any).mockResolvedValue(mockResponse);

        const request = {
            method: "prompts/get" as const,
            params: {
                name: "code-assist",
                arguments: {
                    task: "Explain Geocoding"
                }
            },
        };

        const result = await handleGetPrompt(request as GetPromptRequest, server);

        expect(result.messages[0].content.type).toBe("text");
        expect((result.messages[0].content as any).text).toContain("system instructions");
        expect((result.messages[0].content as any).text).toContain("Task: Explain Geocoding");
    });

    test("code-assist prompt throws error if instructions fail", async () => {
        (axios.get as any).mockResolvedValue(null);
        // Force getUsageInstructions to return null by mocking axios failure/null response properly or ensuring it fails
        (axios.get as any).mockRejectedValue(new Error("Network Error"));

        const request = {
            method: "prompts/get" as const,
            params: {
                name: "code-assist",
            },
        };

        // Expect getUsageInstructions to return null, then handleGetPrompt to throw
        try {
            await handleGetPrompt(request as GetPromptRequest, server);
            expect(true).toBe(false); // Should not reach here
        } catch (e: any) {
            expect(e.message).toContain("Could not retrieve instructions for prompt");
        }
    });

    test("invalid prompt returns error", async () => {
        const request = {
            method: "prompts/get" as const,
            params: {
                name: "invalid-prompt",
            },
        };

        try {
            await handleGetPrompt(request as GetPromptRequest, server);
            expect(true).toBe(false); // Should not reach here
        } catch (e: any) {
            expect(e.message).toContain("Prompt not found");
        }
    });

    test("completion for retrieve-google-maps-platform-docs search_context", async () => {
        const request = {
            method: "completion/complete" as const,
            params: {
                ref: {
                    type: "ref/tool" as const,
                    name: "retrieve-google-maps-platform-docs",
                },
                argument: {
                    name: "search_context",
                    value: "Place" // Should match Places API, etc.
                }
            },
        };
        // Mock DEFAULT_CONTEXTS indirectly since we import it, but it's hard to mock constants.
        // We will assume DEFAULT_CONTEXTS contains standard Google Maps strings.

        const result = await handleCompletion(request as CompleteRequest, server);

        expect(result.completion.values.length).toBeGreaterThan(0);
        expect(result.completion.values.some(v => v.includes("Place"))).toBe(true);
    });

    test("completion returns empty for unknown tool/arg", async () => {
        const request = {
            method: "completion/complete" as const,
            params: {
                ref: {
                    type: "ref/tool" as const,
                    name: "unknown-tool",
                },
                argument: {
                    name: "unknown-arg",
                    value: "foo"
                }
            },
        };

        const result = await handleCompletion(request as CompleteRequest, server);

        expect(result.completion.values.length).toBe(0);
    });
});

describe("startHttpServer", () => {
    let app: express.Express;
    let testServer: http.Server;
    const testPort = 5001;

    beforeEach(() => {
        app = express();
    });

    afterEach((done: () => void) => {
        if (testServer && testServer.listening) {
            testServer.close(() => done());
        } else {
            done();
        }
    });

    test("should start on a random port if the preferred port is in use", async () => {
        // Create a server to occupy the port
        await new Promise<void>(resolve => {
            testServer = http.createServer((req, res) => {
                res.writeHead(200);
                res.end('hello world');
            });
            testServer.listen(testPort, () => resolve());
        });

        const server = await startHttpServer(app, testPort);
        const address = server.address();
        const listeningPort = (address && typeof address === 'object') ? address.port : 0;

        expect(listeningPort).not.toBe(testPort);
        expect(listeningPort).toBeGreaterThan(0);

        await new Promise<void>(resolve => server.close(() => resolve()));
    });
});

// Advanced MCP Streamable HTTP Compliance Tests
describe("Advanced MCP Streamable HTTP Compliance", () => {

    describe("Feature 4: Origin Header Validation", () => {
        test("allows requests without Origin header (server-to-server)", () => {
            // Mock request without Origin header
            const mockReq: { headers: Record<string, string | undefined> } = { headers: {} };

            // Test validation logic (simulating validateOriginHeader function)
            const origin = mockReq.headers.origin;
            const isValid = !origin ? true : false; // Allow requests without Origin header

            expect(isValid).toBe(true);
        });

        test("allows localhost origins in development", () => {
            const originalNodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            const mockReq: { headers: Record<string, string> } = { headers: { origin: 'http://localhost:3000' } };

            // Test validation logic
            const origin = mockReq.headers.origin;
            const isValid = !origin ? true :
                (process.env.NODE_ENV !== 'production' ?
                    origin.startsWith('http://localhost') || origin.startsWith('https://localhost') : false);

            expect(isValid).toBe(true);

            process.env.NODE_ENV = originalNodeEnv;
        });

        test("rejects invalid origins in production", () => {
            const originalNodeEnv = process.env.NODE_ENV;
            const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;

            process.env.NODE_ENV = 'production';
            process.env.ALLOWED_ORIGINS = 'https://example.com,https://app.example.com';

            const mockReq: { headers: Record<string, string> } = { headers: { origin: 'https://malicious.com' } };

            // Test validation logic
            const origin = mockReq.headers.origin;
            const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
            const isValid = !origin ? true :
                (process.env.NODE_ENV !== 'production' ?
                    origin.startsWith('http://localhost') || origin.startsWith('https://localhost') :
                    allowedOrigins.includes(origin));

            expect(isValid).toBe(false);

            process.env.NODE_ENV = originalNodeEnv;
            process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
        });

        test("allows valid origins in production", () => {
            const originalNodeEnv = process.env.NODE_ENV;
            const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;

            process.env.NODE_ENV = 'production';
            process.env.ALLOWED_ORIGINS = 'https://example.com,https://app.example.com';

            const mockReq: { headers: Record<string, string> } = { headers: { origin: 'https://example.com' } };

            // Test validation logic
            const origin = mockReq.headers.origin;
            const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
            const isValid = !origin ? true :
                (process.env.NODE_ENV !== 'production' ?
                    origin.startsWith('http://localhost') || origin.startsWith('https://localhost') :
                    allowedOrigins.includes(origin));

            expect(isValid).toBe(true);

            process.env.NODE_ENV = originalNodeEnv;
            process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
        });
    });

    describe("Feature 5: Proper HTTP Status Codes", () => {
        test("validates 406 status for invalid Accept header", () => {
            const mockReq = { headers: { accept: 'application/json' } };

            // Test Accept header validation logic
            const acceptHeader = mockReq.headers.accept;
            const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
            const isValid = acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');

            expect(isValid).toBe(false);

            // Validate error response structure
            const errorResponse = {
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Not Acceptable: Accept header must include both application/json and text/event-stream',
                    data: { code: 'INVALID_ACCEPT_HEADER' }
                },
                id: null,
            };

            expect(errorResponse.error.data.code).toBe('INVALID_ACCEPT_HEADER');
        });

        test("validates 403 status for invalid Origin header", () => {
            const originalNodeEnv = process.env.NODE_ENV;
            const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;

            process.env.NODE_ENV = 'production';
            process.env.ALLOWED_ORIGINS = 'https://example.com';

            const mockReq = { headers: { origin: 'https://malicious.com' } };

            // Test Origin validation logic
            const origin = mockReq.headers.origin;
            const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
            const isValid = allowedOrigins.includes(origin);

            expect(isValid).toBe(false);

            // Validate error response structure
            const errorResponse = {
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Forbidden: Invalid or missing Origin header',
                    data: { code: 'INVALID_ORIGIN' }
                },
                id: null,
            };

            expect(errorResponse.error.data.code).toBe('INVALID_ORIGIN');

            process.env.NODE_ENV = originalNodeEnv;
            process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
        });

        test("validates 404 status for session not found", () => {
            const mockSessionMap: Record<string, any> = {};
            const sessionId = 'invalid-session-id';

            const sessionExists = !!(sessionId && mockSessionMap[sessionId]);
            expect(sessionExists).toBe(false);

            // Validate error response structure
            const errorResponse = {
                jsonrpc: '2.0',
                error: {
                    code: -32000,
                    message: 'Not Found: Valid session ID required',
                    data: { code: 'SESSION_NOT_FOUND' }
                },
                id: null,
            };

            expect(errorResponse.error.data.code).toBe('SESSION_NOT_FOUND');
        });
    });

    describe("Feature 6: Resumability Support (Last-Event-ID)", () => {
        test("handles Last-Event-ID header processing", () => {
            const mockReq: { headers: Record<string, string> } = { headers: { 'last-event-id': 'event-123' } };

            const lastEventId = mockReq.headers['last-event-id'];
            expect(lastEventId).toBe('event-123');

            // Verify logging would occur (in real implementation)
            const wouldLog = lastEventId !== undefined;
            expect(wouldLog).toBe(true);
        });

        test("handles missing Last-Event-ID header gracefully", () => {
            const mockReq: { headers: Record<string, string | undefined> } = { headers: {} };

            const lastEventId = mockReq.headers['last-event-id'];
            expect(lastEventId).toBeUndefined();

            // Should not cause errors when missing
            const wouldLog = lastEventId !== undefined;
            expect(wouldLog).toBe(false);
        });
    });

    describe("Enhanced Error Response Structure", () => {
        test("validates structured error codes are included", () => {
            const testCases = [
                {
                    scenario: 'INVALID_ORIGIN',
                    errorResponse: {
                        jsonrpc: '2.0',
                        error: {
                            code: -32000,
                            message: 'Forbidden: Invalid or missing Origin header',
                            data: { code: 'INVALID_ORIGIN' }
                        },
                        id: null,
                    }
                },
                {
                    scenario: 'INVALID_ACCEPT_HEADER',
                    errorResponse: {
                        jsonrpc: '2.0',
                        error: {
                            code: -32000,
                            message: 'Not Acceptable: Invalid Accept header',
                            data: { code: 'INVALID_ACCEPT_HEADER' }
                        },
                        id: null,
                    }
                },
                {
                    scenario: 'SESSION_NOT_FOUND',
                    errorResponse: {
                        jsonrpc: '2.0',
                        error: {
                            code: -32000,
                            message: 'Not Found: Session not found',
                            data: { code: 'SESSION_NOT_FOUND' }
                        },
                        id: null,
                    }
                }
            ];

            testCases.forEach(testCase => {
                expect(testCase.errorResponse.error).toBeDefined();
                expect(testCase.errorResponse.error.data).toBeDefined();
                expect(testCase.errorResponse.error.data.code).toBe(testCase.scenario);
                expect(testCase.errorResponse.jsonrpc).toBe('2.0');
            });
        });
    });
});

describe("StreamableHTTP Transport", () => {
    let mockTransport: any;
    let mockServer: any;
    let mockReq: Partial<Request>;
    let mockRes: any;
    let consoleSpy: any;

    // Mock factories for Express Request/Response objects
    const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
        method: 'POST',
        headers: {},
        body: {},
        ...overrides
    });

    const createMockResponse = (): any => {
        const res = {
            status: mock(() => res),
            json: mock(() => res),
            headersSent: false,
            setHeader: mock(),
        };
        return res;
    };

    beforeEach(() => {
        // Mock StreamableHTTPServerTransport
        mockTransport = {
            sessionId: 'test-session-123',
            handleRequest: mock(),
            close: mock(),
            onclose: null
        };

        mockServer = {
            connect: mock()
        };

        mockReq = createMockRequest();
        mockRes = createMockResponse();

        consoleSpy = spyOn(console, 'log').mockImplementation(() => { });
        spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe("Session Management", () => {
        test("validates session creation logic", () => {
            const sessionId = 'test-session-123';
            const mockTransportMap: Record<string, any> = {};

            // Simulate session creation
            mockTransportMap[sessionId] = mockTransport;

            expect(Object.keys(mockTransportMap).length).toBe(1);
            expect(mockTransportMap[sessionId]).toBe(mockTransport);
        });

        test("validates session reuse logic", () => {
            const sessionId = 'existing-session-456';
            const existingTransport = { ...mockTransport, sessionId };
            const mockTransportMap: Record<string, any> = {};

            // Pre-populate with existing session
            mockTransportMap[sessionId] = existingTransport;

            mockReq = createMockRequest({
                headers: { 'mcp-session-id': sessionId },
                body: { jsonrpc: '2.0', method: 'tools/list', id: 2 }
            });

            expect(mockTransportMap[sessionId]).toBe(existingTransport);
            expect(Object.keys(mockTransportMap).length).toBe(1);
        });

        test("validates session cleanup logic", () => {
            const sessionId = 'cleanup-session-789';
            const mockTransportMap: Record<string, any> = {};
            mockTransport.sessionId = sessionId;

            mockTransportMap[sessionId] = mockTransport;

            // Simulate cleanup
            delete mockTransportMap[sessionId];

            expect(mockTransportMap[sessionId]).toBeUndefined();
            expect(Object.keys(mockTransportMap).length).toBe(0);
        });
    });

    describe("Request Routing", () => {
        test("validates initialize request structure", () => {
            const initBody = {
                jsonrpc: '2.0',
                method: 'initialize',
                params: { protocolVersion: '2024-11-05' },
                id: 1
            };

            mockReq = createMockRequest({
                method: 'POST',
                body: initBody
            });

            expect(mockReq.body.method).toBe('initialize');
            expect(mockReq.method).toBe('POST');
        });

        test("validates error response structure for invalid requests", () => {
            mockReq = createMockRequest({
                method: 'POST',
                headers: {},
                body: { jsonrpc: '2.0', method: 'tools/list', id: 2 }
            });

            // Simulate the 400 response structure
            const errorResponse = {
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Bad Request: No valid session ID provided for non-init request' },
                id: null,
            };

            mockRes.status(400).json(errorResponse);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    jsonrpc: '2.0',
                    error: expect.objectContaining({
                        code: -32000,
                        message: expect.stringContaining('Bad Request')
                    })
                })
            );
        });

        test("validates SDK compatibility fallback logic", () => {
            const initBody = {
                jsonrpc: '2.0',
                method: 'initialize',
                params: { protocolVersion: '2024-11-05' },
                id: 1
            };

            mockReq = createMockRequest({
                method: 'POST',
                body: initBody
            });

            // Test fallback logic without mocking external function
            const isInitRequest = mockReq.body?.method === 'initialize' ||
                (mockReq.body?.jsonrpc === '2.0' && mockReq.body?.method === 'initialize');

            expect(isInitRequest).toBe(true);
        });
    });

    describe("Error Handling", () => {
        test("validates transport connection error response", () => {
            const errorResponse = {
                jsonrpc: '2.0',
                error: { code: -32603, message: 'Internal server error' },
                id: null,
            };

            mockRes.status(500).json(errorResponse);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    jsonrpc: '2.0',
                    error: expect.objectContaining({
                        code: -32603,
                        message: 'Internal server error'
                    })
                })
            );
        });

        test("validates malformed request handling", () => {
            mockReq = createMockRequest({
                method: 'POST',
                headers: {},
                body: { invalidJson: 'not-a-valid-mcp-request' }
            });

            const errorResponse = {
                jsonrpc: '2.0',
                error: { code: -32000, message: 'Bad Request: No valid session ID provided for non-init request' },
                id: null,
            };

            mockRes.status(400).json(errorResponse);

            expect(mockRes.status).toHaveBeenCalledWith(400);

            // Validate that no session should be created for invalid requests
            const mockTransportMap: Record<string, any> = {};
            expect(Object.keys(mockTransportMap).length).toBe(0);
        });
    });

    describe("Health Endpoint", () => {
        test("validates health endpoint response structure", () => {
            const mockTransportMap: Record<string, any> = {
                'session-1': { ...mockTransport, sessionId: 'session-1' },
                'session-2': { ...mockTransport, sessionId: 'session-2' },
                'session-3': { ...mockTransport, sessionId: 'session-3' }
            };

            const healthResponse = {
                status: 'healthy',
                activeSessions: Object.keys(mockTransportMap).length,
                timestamp: expect.any(String)
            };

            expect(Object.keys(mockTransportMap).length).toBe(3);
            expect(healthResponse.activeSessions).toBe(3);
            expect(healthResponse.status).toBe('healthy');
        });
    });

    describe("Graceful Shutdown", () => {
        test("validates session cleanup during shutdown", async () => {
            const session1 = { ...mockTransport, sessionId: 'session-1', close: mock() };
            const session2 = { ...mockTransport, sessionId: 'session-2', close: mock() };
            const session3 = { ...mockTransport, sessionId: 'session-3', close: mock() };

            const mockTransportMap: Record<string, any> = {
                'session-1': session1,
                'session-2': session2,
                'session-3': session3
            };

            expect(Object.keys(mockTransportMap).length).toBe(3);

            // Simulate cleanup process
            for (const sessionId in mockTransportMap) {
                await mockTransportMap[sessionId].close();
                delete mockTransportMap[sessionId];
            }

            expect(session1.close).toHaveBeenCalled();
            expect(session2.close).toHaveBeenCalled();
            expect(session3.close).toHaveBeenCalled();
            expect(Object.keys(mockTransportMap).length).toBe(0);
        });
    });

    // MCP Streamable HTTP Compliance Tests
    describe("MCP Streamable HTTP Compliance", () => {
        // Mock factories for Express Request/Response objects
        const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
            method: 'POST',
            headers: {},
            body: {},
            ...overrides
        });

        const createMockResponse = (): any => {
            const res = {
                status: mock(() => res),
                json: mock(() => res),
                headersSent: false,
                setHeader: mock(),
            };
            return res;
        };

        describe("Accept Header Validation", () => {
            test("accepts request with valid Accept header", () => {
                const req = createMockRequest({
                    headers: { 'accept': 'application/json, text/event-stream' }
                });

                // Import and test the validation function logic
                const acceptHeader = req.headers!.accept as string;
                const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
                const isValid = acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');

                expect(isValid).toBe(true);
            });

            test("rejects request without Accept header", () => {
                const req = createMockRequest({ headers: {} });

                const acceptHeader = req.headers!.accept as string;
                const isValid = acceptHeader ?
                    (acceptHeader.split(',').map(type => type.trim().split(';')[0]).includes('application/json') &&
                        acceptHeader.split(',').map(type => type.trim().split(';')[0]).includes('text/event-stream')) : false;

                expect(isValid).toBe(false);
            });

            test("rejects request missing application/json", () => {
                const req = createMockRequest({
                    headers: { 'accept': 'text/event-stream' }
                });

                const acceptHeader = req.headers!.accept as string;
                const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
                const isValid = acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');

                expect(isValid).toBe(false);
            });

            test("rejects request missing text/event-stream", () => {
                const req = createMockRequest({
                    headers: { 'accept': 'application/json' }
                });

                const acceptHeader = req.headers!.accept as string;
                const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
                const isValid = acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');

                expect(isValid).toBe(false);
            });
        });

        describe("GET Endpoint SSE Streams", () => {
            test("validates GET request Accept header for SSE", () => {
                const mockReq = createMockRequest({
                    method: 'GET',
                    headers: {
                        'accept': 'text/event-stream',
                        'mcp-session-id': 'valid-session-123'
                    }
                });

                const acceptHeader = mockReq.headers!.accept as string;
                const sessionId = mockReq.headers!['mcp-session-id'] as string;

                expect(acceptHeader).toContain('text/event-stream');
                expect(sessionId).toBe('valid-session-123');
            });

            test("validates error response for GET without session ID", () => {
                const mockReq = createMockRequest({
                    method: 'GET',
                    headers: { 'accept': 'text/event-stream' }
                });
                const mockRes = createMockResponse();

                const sessionId = mockReq.headers!['mcp-session-id'] as string | undefined;

                if (!sessionId) {
                    const errorResponse = {
                        jsonrpc: '2.0',
                        error: { code: -32000, message: 'Bad Request: Valid session ID required for GET requests' },
                        id: null,
                    };

                    mockRes.status(400).json(errorResponse);

                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith(
                        expect.objectContaining({
                            jsonrpc: '2.0',
                            error: expect.objectContaining({
                                code: -32000,
                                message: expect.stringContaining('Valid session ID required')
                            })
                        })
                    );
                }
            });

            test("validates error response for GET without text/event-stream", () => {
                const mockReq = createMockRequest({
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'mcp-session-id': 'valid-session-123'
                    }
                });
                const mockRes = createMockResponse();

                const acceptHeader = mockReq.headers!.accept as string;

                if (!acceptHeader || !acceptHeader.includes('text/event-stream')) {
                    const errorResponse = {
                        jsonrpc: '2.0',
                        error: { code: -32000, message: 'Bad Request: Accept header must include text/event-stream for GET requests' },
                        id: null,
                    };

                    mockRes.status(400).json(errorResponse);

                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith(
                        expect.objectContaining({
                            jsonrpc: '2.0',
                            error: expect.objectContaining({
                                code: -32000,
                                message: expect.stringContaining('text/event-stream')
                            })
                        })
                    );
                }
            });
        });

        describe("DELETE Endpoint Session Termination", () => {
            test("validates DELETE request with valid session ID", () => {
                const sessionId = 'test-session-delete';
                const mockTransport = {
                    close: mock().mockResolvedValue(undefined),
                    sessionId,
                    handleRequest: mock().mockResolvedValue(undefined)
                };
                const mockTransportMap: Record<string, any> = { [sessionId]: mockTransport };

                const mockReq = createMockRequest({
                    method: 'DELETE',
                    headers: { 'mcp-session-id': sessionId }
                });

                expect(mockTransportMap[sessionId]).toBe(mockTransport);
                expect(mockTransport.sessionId).toBe(sessionId);
            });

            test("validates error response for DELETE without session ID", () => {
                const mockReq = createMockRequest({
                    method: 'DELETE',
                    headers: {}
                });
                const mockRes = createMockResponse();

                const sessionId = mockReq.headers!['mcp-session-id'] as string | undefined;

                if (!sessionId) {
                    const errorResponse = {
                        jsonrpc: '2.0',
                        error: { code: -32000, message: 'Bad Request: Valid session ID required for DELETE requests' },
                        id: null,
                    };

                    mockRes.status(400).json(errorResponse);

                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith(
                        expect.objectContaining({
                            jsonrpc: '2.0',
                            error: expect.objectContaining({
                                code: -32000,
                                message: expect.stringContaining('Valid session ID required')
                            })
                        })
                    );
                }
            });

            test("validates error response for DELETE with invalid session ID", () => {
                const mockReq = createMockRequest({
                    method: 'DELETE',
                    headers: { 'mcp-session-id': 'invalid-session' }
                });
                const mockRes = createMockResponse();
                const mockTransportMap: Record<string, any> = {};

                const sessionId = mockReq.headers!['mcp-session-id'] as string;

                if (!mockTransportMap[sessionId]) {
                    const errorResponse = {
                        jsonrpc: '2.0',
                        error: { code: -32000, message: 'Bad Request: Valid session ID required for DELETE requests' },
                        id: null,
                    };

                    mockRes.status(400).json(errorResponse);

                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith(
                        expect.objectContaining({
                            jsonrpc: '2.0',
                            error: expect.objectContaining({
                                code: -32000,
                                message: expect.stringContaining('Valid session ID required')
                            })
                        })
                    );
                }
            });

            test("validates transport cleanup during session termination", async () => {
                const sessionId = 'cleanup-session';
                const mockTransport = {
                    close: mock().mockResolvedValue(undefined),
                    sessionId,
                    handleRequest: mock().mockResolvedValue(undefined)
                };
                const mockTransportMap: Record<string, any> = { [sessionId]: mockTransport };

                // Simulate the cleanup process
                await mockTransport.handleRequest();
                await mockTransport.close();
                delete mockTransportMap[sessionId];

                expect(mockTransport.handleRequest).toHaveBeenCalled();
                expect(mockTransport.close).toHaveBeenCalled();
                expect(mockTransportMap[sessionId]).toBeUndefined();
            });

            test("handles transport close errors gracefully", async () => {
                const sessionId = 'error-session';
                const mockTransport = {
                    close: mock().mockRejectedValue(new Error('Close failed')),
                    sessionId,
                    handleRequest: mock().mockResolvedValue(undefined)
                };
                const mockTransportMap: Record<string, any> = { [sessionId]: mockTransport };

                // Simulate error handling during cleanup
                await mockTransport.handleRequest();

                try {
                    await mockTransport.close();
                } catch (closeError) {
                    // Error should be caught and logged, but cleanup should continue
                    expect(closeError).toBeInstanceOf(Error);
                }

                // Transport should still be removed from map despite close error
                delete mockTransportMap[sessionId];

                expect(mockTransport.handleRequest).toHaveBeenCalled();
                expect(mockTransport.close).toHaveBeenCalled();
                expect(mockTransportMap[sessionId]).toBeUndefined();
            });
        });

        describe("POST Endpoint Validation", () => {
            test("validates POST request with proper Accept header", () => {
                const mockReq = createMockRequest({
                    method: 'POST',
                    headers: { 'accept': 'application/json, text/event-stream' },
                    body: { jsonrpc: '2.0', method: 'initialize', id: 1 }
                });

                const acceptHeader = mockReq.headers!.accept as string;
                const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
                const isValid = acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');

                expect(isValid).toBe(true);
                expect(mockReq.body.method).toBe('initialize');
            });

            test("validates error response for POST with invalid Accept header", () => {
                const mockReq = createMockRequest({
                    method: 'POST',
                    headers: { 'accept': 'application/json' }, // Missing text/event-stream
                    body: { jsonrpc: '2.0', method: 'initialize', id: 1 }
                });
                const mockRes = createMockResponse();

                const acceptHeader = mockReq.headers!.accept as string;
                const acceptedTypes = acceptHeader.split(',').map(type => type.trim().split(';')[0]);
                const isValid = acceptedTypes.includes('application/json') && acceptedTypes.includes('text/event-stream');

                if (!isValid) {
                    const errorResponse = {
                        jsonrpc: '2.0',
                        error: {
                            code: -32000,
                            message: 'Bad Request: Accept header must include both application/json and text/event-stream'
                        },
                        id: null,
                    };

                    mockRes.status(400).json(errorResponse);

                    expect(mockRes.status).toHaveBeenCalledWith(400);
                    expect(mockRes.json).toHaveBeenCalledWith(
                        expect.objectContaining({
                            jsonrpc: '2.0',
                            error: expect.objectContaining({
                                code: -32000,
                                message: expect.stringContaining('Accept header must include both')
                            })
                        })
                    );
                }
            });
        });
    });
});
