# Places API & UI Kit: The Complete Guide (2026)

**Top-Level Documentation:** [developers.google.com/maps/documentation/places](https://developers.google.com/maps/documentation/places)

## 1. The Ecosystem at a Glance

| Product | Best For | Key Features |
| :--- | :--- | :--- |
| **Places UI Kit** | **Default.** Rapid UI implementation. | Autocomplete, Place Details, Place List. **EEA Compliant.** |
| **Places API (New)** | Custom UIs, Backend logic. | Text Search, Nearby Search, Field Masking (Cost Control). |
| **Places Aggregate** | Analysis & Heatmaps. | Heatmaps, density counts, "top places" ranking. |
| **Places Library (JS)** | Legacy Web Apps. | `places` library in Maps JS API. |

---

## 2. Places UI Kit (Recommended)
**Documentation:** [developers.google.com/maps/documentation/javascript/places-ui-kit](https://developers.google.com/maps/documentation/javascript/places-ui-kit/overview)

A set of pre-built, customizable UI components. Available for **Web (Web Components)**, **Android (Compose)**, and **iOS (SwiftUI)**.

*   **Key Components:**
    *   `<gmp-place-autocomplete>`: Type-ahead search.
    *   `<gmp-place-details>`: Rich details card (photos, reviews, hours).
    *   `<gmp-place-list>`: List of results from a search.
*   **Pricing:** Cost-efficient (optimizes session handling).
*   **Styling:** CSS variables (Web) or Native Modifiers (Mobile).

---

## 3. Places API (New)
**Documentation:** [developers.google.com/maps/documentation/places/web-service/op-overview](https://developers.google.com/maps/documentation/places/web-service/op-overview)

The modern backend API using **Field Masks** to control costs.

### When to use this vs. UI Kit?
*   **Custom UI:** You need a completely bespoke design (e.g., a circular list, custom animations).
*   **UX Experience:** You want "search as you type" without the standard dropdown behavior.
*   **Backend Logic:** You are filtering results before showing them to the user.

**⚠️ EEA Warning:** In the European Economic Area (EEA), you **cannot** use the Places API (New) to display results on a Google Map. You **MUST** use the Places UI Kit or Places Library (JS) for that specific "Map + Search" use case.

### New Features (2026)
*   **EV Charging:** Connector types, power output, availability.
*   **Accessibility:** Wheelchair accessible entrance/restroom/seating.
*   **Generative AI Summaries:** "Vibe" descriptions (e.g., "Cozy spot for study").
*   **Field Masking:** You **MUST** specify fields (e.g., `places.displayName,places.formattedAddress`). If you don't ask, you don't get (and don't pay).

### Core Methods
*   **Text Search (New):** "Spicy Vegetarian Food in Soho". Returns a list.
*   **Nearby Search (New):** "Cafe" within 500m of user.
*   **Place Details (New):** Fetch specific fields for a Place ID.
*   **Place Photos (New):** High-res access to user photos.

---

## 4. Places Aggregate API
**Documentation:** [developers.google.com/maps/documentation/places-aggregate](https://developers.google.com/maps/documentation/places-aggregate)

*   **Use Case:** "Where are the most Italian restaurants?"
*   **Output:** Heatmap tiles or raw counts.
*   **Not for:** Finding a specific address.

---

## 5. Usage Patterns

### A. The "Autocomplete" Flow (Standard)
1.  User types in **Places UI Kit** Autocomplete.
2.  UI Kit handles session token automatically.
3.  User selects a result -> Returns `Place ID` + `Lat/Lng`.
4.  Show on Map (if valid) or fetch Details.

### B. The "Backend Proxy" Flow (Secure)
1.  Mobile app sends search query to *your* backend.
2.  Your backend calls **Places API (New) Text Search**.
3.  **Crucial:** Backend applies Field Mask (`*`) to fetch only needed data.
4.  Return sanitized JSON to mobile app.

### C. Decision Matrix

| Scenario | EEA Region? | Display on Map? | Recommended Solution |
| :--- | :--- | :--- | :--- |
| **Standard Search** | Yes | Yes | **Places UI Kit** (Mandatory) |
| **Standard Search** | No | Yes | **Places UI Kit** (Cheaper) or **Places API** (Custom UI) |
| **List Only (No Map)** | Any | No | **Places API** (New) |
| **Backend Analysis** | Any | N/A | **Places API** (New) |