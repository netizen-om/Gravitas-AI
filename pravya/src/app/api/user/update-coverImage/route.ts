import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import cloudinary from "@/lib/cloudinary";

export async function POST(req : Request) {

}