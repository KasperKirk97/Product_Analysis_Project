type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CustomerTypeSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Customer Type
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border rounded p-2"
      >
        <option value="All">
          All
        </option>

        <option value="Customers">
          Customers
        </option>

        <option value="CopOpt Admins">
          CopOpt Admins
        </option>
      </select>
    </div>
  );
}