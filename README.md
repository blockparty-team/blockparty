## App Configuration
App configurations i coming from two sources: shared NX environment lib for Supabase credentials and the remaining config fetched from a app configuration table in Supabase.

### Environment lib
Supabase client id and key is loaded through the @blockparty/shared/environment lib, where devevlopment and production versions are created for each app. Remember to register file replacement in `project.json` file for the app e.g.:

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "libs/shared/enviroments/src/lib/distortion.dev.ts",
        "with": "libs/shared/enviroments/src/lib/distortion.prod.ts"
      }
    ]
  }
  
}
```

### App config table (from Supabase)
App config such as map, OneSignal, feature toggles and others are loaded from supabase the `app_config` table when app in initializing.


```json
{
  "map": {
    "view": {
      "zoom": 11.5,
      "pitch": 35,
      "center": [
        12.57632,
        55.68215
      ]
    },
    "styleUrl": "https://api.maptiler.com/maps/<MAPID>/style.json?key=<YOUR_KEY>"
  },
  "festival": {
    "url": "http://localhost:8100",
    "name": "Blockparty Festival"
  },
  "featureToggle": {
    "enableLogin": false
  },
  "oneSignalAppId": "<ONE_SIGNAL_ID>"
}
```
