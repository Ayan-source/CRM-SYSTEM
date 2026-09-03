import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "default-secret-change-this",
  databaseUrl: process.env.DATABASE_URL,
  ai: {
    apiKey: process.env.AI_API_KEY || "",
  },
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
  },
  email: {
    apiKey: process.env.EMAIL_API_KEY || "",
  },
};
