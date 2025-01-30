import * as d3 from 'd3';

function updateHorizontalBarsCounty(countyName, stateName, year, totalVotes, demVotes, repVotes) {
    const axes = d3.scaleLinear()
        .domain([0, totalVotes])
        .range([0, 200]);
    let demWidth = axes(demVotes);
    let repWidth = axes(repVotes);

    let demBar = d3.selectAll(".bar-democratic")
        .filter(function() {
            return d3.select(this).attr("year") == year; // filter by single attribute
        });
    demBar.attr("width", demWidth);
    let demX = parseFloat(demBar.attr("x"));
    d3.selectAll(".bar-republican")
        .filter(function() {
            return d3.select(this).attr("year") == year; // filter by single attribute
        })
        .attr("x", (demX+200)-repWidth)
        .attr("width", repWidth);
    d3.select(".bar-county-name")
        .text(countyName);
    d3.select(".bar-state-name")
        .text(stateName);   
}

export default updateHorizontalBarsCounty;