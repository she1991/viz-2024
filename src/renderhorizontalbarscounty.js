// Render all 4 bars given the data.
// Render once update data.

import * as d3 from 'd3';

function renderHorizontalBarsCounty(height, x) {
    /*
        2012
        2016
        2020
        2024
    */
    const years = [
        2012,
        2016,
        2020,
        2024,
    ];
    const countyHorizontalBarsGroup = d3.create("svg:g")
    .attr("class", "county-horizontal-bars");
    
    countyHorizontalBarsGroup.selectAll("rect .bar-background")
        .data(years)
            .join("rect")
            .attr("class", 'bar-background')
            .attr("year", (d, i) => {
                return d;
            })
            .attr("x", x)
            .attr("y", (d, i) => {
                return height - (height/4)*i - 150;
            })
            .attr("width", 200)
            .attr("height", 6)
            .attr("fill", "var(--surface-secondary)")
    countyHorizontalBarsGroup.selectAll("line .bar-middle-line")
        .data(years)
            .join("line")
            .attr("class", 'bar-middle-line')
            .attr("year", (d, i) => {
                return d;
            })
            .attr("x1", ()=>{
                return x + (200/2);
            })
            .attr("y1", (d, i)=>{
                return height - (1200/4)*i - 166;
            })
            .attr("x2", ()=>{
                return x + (200/2);
            })
            .attr("y2", (d, i)=>{
                return height - (1200/4)*i - 126;
            })
            .attr("stroke", "var(--surface-secondary)")
            .attr("stroke-width", 2);
    countyHorizontalBarsGroup.selectAll("text")
        .data(years)
            .join("text")
            .attr("class", "bar-year-heading")
            .attr("year", (d, i) => {
                return d;
            })
            .attr("x", x+200)
            .attr("y", (d, i) => {
                return height - (height/4)*i - 120;
            })
            .text((d, i) => {
                return d;
            })
            .attr("font-size", "1.5em")
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("font-weight", 400)
            .attr("text-anchor", "end");

    let countyHorizontalBarsDataGroup = countyHorizontalBarsGroup.append("svg:g")
            .attr("class", "county-horizontal-bars-data-group")
            .attr("opacity", 0);

    countyHorizontalBarsDataGroup.selectAll("rect .bar-democratic")
        .data(years)
            .join("rect")
            .attr("class", 'bar-democratic')
            .attr("year", (d, i) => {
                return d;
            })
            .attr("x", x)
            .attr("y", (d, i) => {
                return height - (height/4)*i - 150;
            })
            .attr("width", 80)
            .attr("height", 6)
            .attr("opacity", 0.7)
            .attr("fill", "var(--democratic-bold)");
    countyHorizontalBarsDataGroup.selectAll("rect .bar-republican")
        .data(years)
            .join("rect")
            .attr("class", 'bar-republican')
            .attr("year", (d, i) => {
                return d;
            })
            .attr("x", (x+200)-80)
            .attr("y", (d, i) => {
                return height - (1200/4)*i - 150;
            })
            .attr("width", 80)
            .attr("height", 6)
            .attr("opacity", 0.7)
            .attr("fill", "var(--republican-bold)")
    countyHorizontalBarsDataGroup.append("text")
        .attr("class", "bar-county-heading")
        .attr("x", x+200)
        .attr("y", 65)
        .text("The County of")
        .attr("font-size", "1.1em")
        .attr("font-family", "'Open Sans Variable', sans-serif")
        .attr("font-weight", 400)
        .attr("text-anchor", "end");
    countyHorizontalBarsDataGroup.selectAll("text .bar-county-margin")
        .data([2016, 2020, 2024])
            .join("text")
            .attr("class", "bar-county-margin")
            .attr("year", (d, i) => {
                return d;
            })
            .attr("x", x+100)
            .attr("y", (d, i) => {
                return height - (1200/4)*i - 300;
            })
            .text("R -3.5%")
            .attr("font-size", "1.5em")
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("font-weight", 600)
            .attr("text-anchor", "middle");
    countyHorizontalBarsDataGroup.append("text")
        .attr("class", "bar-county-name")
        .attr("x", x+200)
        .attr("y", 96)
        .text("County"+",")
        .attr("font-size", "1.75em")
        .attr("font-family", "'Open Sans Variable', sans-serif")
        .attr("font-weight", 600)
        .attr("text-anchor", "end");
    return countyHorizontalBarsGroup;
}

export default renderHorizontalBarsCounty;