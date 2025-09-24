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

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { GoogleMapsPlatformServiceUrl, getGoogleMapsApiKey } from './config.js';
import axios from 'axios';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export const GoogleMapsPlatformPlacesSearchText: Tool = {
    name: 'GoogleMapsPlatformPlacesSearchText',
    description: `
        **Tool Name:** Places Search Tool
        **Core Functionality:** Searches for places based on a text query.
        **Input Requirements (CRITICAL):**
        * **text_query:** (string) - The primary search term (e.g., 'restaurants in New York', 'coffee shops near Golden Gate Park', 'SF MoMA'). This is the only mandatory parameter.
        **Location Bias:**
        To bias results to a specific area, use the 'location_bias' parameter. This is defined as a circle with a center point (latitude, longitude) and a radius in meters.
        Example: {"location_bias": {"circle": {"center": {"latitude": 34.052235, "longitude": -118.243683}, "radius_meters": 5000}}}
        **Location Information:**
        Some location information must be available to use this tool. The location information can either be specified in the query (e.g., "pizza in New York") or in the location_bias parameter.
        `,
    inputSchema: {
        "type": "object",
        "description": "Schema for searching places based on a text query.",
        "properties": {
            "text_query": {
                "type": "string",
                "description": "The text query to search for places (e.g., 'restaurants in New York')."
            },
            "language_code": {
                "type": "string",
                "description": "language code, indicating in which language the results should be returned, if possible. Full list can be found at https://developers.google.com/maps/faq#languagesupport."
            },
            "region_code": {
                "type": "string",
                "description": "region code, indicating the region where results should be biased, if possible. This is specified as a Unicode country/region code (CLDR) two-character value. For example, to bias results to the United States, use 'US'."
            },
            "location_bias": {
                "type": "object",
                "description": "location bias, to prefer results in a specified area. The location bias is an area, defined as a circle. If radius_meters is not specified, the center point is used as a point bias.",
                "properties": {
                    "circle": {
                        "type": "object",
                        "description": "A circle defined by a center point and a radius.",
                        "properties": {
                            "center": {
                                "type": "object",
                                "description": "The center point of the circle.",
                                "properties": {
                                    "latitude": {
                                        "type": "number",
                                        "description": "The latitude of the center point."
                                    },
                                    "longitude": {
                                        "type": "number",
                                        "description": "The longitude of the center point."
                                    }
                                },
                                "required": ["latitude", "longitude"]
                            },
                            "radius_meters": {
                                "type": "number",
                                "description": "The radius of the circle in meters."
                            }
                        },
                        "required": ["center"]
                    },
                }
            }
        },
        "required": ["text_query"],
        "additionalProperties": false
    },
};

export async function handleGoogleMapsPlatformPlacesSearchText(request: any, server: Server) {
    try {
        let textQuery: string = request.params.arguments?.text_query as string;
        let languageCode: string | undefined = request.params.arguments?.language_code as string | undefined;
        let regionCode: string | undefined = request.params.arguments?.region_code as string | undefined;
        let locationBias: any | undefined = request.params.arguments?.location_bias as any | undefined;

        server.sendLoggingMessage({
            level: "info",
            data: `Calling tool GoogleMapsPlatformPlacesSearchText with textQuery: ${textQuery}, languageCode: ${languageCode}, regionCode: ${regionCode}, locationBias: ${JSON.stringify(locationBias)}`,
        });

        try {
            const apiKey = getGoogleMapsApiKey();
            const url = `${GoogleMapsPlatformServiceUrl}/places:searchText?key=${apiKey}`;
            const params: any = { textQuery };
            if (languageCode) params.languageCode = languageCode;
            if (regionCode) params.regionCode = regionCode;
            if (locationBias) params.locationBias = locationBias;

            const headers = {
                'Content-Type': 'application/json'
            };

            const googleMapsPlatformServiceResponse = await axios.post(
                url,
                params,
                {
                    headers
                }
            );

            let mcpResponse = {
                "response": {
                    "contexts": googleMapsPlatformServiceResponse.data
                },
                "status": googleMapsPlatformServiceResponse.status.toString(),
            };

            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify(mcpResponse)
                }]
            };

        } catch (error: any) {
            let errorMessage = "";
            if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
                errorMessage = error.response.data.error.message;
            }

            server.sendLoggingMessage({
                level: "error",
                data: `Error executing tool ${request.params.name}: ${error} \nErrorMessage: ${errorMessage}`,
            });

            return {
                content: [{ type: 'text', text: errorMessage }]
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
