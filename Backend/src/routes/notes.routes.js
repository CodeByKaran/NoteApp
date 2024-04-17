import {Router} from 'express'

const router = Router();

import { 
    createNote,
    getAllNotes,
    deleteNote,
    editNote
} from '../controllers/note.controller.js';


import { Authentication } from '../middleware/Auth.middelware.js';


router.route("/create").post(Authentication,createNote)

router.route("/all").get(Authentication,getAllNotes)

router.route("/delete/:_id").delete(Authentication,deleteNote)

router.route("/edit/:_id").put(Authentication,editNote)



export default router