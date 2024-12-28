import * as d3 from 'd3';

var subpart = d3.create('svg:circle')
    .attr('cx', 800/2)    // center x position
    .attr('cy', 400/2)   // center y position
    .attr('r', 30)          // radius
    .style('fill', 'var(--danger)');  // using our color palette

export default subpart;