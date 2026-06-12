const SANITY_PROJECT_ID = "2dsjc459";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-06-01";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const query = `*[_type == "review" && isApproved == true] | order(displayOrder asc, _createdAt desc){
      customerName,
      serviceUsed,
      rating,
      location,
      reviewText
    }`;

    const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Could not load reviews",
      });
    }

    return res.status(200).json({
      success: true,
      reviews: data.result || [],
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
