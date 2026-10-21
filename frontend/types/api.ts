export type TreemapData = {
  ids: string[];
  parents: string[];
  views: number[];
  users: number[];
  log_views: number[];
  percent_root: number[];
};

export type ComparisonData = {
  ids: string[];
  parents_b: string[];
  views_b: number[];
  users_b: number[];
  log_values_b: number[];
  percent_root_b: number[];
  percent_root_a: number[];
  view_change_pct: number[];
};

export type Product = {
  id: string;
  name: string;
};

export type AirportGroups = Record<
  string,
  string[]
>;