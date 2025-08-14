import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prismadb";
import { Readable } from "stream";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const originalFileName = file.name.replace(/\.[^/.]+$/, ""); // keep unmodified name
    const uniqueFileName = `${session.user.id}-${originalFileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with custom filename
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            public_id: uniqueFileName, // custom name in Cloudinary
            resource_type: "raw",
            overwrite: false, // avoid replacing existing files
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

    const result: any = await uploadStream();
    console.log("Cloudinary PDF URL:", result.secure_url);

    const pdfUrl = result.secure_url.endsWith(".pdf") ? result.secure_url
      : `${result.secure_url}.pdf`;

    const savedResume = await prisma.resume.create({
      data : {
        userId: session.user.id,
        fileName: originalFileName,
        fileUrl: result.secure_url,
        publicId: result.public_id,
      }
    })

    return NextResponse.json({ success: true, resume: savedResume });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}