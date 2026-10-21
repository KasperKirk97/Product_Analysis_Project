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
      onChange(
        selectedAirports.filter(
          (item) => item !== airport
        )
      );
    } else {
      onChange([
        ...selectedAirports,
        airport,
      ]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() =>
            onChange(
              Object.values(airports).flat()
            )
          }
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

      {Object.entries(airports).map(
        ([realm, organizations]) => (
          <div key={realm} className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-600">
              {realm}
            </h3>

            <div className="flex flex-wrap gap-2">
              {organizations.map((airport) => {
                const selected =
                  selectedAirports.includes(
                    airport
                  );

                return (
                  <button
                    key={airport}
                    type="button"
                    onClick={() =>
                      toggleAirport(
                        airport
                      )
                    }
                    className={`
                      px-3 py-2 rounded-lg border transition-colors
                      ${
                        selected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                      }
                    `}
                  >
                    {airport}
                  </button>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}
