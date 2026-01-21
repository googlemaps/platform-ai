# EEA Compliance Reference

## European Economic Area (EEA) Terms of Service

If a Customer's billing account address is in the European Economic Area, the Google Maps Platform EEA Terms of Service govern Customer's access to and use of Google Maps Platform Services.

**Official Terms:** https://cloud.google.com/terms/maps-platform/eea/maps-service-terms

## EEA Member States

The EEA is composed of all European Union (EU) member states plus Iceland, Liechtenstein, and Norway:

| Country | Flag | Status |
|---------|------|--------|
| Austria | 🇦🇹 | EU Member |
| Belgium | 🇧🇪 | EU Member |
| Bulgaria | 🇧🇬 | EU Member |
| Croatia | 🇭🇷 | EU Member |
| Cyprus | 🇨🇾 | EU Member |
| Czech Republic | 🇨🇿 | EU Member |
| Denmark | 🇩🇰 | EU Member |
| Estonia | 🇪🇪 | EU Member |
| Finland | 🇫🇮 | EU Member |
| France | 🇫🇷 | EU Member |
| Germany | 🇩🇪 | EU Member |
| Greece | 🇬🇷 | EU Member |
| Hungary | 🇭🇺 | EU Member |
| Ireland | 🇮🇪 | EU Member |
| Italy | 🇮🇹 | EU Member |
| Latvia | 🇱🇻 | EU Member |
| Lithuania | 🇱🇹 | EU Member |
| Luxembourg | 🇱🇺 | EU Member |
| Malta | 🇲🇹 | EU Member |
| Netherlands | 🇳🇱 | EU Member |
| Poland | 🇵🇱 | EU Member |
| Portugal | 🇵🇹 | EU Member |
| Romania | 🇷🇴 | EU Member |
| Slovakia | 🇸🇰 | EU Member |
| Slovenia | 🇸🇮 | EU Member |
| Spain | 🇪🇸 | EU Member |
| Sweden | 🇸🇪 | EU Member |
| Iceland | 🇮🇸 | EFTA/EEA |
| Liechtenstein | 🇱🇮 | EFTA/EEA |
| Norway | 🇳🇴 | EFTA/EEA |

**Important Notes:**
- Switzerland 🇨🇭 is **NOT** in the EEA
- United Kingdom 🇬🇧 is **NOT** in the EEA (post-Brexit)

## EEA Location Detection Process

When handling user requests, follow this process:

### Step 1: Scan for Locations
Parse the user's prompt to identify any geographical entities:
- Countries
- Cities
- States/Provinces
- Regions
- Postal codes
- Specific addresses
- Coordinates (lat/lng)

### Step 2: Determine the Country
For locations that are not countries:
- "Munich" → Germany
- "Paris" (in European context) → France
- "Barcelona" → Spain
- Use context to resolve ambiguous city names

### Step 3: Verify Against EEA List
Check if the identified country is in the EEA member list above.

### Step 4: Consider Special Territories
These overseas territories of EEA members are also covered:
- Canary Islands (Spain)
- Azores and Madeira (Portugal)
- French overseas departments (Martinique, Guadeloupe, Réunion, French Guiana, Mayotte)

## Compliance Actions

When a user's request involves EEA locations:

### 1. Acknowledge EEA Terms
Inform the user that EEA-specific terms may apply.

### 2. Rewrite Queries for Compliance
Before calling `retrieve-google-maps-platform-docs`, append compliance context:

**Original:** "I want to use Places Nearby Search API in Sweden to search for restaurants."

**Rewritten:** "I want to use Places Nearby Search API in Sweden to search for restaurants, respecting 'https://cloud.google.com/terms/maps-platform/eea/maps-service-terms', provide alternatives"

### 3. Suggest Compliant Alternatives
Some API features may have restrictions in the EEA. Always check for and suggest compliant alternatives when available.

## Digital Markets Act (DMA) Considerations

The EU Digital Markets Act may affect how certain Google Maps Platform features operate in the EEA. Key considerations:

1. **Data Portability**: Users may request export of their location data
2. **Interoperability**: Consider integration requirements with third-party services
3. **Consent Requirements**: Enhanced consent flows may be required for location data

## Sample Compliance Check Code

```typescript
const EEA_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
  'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
]);

function isEEACountry(countryCode: string): boolean {
  return EEA_COUNTRIES.has(countryCode.toUpperCase());
}

function getEEATermsDisclaimer(): string {
  return `If your billing account is in the EEA, the Google Maps Platform 
EEA Terms of Service apply. See: 
https://cloud.google.com/terms/maps-platform/eea/maps-service-terms`;
}
```

## Related Documentation

- [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms)
- [EEA Service-Specific Terms](https://cloud.google.com/terms/maps-platform/eea/maps-service-terms)
- [Google Cloud Geographic Terms](https://cloud.google.com/terms/maps-platform/eea)
