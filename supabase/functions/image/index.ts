// import { corsHeaders } from '../_shared/cors.ts'

// console.log(`Function "browser-with-cors" up and running!`)

// Deno.serve(async (req) => {
//   // This is needed if you're planning to invoke your function from a browser.
//   if (req.method === 'OPTIONS') {
//     return new Response('ok', { headers: corsHeaders })
//   }

//   try {
//     const { name } = await req.json()
//     const data = {
//       message: `Hello ${name}!`,
//     }

//     return new Response(JSON.stringify(data), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       status: 200,
//     })
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       status: 400,
//     })
//   }
// })

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // Get the session or user object
  const { data } = await supabaseClient.auth.getUser()
  const user = data.user

  return new Response(JSON.stringify({ user }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })

})
