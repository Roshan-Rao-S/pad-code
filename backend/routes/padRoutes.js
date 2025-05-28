import express from "express";
import { getPad, clearPad } from "../controllers/padController.js";

const router = express.Router();
router.get("/:padId", getPad);
router.delete("/:padId", clearPad);

export default router;
