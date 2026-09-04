import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../middleware/error";
import { AuthRequest } from "../middleware/auth";

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const user = await AuthService.createUser({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: user,
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });

    res.json({
      success: true,
      data: result,
    });
  });

  static getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await AuthService.getCurrentUser(req.userId!);

    res.json({
      success: true,
      data: user,
    });
  });

  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await AuthService.getAllUsers();

    res.json({
      success: true,
      data: users,
    });
  });

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await AuthService.updateUser(id, { name, email, password, role });

    res.json({
      success: true,
      data: user,
    });
  });

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await AuthService.deleteUser(id);

    res.json({
      success: true,
      data: result,
    });
  });
}
