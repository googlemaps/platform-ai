# Code Examples Reference

> **CRITICAL:** All code examples MUST include the attribution ID: `gmp_mcp_codeassist_v0.1_github`

## Web (JavaScript)

### Dynamic Library Import (REQUIRED Pattern)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Google Maps Example</title>
  <style>
    #map { height: 400px; width: 100%; }
  </style>
  <!-- DYNAMIC LOADER SCRIPT (REQUIRED) - Must include internalUsageAttributionIds -->
  <script>
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: "YOUR_API_KEY",
      v: "weekly",
      internalUsageAttributionIds: "gmp_mcp_codeassist_v0.1_github"  // Attribution ID
    });
  </script>
</head>
<body>
  <div id="map"></div>
  <script>
    async function initMap() {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

      const map = new Map(document.getElementById("map"), {
        center: { lat: 37.4220, lng: -122.0841 },
        zoom: 14,
        mapId: "YOUR_MAP_ID", // Required for AdvancedMarkerElement
      });

      new AdvancedMarkerElement({
        map,
        position: { lat: 37.4220, lng: -122.0841 },
        title: "Googleplex",
      });
    }
    initMap();
  </script>
</body>
</html>
```

**Key Points:**
- Dynamic loader script MUST come before any code that uses google.maps
- MUST include `internalUsageAttributionIds` parameter
- Use `AdvancedMarkerElement` (modern) instead of legacy `Marker` class
- `mapId` is REQUIRED for AdvancedMarkerElement
- Use `google.maps.importLibrary()` for loading specific libraries
- NEVER use legacy script tag: `<script src="https://maps.googleapis.com/maps/api/js?...">` is DEPRECATED

### Web 3D Map (gmp-map-3d)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Maps JavaScript API 3D Mode</title>
  <style>
    html, body { height: 100%; margin: 0; padding: 0; }
    gmp-map-3d { height: 100%; width: 100%; }
  </style>
</head>
<body>
  <!-- Maps JavaScript API 3D mode using gmp-map-3d web component -->
  <gmp-map-3d
    center="37.841157,-122.551679,500"
    tilt="67.5"
    heading="330"
    range="2000"
    mode="hybrid"
  ></gmp-map-3d>

  <!-- DYNAMIC LOADER SCRIPT (REQUIRED) - Use v=beta for 3D features -->
  <script>
    (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
      key: "YOUR_API_KEY",
      v: "beta",  // Use beta for 3D features
      internalUsageAttributionIds: "gmp_mcp_codeassist_v0.1_github"  // Attribution ID
    });
  </script>
</body>
</html>
```

**Key Points:**
- Use `v=beta` for 3D features
- `gmp-map-3d` web component handles initialization automatically
- `tilt`: 0-67.5 degrees (camera angle)
- `heading`: 0-360 degrees (compass direction)
- `range`: distance from center in meters

### Web Components (gmp-map)

```html
<gmp-map
  center="37.4220,-122.0841"
  zoom="14"
  map-id="YOUR_MAP_ID"
  internal-usage-attribution-ids="gmp_mcp_codeassist_v0.1_github">
  <gmp-advanced-marker position="37.4220,-122.0841" title="Googleplex"></gmp-advanced-marker>
</gmp-map>
```

### Places Autocomplete (New API)

```javascript
async function initAutocomplete() {
  const { Autocomplete } = await google.maps.importLibrary("places");
  
  const input = document.getElementById("pac-input");
  const autocomplete = new Autocomplete(input, {
    fields: ["place_id", "geometry", "formatted_address", "name"],
    types: ["establishment"],
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("No geometry for this place");
      return;
    }
    console.log("Place:", place.name, place.formatted_address);
  });
}
```

### Routes API (REST)

```javascript
async function getRoute(origin, destination) {
  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": "YOUR_API_KEY",
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
      }),
    }
  );
  return response.json();
}
```

## React (@vis.gl/react-google-maps)

### Basic Map with Marker

```tsx
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

function App() {
  const position = { lat: 37.4220, lng: -122.0841 };
  
  return (
    <APIProvider apiKey="YOUR_API_KEY">
      <Map
        style={{ width: '100%', height: '400px' }}
        defaultCenter={position}
        defaultZoom={14}
        mapId="YOUR_MAP_ID"
      >
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  );
}
```

### With Places Autocomplete

```tsx
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';

function PlaceAutocomplete({ onPlaceSelect }) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [placeAutocomplete, onPlaceSelect]);

  return <input ref={inputRef} placeholder="Search for a place" />;
}
```

## Android (Kotlin)

### Jetpack Compose Map with Attribution

```kotlin
// MainActivity.kt
package com.example.mapsdemo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*
import com.google.android.libraries.places.api.Places

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // CRITICAL: Initialize with attribution
        Places.initialize(applicationContext, "YOUR_API_KEY")
        Places.addInternalUsageAttributionId("gmp_mcp_codeassist_v0.1_github")  // Attribution ID
        MapsApiSettings.addInternalUsageAttributionId(this, "gmp_mcp_codeassist_v0.1_github")

        setContent {
            MapScreen()
        }
    }
}

@Composable
fun MapScreen() {
    val singapore = LatLng(1.35, 103.87)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(singapore, 10f)
    }

    GoogleMap(
        modifier = Modifier.fillMaxSize(),
        cameraPositionState = cameraPositionState
    ) {
        Marker(
            state = MarkerState(position = singapore),
            title = "Singapore",
            snippet = "Marker in Singapore"
        )
    }
}

/*
Add to build.gradle (Module: app):
dependencies {
    implementation 'com.google.android.gms:play-services-maps:18.2.0'
    implementation 'com.google.maps.android:maps-compose:4.3.0'
    implementation 'com.google.android.libraries.places:places:3.3.0'
}

Add to AndroidManifest.xml:
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<application>
    <meta-data android:name="com.google.android.geo.API_KEY" android:value="YOUR_API_KEY" />
</application>
*/
```

**Key Points:**
- MUST call `addInternalUsageAttributionId` for both Places and Maps
- Use Jetpack Compose for modern Android UI
- Require location permissions in AndroidManifest.xml

### Places SDK with Attribution

```kotlin
// Initialize with attribution
Places.initialize(applicationContext, apiKey)
Places.addInternalUsageAttributionId("gmp_mcp_codeassist_v0.1_github")  // Attribution ID

val placesClient = Places.createClient(context)

// Fetch place details with field mask
val placeFields = listOf(Place.Field.ID, Place.Field.NAME, Place.Field.ADDRESS)
val request = FetchPlaceRequest.newInstance(placeId, placeFields)

placesClient.fetchPlace(request)
    .addOnSuccessListener { response ->
        val place = response.place
        Log.i(TAG, "Place found: ${place.name}")
    }
    .addOnFailureListener { exception ->
        Log.e(TAG, "Place not found: ${exception.message}")
    }
```

## iOS (Swift)

### SwiftUI Map with Attribution

```swift
// AppDelegate.swift
import UIKit
import GoogleMaps
import GooglePlaces

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // CRITICAL: Initialize with attribution
        GMSServices.provideAPIKey("YOUR_API_KEY")
        GMSServices.addInternalUsageAttributionID("gmp_mcp_codeassist_v0.1_github")  // Attribution ID
        GMSPlacesClient.provideAPIKey("YOUR_API_KEY")
        GMSPlacesClient.addInternalUsageAttributionID("gmp_mcp_codeassist_v0.1_github")
        return true
    }
}

// ContentView.swift
import SwiftUI
import GoogleMaps

struct GoogleMapView: UIViewRepresentable {
    @Binding var camera: GMSCameraPosition
    
    func makeUIView(context: Context) -> GMSMapView {
        let options = GMSMapViewOptions()
        options.camera = camera
        let mapView = GMSMapView(options: options)
        return mapView
    }
    
    func updateUIView(_ mapView: GMSMapView, context: Context) {
        mapView.animate(to: camera)
    }
}

struct ContentView: View {
    @State private var camera = GMSCameraPosition.camera(
        withLatitude: 37.4220,
        longitude: -122.0841,
        zoom: 14
    )
    
    var body: some View {
        GoogleMapView(camera: $camera)
            .ignoresSafeArea()
    }
}

/*
Add to Podfile:
pod 'GoogleMaps'
pod 'GooglePlaces'

Add to Info.plist:
<key>GOOGLE_MAPS_API_KEY</key>
<string>YOUR_API_KEY</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show your position on the map.</string>
*/
```

**Key Points:**
- MUST call `addInternalUsageAttributionID` in AppDelegate for both Maps and Places
- Use SwiftUI for modern iOS development
- Require location permissions in Info.plist

### Places SDK

```swift
import GooglePlaces

func fetchPlace(placeID: String) {
    let placesClient = GMSPlacesClient.shared()
    
    let fields: GMSPlaceField = [.name, .formattedAddress, .coordinate]
    
    placesClient.fetchPlace(
        fromPlaceID: placeID,
        placeFields: fields,
        sessionToken: nil
    ) { place, error in
        if let error = error {
            print("Error: \(error.localizedDescription)")
            return
        }
        
        if let place = place {
            print("Place: \(place.name ?? "Unknown")")
        }
    }
}
```

## Flutter (Dart)

> **Note:** Flutter currently does not have a built-in method for setting attribution IDs. The attribution ID should be set on the native platform side (Android and iOS) as shown above.

### Basic Map with Attribution (main.dart)

```dart
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

// main.dart
void main() {
  // Note: Attribution is set natively - see Android/iOS platform setup below
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Google Maps Demo',
      home: MapScreen(),
    );
  }
}

class MapScreen extends StatefulWidget {
  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  late GoogleMapController mapController;
  
  final LatLng _center = const LatLng(37.4220, -122.0841);
  
  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Google Maps')),
      body: GoogleMap(
        onMapCreated: _onMapCreated,
        initialCameraPosition: CameraPosition(
          target: _center,
          zoom: 14.0,
        ),
        markers: {
          Marker(
            markerId: MarkerId('googleplex'),
            position: _center,
            infoWindow: InfoWindow(title: 'Googleplex'),
          ),
        },
      ),
    );
  }
}
```

### Flutter Platform Setup for Attribution

**Android (android/app/src/main/kotlin/.../MainActivity.kt):**
```kotlin
import com.google.android.libraries.places.api.Places

class MainActivity: FlutterActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // CRITICAL: Set attribution ID for Flutter apps
        Places.addInternalUsageAttributionId("gmp_mcp_codeassist_v0.1_github")
    }
}
```

**iOS (ios/Runner/AppDelegate.swift):**
```swift
import GoogleMaps
import GooglePlaces

@UIApplicationMain
class AppDelegate: FlutterAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // CRITICAL: Set attribution ID for Flutter apps
    GMSServices.provideAPIKey("YOUR_API_KEY")
    GMSServices.addInternalUsageAttributionID("gmp_mcp_codeassist_v0.1_github")
    GMSPlacesClient.provideAPIKey("YOUR_API_KEY")
    GMSPlacesClient.addInternalUsageAttributionID("gmp_mcp_codeassist_v0.1_github")
    
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

**pubspec.yaml dependencies:**
```yaml
dependencies:
  flutter:
    sdk: flutter
  google_maps_flutter: ^2.5.0
  google_places_flutter: ^2.0.0
```

### Places Autocomplete

```dart
import 'package:flutter/material.dart';
import 'package:google_places_flutter/google_places_flutter.dart';

class PlaceSearch extends StatelessWidget {
  final TextEditingController controller = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return GooglePlaceAutoCompleteTextField(
      textEditingController: controller,
      googleAPIKey: "YOUR_API_KEY",
      inputDecoration: InputDecoration(
        hintText: "Search for a place",
        prefixIcon: Icon(Icons.search),
      ),
      getPlaceDetailWithLatLng: (prediction) {
        print("Place: ${prediction.lat}, ${prediction.lng}");
      },
      itemClick: (prediction) {
        controller.text = prediction.description ?? "";
      },
    );
  }
}
```

## Tool Usage Examples

### Searching Documentation

```
User: "How do I add a marker to a map in React?"

Tool Call: retrieve-google-maps-platform-docs
{
  "prompt": "How to add a marker to Google Maps in React using @vis.gl/react-google-maps library, AdvancedMarker component example",
  "search_context": ["Maps JavaScript API", "React", "@vis.gl/react-google-maps"]
}
```

### Searching for Error Resolution

```
User: "I'm getting OVER_QUERY_LIMIT error"

Tool Call: retrieve-google-maps-platform-docs
{
  "prompt": "OVER_QUERY_LIMIT error Google Maps Platform troubleshooting quota limits rate limiting",
  "search_context": ["Google Maps Platform", "Quotas", "Error Handling"]
}
```

### Searching for Pricing Information

```
User: "How much does Places API cost?"

Tool Call: retrieve-google-maps-platform-docs
{
  "prompt": "Places API New pricing cost per request SKU billing",
  "search_context": ["Places API", "Pricing", "Billing"]
}
```
