import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5"
import OpenAI from "https://deno.land/x/openai@v4.20.0/mod.ts";

interface ArtistRaw {
  id: string
  name: string
  description: string
  country: string
  timetable: {
    name: string
    event: {
      name: string
    }
  }[]
}

interface Artist extends Omit<ArtistRaw, 'timetable'> {
  stages: string
  events: string
}

const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_KEY') ?? ''
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

serve(async () => {


  const { data, error } = await supabaseClient
    .from('artist')
    .select(`
      id, 
      name,
      description, 
      country, 
      timetable(
        ...stage(
          name,
          event(
            name
          )
        )
      )`
    )
    .not('description', 'is', null)
    //.is('embedding_input', 'null')
    .returns<ArtistRaw[]>()

  if (!data || error) throw new Error(error?.message ?? 'No data');

  // Flatten artist object
  const artists = data.map(artist => {
    const { timetable, ...rest } = artist

    const stages = timetable.map(stage => stage.name).join(' ')
    const events = timetable.flatMap(stage => stage.event.name).join(' ')

    return {
      ...rest,
      stages,
      events
    }
  })

  const filtered = artists//.filter(artist => artist.name.includes('Moodymann'))

  for (const artist of filtered) {

    const prompt = createChatPrompt(artist)
    const promptResponse = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const artistInfo = artistDescription(artist);
    const chatReponse = promptResponse.choices[0].message.content

    const embeddingInput = `${artistInfo} ${chatReponse}`.replace(/\n/g, ' ')

    const embedding = await createEmbedding(embeddingInput);

    await supabaseClient
      .from('artist')
      .update({ embedding, embedding_input: embeddingInput })
      .eq('id', artist.id)
  }


  return new Response(
    JSON.stringify(artists),
    { headers: { "Content-Type": "application/json" } },
  )
})

async function createEmbedding(input: string): Promise<number[]> {

  const res = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input
  })

  return res.data[0].embedding
}


function createChatPrompt(artist: Artist): string {

  const context = `
    I'm creating an app for "Distortion Festival" in Copenhagen, Denmark where I want you to enrich music artist information. I'm using this to create vector embeddings for artist similarity search, so it is not exposed to the user. 
    Reply with:
    * at leat four or more common music genre tags. 
    * Additional information about the artist, which is not already covered in the "Description" below - DO NOT FORGET THIS!!.
  `

  const prompt = `
    ${context}

    ${artistDescription(artist)}
  `

  return prompt
}

function artistDescription(artist: Artist): string {
  return `
    Name: ${artist.name}
    Country: ${artist.country}
    Description: ${artist.description}
    Stage: ${artist.stages}
    Event: ${artist.events}  
  `
}