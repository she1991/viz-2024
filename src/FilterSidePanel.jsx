import React from 'react';
import SelectButton from './SelectButton';

const FilterSidePanel = (props) => {
    const state = props.visualizationData.find(stateObj => stateObj.state === props.selectedState);
    return(
        <div style={{
            height: "100%",
            backgroundColor: "var(--surface-primary)",
            padding: "var(--space-lg)",
            borderRadius: "var(--border-radius-lg)",
            maxWidth: "16em",
            minWidth: "14em",
            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-xxs)",
                flex: 1
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-xxs)"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: "var(--space-xs)",
                        fontSize: "0.75em",
                        color: "var(--text-secondary)"
                    }}>
                        <span style={{flex: 1, fontWeight: 600}}>Filter Counties</span>
                    </div>
                    <SelectButton code={"allCounties"} flipped={state.allCounties} name={"All Counties"} selected={props.selectedFilter == "allCounties"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                    <SelectButton code={"flipped"} flipped={state.flipped} name={"Flipped"} selected={props.selectedFilter == "flipped"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                    <SelectButton code={"2"} flipped={state.flipped2024} name={"Flipped in 2024"} selected={props.selectedFilter == "2"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                    <SelectButton code={"1"} flipped={state.flipped2020} name={"Flipped in 2020"} selected={props.selectedFilter == "1"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                    <SelectButton code={"0"} flipped={state.flipped2016} name={"Flipped in 2016"} selected={props.selectedFilter == "0"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                    <SelectButton code={"consistentlyDemocratic"} flipped={state.consistentlyDemocratic} name={"Consistently Democratic"} selected={props.selectedFilter == "consistentlyDemocratic"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                    <SelectButton code={"consistentlyRepublican"} flipped={state.consistentlyRepublican} name={"Consistently Republican"} selected={props.selectedFilter == "consistentlyRepublican"} selectedState={props.selectedFilter} setSelectedState={props.setSelectedFilter}/>
                </div>
            </div>
        </div>
    );
}

export default FilterSidePanel;