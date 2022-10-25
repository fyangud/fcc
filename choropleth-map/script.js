let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {

    canvas.selectAll('path')
          .data(countyData)
          .enter()
          .append('path')
          .attr('d', d3.geoPath())
          .attr('class', 'county')
          .attr('fill', (countyDataItem) => {
            let percentage = findCounty(countyDataItem.id).bachelorsOrHigher
            if(percentage <= 15){
                return 'orange'
            }else if(percentage <= 25){
                return 'gold'
            }else if(percentage <= 35){
                return 'yellowgreen'
            }else if(percentage <= 45){
                return 'olivedrab'
            }else{
                return 'darkolivegreen'
            }
          })
          .attr('data-fips', (countyDataItem) => countyDataItem.id)
          .attr('data-education', (countyDataItem) => findCounty(countyDataItem.id).bachelorsOrHigher)
          .on('mouseover', (item) => {
            let county = findCounty(item.id)
            tooltip.transition()
                   .duration(0)
                   .style('visibility', 'visible')
                   .style('top', d3.event.pageY + 'px')
                   .style('left', d3.event.pageX + 20 + 'px')
                   .attr('data-education', county.bachelorsOrHigher)
                   .text(county.area_name + ' ' + county.state + ': ' + county.bachelorsOrHigher+'%')
          })
          .on('mouseout', () => {
            tooltip.transition()
                   .style('visibility', 'hidden')
          })

}

let findCounty = (id) => {
    let county = educationData.find((item) => {
        return item.fips === id
    })
    return county
}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(error)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)
            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        drawMap()
                    }
                }
            )
        }
    }
)