import { ClientConfig } from "https://deno.land/x/mysql@v2.11.0/src/client.ts";
import { ISMTPClient } from "./src/mailer/mailer.service.ts";
import { IUser } from "./src/mysql/mysql.service.ts";


// PARAMS OF SERVER
export const serverParams = {
  port: 80, // PORT OF SERVER
  address: 'https://192.168.0.2',
  maxSize: 250, // in MB
  connectionsLogger: false, // logging connections in console
}

// SMTP
export const SMTPClient: ISMTPClient = {
  hostname: "YOUR_SMTP_SERVER",
  port: 465, // PORT OF CONNECTION
  username: "YOUR_USERNMAE",
  password: "YOUR_PASSWORD"
}


// MYSQL
export const mysqlConfig: ClientConfig = {
  hostname: "127.0.0.1",
  username: "root",
  db: "mp3_sharer",
  password: "YOUR_PASSEWORD",
  port: 3306
}


// USERS ( MAX 6 )
export const users: IUser[] = [
  {
    username: 'anmrez',
    image: 'anmrez.png',
    email: 'mail.mail.ru'
  },
  {
    username: 'Guest',
    image: 'default.png',
    email: 'mail.mail.ru'
  }
]