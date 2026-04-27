import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseApp, getStorageBucket } from "@/lib/firebase-admin";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const token = authHeader.slice(7);
    await getAuth(getFirebaseApp()).verifyIdToken(token);
  } catch {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "sections";

  if (!file) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${folder}/${Date.now()}_${file.name}`;
  const bucket = getStorageBucket();
  const storageFile = bucket.file(filename);

  await storageFile.save(buffer, {
    metadata: { contentType: file.type },
  });
  await storageFile.makePublic();

  const url = `https://storage.googleapis.com/${bucket.name}/${filename}`;
  return NextResponse.json({ url }, { headers: CORS_HEADERS });
}
