import { AppModule } from "./src/app.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";
import { ConfigModule } from "./src/config/config.module.ts";
import { Client } from "https://deno.land/x/mysql@v2.11.0/mod.ts";


const envPath = Deno.env.get( 'envPath' )
const env = await load({ envPath: envPath })
const config = new ConfigModule( env )


const mysqlClient = await new Client().connect( config.mysql )


const app = new AppModule( config, mysqlClient )
app.listen( config.server.port )