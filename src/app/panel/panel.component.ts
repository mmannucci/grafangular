import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

declare const Plotly: any;

interface Graph {
  data: any | undefined
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @ViewChild("myGraph", { static: false })
  myGraphContainer!: ElementRef;

  myGraph: Graph;
  dataPipe: BehaviorSubject<any> = new BehaviorSubject({})

  constructor() { 
    this.myGraph = {
      data: undefined
    }
  }

  ngOnInit(): void {
    this.myGraph = {
      data: [{ x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+markers', marker: {color: 'red'} },
      { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' }]
    }
      
  }
  
  ngAfterViewInit(): void {
    console.log(this.myGraphContainer.nativeElement);
    
    /*Plotly.newPlot(
      this.myGraphContainer.nativeElement,
      this.myGraph.data
    )*/

    Plotly.newPlot(this.myGraphContainer.nativeElement,
      [
        {
          x: [this.getTimestamp()],
          y: [this.getData()],
          type: 'scatter', mode: 'lines+markers', marker: {color: 'red'} 
        }
      ])

      var cnt = 0;

      const SAMPLES = 10;
      const UPDATE = 1000;

      this.dataPipe.subscribe((data) => {
        Plotly.extendTraces(this.myGraphContainer.nativeElement, data, [0]);
          cnt++;
          if(cnt > SAMPLES) {
              Plotly.relayout(this.myGraphContainer.nativeElement,{
                  xaxis: {
                      range: [new Date(new Date().getTime()-SAMPLES*UPDATE),this.getTimestamp()]
                  }
              });
          }
      })

      let interval = setInterval(() => {
        let nextData = { x: [[this.getTimestamp()]], y:[[this.getData()]]}
        this.dataPipe.next(nextData);
      },UPDATE);

  }

  getTimestamp() {
    return new Date();
  }

  getData() {
    return Math.random();
  }

}
