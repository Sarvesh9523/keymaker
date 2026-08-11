import nodemailer from 'nodemailer';

/**
 * Send Transactional Email
 * Tries Brevo HTTP REST API v3 first (no host/port timeouts).
 * Falls back to Nodemailer SMTP if API returns an error or if SMTP credentials are used.
 */
const sendBrevoEmail = async ({ to, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
  const senderEmail = process.env.EMAIL_FROM || 'no-reply@keymaker.com';
  const senderName = process.env.EMAIL_SENDER_NAME || 'Sanjiv Keymaker';

  if (!apiKey) {
    console.warn('[Email Service Warning] Neither BREVO_API_KEY nor SMTP credentials configured. Email skipped.');
    return false;
  }

  // 1. Always attempt Brevo HTTP REST API v3 first
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Email Service] Sent via Brevo REST API v3. Message ID:', data.messageId);
      return true;
    }

    const errorData = await response.json().catch(() => ({}));
    console.warn('[Email Service] Brevo REST API returned:', response.status, errorData.message || errorData);
  } catch (err) {
    console.error('[Email Service Error] Brevo REST API fetch failed:', err.message);
  }

  // 2. Fallback to Nodemailer SMTP
  try {
    const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || process.env.EMAIL_FROM || senderEmail;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user,
        pass: apiKey,
      },
    });

    await transporter.sendMail({
      from: { name: senderName, address: senderEmail },
      sender: { name: senderName, email: senderEmail },
      to,
      subject,
      html: htmlContent,
    });

    console.log('[Email Service] Sent successfully via SMTP Fallback.');
    return true;
  } catch (err) {
    console.error('[Email Service Error] SMTP fallback failed:', err.message);
    return false;
  }
};


/**
 * Send OTP Verification Email
 * @param {string} email
 * @param {string} otp
 * @param {string} purpose - 'admin_registration' | 'client_query'
 */
export const sendOtpEmail = async (email, otp, purpose) => {
  const title = purpose === 'admin_registration' ? 'Admin Registration OTP' : 'Client Query Verification OTP';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #dbeafe; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">KeyMaker ${title}</h2>
      <p style="color: #475569; font-size: 14px;">Your 6-digit email verification code is:</p>
      <div style="background-color: #eff6ff; border: 2px dashed #2563eb; font-size: 32px; font-weight: bold; color: #1e3a8a; text-align: center; padding: 16px; margin: 20px 0; border-radius: 8px; letter-spacing: 6px;">
        ${otp}
      </div>
      <p style="color: #64748b; font-size: 12px;">This OTP will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
    </div>
  `;

  await sendBrevoEmail({
    to: email,
    subject: `[KeyMaker] ${otp} is your ${title}`,
    htmlContent,
  });
};

/**
 * Send Confirmation Ticket Email after query submission
 * @param {string} email
 * @param {string} name
 * @param {string} ticketId
 * @param {string} subject
 * @param {string} message
 */
export const sendQueryTicketEmail = async (email, name, ticketId, subject, message) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #dbeafe; border-radius: 12px; background-color: #ffffff;">
      <div style="background-color: #2563eb; padding: 16px 24px; border-radius: 8px 8px 0 0; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px;">KeyMaker Support - Query Received</h2>
      </div>
      <div style="padding: 20px 0;">
        <p style="color: #1e293b; font-size: 15px;">Hello <strong>${name}</strong>,</p>
        <p style="color: #475569; font-size: 14px;">Thank you for reaching out to us! Your query has been verified and registered. Below is your official support ticket confirmation:</p>
        
        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #854d0e; text-transform: uppercase; font-weight: bold;">Ticket Confirmation ID</p>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1e3a8a;">${ticketId}</p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569;"><strong>Subject:</strong> ${subject}</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #475569;"><strong>Message Summary:</strong></p>
          <p style="margin: 0; font-size: 13px; color: #1e293b; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="color: #64748b; font-size: 13px; margin-top: 20px;">Our support team is reviewing your ticket and will update you via email soon.</p>
      </div>
    </div>
  `;

  await sendBrevoEmail({
    to: email,
    subject: `[KeyMaker Ticket ${ticketId}] Confirmation of your query: ${subject}`,
    htmlContent,
  });
};

