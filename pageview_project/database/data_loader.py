import pandas as pd
from pageview_project.database.connection import (get_connection)

def load_files(data_dir, selected_files):
    frames = [ pd.read_csv(data_dir / filename) for filename in selected_files]

    if not frames:
        return pd.DataFrame()
    
    df = pd.concat(frames,ignore_index=True)
    #df["timestamp_utc"] = pd.to_datetime(df["timestamp_utc"], format="mixed")
    df["date"] = pd.to_datetime(df["timestamp_utc"], format="mixed").dt.date
    return df


def load_page_views(selected_airports,selected_products=None,customer_type="All",start_date=None,end_date=None):
    print("QUERYING DATABASE")
    query = """
    SELECT *
    FROM public.global_usage
    WHERE organization_id = ANY(%(airports)s)
    AND view_name LIKE 'app%%'
    """
    params = {
        "airports": selected_airports
    }

    if selected_products:
        query += """
        AND product_short_name = ANY(%(products)s)
        """
        params["products"] = selected_products

    if customer_type == "Customers":
        query += """ AND is_copopt_admin = FALSE"""
    elif customer_type == "CopOpt Admins":
        query += """ AND is_copopt_admin = TRUE"""

    if start_date:
        query += """ AND day_utc >= %(start_date)s"""
        params["start_date"] = start_date

    if end_date:
        query += """ AND day_utc <= %(end_date)s"""
        params["end_date"] = end_date

    with get_connection() as conn:

        df = pd.read_sql(
            query,
            conn,
            params=params
        )
    df["source_file"] = df["organization_id"]
    df["date"] = pd.to_datetime(df["day_utc"]).dt.date

    return df


def get_available_airports():
    query = """
    SELECT DISTINCT organization_id
    FROM public.global_usage
    WHERE organization_id IS NOT NULL
    ORDER BY organization_id
    """
    
    with get_connection() as conn:
        return pd.read_sql(query,conn)["organization_id"].tolist()

def get_available_realms_and_organizations():
    query = """
    SELECT DISTINCT
        realm,
        organization_id
    FROM public.global_usage
    WHERE organization_id IS NOT NULL
      AND realm IS NOT NULL
    ORDER BY realm, organization_id
    """

    with get_connection() as conn:
        df = pd.read_sql(query, conn)

    grouped = (
        df.groupby("realm")["organization_id"]
        .apply(list)
        .to_dict()
    )

    return grouped

def get_available_products(selected_airports):
    query = """
    SELECT DISTINCT product_short_name
    FROM public.global_usage
    WHERE organization_id = ANY(%(organizations)s)
      AND product_short_name IS NOT NULL
    ORDER BY product_short_name
    """

    with get_connection() as conn:

        result = pd.read_sql(
            query,
            conn,
            params={
                "organizations": list(selected_airports)
            }
        )

    return result["product_short_name"].tolist()