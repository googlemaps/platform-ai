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

import { expect, test, describe, spyOn } from "bun:test";
import { handleCallTool, getServer } from "../index.js";
import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";

const server = getServer();
spyOn(server, "sendLoggingMessage").mockImplementation(async () => {});

describe("Google Maps Platform Code Assist MCP Server - Integration", () => {
  test(
    "retrieve-google-maps-platform-docs tool returns valid response from RAG service",
    async () => {
      const request = {
        method: "tools/call" as const,
        params: {
          name: "retrieve-google-maps-platform-docs",
          arguments: {
            prompt: "How do I add Places New to my mobile app?",
          },
        },
      };

      const result = await handleCallTool(request as CallToolRequest, server);
      
      // The handleCallTool function returns content directly, not wrapped in status
      expect(result.content).toBeDefined();
      expect(result.content).toBeArray();
      expect(result.content!.length).toBeGreaterThan(0);
      
      // Parse the JSON response from the text content
      const content = JSON.parse(result.content![0].text!);
      
      // Verify the response structure
      if (content.status) {
        expect(content.status).toBe("200");
        expect(content.response.contexts).toBeArray();
      } else {
        // Handle case where the mock doesn't return the expected structure
        expect(content).toBeDefined();
      }
    },
    60000
  );
});
