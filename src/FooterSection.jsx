import React from 'react';

const FooterSection = (props) => {
    return (
        <div style={{
            fontSize: "0.5em",
            fontWeight: 400,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "end"
        }}>
            <p>
                For educational, non-commercial use, provided “as is”, without any claims about accuracy and correctness. The word county references a US county or county equivalents like town, municipalities, parishes etc. for which voting data is available. Election results data scraped from cbsnews.com and primary sources like respective state elections divisions/departments. Counties created after the 2012 presidential election have been excluded from this visualization. Built using D3.js and ReactJS.
            </p>
            <p>
                © Akash Shetye 2025
            </p>
        </div>
    );
}

export default FooterSection;