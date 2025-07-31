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
import { getUsageInstructions, getServer, handleCallTool, _setUsageInstructions, handleReadResource, runServer } from "../index.js";
import { CallToolRequest, ReadResourceRequest } from "@modelcontextprotocol/sdk/types.js";

// Define a stable, pre-initialized mock server object. This is the key to the fix.
const globalMockServer = {
  // Fix: Use a generic mock signature to satisfy TypeScript
  listen: mock((...args: any[]) => {}),
  once: mock((...args: any[]) => {}),
  address: mock(() => ({ port: 3000 })),
};

// Mock the entire 'http' module.
mock.module('http', () => ({
  // `createServer` will now *always* return our stable mock object.
  createServer: mock(() => {
    return globalMockServer;
  }),
}));

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
    (axios.get as any).mockClear();
    (axios.post as any).mockClear();
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
      data: { contexts: [] },
      status: 200,
    };
    (axios.post as any).mockResolvedValue(mockResponse);

    const request = {
      method: "tools/call" as const,
      params: {
        name: "retrieve-google-maps-platform-docs",
        arguments: { prompt: "How do I add Places New to my mobile app?" },
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
      params: { name: "retrieve-instructions" },
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
      params: { uri: "mcp://google-maps-platform-code-assist/instructions" },
    };
    const result = await handleReadResource(request as ReadResourceRequest, server);
    expect(result.contents?.[0].text).toContain("system instructions");
  });

  test("read invalid resource returns error", async () => {
    const request = {
      method: "resources/read" as const,
      params: { uri: "mcp://google-maps-platform-code-assist/invalid" },
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
        arguments: { prompt: "test prompt" },
      },
    };
    const result = await handleCallTool(request as CallToolRequest, server);
    expect(result.content?.[0].text).toContain("No information available");
  });

  test("invalid tool call returns error", async () => {
    const request = {
      method: "tools/call" as const,
      params: { name: "invalid-tool" },
    };
    const result = await handleCallTool(request as CallToolRequest, server);
    expect(result.content?.[0].text).toBe("Invalid Tool called");
  });
});

describe("Server Port Handling", () => {
  let originalArgv: string[];
  let originalExit: (code?: number) => never;
  let consoleInfoSpy: ReturnType<typeof spyOn>;
  let consoleErrorSpy: ReturnType<typeof spyOn>;
  let consoleWarnSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    originalArgv = process.argv;
    originalExit = process.exit;
    (process as any).exit = mock((code?: number) => {
      throw new Error(`process.exit called with code ${code}`);
    });

    consoleInfoSpy = spyOn(console, 'info').mockImplementation(() => {});
    consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = spyOn(console, 'warn').mockImplementation(() => {});

    // Reset the mocks on the stable globalMockServer object
    globalMockServer.listen.mockReset();
    globalMockServer.once.mockReset();
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.exit = originalExit;
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test("should start on default port 3000 if no port is specified", async () => {
    process.argv = ['node', 'index.js'];
    
    globalMockServer.listen.mockImplementation((port: number, callback: () => void) => {
      expect(port).toBe(3000);
      callback();
    });

    await runServer();

    expect(globalMockServer.listen).toHaveBeenCalledTimes(1);
    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('listening on port 3000'));
  });

  test("should start on specified port", async () => {
    process.argv = ['node', 'index.js', '--port', '8080'];
    
    globalMockServer.listen.mockImplementation((port: number, callback: () => void) => {
      expect(port).toBe(8080);
      callback();
    });

    await runServer();

    expect(globalMockServer.listen).toHaveBeenCalledTimes(1);
    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('listening on port 8080'));
  });

  test("should try next port if current port is in use", async () => {
    process.argv = ['node', 'index.js', '--port', '3000'];

    let errorCallback: (err: NodeJS.ErrnoException) => void;
    globalMockServer.once.mockImplementation((event: string, handler: any) => {
      if (event === 'error') {
        errorCallback = handler;
      }
    });

    globalMockServer.listen
      .mockImplementationOnce((port: number, callback: () => void) => {
        expect(port).toBe(3000);
        // Manually trigger the captured error handler to simulate the event
        errorCallback({ code: 'EADDRINUSE' } as NodeJS.ErrnoException);
      })
      .mockImplementationOnce((port: number, callback: () => void) => {
        expect(port).toBe(3001);
        callback(); // Success
      });

    await runServer();

    expect(globalMockServer.listen).toHaveBeenCalledTimes(2);
    expect(consoleWarnSpy).toHaveBeenCalledWith('Port 3000 is in use, trying port 3001...');
    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.stringContaining('listening on port 3001'));
  });

  test("should exit if max attempts reached and port is still in use", async () => {
    process.argv = ['node', 'index.js', '--port', '3000'];

    let errorCallback: (err: NodeJS.ErrnoException) => void;
    globalMockServer.once.mockImplementation((event: string, handler: any) => {
      errorCallback = handler;
    });

    // All 11 attempts will fail
    globalMockServer.listen.mockImplementation(() => {
      errorCallback({ code: 'EADDRINUSE' } as NodeJS.ErrnoException);
    });

    await expect(runServer()).rejects.toThrow('Could not find an open port after 11 attempts');
    
    expect(globalMockServer.listen).toHaveBeenCalledTimes(11);
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find an open port'));
  });

  test("should exit on other server errors", async () => {
    process.argv = ['node', 'index.js', '--port', '3000'];

    let errorCallback: (err: NodeJS.ErrnoException) => void;
    globalMockServer.once.mockImplementation((event: string, handler: any) => {
      errorCallback = handler;
    });

    globalMockServer.listen.mockImplementationOnce(() => {
      errorCallback({ code: 'EACCES', message: 'Permission denied' } as NodeJS.ErrnoException);
    });

    await expect(runServer()).rejects.toThrow('Failed to start HTTP server: Permission denied');

    expect(globalMockServer.listen).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to start HTTP server: Permission denied');
  });
});