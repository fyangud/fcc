let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let data
let widthScale
let heightScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
       .attr('height', height);

    svg.append('text')
       .text('Year')
       .attr('x', width-padding)
       .attr('y',height);
    
    svg.append('text')
       .text('Time')
       .attr('x', 0)
       .attr('y',padding);
};

let generateScales = () => {
    let yearsArray = data.map((item) => {
        return item.Year;
    });

    widthScale = d3.scaleLinear()
                   .domain([d3.min(yearsArray)-1, d3.max(yearsArray)+1])
                   .range([padding, width - padding]);

    let timeArray = data.map((item) => {
        return new Date(item.Seconds*1000);
    });

    heightScale = d3.scaleTime()
                    .domain([d3.min(timeArray), d3.max(timeArray)])
                    .range([padding, height - padding]);

};

let plot = () => {
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')
                    .style('left', '20px')
                    .style('top', '20px')
    
    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('cx', (item)=>widthScale(item.Year))
       .attr('cy', (item)=>heightScale(new Date(item.Seconds*1000)))
       .attr('r', '5')
       .attr('data-xvalue', (item)=>item.Year)
       .attr('data-yvalue', (item)=>new Date(item.Seconds*1000))
       .attr('fill', (item)=>{
           return item.Doping? 'orange':'blue';
       })
       .on('mouseover', (item)=>{
           tooltip
                  .style('visibility', 'visible')
                  .text('Name: '+item.Name+' Doping: '+item.Doping)
                  .attr('data-year', item.Year)
                  .style('left', d3.event.pageX + 10 + 'px')
                  .style('top', d3.event.pageY - 20 + 'px');
       })
       .on('mouseout', (item)=>{
           tooltip.transition()
                  .style('visibility', 'hidden');
       })
};


let generateAxes = () => {
    let xAxis = d3.axisBottom(widthScale)
                  .tickFormat(d3.format('d'));

    let yAxis = d3.axisLeft(heightScale)
                  .tickFormat(d3.timeFormat('%M:%S'));

    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,'+ (height-padding) +')');
       
    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate('+padding+',0)');
};

req.open('GET', url, true);
req.onload = () => {
    data = JSON.parse(req.response);
    console.log(data);
    drawCanvas();
    generateScales();
    plot();
    generateAxes();
};
req.send();