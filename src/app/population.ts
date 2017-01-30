import { DNA } from "./dna";
export class Population {

  public currentPool: DNA[] = [];
  public targetLen: number;

  constructor( public populationTotal: number, public mutationRate: number, public target: string ) {
    this.targetLen = target.length;
  }

  // Generate a new Population
  public initializePopulationPool() {
    this._iterate( this.populationTotal, () => {
      let sequences = [];
      this._iterate( this.targetLen, () => {
        sequences.push( this._getNewCharacter() );
      } );
      this.currentPool.push( new DNA( this.target, sequences ) );
    });
  }

  public performCrossOver() : void {
    let matingPool = this._generateMatingPool();
    let matingPoolSize = matingPool.length;
    let newPool : DNA[] = [];

    this._iterate( this.populationTotal, ( dnaIndex ) => {
      let parent = this._getPairOfParent( matingPoolSize, matingPool )
      let newSequence = [];
      this._iterate( this.targetLen, ( index ) => {
        if ( index < this.targetLen / 2 ) {
          if ( parent.parentA === undefined ) {
            debugger;
          }
          newSequence.push( parent.parentA.sequences[ index ] );
        } else {
          newSequence.push( parent.parentB.sequences[ index ] );
        }
      } );
      let childDna = new DNA( this.target, newSequence );
      newPool.push( childDna );
    } );
    this.currentPool = newPool;
  }

  // Perform mutation for all dna in the pool
  public performMutation() : void {
    this._iterate( this.currentPool.length, ( dnaIndex ) => {
      let rand;
      let seq = this.currentPool[ dnaIndex ].sequences;
      this._iterate( seq.length, ( seqIndex ) => {
        rand = Math.random();
        if ( rand < this.mutationRate ) {
          seq[ seqIndex ] = this._getNewCharacter();
        }
      } )
    } );
  }

  private _generateMatingPool() : DNA[] {
    let maxFitness = this._findCurrMaxFitness();
    if ( maxFitness === 0 ) { return this.currentPool; }
    let matingPool : DNA[] = [];
    this._iterate( this.populationTotal, ( index ) => {
      let dna = this.currentPool[ index ];
      let multiplier = Math.floor( ( dna.fitness / maxFitness ) * 100 );
      this._iterate( multiplier, () => matingPool.push( dna ) );
    } );
    return matingPool;
  }

  private _getPairOfParent( matingPoolSize, matingPool ) {
    let rand, parentA, parentB;
    rand = this._getRandomInt(0, matingPoolSize - 1 );
    parentA = matingPool[rand];
    rand = this._getRandomInt(0, matingPoolSize - 1 );
    parentB = matingPool[rand];
    return { parentA: parentA, parentB: parentB };
  }

  // All lowercase and space characters have fair chances
  private _getNewCharacter() : string {
    let rand = this._getRandomInt( 97, 123 );
    if ( rand === 123 ) { rand = 32; }
    return String.fromCharCode( rand );
  }

  // Min Max inclusive
  private _getRandomInt( min, max ) : number {
    max++;
    return Math.floor( Math.random() *  ( max - min ) ) + min;
  }

  private _findCurrMaxFitness() : number {
    return Math.max.apply( Math, this.currentPool.map( ( dna ) => dna.fitness ) );
  }

  public evaluate() : number {
    for ( let i = 0; i < this.populationTotal; i++ ) {
      if ( this.currentPool[i].fitness === 1.0 ) {
        return i;
      }
    }
    return -1;
  }

  private _iterate( numIteration : number, callback ) {
    for ( let i = 0; i < numIteration; i++ ) {
      callback(i);
    }
  }
}
