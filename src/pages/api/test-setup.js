// src/pages/api/test-setup.js
// This is a diagnostic endpoint to verify your setup

export async function GET() {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        hasResendKey: !!import.meta.env.RESEND_API_KEY,
        keyPrefix: import.meta.env.RESEND_API_KEY?.substring(0, 3),
        keyLength: import.meta.env.RESEND_API_KEY?.length,
        mode: import.meta.env.MODE,
        dev: import.meta.env.DEV,
        prod: import.meta.env.PROD,
      },
      server: {
        platform: process.platform,
        nodeVersion: process.version,
      }
    };
  
    return new Response(JSON.stringify(diagnostics, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  export async function POST({ request }) {
    try {
      const body = await request.json();
      return new Response(JSON.stringify({
        success: true,
        received: body,
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Failed to parse request',
        message: error.message
      }, null, 2), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }