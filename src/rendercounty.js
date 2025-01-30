import * as d3 from 'd3';
import updateHorizontalBarsCounty from './updatehorizontalbarscounty';

function getAxesValue(votes, maxTotalVote, width, height, countyDataIndex) {
    const axes = d3.scaleLinear()
        .domain([0, maxTotalVote])
        .range([(width/4)*countyDataIndex, (height/4)*(countyDataIndex+1)])
    return axes(votes);
}

function renderDiagonal(width, height, countyDataIndex) {
    return d3.create("path")
        .attr ("d", `M0,${(height/4)*(countyDataIndex+1)}L${(width/4)*countyDataIndex},0`)
        .attr ("stroke", "black")
        .attr ("stroke-width", 4);
}

function handleCountyMouseover(event, d, context) {
    /*d3.select(context. parentNode.parentNode)
        .selectAll(".county-curve-path")
        .attr ("opacity", 0);*/
    d3.select(context.parentNode)
        .selectAll(".county-curve-path")
        .attr ("opacity", 1)
        .attr ("stroke-width", 6)
        .attr("stroke-opacity", 1);
    d3.select(context.parentNode.parentNode)
        .selectAll("circle")
        .attr("opacity", 0);
    d3.select(context.parentNode)
        .selectAll("circle")
        .attr ("opacity", 1);
    d3.select(".county-horizontal-bars-data-group")
        .attr("opacity", 1);
    let data = d3.select(context.parentNode).datum();
    let state = data.hasOwnProperty("originalState")?data.originalState:"";
    d3.select(context.parentNode).datum().countyData.forEach(countyDataElement => {
        updateHorizontalBarsCounty(
            countyDataElement.name,
            state,
            countyDataElement.year,
            countyDataElement.totalVote,
            countyDataElement.candidates.find((candidate)=>{
                return candidate.party == "D"
            }).vote,
            countyDataElement.candidates.find((candidate)=>{
                return candidate.party == "R"
            }).vote
        )
    });
}

function handleCountyMouseout(event, d, context) {
    d3.select(context.parentNode.parentNode)
        .selectAll(".county-curve-path")
        .attr ("opacity", 1)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.5);
    d3.select(context.parentNode)
        .selectAll(".county-curve-path")
        .attr ("stroke-opacity", 0.5);
    d3.select(context.parentNode.parentNode)
        .selectAll("circle")
        .attr("opacity", 0);
    d3.select(context.parentNode.parentNode)
        .selectAll(".county-flip")
        .selectAll("circle")
        .attr("opacity", 1);
    d3.select(".county-horizontal-bars-data-group")
        .attr("opacity", 0);
}

function renderCounty( countyData, flip, width, height ) {
    const countyCurveGroup = d3.create("svg:g")
        .attr("class", (d, i) => {
            if (flip.some(value => value === true)) {
                return "county county-flip";
            }
            return "county";
        })
        .attr ("countyName", countyData.countyData[0].name)
        .datum(countyData);

    // render the county curve path
    countyCurveGroup.append("path")
        .attr("class", "county-curve-path")
        .attr("d", d3.line().curve(d3.curveCatmullRom.alpha(0.5))(
            [[0, 0]].concat(d3.map(countyData.countyData, (countyDataElement, countyDataIndex) => {
                let demVote = countyDataElement.candidates.find((candidate)=>{return candidate.party === "D"}).vote;
                let repVote = countyDataElement.candidates.find((candidate)=>{return candidate.party === "R"}).vote;
                return [
                    getAxesValue(demVote, countyDataElement.totalVote, width, height, countyDataIndex),
                    getAxesValue(repVote, countyDataElement.totalVote, width, height, countyDataIndex)
                ];
            }))
        ))
        .attr("stroke", "var(--neutral-500)")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 1)
        .attr("fill", "none");

    // render county curve path with stroke width of 10 and hook mouse events on it
    // this will help catch mouse pointers in procimity to the county curve path at all times
    countyCurveGroup.append("path")
        .attr("class", "county-curve-path-hover")
        .attr("d", d3.line().curve(d3.curveCatmullRom.alpha(0.5))(
            [[0, 0]].concat(d3.map(countyData.countyData, (countyDataElement, countyDataIndex) => {
                let demVote = countyDataElement.candidates.find((candidate)=>{return candidate.party === "D"}).vote;
                let repVote = countyDataElement.candidates.find((candidate)=>{return candidate.party === "R"}).vote;
                return [
                    getAxesValue(demVote, countyDataElement.totalVote, width, height, countyDataIndex),
                    getAxesValue(repVote, countyDataElement.totalVote, width, height, countyDataIndex)
                ];
            }))
        ))
        .attr("stroke", "black")
        .attr("stroke-width", 5)
        .attr("stroke-opacity", 0)
        .attr("fill", "none")
        .on("mouseover", function(event, d) {
            handleCountyMouseover(event, d, this);
        })
        .on("mouseout", function(event, d) {
            handleCountyMouseout(event, d, this);
        });
    
    countyCurveGroup.selectAll("circle")
        .data(countyData.countyData)
            .join("circle")
            .attr ("cx", (d, i) => {
                //Democratic Candidate
                return getAxesValue(d.candidates.find((candidate)=>{return candidate.party === "D"}).vote, d.totalVote, width, height, i)
            })
            .attr("cy", (d, i) => {
                //Republican Candidate
                return getAxesValue(d.candidates.find((candidate)=>{return candidate.party === "R"}).vote, d.totalVote, width, height, i)
            })
            .attr("r", 20)
            .attr("fill-opacity", 0.2)
            .attr("stroke", (d, i) => {
                if (d.winParty == 'D')
                    return "var(--democratic-bold)";
                else if (d.winParty == 'R') 
                    return "var(--republican-bold)";
            })
            .attr("stroke-width", 1)
            .attr("stroke-opacity", 0.5)
            //decide color according to the party with larget vote share
            .attr("fill", (d, i) => {
                if (d.winParty == 'D' )
                    return "var(--democratic-bold)";
                else if (d.winParty == 'R')
                    return "var(--republican-bold)";
            })
            .attr("opacity", (d, i) => {
                if (flip.some(value => value === true)) {
                    return 1;
                }
                return 0;
            })
            .on("mouseover", function(event, d) {
                handleCountyMouseover(event, d, this);
            })
            .on("mouseout", function(event, d) {
                handleCountyMouseout(event, d, this);
            });

    return countyCurveGroup;
}

export default renderCounty;