"use server";

import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { Resend } from "resend";
import { z } from "zod";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

let sesClient: SESClient;

const SUPER_ADMIN = process.env.SUPER_ADMIN
  ? process.env.SUPER_ADMIN.split(",").map((e) => e.trim())
  : [];

const resend = new Resend(process.env.RESEND_API_KEY);

export async function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN.includes(email);
}

try {
  sesClient = new SESClient({
    region: env.REGION,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });
} catch (error) {
  console.error("Failed to create SES client:", {
    message: error.message,
    stack: error.stack,
    name: error.name,
  });
  throw error;
}

// List of authorized admin emails
const AUTHORIZED_ADMINS = ["mahboobelahi93@gmail.com", "admin@ai-prism.dev"];

const pilotOwnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().min(2, "Organization must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().min(10, "Please enter a valid contact number"),
  purpose: z
    .string()
    .min(10, "Please provide a brief purpose (minimum 10 characters)"),
});

export async function checkUserExists(email: string) {
  try {
    // Validate email format
    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Invalid email format",
        exists: false,
      };
    }

    // Check if user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return {
        success: true,
        exists: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      exists: true,
      message: "User found",
      user: {
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  } catch (error) {
    console.error("Check user error:", error);

    return {
      success: false,
      error: "Failed to check user existence",
      exists: false,
    };
  }
}

export async function submitPilotOwnerRequest(
  data: z.infer<typeof pilotOwnerSchema>,
) {
  try {
    const validatedData = pilotOwnerSchema.parse(data);

    // Check if user exists
    const userCheck = await checkUserExists(validatedData.email.toLowerCase());

    console.log("User check result:", userCheck);

    if (!userCheck.success) {
      return {
        success: false,
        error: userCheck.error || "Failed to verify email",
      };
    }

    if (!userCheck.exists) {
      return {
        success: false,
        error:
          "Please sign up for an account first before requesting pilot owner access",
      };
    }

    if (userCheck?.user.role === "PILOTOWNER") {
      return {
        success: false,
        error: "You are already a pilot owner",
      };
    }

    await prisma.PilotOwnerRequests.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        organization: validatedData?.organization,
        contactNumber: validatedData?.contactNumber,
        purpose: validatedData?.purpose,
        status: "PENDING",
        updatedAt: new Date(),
      },
    });

    // Create approval token
    const approvalToken = btoa(
      JSON.stringify({
        email: validatedData.email,
        name: validatedData?.name,
        organization: validatedData?.organization,
        timestamp: Date.now(),
      }),
    );

    // Create approval link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const approveUrl = `${baseUrl}/admin/approvepilotowner?token=${approvalToken}&action=approve`;
    const rejectUrl = `${baseUrl}/admin/approvepilotowner?token=${approvalToken}&action=reject`;

    await resend.emails.send({
          from: "AI-PRISM <no-reply@ai-prism.dev>",
          to: "mahboobelahi93@gmail.com",
          subject: "New Pilot Owner Request - Action Required",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Pilot Owner Request</h2>

              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
                <h3 style="margin-top: 0; color: #333;">Request Details</h3>
                <p><strong>Name:</strong> ${validatedData.name}</p>
                <p><strong>Organization:</strong> ${validatedData.organization}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                <p><strong>Contact Number:</strong> ${validatedData.contactNumber}</p>
                <p><strong>Purpose:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #e9ecef;">
                  ${validatedData.purpose}
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${approveUrl}" 
                  style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                  ✅ Approve Request
                </a>

                <a href="${rejectUrl}" 
                  style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
                  ❌ Reject Request
                </a>
              </div>

              <div style="background: #fff3cd; padding: 15px; border-radius: 4px; border: 1px solid #ffeaa7; margin: 20px 0;">
                <p style="margin: 0; color: #856404;">
                  <strong>Note:</strong> Click one of the buttons above to approve or reject this request. 
                  You'll be asked to verify your admin access before the action is processed.
                </p>
              </div>
            </div>
          `,
        }); 

    return {
      success: true,
      message: "Pilot owner request submitted successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input data" };
    }
    console.error("Error submitting pilot owner request:", error);
    return { success: false, error: "Failed to submit pilot owner request" };
  }
}

export async function processPilotOwnerRequest(
  token: string,
  action: "approve" | "reject",
  adminEmail: string,
) {
  try {
    // Decode the token
    let requestData;
    try {
      requestData = JSON.parse(atob(token));
    } catch (error) {
      return {
        success: false,
        error: "Invalid approval token",
      };
    }

    if (action === "reject") {
      await resend.emails.send({
        from: "AI-PRISM <no-reply@ai-prism.dev>",
        to: requestData.email,
        subject: "Pilot Owner Request - Update",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc3545;">Pilot Owner Request Update</h2>
            <p>Dear ${requestData.name},</p>
            <p>Thank you for your interest in becoming a Pilot Owner on AI-PRISM.</p>
            <p>After careful review, we regret to inform you that your request has not been approved at this time.</p>
            <p>If you have any questions or would like to discuss this further, please feel free to contact our support team.</p>
            <p>Best regards,<br>AI-PRISM Team</p>
          </div>
        `,
      });

      return {
        success: true,
        message: `Request for ${requestData.email} has been rejected and user has been notified.`,
      };
    }

    // Handle approval
    const existingUser = await prisma.user.findUnique({
      where: { email: requestData.email.toLowerCase() },
    });

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: { email: requestData.email.toLowerCase() },
        data: { role: "PILOTOWNER" },
      });
    } else {
      return {
        success: false,
        error: "User account not found. They need to sign up first.",
      };
    }

    // Send approval email to user
    await resend.emails.send({
      from: "AI-PRISM <no-reply@ai-prism.dev>",
      to: requestData.email,
      subject: "Pilot Owner Request Approved! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Congratulations! Your Pilot Owner Request is Approved 🎉</h2>
          <p>Dear ${requestData.name},</p>
          <p>Great news! Your request to become a Pilot Owner on AI-PRISM has been <strong>approved</strong>.</p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="margin-top: 0; color: #155724;">What's Next?</h3>
            <ul style="color: #155724;">
              <li>You can now sign in to AI-PRISM using your email address</li>
              <li>Create and manage your own pilot programs</li>
              <li>Access all Pilot Owner features and tools</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Sign In to AI-PRISM
            </a>
          </div>
          
          <p>Welcome to the AI-PRISM community!</p>
          <p>Best regards,<br>AI-PRISM Team</p>
        </div>
      `,
    });

    return {
      success: true,
      message: `Successfully approved ${requestData.email} as Pilot Owner! User has been notified.`,
      user: user,
    };
  } catch (error) {
    console.error("Error processing pilot owner request:", error);
    return {
      success: false,
      error: "Failed to process request",
    };
  }
}