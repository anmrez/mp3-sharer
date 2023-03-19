import { SendConfig, SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
// import { serverParams, SMTPClient } from "../../config.ts";
import { ConfigModule } from '../config/config.module.ts';

export interface ISMTPClient{
  hostname: string
  port: number
  username: string
  password: string
}

export class MailerService{


  // smtpClient = SMTPClient


  constructor( 
    private readonly configModule: ConfigModule
  ){

  }
  
  
  async send( useremail: string, tokenLink: string ): Promise< void > {
    
    const client: SmtpClient = new SmtpClient();
    // const fullAddress = serverParams.address + ':' + serverParams.port
    const fullAddress = this.configModule.server.address + ':' + this.configModule.server.port

    const sendConfig: SendConfig = {
      // from: 'MP3 Sharer <' + this.smtpClient.username + '>',
      from: 'MP3 Sharer <' + this.configModule.smtp.username + '>',
      to: useremail,
      subject: 'Login',
      content: tokenLink,
      html: `
      <a href='${ fullAddress }/login/?token=${ tokenLink }' > Your link to enter the site: ${ fullAddress }/login/?token=${ tokenLink } </a>
      <br/> 
      <span> This link is one-time and its lifetime is 5 minutes. </span>`
    }

    // await client.connectTLS( this.smtpClient );
    await client.connectTLS( this.configModule.smtp );
    await client.send( sendConfig );
    await client.close();

  }


}