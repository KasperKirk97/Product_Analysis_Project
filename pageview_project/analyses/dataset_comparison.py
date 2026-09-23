import streamlit as st
from pageview_project.constants import(data_dir,PRODUCTS,QUICK_SELECT_OPTIONS)
from data_loader import load_files
from pageview_project.filters import(product_filter,date_filter,customer_filter,apply_customer_filter)
from charts.treemap import plot_comparison_graph

def render_dataset_comparison():
    csv_files = sorted(
            [file.name for file in data_dir.glob("*.csv")]
        )
    st.header("Dataset Comparison")
    st.text("This function makes a tree map of dataset B, where the coloring indicates how much more or less a page view is used than in dataset A. The comparison is based on percentage differences.")
    dataset_a = st.multiselect(
        "Dataset A",
        csv_files,
        default=[csv_files[0]] if csv_files else []
    )

    dataset_b = st.multiselect(
        "Dataset B",
        csv_files,
        default=[csv_files[-1]] if csv_files else []
    )
    if not dataset_a or not dataset_b:
        st.warning("Select at least one file in each dataset")
        st.stop()
    df_a = load_files(data_dir, tuple(dataset_a))
    df_b = load_files(data_dir, tuple(dataset_b))

    selected_products = product_filter(df_b,PRODUCTS)

    if not selected_products:
        st.warning("Select at least one product")
        st.stop()

    df_a = df_a[df_a["product_short_name"].isin(selected_products)]
    df_b = df_b[df_b["product_short_name"].isin(selected_products)]

    customer_type = customer_filter()
    df_a = apply_customer_filter(df_a,customer_type)
    df_b = apply_customer_filter(df_b,customer_type)

    start_date, end_date = date_filter(df_b,QUICK_SELECT_OPTIONS)

    filtered_df_a = df_a[(df_a["date"] >= start_date) & (df_a["date"] <= end_date)]
    filtered_df_b = df_b[(df_b["date"] >= start_date) & (df_b["date"] <= end_date)]

    color_range = st.sidebar.slider(
        "Color Scale Range (%)",
        min_value=10,
        max_value=500,
        value=100,
        step=10,
        help="Controls how quickly colors saturate. Lower values give stronger colors."
    )
    fig = plot_comparison_graph(filtered_df_a,filtered_df_b,color_range)
    st.plotly_chart(fig, width='stretch')