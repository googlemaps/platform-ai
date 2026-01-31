# API Selection Decision Trees

## Overview

Use these decision trees to select the appropriate Google Maps Platform API for your use case. Always verify with the latest documentation via `retrieve-google-maps-platform-docs`.

---

## Maps Display Decision Tree

```
                    ┌─────────────────────────┐
                    │   Need to display a     │
                    │      map to users?      │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
        ┌─────────┐       ┌─────────┐       ┌─────────┐
        │   Web   │       │ Mobile  │       │ Static  │
        └────┬────┘       └────┬────┘       └────┬────┘
             │                 │                 │
             ▼                 │                 ▼
    ┌────────────────┐         │      ┌──────────────────┐
    │ Maps JavaScript│         │      │ Maps Static API  │
    │      API       │         │      │ (Image only)     │
    └───────┬────────┘         │      └──────────────────┘
            │                  │
    ┌───────┴───────┐    ┌─────┴─────┐
    ▼               ▼    ▼           ▼
┌────────┐    ┌────────┐ ┌────────┐ ┌────────┐
│ React  │    │Vanilla │ │Android │ │  iOS   │
│ App    │    │   JS   │ │  App   │ │  App   │
└───┬────┘    └───┬────┘ └───┬────┘ └───┬────┘
    │             │          │          │
    ▼             ▼          ▼          ▼
┌─────────────┐┌─────────┐┌─────────┐┌─────────┐
│@vis.gl/     ││Dynamic  ││Maps SDK ││Maps SDK │
│react-google-││Library  ││  for    ││  for    │
│maps         ││Import   ││Android  ││  iOS    │
└─────────────┘└─────────┘└─────────┘└─────────┘
```

### Web Map Selection

| Requirement | Recommended Solution |
|-------------|---------------------|
| Interactive map with markers | Maps JavaScript API + AdvancedMarkerElement |
| React application | @vis.gl/react-google-maps |
| Angular application | @angular/google-maps |
| Vue application | @fawmi/vue-google-maps or google-maps-loader |
| Custom data visualization | Deck.gl + Maps JavaScript API |
| 3D map experience | Maps JavaScript API with WebGL overlays |
| Simple embed (no code) | Maps Embed API |
| Static image (email, PDF) | Maps Static API |

### Mobile Map Selection

| Platform | Primary SDK | Alternative |
|----------|-------------|-------------|
| Android (Kotlin/Java) | Maps SDK for Android | Maps Compose library |
| Android (Jetpack Compose) | Maps Compose | - |
| iOS (Swift) | Maps SDK for iOS | SwiftUI wrapper |
| iOS (SwiftUI) | Maps SDK for iOS | - |
| Flutter | google_maps_flutter | - |
| React Native | react-native-maps | - |

---

## Places API Decision Tree

```
                    ┌─────────────────────────┐
                    │   What do you need      │
                    │    to do with places?   │
                    └───────────┬─────────────┘
                                │
    ┌───────────────┬───────────┼───────────┬───────────────┐
    ▼               ▼           ▼           ▼               ▼
┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐   ┌─────────┐
│Search   │   │Autocom- │ │Get      │ │Find     │   │Get      │
│by text  │   │plete    │ │details  │ │nearby   │   │photos   │
└────┬────┘   └────┬────┘ └────┬────┘ └────┬────┘   └────┬────┘
     │             │           │           │             │
     ▼             ▼           ▼           ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Places API (New)                          │
│                 places.googleapis.com                        │
└─────────────────────────────────────────────────────────────┘
```

### Places API Endpoints

| Use Case | Endpoint (New API) | Key Features |
|----------|-------------------|--------------|
| Text search | `searchText` | Natural language queries |
| Nearby search | `searchNearby` | Location + radius + type |
| Place details | `places/{placeId}` | Field masks for cost optimization |
| Autocomplete | `places:autocomplete` | Session tokens reduce cost |
| Place photos | `places/{placeId}/photos/{name}/media` | Max dimensions supported |

### Field Mask Best Practices

Always use field masks to request only needed data:

```javascript
// ❌ Expensive - fetches all fields
const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
  headers: {
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "*"  // Don't do this!
  }
});

// ✅ Cost-effective - only needed fields
const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
  headers: {
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "displayName,formattedAddress,location"
  }
});
```

---

## Routes API Decision Tree

```
                    ┌─────────────────────────┐
                    │   What routing need     │
                    │       do you have?      │
                    └───────────┬─────────────┘
                                │
    ┌───────────────┬───────────┼───────────┬───────────────┐
    ▼               ▼           ▼           ▼               ▼
┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐   ┌─────────┐
│Simple   │   │Distance │ │Multi-   │ │Turn-by- │   │Fleet    │
│A→B route│   │matrix   │ │stop     │ │turn nav │   │routing  │
└────┬────┘   └────┬────┘ └────┬────┘ └────┬────┘   └────┬────┘
     │             │           │           │             │
     ▼             ▼           ▼           ▼             ▼
┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐   ┌─────────┐
│Routes   │   │Routes   │ │Routes   │ │Navigation│  │Route    │
│API      │   │API      │ │API or   │ │SDK       │  │Optim.   │
│compute  │   │compute  │ │Route    │ │(mobile)  │  │API      │
│Routes   │   │RouteMatrix│ │Optim. │ │          │  │         │
└─────────┘   └─────────┘ └─────────┘ └─────────┘   └─────────┘
```

### Routes API Selection Guide

| Use Case | API/Endpoint | Notes |
|----------|--------------|-------|
| Single route A→B | Routes API `computeRoutes` | Supports waypoints, traffic |
| Multiple origins/destinations | Routes API `computeRouteMatrix` | Up to 625 elements |
| Route optimization (TSP) | Route Optimization API | Optimizes waypoint order |
| Turn-by-turn navigation | Navigation SDK | Mobile only (Android/iOS) |
| Fleet management | Fleet Engine | Requires additional setup |

### Travel Modes

| Mode | Routes API Value | Notes |
|------|-----------------|-------|
| Driving | `DRIVE` | Default, includes traffic |
| Walking | `WALK` | Pedestrian paths |
| Bicycling | `BICYCLE` | Bike lanes preferred |
| Transit | `TRANSIT` | Public transportation |
| Two-wheelers | `TWO_WHEELER` | Motorcycles, scooters |

---

## Data Visualization Decision Tree

```
                    ┌─────────────────────────┐
                    │   What type of data     │
                    │  visualization needed?  │
                    └───────────┬─────────────┘
                                │
    ┌───────────────┬───────────┼───────────────┐
    ▼               ▼           ▼               ▼
┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐
│Markers  │   │Heatmaps │ │Polygons/│   │Custom   │
│(< 1000) │   │         │ │Lines    │   │overlays │
└────┬────┘   └────┬────┘ └────┬────┘   └────┬────┘
     │             │           │             │
     ▼             ▼           ▼             ▼
┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐
│Advanced │   │Heatmap  │ │Data     │   │Deck.gl  │
│Marker   │   │Layer    │ │Layer    │   │+ Maps   │
│Element  │   │         │ │         │   │JS API   │
└─────────┘   └─────────┘ └─────────┘   └─────────┘
```

### Visualization Library Selection

| Data Volume | Visualization Type | Recommended Approach |
|-------------|-------------------|---------------------|
| < 100 markers | Standard markers | AdvancedMarkerElement |
| 100-1000 markers | Clustered markers | MarkerClusterer library |
| > 1000 points | Aggregated view | Heatmap Layer |
| > 10000 points | WebGL rendering | Deck.gl overlay |
| Polygons/shapes | Geographic boundaries | Data Layer |
| Real-time updates | Streaming data | Custom WebGL overlay |

---

## Migration Decision Tree

```
                    ┌─────────────────────────┐
                    │   Using deprecated      │
                    │        APIs?            │
                    └───────────┬─────────────┘
                                │
    ┌───────────────┬───────────┼───────────────┐
    ▼               ▼           ▼               ▼
┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐
│google.  │   │Places   │ │Directions│  │Distance │
│maps.    │   │API      │ │Service  │   │Matrix   │
│Marker   │   │(Legacy) │ │         │   │Service  │
└────┬────┘   └────┬────┘ └────┬────┘   └────┬────┘
     │             │           │             │
     ▼             ▼           ▼             ▼
┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐
│Advanced │   │Places   │ │Routes   │   │Routes   │
│Marker   │   │API      │ │API      │   │API      │
│Element  │   │(New)    │ │compute  │   │compute  │
│         │   │         │ │Routes   │   │RouteMatrix│
└─────────┘   └─────────┘ └─────────┘   └─────────┘
```

### Migration Priority

| Legacy API | Modern Replacement | Migration Priority |
|------------|-------------------|-------------------|
| `google.maps.Marker` | `AdvancedMarkerElement` | **High** - Deprecated |
| Places API (Legacy) | Places API (New) | **High** - New features |
| Directions Service | Routes API | **Medium** - Better performance |
| Distance Matrix Service | Routes API `computeRouteMatrix` | **Medium** |
| Geocoding Service | Geocoding API (REST) | **Low** - Still supported |

---

## Quick Selection Matrix

### By Use Case

| I want to... | Use this API |
|--------------|-------------|
| Show a map on a website | Maps JavaScript API |
| Show a map in a mobile app | Maps SDK (Android/iOS) |
| Search for places by name | Places API (New) - Text Search |
| Get place suggestions as user types | Places API (New) - Autocomplete |
| Get directions between points | Routes API |
| Calculate distances for multiple pairs | Routes API - computeRouteMatrix |
| Convert address to coordinates | Geocoding API |
| Convert coordinates to address | Geocoding API (reverse) |
| Get a static map image | Maps Static API |
| Validate an address | Address Validation API |

### By Platform + Use Case

| Platform | Map Display | Places | Routes |
|----------|-------------|--------|--------|
| Web (Vanilla JS) | Maps JS API | Places JS Library | Routes API (REST) |
| Web (React) | @vis.gl/react-google-maps | Places JS Library | Routes API (REST) |
| Android | Maps SDK | Places SDK | Routes API (REST) |
| iOS | Maps SDK | Places SDK | Routes API (REST) |
| Flutter | google_maps_flutter | google_places_flutter | Routes API (REST) |
| Server-side | N/A | Places API (REST) | Routes API (REST) |
