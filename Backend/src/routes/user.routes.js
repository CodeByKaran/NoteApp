import { Router } from "express";

const router = Router();

import { 
    signUp,
    verifyUser,
    refreshOtp,
    loginUser,
    updateAvatar,
    resetPassswordSendOtp,
    verifyOtp,
    changePassword,
    logOut,
    getCurrentUser
} from "../controllers/user.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { Authentication } from "../middleware/Auth.middelware.js";


router.route("/signup").post(
    upload.single("avatar"),
    signUp
)

router.route("/verify/:id").post(verifyUser)

router.route("/refreshotp/:id").post(refreshOtp)

router.route("/login").post(loginUser)

router.route("/updateavatar").post(
    Authentication,
    upload.single("avatar"),
    updateAvatar
)

router.route("/reset-password/otp").post(resetPassswordSendOtp)

router.route("/reset-password/otp/verify").post(verifyOtp)

router.route("/reset-password/otp/verify/pass").post(changePassword)

router.route("/log-out").get(Authentication,logOut)

router.route("/fetch-user").get(Authentication,getCurrentUser)

export default router;