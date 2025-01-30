import React from 'react';

const SelectButton = (props) => {
    return (<button
        style={{
            backgroundColor: props.selected?"var(--surface-selected)":"var(--surface-secondary)",
            border: "none",
            borderRadius: "var(--border-radius-xs)",
            padding: "var(--space-xs) var(--space-md) var(--space-xs) var(--space-md)",
            cursor: "pointer",
            color: props.selected?"var(--text-contrast)":"var(--text-primary)",
        }}
        className="select-button"
        onClick={()=>{
            props.setSelectedState(props.code)
        }}
    >
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        }}>
            <span style={{flex: 1, textAlign: "left", fontSize: "1em", fontWeight: 400}}>{props.name}</span>
            <div style={{
                backgroundColor: "var(--surface-tertiary)",
                padding: "var(--space-xxs) var(--space-xs) var(--space-xxs) var(--space-xs)",
                borderRadius: "var(--border-radius-xs)",
                minHeight: "1.25em",
                minWidth: "1.25em",
                textAlign: "center",
                fontSize: "0.75em",
                fontWeight: 600,
                color: "var(--text-contrast)"
            }}>
                {props.flipped}
            </div>
        </div>
    </button>);
}

export default SelectButton;