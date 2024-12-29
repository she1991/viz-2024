from jsify import jsify
from time import sleep
import requests
import random
import json
years = [ 2012, 2016, 2020, 2024 ]
#states = ["AL", "AK", "AR", "AZ", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "WA", "WV", "WI", "WY"]
states = ["AL"]
candiates = jsify([])
data = jsify({})
#Build URL to pull county data for state in states:
#iterate
for state in states:
    for year in years:
        print('Working on ', state, " year", year)
        #iterate years
        if state not in data:
            data [state] = []
        print('Getting data for ', str('http://api-election.cbsnews.com/api/public/counties2/' + str(year) + '/G/' + state + '/P'))
        contents = jsify(requests.get(str('http://api-election.cbsnews.com/api/public/counties2/' + str(year) + '/G/' + state + '/P')).json())
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
            for county in data[state]:
                if county.countyFips == countyDataContents.fips:
                    #add data into county object
                    county.countyData.append(countyDataContents_wYear)
                    countyExists = True
            if not countyExists:
                data[state].append(jsify({"countyName": countyDataContents.name, "countyFips": countyDataContents.fips, "countyData": [countyDataContents_wYear]}))
            #populate candidates
            sleep (random.randint (1, 10))
with open('op-json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)