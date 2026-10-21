import { useEffect, useState } from "react";
import { getAirports } from "../../lib/api";
import { AirportGroups } from "@/types/api";

export function useAirports() {

  const [airports, setAirports] =
    useState<AirportGroups>({});

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