import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma";
import { config } from "../config";
import { AppError } from "../middleware/error";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "SALES_AGENT";
}

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  static async createUser(data: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || "SALES_AGENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is deactivated", 401);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateUser(id: string, data: Partial<CreateUserInput>) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
      delete updateData.password;
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  static async deleteUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
  }
}
