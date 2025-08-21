import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure this points to your auth config
import { prisma } from "@/lib/prismadb";
import { error } from "console";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!oldPassword || !newPassword) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 500 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || !user.password) throw new Error("No user found");

  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) throw new Error("Invalid Password");

  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: newHashedPassword,
    },
  });

  return NextResponse.json({ message : "Password reset successful"}, {status : 200});
}
