import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with service role for bypassing RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      user_id, 
      type, 
      title, 
      body, 
      link_url, 
      image_url, 
      metadata 
    } = await req.json();

    if (!user_id || !type || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, type, title, body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert notification using service role (bypasses RLS)
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id,
        type,
        title,
        body,
        link_url: link_url || null,
        image_url: image_url || null,
        metadata: metadata || {}
      });

    if (notificationError) {
      console.error('Notification error:', notificationError);
      throw notificationError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
