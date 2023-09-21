import { PoolRaw, queryPaginatedPools } from "../../queries/complex/pools";
import { isNumeric } from "../../utils/assertion";

type Response = {
  pools: PoolRaw[];
};

export default async function pools(req: Request) {
  const url = new URL(req.url);
  // Default values for page and limit
  const page = url.searchParams.has("page")
    ? Number(url.searchParams.get("page") as string)
    : 1;
  const limit = url.searchParams.has("limit")
    ? Number(url.searchParams.get("limit") as string)
    : 100;
  const minimumLiquidity = isNumeric(url.searchParams.get("min_liquidity"))
    ? Number(url.searchParams.get("min_liquidity") as string)
    : undefined;

  const { status, pools } = await queryPaginatedPools({
    page,
    limit,
    minimumLiquidity,
  });
  const response: Response = { pools };

  if (pools) {
    return new Response(JSON.stringify(response), { status });
  }
  return new Response("", { status });
}

export const config = {
  runtime: "experimental-edge",
  regions: ["cdg1"], // Only execute this function in the Paris region
};
