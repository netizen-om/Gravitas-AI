import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();
const PORT = 3001;

const prisma = new PrismaClient();

app.get("/check", async (req: Request, res: Response) => {
  try {
    // Fetch all users from the "user" table
    const users = await prisma.user.findMany();

    res.status(200).json({
      message: "✅ Prisma connection successful!",
      data: users,
    });
  } catch (error) {
    console.error("❌ Prisma error:", error);
    res.status(500).json({
      message: "❌ Error connecting to Prisma",
      error: error instanceof Error ? error.message : error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
