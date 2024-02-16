import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

/**
 *
 * @param email email of receiver
 * @param subject Subject or body of mail (html supported)
 * @param name name of the recipient
 * @returns success flag
 */
export default async function sendMail(
  email: string,
  subject: string,
  name: string,
  title: string
): Promise<boolean> {
  try {
    let flg: boolean = false;
    const transponder = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions: MailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: title,
      html: `
        <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Manager App - Notification</title>
            <style>
                ${style}
            </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://event-manager-ten.vercel.app/images/event.png" alt="Eventify" class="logo">
                        <h1>Eventify</h1>
                    </div>
                    <div class="content">
                        <div class="message">
                            <p class="Hello_message" >Hello ${name},</p>
                            ${subject}
                        </div>
                    </div>
                    <div class="footer">
                        <p>This email was sent from the Eventify App. Please do not reply.</p>
                    </div>
                </div>
            </body>
        </html>
        `,
    };
    const res = await transponder.sendMail(mailOptions);
    if (res.accepted.length > 0) {
      flg = true;
    }
    return flg;
  } catch (error: any) {
    console.error(`FAILED TO SEND EMAIL: ${error.message}`);
    return false;
  }
}

var style = `
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .logo {
    width: 150px;
    height: auto;
  }
  .content {
    margin-bottom: 20px;
  }
  .message {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
  }
  .footer {
    text-align: center;
  }
  .Hello_message{
    font-size:18px;
    font-weight:semibold;
    opacity:0.8;
  }
  img{
    width:100%;
    height:auto;
    border-radius: 5px;
    pointer-events:none;
    object-fit:cover;
  }
  a{
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
  }
  a:hover{
    color: #0056b3;
    text-decoration: underline;
  }
  a:focus{
    color: #0056b3;
    text-decoration: underline;
  }
  a:active{
    color: #0056b3;
    text-decoration: underline;
  }
  p{
    margin-top:0;
    margin-bottom:1rem;
  }
  h1,h2,h3,h4,h5,h6{
    margin-top:0;
    margin-bottom:.5rem;
  }
  h1{
    font-size:2.5rem;
  }
  pre{
    display:block;
    padding:2rem;
    margin-top:0;
    margin-bottom:1rem;
    overflow:auto;
    font-family: Arial, sans-serif;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  
`;
