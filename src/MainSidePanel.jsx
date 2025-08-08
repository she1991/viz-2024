import React from 'react';
import SelectButton from './SelectButton';

const MainSidePanel = (props) => {
    return(
        <div style={{
            height: "calc(96vh - var(--space-xxl))",
            maxHeight: "80em",
            backgroundColor: "var(--surface-primary)",
            padding: "var(--space-lg)",
            borderRadius: "var(--border-radius-lg)",
            maxWidth: "16em",
            minWidth: "12em",
            display: "flex",
            flexDirection: "column",
        }}>
            <h1 style={{
                margin: 0,
                fontFamily: "'Playfair Display Variable', serif",
                fontSize: "2.5em",
                fontWeight: 500,
            }}>
                <span style={{color: "var(--text-primary)"}}>Blooming </span>
                <span style={{color: "var(--republican-bold)"}}>Red</span>
            </h1>
            <p style={{
                fontSize: "0.75em",
                fontWeight: 400,
            }}>
                The republican victory in the 2024 presidential elections was marked by a <i>red-shift</i> across USA. This is an attempt to visualize it.
                <br /><br />
                The tulip shaped visualization blooms in colors, shrinks and grows left or right. Each strand within it - representing a county and its voting patterns. Click on a state from the list below to investigate further.  
            </p>
            <div style={{
                borderTop: "1px solid var(--border-secondary)",
                borderBottom: "1px solid var(--border-secondary)",
                paddingTop: "var(--space-xs)",
                paddingBottom: "var(--space-xs)",
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
                        paddingTop: "var(--space-xxs)",
                        paddingBottom: "var(--space-xs)",
                        fontSize: "0.75em",
                        color: "var(--text-secondary)"
                    }}>
                        <span style={{flex: 1, fontWeight: 600}}>Interesting</span>
                        <span style={{fontWeight: 400}}>Flipped Counties</span>
                    </div>
                    {props.visualizationData.map((state, i)=>{
                        if(i > 50 && state.state!="Counties Which Flipped" && state.state!="Flipped Once")
                            return <SelectButton code={state.state} flipped={state.flipped} name={state.stateName} selected={props.selectedState == state.state} selectedState={props.selectedState} setSelectedState={props.setSelectedState}/>
                    })}
                    <div style={{
                       display: "flex",
                       flexDirection: "row",
                       paddingTop: "var(--space-md)",
                       paddingBottom: "var(--space-xs)",
                       fontSize: "0.75em",
                       color: "var(--text-secondary)"
                    }}>
                        <span style={{flex: 1, fontWeight: 600}}>States</span>
                        <span style={{fontWeight: 400}}>Flipped Counties</span>
                    </div>
                    {props.visualizationData.map((state, i)=>{
                        if(i < 51 && state.state!="AK" && state.state!="DC")
                            return <SelectButton code={state.state} flipped={state.flipped} name={state.stateName} selected={props.selectedState == state.state} selectedState={props.selectedState} setSelectedState={props.setSelectedState}/>
                    })}
                </div>
            </div>
        </div>
    );
}

export default MainSidePanel;