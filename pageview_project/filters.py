import streamlit as st
from datetime import timedelta

def product_filter(df,products):
    available_products = sorted(
        df["product_short_name"]
        .dropna()
        .unique()
    )

    selected_products = st.sidebar.multiselect(
        "Products",
        available_products,
        default=available_products,
        format_func=lambda x: products.get(x, x)
    )
    return selected_products

def customer_filter():
    customer_type = st.sidebar.radio(
        "User Type",
        [
            "All",
            "Customers",
            "CopOpt Admins"
        ]
    )
    return customer_type

def apply_customer_filter(df, customer_type):

    if customer_type == "Customers":
        return df[df["is_copopt_admin"] == False]

    if customer_type == "CopOpt Admins":
        return df[df["is_copopt_admin"] == True]

    return df

def date_filter(df,quick_select_options):
    min_date = df["date"].min()
    max_date = df["date"].max()

    if "date_range" not in st.session_state:
        st.session_state.date_range = (min_date, max_date)

    st.header("Filters")
    col1, col2 = st.columns([3, 2])
    with col2:
        preset = st.segmented_control(
            "Quick Select",
            [
                "30 Days",
                "3 Months",
                "6 Months",
                "1 Year",
                "All Time"
            ]
        )
        if preset in quick_select_options:
            st.session_state.date_range = (
                max_date - timedelta(days=quick_select_options[preset]),
                max_date

            )
        elif preset == "All Time":
            st.session_state.date_range = (
                min_date,
                max_date
            )
    with col1:
        start_date, end_date = st.slider(
            "Date range",
            min_value=min_date,
            max_value=max_date,
            value=st.session_state.date_range
        )
        # Update state if slider is moved manually
        st.session_state.date_range = (
            start_date,
            end_date,
        )
    return start_date, end_date