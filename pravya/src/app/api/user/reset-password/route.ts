import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // make sure this points to your auth config
import { prisma } from "@/lib/prismadb";