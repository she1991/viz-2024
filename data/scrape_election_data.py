from jsify import jsify
from time import sleep
import requests
import random
import json
years = [ 2012, 2016, 2020, 2024 ]
#"AL", "AK", "AR", "AZ", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA",
states = [ "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "WA", "WV", "WI", "WY"]
#states = ["AL", "DE"]
candiates = jsify([])

#Build URL to pull county data for state in states:
def getDataForState(state):
    data = jsify({})
    for year in years:
        print('Working on ', state, " year", year)
        #iterate years
        if state not in data:
            data[state] = jsify({"counties": [], "state": {"stateData": []}})
        print('Getting data for ', str('http://api-election.cbsnews.com/api/public/counties2/' + str(year) + '/G/' + state + '/P'))
        for _ in range(3):  # Retry up to 3 times
            response = requests.get(str('http://api-election.cbsnews.com/api/public/counties2/' + str(year) + '/G/' + state + '/P'))
            if response.status_code == 200:
                contents = jsify(response.json())
                break
            else:
                print(f"Failed to get data for {state} in {year}. Status code: {response.status_code}, Response: {response.text}")
                sleep(random.randint(10, 20))
        else:
            contents = jsify({"race": {"counties": []}})
        #iterate county data and fill in
        for countyDataContents in contents.race.counties:
            countyDataContents_wYear = countyDataContents
            #hydrate with election yr
            countyDataContents_wYear['year'] = year
            #hydrate with win data #winCandidate: 9999
            countyDataContents_wYear['winCandidate'] = max(countyDataContents.candidates, key=lambda countyData: countyData.pct).id
            #winParty: "R"
            for candidate in contents.race.candidates:
                if candidate.id == countyDataContents_wYear.winCandidate:
                    countyDataContents_wYear['winParty'] = candidate.party
            #check if county exists
            countyExists = False
            for county in data[state].counties:
                if county.countyName == countyDataContents.name:
                    #add data into county object
                    county.countyData.append(countyDataContents_wYear)
                    countyExists = True
            #enrich candidates with party
            for candidate in countyDataContents_wYear.candidates:
                for raceCandidate in contents.race.candidates:
                    if candidate.id == raceCandidate.id:
                        candidate['party'] = raceCandidate.party
            if not countyExists:
                data[state].counties.append(jsify({"countyName": countyDataContents.name, "countyFips": countyDataContents.fips, "countyData": [countyDataContents_wYear]}))
        sleep (random.randint (20, 60))
        #add state data
        print('Getting data for ', str('https://api-election.cbsnews.com/api/public/races2/' + str(year) + '/G?filter.office=P'))
        for _ in range(3):  # Retry up to 3 times
            response = requests.get(str('https://api-election.cbsnews.com/api/public/races2/' + str(year) + '/G?filter.office=P'))
            if response.status_code == 200:
                stateContents = jsify(response.json())
                break
            else:
                print(f"Failed to get data for {state} in {year}. Status code: {response.status_code}, Response: {response.text}")
                sleep(random.randint(10, 20))
        else:
            stateContents = jsify([])
        sleep (random.randint (10, 20))
        for stateResult in stateContents:
            print(stateResult.stateCode, state)
            if stateResult.stateCode == state:
                stateResult['year'] = year
                # Add winCandidate property by finding candidate with highest vote percentage
                stateResult['winCandidate'] = max(stateResult.candidates, key=lambda candidate: candidate.votePct).id
                # Add winParty property by finding candidate with highest vote percentage
                stateResult['winParty'] = max(stateResult.candidates, key=lambda candidate: candidate.votePct).party[0]
                data[state].state.stateData.append(stateResult)
    #make county level flips array
    for county in data[state].counties:
        if len(county.countyData) > 1:
            print(county.countyName, len(county.countyData))
            for i in range(1, len(county.countyData)):
                current_data = county.countyData[i]
                prev_data = county.countyData[i-1]
                print(prev_data.year, prev_data.winParty, "--county--", current_data.year, current_data.winParty)
                if 'flip' not in county:
                    county['flip'] = []
                # Add flip boolean by comparing current winParty to previous
                county.flip.append(current_data.winParty != prev_data.winParty)
    #make state level flips array
    if len(data[state].state.stateData) > 1:
        for i in range(1, len(data[state].state.stateData)):
            current_data = data[state].state.stateData[i]
            prev_data = data[state].state.stateData[i-1]
            print(prev_data.year, prev_data.winParty, "--state--", current_data.year, current_data.winParty)
            if 'flip' not in data[state].state:
                data[state].state['flip'] = []
            # Add flip boolean by comparing current winParty to previous
            data[state].state.flip.append(current_data.winParty != prev_data.winParty)
    return data

#iterate
for state in states:
    stateData = getDataForState(state)
    with open('./data/state-data/op.json', 'a', encoding='utf-8') as f:
        json.dump(stateData, f, ensure_ascii=False, indent=4)
        f.write(',\n')