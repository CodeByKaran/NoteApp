
import { Note } from "../models/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";



const createNote=async(req,res)=>{
    try {
        const {title,content} = req.body

        if(!title || !content){
            return res.status(402)
            .send(new ApiError(402,"data is required!"))
        }

        const user=  req.user;

        if(!user){
            return res.status(409)
            .send(new ApiError(409,"user not found!"))
        }

       const acko = await Note.create({title,content,owner:user._id})
        
        return res.status(200)
        .json(
            new ApiResponse(200,acko,"note created successfully!")
        )

    } catch (error) {
        throw new error
    }

}

const getAllNotes=async(req,res)=>{
    try {

        const allNotes = await Note.aggregate([
            {
                $match:{
                    owner : new mongoose.Types.ObjectId(req.user._id)
                }
            }
        ])
        
        return res.status(200)
        .json(
            new ApiResponse(200,allNotes,"fetched successfully!")
        )

    } catch (error) {
        console.log(error);
    }
}

const deleteNote=async(req,res)=>{
    try {
        const {_id} = req.params

        if(!_id){
            return res.status(409)
            .send(new ApiError(409,"_id is not defined"))
        }

      const acko = await Note.deleteOne({_id})

      return res.status(200)
      .json(new ApiResponse(200,acko,"deleted successfulyy!"))

    } catch (error) {
        throw new ApiError(500,error)
    }
}

const editNote=async(req,res)=>{
  try {
    const {_id} = req.params
    const {title,content} = req.body

    const note = await Note.findById(_id)

    const acko = await note.updateOne({title,content})

    return res.status(200)
    .json(new ApiResponse(200,acko,"edit note successfully!"))

  } catch (error) {
    throw new ApiError(500,error)
  }
}

export {
    createNote,
    getAllNotes,
    deleteNote,
    editNote
}