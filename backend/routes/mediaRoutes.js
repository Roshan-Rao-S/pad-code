import express from "express";
import { uploadMedia, getPadMediaSize } from "../controllers/mediaController.js";

const router = express.Router();
router.post("/upload", uploadMedia);
router.get("/size/:padId", getPadMediaSize);

export default router;
