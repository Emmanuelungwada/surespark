const SANITY_PROJECT_ID = "2dsjc459";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2025-06-01";

export default async function handler(req, res) {
  try {
    const query = encodeURIComponent(`
      *[_type == "galleryItem" && isVisible == true] | order(displayOrder asc) {
        _id,
        title,
        mediaType,
        category,
        tag,
        description,
        displayOrder,
        "imageUrl": image.asset->url,
        "videoUrl": videoFile.asset->url,
        "thumbnailUrl": videoThumbnail.asset->url
      }
    `);

    const sanityUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

    const response = await fetch(sanityUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error("Sanity gallery error:", data);

      return res.status(500).json({
        success: false,
        message: "Could not load gallery items.",
      });
    }

    return res.status(200).json({
      success: true,
      gallery: data.result || [],
    });
  } catch (error) {
    console.error("Gallery API error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
}
