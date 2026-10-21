import { AirportGroups } from "@/types/api";
import { useMemo } from "react";

type Props = {
  airports: AirportGroups;
  selectedAirports: string[];
  onChange: (airports: string[]) => void;
};

export default function AirportSelector({
  airports,
  selectedAirports,
  onChange,
}: Props) {
  const toggleAirport = (airport: string) => {
    if (selectedAirports.includes(airport)) {
      onChange(selectedAirports.filter((item) => item !== airport));
    } else {
      onChange([...selectedAirports, airport]);
    }
  };

  const groupedByLetter = useMemo(() => {
    const grouped: Record<string, [string, string[]][]> = {};

    Object.entries(airports).forEach(([realm, organizations]) => {
      const letter = realm.charAt(0).toUpperCase();

      if (!grouped[letter]) {
        grouped[letter] = [];
      }

      grouped[letter].push([realm, organizations]);
    });

    return Object.entries(grouped).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [airports]);

  const letters = groupedByLetter.map(([letter]) => letter);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange(Object.values(airports).flat())}
          className="text-sm text-blue-600 hover:underline"
        >
          Select All
        </button>

        <button
          type="button"
          onClick={() => onChange([])}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="sticky top-0 z-10 bg-white border rounded-lg p-3 flex flex-wrap gap-2">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="px-2 py-1 text-sm rounded border bg-gray-100 hover:bg-gray-200"
          >
            {letter}
          </a>
        ))}
      </div>

      {groupedByLetter.map(([letter, realms]) => (
        <div
          key={letter}
          id={`letter-${letter}`}
          className="space-y-3 scroll-mt-16"
        >
          <h2 className="text-lg font-bold border-b pb-2">
            {letter} ({realms.length})
          </h2>

          <div className="columns-1 md:columns-2 xl:columns-3 gap-4">
            {realms.map(([realm, organizations]) => {
              const allSelected = organizations.every((airport) =>
                selectedAirports.includes(airport)
              );

              return (
                <div
                  key={realm}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm break-inside-avoid mb-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => {
                        if (allSelected) {
                          onChange(
                            selectedAirports.filter(
                              (airport) => !organizations.includes(airport)
                            )
                          );
                        } else {
                          onChange(
                            Array.from(
                              new Set([
                                ...selectedAirports,
                                ...organizations,
                              ])
                            )
                          );
                        }
                      }}
                      className="accent-black h-4 w-4"
                    />

                    <span className="font-semibold capitalize">
                      {realm} ({organizations.length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {organizations.map((airport) => {
                      const selected = selectedAirports.includes(airport);

                      return (
                        <button
                          key={airport}
                          type="button"
                          onClick={() => toggleAirport(airport)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {airport}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
