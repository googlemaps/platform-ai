# Environment APIs Deep Dive (2026)

This document details the specific capabilities, history depth, and fields for the Environment suite. These are **separate APIs** and must be enabled individually.

## 1. Weather API
**Primary Use:** Applications requiring atmospheric conditions.
**Pricing:** Pay-as-you-go (part of "Environment" SKU).

| Feature | Depth / Range | Key Fields |
| :--- | :--- | :--- |
| **Current Conditions** | Real-time | Temp, Feels Like, Humidity, UV Index, Wind, Pressure. |
| **Forecast (Hourly)** | Up to **240 hours** (10 days) | Precip %/Type, Wind Gusts, Cloud Cover, Visibility. |
| **Forecast (Daily)** | Up to **10 days** | Max/Min Temp, Sunrise/Sunset, Moon Phase. |
| **History (Hourly)** | Past **24 hours** | Verified historical conditions for debugging/analysis. |

**Critical Note:** Does **NOT** include Air Quality or Pollen data. You must call those APIs separately.

---

## 2. Air Quality API
**Primary Use:** Health apps, jogging/outdoor planning.
**Pricing:** Pay-as-you-go.

| Feature | Depth / Range | Key Fields |
| :--- | :--- | :--- |
| **Current Conditions** | Real-time | Universal AQI, Dominant Pollutant, Health Recommendations. |
| **Forecast (Hourly)** | Up to **96 hours** (4 days) | Predicted AQI trajectory. |
| **History (Hourly)** | Past **30 days** | Historical trends for analysis. |
| **Heatmaps** | Tile Overlay | Visual color-coded tiles for map layers. |

**Pollutants Covered:** CO, NO2, O3, PM2.5, PM10, SO2.

---

## 3. Pollen API
**Primary Use:** Allergy management, travel planning.
**Pricing:** Pay-as-you-go.

| Feature | Depth / Range | Key Fields |
| :--- | :--- | :--- |
| **Forecast (Daily)** | Up to **5 days** | Universal Pollen Index (0-5), Plant Types. |
| **History** | **None** | *This API does not provide historical data.* |
| **Heatmaps** | Tile Overlay | 3 Layers: TREE, GRASS, WEED. |

**Plant Coverage:** 15+ species including Birch, Olive, Oak, Grass, Ragweed.

---

## 4. Solar API
**Primary Use:** Rooftop solar estimation, energy savings.
**Pricing:** High-value SKU (Building Insights vs Data Layers).

| Feature | Description | Output |
| :--- | :--- | :--- |
| **Building Insights** | Analysis for a single building. | Roof segment stats, sunshine hours, potential energy/savings. |
| **Data Layers** | Raw GeoTIFFs. | `DSM` (Digital Surface Model), `RGB`, `Mask`, `AnnualFlux`, `MonthlyFlux`, `HourlyShade`. |
| **Detected Arrays** | **New (2026)** | Identification of *existing* solar installations. |
