from pathlib import Path

PRODUCTS = {
    "airport": "Better Airport",
    "forecast": "Better Forecast",
    "sdpt": "Better Security",
    "bbc": "Better Border",
    "bci": "Better Check-In",
    "baggage": "Better Baggage",
    "bdem": "Better Demand",
    "bsg": "Better Stand & Gate",
    "bfs": "Better Flight Schedule",
    "vq": "Better VQ",
    "overview": "Better Overview",
    "bsta": "Better Staffing",
    "bfi": "Better Flight Information",
    "bctg": "Better Call-to-Gate",
}

# Filters: File Selection
data_dir = Path("pageview_project/data/group1")

QUICK_SELECT_OPTIONS = {
    "30 Days": 30,
    "3 Months": 90,
    "6 Months": 182,
    "1 Year": 365,
}