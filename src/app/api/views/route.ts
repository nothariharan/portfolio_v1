import { NextResponse } from "next/server";

/**
 * Public view count for the landing eye chip.
 * Official Web Analytics count API:
 * https://vercel.com/docs/analytics/web-analytics-api
 *
 * Needs ANALYTICS_READ_TOKEN — a valid Vercel access token
 * (Account → Tokens, team or project scope). Token stays server-side.
 */

const PROJECT_ID =
  process.env.VERCEL_PROJECT_ID ?? "prj_HfGSkftsNVZUnTcKC7Ygj3qNvTWg";
const TEAM_ID = process.env.VERCEL_ORG_ID ?? "team_kfUhJhsttwMs5ZEvtkTlUFCa";

export const dynamic = "force-dynamic";

type AnalyticsCount = {
  data?: { pageviews?: number; visitors?: number };
};

function readToken() {
  return process.env.ANALYTICS_READ_TOKEN || process.env.VERCEL_TOKEN || "";
}

async function countPageviews(token: string) {
  const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
  url.searchParams.set("projectId", PROJECT_ID);
  url.searchParams.set("teamId", TEAM_ID);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const json = (await res.json()) as AnalyticsCount & {
    error?: { code?: string; message?: string };
  };

  if (!res.ok) {
    console.error("[views] analytics count failed", res.status, json.error?.code);
    return null;
  }

  const views = json.data?.pageviews;
  if (typeof views !== "number" || !Number.isFinite(views)) return null;
  return views;
}

export async function GET() {
  const token = readToken();
  if (!token) {
    return NextResponse.json({ views: null }, { status: 200 });
  }

  try {
    const views = await countPageviews(token);
    return NextResponse.json(
      { views },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    console.error("[views] analytics count threw", err);
    return NextResponse.json({ views: null }, { status: 200 });
  }
}
