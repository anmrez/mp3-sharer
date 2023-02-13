import { AppModule } from "./src/app.ts";
import { serverParams } from './config.ts';



const app = new AppModule()
const PORT = serverParams.port


app.listen( PORT )