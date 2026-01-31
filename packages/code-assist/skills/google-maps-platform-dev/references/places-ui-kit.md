# Places UI Kit - Complete Guide

## Overview

The Places UI Kit provides pre-built, customizable web components for displaying place information in Google Maps applications. These components handle attribution, styling, and data fetching automatically.

**Official Documentation:**
- [Place Details](https://developers.google.com/maps/documentation/javascript/places-ui-kit/place-details)
- [Custom Styling](https://developers.google.com/maps/documentation/javascript/places-ui-kit/custom-styling)
- [Store Finder Architecture](https://developers.google.com/maps/architecture/ui-kit-store-finder)

---

## Core Components

### 1. PlaceDetailsElement (`gmp-place-details`)
Full-featured component for comprehensive place information.

```html
<gmp-place-details>
  <gmp-place-details-place-request place="PLACE_ID"></gmp-place-details-place-request>
  <gmp-place-content-config>
    <gmp-place-media lightbox-preferred></gmp-place-media>
    <gmp-place-address></gmp-place-address>
    <gmp-place-rating></gmp-place-rating>
    <gmp-place-phone-number></gmp-place-phone-number>
    <gmp-place-opening-hours></gmp-place-opening-hours>
    <gmp-place-reviews></gmp-place-reviews>
  </gmp-place-content-config>
</gmp-place-details>
```

### 2. PlaceDetailsCompactElement (`gmp-place-details-compact`)
Space-efficient variant for sidebars, lists, and info windows.

```html
<gmp-place-details-compact orientation="vertical">
  <gmp-place-details-place-request place="PLACE_ID"></gmp-place-details-place-request>
  <gmp-place-content-config>
    <gmp-place-media></gmp-place-media>
    <gmp-place-rating></gmp-place-rating>
    <gmp-place-accessibility></gmp-place-accessibility>
    <gmp-place-attribution></gmp-place-attribution>
  </gmp-place-content-config>
</gmp-place-details-compact>
```

---

## Required Setup

### Script Import
```javascript
// Load the Places library
await google.maps.importLibrary('places');
```

### HTML Structure
Components must be nested within the map container or be positioned appropriately for your layout.

---

## Sizing and Layout

### Critical: Container Sizing

**IMPORTANT:** The UI kit components require explicit container sizing to display properly, especially in info windows.

#### PlaceDetailsElement (Full)
- **Recommended width:** 250px - 400px
- **Height:** Set explicitly based on content needs
- **Minimum height:** ~300px for standard content

```css
gmp-place-details {
  display: block;
  width: 350px;
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}
```

#### PlaceDetailsCompactElement
- **Vertical orientation:** 180px - 300px width
- **Horizontal orientation:** 180px - 500px width
- **Note:** Images hidden below 350px width

```css
gmp-place-details-compact {
  display: block;
  width: 280px;
  min-height: 200px;
}

/* Horizontal layout */
gmp-place-details-compact[orientation="horizontal"] {
  width: 400px;
  min-height: 150px;
}
```

---

## Info Window Integration

### Proper Info Window Sizing

Info windows with Place Details cards require proper container configuration:

```css
/* Style the info window container */
.gm-style-iw {
  max-width: none !important;
}

.gm-style-iw-d {
  overflow: visible !important;
  max-height: none !important;
}

/* Place details card in info window */
.info-window-content {
  width: 320px;
  min-height: 350px;
  padding: 0;
}

.info-window-content gmp-place-details-compact {
  display: block;
  width: 100%;
  height: 100%;
}
```

### JavaScript: Creating Info Windows with Place Details

```javascript
// Create info window with proper sizing
const infoWindow = new google.maps.InfoWindow({
  maxWidth: 400,
  minWidth: 280
});

// Create place details element programmatically
function showPlaceDetails(placeId, marker) {
  const container = document.createElement('div');
  container.className = 'info-window-content';
  container.style.width = '320px';
  container.style.minHeight = '350px';

  const placeDetails = document.createElement('gmp-place-details-compact');
  placeDetails.setAttribute('orientation', 'vertical');
  placeDetails.style.display = 'block';
  placeDetails.style.width = '100%';

  const placeRequest = document.createElement('gmp-place-details-place-request');
  placeRequest.setAttribute('place', placeId);

  const contentConfig = document.createElement('gmp-place-content-config');
  contentConfig.innerHTML = `
    <gmp-place-media></gmp-place-media>
    <gmp-place-address></gmp-place-address>
    <gmp-place-rating></gmp-place-rating>
    <gmp-place-opening-hours></gmp-place-opening-hours>
    <gmp-place-attribution></gmp-place-attribution>
  `;

  placeDetails.appendChild(placeRequest);
  placeDetails.appendChild(contentConfig);
  container.appendChild(placeDetails);

  infoWindow.setContent(container);
  infoWindow.open(map, marker);
}
```

---

## CSS Custom Properties

### Color System (Material Design 3)

```css
gmp-place-details,
gmp-place-details-compact {
  /* Surface colors */
  --gmp-mat-color-surface: #ffffff;
  --gmp-mat-color-on-surface: #1f1f1f;
  --gmp-mat-color-on-surface-variant: #5f5f5f;

  /* Primary/accent */
  --gmp-mat-color-primary: #1a73e8;
  --gmp-mat-color-secondary-container: #e8f0fe;

  /* Status indicators */
  --gmp-mat-color-positive: #137333;  /* Open status */
  --gmp-mat-color-negative: #c5221f;  /* Closed status */

  /* Containers and borders */
  --gmp-mat-color-neutral-container: #f5f5f5;
  --gmp-mat-color-outline-decorative: #dadce0;

  /* Border styling */
  border: 1px solid #dadce0;
  border-radius: 12px;
}
```

### Typography Properties

```css
gmp-place-details,
gmp-place-details-compact {
  /* Base font */
  --gmp-mat-font-family: 'Roboto', 'Arial', sans-serif;

  /* Place name */
  --gmp-mat-font-display-small: 400 24px/32px var(--gmp-mat-font-family);

  /* Dialog headings */
  --gmp-mat-font-headline-medium: 400 28px/36px var(--gmp-mat-font-family);

  /* Content text */
  --gmp-mat-font-body-medium: 400 14px/20px var(--gmp-mat-font-family);
  --gmp-mat-font-body-small: 400 12px/16px var(--gmp-mat-font-family);

  /* Labels/buttons */
  --gmp-mat-font-label-large: 500 14px/20px var(--gmp-mat-font-family);
  --gmp-mat-font-label-medium: 500 12px/16px var(--gmp-mat-font-family);
}
```

---

## Dark Mode Theming

### The Problem: Unexpected Dark Mode

**COMMON ISSUE:** Places UI Kit components automatically follow `prefers-color-scheme`, meaning they appear dark when the user's OS is in dark mode - even if your app uses a light theme.

### Automatic Detection
Components automatically adapt to system preference via `prefers-color-scheme`.

### Force Light/Dark Mode (RECOMMENDED FIX)

```css
/* Force light mode - fixes unexpected dark UI */
gmp-place-details,
gmp-place-details-compact,
gmp-place-autocomplete,
gmp-place-search {
  color-scheme: light;
}

/* Force dark mode */
gmp-place-details,
gmp-place-details-compact {
  color-scheme: dark;
}
```

### Syncing with Map Color Scheme

**IMPORTANT:** The map's `colorScheme` can only be set at initialization and cannot be changed dynamically.

```javascript
const { ColorScheme } = await google.maps.importLibrary("core");

// Detect user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialize map with matching color scheme
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 37.7749, lng: -122.4194 },
  zoom: 13,
  mapId: 'YOUR_MAP_ID',
  colorScheme: prefersDark ? ColorScheme.DARK : ColorScheme.LIGHT
  // Or use ColorScheme.FOLLOW_SYSTEM for automatic matching
});

// Apply matching scheme to Places UI Kit
const placesStyle = document.createElement('style');
placesStyle.textContent = `
  gmp-place-details,
  gmp-place-details-compact,
  gmp-place-search {
    color-scheme: ${prefersDark ? 'dark' : 'light'};
  }
`;
document.head.appendChild(placesStyle);
```

### Complete CSS Properties Reference

| Property | Purpose | Light Default | Dark Default |
|----------|---------|---------------|--------------|
| `--gmp-mat-color-surface` | Background | `#ffffff` | `#1e1e1e` |
| `--gmp-mat-color-on-surface` | Primary text | `#1f1f1f` | `#e3e3e3` |
| `--gmp-mat-color-on-surface-variant` | Secondary text | `#5f5f5f` | `#a8a8a8` |
| `--gmp-mat-color-primary` | Links, accents | `#1a73e8` | `#8ab4f8` |
| `--gmp-mat-color-secondary-container` | Button backgrounds | `#e8f0fe` | `#394457` |
| `--gmp-mat-color-on-secondary-container` | Button text | `#1a73e8` | `#c2e7ff` |
| `--gmp-mat-color-positive` | "Open" status | `#137333` | `#137333` |
| `--gmp-mat-color-negative` | "Closed" status | `#c5221f` | `#c5221f` |
| `--gmp-mat-color-info` | Accessibility icons | `#1a73e8` | `#8ab4f8` |
| `--gmp-mat-color-neutral-container` | Badges, loading | `#f5f5f5` | `#2d2d2d` |
| `--gmp-mat-color-outline-decorative` | Borders | `#dadce0` | `#5f5f5f` |

### Custom Dark Theme

```css
@media (prefers-color-scheme: dark) {
  gmp-place-details,
  gmp-place-details-compact {
    --gmp-mat-color-surface: #1e1e1e;
    --gmp-mat-color-on-surface: #e3e3e3;
    --gmp-mat-color-on-surface-variant: #a8a8a8;
    --gmp-mat-color-primary: #8ab4f8;
    --gmp-mat-color-secondary-container: #394457;
    --gmp-mat-color-neutral-container: #2d2d2d;
    --gmp-mat-color-outline-decorative: #5f5f5f;
  }
}

---

## Matching App CSS Styles

### Complete Example: Custom Themed Place Details

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      /* Your app's design tokens */
      --app-primary: #2196F3;
      --app-background: #fafafa;
      --app-text: #212121;
      --app-text-secondary: #757575;
      --app-border: #e0e0e0;
      --app-border-radius: 8px;
      --app-font: 'Open Sans', sans-serif;
    }

    /* Apply app styles to Place Details */
    gmp-place-details,
    gmp-place-details-compact {
      /* Map app colors to Material Design tokens */
      --gmp-mat-color-surface: var(--app-background);
      --gmp-mat-color-on-surface: var(--app-text);
      --gmp-mat-color-on-surface-variant: var(--app-text-secondary);
      --gmp-mat-color-primary: var(--app-primary);
      --gmp-mat-color-outline-decorative: var(--app-border);

      /* Typography */
      --gmp-mat-font-family: var(--app-font);

      /* Container styling */
      border: 1px solid var(--app-border);
      border-radius: var(--app-border-radius);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Info window container */
    .place-card-container {
      width: 320px;
      min-height: 300px;
      background: var(--app-background);
      border-radius: var(--app-border-radius);
      overflow: hidden;
    }

    .place-card-container gmp-place-details-compact {
      display: block;
      width: 100%;
    }

    /* Fix info window overflow */
    .gm-style-iw-c {
      padding: 0 !important;
    }

    .gm-style-iw-d {
      overflow: visible !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    async function initMap() {
      await google.maps.importLibrary('places');

      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 13,
        mapId: 'YOUR_MAP_ID'
      });

      // Create styled info window
      const infoWindow = new google.maps.InfoWindow({
        maxWidth: 350,
        minWidth: 300
      });

      // Click handler
      map.addListener('click', async (e) => {
        if (e.placeId) {
          e.stop();
          showPlaceCard(e.placeId, e.latLng, map, infoWindow);
        }
      });
    }

    function showPlaceCard(placeId, position, map, infoWindow) {
      const container = document.createElement('div');
      container.className = 'place-card-container';

      container.innerHTML = `
        <gmp-place-details-compact orientation="vertical">
          <gmp-place-details-place-request place="${placeId}"></gmp-place-details-place-request>
          <gmp-place-content-config>
            <gmp-place-media></gmp-place-media>
            <gmp-place-address></gmp-place-address>
            <gmp-place-rating></gmp-place-rating>
            <gmp-place-opening-hours></gmp-place-opening-hours>
            <gmp-place-attribution></gmp-place-attribution>
          </gmp-place-content-config>
        </gmp-place-details-compact>
      `;

      infoWindow.setContent(container);
      infoWindow.setPosition(position);
      infoWindow.open(map);
    }

    initMap();
  </script>
  <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap">
  </script>
</body>
</html>
```

---

## Content Configuration Options

### Available Content Elements

| Element | Description |
|---------|-------------|
| `<gmp-place-media>` | Photos carousel (add `lightbox-preferred` for full-screen) |
| `<gmp-place-address>` | Formatted address |
| `<gmp-place-rating>` | Star rating and review count |
| `<gmp-place-phone-number>` | Phone number with click-to-call |
| `<gmp-place-opening-hours>` | Hours of operation |
| `<gmp-place-reviews>` | User reviews |
| `<gmp-place-accessibility>` | Accessibility info |
| `<gmp-place-attribution>` | Required Google attribution |

### Preset Configurations

```html
<!-- Standard preset (most common fields) -->
<gmp-place-standard-content></gmp-place-standard-content>

<!-- All available content -->
<gmp-place-all-content></gmp-place-all-content>
```

---

## Attribution Requirements

**IMPORTANT:** Google Maps Platform requires visible attribution. Always include `<gmp-place-attribution>` in your content configuration.

### Attribution Color Options

Available colors: `white`, `gray`, `black`

#### HTML Attributes

```html
<gmp-place-attribution
    light-scheme-color="gray"
    dark-scheme-color="white">
</gmp-place-attribution>
```

#### JavaScript Programmatic

```javascript
// Set attribution colors programmatically
const attribution = document.querySelector('gmp-place-attribution');
attribution.lightSchemeColor = 'gray';  // 'white', 'gray', or 'black'
attribution.darkSchemeColor = 'white';
```

#### Official GitHub Sample Pattern

From [googlemaps-samples/js-api-samples](https://github.com/googlemaps-samples/js-api-samples):

```html
<gmp-place-details-compact
    orientation="horizontal"
    truncation-preferred
    style="width: 400px; border: none; color-scheme: light;">
    <gmp-place-details-place-request></gmp-place-details-place-request>
    <gmp-place-content-config>
        <gmp-place-media></gmp-place-media>
        <gmp-place-rating></gmp-place-rating>
        <gmp-place-open-now-status></gmp-place-open-now-status>
        <gmp-place-attribution
            light-scheme-color="gray"
            dark-scheme-color="white"></gmp-place-attribution>
    </gmp-place-content-config>
</gmp-place-details-compact>
```

---

## Performance Best Practices

1. **Lazy load Place Details**: Only create elements when needed (on marker click)
2. **Debounce map events**: Use 300ms debounce for viewport change handlers
3. **Clean up**: Remove previous info window content before creating new
4. **Cache Place IDs**: Store Place IDs with your location data to avoid extra lookups

---

## Common Issues and Solutions

### Issue: Place Details card appears cut off in info window

**Solution:** Set explicit container dimensions and override info window overflow:

```css
.gm-style-iw-d {
  overflow: visible !important;
  max-height: none !important;
}

.info-window-content {
  width: 320px;
  min-height: 350px;
}
```

### Issue: Content doesn't match app theme

**Solution:** Map your CSS custom properties to the Material Design 3 tokens:

```css
gmp-place-details {
  --gmp-mat-color-surface: var(--your-background-color);
  --gmp-mat-color-on-surface: var(--your-text-color);
  --gmp-mat-color-primary: var(--your-primary-color);
  --gmp-mat-font-family: var(--your-font-family);
}
```

### Issue: Component doesn't render

**Solution:** Ensure:
1. Places library is loaded: `await google.maps.importLibrary('places')`
2. Valid Place ID is provided
3. Container has explicit dimensions
4. API key has Places API enabled

### Issue: Places UI Kit appears dark when app is light themed

**Cause:** Components follow the OS `prefers-color-scheme` by default.

**Solution:** Force light mode with CSS:

```css
gmp-place-details,
gmp-place-details-compact,
gmp-place-search {
  color-scheme: light;
}
```

### Issue: Map and Places UI Kit have mismatched themes

**Cause:** Map `colorScheme` is set at initialization only and doesn't auto-sync with Places UI Kit.

**Solution:** Set both at initialization:

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Map initialization
const map = new google.maps.Map(el, {
  colorScheme: prefersDark ? ColorScheme.DARK : ColorScheme.LIGHT,
  mapId: 'YOUR_MAP_ID'
});

// Places UI Kit CSS
document.head.insertAdjacentHTML('beforeend', `
  <style>
    gmp-place-details-compact { color-scheme: ${prefersDark ? 'dark' : 'light'}; }
  </style>
`);
```

---

## Official Code Samples (GitHub)

**Repository:** [googlemaps-samples/js-api-samples](https://github.com/googlemaps-samples/js-api-samples)

### Places UI Kit Samples

| Sample | Clone Command |
|--------|---------------|
| Place Details | `git clone -b sample-ui-kit-place-details https://github.com/googlemaps-samples/js-api-samples.git` |
| Place Details Compact | `git clone -b sample-ui-kit-place-details-compact https://github.com/googlemaps-samples/js-api-samples.git` |
| Place Search Nearby | `git clone -b sample-ui-kit-place-search-nearby https://github.com/googlemaps-samples/js-api-samples.git` |
| Place Search Text | `git clone -b sample-ui-kit-place-search-text-compact https://github.com/googlemaps-samples/js-api-samples.git` |
| React Place Details | `git clone -b sample-react-ui-kit-place-details https://github.com/googlemaps-samples/js-api-samples.git` |
| React Place Details Compact | `git clone -b sample-react-ui-kit-place-details-compact https://github.com/googlemaps-samples/js-api-samples.git` |
| React Search Nearby | `git clone -b sample-react-ui-kit-search-nearby https://github.com/googlemaps-samples/js-api-samples.git` |

### Running Samples Locally

```bash
cd js-api-samples/samples/ui-kit-place-details
npm i
npm start
```

### Architecture Center Guides

- [Store Finder with Places UI Kit](https://developers.google.com/maps/architecture/ui-kit-store-finder?utm_source=gmp-code-assist)
- [Getting Started with Places UI Kit](https://developers.google.com/maps/architecture/places-ui-kit-getting-started?utm_source=gmp-code-assist)

---

## Interactive Customization Tool

Google provides a live styling tool to preview CSS custom property configurations:

**[Places UI Kit Customization Tool](https://developers.google.com/maps/documentation/javascript/places-ui-kit/custom-styling#customization-tool?utm_source=gmp-code-assist)**

The tool provides configurations in:
- HTML/CSS (Web)
- Kotlin/XML (Android)
- Swift (iOS)
