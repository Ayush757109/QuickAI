
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios"    // ✅ REQUIRED IMPORT
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ----------------------------------------------------------
// Generate Article
// ----------------------------------------------------------
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const { plan, free_usage } = req;

    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    if (plan !== "premium" && free_usage >= 10)
      return res.json({ success: false, message: "Limit reached. Upgrade plan." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("Article Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// Generate Blog Titles
// ----------------------------------------------------------
export const generateBlogTitles = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const { plan, free_usage } = req;

    if (!prompt)
      return res.status(400).json({ success: false, message: "Prompt is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `Generate 5–10 SEO-friendly blog titles about: ${prompt}`
    );

    const content = result.response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("Blog Title Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// Generate Image
// ----------------------------------------------------------
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;

    if (!prompt)
      return res.status(400).json({ success: false, message: "Prompt is required" });

    const plan = req.plan;
    if (plan !== "premium")
      return res.status(403).json({ success: false, message: "Premium required" });

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64 = `data:image/png;base64,${Buffer.from(data).toString("base64")}`;

    const upload = await cloudinary.uploader.upload(base64);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${upload.secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: upload.secure_url });

  } catch (error) {
    console.error("Image Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// Remove Background
// ----------------------------------------------------------
export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;

    if (!image)
      return res.status(400).json({ success: false, message: "No image uploaded" });

    const plan = req.plan;
    if (plan !== "premium")
      return res.status(403).json({ success: false, message: "Premium required" });

    const upload = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background', ${upload.secure_url}, 'image')
    `;

    res.json({ success: true, content: upload.secure_url });

  } catch (error) {
    console.error("Remove Background Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// Remove Object
// ----------------------------------------------------------
export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;

    if (!object)
      return res.status(400).json({ success: false, message: "Object name required" });

    const plan = req.plan;
    if (plan !== "premium")
      return res.status(403).json({ success: false, message: "Premium required" });

    const upload = await cloudinary.uploader.upload(image.path);

    const editedUrl = cloudinary.url(upload.public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object}`}, ${editedUrl}, 'image')
    `;

    res.json({ success: true, content: editedUrl });

  } catch (error) {
    console.error("Object Removal Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------------------------------------
// Resume Review
// ----------------------------------------------------------
export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;

    if (!resume)
      return res.status(400).json({ success: false, message: "Resume required" });

    if (resume.size > 5 * 1024 * 1024)
      return res.json({ success: false, message: "File exceeds 5MB" });

    // Parse PDF from buffer
    const pdfData = await pdfParse(resume.buffer);

    const prompt = `
Review this resume and provide:
- Strengths
- Weaknesses
- Actionable improvements

Resume content:
${pdfData.text}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, 'Resume Review', ${content}, 'Resume Review', false)
    `;

    res.json({ success: true, content });

  } catch (error) {
    console.error("Resume Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
