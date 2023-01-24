import { PORT } from "./config.ts";
import { AppModule } from "./src/app.ts";



const app = new AppModule()




app.listen( PORT )