import { Component, ElementRef, OnInit } from '@angular/core';
import { DNA } from './DNA';
import { Population } from './Population';
import { Observable } from 'rxjs';
import { D3Service, D3, Selection } from 'd3-ng2-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public population : Population;
  private _d3 : D3;

  // two way data-binding properties
  public target : string;
  public populationTotal : number;
  public mutationRate : number;
  public animationSpeed : number;

  public speed : number;
  public generationNum : number;
  private _timer;

  constructor( private _el: ElementRef, private _d3Service : D3Service ) {
    this._d3 = _d3Service.getD3();
    this.generationNum = 0;
  }

  ngOnInit() {
  }

  private start() {
    this.speed = +this.animationSpeed;
    this.population = new Population( +this.populationTotal, +this.mutationRate, this.target.toLowerCase() );
    // stop current timer
    if ( this._timer ) {
      this._timer.stop();
    }

    // clear old Selection
    this._d3.select('svg').remove();

    this.generationNum = 0;
    let svg = this._setupSvg();
    let listOfG = this._setupG( svg );
    this.population.initializePopulationPool();
    this._timer = this._d3.interval( () => {
      // Draw
      this._draw( listOfG );
      if ( this.population.evaluate() !== -1 ) {
        this._timer.stop();
      }
      this.population.performCrossOver();
      this.population.performMutation();
      this.generationNum++;
    }, this.speed * 2 );
  }

  private _draw( listOfG ) {
    for ( let i = 0; i < listOfG.length; i++ ) {
        this._updateData( this.population.currentPool[ i ].sequences, listOfG[ i ] );
    }
  }

  private _setupG( svg ) {
    let listOfG = [];
    for ( let i = 0; i < this.populationTotal; i++ ) {
      listOfG.push( svg.append( 'g' ).attr('transform', "translate(0" + "," + ( i * 30 ) + ")").attr('id', i ) );
    }
    return listOfG;
  }

  private _setupSvg() {
    let width = '100%';
    let height = '100%';
    return this._d3.select('.container').append( 'svg' )
                .attr( 'width', width )
                .attr( 'height', height );
  }

  private _updateData( data, g ) {
    debugger;
    // With key function, the element with the new letter will be marked as enter instead of update
    let updateSelection = g.selectAll('text').data( data, ( d ) => d );

    updateSelection.exit()
      .attr('class', 'exit')
      .transition()
      // There could potentially be issue with async. Need to happen fast, because during the next update, selectAll will have reference to it
      // and as a result, they wont be deleted. Must set interval time to be higher thatn this exit duration
      .duration(this.speed)
      .attr( 'y', 200 )
      .style("fill-opacity", 1e-6)
      .remove();

    updateSelection.attr( 'class', 'update' )
                   .attr( 'fill-opacity', 1 )
                  .transition()
                   .attr( 'x', ( d, i ) => i * 20 )
                   .duration( this.speed );




    updateSelection.enter().append( 'text' ).attr( 'class', 'enter' )
                                                                 .attr( 'y', 0 )
                                                                 .attr( 'x', ( d, i ) => i * 20 )
                                                                 .attr( 'font-size', '20')
                                                                 .attr( 'font-weight', 'bold' )
                                                                 .attr( 'font-family', 'monospace' )
                                                                 .style( "fill-opacity", 1e-6 )
                                                                 .text( ( eachCharacter ) => eachCharacter )
                                                                .transition()
                                                                 .attr( 'y', 50 )
                                                                 .style( 'fill-opacity', 1 )
                                                                 .duration( this.speed );


  }
}
