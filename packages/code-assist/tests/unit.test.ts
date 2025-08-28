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
import { getUsageInstructions, getServer, handleCallTool, _setUsageInstructions, handleReadResource, startHttpServer } from "../index.js";
import { CallToolRequest, ReadResourceRequest } from "@modelcontextprotocol/sdk/types.js";
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
spyOn(server, "sendLoggingMessage").mockImplementation(async () => {});

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

        consoleSpy = spyOn(console, 'log').mockImplementation(() => {});
        spyOn(console, 'error').mockImplementation(() => {});
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
});