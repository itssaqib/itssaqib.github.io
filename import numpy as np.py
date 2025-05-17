import numpy as np
import pandas as pd
from collections import Counter
from tqdm import tqdm

# Parameters
n_products = 1_000_000
n_consumers = 1_000_000  # Keep this manageable for your hardware
top_n = 10

# Product data (NumPy for speed)
product_quality = np.random.rand(n_products)
seller_ids = np.random.randint(0, 10_000, size=n_products)
product_ids = np.arange(n_products)

# Precompute random popularity (simulate initial traffic for biased model)
initial_sales = np.random.poisson(5, size=n_products)
popular_products = product_ids[np.argsort(initial_sales)[-top_n:]]

# Consumer preferences
consumer_prefs = np.random.rand(n_consumers)

# Simulate neutral recommender
neutral_sales = Counter()
neutral_utility = 0

print("Simulating neutral model...")
for pref in tqdm(consumer_prefs):
    sampled = np.random.choice(product_ids, size=top_n, replace=False)
    qualities = product_quality[sampled]
    match = np.argmax(-np.abs(qualities - pref))
    chosen = sampled[match]
    neutral_sales[chosen] += 1
    neutral_utility += 1 - abs(product_quality[chosen] - pref)

# Simulate biased recommender
biased_sales = Counter()
biased_utility = 0

print("Simulating biased model...")
for pref in tqdm(consumer_prefs):
    sampled = popular_products
    qualities = product_quality[sampled]
    match = np.argmax(-np.abs(qualities - pref))
    chosen = sampled[match]
    biased_sales[chosen] += 1
    biased_utility += 1 - abs(product_quality[chosen] - pref)

# Save sales summaries
def save_sales(counter, filename):
    df = pd.DataFrame(counter.items(), columns=['product_id', 'sales'])
    df['seller_id'] = seller_ids[df['product_id']]
    df.to_csv(filename, index=False)

save_sales(neutral_sales, "neutral_sales.csv")
save_sales(biased_sales, "biased_sales.csv")

# Save utility
pd.DataFrame({
    "scenario": ["neutral", "biased"],
    "total_utility": [neutral_utility, biased_utility],
    "average_utility": [neutral_utility / n_consumers, biased_utility / n_consumers]
}).to_csv("consumer_utility_summary.csv", index=False)
