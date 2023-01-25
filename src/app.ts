import { HomeModule } from './home/home.module.ts';
import { ReaderModule } from "./reader/reader.module.ts";
import { Router } from './Router.ts';
import { AuthNodule } from './auth/auth.module.ts';
import { UserDBModule } from './userdb/userdb.module.ts';
import { GeneratorModule } from './generator/generator.module.ts';
import { MailerModule } from './mailer/mailer.module.ts';



export class AppModule{

  generatorModule = new GeneratorModule()
  mailerModule = new MailerModule()
  readerModule = new ReaderModule()
  
  userDBModule = new UserDBModule( this.generatorModule )
  homeModule = new HomeModule( this.readerModule )
  authModule = new AuthNodule( this.userDBModule, this.mailerModule, this.generatorModule )

  router = new Router(
    this.homeModule.contoller,
    this.readerModule.service,
    this.authModule.controller
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