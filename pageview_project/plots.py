import csv
import math
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

csv_files = Path("data/group1").glob("*.csv")
#df = pd.read_csv("data/data.csv")
#print(df["user_id"].value_counts())

# Combine multiple .csv files
df = pd.concat(
    [pd.read_csv(file) for file in csv_files],
    ignore_index=True
)

# Only keep bci rows
#df = df[df["product_short_name"] == "bci"]
#view_counts = df["view_name"].value_counts()
#view_counts.to_csv("view_counts.csv")

def plot_weekday_distribution(df, timestamp_column="timestamp_utc"):
    timestamps = pd.to_datetime(df[timestamp_column], format="mixed")
    temp = pd.DataFrame({
        "weekday": timestamps.dt.day_name(),
        "hour": timestamps.dt.hour
    })
    # Put weekdays in calendar order
    weekday_order = ["Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday", "Sunday"]

    temp["weekday"] = pd.Categorical(
    temp["weekday"],
        categories=weekday_order,
        ordered=True
    )
    # Count occurrences for each weekday/hour combination
    heatmap_data = pd.crosstab(
        temp["weekday"],
        temp["hour"]
    )
    plt.figure(figsize=(12, 6))
    plt.imshow(heatmap_data, aspect="auto")
    plt.colorbar(label="Number of Events")
    plt.yticks(range(len(weekday_order)), weekday_order)
    plt.xticks(range(24), range(24))
    plt.xlabel("Hour of Day")
    plt.ylabel("Weekday")
    plt.title("Event Distribution by Weekday and Hour")

def plot_hour_distribution(df, timestamp_column="timestamp_utc"):

    # Convert timestamp column to datetime
    df[timestamp_column] = pd.to_datetime(df[timestamp_column], format="mixed")

    # Extract hour (0-23)
    df["hour"] = df[timestamp_column].dt.hour

    # Count occurrences per hour
    hour_counts = df["hour"].value_counts().sort_index()

    # Plot
    plt.figure(figsize=(10, 5))
    hour_counts.plot(kind="bar")
    plt.xlabel("Hour of Day (UTC)")
    plt.ylabel("Number of Events")
    plt.title("Distribution of Events by Hour")
    plt.xticks(rotation=0)

#plot_weekday_distribution(df)
#plot_hour_distribution(df)
plt.show()

# print(df["organization_id"].value_counts())
# print(df["session_id"].value_counts())
# print(df["user_id"].value_counts())
# df[df["session_id"] == "SocketIO-DOBMzPDw-z2xV5pEAAHo"].to_csv("session_test2.csv")
print(df["product_short_name"].value_counts())
# print(
#     df.loc[
#         df["session_id"] == "SocketIO-zqGjdaHhs1BsHdOGAANp",
#         ["timestamp_utc", "view_name"]
#     ]
# )