import prisma from "../config/prisma.js";
import { AppError } from "../middleware/error.js";

interface CreateLeadInput {
  customerId: string;
  title: string;
  description?: string;
  value?: number;
  status?: string;
  pipelineStageId?: string;
  assignedUserId?: string;
  source?: string;
}

interface UpdateLeadInput extends Partial<CreateLeadInput> {}

interface LeadFilters {
  search?: string;
  status?: string;
  pipelineStageId?: string;
  assignedUserId?: string;
  customerId?: string;
}

export class LeadService {
  static async create(data: CreateLeadInput) {
    const customer = await prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    if (!data.pipelineStageId) {
      const firstStage = await prisma.pipelineStage.findFirst({
        where: { order: 1 },
      });
      data.pipelineStageId = firstStage?.id || "new-lead";
    }

    return prisma.lead.create({
      data,
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true },
        },
        pipelineStage: {
          select: { id: true, name: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async getAll(filters: LeadFilters) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { customer: { name: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.pipelineStageId) {
      where.pipelineStageId = filters.pipelineStageId;
    }

    if (filters.assignedUserId) {
      where.assignedUserId = filters.assignedUserId;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    return prisma.lead.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true },
        },
        pipelineStage: {
          select: { id: true, name: true, order: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true, email: true },
        },
        pipelineStage: {
          select: { id: true, name: true },
        },
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    return lead;
  }

  static async update(id: string, data: UpdateLeadInput) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    return prisma.lead.update({
      where: { id },
      data,
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true },
        },
        pipelineStage: {
          select: { id: true, name: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async updateStage(id: string, pipelineStageId: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    const stage = await prisma.pipelineStage.findUnique({
      where: { id: pipelineStageId },
    });

    if (!stage) {
      throw new AppError("Pipeline stage not found", 404);
    }

    return prisma.lead.update({
      where: { id },
      data: { pipelineStageId },
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true },
        },
        pipelineStage: {
          select: { id: true, name: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async updateStatus(id: string, status: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    return prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true },
        },
        pipelineStage: {
          select: { id: true, name: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async assign(id: string, assignedUserId: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    const user = await prisma.user.findUnique({ where: { id: assignedUserId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return prisma.lead.update({
      where: { id },
      data: { assignedUserId },
      include: {
        customer: {
          select: { id: true, name: true, companyName: true, phone: true },
        },
        pipelineStage: {
          select: { id: true, name: true },
        },
        assignedUser: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async delete(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });

    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    await prisma.lead.delete({ where: { id } });
    return { message: "Lead deleted successfully" };
  }

  static async getPipeline() {
    const stages = await prisma.pipelineStage.findMany({
      orderBy: { order: "asc" },
      include: {
        leads: {
          where: { status: "OPEN" },
          include: {
            customer: {
              select: { id: true, name: true, companyName: true },
            },
            assignedUser: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return stages;
  }

  static async getStats() {
    const [total, byStatus, byStage, totalValue] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.lead.groupBy({
        by: ["pipelineStageId"],
        _count: { id: true },
        _sum: { value: true },
      }),
      prisma.lead.aggregate({
        _sum: { value: true },
        where: { status: "WON" },
      }),
    ]);

    return {
      total,
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      })),
      byStage: byStage.map((item) => ({
        stageId: item.pipelineStageId,
        count: item._count.id,
        totalValue: item._sum.value || 0,
      })),
      totalWonValue: totalValue._sum.value || 0,
    };
  }
}
