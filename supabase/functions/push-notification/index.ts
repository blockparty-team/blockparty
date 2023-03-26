// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as OneSignal from 'https://esm.sh/@onesignal/node-onesignal@1.0.0-beta9'

const _OnesignalAppId_ = Deno.env.get('ONESIGNAL_APP_ID')!
const _OnesignalUserAuthKey_ = Deno.env.get('ONESIGNAL_USER_AUTH_KEY')!
const _OnesignalRestApiKey_ = Deno.env.get('ONESIGNAL_REST_API_KEY')!
const configuration = OneSignal.createConfiguration({
  userKey: _OnesignalUserAuthKey_,
  appKey: _OnesignalRestApiKey_,
})

const onesignal = new OneSignal.DefaultApi(configuration)

serve(async (req) => {
  try {
    const payload: OneSignal.Notification = await req.json();

    const onesignalApiRes = await send_push_http(payload);
    // const onesignalApiRes = await send_push_os(payload);

    return new Response(JSON.stringify({ oneSignalResponse: onesignalApiRes }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Failed to create OneSignal notification', error)

    return new Response('Push failed', {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

const send_push_http = async (payload: OneSignal.Notification) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Basic ${_OnesignalRestApiKey_}`);

  const raw = JSON.stringify(payload);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: headers,
    body: raw,
  };

  const res = await fetch('https://onesignal.com/api/v1/notifications', requestOptions);
  const json = await res.json()

  return json;
}

const send_push_oslib = async (payload: OneSignal.Notification) => {
  const notification = new OneSignal.Notification();
  notification.app_id = _OnesignalAppId_;
  notification.include_external_user_ids = payload.include_external_user_ids;
  notification.headings = payload.headings;
  notification.contents = payload.contents;
  notification.url = payload.url
  
  return await onesignal.createNotification(notification)
}