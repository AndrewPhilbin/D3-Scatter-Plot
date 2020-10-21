let margin = { top: 20, right: 50, bottom: 20, left: 50 };

let height = 600 - margin.left - margin.right;
let width = 1000 - margin.top - margin.bottom;

let svgBuild = d3
  .select('.container')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
).then((data) => {
  console.log(data);

  let times = [];
  data.forEach((item) => {
    times.push(item.Time);
  });

  let parsedTimes = times.map((time) => time.split(':'));
  let yDates = parsedTimes.map((time) => {
    return new Date(0, 0, 0, 0, time[0], time[1]);
  });

  let years = [];
  data.forEach((item) => years.push(item.Year));

  let xScale = d3
    .scaleLinear()
    .domain([d3.min(years) - 1, d3.max(years) + 1])
    .range([0, width]);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

  svgBuild
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  let yParser = d3.timeFormat('%M:%S');

  let yScale = d3.scaleTime().domain(d3.extent(yDates)).range([0, height]);

  let yAxis = d3.axisLeft(yScale).tickFormat(yParser);
  svgBuild.append('g').attr('id', 'y-axis').call(yAxis);

  let tooltip = d3
    .select('.container')
    .append('div')
    .attr('id', 'tooltip')

    .style('opacity', 0);

  let mouseover = function (d) {
    tooltip.style('opacity', 1).attr('data-year', d.Year);

    d3.select(this).style('stroke', 'black').style('opacity', 1);
  };
  let mousemove = function (d) {
    tooltip
      .html(`${d.Name} <br> ${d.Year} ${d.Time} <br> ${d.Doping}`)
      .style('left', d3.mouse(this)[0] + 100 + 'px')
      .style('top', d3.mouse(this)[1] + 10 + 'px');
  };

  let mouseleave = function (d) {
    tooltip.style('opacity', 0);
    d3.select(this).style('stroke', 'none').style('opacity', 0.8);
  };

  svgBuild
    .append('g')
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xScale(d.Year))
    .attr('cy', (d, i) => yScale(yDates[i]))
    .attr('r', 5)
    .attr('data-xvalue', (d, i) => d.Year)
    .attr('data-yvalue', (d, i) => yDates[i])
    .attr('fill', (d) => {
      if (d.Doping === '') {
        return 'green';
      } else return 'red';
    })
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseleave', mouseleave);
});
