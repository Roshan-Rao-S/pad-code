import { uploader } from "../services/cloudinary.js";
import { getPadMediaTotalSize, saveMediaMeta } from "../utils/sizeChecker.js";

export const uploadMedia = async (req, res) => {
  const { padId, file, type } = req.body;

  const currentSize = await getPadMediaTotalSize(padId);
  const fileSizeMB = Buffer.from(file, "base64").length / (1024 * 1024);

  if (currentSize + fileSizeMB > +process.env.MAX_PAD_SIZE_MB) {
    return res.status(400).json({ error: "Pad has exceeded 100MB limit." });
  }

  const uploadRes = await uploader.upload(file, {
    folder: `pads/${padId}`,
    resource_type: type,
  });

  await saveMediaMeta(padId, { url: uploadRes.secure_url, size: fileSizeMB });

  res.json({ url: uploadRes.secure_url });
};

export const getPadMediaSize = async (req, res) => {
  const size = await getPadMediaTotalSize(req.params.padId);
  res.json({ sizeMB: size });
};
