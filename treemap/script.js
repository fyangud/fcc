let dataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'

let fundingData
let hierarchy

let canvas = d3.select('#canvas')
let color = d3.scaleOrdinal().range([
    '#1f77b4',
    '#aec7e8',
    '#ff7f0e',
    '#ffbb78',
    '#2ca02c',
    '#98df8a',
    '#d62728',
    '#ff9896',
    '#9467bd',
    '#c5b0d5',
    '#8c564b',
    '#c49c94',
    '#e377c2',
    '#f7b6d2',
    '#7f7f7f',
    '#c7c7c7',
    '#bcbd22',
    '#dbdb8d',
    '#17becf',
    '#9edae5'
])
let tooltip = d3.select('#tooltip')

let drawTreeMap = () => {
    hierarchy = d3.hierarchy(fundingData, (node) => node.children)
                      .sum((node) => node.value)
                      .sort((node1, node2) => node2.value - node1.value)
    
    let createTreeMap = d3.treemap()
                          .size([1000, 600])
                          .paddingInner(1)
    
    createTreeMap(hierarchy)
    
    let fundingTiles = hierarchy.leaves()
    console.log(hierarchy)  

    let block = canvas.selectAll('g')
          .data(fundingTiles)
          .enter()
          .append('g')
          .attr('transform', (item) => {
            return 'translate('+item.x0 + ',' + item.y0 + ')'
          })
    
    block.append('rect')
         .attr('class', 'tile')
         .attr('fill', (item) => {
            return color(item.data.category)
         })
         .attr('data-name', (item) => item.data.name)
         .attr('data-category', (item) => item.data.category)
         .attr('data-value', (item) => item.data.value)
         .attr('width', (item) => item.x1 - item.x0)
         .attr('height', (item) => item.y1 - item.y0)
         .on('mouseover', (item) => {
            tooltip.transition()
                   .duration(0)
                   .style('visibility', 'visible')
                   .text('Name: ' +
                        item.data.name +
                        ' Category: ' +
                        item.data.category +
                        ' Value: ' +
                        item.data.value
                   )
                   .style('left', d3.event.pageX + 10 + 'px')
                   .style('top', d3.event.pageY + 10 + 'px')
                   .attr('data-value', item.data.value)
         })
         .on('mouseout', () => {
            tooltip.transition()
                   .style('visibility', 'hidden')
         })

    block.append('text')
         .attr('class', 'tile-name')
         .text((item) => item.data.name)
         .attr('x', 5)
         .attr('y', 20)
}

//generate legend
let legend = d3.select('#legend')
               .attr('height', 1200)

let drawLegend = () => {
    let categories = hierarchy.leaves().map((node) => {
        return node.data.category
    })
    categories = categories.filter((category, index, self) => {
        return self.indexOf(category) === index
    })

    let legendElem = legend
        .append('g')
        .attr('transform', 'translate(60, 10)')
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr('transform', (d, i) => {
            return (
                'translate('+ i %5* 180 + ',' + Math.floor(i /5) * 25 + ')'
            )
        })
    
    legendElem.append('rect')
              .attr('width', 40)
              .attr('height', 20)
              .attr('class', 'legend-item')
              .attr('fill', (d) => color(d))
    
    legendElem.append('text')
              .text((d) => d)
              .attr('x', 45)
              .attr('y', 15)
}

d3.json(dataURL).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            fundingData = data
            drawTreeMap()
            drawLegend()
        }
    }
)