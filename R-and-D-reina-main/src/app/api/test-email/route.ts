import { NextResponse } from "next/server";
import { getTransporter, sendEmail } from "@/lib/email";

export async function GET() {
  return handleTest();
}

export async function POST() {
  return handleTest();
}

async function handleTest() {
  const targetEmail = process.env.EMAIL_BUSINESS_TO ?? "rdbyreina@gmail.com";
  const gmailUser = process.env.GMAIL_USER ?? targetEmail;
  const rawPass = process.env.GMAIL_APP_PASSWORD;
  const hasPass = Boolean(rawPass && rawPass.trim().length > 0);

  // If no password is configured, return diagnostic instructions
  if (!hasPass) {
    return NextResponse.json({
      success: false,
      status: "missing_credentials",
      targetEmail,
      message: `Google App Password is not configured in .env.local yet.`,
      resolution: [
        "1. Open your Google Account at: https://myaccount.google.com/apppasswords",
        "2. Ensure 2-Step Verification is enabled.",
        "3. Enter 'NextJS Website' as the App Name and click 'Create'.",
        "4. Copy the generated 16-character password (e.g., 'abcd efgh ijkl mnop').",
        "5. Paste it into .env.local: GMAIL_APP_PASSWORD=your_16_char_password",
        "6. Restart the server and click 'Send Test Email' again.",
      ],
    });
  }

  // Attempt verification & sending
  const transporter = getTransporter();
  if (!transporter) {
    return NextResponse.json({
      success: false,
      status: "transporter_init_failed",
      targetEmail,
      error: "Unable to initialize nodemailer transporter. Please check SMTP/Gmail settings in .env.local.",
    }, { status: 500 });
  }

  try {
    // 1. Verify SMTP handshake
    await transporter.verify();

    // 2. Send actual test email
    const result = await sendEmail({
      to: targetEmail,
      subject: `[TEST EMAIL] R&D by Reina — Email Verification Successful`,
      text: `Hello!\n\nThis is an automated test email confirming that your R&D by Reina website can now successfully deliver orders, payment screenshots, and inquiries to ${targetEmail}.\n\nTimestamp: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d4af37; border-radius: 8px;">
          <h2 style="color: #141312; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">R&amp;D by Reina — Email Test Succeeded!</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6;">
            Your website email dispatch system is connected and working perfectly.
          </p>
          <div style="background: #fdfbf7; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #111827;"><strong>Destination:</strong> ${targetEmail}</p>
            <p style="margin: 6px 0 0 0; font-size: 14px; color: #111827;"><strong>Sender:</strong> ${gmailUser}</p>
            <p style="margin: 6px 0 0 0; font-size: 14px; color: #111827;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="color: #16a34a; font-weight: bold; font-size: 14px;">
            ✓ All incoming customer orders, Zelle screenshots, and quotes will be delivered to this inbox.
          </p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        status: "delivered",
        targetEmail,
        messageId: result.messageId,
        message: `Test email successfully sent to ${targetEmail}! Check your inbox (and Spam/Promotions folder).`,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: "send_failed",
        targetEmail,
        error: result.error,
      }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      status: "smtp_error",
      targetEmail,
      error: err?.message || String(err),
      hint: err?.code === "EAUTH"
        ? "Google rejected the login credentials. Please ensure you are using a 16-character Google App Password (not your normal Gmail password)."
        : undefined,
    }, { status: 500 });
  }
}
