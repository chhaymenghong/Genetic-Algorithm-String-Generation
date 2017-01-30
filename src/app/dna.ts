export class DNA {
  public fitness: number;
  constructor( public target: string, public sequences: string[] ) {
    this.fitness = this.calFitness();
  }

  // By comparing each sequence with the original target string. 1.0 is max
  public calFitness(): number  {
    let fitness = 0.0;
    let targetLen = this.target.length;
    for ( let i = 0; i < targetLen; i++ ) {
      if ( this.target.charAt(i) === this.sequences[i] ) {
        fitness++;
      }
    }
    return fitness / targetLen;
  }
}
