// Import Roboto font
import "@fontsource/roboto/400.css";  // normal weight
import "@fontsource/roboto/700.css";  // bold weight
import * as d3 from 'd3';

import subpart from './subpart.js';
import sampleData from '../public/data/sample.json';

// Add this somewhere in your code to verify the import
console.log("Imported JSON data:", sampleData);
console.log("First circle radius:", sampleData.circles[0].radius);

document.addEventListener('DOMContentLoaded', () => {
    // Create SVG with 16:4 ratio
    const width = 800;  // base width
    const height = width * (4/16);  // maintain 16:4 ratio

    const svg = d3.select('#app')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'var(--info)');

    svg.node().appendChild(subpart.node());
}); 