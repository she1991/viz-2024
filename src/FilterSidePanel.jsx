import React from 'react';

const FilterSidePanel = (props) => {
    return(
        <div style={{
            height: "100%",
            backgroundColor: "var(--surface-primary)",
            padding: "var(--space-md)",
            borderRadius: "var(--border-radius-lg)",
            maxWidth: "16em",
            minWidth: "12em",
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
                    
                </div>
            </div>
        </div>
    );
}

export default FilterSidePanel;