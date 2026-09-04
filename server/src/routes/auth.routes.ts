import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/auth.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["ADMIN", "SALES_AGENT"])
      .withMessage("Role must be ADMIN or SALES_AGENT"),
  ],
  validate,
  AuthController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  AuthController.login
);

router.get("/me", authenticate, AuthController.getMe);

router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  AuthController.getAllUsers
);

router.put(
  "/users/:id",
  authenticate,
  authorize("ADMIN"),
  [
    body("name").optional().trim().notEmpty(),
    body("email").optional().isEmail(),
    body("password").optional().isLength({ min: 6 }),
    body("role").optional().isIn(["ADMIN", "SALES_AGENT"]),
  ],
  validate,
  AuthController.updateUser
);

router.delete(
  "/users/:id",
  authenticate,
  authorize("ADMIN"),
  AuthController.deleteUser
);

export default router;
