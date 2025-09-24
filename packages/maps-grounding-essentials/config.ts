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

export const GoogleMapsPlatformServiceUrl = "https://mapstools.googleapis.com/v1alpha"

    // Reads the API key from the GOOGLE_MAPS_API_KEY environment variable.
export function getGoogleMapsApiKey(): string {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('Environment variable GOOGLE_MAPS_API_KEY not found. Please set it to your Google Maps API key.');
    }
    return apiKey;
}