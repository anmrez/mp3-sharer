import { serveTls } from "https://deno.land/std@0.173.0/http/server.ts";
import { HomeModule } from './home/home.module.ts';
import { AuthNodule } from './auth/auth.module.ts';
import { GeneratorModule } from './generator/generator.module.ts';
import { MailerModule } from './mailer/mailer.module.ts';
import { MySQLModule } from './mysql/mysql.module.ts';
import { ProfileModule } from './profile/profile.module.ts';
import { UploadModule } from './upload/upload.module.ts';
import { CookieModule } from "./cookie/cookie.module.ts";
import { Router } from "./router/router.ts";
import { ResponseModule } from './response/response.module.ts';
import { AppController } from "./app.controller.ts";
import { SecureModule } from './secure/secure.module.ts';
import { ConfigModule } from './config/config.module.ts';
import { HashModule } from './hash/hash.module.ts';
import { Client } from "https://deno.land/x/mysql@v2.11.0/src/client.ts";
import { LoggerModule } from "./logger/logger.module.ts";


export class AppModule{

  private readonly controller: AppController
  private readonly secure: SecureModule
  
  constructor(
    private readonly config: ConfigModule,
    private readonly mysqlClient: Client,
  ){

    const loggerModule = new LoggerModule( this.config )
    const responseModule = new ResponseModule()
    const router = new Router( responseModule.service, loggerModule.service )
    const cookieModule = new CookieModule()
    const generatorModule = new GeneratorModule()
    const mailerModule = new MailerModule( config )
    const hashModule = new HashModule(  )

    const mysqlModule = new MySQLModule( router, this.mysqlClient, cookieModule, config )
    const profileModule = new ProfileModule( router, cookieModule, mysqlModule )
    const uploadModule = new UploadModule( router, mysqlModule, config, hashModule, loggerModule )
    const homeModule = new HomeModule( router, responseModule, mysqlModule )
    const authModule = new AuthNodule( router, mysqlModule, mailerModule, generatorModule, responseModule )
    this.secure = new SecureModule( router, mysqlModule, responseModule )
    
    this.controller = new AppController( router, responseModule.service )

  }
  
  
  async listen( PORT: number ){
        
    const serverOption: Deno.ListenTlsOptions = {
      port: PORT,
      certFile: './cert/cert.crt',
      keyFile: './cert/key.key',
    }

    serveTls( ( req ) => { 

      return this.secure.use( req )

    }, serverOption )

  }

}

