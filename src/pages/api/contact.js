// src/pages/api/contact.js
import { Resend } from 'resend';

// In Astro, use import.meta.env for environment variables
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }) {
  // Add CORS headers if needed
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    // Parse the request body
    const data = await request.json();
    
    const {
      'full-name': fullName,
      'email': email,
      'phone': phone,
      'commitment-level': commitmentLevel,
      'trip-selection': tripSelection,
      'availability': availability,
      'comments': comments,
      'timestamp': timestamp,
      'source': source,
      'page_url': pageUrl
    } = data;

    // Validate required fields
    if (!fullName || !email || !commitmentLevel || !tripSelection) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: {
            fullName: !fullName ? 'missing' : 'ok',
            email: !email ? 'missing' : 'ok',
            commitmentLevel: !commitmentLevel ? 'missing' : 'ok',
            tripSelection: !tripSelection ? 'missing' : 'ok'
          }
        }), 
        {
          status: 400,
          headers
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }), 
        {
          status: 400,
          headers
        }
      );
    }

    // Check if API key exists
    if (!import.meta.env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }), 
        {
          status: 500,
          headers
        }
      );
    }

    // Format commitment level for display
    const commitmentDisplay = {
      'committed': '100% Committed - Ready to Book',
      'interested': 'Very Interested - Wants More Details',
      'exploring': 'Just Exploring - Early Research'
    }[commitmentLevel] || commitmentLevel;

    // Format trip selection for display
    const tripDisplay = {
      'living-traditions': 'The Living Traditions Trail (Jan 22 – Feb 5, 2025)',
      'mysore-mystique': 'The Spirit of Karnataka (Feb 16 – Mar 2, 2025)',
      'sacred-waters': 'The Sacred Water Odyssey (Dec 30, 2025 – Jan 13, 2026)',
      'custom': 'Custom Journey - Let\'s create something unique'
    }[tripSelection] || tripSelection;

    // Send email via Resend
    try {
      const { data: emailData, error: resendError } = await resend.emails.send({
        from: 'Lakshmi Trails <bookings@lakshmitrails.com>',
        to: ['peter@lakshmitrails.com'],
        reply_to: email,
        subject: `New Sacred Inquiry from ${fullName} - ${commitmentDisplay}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              h2 { color: #B8941F; border-bottom: 2px solid #B8941F; padding-bottom: 10px; }
              .field { margin: 15px 0; }
              .label { font-weight: bold; color: #666; }
              .value { margin-left: 10px; color: #333; }
              .commitment-high { color: #28a745; font-weight: bold; }
              .commitment-medium { color: #ffc107; font-weight: bold; }
              .commitment-low { color: #6c757d; }
              .comments { background: #f8f9fa; padding: 15px; border-left: 3px solid #B8941F; margin: 20px 0; }
              .metadata { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>🕉️ New Sacred Journey Inquiry</h2>
              
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${fullName}</span>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${email}">${email}</a></span>
              </div>
              
              ${phone ? `
              <div class="field">
                <span class="label">Phone/WhatsApp:</span>
                <span class="value">${phone}</span>
              </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Commitment Level:</span>
                <span class="value ${commitmentLevel === 'committed' ? 'commitment-high' : commitmentLevel === 'interested' ? 'commitment-medium' : 'commitment-low'}">
                  ${commitmentDisplay}
                </span>
              </div>
              
              <div class="field">
                <span class="label">Trip Selection:</span>
                <span class="value"><strong>${tripDisplay}</strong></span>
              </div>
              
              ${availability ? `
              <div class="field">
                <span class="label">Best Time to Contact:</span>
                <span class="value">${availability}</span>
              </div>
              ` : ''}
              
              ${comments ? `
              <div class="comments">
                <div class="label">What draws them to this journey:</div>
                <p>${comments.replace(/\n/g, '<br>')}</p>
              </div>
              ` : ''}
              
              <div class="metadata">
                <div><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</div>
                <div><strong>Source:</strong> ${source}</div>
                <div><strong>Page:</strong> <a href="${pageUrl}">${pageUrl}</a></div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          New Sacred Journey Inquiry
          
          Name: ${fullName}
          Email: ${email}
          Phone: ${phone || 'Not provided'}
          Commitment Level: ${commitmentDisplay}
          Trip Selection: ${tripDisplay}
          Best Time to Contact: ${availability || 'Not specified'}
          
          What draws them to this journey:
          ${comments || 'No additional comments'}
          
          ---
          Submitted: ${new Date(timestamp).toLocaleString()}
          Source: ${source}
          Page: ${pageUrl}
        `
      });

      if (resendError) {
        return new Response(
          JSON.stringify({ 
            error: 'Failed to send email',
            details: resendError.message || 'Unknown error'
          }), 
          {
            status: 400,
            headers
          }
        );
      }

      // Success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Your inquiry has been sent successfully!',
          id: emailData?.id 
        }), 
        {
          status: 200,
          headers
        }
      );

    } catch (resendError) {
      return new Response(
        JSON.stringify({ 
          error: 'Email service error',
          details: resendError.message 
        }), 
        {
          status: 500,
          headers
        }
      );
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }), 
      {
        status: 500,
        headers
      }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }), 
    {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}