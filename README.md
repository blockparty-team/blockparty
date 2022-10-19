### Push Notifications
OneSignal is for Notification
#### Web Puah
* Create an two apps on OneSignal - one for test and one for productions - and setup web push. Enable Local Testing option for the test app.
* Add the app ids to `environment.ts` and `environment.prod.ts`.

### Scripts
Often used scripts has been added to `package.json` for convenience. Run with `npm run <command>`:
* `update-types`: Update database definition Typescript Interface from local Supabase