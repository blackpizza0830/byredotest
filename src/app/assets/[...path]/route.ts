import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const MIME_MAP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  woff: "font/woff",
  woff2: "font/woff2",
  exr: "image/x-exr",
  glb: "model/gltf-binary",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
): Promise<NextResponse> {
  const relativePath = params.path.join("/");
  const filePath = path.join(process.cwd(), "assets", relativePath);

  try {
    const file = await readFile(filePath);
    const ext = relativePath.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = MIME_MAP[ext] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }
}
