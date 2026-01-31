# Cross-Platform Support: Flutter & React Native

Google Maps Platform offers official support for modern cross-platform frameworks.

## 1. Flutter (Official)
**Main Repo:** [github.com/googlemaps/flutter-google-maps-packages](https://github.com/googlemaps/flutter-google-maps-packages)

Google maintains a monorepo containing packages for Maps, Places, and related utilities.

### Packages
*   **google_maps_flutter:** The core map widget.
    *   [Pub.dev](https://pub.dev/packages/google_maps_flutter)
    *   Supports: Markers, Polylines, Polygons, Tile Overlays.
*   **google_maps_flutter_android** / **google_maps_flutter_ios:** Platform implementations.
*   **google_places_flutter:** (Note: Often community maintained, check `flutter_google_places_sdk` for official wrapper or use HTTP directly for Places API New).

### Navigation SDK for Flutter
*   **Status:** Available!
*   **Repo:** [github.com/googlemaps/flutter-navigation-sdk](https://github.com/googlemaps/flutter-navigation-sdk)
*   **Docs:** [developers.google.com/maps/documentation/navigation/flutter](https://developers.google.com/maps/documentation/navigation/flutter)

---

## 2. React Native (Community & Official)
**Main Repo:** [github.com/react-native-maps/react-native-maps](https://github.com/react-native-maps/react-native-maps)

While `react-native-maps` is the standard community library, Google provides specific support for Navigation.

### Packages
*   **react-native-maps:** The de-facto standard for Map Visualization.
    *   Supports: Apple Maps (iOS) and Google Maps (iOS/Android).
    *   **Tip:** Use `provider={PROVIDER_GOOGLE}` to force Google Maps on iOS.

### Navigation SDK for React Native
*   **Status:** Available!
*   **Repo:** [github.com/googlemaps/react-native-navigation-sdk](https://github.com/googlemaps/react-native-navigation-sdk)
*   **Docs:** [developers.google.com/maps/documentation/navigation/react-native](https://developers.google.com/maps/documentation/navigation/react-native)
*   **Features:** Wraps the native Android/iOS Navigation SDKs for a full turn-by-turn experience in RN.

---

## 3. GitHub Quick Links Index

| Product | Language/Framework | Repository |
| :--- | :--- | :--- |
| **JS Samples** | JavaScript/TS | [googlemaps/js-api-samples](https://github.com/googlemaps/js-api-samples) |
| **React Components** | React (Web) | [googlemaps/react-wrapper](https://github.com/googlemaps/react-wrapper) |
| **Android Samples** | Kotlin | [googlemaps/android-samples](https://github.com/googlemaps/android-samples) |
| **iOS Samples** | Swift | [googlemaps/maps-sdk-for-ios-samples](https://github.com/googlemaps/maps-sdk-for-ios-samples) |
| **Flutter Maps** | Dart | [googlemaps/flutter-google-maps-packages](https://github.com/googlemaps/flutter-google-maps-packages) |
| **Flutter Nav** | Dart | [googlemaps/flutter-navigation-sdk](https://github.com/googlemaps/flutter-navigation-sdk) |
| **React Native Nav** | JS/TS | [googlemaps/react-native-navigation-sdk](https://github.com/googlemaps/react-native-navigation-sdk) |
| **Node.js Client** | Node.js | [googlemaps/google-maps-services-js](https://github.com/googlemaps/google-maps-services-js) |
| **Python Client** | Python | [googlemaps/google-maps-services-python](https://github.com/googlemaps/google-maps-services-python) |
