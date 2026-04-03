import { NextResponse } from "next/server";
import { getRecentProjects } from "@/lib/projects";

const DEFAULT_LIMIT = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit) ? rawLimit : DEFAULT_LIMIT;
  const projects = await getRecentProjects(limit);

  return NextResponse.json(
    { projects },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
