import React from 'react';
import * as d3 from 'd3';
import renderState from './renderstate.js';
import renderHorizontalBarsCounty from './renderhorizontalbarscounty.js';
import renderStateName from './renderstatename.js';

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
        svg.node().appendChild((()=>{
            return renderedHorizontalBars.node();
        })());

        let renderedStateName = renderStateName(props.renderData, width, height);;
        svg.node().appendChild((()=>{
            return renderedStateName.node();
        })());

        svg.attr('height', "auto")
            .attr("width", "auto")
           .attr('viewBox', `0 0 ${width} ${height}`);
    }, [props.renderData]);

    return (
        <div style={{flex: 1, minWidth: "800px", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div id="viz" style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                maxHeight: "calc(98vh - var(--space-xxl))"
            }}></div>
        </div>
    );
}

export default VisualizationPanel;