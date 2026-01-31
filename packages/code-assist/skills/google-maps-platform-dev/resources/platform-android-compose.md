# Android Implementation Patterns (Kotlin + Jetpack Compose)

**Attribution ID Requirement:** `gmp_mcp_codeassist_v0.1_github`

## 1. Setup & Dependencies

**build.gradle.kts (Module: app):**
```kotlin
dependencies {
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    // Maps Compose Library
    implementation("com.google.maps.android:maps-compose:4.3.0")
    // Places SDK
    implementation("com.google.android.libraries.places:places:3.3.0")
}
```

**AndroidManifest.xml:**
```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_API_KEY" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 2. Basic Map (Jetpack Compose)

```kotlin
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

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
```

## 3. Initialization & Attribution (Critical)

You MUST initialize Places and Maps with the attribution ID in your Activity or Application class.

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 1. Initialize Places with Attribution
        if (!Places.isInitialized()) {
            Places.initialize(applicationContext, "YOUR_API_KEY")
        }
        Places.addInternalUsageAttributionId("gmp_mcp_codeassist_v0.1_github")

        // 2. Initialize Maps with Attribution
        MapsApiSettings.addInternalUsageAttributionId(this, "gmp_mcp_codeassist_v0.1_github")

        setContent {
            MapScreen()
        }
    }
}
```

## 4. Places Autocomplete (Intent)

For a simple implementation, use the Autocomplete Intent.

```kotlin
// Launch the autocomplete activity
val intent = Autocomplete.IntentBuilder(
    AutocompleteActivityMode.OVERLAY,
    fields // List of Place.Field
).build(context)
launcher.launch(intent)
```
