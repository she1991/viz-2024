import json
import sys

def merge_county_data(county1, county2):
    # Use the name of the first county found
    county_name = county1.get('countyName', 'Arkansas')
    
    # Merge and sort county data by year
    merged_county_data = county1.get('countyData', []) + county2.get('countyData', [])
    
    # Update the 'name' property in each countyData object
    for data in merged_county_data:
        data['name'] = county_name
    
    # Sort by year
    merged_county_data.sort(key=lambda x: x['year'])
    
    # Calculate flip array from scratch by comparing consecutive years
    # We expect 4 years of data (2012, 2016, 2020, 2024), giving us 3 potential flips
    flip = []
    years = [2012, 2016, 2020, 2024]
    
    # Get one entry per year, taking the first found if duplicates exist
    year_data = {}
    for data in merged_county_data:
        if data['year'] not in year_data:
            year_data[data['year']] = data

    # Calculate flips by comparing consecutive years
    for i in range(len(years) - 1):
        current_year = years[i]
        next_year = years[i + 1]
        
        if current_year in year_data and next_year in year_data:
            current_party = year_data[current_year]['winParty']
            next_party = year_data[next_year]['winParty']
            flip.append(current_party != next_party)
    
    # Calculate consistency based on all available years
    all_parties = [data['winParty'] for data in merged_county_data]
    consistently_republican = all(party == 'R' for party in all_parties)
    consistently_democratic = all(party == 'D' for party in all_parties)
    
    return {
        'countyName': county_name,  # Use the first county's name
        'countyFips': county1.get('countyFips', ''),  # Keep first county's FIPS
        'countyData': merged_county_data,
        'flip': flip,
        'consistentlyRepublican': consistently_republican,
        'consistentlyDemocratic': consistently_democratic
    }

def recalculate_state_properties(state):
    # Count total counties
    state['allCounties'] = len(state['counties'])
    
    # Calculate flipped counts for each election
    flipped_2016 = sum(1 for county in state['counties'] 
                      if 'flip' in county and len(county['flip']) > 0 and county['flip'][0])
    flipped_2020 = sum(1 for county in state['counties'] 
                      if 'flip' in county and len(county['flip']) > 1 and county['flip'][1])
    flipped_2024 = sum(1 for county in state['counties'] 
                      if 'flip' in county and len(county['flip']) > 2 and county['flip'][2])
    
    state['flipped2016'] = flipped_2016
    state['flipped2020'] = flipped_2020
    state['flipped2024'] = flipped_2024
    
    # Calculate total flipped (counties that flipped at least once)
    state['flipped'] = sum(1 for county in state['counties'] 
                          if 'flip' in county and any(flip for flip in county['flip']))
    
    # Calculate consistently Democratic/Republican counties
    consistently_democratic = sum(1 for county in state['counties'] 
                                if county.get('consistentlyDemocratic', False))
    consistently_republican = sum(1 for county in state['counties'] 
                                if county.get('consistentlyRepublican', False))
    
    state['consistentlyDemocratic'] = consistently_democratic
    state['consistentlyRepublican'] = consistently_republican
    
    return state

def merge_counties(state_code, county_name1, county_name2):
    """
    Merge two counties within a state in the transformed_states.json file.
    
    Args:
        state_code (str): Two-letter state code (e.g., 'AR')
        county_name1 (str): Name of first county to merge
        county_name2 (str): Name of second county to merge
    """
    # Read the JSON file
    with open('public/data/transformed_states.json', 'r') as f:
        state_data = json.load(f)
    
    # Find state object
    state_obj = next((state for state in state_data if state['state'] == state_code), None)
    if not state_obj:
        print(f"State '{state_code}' not found")
        return
    
    # Find the counties to merge, preserving order of discovery
    counties_to_merge = []
    for county in state_obj['counties']:
        if county['countyName'] in [county_name1, county_name2]:
            counties_to_merge.append(county)
            if len(counties_to_merge) == 2:
                break
    
    if len(counties_to_merge) < 2:
        print(f"Could not find both counties '{county_name1}' and '{county_name2}' in {state_code}")
        return
    
    # Merge the counties using the first found county's name
    merged_county = merge_county_data(counties_to_merge[0], counties_to_merge[1])
    
    # Update counties array
    state_obj['counties'] = [
        c for c in state_obj['counties'] 
        if c['countyName'] not in [county_name1, county_name2]
    ]
    state_obj['counties'].append(merged_county)
    
    # Recalculate state-level properties
    state_obj = recalculate_state_properties(state_obj)
    
    # Write back to file
    with open('public/data/transformed_states.json', 'w') as f:
        json.dump(state_data, f, indent=2)
    
    print(f"Successfully merged {state_code} counties '{county_name1}' and '{county_name2}' into '{merged_county['countyName']}'")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python merge_counties.py <state_code> <county_name1> <county_name2>")
        print("Example: python merge_counties.py AR 'Saint Francis' 'St. Francis'")
        sys.exit(1)
    
    state_code = sys.argv[1]
    county_name1 = sys.argv[2]
    county_name2 = sys.argv[3]
    
    merge_counties(state_code, county_name1, county_name2) 