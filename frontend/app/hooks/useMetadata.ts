import { useEffect, useState } from "react";
import { getMetadata } from "../../lib/api";

export function useMetadata(
  airports: string[]
) {

  const [minDate, setMinDate] =
    useState("");

  const [maxDate, setMaxDate] =
    useState("");

  const [loadingMetadata, setLoadingMetadata] =
    useState(false);

  useEffect(() => {

    if (airports.length === 0) {
      return;
    }

    setLoadingMetadata(true);

    getMetadata(airports)
      .then((data) => {

        setMinDate(data.min_date);
        setMaxDate(data.max_date);

      })
      .finally(() => {
        setLoadingMetadata(false);
      });

  }, [airports]);

  return {
    minDate,
    maxDate,
    loadingMetadata,
  };

}