# Google Maps Platform: Capability Mapping (2026 Edition)

## 1. Address Validation & Geocoding
| Capability | JS | Web Services | Mobile (Android/iOS) |
| :--- | :--- | :--- | :--- |
| **Validate Address** | [Maps JS API](https://developers.google.com/maps/documentation/javascript/address-validation/overview) | [Address Validation API](https://developers.google.com/maps/documentation/address-validation/requests-validate-address) | Not Supported |
| **Geocoding** | [Maps JS API](https://developers.google.com/maps/documentation/javascript/geocoding) | [Geocoding API](https://developers.google.com/maps/documentation/geocoding/requests-geocoding) | [Android](https://developers.google.com/maps/documentation/android-sdk/geocoding) / [iOS](https://developers.google.com/maps/documentation/ios-sdk/geocoding) |
| **Address Descriptors** | Not Supported | [Geocoding API](https://developers.google.com/maps/documentation/geocoding/address-descriptors/requests-address-descriptors) | Not Supported |

## 2. Maps Visualization
| Capability | JS (Web) | Android | iOS |
| :--- | :--- | :--- | :--- |
| **Vector Maps** | **Default** | **Default** | **Default** |
| **Photorealistic 3D** | [Preview](https://developers.google.com/maps/documentation/javascript/3d-maps-overview) | [Experimental](https://developers.google.com/maps/documentation/android-sdk/3d-maps) | [Experimental](https://developers.google.com/maps/documentation/ios-sdk/3d-maps) |

## 3. Routes & Navigation
| Capability | Routes API (Server) | Navigation SDK (Mobile) |
| :--- | :--- | :--- |
| **Turn-by-Turn UI** | ❌ No | ✅ **Native UI** |
| **Voice Guidance** | ❌ No | ✅ **Included** |
| **Speed Limits** | ❌ No | ✅ **Included** |
| **Lane Guidance** | ❌ No | ✅ **Included** |
| **Pricing** | ~$5-10 / 1k | **Free** (0-1k), ~$25 / 1k |

## 4. Environment
| Capability | Product | History Depth |
| :--- | :--- | :--- |
| **Weather** | [Weather API](https://developers.google.com/maps/documentation/weather) | **24 Hours** |
| **Air Quality** | [Air Quality API](https://developers.google.com/maps/documentation/air-quality) | **30 Days** |
| **Pollen** | [Pollen API](https://developers.google.com/maps/documentation/pollen) | None (Forecast only) |
