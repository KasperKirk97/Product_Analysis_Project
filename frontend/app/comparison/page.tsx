"use client";

import { useEffect, useState } from "react";

import AirportSelector from "../../components/AirportSelector";
import ProductSelector from "../../components/ProductSelector";
import CustomerTypeSelector from "../../components/CustomerTypeSelector";
import DateRangeSelector from "../../components/DateRangeSelector";
import ComparisonTreemap from "../../components/ComparisonTreemap";

import { useAirports } from "../hooks/useAirports";
import { useMetadata } from "../hooks/useMetadata";

import type {
  ComparisonData,
  Product,
} from "../../types/api";

import {
  getProducts,
  getComparison,
} from "../../lib/api";

export default function ComparisonPage() {

  const {
    airports,
    loadingAirports,
  } = useAirports();

  const [datasetA, setDatasetA] =
    useState<string[]>([]);

  const [datasetB, setDatasetB] =
    useState<string[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [selectedProducts, setSelectedProducts] =
    useState<string[]>([]);

  const [customerType, setCustomerType] =
    useState("All");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [comparisonData, setComparisonData] =
    useState<ComparisonData | null>(null);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const [loadingComparison, setLoadingComparison] =
    useState(false);

  const [colorRange, setColorRange] =
    useState(100);

  const [initialized, setInitialized] =
    useState(false);

  const {
    minDate,
    maxDate,
    loadingMetadata,
  } = useMetadata(datasetB);

  useEffect(() => {

    if (
      !initialized && airports.length > 1
    ) {
      setDatasetA([airports[0]]);
      setDatasetB([airports[1]]);

      setInitialized(true);
    }

  }, [
    airports,
    initialized,
  ]);

  useEffect(() => {

    if (
      minDate &&
      maxDate
    ) {

      setStartDate(minDate);
      setEndDate(maxDate);

    }

  }, [
    minDate,
    maxDate,
  ]);

  useEffect(() => {

    if (datasetB.length === 0) {
      return;
    }

    setLoadingProducts(true);

    getProducts(datasetB)
      .then((data) => {

        setProducts(data);

        setSelectedProducts((current) => {

          const availableIds =
            data.map(
              (product: Product) =>
                product.id
            );

          const stillAvailable =
            current.filter((id) =>
              availableIds.includes(id)
            );

          return stillAvailable.length > 0
            ? stillAvailable
            : availableIds;

        });

      })
      .finally(() => {
        setLoadingProducts(false);
      });

  }, [datasetB]);

  useEffect(() => {

    if (
      datasetA.length === 0 ||
      datasetB.length === 0 ||
      selectedProducts.length === 0 ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    const timeout = setTimeout(
      async () => {

        try {

          setLoadingComparison(true);

          const data =
            await getComparison(
              datasetA,
              datasetB,
              selectedProducts,
              customerType,
              startDate,
              endDate
            );

          setComparisonData(data);

        } finally {

          setLoadingComparison(false);

        }

      },
      300
    );

    return () =>
      clearTimeout(timeout);

  }, [
    datasetA,
    datasetB,
    selectedProducts,
    customerType,
    startDate,
    endDate,
  ]);

  return (
    <main className="w-full p-8 space-y-8 bg-slate-100 min-h-screen">

      <div>
        <h1 className="text-4xl font-bold">
          Dataset Comparison
        </h1>

        <p className="text-gray-500 mt-2">
          Makes a treemap of dataset B, where the color coding indicates how much more or less each page view is used compared to dataset A.
        </p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">

        <div>
          <h2 className="text-xl font-semibold">
            Filters
          </h2>

          <p className="text-sm text-gray-500">
            Configure the datasets and filters used for comparison.
          </p>
        </div>

        {loadingAirports ? (
          <p>Loading airports...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Dataset A Airports
              </h3>

              <AirportSelector
                airports={airports}
                selectedAirports={datasetA}
                onChange={setDatasetA}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Dataset B Airports
              </h3>

              <AirportSelector
                airports={airports}
                selectedAirports={datasetB}
                onChange={setDatasetB}
              />
            </div>

          </div>
        )}

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : (
          <ProductSelector
            products={products}
            selectedProducts={selectedProducts}
            onChange={setSelectedProducts}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">

          <CustomerTypeSelector
            value={customerType}
            onChange={setCustomerType}
          />

          <div className="space-y-2">

            <label className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Color Range: ±{colorRange}%
            </label>

            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={colorRange}
              onChange={(e) =>
                setColorRange(
                  Number(e.target.value)
                )
              }
              className="w-full"
            />

            <div className="text-sm text-gray-500">
              Controls color saturation for
              percentage differences.
            </div>

          </div>

        </div>

        {loadingMetadata ? (
          <p>Loading date range...</p>
        ) : (
          <DateRangeSelector
            minDate={minDate}
            maxDate={maxDate}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        )}

      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4">

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Comparison Treemap
          </h2>

          <p className="text-sm text-gray-500">
            Comparing Dataset B against Dataset A.
          </p>
        </div>

        <div className="relative">

          {comparisonData && (
            <ComparisonTreemap
              data={comparisonData}
              colorRange={colorRange}
            />
          )}

          {(datasetA.length === 0 ||
            datasetB.length === 0) && (
            <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-white border rounded-lg px-6 py-4 shadow text-center">

                <div className="font-semibold">
                  Action required
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  Select at least one airport in both Dataset A and Dataset B to refresh the visualization.
                </div>

              </div>
            </div>
          )}

          {loadingComparison && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <div className="bg-white border rounded px-4 py-2 shadow">
                Loading comparison...
              </div>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}