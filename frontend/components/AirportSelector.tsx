import { AirportGroups } from "@/types/api";

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

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.entries(airports).map(([realm, organizations]) => {
          const allSelected = organizations.every((airport) =>
            selectedAirports.includes(airport)
          );

          return (
            <div
              key={realm}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
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
  );
}
