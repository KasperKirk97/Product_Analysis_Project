"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(
  () => import("react-plotly.js"),
  {
    ssr: false,
  }
);
import type { TreemapData } from "../types/api.ts";

type TreemapProps = {
  data: TreemapData;
};

export default function Treemap({
  data,
}: TreemapProps) {

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

          parents: data.parents,

          values: data.log_views,

          branchvalues: "remainder",

          customdata: data.ids.map(
            (_, index) => [
              data.views[index],
              data.users[index],
              data.percent_root[index],
              data.ids[index],
              data.percent_users[index]
            ]
          ),

          texttemplate:
            "%{label}<br>" +
            "%{customdata[0]:.0f} views<br>" +
            "%{customdata[1]:.0f} users<br>" +
            "%{customdata[2]:.2f}% views<br>" +
            "%{customdata[4]:.2f}% users",

          hovertemplate:
            "<b>%{customdata[3]}</b><br>" +
            "Views: %{customdata[0]:.0f}<br>" +
            "Users: %{customdata[1]:.0f}<br>" +
            "Views Percentage: %{customdata[2]:.2f}%<br>" +
            "Users Percentage: %{customdata[4]:.2f}%</a>",

          marker: {
            line: {
              color: "black",
              width: 0.5,
            },
          },
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