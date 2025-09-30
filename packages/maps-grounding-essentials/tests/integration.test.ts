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
import { getServer } from "../index.js";
import { handleGoogleMapsPlatformPlacesSearchText } from "../places-search-text.js";
import { handleGoogleMapsPlatformWeatherLookup } from "../weather-lookup.js"; // New import
import { handleGoogleMapsPlatformComputeRoutes } from "../routes-compute.js"; // New import
import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";

const server = getServer();
spyOn(server, "sendLoggingMessage").mockImplementation(async () => {});

describe("Google Maps Platform Maps Grounding Essentials MCP Server - Integration", () => {
  test(
    "GoogleMapsPlatformPlacesSearchText tool returns valid response",
    async () => {
      // Ensure GOOGLE_MAPS_API_KEY is set in the environment for this test to pass.
      // For example: export GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error("GOOGLE_MAPS_API_KEY environment variable is not set. Please set it to run this integration test.");
      }

      const request = {
        method: "tools/call" as const,
        params: {
          name: "GoogleMapsPlatformPlacesSearchText",
          arguments: {
            text_query: "restaurants in New York",
          },
        },
      };

      const result = await handleGoogleMapsPlatformPlacesSearchText(request as CallToolRequest, server);
      
      expect(result.content).toBeDefined();
      expect(result.content).toBeArray();
      expect(result.content!.length).toBeGreaterThan(0);
      
      const content = JSON.parse(result.content![0].text!);
      
      expect(content.response).toBeDefined();
      expect(content.response.contexts).toBeDefined();
      expect(content.response.contexts.places).toBeDefined();
      expect(content.response.contexts.places).toBeArray();
      expect(content.response.contexts.places.length).toBeGreaterThan(0);
      expect(content.response.contexts.places[0].place).toBeDefined();
      expect(content.response.contexts.places[0].id).toBeDefined();
      expect(content.response.contexts.places[0].location).toBeDefined();
      expect(content.response.contexts.places[0].googleMapsLinks).toBeDefined();
      expect(content.response.contexts.summary).toBeDefined();
      expect(typeof content.response.contexts.summary).toBe('string');
      expect(content.status).toBe("200");
    },
    60000
  );

  test(
    "GoogleMapsPlatformWeatherLookup tool returns valid response",
    async () => {
      // Ensure GOOGLE_MAPS_API_KEY is set in the environment for this test to pass.
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error("GOOGLE_MAPS_API_KEY environment variable is not set. Please set it to run this integration test.");
      }

      const request = {
        method: "tools/call" as const,
        params: {
          name: "GoogleMapsPlatformWeatherLookup",
          arguments: {
            address: "New York, NY"
          },
        },
      };

      const result = await handleGoogleMapsPlatformWeatherLookup(request as CallToolRequest, server);
      
      expect(result.content).toBeDefined();
      expect(result.content).toBeArray();
      expect(result.content!.length).toBeGreaterThan(0);
      
      const content = JSON.parse(result.content![0].text!);
      
      expect(content.response).toBeDefined();
      expect(content.response.contexts).toBeDefined();
      expect(content.response.contexts.temperature).toBeDefined();
      expect(content.response.contexts.feelsLikeTemperature).toBeDefined();
      expect(content.response.contexts.heatIndex).toBeDefined();
      expect(content.response.contexts.airPressure).toBeDefined();
      expect(content.response.contexts.weatherCondition).toBeDefined();
      expect(content.response.contexts.precipitation).toBeDefined();
      expect(content.response.contexts.wind).toBeDefined();
      expect(content.response.contexts.relativeHumidity).toBeDefined();
      expect(content.response.contexts.uvIndex).toBeDefined();
      expect(content.response.contexts.thunderstormProbability).toBeDefined();
      expect(content.response.contexts.cloudCover).toBeDefined();
      expect(content.response.contexts.geocodedAddress).toBeDefined();
      expect(content.status).toBe("200");
    },
    60000
  );

  test(
    "GoogleMapsPlatformComputeRoutes tool returns valid response",
    async () => {
      // Ensure GOOGLE_MAPS_API_KEY is set in the environment for this test to pass.
      if (!process.env.GOOGLE_MAPS_API_KEY) {
        throw new Error("GOOGLE_MAPS_API_KEY environment variable is not set. Please set it to run this integration test.");
      }

      const request = {
        method: "tools/call" as const,
        params: {
          name: "GoogleMapsPlatformComputeRoutes",
          arguments: {
            origin: { address: "Eiffel Tower, Paris" },
            destination: { address: "Louvre Museum, Paris" },
            travel_mode: "WALK",
          },
        },
      };

      const result = await handleGoogleMapsPlatformComputeRoutes(request as CallToolRequest, server);
      
      expect(result.content).toBeDefined();
      expect(result.content).toBeArray();
      expect(result.content!.length).toBeGreaterThan(0);


      
      const content = JSON.parse(result.content![0].text!);
      
      expect(content.response).toBeDefined();
      expect(content.response.contexts).toBeDefined();
      expect(content.response.contexts.routes).toBeDefined();
      expect(content.response.contexts.routes).toBeArray();
      expect(content.response.contexts.routes.length).toBeGreaterThan(0);
      expect(content.response.contexts.routes[0].distanceMeters).toBeDefined();
      expect(content.response.contexts.routes[0].duration).toBeDefined();
      expect(content.status).toBe("200");
    },
    60000
  );
});
