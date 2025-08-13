// src/pages/api/test.js
// Simple debug endpoint to test if API routes work

export async function GET() {
    return new Response(JSON.stringify({ 
      message: "GET endpoint works!",
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  export async function POST({ request }) {
    try {
      // Log request details
      console.log('Request received at:', new Date().toISOString());
      console.log('Request method:', request.method);
      console.log('Request headers:', Object.fromEntries(request.headers.entries()));
      
      // Try to get the body as text first
      const bodyText = await request.text();
      console.log('Raw body:', bodyText);
      console.log('Body length:', bodyText.length);
      
      // Try to parse it
      let bodyJson;
      try {
        bodyJson = JSON.parse(bodyText);
        console.log('Parsed body:', bodyJson);
      } catch (parseError) {
        console.log('Failed to parse body:', parseError.message);
        return new Response(JSON.stringify({ 
          error: "Invalid JSON",
          received: bodyText,
          parseError: parseError.message
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        message: "POST endpoint works!",
        received: bodyJson,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } catch (error) {
      console.error('Error in test endpoint:', error);
      return new Response(JSON.stringify({ 
        error: "Internal server error",
        details: error.message,
        stack: error.stack
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }