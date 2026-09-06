import { Router } from "express";
import { body } from "express-validator";
import { CustomerController } from "../controllers/customer.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("phone").optional().trim(),
    body("source")
      .optional()
      .isIn(["MANUAL", "WHATSAPP", "EMAIL", "WEBSITE", "OTHER"])
      .withMessage("Invalid source"),
  ],
  validate,
  CustomerController.create
);

router.get("/", CustomerController.getAll);

router.get("/stats", CustomerController.getStats);

router.get("/:id", CustomerController.getById);

router.put(
  "/:id",
  [
    body("name").optional().trim().notEmpty(),
    body("email").optional().isEmail(),
    body("phone").optional().trim(),
    body("source")
      .optional()
      .isIn(["MANUAL", "WHATSAPP", "EMAIL", "WEBSITE", "OTHER"]),
  ],
  validate,
  CustomerController.update
);

router.delete("/:id", CustomerController.delete);

export default router;
