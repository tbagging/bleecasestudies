import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const formData = await req.json();
    
    console.log('Contact form submission received:', {
      timestamp: new Date().toISOString(),
      data: formData
    });

    // Forward the form data to Make.com webhook
    const makeWebhookUrl = 'https://hook.us2.make.com/fdasjp9j89mg2mwo5l5vmh98bcjktug3';
    
    console.log('Attempting to send to Make.com webhook:', makeWebhookUrl);
    
    const makeResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Supabase-Edge-Function',
      },
      body: JSON.stringify(formData)
    });

    console.log('Make.com response status:', makeResponse.status);
    console.log('Make.com response statusText:', makeResponse.statusText);

    if (!makeResponse.ok) {
      const responseText = await makeResponse.text();
      console.log('Make.com error response:', responseText);
      
      // Return a more specific error response instead of throwing
      return new Response(
        JSON.stringify({ 
          error: 'Webhook delivery failed',
          message: `Make.com returned ${makeResponse.status}: ${responseText || makeResponse.statusText}`,
          status: makeResponse.status,
          details: responseText
        }),
        {
          status: 400, // Use 400 instead of 500 for webhook delivery issues
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Successfully forwarded to Make.com:', makeResponse.status);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})