import nodemailer from "nodemailer";
import type { Order, QuoteRequest, ContactMessage } from "@/types/order";

export interface EmailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
  cid?: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Creates and returns an active email transporter.
 * Supports:
 * 1. Gmail App Password (GMAIL_USER & GMAIL_APP_PASSWORD) via secure SSL port 465
 * 2. Generic SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 */
export function getTransporter() {
  const gmailUser = process.env.GMAIL_USER ?? process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com";
  const rawPass = process.env.GMAIL_APP_PASSWORD;
  const gmailPass = rawPass ? rawPass.replace(/\s+/g, "").trim() : "";

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass: pass.replace(/\s+/g, "").trim() },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    });
  }

  return null;
}

/**
 * Sends an email via Gmail/SMTP, Resend API, or development fallback.
 */
export async function sendEmail(payload: EmailPayload): Promise<SendEmailResult> {
  const fromAddress =
    process.env.EMAIL_FROM ||
    (process.env.GMAIL_USER ? `"R&D by Reina" <${process.env.GMAIL_USER}>` : undefined) ||
    '"R&D by Reina" <rdbyreina@gmail.com>';

  // 1. Try Nodemailer (Gmail App Password or SMTP)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        attachments: payload.attachments,
      });
      console.info("[email:sent]", payload.subject, "→", payload.to, "MessageId:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: unknown) {
      console.error("[email:error] Failed to send email via SMTP/Gmail:", err);
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }

  // 2. Try Resend API if configured
  const resendKey = process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;
  if (resendKey && resendKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [payload.to],
          reply_to: payload.replyTo,
          subject: payload.subject,
          text: payload.text,
          html: payload.html,
          attachments: payload.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content ? (Buffer.isBuffer(a.content) ? a.content.toString("base64") : a.content) : undefined,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        console.info("[email:resend:sent]", payload.subject, "→", payload.to);
        return { success: true, messageId: data.id };
      } else {
        const errorText = await res.text();
        console.error("[email:resend:error]", errorText);
        return { success: false, error: `Resend error: ${errorText}` };
      }
    } catch (err: unknown) {
      console.error("[email:resend:failed]", err);
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }

  // 3. Notice when email credentials not yet added
  const targetEmail = process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com";
  const notice =
    `GMAIL_APP_PASSWORD is not configured in .env.local.\n` +
    `To receive real emails at ${targetEmail}, generate a 16-character Google App Password at: https://myaccount.google.com/apppasswords and set GMAIL_APP_PASSWORD in .env.local.`;

  console.warn(
    `\n============================== EMAIL DISPATCH QUEUED ==============================\n` +
    `Recipient: ${payload.to}\n` +
    `Subject: ${payload.subject}\n` +
    `Attachments: ${payload.attachments?.length ?? 0} file(s)\n` +
    `Status: ${notice}\n` +
    `===================================================================================\n`
  );

  return { success: false, error: notice };
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Builds the comprehensive luxury business notification email sent to rdbyreina@gmail.com
 */
export function buildBusinessOrderEmail(order: Order): EmailPayload {
  const businessEmail = process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com";
  const displayId = order.orderNumber || order.orderId;
  const reviewUrl = `${getBaseUrl()}/admin?orderId=${encodeURIComponent(order.orderId)}`;

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937;">
          <strong>${item.name}</strong>
          <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">Rental Date: ${item.eventDate}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #1f2937;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #1f2937;">
          $${item.price.toFixed(2)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; font-weight: bold; color: #1f2937;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const textLines = [
    `ACTION REQUIRED: NEW ZELLE RENTAL ORDER RECEIVED — R&D BY REINA`,
    `================================================`,
    `Order Number: #${displayId}`,
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    `Review Order: ${reviewUrl}`,
    ``,
    `CUSTOMER DETAILS:`,
    `- Customer Name: ${order.customer.fullName}`,
    `- Phone: ${order.customer.phone}`,
    `- Email: ${order.customer.email}`,
    `- Event Date: ${order.customer.eventDate}`,
    `- Event Location: ${order.customer.eventLocation}`,
    `- Delivery Address: ${order.customer.address}`,
    order.customer.notes ? `- Special Notes: ${order.customer.notes}` : "",
    ``,
    `ITEMS ORDERED:`,
    ...order.items.map(
      (i) => `• ${i.name} × ${i.quantity} @ $${i.price.toFixed(2)} = $${(i.price * i.quantity).toFixed(2)}`
    ),
    ``,
    `TOTAL: $${order.total.toFixed(2)}`,
    `PAYMENT STATUS: Pending Verification`,
    `SCREENSHOT: ${order.paymentScreenshot?.filename || "Attached"}`,
    `================================================`,
  ].filter(Boolean);

  const attachments: EmailAttachment[] = [];
  let screenshotHtml = "";

  if (order.paymentScreenshot?.dataUrl) {
    const match = order.paymentScreenshot.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, "base64");
      const filename = order.paymentScreenshot.filename || "payment-confirmation.png";

      attachments.push({
        filename,
        content: buffer,
        contentType: mimeType,
        cid: "paymentScreenshotInline",
      });

      screenshotHtml = `
        <div style="margin-top: 25px; padding: 20px; background-color: #fcfaf6; border: 1px solid #e5dccb; border-radius: 8px;">
          <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 15px; font-weight: bold; color: #1a1918; text-transform: uppercase; letter-spacing: 0.05em;">
            Payment Confirmation Screenshot
          </h3>
          <p style="font-size: 13px; color: #4b5563; margin-top: 0; margin-bottom: 14px;">
            Uploaded by <strong>${order.customer.fullName}</strong> (${filename}):
          </p>
          <div style="text-align: center; background-color: #ffffff; padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px;">
            <img src="cid:paymentScreenshotInline" alt="Customer Payment Screenshot" style="max-width: 100%; max-height: 480px; object-fit: contain; border-radius: 4px;" />
          </div>
        </div>
      `;
    }
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Rental Order #${displayId}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f3f0; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
    
    <!-- Luxury Header -->
    <div style="background-color: #141312; padding: 30px 24px; text-align: center; border-bottom: 3px solid #d4af37;">
      <h1 style="color: #fdfbf7; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">
        R&amp;D by Reina
      </h1>
      <p style="color: #d4af37; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;">
        New Rental Order Received
      </p>
    </div>

    <div style="padding: 24px 28px;">
      
      <!-- Order Banner -->
      <div style="border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Order Reference ID</span>
        <div style="font-size: 22px; font-weight: bold; color: #111827; margin-top: 2px;">#${displayId}</div>
        <div style="margin-top: 6px;">
          <span style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px;">
            Payment: Zelle Verification Pending
          </span>
        </div>
      </div>

      <!-- Quick Action Button -->
      <div style="text-align: center; margin: 20px 0;">
        <a href="${reviewUrl}" style="display: inline-block; background-color: #141312; color: #d4af37; border: 1px solid #d4af37; padding: 12px 24px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
          Review &amp; Verify Order in Admin Console &rarr;
        </a>
      </div>

      <!-- Customer & Event Details -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 18px; margin-bottom: 24px;">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.08em;">
          Customer &amp; Event Details
        </h3>
        <table style="width: 100%; font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="color: #6b7280; width: 35%; padding-bottom: 6px;">Customer Name:</td>
            <td style="color: #111827; font-weight: bold; padding-bottom: 6px;">${order.customer.fullName}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Phone Number:</td>
            <td style="color: #111827; font-weight: bold; padding-bottom: 6px;">
              <a href="tel:${order.customer.phone}" style="color: #b8860b; text-decoration: none;">${order.customer.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Email Address:</td>
            <td style="color: #111827; font-weight: bold; padding-bottom: 6px;">
              <a href="mailto:${order.customer.email}" style="color: #b8860b; text-decoration: none;">${order.customer.email}</a>
            </td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Event Date:</td>
            <td style="color: #111827; font-weight: bold; padding-bottom: 6px;">${order.customer.eventDate}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Event Location:</td>
            <td style="color: #111827; padding-bottom: 6px;">${order.customer.eventLocation}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Delivery Address:</td>
            <td style="color: #111827; padding-bottom: 6px;">${order.customer.address}</td>
          </tr>
          ${
            order.customer.notes
              ? `<tr>
                  <td style="color: #6b7280; vertical-align: top;">Notes:</td>
                  <td style="color: #111827;">${order.customer.notes}</td>
                </tr>`
              : ""
          }
        </table>
      </div>

      <!-- Items Ordered Table -->
      <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 13px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.08em;">
        Ordered Rental Items
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6; text-align: left;">
            <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563;">Item</th>
            <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563; text-align: center;">Qty</th>
            <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563; text-align: right;">Price</th>
            <th style="padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Order Totals -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 14px; text-align: right;">
        <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">
          Subtotal: <span style="font-weight: 600; color: #111827;">$${order.subtotal.toFixed(2)}</span>
        </div>
        <div style="font-size: 18px; font-weight: bold; color: #111827;">
          Total Amount: <span style="color: #b8860b;">$${order.total.toFixed(2)}</span>
        </div>
      </div>

      <!-- Payment Screenshot Section -->
      ${screenshotHtml}

    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 18px 24px; text-align: center; font-size: 12px; color: #6b7280;">
      <p style="margin: 0;">Automated notification from <strong>R&amp;D by Reina</strong> online rental portal.</p>
    </div>

  </div>
</body>
</html>
  `;

  return {
    to: businessEmail,
    replyTo: order.customer.email,
    subject: `New Rental Order #${displayId} — ${order.customer.fullName} ($${order.total.toFixed(2)})`,
    text: textLines.join("\n"),
    html,
    attachments,
  };
}

/**
 * Builds confirmation email for the customer
 */
export function buildCustomerOrderEmail(order: Order): EmailPayload {
  const text = [
    `Rental Order Confirmation — R&D by Reina`,
    `================================================`,
    `Dear ${order.customer.fullName},`,
    ``,
    `Thank you for choosing R&D by Reina! We have received your rental order #${order.orderId} for ${order.customer.eventDate}.`,
    ``,
    `ORDER SUMMARY:`,
    ...order.items.map((i) => `• ${i.name} × ${i.quantity} ($${(i.price * i.quantity).toFixed(2)})`),
    ``,
    `Total: $${order.total.toFixed(2)}`,
    `Payment Status: Payment Verification Pending`,
    ``,
    `NEXT STEPS:`,
    `Our team is currently verifying your Zelle payment confirmation screenshot. You will receive final reservation confirmation shortly.`,
    ``,
    `Contact R&D by Reina:`,
    `Phone: 972-920-6561`,
    `Email: rdbyreina@gmail.com`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Rental Confirmation #${order.orderId}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f3f0; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
    
    <div style="background-color: #141312; padding: 28px 24px; text-align: center; border-bottom: 3px solid #d4af37;">
      <h1 style="color: #fdfbf7; margin: 0; font-size: 22px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">
        R&amp;D by Reina
      </h1>
      <p style="color: #d4af37; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;">
        Rental Request Received
      </p>
    </div>

    <div style="padding: 24px 28px;">
      <h2 style="font-family: Georgia, serif; font-size: 20px; color: #111827; margin-top: 0;">
        Thank you, ${order.customer.fullName}!
      </h2>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
        We have received your event rental order <strong>#${order.orderId}</strong> and your Zelle payment confirmation screenshot.
      </p>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <div style="font-size: 13px; color: #6b7280;">Event Date: <strong style="color: #111827;">${order.customer.eventDate}</strong></div>
        <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Location: <strong style="color: #111827;">${order.customer.eventLocation}</strong></div>
        <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Total Reserved: <strong style="color: #b8860b;">$${order.total.toFixed(2)}</strong></div>
      </div>

      <p style="font-size: 13px; color: #4b5563; line-height: 1.6;">
        <strong>What's Next?</strong><br/>
        Our design and logistics team is currently reviewing your payment screenshot. You will receive a final booking confirmation and delivery schedule directly to your email and phone.
      </p>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
        Questions or adjustments? Call us at <a href="tel:972-920-6561" style="color: #b8860b; text-decoration: none; font-weight: bold;">972-920-6561</a> or email <a href="mailto:rdbyreina@gmail.com" style="color: #b8860b; text-decoration: none; font-weight: bold;">rdbyreina@gmail.com</a>.
      </div>
    </div>

    <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af;">
      © ${new Date().getFullYear()} R&amp;D by Reina — Luxury Event Rentals &amp; Décor
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: order.customer.email,
    subject: `Rental Request Received #${order.orderId} — R&D by Reina`,
    text,
    html,
  };
}

export async function notifyOrderEmails(order: Order): Promise<{ businessResult: SendEmailResult; customerResult: SendEmailResult }> {
  const businessResult = await sendEmail(buildBusinessOrderEmail(order));
  const customerResult = await sendEmail(buildCustomerOrderEmail(order));
  return { businessResult, customerResult };
}

/**
 * Builds the luxury payment verified & confirmed reservation email sent to customer
 */
export function buildPaymentVerifiedEmail(order: Order): EmailPayload {
  const displayId = order.orderNumber || order.orderId;
  const verifiedDate = order.paymentVerifiedAt ? new Date(order.paymentVerifiedAt).toLocaleDateString() : new Date().toLocaleDateString();

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #1f2937;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 14px; color: #1f2937;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #1f2937;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const text = [
    `PAYMENT VERIFIED — RESERVATION CONFIRMED`,
    `================================================`,
    `Dear ${order.customer.fullName},`,
    ``,
    `Great news! Your Zelle payment of $${order.total.toFixed(2)} for Order #${displayId} has been verified, and your event rental reservation is officially CONFIRMED.`,
    ``,
    `RESERVATION DETAILS:`,
    `- Order Number: #${displayId}`,
    `- Event Date: ${order.customer.eventDate}`,
    `- Event Venue: ${order.customer.eventLocation}`,
    `- Delivery Address: ${order.customer.address}`,
    `- Verified On: ${verifiedDate}`,
    `- Total Paid: $${order.total.toFixed(2)}`,
    ``,
    `ITEMS RESERVED:`,
    ...order.items.map((i) => `• ${i.name} × ${i.quantity}`),
    ``,
    `WHAT'S NEXT:`,
    `Our staging and delivery team will reach out 48 hours prior to ${order.customer.eventDate} to coordinate delivery arrival windows and setup requirements.`,
    ``,
    `Questions? Call 972-920-6561 or reply to this email.`,
    `Thank you for choosing R&D by Reina!`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reservation Confirmed #${displayId}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f3f0; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
    
    <!-- Luxury Header -->
    <div style="background-color: #141312; padding: 30px 24px; text-align: center; border-bottom: 3px solid #d4af37;">
      <h1 style="color: #fdfbf7; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">
        R&amp;D by Reina
      </h1>
      <p style="color: #d4af37; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;">
        Reservation Confirmed
      </p>
    </div>

    <div style="padding: 24px 28px;">
      
      <!-- Verification Badge -->
      <div style="text-align: center; padding: 18px 0; border-bottom: 1px solid #f3f4f6;">
        <span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
          ✓ Payment Verified &amp; Confirmed
        </span>
        <h2 style="font-family: Georgia, serif; font-size: 22px; color: #111827; margin: 14px 0 4px 0;">
          You're All Set, ${order.customer.fullName}!
        </h2>
        <p style="font-size: 14px; color: #4b5563; margin: 0;">
          Your payment for Order <strong>#${displayId}</strong> has been verified.
        </p>
      </div>

      <!-- Details Summary -->
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 18px; margin: 20px 0;">
        <table style="width: 100%; font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="color: #6b7280; width: 35%; padding-bottom: 6px;">Order Number:</td>
            <td style="color: #111827; font-weight: bold; padding-bottom: 6px;">#${displayId}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Event Date:</td>
            <td style="color: #111827; font-weight: bold; padding-bottom: 6px;">${order.customer.eventDate}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Venue / Location:</td>
            <td style="color: #111827; padding-bottom: 6px;">${order.customer.eventLocation}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding-bottom: 6px;">Delivery Address:</td>
            <td style="color: #111827; padding-bottom: 6px;">${order.customer.address}</td>
          </tr>
          <tr>
            <td style="color: #6b7280;">Total Paid:</td>
            <td style="color: #065f46; font-weight: bold;">$${order.total.toFixed(2)} (Zelle)</td>
          </tr>
        </table>
      </div>

      <!-- Items Reserved Table -->
      <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 13px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.08em;">
        Confirmed Rental Items
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6; text-align: left;">
            <th style="padding: 8px 12px; font-size: 12px; color: #4b5563; text-transform: uppercase;">Item</th>
            <th style="padding: 8px 12px; font-size: 12px; color: #4b5563; text-transform: uppercase; text-align: center;">Qty</th>
            <th style="padding: 8px 12px; font-size: 12px; color: #4b5563; text-transform: uppercase; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Logistics Notice -->
      <div style="background-color: #fcfaf6; border: 1px solid #e5dccb; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #1a1918; text-transform: uppercase;">
          Logistics &amp; Delivery
        </h4>
        <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.5;">
          Our staging team will reach out 48 hours prior to your event date (${order.customer.eventDate}) to confirm final delivery windows and venue access details.
        </p>
      </div>

      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 13px; color: #6b7280;">
        Need to make changes or have questions? Contact us directly at <a href="tel:972-920-6561" style="color: #b8860b; text-decoration: none; font-weight: bold;">972-920-6561</a> or email <a href="mailto:rdbyreina@gmail.com" style="color: #b8860b; text-decoration: none; font-weight: bold;">rdbyreina@gmail.com</a>.
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af;">
      © ${new Date().getFullYear()} R&amp;D by Reina — Luxury Event Rentals &amp; Décor
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: order.customer.email,
    subject: `Payment Verified & Reservation Confirmed — Order #${displayId} | R&D by Reina`,
    text,
    html,
  };
}

export async function sendPaymentVerifiedEmail(order: Order): Promise<SendEmailResult> {
  return await sendEmail(buildPaymentVerifiedEmail(order));
}

/**
 * Builds the payment rejection notification email sent to customer
 */
export function buildPaymentRejectedEmail(order: Order, reason: string): EmailPayload {
  const displayId = order.orderNumber || order.orderId;
  const orderUrl = `${getBaseUrl()}/order-confirmation/${encodeURIComponent(order.orderId)}`;

  const text = [
    `PAYMENT VERIFICATION UPDATE — ORDER #${displayId}`,
    `================================================`,
    `Dear ${order.customer.fullName},`,
    ``,
    `We reviewed the Zelle payment confirmation screenshot for your rental order #${displayId}, but were unable to verify your payment at this time.`,
    ``,
    `REASON FOR REJECTION:`,
    `${reason}`,
    ``,
    `NEXT STEPS:`,
    `Please review your Zelle transfer and upload an updated confirmation screenshot using your order link:`,
    `${orderUrl}`,
    ``,
    `You can also reach us directly to complete your reservation:`,
    `Phone: 972-920-6561`,
    `Email: rdbyreina@gmail.com`,
    ``,
    `Thank you for your patience!`,
    `R&D by Reina`,
  ].join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payment Verification Update #${displayId}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f3f0; margin: 0; padding: 24px; color: #1f2937;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
    
    <!-- Luxury Header -->
    <div style="background-color: #141312; padding: 30px 24px; text-align: center; border-bottom: 3px solid #dc2626;">
      <h1 style="color: #fdfbf7; margin: 0; font-size: 24px; font-family: Georgia, serif; letter-spacing: 0.1em; text-transform: uppercase;">
        R&amp;D by Reina
      </h1>
      <p style="color: #ef4444; margin: 6px 0 0 0; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;">
        Payment Verification Update
      </p>
    </div>

    <div style="padding: 24px 28px;">
      
      <h2 style="font-family: Georgia, serif; font-size: 20px; color: #111827; margin-top: 0;">
        Attention: Action Required for Order #${displayId}
      </h2>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
        Dear <strong>${order.customer.fullName}</strong>, we reviewed the Zelle payment confirmation screenshot for your rental reservation on <strong>${order.customer.eventDate}</strong>, but our team was unable to verify the transaction.
      </p>

      <!-- Rejection Reason Alert Box -->
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 0.05em;">
          Reason Provided by Staff:
        </p>
        <p style="margin: 0; font-size: 14px; color: #7f1d1d; font-weight: 500; line-height: 1.5;">
          ${reason}
        </p>
      </div>

      <!-- Action Required Section -->
      <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
        To secure your rental items for <strong>${order.customer.eventDate}</strong>, please double check your Zelle payment details and upload a valid, full-size transaction confirmation screenshot.
      </p>

      <div style="text-align: center; margin: 26px 0;">
        <a href="${orderUrl}" style="display: inline-block; background-color: #141312; color: #fdfbf7; border: 1px solid #141312; padding: 13px 26px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">
          View Order &amp; Re-Upload Payment Proof &rarr;
        </a>
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; margin-bottom: 20px; font-size: 13px; color: #4b5563;">
        <strong>Need immediate assistance?</strong><br/>
        Call our direct line at <a href="tel:972-920-6561" style="color: #b8860b; text-decoration: none; font-weight: bold;">972-920-6561</a> or email <a href="mailto:rdbyreina@gmail.com" style="color: #b8860b; text-decoration: none; font-weight: bold;">rdbyreina@gmail.com</a>.
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 16px; text-align: center; font-size: 11px; color: #9ca3af;">
      © ${new Date().getFullYear()} R&amp;D by Reina — Luxury Event Rentals &amp; Décor
    </div>
  </div>
</body>
</html>
  `;

  return {
    to: order.customer.email,
    subject: `Payment Verification Update — Order #${displayId} | R&D by Reina`,
    text,
    html,
  };
}

export async function sendPaymentRejectedEmail(order: Order, reason: string): Promise<SendEmailResult> {
  return await sendEmail(buildPaymentRejectedEmail(order, reason));
}

export async function notifyQuoteEmail(quote: QuoteRequest): Promise<SendEmailResult> {
  const businessEmail = process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com";
  return await sendEmail({
    to: businessEmail,
    replyTo: quote.email,
    subject: `New Quote Request — ${quote.fullName} (${quote.eventType})`,
    text: JSON.stringify(quote, null, 2),
    html: `<pre>${JSON.stringify(quote, null, 2)}</pre>`,
  });
}

export async function notifyContactEmail(msg: ContactMessage): Promise<SendEmailResult> {
  const businessEmail = process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com";
  return await sendEmail({
    to: businessEmail,
    replyTo: msg.email,
    subject: `Contact Inquiry: ${msg.subject} — ${msg.name}`,
    text: JSON.stringify(msg, null, 2),
    html: `<pre>${JSON.stringify(msg, null, 2)}</pre>`,
  });
}


