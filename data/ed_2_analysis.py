import json

def analyze_ed2(data):
    # Find AK state data
    ak_data = next((state_obj["AK"] for state_obj in data if "AK" in state_obj), None)
    
    if ak_data:
        # Find ED 2
        ed2 = next((county for county in ak_data["counties"] if county["countyName"] == "ED 2"), None)
        
        if ed2:
            print("ED 2 Data:")
            print(f"County Name: {ed2['countyName']}")
            print("\nCounty Data Array:")
            for i, year_data in enumerate(ed2['countyData']):
                print(f"\nYear {i}:")
                print(f"Win Party: {year_data.get('winParty', 'NO WIN PARTY')}")
                print("Candidates:")
                for candidate in year_data.get('candidates', []):
                    print(f"  - Party: {candidate.get('party')}, Votes: {candidate.get('vote')}")
                
            # Calculate what flip array should be
            if len(ed2['countyData']) > 1:
                flips = []
                for i in range(1, len(ed2['countyData'])):
                    prev_win = ed2['countyData'][i-1].get('winParty')
                    curr_win = ed2['countyData'][i].get('winParty')
                    flips.append(prev_win != curr_win)
                print("\nCalculated flip array should be:", flips)
        else:
            print("Could not find ED 2 in AK data")
    else:
        print("Could not find AK state data")

# Read the input JSON file
input_path = "../public/data/op-json_2.json"

try:
    with open(input_path, 'r') as file:
        data = json.load(file)
    
    analyze_ed2(data)
    
except FileNotFoundError:
    print(f"Could not find file at {input_path}")
except json.JSONDecodeError:
    print("Error decoding JSON from file")
except Exception as e:
    print(f"An error occurred: {str(e)}")