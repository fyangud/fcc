let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest()

let baseTemp
let values = []


let xScale
let yScale

let minYear
let maxYear

let width = 1200
let height = 600
let padding = 65

let canvas = d3.select('#canvas')
canvas.attr('width', width)
      .attr('height', height)

let tooltip = d3.select('#tooltip')

let generateScales = () => {
    minYear = d3.min(values, (item) => item.year)
    maxYear = d3.max(values, (item) => item.year)

    xScale = d3.scaleLinear()
               .domain([minYear, maxYear + 1])
               .range([padding, width - padding])
    
    yScale = d3.scaleTime()
               .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
               .range([padding, height - padding])
};

let drawCells = () => {
    canvas.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('class', 'cell')
          .attr('fill', (item) => {
            let variance = item.variance
            if(variance <= -1){
                return 'SteelBlue'
            }else if(variance <= 0){
                return 'LightSteelBlue'
            }else if(variance <=1){
                return 'Orange'
            }else{
                return 'Crimson'
            }
          })
          .attr('data-year', (item) => item.year)
          .attr('data-month', (item) => item.month - 1)
          .attr('data-temp', (item) => baseTemp + item.variance)
          .attr('height', (height - 2*padding)/12)
          .attr('y', (item) => yScale(new Date(0, item.month -1, 0, 0, 0, 0, 0)))
          .attr('width', (item) => {
            num = maxYear - minYear
            return (width - 2*padding)/num
          })
          .attr('x', (item) => xScale(item.year))
          .on('mouseover', (item) => {
            tooltip.transition()
                   .duration(0)
                   .attr('data-year', item.year)
                   .style('visibility', 'visible')
                   .text(item.year + ' / ' + item.month + ' Temperature ' + (baseTemp + item.variance) + '℃')
                   .style('left', d3.event.pageX + 'px')
                   .style('top', d3.event.pageY +20 + 'px')
          })
          .on('mouseout', (item) => {
            tooltip.transition()
                   .style('visibility', 'hidden')
          })
};

let drawAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format('d'))

    let yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat('%B'))

    canvas.append('g')
          .call(xAxis)
          .attr('id', 'x-axis')
          .attr('transform', 'translate(0,' + (height-padding) + ')')

    canvas.append('g')
          .call(yAxis)
          .attr('id', 'y-axis')
          .attr('transform', 'translate(' + padding + ',0)')
};

req.open('GET', url, true)
req.onload = () => {
    let object = JSON.parse(req.responseText)
    baseTemp = object.baseTemperature
    values = object.monthlyVariance

    generateScales()
    drawCells()
    drawAxes()
}
req.send()