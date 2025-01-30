import React from 'react';
import * as d3 from 'd3';
import subpart from './subpart.js';
import renderState from './renderstate.js';
import renderHorizontalBarsCounty from './renderhorizontalbarscounty.js';

const VisualizationPanel = (props) => {
    React.useEffect(() => {
        const width = 1200;
        const height = 1200;

        // remove an existing viz 
        const oldViz = d3.select('#viz').select('svg').remove();

        const svg = d3.select('#viz')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background-color', 'none');

        svg.node().appendChild(subpart.node());
        
        svg.node().appendChild(
            (() => {
                const diagonal = Math.sqrt(width * width + height * height);
                const scaleFactor = (height / diagonal);
                return renderState(props.renderData, width, height)
                    .attr("transform", `translate(${width/7}, ${height/7}) scale(${scaleFactor}) rotate(-135, ${width/2}, ${height/2})`)
                    .node();
            })()
        );
        let renderedHorizontalBars = renderHorizontalBarsCounty(
            height,
            800
        );
        console.log(renderedHorizontalBars.node());
        svg.node().appendChild((()=>{
            return renderedHorizontalBars.node();
        })());

        svg.attr('width', width/1.5)
           .attr('height', height/1.5)
           .attr('viewBox', `0 0 ${width} ${height}`);
    }, [props.renderData]);

    return (
        <div style={{flex: 1}}>
            <div id="viz" style={{
                display: "flex",
                justifyContent: "center"
            }}></div>
        </div>
    );
}

export default VisualizationPanel;