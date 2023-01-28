

export class GeneratorService{


  urlToken(): string {


    return this.generateStroke( 50 ) 

  }


  token(): string {

    return this.generateStroke( 50 )

  }



  // PRIVATE === ===

  private generateStroke( length: number ): string {

    let result = ''
    let index = 0

    while( length > index ){

      const random = Math.random()
      if ( random < 0.5 ) result += this.getChar( 'letter' )
      if ( random >= 0.5 && random <= 0.9 ) result += this.getChar( 'capital' )
      if ( random > 0.9 ) result += this.getChar( 'number' )

      index++

    }

    return result

  }


  private getChar( arg: 'letter' | 'capital' | 'number' ): string {

    // The length of all lines is 36
    const letter = 'qwertyuiopasdfghjklzxcvbnmqwertyuiop'
    const capital = 'QWERTYUIOPASDFGHJKLZXCVBNMQWERTYUIOP'
    const numbers = '123456789012345678901234567890123456'

    const random = Math.random() * 36
    const floor = Math.floor( random )

    if ( arg === 'letter' ) return letter[floor]
    if ( arg === 'capital' ) return capital[floor]
    
    return numbers[floor]

  }



}