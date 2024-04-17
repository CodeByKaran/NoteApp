import { app } from "./App.js";
import dotenv from 'dotenv'
import dbConnect from "./db/dbConnect.js";



dotenv.config({
    path:"./.env"
})

dbConnect()
.then(()=>{
app.listen(process.env.PORT || 5000,()=>{
  console.log(`App is listening on the Port ${process.env.PORT}`);
})
}).catch(err=>console.log)