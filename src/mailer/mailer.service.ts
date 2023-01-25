import { SendConfig, SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { address, SMTPClient } from "../../config.ts";


export interface ISMTPClient{
  hostname: string
  port: number
  username: string
  password: string
}

export class MailerService{


  smtpClient = SMTPClient
  
  
  async send( useremail: string, tokenLink: string ): Promise< void > {
    
    const client: SmtpClient = new SmtpClient();
    const sendConfig: SendConfig = {
      from: 'MP3 Sharer <' + this.smtpClient.username + '>',
      to: useremail,
      subject: 'Login',
      content: tokenLink,
      html: `<a href='${address}/login/?token=${tokenLink}' > Ваша ссылка для вохда на сайт </a> <br/> <span> Данная сылка одноразвая и живет 5 минут </span>`
    }

    await client.connectTLS( this.smtpClient );
    await client.send( sendConfig );
    await client.close();

  }


}