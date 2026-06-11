const SANITY_PROJECT_ID = "2dsjc459";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-06-01";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const token = process.env.SANITY_WRITE_TOKEN;

    if (!token) {
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

    const reviewDocument = {
      _type: "review",
      customerName: String(customerName).trim().slice(0, 80),
      serviceUsed: String(serviceUsed).trim().slice(0, 120),
      rating: cleanRating,
      location: String(location).trim().slice(0, 120),
      reviewText: String(reviewText).trim().slice(0, 1200),
      displayOrder: 999,
      isApproved: false,
    };

    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

    const sanityResponse = await fetch(sanityUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
