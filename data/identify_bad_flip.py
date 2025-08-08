import json
import os

def check_flip_property(data):
    issues = []
    
    for state_obj in data:
        state_code = list(state_obj.keys())[0]
        state_data = state_obj[state_code]
        
        for county in state_data["counties"]:
            county_name = county.get("countyName", "UNKNOWN")
            
            # Check if flip property exists
            if "flip" not in county:
                issues.append({
                    "state": state_code,
                    "county": county_name,
                    "issue": "Missing flip property"
                })
                continue
            
            flip_array = county["flip"]
            
            # Check if flip is an array
            if not isinstance(flip_array, list):
                issues.append({
                    "state": state_code,
                    "county": county_name,
                    "issue": f"Flip property is not an array, found: {type(flip_array)}"
                })
                continue
            
            # Check if flip array has exactly 3 elements
            if len(flip_array) != 3:
                issues.append({
                    "state": state_code,
                    "county": county_name,
                    "issue": f"Flip array has {len(flip_array)} elements, expected 3"
                })
                continue
            
            # Check if all elements are boolean
            if not all(isinstance(x, bool) for x in flip_array):
                issues.append({
                    "state": state_code,
                    "county": county_name,
                    "issue": "Flip array contains non-boolean values"
                })
    
    return issues

# Read the input JSON file
input_path = "public/data/op-json_2.json"

try:
    # Read input file
    with open(input_path, 'r') as file:
        data = json.load(file)
    
    # Check for issues
    issues = check_flip_property(data)
    
    if issues:
        print(f"\nFound {len(issues)} counties with flip property issues:")
        # Group issues by state for better readability
        issues_by_state = {}
        for issue in issues:
            state = issue["state"]
            if state not in issues_by_state:
                issues_by_state[state] = []
            issues_by_state[state].append(issue)
        
        # Print issues grouped by state
        for state in sorted(issues_by_state.keys()):
            print(f"\n{state}:")
            for issue in issues_by_state[state]:
                print(f"  - {issue['county']}: {issue['issue']}")
    else:
        print("No issues found with flip properties!")
    
except FileNotFoundError:
    print(f"Could not find file at {input_path}")
except json.JSONDecodeError:
    print("Error decoding JSON from file")
except Exception as e:
    print(f"An error occurred: {str(e)}")