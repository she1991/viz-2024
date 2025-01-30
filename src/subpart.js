import * as d3 from 'd3';

var subpart = d3.create('svg:g');  // using our color palette

    // Add N markings
    const numMarkings = 50; // Can be changed to any number
    for (let i = 0; i < numMarkings; i++) {
        const angle = (i * (360/numMarkings)) * Math.PI / 180; // Evenly space markings
        const x1 = 800/2 + Math.sin(angle) * 35; // Inner point
        const y1 = 400/2 - Math.cos(angle) * 35;
        const x2 = 800/2 + Math.sin(angle) * 40; // Outer point
        const y2 = 400/2 - Math.cos(angle) * 40;
        
        const g = subpart.append('g')
            .attr('transform', `translate(${x1},${y1}) rotate(${Math.atan2(y2-y1, x2-x1) * 180/Math.PI})`);
        g.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 2) // Length of line
            .attr('height', 1)
            .attr('fill', 'var(--neutral-900)');
        g.append('rect')
            .attr('x', 0)
            .attr('y', -1)
            .attr('width', 2)
            .attr('height', 1)
            .attr('fill', 'var(--neutral-900)');
    }

export default subpart;