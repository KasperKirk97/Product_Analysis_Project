"use client";

import { useEffect, useState } from "react";

import AirportSelector from "../components/AirportSelector";
import ProductSelector from "../components/ProductSelector";
import CustomerTypeSelector from "../components/CustomerTypeSelector";
import DateRangeSelector from "../components/DateRangeSelector";
import Treemap from "../components/Treemap";

import { useAirports } from "./hooks/useAirports";
import { useMetadata } from "./hooks/useMetadata";

import type {
  TreemapData,
  Product,
} from "../types/api";

import {
  getProducts,
  getTreemap,
} from "../lib/api";

export default function Home() {

  const {
    airports,
    loadingAirports,
  } = useAirports();

  const [
    selectedAirports,
    setSelectedAirports,
  ] = useState<string[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [
    selectedProducts,
    setSelectedProducts,
  ] = useState<string[]>([]);

  const [customerType, setCustomerType] =
    useState("All");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [treemapData, setTreemapData] =
    useState<TreemapData | null>(null);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(false);

  const [
    loadingTreemap,
    setLoadingTreemap,
  ] = useState(false);

  const {
    minDate,
    maxDate,
    loadingMetadata,
  } = useMetadata(selectedAirports);

  const [initialized, setInitialized] =
    useState(false);
  
  useEffect(() => {

    if (
      airports.length > 0 && !initialized
    ) {
      setSelectedAirports(airports);
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

    if (selectedAirports.length === 0) {
      setProducts([]);
      setSelectedProducts([]);
      return;
    }

    setLoadingProducts(true);

    getProducts(selectedAirports)
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

  }, [selectedAirports]);

  async function loadTreemap() {

    try {

      setLoadingTreemap(true);

      const data =
        await getTreemap(
          selectedAirports,
          selectedProducts,
          customerType,
          startDate,
          endDate
        );

      setTreemapData(data);

    } finally {

      setLoadingTreemap(false);

    }

  }

  useEffect(() => {

    if (
      selectedAirports.length === 0 ||
      selectedProducts.length === 0 ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    const timeout = setTimeout(
      () => {
        loadTreemap();
      },
      300
    );

    return () =>
      clearTimeout(timeout);

  }, [
    selectedAirports,
    selectedProducts,
    customerType,
    startDate,
    endDate,
  ]);

  return (
    <main className="p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Page View Analytics
      </h1>

      {loadingAirports ? (
        <p>Loading airports...</p>
      ) : (
        <AirportSelector
          airports={airports}
          selectedAirports={selectedAirports}
          onChange={setSelectedAirports}
        />
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

      <CustomerTypeSelector
        value={customerType}
        onChange={setCustomerType}
      />

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

      <div className="relative">

        {treemapData && (
          <Treemap
            data={treemapData}
          />
        )}

        {selectedAirports.length === 0 && (
          <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-white border rounded-lg px-6 py-4 shadow text-center">
              <div className="font-semibold">
                Action required
              </div>

              <div className="text-sm text-gray-500 mt-1">
                Select at least one airport to refresh the visualization.
              </div>
            </div>
          </div>
        )}

        {loadingTreemap && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="bg-white border rounded px-4 py-2 shadow">
              Loading treemap...
            </div>
          </div>
        )}

      </div>

    </main>
  );
}