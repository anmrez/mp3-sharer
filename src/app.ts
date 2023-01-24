import { HomeModule } from './home/home.module.ts';
import { ReaderModule } from "./reader/reader.module.ts";
import { Router } from './Router.ts';



export class AppModule{

  readerModule = new ReaderModule()
  homeModule = new HomeModule( this.readerModule )


  router = new Router(
    this.homeModule.contoller,
    this.readerModule.service
  )


  async listen( PORT: number ){

    const server = Deno.listen({ port: PORT });
    console.log( '[App]   -  server started on: ' + PORT + ' port' )

    for await ( const conn of server ) { this.httpServer( conn ) }

  }


  private async httpServer( conn: Deno.Conn ){

    const httpConn = Deno.serveHttp( conn );

    for await ( const requestEvent of httpConn ) {

      this.router.routes( requestEvent.request, requestEvent.respondWith )

    }

  }

}