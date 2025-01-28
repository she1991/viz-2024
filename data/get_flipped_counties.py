import json
import os
from collections import defaultdict

def find_flipped_counties(data):
    # Use defaultdict to automatically group by state
    flipped_by_state = defaultdict(list)
    
    for state_data in data:
        for state_code, state_info in state_data.items():
            for county in state_info["counties"]:
                winning_parties = set(year_data["winParty"] for year_data in county["countyData"])
                
                if len(winning_parties) > 1:
                    flipped_by_state[state_code].append({
                        "county": county["countyName"],
                        "parties": list(winning_parties)
                    })
    
    return flipped_by_state

# Read the JSON file
file_path = "../public/data/op-json_2.json"
absolute_path = os.path.abspath(file_path)

try:
    with open(absolute_path, 'r') as file:
        data = json.load(file)

    # Find flipped counties grouped by state
    flipped = find_flipped_counties(data)

    # Print results grouped by state
    total_flips = sum(len(counties) for counties in flipped.values())
    print(f"\nFound {total_flips} counties that flipped across {len(flipped)} states:")
    
    for state in sorted(flipped.keys()):
        counties = flipped[state]
        print(f"\n{state} ({len(counties)} counties):")
        for county in sorted(counties, key=lambda x: x['county']):
            print(f"  - {county['county']} County (flipped between {' and '.join(county['parties'])})")

except FileNotFoundError:
    print(f"Could not find file at {absolute_path}")
except json.JSONDecodeError:
    print("Error decoding JSON from file")
except Exception as e:
    print(f"An error occurred: {str(e)}")