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
    const query = `*[_type == "galleryItem" && isVisible == true] | order(displayOrder asc, _createdAt desc){
      _id,
      title,
      mediaType,
      category,
      tag,
      description,
      displayOrder,
      "imageUrl": image.asset->url,
      "beforeImageUrl": beforeImage.asset->url,
      "afterImageUrl": afterImage.asset->url,
      videoUrl
    }`;

    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Could not load gallery items",
      });
    }

    return res.status(200).json({
      success: true,
      gallery: data.result || [],
    });
  } catch (error) {
    console.error("Get gallery error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
