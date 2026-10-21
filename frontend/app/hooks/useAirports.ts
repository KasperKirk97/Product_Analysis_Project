import { useEffect, useState } from "react";
import { getAirports } from "../../lib/api";

export function useAirports() {

  const [airports, setAirports] =
    useState<Record<string, string[]>>({});

  const [loadingAirports, setLoadingAirports] =
    useState(true);

  useEffect(() => {

    getAirports()
      .then((data) => {
        setAirports(data);
      })
      .finally(() => {
        setLoadingAirports(false);
      });

  }, []);

  return {
    airports,
    loadingAirports,
  };

}