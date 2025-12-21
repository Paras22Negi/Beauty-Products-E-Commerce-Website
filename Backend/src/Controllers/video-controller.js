import Video from "../Models/Video.Model.js";
import cloudinary from "../config/cloudinary.js";

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload video
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No video file provided" });
    }

    // Upload to Cloudinary (assuming 'req.file' is available via multer)
    // For videos, use resource_type: "video"
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "video", folder: "videos" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Save to DB
    const newVideo = new Video({
      url: result.secure_url,
      public_id: result.public_id,
      description: req.body.description,
    });

    await newVideo.save();

    res.status(201).json({ success: true, video: newVideo });
  } catch (error) {
    console.error("Video upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Delete from Cloudinary if public_id exists
    if (video.public_id) {
      await cloudinary.uploader.destroy(video.public_id, {
        resource_type: "video",
      });
    }

    await Video.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update video details
export const updateVideoDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const video = await Video.findById(id);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (description !== undefined) {
      video.description = description;
    }

    await video.save();

    res.status(200).json({ success: true, video });
  } catch (error) {
    console.error("Video update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
