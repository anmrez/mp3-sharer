import { HomeService } from './home.service.ts';
import { ReaderService } from '../reader/reader.service.ts';



export class HomeController{


  constructor( 
    private readonly homeService: HomeService,
    private readonly readerService: ReaderService
  ){}


  async get( req: Request, res: any ){

    const device = this.homeService.getDeviceType( req )
    let file;


    if ( device === 'pc' ) file = await this.readerService.read( './client/PC.html' )
    if ( device === 'mobile' ) file = await this.readerService.read( './client/Mobile.html' )
    if ( file === undefined ) {
      res( new Response( '404 - file not found ', {
        status: 404
      } ) )
      return;
    }

    const readableStream = file.readable;
    const response = new Response(readableStream);
    await res(response);

  }



}