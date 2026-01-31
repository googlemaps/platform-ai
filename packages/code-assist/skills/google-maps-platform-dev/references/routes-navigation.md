# Routes & Navigation: The Complete Guide (2026)

**Top-Level Documentation:** [developers.google.com/maps/documentation/routes](https://developers.google.com/maps/documentation/routes)

## 1. Routes API (Server-Side)
**Best For:** Pre-trip planning, distance matrices, logistics dispatching.
**Status:** GA.

### Key Capabilities
*   **Compute Routes:**
    *   **2-Wheeler Routing:** Specialized routing for motorcycles (avoid highways, lane filtering awareness where legal).
    *   **Eco-Friendly Routing:** Default on. Returns `fuelConsumptionMicroliters`.
    *   **Tolls:** Calculates accurate toll costs for specific vehicle types (with `extraComputations=TOLLS`).
    *   **Polylines:** Returns `encodedPolyline` for easy map drawing.
*   **Compute Route Matrix:**
    *   Calculates distance/duration between N origins and M destinations (Max 625 elements).
    *   Essential for "Find nearest driver" logic.

### Usage Example (REST)
```bash
POST https://routes.googleapis.com/directions/v2:computeRoutes
Headers: X-Goog-FieldMask: routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline
Body: {
  "origin": {"address": "Start"},
  "destination": {"address": "End"},
  "travelMode": "TWO_WHEELER",
  "routingPreference": "TRAFFIC_AWARE"
}
```

---

## 2. Navigation SDK (Mobile App)
**Best For:** The "Driver" experience.
**Documentation:** [developers.google.com/maps/documentation/navigation](https://developers.google.com/maps/documentation/navigation)

**Status:** GA (Pay-as-you-go).
**Pricing:** Free 0-1k destinations/mo. ~$25 per 1k after.

### Key Features (Included)
*   **Turn-by-Turn UI:** A drop-in fragment that looks like Google Maps.
*   **Voice Guidance:** Text-to-speech instructions.
*   **Speed Limits:** Visual indicator of current limit.
*   **Lane Guidance:** "Use the right 2 lanes to turn."
*   **Rerouting:** Automatic traffic-based rerouting.

### How to Use
1.  **Enable SDK:** In Cloud Console.
2.  **Install:** Via Gradle (Android) or CocoaPods (iOS).
3.  **Initialize:** `NavigationApi.getNavigator( ... )`.
4.  **Set Destination:** `navigator.setDestinations( ... )`.
5.  **Start:** `navigator.startGuidance()`.

---

## 3. Mobility Services (TL;DR)
**Documentation:** [developers.google.com/maps/mobility](https://developers.google.com/maps/mobility)

**"Mobility"** is a suite of specialized services built *on top* of Routes & Nav for specific industries.

*   **Fleet Engine:** The backend "Brain" for tracking vehicles.
    *   **On-Demand Rides & Deliveries (ODRD):** Uber/Lyft style apps. Tracks driver, shares route with rider.
    *   **Last Mile Fleet Solution (LMFS):** FedEx/UPS style. Task sequencing, manifest management.
*   **Consumer SDK:** The mobile library for the *Rider* or *Package Recipient* to see the vehicle moving in real-time.
*   **Driver SDK:** A wrapped version of the Navigation SDK that reports location to Fleet Engine automatically.

**Summary:**
*   Building a generic route planner? -> **Routes API**.
*   Building a navigation app? -> **Navigation SDK**.
*   Building "Uber for X"? -> **Fleet Engine + Driver SDK + Consumer SDK**.
