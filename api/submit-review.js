const SANITY_PROJECT_ID = "2dsjc459";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-06-01";

const REVIEW_NOTIFICATION_EMAIL = "info@suresparkcleaning.com";
const SANITY_STUDIO_URL = "https://surespark-cleaning.sanity.studio/";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const sanityToken = process.env.SANITY_WRITE_TOKEN;

    if (!sanityToken) {
      return res.status(500).json({
        success: false,
        message: "Missing Sanity write token",
      });
    }

    const { customerName, serviceUsed, rating, location, reviewText } = req.body || {};

    if (!customerName || !serviceUsed || !rating || !location || !reviewText) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    const cleanRating = Number(rating);

    if (Number.isNaN(cleanRating) || cleanRating < 1 || cleanRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating.",
      });
    }

    const cleanReview = {
      customerName: String(customerName).trim().slice(0, 80),
      serviceUsed: String(serviceUsed).trim().slice(0, 120),
      rating: cleanRating,
      location: String(location).trim().slice(0, 120),
      reviewText: String(reviewText).trim().slice(0, 1200),
    };

    const reviewDocument = {
      _type: "review",
      ...cleanReview,
      displayOrder: 999,
      isApproved: false,
    };

    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

    const sanityResponse = await fetch(sanityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sanityToken}`,
      },
      body: JSON.stringify({
        mutations: [
          {
            create: reviewDocument,
          },
        ],
      }),
    });

    const sanityResult = await sanityResponse.json();

    if (!sanityResponse.ok) {
      console.error("Sanity error:", sanityResult);

      return res.status(500).json({
        success: false,
        message: "Could not save review.",
      });
    }

    await sendReviewNotification(cleanReview);

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully.",
    });
  } catch (error) {
    console.error("Review submit error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}

async function sendReviewNotification(review) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("Missing RESEND_API_KEY. Review saved, but email was not sent.");
    return;
  }

  try {
    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="color: #0f766e;">New review submitted</h2>

        <p>A new customer review has been submitted on the SureSpark Cleaning website.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Customer Name:</td>
            <td style="padding: 8px;">${escapeHtml(review.customerName)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Service Used:</td>
            <td style="padding: 8px;">${escapeHtml(review.serviceUsed)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Rating:</td>
            <td style="padding: 8px;">${stars}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Location:</td>
            <td style="padding: 8px;">${escapeHtml(review.location)}</td>
          </tr>
        </table>

        <h3>Review Message</h3>
        <p style="background: #f8fafc; padding: 14px; border-radius: 10px;">
          ${escapeHtml(review.reviewText)}
        </p>

        <p>
          Please log in to Sanity Studio to approve or reject this review:
        </p>

        <p>
          <a href="${SANITY_STUDIO_URL}" style="display: inline-block; background: #0f766e; color: white; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: bold;">
            Open Sanity Studio
          </a>
        </p>

        <p style="font-size: 13px; color: #64748b;">
          This review will not appear on the website until “Approved / Show on Website” is turned on.
        </p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SureSpark Cleaning <notifications@suresparkcleaning.com>",
        to: REVIEW_NOTIFICATION_EMAIL,
        subject: "New review submitted - SureSpark Cleaning",
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend email error:", emailResult);
    }
  } catch (error) {
    console.error("Email notification error:", error);
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
