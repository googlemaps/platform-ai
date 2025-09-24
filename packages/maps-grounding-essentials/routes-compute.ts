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
import { json } from 'stream/consumers';
import { url } from 'inspector';

const LatLngSchema = {
    "type": "object",
    "description": "The latitude and longitude of the point.",
    "properties": {
        "latitude": {
            "type": "number",
            "description": "The latitude of the point."
        },
        "longitude": {
            "type": "number",
            "description": "The longitude of the point."
        }
    },
    "required": ["latitude", "longitude"]
};

const PlaceIdSchema = {
    "type": "string",
    "description": "The Place ID of the point."
};

const AddressSchema = {
    "type": "string",
    "description": "The address of the point."
};
export const GoogleMapsPlatformComputeRoutes: Tool = {
    name: 'GoogleMapsPlatformComputeRoutes',
    description: `
            **Tool Name:** Route Computation Tool
            **Core Functionality:** Computes a travel route between a specified origin and destination.
            **Supported Travel Modes:** DRIVE (default), WALK.

            **Input Requirements (CRITICAL):**
            Requires both **origin** and **destination**. Each must be provided using one of the following methods, nested within its respective field:
            * **address:** (string, e.g., "Eiffel Tower, Paris"). Note: The more granular or specific the input address is, the better the results will be.
            * **lat_lng:** (object, {"latitude": number, "longitude": number})
            * **place_id:** (string, e.g., "ChIJOwE_Id1w5EAR4Q27FkL6T_0") Note: This id can be obtained from Google Maps Places API or from GoogleMapsPlatformPlacesSearchText.

            Any combination of input types is allowed (e.g., origin by address, destination by lat_lng). If either the origin or destination is missing, **you MUST ask the user for clarification** before attempting to call the tool.

            **Example Tool Call:**
            {"origin":{"address":"Eiffel Tower"},"destination":{"place_id":"ChIJt_5xIthw5EARoJ71mGq7t74"},"travel_mode":"DRIVE"}
            `,
    inputSchema: {
        "type": "object",
        "description": "Schema for computing routes between an origin and a destination.",
        "properties": {
            "origin": {
                "type": "object",
                "description": "The starting point for the route (e.g., 'Eiffel Tower, Paris').",
                "oneOf": [
                    { "properties": { "lat_lng": LatLngSchema }, "required": ["lat_lng"] },
                    { "properties": { "place_id": PlaceIdSchema }, "required": ["place_id"] },
                    { "properties": { "address": AddressSchema }, "required": ["address"] }
                ]
            },
            "destination": {
                "type": "object",
                "description": "The ending point for the route (e.g., 'Louvre Museum, Paris').",
                "oneOf": [
                    { "properties": { "lat_lng": LatLngSchema }, "required": ["lat_lng"] },
                    { "properties": { "place_id": PlaceIdSchema }, "required": ["place_id"] },
                    { "properties": { "address": AddressSchema }, "required": ["address"] }
                ]
            },
            "travel_mode": {
                "type": "string",
                "description": "The mode of travel (e.g., 'DRIVE', 'WALK').",
                "enum": ["DRIVE", "WALK"],
                "default": "DRIVE"
            }
        },
        "required": ["origin", "destination"],
        "additionalProperties": false
    },
};

export async function handleGoogleMapsPlatformComputeRoutes(request: any, server: Server) {
    try {
        const origin = request.params.arguments?.origin;
        const destination = request.params.arguments?.destination;
        let travelMode: string = request.params.arguments?.travelMode as string || "DRIVE";

        server.sendLoggingMessage({
            level: "info",
            data: `Calling tool GoogleMapsPlatformComputeRoutes with: { origin: ${JSON.stringify(getWaypoint(origin))}, destination: ${JSON.stringify(getWaypoint(destination))}, travelMode: ${travelMode} }`,
        });

        try {
            const apiKey = getGoogleMapsApiKey();
            const url = `${GoogleMapsPlatformServiceUrl}/routes:compute?key=${apiKey}`;
            const params: any = {
                origin: getWaypoint(origin),
                destination: getWaypoint(destination),
                travel_mode: travelMode
            };

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

function getWaypoint(waypoint: any) {
    if (waypoint.lat_lng) {
        return { latLng: waypoint.lat_lng };
    } else if (waypoint.place_id) {
        return { placeId: waypoint.place_id };
    } else if (waypoint.address) {
        return { address: waypoint.address };
    }
    return {};
}
