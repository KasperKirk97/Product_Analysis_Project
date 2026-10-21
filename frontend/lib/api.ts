const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "/api";
import type { TreemapData, ComparisonData, AirportGroups } from "@/types/api";

export async function getAirports(): Promise<AirportGroups> {
  const response = await fetch(
    `${API_URL}/airports`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch airports");
  }

  return response.json();
}
export async function getProducts(
  airports: string[]
) {
  const response = await fetch(
    `${API_URL}/products?airports=${airports.join(",")}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
export async function getMetadata(
  airports: string[]
) {
  const response = await fetch(
    `${API_URL}/metadata?airports=${airports.join(",")}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch metadata"
    );
  }

  return response.json();
}
export async function getTreemap(
  airports: string[],
  products: string[],
  customerType: string,
  startDate: string,
  endDate: string
): Promise<TreemapData> {
  const params = new URLSearchParams({
    airports: airports.join(","),
    customer_type: customerType,
    start_date: startDate,
    end_date: endDate,
  });

  if (products.length > 0) {
    params.append(
      "products",
      products.join(",")
    );
  }

  const response = await fetch(
    `${API_URL}/treemap?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch treemap data"
    );
  }

  return response.json();
}
export async function getComparison(
  datasetA: string[],
  datasetB: string[],
  products: string[],
  customerType: string,
  startDate: string,
  endDate: string
): Promise<ComparisonData> {

  const params =
    new URLSearchParams({
      dataset_a:
        datasetA.join(","),
      dataset_b:
        datasetB.join(","),
      customer_type:
        customerType,
      start_date:
        startDate,
      end_date:
        endDate,
      products:
        products.join(","),
    });

  const response = await fetch(
    `${API_URL}/comparison?${params}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch comparison data"
    );
  }

  return response.json();
}