import csv
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("data1.csv")

before = len(df)

# Remove rows containing "start"
df = df[~df["product_short_name"].str.contains("start", case=False, na=False)]

after = len(df)

print(f"Removed {before - after} rows")

# Save back to the same CSV
df.to_csv("data.csv", index=False)