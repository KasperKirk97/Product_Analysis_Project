type Props = {
  minDate: string;
  maxDate: string;
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
};

export default function DateRangeSelector({
  minDate,
  maxDate,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: Props) {

  function applyQuickDays(
    days: number
  ) {

    const end = new Date(maxDate);

    const start = new Date(end);

    start.setDate(
      start.getDate() - days
    );

    setStartDate(
      start.toISOString().split("T")[0]
    );

    setEndDate(maxDate);
  }

  function applyQuickMonths(
    months: number
  ) {

    const end = new Date(maxDate);

    const start = new Date(end);

    start.setMonth(
      start.getMonth() - months
    );

    setStartDate(
      start.toISOString().split("T")[0]
    );

    setEndDate(maxDate);
  }

  return (
    <div className="space-y-2">

      <label className="font-medium">
        Date Range
      </label>
      <div className="grid lg:grid-cols-[auto_1fr] gap-4 items-end">
        
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              applyQuickDays(30)
            }
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            30 Days
          </button>

          <button
            type="button"
            onClick={() =>
              applyQuickMonths(3)
            }
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            3 Months
          </button>

          <button
            type="button"
            onClick={() =>
              applyQuickMonths(6)
            }
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            6 Months
          </button>

          <button
            type="button"
            onClick={() =>
              applyQuickMonths(12)
            }
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            1 Year
          </button>

          <button
            type="button"
            onClick={() => {
              setStartDate(minDate);
              setEndDate(maxDate);
            }}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            All Time
          </button>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm">
              Start Date
            </label>

            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="text-sm">
              End Date
            </label>

            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="w-full border rounded p-2"
            />
          </div>

        </div>

      </div>

    </div>
  );

}