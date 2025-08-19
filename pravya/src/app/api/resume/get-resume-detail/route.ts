import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { resumeId } = body;

  // const session = await getServerSession(authOptions);

  // if (!session || !session.user?.email) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const resumeDetails = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      ResumeAnalysis: {
        select: {
          atsScore: true,
        },
      },
    },
  });

  return NextResponse.json({ resumeDetails }, { status: 200 });
}
