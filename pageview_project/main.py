import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from datetime import date
from pageview_project.database.data_loader import (get_available_airports, load_page_views,get_available_products)
from pageview_project.charts.treemap import (build_comparison_data,build_treemap_data)
from pageview_project.filters import apply_customer_filter
from pageview_project.constants import PRODUCTS
from pageview_project.database.connection import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "productanalysisproject-t2j9.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/airports")
def airports():
    return get_available_airports()

@app.get("/products")
def products(airports: str):

    airport_list = airports.split(",")
    products = get_available_products(airport_list)
    return [{
    "id": product,
    "name": PRODUCTS.get(product,product)
    } for product in products]

@app.get("/metadata")
def metadata(airports: str):
    airport_list = airports.split(",")
    
    query = """
    SELECT
    MIN(day_utc) AS min_date,
    MAX(day_utc) AS max_date
    FROM public.global_usage
    WHERE organization_id = ANY(%(airports)s)
    """
    
    with get_connection() as conn:
        result = pd.read_sql(
            query,
            conn,
            params={
                "airports": airport_list
            }
        )
    
    return {
    "min_date": str(result["min_date"].iloc[0]),
    "max_date": str(result["max_date"].iloc[0])
    }

@app.get("/treemap")
def treemap(
    airports: str,
    products: str | None = None,
    customer_type: str = "All",
    start_date: date | None = None,
    end_date: date | None = None
    ):

    airport_list = airports.split(",")
    product_list = products.split(",")

    df = load_page_views(airport_list,product_list,customer_type,start_date,end_date)
    
    return build_treemap_data(df)

@app.get("/comparison")
def comparison(
    dataset_a: str,
    dataset_b: str,
    products: str | None = None,
    customer_type: str = "All",
    start_date: date | None = None,
    end_date: date | None = None
):
    selected_products = products.split(",")

    df_a = load_page_views(dataset_a.split(","),selected_products,customer_type,start_date,end_date)
    df_b = load_page_views(dataset_b.split(","),selected_products,customer_type,start_date,end_date)

    return build_comparison_data(
        df_a,
        df_b
    )
