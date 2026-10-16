"use client";

import Plot from "react-plotly.js";
import type { ComparisonData } from "../types/api.ts";

type Props = {
  data: ComparisonData;
  colorRange?: number;
};

export default function ComparisonTreemap({
  data,
  colorRange = 100,
}: Props) {
  return (
    <Plot
      data={[
        {
          type: "treemap",

          ids: data.ids,
          
          labels: data.ids.map(
            (id) =>
              id.split(".").at(-1) ?? id
          ),

          parents: data.parents_b,

          values: data.log_values_b,

          branchvalues: "remainder",

          customdata: data.ids.map(
            (_, index) => [
              data.views_b[index],
              data.users_b[index],
              data.percent_root_b[index],
              data.percent_root_a[index],
              data.view_change_pct[index],
              data.ids[index],
            ]
          ),

          marker: {
            colors: data.view_change_pct,

            colorscale: [
              [0, "#810101"],
            [0.5, "#dfcd7e"],
            [1, "#087011"]
            ],

            cmin: -colorRange,
            cmax: colorRange,
            cmid: 0,

            line: {
              color: "black",
              width: 0.5,
            },

            colorbar: {
              title:
                "% Change vs A",
            },
          },

          texttemplate:
            "%{label}<br>" +
            "%{customdata[0]:.0f} views<br>" +
            "%{customdata[1]:.0f} users<br>" +
            "%{customdata[2]:.2f}% in B<br>"+
            "%{customdata[3]:.2f}% in A",

          hovertemplate:
            "<b>%{customdata[5]}</b><br>" +
            "Views: %{customdata[0]:.0f}<br>" +
            "Users: %{customdata[1]:.0f}<br>" +
            "Share B: %{customdata[2]:.2f}%<br>" +
            "Share A: %{customdata[3]:.2f}%<br>" +
            "Difference: %{customdata[4]:.2f}%<extra></extra>",
        },
      ]}
      layout={{
        height: 1000,

        margin: {
          t: 20,
          l: 10,
          r: 10,
          b: 10,
        },
      }}
      useResizeHandler
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}