# Getting Started: The "Zero to One" Guide

## 🚀 Quick Links (Direct Action)

Use these "Magic Links" to skip navigation steps in the Google Cloud Console.

| Action | Direct Link |
| :--- | :--- |
| **1. Create Project & Account** | [**Start Here (Setup Wizard)**](https://console.cloud.google.com/google/maps-apis/start) |
| **2. Enable Maps JS API** | [Enable Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com) |
| **3. Enable Places API (New)** | [Enable Places API (New)](https://console.cloud.google.com/apis/library/places-backend.googleapis.com) |
| **4. Enable Routes API** | [Enable Routes API](https://console.cloud.google.com/apis/library/routes.googleapis.com) |
| **5. Get API Key** | [**Create/View Credentials**](https://console.cloud.google.com/google/maps-apis/credentials) |

---

## Phase 1: Account & Key Generation (The Console)

1.  **Go to Google Cloud Console:**
    *   Click the **Start Here** link above.
    *   **Note:** You *must* have a Billing Account attached to your project, even to use the free monthly tier (Essentials).

2.  **Create a Project:**
    *   Select **"New Project"**. Name it (e.g., `gmp-store-locator`).

3.  **Generate an API Key:**
    *   Go to **Keys & Credentials** (or use the link above).
    *   Click **Create Credentials** > **API Key**.
    *   **Copy this key.** You will need it for your code.

4.  **Secure Your Key (Critical):**
    *   Click the pencil icon/name of your new API Key.
    *   **Application Restrictions:**
        *   **Web:** Select "Websites" -> Add `localhost:3000` (for dev) and `yourdomain.com/*` (for prod).
        *   **Android:** Select "Android apps" -> Add Package Name + SHA-1 Fingerprint.
        *   **iOS:** Select "iOS apps" -> Add Bundle ID.
    *   **API Restrictions:** Select "Restrict key" -> Check ONLY the APIs you are using (e.g., "Maps JavaScript API", "Places API (New)").

## Phase 2: Enable the Right APIs (The Library)

If you didn't use the direct links above, navigate to **APIs & Services > Library** and search for the specific products:

*   **For Web Maps:** Search **"Maps JavaScript API"** -> Enable.
*   **For Place Search:** Search **"Places API (New)"** -> Enable. (Do *not* enable "Places API" legacy unless necessary).
*   **For Routing:** Search **"Routes API"** -> Enable.

## Phase 3: Using Your Key in Code

**Rule:** Never commit your API key to Git.

### Option A: Quick Prototyping (Local Only)
Replace `YOUR_API_KEY` in the template code directly, but **do not commit** the file.

### Option B: Environment Variables (Recommended)

**React (.env.local):**
1.  Create `.env.local` in your root.
2.  Add: `REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSy...`
3.  In code: `apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`

**Android (local.properties):**
1.  Open `local.properties` (this file is gitignored).
2.  Add: `MAPS_API_KEY=AIzaSy...`
3.  In `AndroidManifest.xml`:
    ```xml
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="${MAPS_API_KEY}" />
    ```

**iOS (Config.xcconfig):**

1.  Create a configuration file (gitignored).

2.  Add: `MAPS_API_KEY = AIzaSy...`

3.  Read from `Bundle.main.infoDictionary`.



---



## Phase 4: Power User Setup (MCP)



If you are using tools like **Gemini CLI** or **Claude Code**, you should install the **Google Maps Platform Code Assist MCP**. 



This allows your AI agent to fetch up-to-date documentation and code samples directly from Google.



👉 **See the [MCP Installation Guide](./mcp-guide.md) for quick install commands.**
