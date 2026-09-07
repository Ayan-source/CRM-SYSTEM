import { Response } from "express";
import { LeadService } from "../services/lead.service.js";
import { asyncHandler } from "../middleware/error.js";
import { AuthRequest } from "../middleware/auth.js";

export class LeadController {
  static create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lead = await LeadService.create(req.body);

    res.status(201).json({
      success: true,
      data: lead,
    });
  });

  static getAll = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { search, status, pipelineStageId, assignedUserId, customerId } = req.query;

    const leads = await LeadService.getAll({
      search: search as string,
      status: status as string,
      pipelineStageId: pipelineStageId as string,
      assignedUserId: assignedUserId as string,
      customerId: customerId as string,
    });

    res.json({
      success: true,
      data: leads,
    });
  });

  static getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lead = await LeadService.getById(req.params.id);

    res.json({
      success: true,
      data: lead,
    });
  });

  static update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const lead = await LeadService.update(req.params.id, req.body);

    res.json({
      success: true,
      data: lead,
    });
  });

  static updateStage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { stageId } = req.body;
    const lead = await LeadService.updateStage(req.params.id, stageId);

    res.json({
      success: true,
      data: lead,
    });
  });

  static updateStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const lead = await LeadService.updateStatus(req.params.id, status);

    res.json({
      success: true,
      data: lead,
    });
  });

  static assign = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.body;
    const lead = await LeadService.assign(req.params.id, userId);

    res.json({
      success: true,
      data: lead,
    });
  });

  static delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await LeadService.delete(req.params.id);

    res.json({
      success: true,
      data: result,
    });
  });

  static getPipeline = asyncHandler(async (req: AuthRequest, res: Response) => {
    const pipeline = await LeadService.getPipeline();

    res.json({
      success: true,
      data: pipeline,
    });
  });

  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await LeadService.getStats();

    res.json({
      success: true,
      data: stats,
    });
  });
}
