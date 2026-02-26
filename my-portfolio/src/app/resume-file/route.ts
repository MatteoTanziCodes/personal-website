import { readdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

const RESUME_PREFIX = "Matteo_Tanzi_Resume";

export async function GET(request: Request) {
  const publicDir = path.join(process.cwd(), "public");
  const files = await readdir(publicDir);

  const resumes = files
    .filter((file) => file.startsWith(RESUME_PREFIX) && file.toLowerCase().endsWith(".pdf"))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  const latestResume = resumes[0];
  if (!latestResume) {
    return new NextResponse("No resume PDF found in /public", { status: 404 });
  }

  return NextResponse.redirect(new URL(`/${latestResume}`, request.url));
}
