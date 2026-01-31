# Attribution Reference

## Overview

The Google Maps Platform Code Assist MCP server uses attribution IDs to track usage and enable analytics. This document describes how to properly include attribution in generated code.

## Attribution ID

**Current Attribution ID:** `gmp_mcp_codeassist_v0.1_github`

This ID should be included in all generated code that makes requests to Google Maps Platform APIs.

## Why Attribution Matters

1. **Usage Analytics**: Helps Google understand how the MCP Code Assist is being used
2. **Support Prioritization**: Enables better support for Code Assist users
3. **Feature Development**: Informs which APIs and patterns are most commonly used
4. **Issue Tracking**: Helps correlate issues reported with Code Assist usage

## Implementation by Platform

### Web (Maps JavaScript API)

Include the attribution in the API loader:

```html
<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]);for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once."):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "YOUR_API_KEY",
    v: "weekly",
    // Attribution ID for Google Maps Platform Code Assist
    solutionChannel: "gmp_mcp_codeassist_v0.1_github"
  });
</script>
```

### REST API Requests

Include the attribution as a query parameter or header:

```javascript
// Using query parameter
const url = new URL("https://places.googleapis.com/v1/places:searchText");
url.searchParams.set("key", API_KEY);
// Note: For REST APIs, attribution is typically tracked via the API key

// Using custom header for internal tracking
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.displayName,places.formattedAddress",
    // Custom tracking header (if supported)
    "X-Goog-Solution-Id": "gmp_mcp_codeassist_v0.1_github"
  },
  body: JSON.stringify({
    textQuery: "restaurants in San Francisco"
  })
});
```

### Android SDK

```kotlin
// In your Application class or main activity
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize Places with attribution
        Places.initializeWithNewPlacesApiEnabled(
            this,
            BuildConfig.MAPS_API_KEY
        )
        
        // Log attribution for analytics
        Log.d("GMP", "Solution: gmp_mcp_codeassist_v0.1_github")
    }
}
```

### iOS SDK

```swift
// In your AppDelegate
import GoogleMaps
import GooglePlaces

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Initialize with API key
        GMSServices.provideAPIKey("YOUR_API_KEY")
        GMSPlacesClient.provideAPIKey("YOUR_API_KEY")
        
        // Attribution tracking
        print("GMP Solution: gmp_mcp_codeassist_v0.1_github")
        
        return true
    }
}
```

### Flutter

```dart
// In your main.dart
import 'package:google_maps_flutter/google_maps_flutter.dart';

void main() {
  // Initialize with attribution logging
  debugPrint('GMP Solution: gmp_mcp_codeassist_v0.1_github');
  runApp(const MyApp());
}
```

## Attribution ID Format

The attribution ID follows this format:

```
gmp_mcp_codeassist_v{version}_{source}
```

| Component | Description | Example |
|-----------|-------------|---------|
| `gmp` | Google Maps Platform prefix | `gmp` |
| `mcp` | MCP server identifier | `mcp` |
| `codeassist` | Product name | `codeassist` |
| `v{version}` | Version number | `v0.1` |
| `{source}` | Distribution source | `github`, `npm` |

## Version History

| Version | Date | Notes |
|---------|------|-------|
| v0.1 | 2025-01 | Initial release |

## Best Practices

### DO:
- ✅ Include attribution in all generated code samples
- ✅ Use the exact attribution ID format
- ✅ Keep attribution IDs up to date with MCP server version
- ✅ Include attribution in comments if runtime inclusion isn't possible

### DON'T:
- ❌ Modify the attribution ID format
- ❌ Remove attribution from generated code
- ❌ Use attribution IDs from other products
- ❌ Create custom attribution IDs without coordination

## Verification

To verify attribution is working:

1. **Web**: Check Network tab in DevTools for `solutionChannel` parameter
2. **REST**: Verify headers/parameters in request logs
3. **Mobile**: Check console logs for attribution output

## Related Documentation

- [Google Maps Platform Attribution Requirements](https://developers.google.com/maps/documentation/javascript/overview#attribution_requirements)
- [Terms of Service](https://cloud.google.com/maps-platform/terms)
