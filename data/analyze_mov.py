import json
import numpy as np
from typing import List, Dict

def calculate_mov_array(county_data: List[Dict]) -> List[Dict]:
    """Calculate Margin of Victory array for a county's data"""
    mov_array = []
    for i in range(len(county_data) - 1):
        winner_y2 = county_data[i + 1]['winParty']
        # Find winner's percentage in both years
        winner_y1_pct = next(
            float(c['pct']) for c in county_data[i]['candidates'] 
            if c['party'] == winner_y2
        )
        winner_y2_pct = next(
            float(c['pct']) for c in county_data[i + 1]['candidates'] 
            if c['party'] == winner_y2
        )
        mov_value = winner_y2_pct - winner_y1_pct
        
        mov_obj = {
            'year1': county_data[i]['year'],
            'year2': county_data[i + 1]['year'],
            'mov': mov_value,
            'winParty': winner_y2,
            'countyName': county_data[i]['name'],
            'stateName': county_data[i].get('state', '')
        }
        mov_array.append(mov_obj)
    return mov_array

def analyze_mov_values():
    # Read the JSON file
    with open('public/data/transformed_states.json', 'r') as f:
        state_data = json.load(f)
    
    all_mov_values = []
    
    # Process each state
    for state in state_data:
        state_code = state['state']
        print(f"\nAnalyzing {state_code}...")
        
        # Process each county in the state
        for county in state['counties']:
            county_name = county['countyName']
            mov_array = calculate_mov_array(county['countyData'])
            
            # Add state context to MOV objects
            for mov in mov_array:
                mov['stateCode'] = state_code
                all_mov_values.append(mov)
    
    # Convert to numpy array for statistical analysis
    mov_values = np.array([mov['mov'] for mov in all_mov_values])
    
    # Calculate statistics
    mean_mov = np.mean(mov_values)
    std_mov = np.std(mov_values)
    
    # Define outliers as values more than 2 standard deviations from mean
    outlier_threshold = 2
    
    print("\n=== MOV Analysis Results ===")
    print(f"Mean MOV: {mean_mov:.2f}%")
    print(f"Standard Deviation: {std_mov:.2f}%")
    print(f"\nOutliers (>{outlier_threshold} standard deviations from mean):")
    
    # Find and sort outliers
    outliers = [
        mov for mov in all_mov_values 
        if abs(mov['mov'] - mean_mov) > outlier_threshold * std_mov
    ]
    
    # Sort outliers by absolute MOV value
    outliers.sort(key=lambda x: abs(x['mov']), reverse=True)
    
    # Print top outliers
    for mov in outliers:
        direction = "increase" if mov['mov'] > 0 else "decrease"
        print(f"\n{mov['countyName']}, {mov['stateCode']}")
        print(f"Years: {mov['year1']} → {mov['year2']}")
        print(f"MOV: {mov['mov']:.2f}% {direction} for {mov['winParty']}")
        
    # Save outliers to file
    with open('public/data/mov_outliers.json', 'w') as f:
        json.dump({
            'statistics': {
                'mean': mean_mov,
                'std': std_mov,
                'outlier_threshold': outlier_threshold
            },
            'outliers': outliers
        }, f, indent=2)

if __name__ == "__main__":
    analyze_mov_values() 