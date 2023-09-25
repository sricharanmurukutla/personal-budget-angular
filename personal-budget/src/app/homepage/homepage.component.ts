import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartOptions, ChartDataset } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';
// Import PieArcDatum from D3.js
import { PieArcDatum } from 'd3';

interface BudgetItem {
  title: string;
  budget: number;
}

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {
  public chartJsData: {
    datasets: ChartDataset[];
    labels: string[];
  } = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ff5733",
          "#ffa733",
          "#33ff57",
          "#336aff",
          "#a733ff",
          "#ff33c9",
          "#33ffc9",
        ],
      },
    ],
    labels: [],
  };

  myChartJsPieChart: Chart | undefined;
  d3Data: BudgetItem[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Load data for Chart.js pie chart
    this.dataService.getData().subscribe(res => {
      console.log(res);
         for (let i = 0; i < res.length; i++) {
           this.chartJsData.datasets[0].data[i] = res[i].budget;
           this.chartJsData.labels[i] = res[i].title;
         }
         this.createChartJsPieChart();
         this.d3Data = res;
         this.renderD3DoughnutChart();
      });

    // Load data for D3.js doughnut chart
  }

  createChartJsPieChart() {
    setTimeout(() => {
      const ctx = document.getElementById("myChart") as HTMLCanvasElement;

      if (!ctx) {
        console.error('Canvas element not found.');
        return;
      }

      if (this.myChartJsPieChart) {
        this.myChartJsPieChart.destroy();
      }

      try {
        this.myChartJsPieChart = new Chart(ctx, {
          type: 'pie',
          data: this.chartJsData,
          options: {
            responsive: false,
            maintainAspectRatio: false,
          } as ChartOptions
        });
      } catch (error) {
        console.error('Error creating Chart.js pie chart:', error);
      }
    });
  }

  renderD3DoughnutChart() {
    const width = 450,
      height = 450,
      margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3
      .select("#doughnut_chart_d3")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const data = this.d3Data;

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.title))
      .range(d3.schemeDark2);

    const pie = d3.pie<BudgetItem>()
      .sort(null)
      .value(d => d.budget);

    const dataReady = pie(data);

    const arc = d3.arc<PieArcDatum<BudgetItem>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const outerArc = d3.arc<PieArcDatum<BudgetItem>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg.selectAll("allSlices")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("d", d => arc(d) as string)
      .attr("fill", d => color(d.data.title))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg.selectAll("allPolylines")
      .data(dataReady)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", d => {
        const posA = arc.centroid(d) as [number, number];
        const posB = outerArc.centroid(d) as [number, number];
        const posC = outerArc.centroid(d) as [number, number];
        const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return `${posA},${posB},${posC}`;
      });

    svg.selectAll("allLabels")
      .data(dataReady)
      .enter()
      .append("text")
      .text(d => d.data.title)
      .attr("transform", d => {
        const pos = outerArc.centroid(d) as [number, number];
        const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", d => {
        const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }

  ngAfterViewInit(): void {
    // Leave this empty for now
  }

  ngOnDestroy(): void {
    if (this.myChartJsPieChart) {
      this.myChartJsPieChart.destroy();
    }
  }
}
