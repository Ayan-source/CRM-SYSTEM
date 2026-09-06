import prisma from "../config/prisma.js";
import { AppError } from "../middleware/error.js";

interface CreateCustomerInput {
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  source?: string;
  assignedUserId?: string;
}

interface UpdateCustomerInput extends Partial<CreateCustomerInput> {}

interface CustomerFilters {
  search?: string;
  source?: string;
  assignedUserId?: string;
  city?: string;
}

export class CustomerService {
  static async create(data: CreateCustomerInput) {
    if (data.email) {
      const existingEmail = await prisma.customer.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new AppError("Customer with this email already exists", 400);
      }
    }

    if (data.phone) {
      const existingPhone = await prisma.customer.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        throw new AppError("Customer with this phone already exists", 400);
      }
    }

    return prisma.customer.create({
      data,
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async getAll(filters: CustomerFilters) {
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { companyName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search } },
      ];
    }

    if (filters.source) {
      where.source = filters.source;
    }

    if (filters.assignedUserId) {
      where.assignedUserId = filters.assignedUserId;
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }

    return prisma.customer.findMany({
      where,
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { leads: true, conversations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
        leads: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        conversations: {
          orderBy: { lastMessageAt: "desc" },
          take: 5,
          include: {
            messages: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
        tasks: {
          where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
          orderBy: { dueDate: "asc" },
          take: 5,
        },
        notes: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { leads: true, conversations: true, tasks: true },
        },
      },
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    return customer;
  }

  static async update(id: string, data: UpdateCustomerInput) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    if (data.email && data.email !== customer.email) {
      const existingEmail = await prisma.customer.findUnique({
        where: { email: data.email },
      });
      if (existingEmail) {
        throw new AppError("Email already in use", 400);
      }
    }

    if (data.phone && data.phone !== customer.phone) {
      const existingPhone = await prisma.customer.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        throw new AppError("Phone already in use", 400);
      }
    }

    return prisma.customer.update({
      where: { id },
      data,
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async delete(id: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    await prisma.customer.delete({ where: { id } });
    return { message: "Customer deleted successfully" };
  }

  static async getStats() {
    const [total, bySource, recentlyAdded] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.groupBy({
        by: ["source"],
        _count: { id: true },
      }),
      prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          companyName: true,
          source: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      total,
      bySource: bySource.map((item) => ({
        source: item.source,
        count: item._count.id,
      })),
      recentlyAdded,
    };
  }
}
