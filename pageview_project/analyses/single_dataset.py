import streamlit as st
from pageview_project.constants import(data_dir,PRODUCTS,QUICK_SELECT_OPTIONS)
from data_loader import load_files
from pageview_project.filters import(product_filter,date_filter,customer_filter)
from charts.treemap import plot_view_name_graph

def render_single_dataset():
    csv_files = sorted(
        [file.name for file in data_dir.glob("*.csv")]
    )

    selected_files = st.sidebar.multiselect(
        "Files to include",
        csv_files,
        default=csv_files
    )

    if not selected_files:
        st.warning("Select at least one file")
        st.stop()

    df = load_files(data_dir, tuple(selected_files))

    selected_products = product_filter(df,PRODUCTS)

    if not selected_products:
        st.warning("Select at least one product")
        st.stop()

    df = df[
        df["product_short_name"]
        .isin(selected_products)
    ]

    customer_type = customer_filter()
    if customer_type == "Customers":
        df = df[df["is_copopt_admin"] == False]
    elif customer_type == "CopOpt Admins":
        df = df[df["is_copopt_admin"] == True]


    start_date, end_date = date_filter(df,QUICK_SELECT_OPTIONS)

    filtered_df = df[
        (df["date"] >= start_date)
        &
        (df["date"] <= end_date)
    ]

    fig = plot_view_name_graph(filtered_df)
    st.plotly_chart(fig, width='stretch')