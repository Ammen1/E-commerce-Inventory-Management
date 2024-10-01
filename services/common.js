import nodemailer from 'nodemailer';

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "mail.gooderash.com",
  port: 465,
  secure: true, 
  auth: {
    user: 'e-learning@gooderash.com',
    pass: 'Amen#19729',
  },
  debug: true, // Enable debugging
});

// Verify the transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP Connection failed:', error);
  } else {
    console.log('SMTP Connection is successful');
  }
});

// Function to send an email
export const sendMail = async ({ to, subject, text, html }) => {
  try {
    let info = await transporter.sendMail({
      from: '"EagleLion System Technologies" <e-learning@gooderash.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};
