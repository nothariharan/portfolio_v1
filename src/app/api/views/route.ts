import { NextResponse } from "next/server";

/**
 * Public view count for the landing eye chip.
 * Reads Vercel Web Analytics (production totals since it was enabled).
 * Token stays server-side — never NEXT_PUBLIC.
 */

const PROJECT_ID =
  process.env.VERCEL_PROJECT_ID ?? "prj_HfGSkftsNVZUnTcKC7Ygj3qNvTWg";
const TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_kfUhJhsttwMs5ZEvtkTlUFCa";

export const revalidate = 60;

type AnalyticsCount = {
  data?: { pageviews?: number; visitors?: number };
};

export async function GET() {
  const token = process.env.ANALYTICS_READ_TOKEN;
  if (!token) {
    return NextResponse.json({ views: null }, { status: 200 });
  }

  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
  url.searchParams.set("projectId", PROJECT_ID);
  url.searchParams.set("teamId", TEAM_ID);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ views: null }, { status: 200 });
    }

    const json = (await res.json()) as AnalyticsCount;
    const views = json.data?.pageviews;
    if (typeof views !== "number" || !Number.isFinite(views)) {
      return NextResponse.json({ views: null }, { status: 200 });
    }

    return NextResponse.json(
      { views },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return NextResponse.json({ views: null }, { status: 200 });
  }
}
