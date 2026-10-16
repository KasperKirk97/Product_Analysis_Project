import type { Product } from "../types/api";

type Props = {
  products: Product[];
  selectedProducts: string[];
  onChange: (products: string[]) => void;
};

export default function ProductSelector({
  products,
  selectedProducts,
  onChange,
}: Props) {

  const toggleProduct = (
    productId: string
  ) => {

    if (
      selectedProducts.includes(
        productId
      )
    ) {

      onChange(
        selectedProducts.filter(
          (id) =>
            id !== productId
        )
      );

    } else {

      onChange([
        ...selectedProducts,
        productId,
      ]);

    }
  };

  return (
    <div className="space-y-3">

      <div className="flex items-center justify-between">

        <label className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Products
        </label>

        <div className="flex gap-4">

          <button
            type="button"
            onClick={() =>
              onChange(
                products.map(
                  (product) =>
                    product.id
                )
              )
            }
            className="text-sm text-blue-600 hover:underline"
          >
            Select All
          </button>

          <button
            type="button"
            onClick={() =>
              onChange([])
            }
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>

        </div>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">

        {products.map(
          (product) => (

            <label
              key={product.id}
              className={`
                flex items-center gap-2
                p-2 rounded border
                cursor-pointer transition-colors
                ${
                  selectedProducts.includes(product.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }
              `}
            >

              <input
                type="checkbox"
                checked={selectedProducts.includes(
                  product.id
                )}
                onChange={() =>
                  toggleProduct(
                    product.id
                  )
                }
                className="accent-black w-4 h-4"
              />

              <span>
                {product.name}
              </span>

            </label>
          )
        )}

      </div>

    </div>
  );
}