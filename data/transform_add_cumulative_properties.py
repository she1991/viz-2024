import json
import os

def analyze_county(county):
    # Check if consistently Democratic or Republican
    win_parties = [data["winParty"] for data in county["countyData"]]
    consistently_democratic = all(party == "D" for party in win_parties)
    consistently_republican = all(party == "R" for party in win_parties)
    
    return {
        **county,  # Keep all existing properties
        "consistentlyDemocratic": consistently_democratic,
        "consistentlyRepublican": consistently_republican,
    }

def safe_get_flip(county, index):
    """Safely get flip value at index"""
    flip_array = county.get("flip", [])
    return flip_array[index] if len(flip_array) > index else False

def analyze_state(state_obj):
    state_code = list(state_obj.keys())[0]
    state_data = state_obj[state_code]
    counties = state_data["counties"]
    
    # Analyze each county
    analyzed_counties = [analyze_county(county) for county in counties]
    
    # Calculate state-level metrics (counting instead of boolean)
    flipped_count = sum(1 for county in counties if any(county.get("flip", [])))
    flipped_2024_count = sum(1 for county in counties if safe_get_flip(county, 2))
    flipped_2020_count = sum(1 for county in counties if safe_get_flip(county, 1))
    flipped_2016_count = sum(1 for county in counties if safe_get_flip(county, 0))
    
    consistently_democratic_count = sum(
        1 for county in analyzed_counties if county["consistentlyDemocratic"]
    )
    consistently_republican_count = sum(
        1 for county in analyzed_counties if county["consistentlyRepublican"]
    )
    
    return {
        "state": state_code,
        "allCounties": len(counties),
        "flipped": flipped_count,
        "flipped2024": flipped_2024_count,
        "flipped2020": flipped_2020_count,
        "flipped2016": flipped_2016_count,
        "consistentlyDemocratic": consistently_democratic_count,
        "consistentlyRepublican": consistently_republican_count,
        "counties": analyzed_counties
    }

def count_flips(flip_array):
    """Count number of True values in flip array"""
    return sum(1 for flip in flip_array if flip)

def create_flip_category_states(transformed_states):
    # Create lists to hold counties by flip count
    flipped_once = []
    flipped_twice = []
    flipped_thrice = []
    all_flipped = []
    
    # Go through each state and categorize flipped counties
    for state in transformed_states:
        for county in state["counties"]:
            flip_array = county.get("flip", [])
            if not flip_array:  # Skip if no flip array
                continue
                
            flip_count = count_flips(flip_array)
            
            if flip_count > 0:
                # Add state code to county for reference
                modified_county = {
                    **county,
                    "originalState": state["state"]
                }
                
                # Add to appropriate list based on flip count
                if flip_count == 1:
                    flipped_once.append(modified_county)
                elif flip_count == 2:
                    flipped_twice.append(modified_county)
                elif flip_count == 3:
                    flipped_thrice.append(modified_county)
                    
                all_flipped.append(modified_county)
    
    # Create the new state objects
    new_states = [
        {
            "state": "Counties Which Flipped",
            "allCounties": len(all_flipped),
            "flipped": sum(1 for county in all_flipped if any(county.get("flip", []))),
            "flipped2024": sum(1 for county in all_flipped if safe_get_flip(county, 2)),
            "flipped2020": sum(1 for county in all_flipped if safe_get_flip(county, 1)),
            "flipped2016": sum(1 for county in all_flipped if safe_get_flip(county, 0)),
            "consistentlyDemocratic": 0,
            "consistentlyRepublican": 0,
            "counties": all_flipped
        },
        {
            "state": "Flipped Once",
            "allCounties": len(flipped_once),
            "flipped": sum(1 for county in flipped_once if any(county.get("flip", []))),
            "flipped2024": sum(1 for county in flipped_once if safe_get_flip(county, 2)),
            "flipped2020": sum(1 for county in flipped_once if safe_get_flip(county, 1)),
            "flipped2016": sum(1 for county in flipped_once if safe_get_flip(county, 0)),
            "consistentlyDemocratic": 0,
            "consistentlyRepublican": 0,
            "counties": flipped_once
        },
        {
            "state": "Flipped Twice",
            "allCounties": len(flipped_twice),
            "flipped": sum(1 for county in flipped_twice if any(county.get("flip", []))),
            "flipped2024": sum(1 for county in flipped_twice if safe_get_flip(county, 2)),
            "flipped2020": sum(1 for county in flipped_twice if safe_get_flip(county, 1)),
            "flipped2016": sum(1 for county in flipped_twice if safe_get_flip(county, 0)),
            "consistentlyDemocratic": 0,
            "consistentlyRepublican": 0,
            "counties": flipped_twice
        },
        {
            "state": "Flipped Thrice",
            "allCounties": len(flipped_thrice),
            "flipped": sum(1 for county in flipped_thrice if any(county.get("flip", []))),
            "flipped2024": sum(1 for county in flipped_thrice if safe_get_flip(county, 2)),
            "flipped2020": sum(1 for county in flipped_thrice if safe_get_flip(county, 1)),
            "flipped2016": sum(1 for county in flipped_thrice if safe_get_flip(county, 0)),
            "consistentlyDemocratic": 0,
            "consistentlyRepublican": 0,
            "counties": flipped_thrice
        }
    ]
    
    transformed_states.extend(new_states)
    return transformed_states

def transform_json(data):
    # First transformation
    transformed_states = [analyze_state(state_obj) for state_obj in data]
    
    # Add flipped counties states
    final_data = create_flip_category_states(transformed_states)
    
    return final_data

# Read the input JSON file
input_path = "../data/state-data/op.json"
output_path = "../public/data/transformed_states.json"

try:
    # Read input file
    with open(input_path, 'r') as file:
        data = json.load(file)
    
    # Transform the data
    transformed = transform_json(data)
    
    # Write the transformed data to new file
    with open(output_path, 'w') as file:
        json.dump(transformed, file, indent=2)
        
    print(f"Successfully transformed data and saved to {output_path}")
    # Print summary of flipped counties
    for state in transformed[-4:]:  # Last 4 states are our special categories
        print(f"{state['state']}: {state['allCounties']} counties")
    
except FileNotFoundError:
    print(f"Could not find file at {input_path}")
except json.JSONDecodeError:
    print("Error decoding JSON from file")
except Exception as e:
    print(f"An error occurred: {str(e)}")