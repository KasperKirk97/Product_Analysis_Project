import streamlit as st
import pandas as pd

@st.cache_data
def load_files(data_dir, selected_files):
    frames = [ pd.read_csv(data_dir / filename) for filename in selected_files]

    if not frames:
        return pd.DataFrame()
    
    df = pd.concat(frames,ignore_index=True)
    #df["timestamp_utc"] = pd.to_datetime(df["timestamp_utc"], format="mixed")
    df["date"] = pd.to_datetime(df["timestamp_utc"], format="mixed").dt.date
    return df