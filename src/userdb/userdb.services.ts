import { users } from '../../config.ts';
import { GeneratorService } from "../generator/generator.service.ts";


export interface IUser {
  username: string
  email: string
  image: string
}

interface IListTokens{
  username: string
  token: string
  dateCreate: number
}

interface IUserTokens{
  username: string
  token: string
}


export class UserDBServices{

  users: IUser[] = users
  listOfLoginTokens: IListTokens[] = []
  userTokens: IUserTokens[] = []

  constructor(
    private readonly generatorService: GeneratorService
  ){}


  getUser( username: string ): IUser | null{

    const findIndex = this.findByName( username )
    if ( findIndex === null ) return null

    return this.users[findIndex]

  }


  getAll(){

    return this.users

  }


  createLoginToken( username: string, urlToken: string ){

    this.listOfLoginTokens.push({
      username: username,
      token: urlToken,
      dateCreate: new Date().getTime()
    })

  }


  checkingUrlToken( urlToken: string ){

    const findIndex = this.findByUrlToken( urlToken )
    if ( findIndex === null ) return null

    const usernameFromLoginToken = this.listOfLoginTokens[findIndex].username
    this.removeLoginToken( findIndex )

    const userIndex = this.findByName( usernameFromLoginToken )
    if ( userIndex === null ) return null

    const user = this.users[userIndex]

    const token = this.generatorService.token()

    this.userTokens.push({
      username: user.username,
      token: token
    })

    return token

  }


  findByUrlToken( urlToken: string ){

    let index = 0

    while( this.listOfLoginTokens.length > index ){

      const item = this.listOfLoginTokens[index]
      
      if ( item.token === urlToken ) {

        const fiveMinute = 1000 * 60 * 5
        if ( item.dateCreate + fiveMinute < new Date().getTime() ) {

          this.listOfLoginTokens.splice( index, 1 )
          return null

        }

        return index
      } 

      index++

    }

    return null


  }



  // PRIVATE === ===

  private findByName( username: string ): number | null{

    let index = 0

    while( this.users.length > index ){

      const item = this.users[index].username
      if ( item === username ) return index

      index++
      
    }

    return null

  }


  private findByEmail( email: string ): number | null{

    let index = 0

    while( this.users.length > index ){

      const item = this.users[index].email
      if ( item === email ) return index

      index++
      
    }

    return null

  }


  private removeLoginToken( index: number ){

    this.listOfLoginTokens.splice( index, 1 )

  }


}