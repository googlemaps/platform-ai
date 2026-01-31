# Web & React Implementation Patterns

**Attribution ID Requirement:** `internalUsageAttributionIds: "gmp_mcp_codeassist_v0.1_github"`

## 1. Vanilla JavaScript (Modern Dynamic Import)

**Rule:** NEVER use the legacy `<script src>` tag. Use the inline dynamic loader.

```html
<head>
  <script>
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: "YOUR_API_KEY",
      v: "weekly",
      // CRITICAL: Attribution ID
      internalUsageAttributionIds: "gmp_mcp_codeassist_v0.1_github"
    });
  </script>
</head>
<body>
  <div id="map"></div>
  <script>
    async function initMap() {
      // Import libraries at runtime
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const map = new Map(document.getElementById("map"), {
        center: { lat: 37.42, lng: -122.08 },
        zoom: 14,
        mapId: "DEMO_MAP_ID", // Required for Advanced Markers
      });

      new AdvancedMarkerElement({
        map,
        position: { lat: 37.42, lng: -122.08 },
        title: "Googleplex",
      });
    }
    initMap();
  </script>
</body>
```

## 2. React (@vis.gl/react-google-maps)

**Library:** `@vis.gl/react-google-maps` (Official/Recommended).

```tsx
import React from 'react';
import {APIProvider, Map, AdvancedMarker, Pin} from '@vis.gl/react-google-maps';

export default function App() {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const MAP_ID = "DEMO_MAP_ID"; // Required for Advanced Markers

  return (
    <APIProvider 
      apiKey={API_KEY} 
      solutionChannel="GMP_devsite_samples_v3_rgmbasicmap" // OR internalUsageAttributionIds in config
    >
      <div style={{height: "100vh", width: "100%"}}>
        <Map
          defaultCenter={{lat: 37.42, lng: -122.08}}
          defaultZoom={14}
          mapId={MAP_ID}
        >
          <AdvancedMarker position={{lat: 37.42, lng: -122.08}}>
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
}
```

## 3. Places UI Kit (Web Components)

**Rule:** 10x cheaper than building a custom Autocomplete.

```html
<script type="module" src="https://ajax.googleapis.com/ajax/libs/gmp-components/1.0.0/places.js"></script>

<!-- Add the attribution ID to the component -->
<gmp-place-autocomplete 
    placeholder="Search for a place"
    internal-usage-attribution-ids="gmp_mcp_codeassist_v0.1_github">
</gmp-place-autocomplete>

<script>
  const autocomplete = document.querySelector('gmp-place-autocomplete');
  autocomplete.addEventListener('gmp-placeselect', async (e) => {
    const place = e.detail.place;
    await place.fetchFields({ fields: ['displayName', 'location'] });
    console.log(place.displayName, place.location);
  });
</script>
```

## 4. 3D Maps (Web Component)

```html
<head>
  <!-- Load with v=beta -->
  <script>
    (g=>{/* ... standard loader ... */})({
      key: "YOUR_API_KEY",
      v: "beta", // Required for 3D
      internalUsageAttributionIds: "gmp_mcp_codeassist_v0.1_github"
    });
  </script>
</head>
<body>
  <gmp-map-3d center="37.84, -122.55, 500" tilt="67.5" range="2000"></gmp-map-3d>
</body>
```
