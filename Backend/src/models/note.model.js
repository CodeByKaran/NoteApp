import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema(
    {
       title:{
        type:String,
        required:true,
        trim:true
       },
       content:{
        type:String,
        required:true,
       },
       owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
       }
    },
    {
        timestamps:true
    }
)

export const Note = mongoose.model("Note",NoteSchema)