import nodemailer from "nodemailer";
import Mailgen from 'mailgen'
import {EMAIL,EMAIL_PASSWORD} from "../constant.js"


const config={
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user: EMAIL ,
        pass: EMAIL_PASSWORD
    }
}

let transporter = nodemailer.createTransport(config)


let mailGenerator = new Mailgen({
  theme: 'default',
  product: {
      name: 'karan',
      link: 'https://mailgen.js/'
  }
});


export const sendEmail = async(name,userEmail,otp)=> {

  let email = {
    body: {
        name: name,
        intro: 'please verify yourself through otp given below.',
        table:{
          data:[
            {
              otp : otp
            }
          ]
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
  };
  
  let emailBody = mailGenerator.generate(email);
  
  let emailText = mailGenerator.generatePlaintext(email);
  
 
  let message = {
    from:process.env.EMAIL,
    to:userEmail,
    subject:"Verification",
    text:emailText,
    html:emailBody
  }

  try{
    await transporter.sendMail(message)
    return 1
  }catch(err){
    return 0
  }

}