from dataclasses import dataclass
from functools import lru_cache
import plotly.graph_objects as go
import math
import pandas as pd
import numpy as np

@dataclass
class TreemapData:
    ids: list
    parents: list
    views: list
    users: list
    log_views: list
    percent_root: list
    percent_users: list

@dataclass
class ComparisonData:
    ids: list
    parents_b: list
    views_b: list
    users_b: list
    log_values_b: list
    percent_root_b: list
    percent_root_a: list
    view_change_pct: list

@lru_cache(maxsize=None)
def get_nodes(path):
    parts = path.split(".")

    return [
        (
            ".".join(parts[:i + 1]),
            "" if i == 0 else ".".join(parts[:i])
        )
        for i in range(len(parts))
    ]

def build_treemap_data(df):
    grouped = (
        df.groupby("view_name")
        .agg(
            views=("views", "sum"),
            users=(
                "user_id",
                lambda x: set(x)
            ),
        )
    )
    nodes = {}
    for path, row in grouped.iterrows():
        views = row["views"]
        users = row["users"]

        for node, parent in get_nodes(path):

            if node not in nodes:
                nodes[node] = {
                    "parent": parent,
                    "views": 0,
                    "users": set()
                }

            nodes[node]["views"] += views
            nodes[node]["users"].update(users)
    
    ids = list(nodes.keys())
    parents = [nodes[n]["parent"] for n in ids]
    views = [nodes[n]["views"] for n in ids]
    users = [len(nodes[n]["users"]) for n in ids]
    log_values = [math.log1p(v) for v in views] # Used for scaling of visualization

    # Calculate percentage of total views
    root_indices = [
        i for i, parent in enumerate(parents)
        if parent == ""
    ]
    total_views = sum(views[i] for i in root_indices)
    total_users = sum(users[i] for i in root_indices)

    percent_root = [
        100 * v / total_views
        for v in views
    ]
    percent_users = [
            100 * u / total_users
            for u in users
    ]
    return TreemapData(
        ids = ids,
        parents = parents,
        views = views,
        users = users,
        log_views = log_values,
        percent_root = percent_root,
        percent_users = percent_users
    )

def build_comparison_data(df_a,df_b):
    a = build_treemap_data(df_a)
    b = build_treemap_data(df_b)

    a_df = pd.DataFrame({
            "id" : a.ids,
            "parents" : a.parents,
            "views" : a.views,
            "users" : a.users,
            "log_values" : a.log_views,
            "percent_root" : a.percent_root
    })
    b_df = pd.DataFrame({
                "id" : b.ids,
                "parents" : b.parents,
                "views" : b.views,
                "users" : b.users,
                "log_values" : b.log_views,
                "percent_root" : b.percent_root
    })

    comparison = (
        b_df
        .merge(
            a_df,
            on="id",
            how="outer",
            suffixes=("_b", "_a")
        )
        .fillna(0)
    )

    comparison = comparison[comparison["views_b"] > 0]

    comparison["view_change_pct"] = np.where(
        comparison["percent_root_b"] == 0, 100,
        100 *
        (comparison["percent_root_b"] - comparison["percent_root_a"])
        / comparison["percent_root_b"]
    )

    return ComparisonData(
        ids=comparison["id"].tolist(),
        parents_b=comparison["parents_b"].tolist(),
        views_b=comparison["views_b"].tolist(),
        users_b=comparison["users_b"].tolist(),
        log_values_b = comparison["log_values_b"].tolist(),
        percent_root_b=comparison["percent_root_b"].tolist(),
        percent_root_a=comparison["percent_root_a"].tolist(),
        view_change_pct=comparison["view_change_pct"].tolist(),
    )

def plot_comparison_graph(df_a,df_b,color_range):
    comparison = build_comparison_data(df_a,df_b)

    customdata = list(zip(
        comparison.views_b, 
        comparison.users_b, 
        comparison.percent_root_b, 
        comparison.percent_root_a
    ))
    fig = go.Figure(
        go.Treemap(
            ids=comparison.ids,
            labels = [node.split(".")[-1] for node in comparison.ids],
            parents = comparison.parents_b,
            values = comparison.log_values_b,
            branchvalues="remainder",
            customdata=customdata,
            texttemplate=(
                "%{label}<br>"
                "%{customdata[0]:r,.0f} views<br>"
                "%{customdata[1]:r,.0f} users<br>"
                "%{customdata[2]:.3f}% of views in B<br>"
                "%{customdata[3]:.3f}% of views in A"
            ),
            hovertemplate=(
                "<b>%{ids}</b><br>"
                "Views: %{customdata[0]:r,.0f}<br>"
                "Users: %{customdata[1]:r,.0f}<br>"
                "Share B: %{customdata[2]:.3f}% of total views<br>"
                "Share A: %{customdata[3]:.3f}% of total views"
                "<extra></extra>"
            ),
            marker=dict(
                colors=comparison.view_change_pct,
                colorscale="RdYlGn",
                cmin = -color_range,
                cmax = color_range,
                cmid=0,
                line=dict(
                color="black",
                width=0.5
                ),
                colorbar=dict(
                    title="% Change vs A"
                )
            )
        )
    )
    fig.update_layout(height=1000)
    return fig 

def plot_view_name_graph(df):
    info = build_treemap_data(df)
    # Plot
    customdata = list(zip(info.views, info.users, info.percent_root))
    fig = go.Figure(
        go.Treemap(
            ids=info.ids,
            labels = [node.split(".")[-1] for node in info.ids],
            parents = info.parents,
            values = info.log_views,
            branchvalues="remainder",
            customdata=customdata,
            texttemplate=(
                "%{label}<br>"
                "%{customdata[0]:r,.0f} views<br>"
                "%{customdata[1]:r,.0f} users<br>"
                "%{customdata[2]:.3f}% of views"
            ),
            hovertemplate=(
                "<b>%{ids}</b><br>"
                "Views: %{customdata[0]:r,.0f}<br>"
                "Users: %{customdata[1]:r,.0f}<br>"
                "Share: %{customdata[2]:.3f}% of total views"
                "<extra></extra>"
            )
        )
    )
    fig.update_layout(height=1000)
    return fig