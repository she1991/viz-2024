import * as d3 from 'd3';

function renderStateName(stateData, width, height) {
    let stateNameGroup = d3.create("svg:g")
        .attr ("class", "state-name-group");
    if(stateData.state.length === 2) {
        stateNameGroup.append("text")
            .attr("class", "state-name")
            .attr("x", 100)
            .attr("y", 600)
            .text("The State of")
            .attr("font-size", "1.5em")
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("text-anchor", "start");
        stateNameGroup.append("text")
            .attr("class", "state-name")
            .attr("x", 100)
            .attr("y", 650)
            .text(stateData.stateName)
            .attr("font-size", "3em")
            .attr("font-weight", "500")
            .attr("font-family", "'Open Sans Variable', sans-serif")
            .attr("text-anchor", "start");
    }
    return stateNameGroup;
}

export default renderStateName;