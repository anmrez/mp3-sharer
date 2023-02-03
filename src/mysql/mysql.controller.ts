import { MySQLService } from './mysql.service.ts';


export class MySQLController{


  constructor(
    private readonly mySQLService: MySQLService
  ){}



  async getAllSounds( req: Request, res: any ){

    const sounds = await this.mySQLService.getAllSounds()
    const jsonData = JSON.stringify( sounds )

    res( new Response( jsonData, {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    } ) )

  }



}