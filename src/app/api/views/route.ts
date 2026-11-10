import { NextResponse } from "next/server";
// boot skips the next visit

// server-side api route fetching real pageviews from vercel web analytics basically
// proxies the request so read tokens stay securely on the server instead of leaking to client bundles
// gracefully returns null if tokens are absent so local dev doesn't spam errors ( for now ig )

// vercel analytics count api token stays on the server

const PROJECT_ID= 
  process.env.VERCEL_PROJECT_ID ?? "prj_HfGSkftsNVZUnTcKC7Ygj3qNvTWg";
const TEAM_ID =process.env.VERCEL_ORG_ID ?? "team_kfUhJhsttwMs5ZEvtkTlUFCa";

export const dynamic= "force-dynamic";

type AnalyticsCount ={
  data?: { pageviews?: number; visitors?: number };
};

// token resolution: prefer the dedicated read token, fall back to the vercel
// cli token. empty string means "no views shown", chip degrades gracefully.
function readToken() {
  return process.env.ANALYTICS_READ_TOKEN || process.env.VERCEL_TOKEN || "";
}

async function countPageviews(token: string) {
  const url= new URL("https://api.vercel.com/v1/query/web-analytics/visits/count");
  url.searchParams.set("projectId", PROJECT_ID);
  url.searchParams.set("teamId", TEAM_ID);

  const res =await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const json= (await res.json()) as AnalyticsCount & {
    error?: { code?: string; message?: string };
  };

  if (!res.ok) {
    console.error("[views] analytics count failed", res.status, json.error?.code);
    return null;
  }

  const views =json.data?.pageviews;
  if (typeof views !== "number" || !Number.isFinite(views)) return null;
  return views;
}

export async function GET() {
  const token= readToken();
  if (!token) {
    return NextResponse.json({ views: null }, { status: 200 });
  }

  try {
    const views =await countPageviews(token);
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
