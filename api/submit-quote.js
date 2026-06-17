export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const {
      name,
      phone,
      email,
      city,
      service,
      property,
      date,
      time,
      details
    } = req.body || {};

    if (!name || !phone || !city || !service || !details) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields."
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return res.status(500).json({
        success: false,
        message: "Email service is not configured."
      });
    }

    const emailBody = `
New quote request from SureSpark Cleaning website

Full Name:
${name}

Phone / WhatsApp:
${phone}

Email:
${email || "Not provided"}

City / Area:
${city}

Service Type:
${service}

Property Type:
${property || "Not provided"}

Preferred Date:
${date || "Not provided"}

Preferred Time:
${time || "Not provided"}

Cleaning Details:
${details}

Note:
The customer will continue on WhatsApp and may send photos/videos there.
`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "SureSpark Cleaning <notifications@suresparkcleaning.com>",
        to: ["info@suresparkcleaning.com"],
        subject: `New Cleaning Quote Request - ${service}`,
        text: emailBody,
        reply_to: email || "info@suresparkcleaning.com"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(500).json({
        success: false,
        message: "Could not send quote email."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quote request sent successfully."
    });
  } catch (error) {
    console.error("Quote submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
}
