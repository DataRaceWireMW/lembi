import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { db } = await connectToDatabase();
    const projects = await db.collection("projects").find({ userId }).toArray();

    return NextResponse.json(projects);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, description } = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection("projects").insertOne({
      name,
      description,
      userId,
      createdAt: new Date(),
    });

    const project = await db.collection("projects").findOne({ _id: result.insertedId });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}