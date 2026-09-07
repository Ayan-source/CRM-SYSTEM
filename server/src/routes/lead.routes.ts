import { Router } from "express";
import { body } from "express-validator";
import { LeadController } from "../controllers/lead.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

router.get("/pipeline", LeadController.getPipeline);
router.get("/stats", LeadController.getStats);

router.post(
  "/",
  [
    body("customerId").notEmpty().withMessage("Customer ID is required"),
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("value").optional().isNumeric().withMessage("Value must be a number"),
    body("status")
      .optional()
      .isIn(["OPEN", "WON", "LOST"])
      .withMessage("Status must be OPEN, WON, or LOST"),
  ],
  validate,
  LeadController.create
);

router.get("/", LeadController.getAll);
router.get("/:id", LeadController.getById);

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty(),
    body("value").optional().isNumeric(),
    body("status").optional().isIn(["OPEN", "WON", "LOST"]),
  ],
  validate,
  LeadController.update
);

router.patch("/:id/stage", LeadController.updateStage);
router.patch("/:id/status", LeadController.updateStatus);
router.patch("/:id/assign", LeadController.assign);

router.delete("/:id", LeadController.delete);

export default router;
