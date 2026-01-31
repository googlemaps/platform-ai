# Google Maps Platform: Products & Use Cases (2026 Edition)

**Quick Links Index:**
*   [Maps (JS/Android/iOS)](https://developers.google.com/maps/documentation)
*   [Routes API](https://developers.google.com/maps/documentation/routes) | [Navigation SDK](https://developers.google.com/maps/documentation/navigation)
*   [Places API](https://developers.google.com/maps/documentation/places/web-service/overview) | [Places UI Kit](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview)
*   [Environment APIs](https://developers.google.com/maps/documentation/environment)
*   [Mobility Services](https://developers.google.com/maps/mobility)

This document serves as the authoritative catalog for API selection.

## 🌟 The "Golden Path" (Stable Defaults)

**Always prefer these modern, production-ready solutions:**

1.  **Map Visualization:** **Vector Maps (JS)**. Always use a `mapId`.
2.  **Markers:** **Advanced Markers** (`AdvancedMarkerElement`).
3.  **Place Search:** **Places UI Kit** (EEA Compliant, 10x cheaper).
4.  **Routing:** **Routes API** (Server) or **Navigation SDK** (Mobile App).

---

## 1. Maps & Visualization

| Product | Description | Use Cases | Status |
| :--- | :--- | :--- | :--- |
| **Maps JavaScript API** | **Default Web Map.** | Websites, Store Locators. | GA |
| **Photorealistic 3D Maps** | Immersive 3D mesh (via Tiles API). | **"Google Earth" for Developers.** Storytelling, Real Estate. | Preview (Web) |
| **Google Earth Engine** | **Scientific Analysis Platform.** | Climate science, Satellite imagery analysis. | GA (Enterprise) |

**Confusion Buster:**
*   **"I want Google Earth in my app":** You want **Photorealistic 3D Tiles** (Map Tiles API).
*   **"I want to analyze crop yields":** You want **Google Earth Engine**.

## 2. Navigation & Mobility

| Product | Description | Pricing Model | Status |
| :--- | :--- | :--- | :--- |
| **Navigation SDK** | **In-App Turn-by-Turn.** Full UI with voice, speed limits, lane guidance. | **Pay-as-you-go.** 1k free destinations/mo. ~$25/1k after. | GA |
| **Routes API** | **Server-side Calculation.** Distance, Duration, Polylines. | Pay-as-you-go. | GA |

**Decision Point:**
*   **Need a driver UI?** → **Navigation SDK** (Android/iOS).
*   **Just need distance/time?** → **Routes API**.

## 3. Places (Data & Search)

| Priority | Product | When to Use | Limitations |
| :---: | :--- | :--- | :--- |
| **1st** | **Places UI Kit** | **Default.** Mandatory for EEA. | Limited styling. |
| **2nd** | **Places API (New)** | Custom UIs, backend processing. | **PROHIBITED** in EEA if on map. |
| **3rd** | **Places Aggregate** | Heatmaps, density analysis. | Stats only. |

## 4. Pricing Tiers (2026 Model)
*   **Starter:** ~$100/mo. Good for prototyping.
*   **Essentials:** ~$275/mo. 100k calls. Good for small apps.
*   **Pro:** ~$1,200/mo. 250k calls. Best for scaling apps.
*   **Pay-as-you-go:** Standard usage-based billing (Nav SDK, etc.).
