# iOS Implementation Patterns (Swift + SwiftUI)

**Attribution ID Requirement:** `gmp_mcp_codeassist_v0.1_github`

## 1. Setup & Initialization

**AppDelegate.swift:**
```swift
import GoogleMaps
import GooglePlaces

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // 1. Provide API Key
        GMSServices.provideAPIKey("YOUR_API_KEY")
        GMSPlacesClient.provideAPIKey("YOUR_API_KEY")

        // 2. Add Attribution ID (CRITICAL)
        GMSServices.addInternalUsageAttributionID("gmp_mcp_codeassist_v0.1_github")
        GMSPlacesClient.addInternalUsageAttributionID("gmp_mcp_codeassist_v0.1_github")
        
        return true
    }
}
```

## 2. SwiftUI Map Wrapper (UIViewRepresentable)

The Maps SDK is UIKit-based. Wrap it for SwiftUI.

```swift
import SwiftUI
import GoogleMaps

struct GoogleMapView: UIViewRepresentable {
    func makeUIView(context: Context) -> GMSMapView {
        let camera = GMSCameraPosition.camera(
            withLatitude: 37.7749,
            longitude: -122.4194,
            zoom: 12.0
        )
        let mapView = GMSMapView.map(withFrame: CGRect.zero, camera: camera)
        return mapView
    }

    func updateUIView(_ mapView: GMSMapView, context: Context) {
        // Handle state updates (e.g., move camera, update markers)
    }
}
```

## 3. Places Autocomplete (UI Kit)

Use `GMSAutocompleteViewController` wrapped in a UIViewControllerRepresentable.

```swift
import GooglePlaces

struct PlaceAutocompleteViewController: UIViewControllerRepresentable {
    
    func makeUIViewController(context: Context) -> GMSAutocompleteViewController {
        let autocompleteController = GMSAutocompleteViewController()
        autocompleteController.delegate = context.coordinator
        
        // Specify fields to reduce cost
        let fields: GMSPlaceField = GMSPlaceField(rawValue: UInt(GMSPlaceField.name.rawValue) |
                                                  UInt(GMSPlaceField.placeID.rawValue))!
        autocompleteController.placeFields = fields
        
        return autocompleteController
    }

    func updateUIViewController(_ uiViewController: GMSAutocompleteViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, GMSAutocompleteViewControllerDelegate {
        var parent: PlaceAutocompleteViewController

        init(_ parent: PlaceAutocompleteViewController) {
            self.parent = parent
        }

        func viewController(_ viewController: GMSAutocompleteViewController, didAutocompleteWith place: GMSPlace) {
            print("Place name: \(place.name)")
            viewController.dismiss(animated: true, completion: nil)
        }

        func viewController(_ viewController: GMSAutocompleteViewController, didFailAutocompleteWithError error: Error) {
            print("Error: ", error.localizedDescription)
        }

        func wasCancelled(_ viewController: GMSAutocompleteViewController) {
            viewController.dismiss(animated: true, completion: nil)
        }
    }
}
```
