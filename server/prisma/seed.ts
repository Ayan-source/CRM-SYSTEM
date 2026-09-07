import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@crm.com";
  const adminPassword = "admin123";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  const stages = [
    { id: "new-lead", name: "New Lead", order: 1 },
    { id: "contacted", name: "Contacted", order: 2 },
    { id: "qualified", name: "Qualified", order: 3 },
    { id: "quotation-sent", name: "Quotation Sent", order: 4 },
    { id: "negotiation", name: "Negotiation", order: 5 },
    { id: "won", name: "Won", order: 6 },
  ];

  for (const stage of stages) {
    await prisma.pipelineStage.upsert({
      where: { id: stage.id },
      update: {},
      create: stage,
    });
  }

  console.log("Pipeline stages seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
