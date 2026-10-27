import streamlit as st
from constants import(data_dir,PRODUCTS,QUICK_SELECT_OPTIONS)
from database.data_loader import load_files
from filters import(product_filter2,date_filter,customer_filter)
from charts.treemap import plot_view_name_graph
from database.data_loader import(get_available_airports,load_page_views,get_available_products)

def render_single_dataset():
    airports = get_available_airports()

    selected_airports = st.sidebar.multiselect(
        "Select Airports",
        airports,
        default=airports
    )

    if not selected_airports:
        st.warning("Select at least one airport.")
        st.stop()

    available_products = get_available_products(selected_airports)
    selected_products = product_filter2(available_products,PRODUCTS)

    if not selected_products:
        st.warning("Select at least one product.")
        st.stop()
    
    df = load_page_views(selected_airports,selected_products)

    

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