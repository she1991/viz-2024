import * as d3 from 'd3';

function renderStateName(stateData, width, height) {
    let stateNameGroup = d3.create("svg:g")
        .attr ("class", "state-name-group");
    if(stateData.state.length === 2) {
        stateNameGroup.append("text")
            .attr("class", "state-name")
            .attr("x", 100)
            .attr("y", 580)
            .text("The State of")
            .attr("font-size", "1.5em")
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("text-anchor", "start");
        stateNameGroup.append("text")
            .attr("class", "state-name")
            .attr("x", 100)
            .attr("y", 630)
            .text(stateData.stateName)
            .attr("font-size", "3em")
            .attr("font-weight", "500")
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("text-anchor", "start");
        stateNameGroup.append("text")
            .attr("class", "help-text")
            .attr("x", 100)
            .attr("y", 700)
            .attr("width", 200)
            .text("Please hover over the visualization")
            .attr("font-size", "1.1em")
            .attr("font-weight", "400")
            .attr("opacity", 0.6)
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("text-anchor", "start");
        stateNameGroup.append("text")
            .attr("class", "help-text help-text-motif")
            .attr("x", 390)
            .attr("y", 702)
            .attr("width", 200)
            .text("▶")
            .attr("font-size", "1.25em")
            .attr("font-weight", "400")
            .attr("opacity", 0.4)
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("text-anchor", "start");
    }
    return stateNameGroup;
}

export default renderStateName;