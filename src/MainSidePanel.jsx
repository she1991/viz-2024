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
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem  accusantium doloremque laudantium
                <br /><br />
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
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
                        if(i > 49)
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
                        if(i < 50)
                            return <SelectButton code={state.state} flipped={state.flipped} name={state.stateName} selected={props.selectedState == state.state} selectedState={props.selectedState} setSelectedState={props.setSelectedState}/>
                    })}
                </div>
            </div>
        </div>
    );
}

export default MainSidePanel;