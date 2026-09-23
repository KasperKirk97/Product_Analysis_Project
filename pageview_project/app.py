import streamlit as st
from analyses.single_dataset import render_single_dataset
from analyses.dataset_comparison import render_dataset_comparison

st.set_page_config(layout="wide")
st.markdown(
    "<h2 style='text-align: center;'>Page View Analytics</h2>",
    unsafe_allow_html=True
)
#st.title("Page View Analytics")

# tab1, tab2 = st.tabs([
#     "Single Dataset",
#     "Compare Datasets"
# ])

analysis_mode = st.segmented_control(
    "Choose analysis mode:",
    [
        "Single Dataset",
        "Compare Datasets"
    ]
)

# with tab1:
if analysis_mode == "Single Dataset":
    render_single_dataset()

# with tab2:
if analysis_mode == "Compare Datasets":
    render_dataset_comparison()