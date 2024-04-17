import mongoose from 'mongoose'


const dbConnect=async()=>{
    try{
        const instance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`)
        console.log(`Db connected Succcesfully ${instance.connection.host}`);
    }catch(err){
        console.log("Error:",err);
        process.exit(1)
    }
}


export default dbConnect;