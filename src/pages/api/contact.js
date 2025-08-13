// src/pages/api/contact.js - Fixed version
import { Resend } from 'resend';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize Resend here (not at module level)
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const {
      'commitment-level': commitmentLevel,
      'trip-selection': tripSelection,
      'full-name': fullName,
      email,
      phone,
      availability,
      comments,
      timestamp,
      source,
      page_url: pageUrl
    } = req.body;

    // Basic validation
    if (!fullName || !email || !commitmentLevel || !tripSelection) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, commitment level, and trip selection are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Format the email content
    const emailContent = `
      <h2>New Sacred Journey Inquiry from Lakshmi Trails</h2>
      
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone/WhatsApp:</strong> ${phone}</p>` : ''}
      ${availability ? `<p><strong>Best time to contact:</strong> ${availability}</p>` : ''}
      
      <h3>Journey Details</h3>
      <p><strong>Commitment Level:</strong> ${commitmentLevel}</p>
      <p><strong>Selected Journey:</strong> ${tripSelection}</p>
      
      ${comments ? `
        <h3>Personal Message</h3>
        <p><strong>What draws them to this journey:</strong></p>
        <p>${comments.replace(/\n/g, '<br>')}</p>
      ` : ''}
      
      <h3>Technical Details</h3>
      <p><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString('en-US', { 
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      <p><strong>Source:</strong> ${source}</p>
      <p><strong>Page:</strong> <a href="${pageUrl}">${pageUrl}</a></p>
    `;

    // Send email to you
    const emailToOwner = await resend.emails.send({
      from: 'Lakshmi Trails Website <noreply@lakshmitrails.com>',
      to: ['peter@lakshmitrails.com'],
      subject: `New Journey Inquiry: ${fullName} - ${tripSelection}`,
      html: emailContent,
      replyTo: email // So you can reply directly to the customer
    });

    // Send confirmation email to customer
    const customerEmailContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #B8941F; text-align: center;">Thank You for Your Sacred Inquiry</h2>
        
        <p>Dear ${fullName},</p>
        
        <p>We've received your inquiry about <strong>${tripSelection}</strong> and are honored that you're considering this transformational journey with us.</p>
        
        <div style="background: #E8E4E0; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="color: #B8941F; margin-top: 0;">What happens next:</h3>
          <ul style="line-height: 1.6;">
            <li><strong>Within 24 hours:</strong> Piotr will personally respond with detailed information about your selected journey</li>
            <li><strong>Personal consultation:</strong> We'll schedule a call to discuss your intentions and answer any questions</li>
            <li><strong>Customized experience:</strong> Based on our conversation, we'll tailor the journey to your personal transformation goals</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to explore more about our approach to authentic cultural immersion and wellness transformation on our website.</p>
        
        <p style="font-style: italic; color: #B8941F;">"Every journey begins with a single step toward transformation. Thank you for taking that step with us."</p>
        
        <p>With gratitude,<br>
        <strong>Piotr & the Lakshmi Trails Team</strong></p>
        
        <hr style="border: none; border-top: 1px solid #D4AF37; margin: 30px 0;">
        
        <div style="font-size: 14px; color: #666; text-align: center;">
          <p>Lakshmi Trails | Authentic Cultural Journeys to South India's Sacred Heart</p>
          <p>If you have any immediate questions, reply to this email or contact us directly.</p>
        </div>
      </div>
    `;

    const customerEmail = await resend.emails.send({
      from: 'Piotr from Lakshmi Trails <peter@lakshmitrails.com>',
      to: [email],
      subject: 'Your Sacred Journey Inquiry - We\'ll be in touch within 24 hours',
      html: customerEmailContent
    });

    console.log('Emails sent:', { 
      owner: emailToOwner.data?.id, 
      customer: customerEmail.data?.id 
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Your sacred inquiry has been received. We\'ll respond within 24 hours with personalized information about your transformational journey.' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again or contact us directly at peter@lakshmitrails.com',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}