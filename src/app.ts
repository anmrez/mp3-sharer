import { HomeModule } from './home/home.module.ts';
import { ReaderModule } from "./reader/reader.module.ts";
import { Router } from './Router.ts';
import { AuthNodule } from './auth/auth.module.ts';
import { GeneratorModule } from './generator/generator.module.ts';
import { MailerModule } from './mailer/mailer.module.ts';
import { MySQLModule } from './mysql/mysql.module.ts';
import { ProfileModule } from './profile/profile.module.ts';
import { UploadModule } from './upload/upload.module.ts';



export class AppModule{

  mysqlModule = new MySQLModule()

  generatorModule = new GeneratorModule()
  mailerModule = new MailerModule()
  readerModule = new ReaderModule()

  profileModule = new ProfileModule( this.mysqlModule )
  uploadModule = new UploadModule( this.profileModule, this.mysqlModule )
  homeModule = new HomeModule( this.readerModule )

  authModule = new AuthNodule( this.mysqlModule, this.mailerModule, this.generatorModule )

  router = new Router(
    this.homeModule.contoller,
    this.readerModule.service,
    this.authModule.controller,
    this.profileModule.controller,
    this.uploadModule.controller,
    this.mysqlModule.constroller
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