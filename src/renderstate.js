import * as d3 from 'd3';
import renderCounty from './rendercounty.js';

function renderState(stateData, width, height) {
    let stateTulip = d3.create("svg:g")
        .attr ("state", stateData.stateName)
        .style("cursor", "crosshair");
    const diagonal = width;
    stateTulip. append ("path")
        .attr ("d", `M0,0L${diagonal},${diagonal}`)
        .attr ("stroke", "var(--neutral-600)")
        .attr ("stroke-width", 2);
    stateData.counties.forEach(county => {
        let renderedCounty = renderCounty(county, county.flip, width, height);
        stateTulip.append(()=>{
            return renderedCounty.node();
        });
    });
    // Build enclosing background for tulip
    let maxXDataPoint = [[0, 0], [0, 0], [0, 0], [0, 0]];
    let maxYDataPoint = [[0, 0], [0, 0], [0, 0], [0, 0]];
    let electionYears = new Set();
    stateTulip.selectAll("circle").each(function(d) {
        electionYears.add(d.year);
    });
    electionYears = Array.from(electionYears).sort((a, b) => a - b);
    electionYears.forEach ( (year, y)=>{
        stateTulip.selectAll ("circle")
            .filter(function(d) {
                return d.year === year;
            })
            .each(function(d) {
                // Get circle coordinates
                const cx = +d3.select(this).attr("cx");
                const cy = +d3.select(this).attr("cy");
                
                // Calculate perpendicular distance from point to line y=x
                const dist = (cy - cx) / Math.sqrt(2);
                
                // Update max points - negative dist means above line, positive means below
                if (dist < 0 && (maxXDataPoint[y][0] === 0 || dist < (maxXDataPoint[y][1] - maxXDataPoint[y][0])/Math.sqrt(2))) {
                    maxXDataPoint[y] = [cx, cy];
                }
                if (dist > 0 && (maxYDataPoint[y][1] === 0 || dist > (maxYDataPoint[y][1] - maxYDataPoint[y][0])/Math.sqrt(2))) {
                    maxYDataPoint[y] = [cx, cy];
                }
            });
    });
    let closedTulipBackground = [[0,0], ...maxXDataPoint, maxXDataPoint.at(-1), maxYDataPoint.at(-1), ...maxYDataPoint.reverse(), [0, 0]];
    stateTulip.insert("path", ":first-child")
        .attr("d", d3.line().curve(d3.curveCatmullRom.alpha(0.5))(
            [[0, 0]].concat(closedTulipBackground) 
        ))
        .attr("class", "tulip-background")
        .attr ("fill", "var(--neutral-800)")
        .attr ("opacity", 0.05);
    
    return stateTulip;
}

export default renderState;