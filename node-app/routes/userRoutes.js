import express from "express";
import { generateUsers, getCountWithoutIndex, getCountWithBtreeIndex, getCountWithHashIndex } from "../services/userService.js";

const router = express.Router();

router.get("/no-index", getCountWithoutIndex);
router.get("/btree-index", getCountWithBtreeIndex);
router.get("/hash-index", getCountWithHashIndex);
router.post("/generate-users", generateUsers);

export default router;