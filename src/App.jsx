import React, {useState} from 'react';
import data from '../public/data/transformed_states.json';
import MainSidePanel from "./MainSidePanel.jsx";
import VisualizationPanel from "./VisualizationPanel.jsx";
import FilterSidePanel from "./FilterSidePanel.jsx";


/*function App() {
    React.useEffect(() => {
        const width = 1200;
        const height = 1200;

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
                return renderState(electionData[0].AL, width, height)
                    .attr("transform", `translate(${width/7}, ${height/7}) scale(${scaleFactor}) rotate(-135, ${width/2}, ${height/2})`)
                    .node();
            })()
        );
        console.log("itrigger only onece");
        svg.attr('width', width/1.5)
           .attr('height', height/1.5)
           .attr('viewBox', `0 0 ${width} ${height}`);
    }, []);

    return (
        <div>
            <h1>Election Visualization</h1>
            <div id="viz"></div>
        </div>
    );
}*/

const getStateObject = (visualizationData, state) => {
    return visualizationData.find(stateObj => stateObj.state === state);
}

const App = (props) => {
    const [visualizationData, setVisualizationData] = useState(data);
    const [selectedState, setSelectedState] = useState('Counties Which Flipped');
    const [selectedFilter, setSelectedFilter] = useState('2');
    const [renderData, setRenderData] = useState(getStateObject(visualizationData, selectedState));
    React.useEffect(() => {
        let stateData = getStateObject(visualizationData, selectedState);
        setSelectedFilter("allCounties");
        setRenderData(stateData);
    }, [selectedState]);
    React.useEffect(() => {
        let stateData = getStateObject(visualizationData, selectedState);
        console.log("filters changed");
        if(!isNaN(selectedFilter) && Number.isInteger(parseInt(selectedFilter))) {
            let stateDataFiltered = Object.assign({}, stateData);
            let countiesFiltered = stateDataFiltered.counties.filter(county => 
                county.flip[parseInt(selectedFilter)] === true
            );
            console.log(countiesFiltered);
            stateDataFiltered.counties = countiesFiltered;
            stateData = stateDataFiltered;
        } else if(selectedFilter === "consistentlyRepublican" || selectedFilter === "consistentlyDemocratic") {
            let stateDataFiltered = Object.assign({}, stateData);
            let countiesFiltered = stateDataFiltered.counties.filter(county => 
                county[selectedFilter] === true
            );
            stateDataFiltered.counties = countiesFiltered;
            stateData = stateDataFiltered;
        } else if(selectedFilter === "flipped") {
            let stateDataFiltered = Object.assign({}, stateData);
            let countiesFiltered = stateDataFiltered.counties.filter(county => 
                county.flip.some(value => value === true)
            );
            stateDataFiltered.counties = countiesFiltered;
            stateData = stateDataFiltered;
        }
        console.log(stateData.length);
        setRenderData(stateData);
    }, [selectedFilter]);
    return (
        <div style={{display: "flex", flexDirection: "row", padding: "var(--space-sm)"}}>
            <MainSidePanel visualizationData={visualizationData} selectedState={selectedState} setSelectedState={setSelectedState}/>
            <VisualizationPanel renderData={renderData}/>
            <FilterSidePanel selectedState={selectedState} visualizationData={visualizationData} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}/>
        </div>
    );
}

export default App; 