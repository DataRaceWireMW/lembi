import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!name || !file) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Here you would typically upload the file to a storage service like AWS S3
    // For this example, we'll just create a fake URL
    const url = `https://fake-storage.com/${file.name}`;

    const { db } = await connectToDatabase();
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(params.id), userId },
      {
        $push: {
          documents: {
            _id: new ObjectId(),
            name,
            url,
            uploadedAt: new Date(),
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json({ _id: new ObjectId(), name, url });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}