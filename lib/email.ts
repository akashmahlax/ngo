/**
 * Email Utility for Password Resets and Notifications
 * 
 * This is a template/example for production email sending.
 * You can integrate with services like:
 * - Resend (https://resend.com)
 * - SendGrid
 * - AWS SES
 * - Mailgun
 * - Nodemailer
 * 
 * For development, emails are logged to console.
 * For production, uncomment and configure your preferred email service.
 */

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Send an email using your configured email service
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Development mode - log to console
  if (process.env.NODE_ENV === "development") {
    console.log("📧 EMAIL (DEV MODE)")
    console.log("To:", options.to)
    console.log("Subject:", options.subject)
    console.log("HTML:", options.html)
    console.log("Text:", options.text || "N/A")
    console.log("-".repeat(80))
    return
  }

  // Production mode - use real email service
  // Example with Resend (recommended):
  /*
  const { Resend } = await import("resend")
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })
  */

  // Example with Nodemailer:
  /*
  const nodemailer = await import("nodemailer")
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })
  */

  console.warn("⚠️ Email service not configured. Email not sent in production mode.")
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
  const expiryMinutes = 60 // 1 hour

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">
              ${resetUrl}
            </p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong>
              <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                <li>This link will expire in ${expiryMinutes} minutes</li>
                <li>If you didn't request this, you can safely ignore this email</li>
                <li>Your password won't change until you create a new one</li>
              </ul>
            </div>
            <p>If you're having trouble clicking the button, copy and paste the URL into your web browser.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
Password Reset Request

Hi there,

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in ${expiryMinutes} minutes.

If you didn't request this, you can safely ignore this email. Your password won't change until you create a new one.

---
This is an automated message, please do not reply to this email.
© ${new Date().getFullYear()} Your Company. All rights reserved.
  `

  await sendEmail({
    to: email,
    subject: "Reset Your Password",
    html,
    text,
  })
}

/**
 * Send email verification email (for future implementation)
 */
export async function sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Welcome!</h1>
          </div>
          <div class="content">
            <p>Thanks for signing up! Please verify your email address to get started:</p>
            <center>
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </center>
          </div>
        </div>
      </body>
    </html>
  `

  await sendEmail({
    to: email,
    subject: "Verify Your Email Address",
    html,
    text: `Thanks for signing up! Please verify your email: ${verificationUrl}`,
  })
}

/**
 * Send welcome email after successful signup
 */
export async function sendWelcomeEmail(email: string, name: string, role: "volunteer" | "ngo"): Promise<void> {
  const dashboardUrl = `${process.env.NEXTAUTH_URL}/${role}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome!</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; }
          .content { background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%); color: white !important; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome, ${name}!</h1>
          </div>
          <div class="content">
            <p>We're excited to have you join our community as a ${role === "volunteer" ? "Volunteer" : "NGO"}!</p>
            <p>Get started by exploring your dashboard:</p>
            <center>
              <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
            </center>
          </div>
        </div>
      </body>
    </html>
  `

  await sendEmail({
    to: email,
    subject: "Welcome to Our Platform!",
    html,
    text: `Welcome, ${name}! Get started: ${dashboardUrl}`,
  })
}
