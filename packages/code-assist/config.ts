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

export const ragEndpoint = "https://rag-230009110455.us-central1.run.app"

export const SOURCE = process.env.SOURCE || 'github';

export const DEFAULT_CONTEXTS = [
    // General
    "Google Maps Platform",

    // Maps
    "Maps JavaScript API",
    "Maps SDK for Android",
    "Maps SDK for iOS",
    "Google Maps for Flutter",
    "Maps Embed API",
    "Maps Static API",
    "Street View Static API",
    "Maps URLs",
    "Elevation API",
    "Map Tiles API",
    "Maps Datasets API",
    "Web Components",
    "3D Maps",
    "Aerial View API",

    // Routes
    "Routes API",
    "Directions API",
    "Distance Matrix API",
    "Navigation SDK for Android",
    "Navigation SDK for iOS",
    "Navigation for Flutter",
    "Navigation for React Native",
    "Roads API",
    "Route Optimization API",

    // Places
    "Places UI Kit",
    "Places API (New)",
    "Places API (Legacy)",
    "Places SDK for Android",
    "Places SDK for iOS",
    "Places Library",
    "Geocoding API",
    "Geolocation API",
    "Address Validation API",
    "Time Zone API",

    // Environment
    "Air Quality API",
    "Pollen API",
    "Solar API",
    "Weather API",

    // Analytics
    "Imagery Insights",
    "Places Insights",
    "Road Management Insights"
];
