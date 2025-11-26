import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  appName: "LastDance",
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
