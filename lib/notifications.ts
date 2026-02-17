import prisma from "./prisma";
import { Resend } from 'resend';

// Initialize Resend with explicit API key check
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function createNotification({
  userId,
  fromUserId,
  type,
  entityId,
}: {
  userId: string;
  fromUserId: string;
  type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED";
  entityId?: string;
}) {
  // Create notification in database
  const notification = await prisma.notification.create({
    data: {
      userId,
      fromUserId,
      type,
      entityId,
    },
  });

  // Send email asynchronously (don't block the response)
  sendNotificationEmail(userId, fromUserId, type).catch((error) => {
    console.error("Failed to send email notification:", error);
  });

  return notification;
}

async function sendNotificationEmail(
  recipientId: string,
  senderId: string,
  type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED"
) {
  try {
    // Check if Resend is configured
    if (!RESEND_API_KEY) {
      console.log('⚠️ Skipping email - RESEND_API_KEY not configured');
      return;
    }

    // Get user details
    const [recipient, sender] = await Promise.all([
      prisma.user.findUnique({
        where: { id: recipientId },
        select: { email: true, username: true },
      }),
      prisma.user.findUnique({
        where: { id: senderId },
        select: { id: true, username: true },
      }),
    ]);

    if (!recipient?.email || !sender?.username) {
      console.log('Missing recipient email or sender username');
      return;
    }

    const recipientName = recipient.username || 'there';
    const senderName = sender.username;
    const profileUrl = `${APP_URL}/profile/${sender.username}-${sender.id}`;
    const notificationsUrl = `${APP_URL}/notifications`;

    let subject = '';
    let html = '';

    if (type === 'CONNECTION_REQUEST') {
      subject = `${senderName} sent you a connection request`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🤝 New Connection Request</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${recipientName},</p>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                <strong>${senderName}</strong> wants to connect with you!
              </p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  View their profile and respond to the connection request.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${profileUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">
                  View Profile
                </a>
                
                <a href="${notificationsUrl}" style="display: inline-block; background: white; color: #667eea; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; border: 2px solid #667eea; margin: 5px;">
                  See Notifications
                </a>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; text-align: center;">
                You're receiving this because someone sent you a connection request on AU Connect.
              </p>
            </div>
          </body>
        </html>
      `;
    } else if (type === 'CONNECTION_ACCEPTED') {
      subject = `${senderName} accepted your connection request`;
      html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Connection Accepted!</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${recipientName},</p>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                Great news! <strong>${senderName}</strong> accepted your connection request. You're now connected!
              </p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  Start engaging with their posts or send them a message.
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${profileUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 5px;">
                  View Profile
                </a>
                
                <a href="${notificationsUrl}" style="display: inline-block; background: white; color: #10b981; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; border: 2px solid #10b981; margin: 5px;">
                  See Notifications
                </a>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; text-align: center;">
                You're receiving this because your connection request was accepted on AU Connect.
              </p>
            </div>
          </body>
        </html>
      `;
    }

    // Send email using Resend
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: recipient.email,
      subject,
      html,
    });

    console.log(`✅ Email sent for ${type}:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email for ${type}:`, error);
    // Don't throw - we don't want email failures to break the app
  }
}

export async function fetchNotifications() {
  const res = await fetch("/api/connect/v1/notifications", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

export async function markNotificationRead(id: string) {
  await fetch(`/api/connect/v1/notifications/${id}`, {
    method: "PATCH",
    credentials: "include",
  });
}

export async function fetchUnreadCount() {
  const res = await fetch(
    "/api/connect/v1/notifications/unread-count",
    { credentials: "include" }
  );

  return res.json();
}

export async function markAllNotificationsRead() {
  const res = await fetch(
    "/api/connect/v1/notifications/mark-all-read",
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return res.json();
}