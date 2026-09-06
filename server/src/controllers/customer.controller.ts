import { Response } from "express";
import { CustomerService } from "../services/customer.service.js";
import { asyncHandler } from "../middleware/error.js";
import { AuthRequest } from "../middleware/auth.js";

export class CustomerController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const customer = await CustomerService.create(req.body);

    res.status(201).json({
      success: true,
      data: customer,
    });
  });

  static getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { search, source, assignedUserId, city } = req.query;

    const customers = await CustomerService.getAll({
      search: search as string,
      source: source as string,
      assignedUserId: assignedUserId as string,
      city: city as string,
    });

    res.json({
      success: true,
      data: customers,
    });
  });

  static getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const customer = await CustomerService.getById(req.params.id);

    res.json({
      success: true,
      data: customer,
    });
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const customer = await CustomerService.update(req.params.id, req.body);

    res.json({
      success: true,
      data: customer,
    });
  });

  static delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await CustomerService.delete(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  });

  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await CustomerService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  });
}
