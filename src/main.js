import * as d3 from 'd3';
import { attrs } from 'd3-selection-multi';

let dim = { width: 720, height: 500 };
let svg = d3
  .select('body')
  .append('svg')
  .style('background', 'ghostwhite')
  .attrs(dim);

d3.select('body')
  .append('div')
  .append('button')
  .text('Change data')
  .on('click', changeData);

let plotArea = {
  x: 50,
  y: 50,
  width: 620,
  height: 400
};
svg.append('clipPath').attr('id', 'plot-area').append('rect').attrs(plotArea);

svg.append('g').attrs({
  transform: 'translate(0, 450)',
  id: 'x-grid',
  class: 'grid'
});
svg.append('g').attrs({
  transform: 'translate(50, 0)',
  id: 'y-grid',
  class: 'grid'
});
svg.append('g').attrs({
  transform: 'translate(0, 450)',
  id: 'x-axis'
});
svg.append('g').attrs({
  transform: 'translate(50, 0)',
  id: 'y-axis'
});

let container = svg.append('g').attr('clip-path', 'url(#plot-area)');

svg.append('polyline').attrs({
  points: '50,50 670,50 670,450',
  stroke: 'black',
  fill: 'none'
});

let dataset;
changeData();

function changeData() {
  // dataset size random number from range 60 to 100
  let size = Math.round(Math.random() * 40) + 60;
  // generate the data - an array of objects
  dataset = [];
  for (let i = 0; i < size; i++) {
    dataset.push({
      weight: Math.round(Math.random() * 50) + 55,
      height: Math.round(Math.random() * 30) + 160
    });
  }
  console.log(dataset);
  draw();
}

function draw() {
  let t = d3.transition().duration(2000);
  // Scales
  let scaleX = d3.scaleLinear(
    d3.extent(dataset, d => d.weight),
    [50, 670]
  );
  let scaleY = d3.scaleLinear(
    d3.extent(dataset, d => d.height),
    [450, 50]
  );
  let scaleS = d3
    .scaleSqrt()
    .domain(d3.extent(dataset, d => d.weight / d.height))
    .range([8, 20]);
  let scaleC = d3
    .scaleDiverging(d3.interpolateSpectral)
    .domain([
      d3.max(dataset, d => d.weight / d.height),
      d3.median(dataset, d => d.weight / d.height),
      d3.min(dataset, d => d.weight / d.height)
    ]);

  let gridX = d3.axisBottom(scaleX);
  gridX.tickFormat('').tickSize(-400).tickSizeOuter(0);
  d3.select('#x-grid').transition(t).call(gridX);
  let gridY = d3.axisLeft(scaleY);
  gridY.tickFormat('').tickSize(-620).tickSizeOuter(0);
  d3.select('#y-grid').transition(t).call(gridY);
  d3.selectAll('.grid').selectAll('line').attrs({
    stroke: 'lightgray',
    'stroke-dasharray': '5 3'
  });

  let axisX = d3.axisBottom(scaleX);
  d3.select('#x-axis').transition(t).call(axisX);
  let axisY = d3.axisLeft(scaleY);
  d3.select('#y-axis').transition(t).call(axisY);

  // bubbles
  let cAtts = {
    cx: d => scaleX(d.weight),
    cy: d => scaleY(d.height),
    r: d => scaleS(d.weight / d.height),
    fill: d => scaleC(d.weight / d.height),
    stroke: 'gray',
    opacity: 0.8
  };
  let circles = container.selectAll('circle').data(dataset);
  circles
    .enter()
    .append('circle')
    .attrs({
      cx: d => scaleX(d.weight),
      cy: d => scaleY(d.height),
      r: 0
    })
    .transition(t)
    .attrs(cAtts);
  circles.transition(t).attrs(cAtts);
  circles.exit().transition(t).attr('r', 0).remove();
}
