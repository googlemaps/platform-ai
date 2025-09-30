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

interface Date {
    year?: number;
    month?: number;
    day?: number;
}

export const GoogleMapsPlatformWeatherLookup: Tool = {
    name: 'GoogleMapsPlatformWeatherLookup',
    description: `
        **Tool Name:** Weather Information Tool (Google Maps Platform)
        **Core Functionality:** Provides current conditions, hourly, and daily forecasts for any location. Use this tool for all weather-related inquiries. 
        **Specific Data Available:** Temperature (Current, Feels Like, Max/Min, Heat Index), Wind (Speed, Gusts, Direction), Celestial Events (Sunrise/Sunset, Moon Phase), Precipitation (Type, Probability, Quantity/QPF), Atmospheric Conditions (UV Index, Humidity, Cloud Cover, Thunderstorm Probability), and Geocoded Location Address. 
    
        **Input Requirements (CRITICAL):** 
        * **Current Conditions:** Requires only a location (e.g., city or address). 
        * **Hourly Forecasts:** Requires a location and an **hour** (0-23). Use if the user asks for weather at a specific time or using terms like "next few hours," or "later today." 
        * **Daily Forecasts:** Requires a location and a full date. 
        
        Date Handling (CRITICAL): User-provided dates and hours MUST be provided in the local timezone of the requested location. Dates MUST be broken down into separate integer parameters: year, month, and day. The required format for these parameters is: {"year": <int>, "month": <int>, "day": <int>}.
        `, 
        inputSchema: {
        "type": "object",
        "description": "Schema for requesting weather conditions based on a specific location, date, and hour, " +
            "with optional unit system preferences.",
        "properties": {
            "address": {
                "type": "string",
                "description": "The address of the location to get the weather conditions for. " +
                    "This can be a street address, city, zip code, etc."
            },
            "date": {
                "type": "object",
                "description": "The date of the required weather information",
                "properties": {
                    "year": {
                        "type": "integer",
                        "description": "The year of the requested weather information."
                    },
                    "month": {
                        "type": "integer",
                        "description": "The month of the requested weather information."
                    },
                    "day": {
                        "type": "integer",
                        "description": "The day of the requested weather information."
                    }
                }
            },
            "hour": {
                "type": "integer",
                "description": "The hour of the requested weather information, in 24-hour format (0-23). ",
                "minimum": 0,
                "maximum": 23
            },
            "unitsSystem": {
                "type": "string",
                "description": "The units system to use for the returned weather conditions.",
                "enum": [
                    "METRIC",
                    "IMPERIAL"
                ],
                "default": "METRIC"
            }
        },
        "required": ["address"],
        "additionalProperties": false
    },
};

export async function handleGoogleMapsPlatformWeatherLookup(request: any, server: Server) {
    try {
        let address: string = request.params.arguments?.address as string;
        let date: Date | undefined = request.params.arguments?.date as Date | {};
        let hour: number | undefined = request.params.arguments?.hour as number | undefined;
        let unitsSystem: "METRIC" | "IMPERIAL" | undefined = request.params.arguments?.unitsSystem as "METRIC" | "IMPERIAL" | undefined;

        // Log user request for debugging purposes
        server.sendLoggingMessage({
            level: "info",
            data: `Calling tool GoogleMapsPlatformWeatherLookup with address: ${address}, 
            date: {year: ${date?.year}, month: ${date?.month}, day: ${date?.day}},
            hour: ${hour}, unitsSystem: ${unitsSystem}`,
        });

        try {
            const apiKey = getGoogleMapsApiKey();
            const url = `${GoogleMapsPlatformServiceUrl}/weather:lookup?key=${apiKey}`;
            const params: any = { address };
            if (date) params.date = date;
            if (hour !== undefined) params.hour = hour;
            if (unitsSystem) params.unitsSystem = unitsSystem;

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
            // Log the error for debugging purposes
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
