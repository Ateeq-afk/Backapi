const Book = require('../Model/Book.js');
const crypto = require('crypto');
const razorpay = require('../Middleware/razorpay.js');
const nodemailer = require('nodemailer');

const initiatepayment = async (req,res,next)=>{
  if (req.method !== 'POST') return res.status(405).end();

  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: '0'
  };

  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({ orderId: response.id });
  } catch (error) {
    res.status(500).send(error);
  }
}

const verifypayment = async (req,res,next)=>{
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature === razorpaySignature) {
    res.status(200).json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
}
// pages/api/savePayment.js


const savepayment = async (req,res,next)=>{

  try {
    const paymentCount = await Book.countDocuments();

    // Generate a unique booking ID
    const bookingId = `B0100${paymentCount + 1}`;
    const newPayment = new Book({
      bookingId,
      eventName: req.body.eventName,
      selecteddate: req.body.selecteddate,
      username: req.body.username,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      source:req.body.source,
      gst: req.body.gst,
      amount:req.body.amount,
      totalamount: req.body.totalamount,
      tickets: req.body.tickets,
      payableamount: req.body.payableamount,
      pendingamount: req.body.pendingamount,
      withtransport: req.body.withtransport,
      withouttransport: req.body.withouttransport,
      razorpayOrderId:req.body.razorpayOrderId,
      razorpayPaymentId: req.body.razorpayPaymentId
    });

    await newPayment.save();

    const userConfirmationEmail = `
    <html lang="en">
    <head>
      <title>Booking Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body, h1, h2, h3, p, a, li {
          font-family: 'Poppins', sans-serif;
          color: #000000 !important;
        }
        .content-block {
          background-color: #FFFFFF;
          padding: 20px;
        }
        .title-yellow {
          color: #FCB418;
        }
        .title-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .text-dark {
          color: #333333;
        }
        .text-light {
          color: #555555;
        }
        .link-blue {
          color: #0066CC;
          text-decoration: none;
        }
        .ul-disc {
          list-style-type: disc;
          padding-left: 20px;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F3F3F3;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
              <tr>
                <td>
                  <!--[if gte mso 9]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
                    <v:fill type="tile" src="" color="#333333" />
                    <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                  <![endif]-->
                  <div style="background-image: url('path-to-your-background-image.jpg'); background-color: #333333; background-position: center; background-repeat: no-repeat; background-size: cover; padding: 40px; text-align: center; color: #333333;">
        <!-- Header with Background Image -->
        <h1 style="margin: 0; font-family: poppins, sans-serif; color: #FCB418;">BACKPACKERS UNITED</h1>
    </div>
                  <!--[if gte mso 9]>
                    </v:textbox>
                  </v:rect>
                  <![endif]-->
                </td>
              </tr>
              <tr>
                <td class="content-block">
                  <h2 class="title-yellow title-shadow">Yay!!! Your Booking is Confirmed</h2>
                  <h2 class="title-yellow title-shadow">You are going to ${req.body.eventName || 'null'} .</h2>
                  <p class="text-dark">Dear ${req.body.username},</p>
                  <p class="text-light">We are absolutely thrilled to confirm your booking and are excited to be an integral part of your upcoming journey to ${req.body.eventName || 'null'}. Thank you for choosing Backpackers United as your travel partner. Below, you will find the details of your reservation, along with some helpful information for your travel. </p>
                  <!-- Original Tour Details -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Booking Details</h3>
                  <p class="text-dark"><strong>Booking ID:</strong> ${bookingId}</p>
                  <p class="text-dark"><strong>Name:</strong> ${req.body.username}</p>
                  <p class="text-dark"><strong>Tour Name:</strong> ${req.body.eventName || 'null'}</p>
                  <p class="text-dark"><strong>Contact:</strong>${req.body.phonenumber}</p>
                  <p class="text-dark"><strong>Email:</strong> ${req.body.email}</p>
                  <p class="text-dark"><strong>Departure Date:</strong>${req.body.selecteddate}</p>
                  <p class="text-dark"><strong>No of Tickets:</strong> ${req.body.tickets}</p>
                  <p class="text-dark"><strong>Total Amount Paid:</strong>  ${req.body.totalamount}</p>
                  <p>Pending Amount (INR) (Inclusive of Payment Gateway Charges): ${req.body.pendingamount || 'null'}</p>
                  <!-- Policy & Terms -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Policy & Terms</h3>
                  <ul class="ul-disc text-light">
                   <li>Cancellations made 30 days or more before the date of travel will incur a cancellation fee of 10.0% of the total tour cost.</li>
            <li>Cancellations made between 15 days to 30 days before the date of travel will incur a cancellation fee of 25.0% of the total tour cost.</li>
            <li>Cancellations made between 7 days to 15 days before the date of travel will incur a cancellation fee of 50.0% of the total tour cost.</li>
            <li>Cancellations made between 3 days to 7 days before the date of travel will incur a cancellation fee of 75.0% of the total tour cost.</li>
            <li>Cancellations made 0 days to 3 days before the date of travel will incur a cancellation fee of 100.0% of the total tour cost.</li>
                  </ul>
                  <p class="text-light">If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:info@backpackersunited.in" class="link-blue">info@backpackersunited.in</a> or <a href="tel:+918310180586" class="link-blue">+91 8310180586</a>.</p>
                  <p class="text-light">We look forward to providing you with an unforgettable experience on your upcoming tour with us.</p>
                  <p class="text-dark">Thank you for choosing “Backpackers United”.</p>
                  <p class="text-light">Adventure awaits!</p>
                  <p class="text-light">Best Regards,</p>
                  <p class="text-dark"><strong>Backpackers United</strong></p>
                  <p class="text-light">
                    <a href="mailto:info@backpackersunited.in" class="link-blue">info@backpackersunited.in</a><br>
                    <a href="tel:+918310180586" class="link-blue">+91 8310180586</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Replace the following with your email configuration
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'info@backpackersunited.in',
      pass: 'A53Eo-!*',
    },
  });

  const mailOptions = {
    from: 'info@backpackersunited.in',
    to: req.body.email, // User's email address
    subject: 'Payment Confirmation',
    html: userConfirmationEmail,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Error sending user confirmation email:', error);
    } else {
      console.log('User confirmation email sent');
    }
  });

  // Send emails to three different email addresses
  const recipients = ['info@backpackersunited.in', 'ateeq@backpackersunited.in', 'habeeb@backpackersunited.in'];

    const adminNotificationEmail = `
    <html lang="en">
    <head>
      <title>Booking Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body, h1, h2, h3, p, a, li {
          font-family: 'Poppins', sans-serif;
          color: #000000 !important;
        }
        .content-block {
          background-color: #FFFFFF;
          padding: 20px;
        }
        .title-yellow {
          color: #FCB418;
        }
        .title-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .text-dark {
          color: #333333;
        }
        .text-light {
          color: #555555;
        }
        .link-blue {
          color: #0066CC;
          text-decoration: none;
        }
        .ul-disc {
          list-style-type: disc;
          padding-left: 20px;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F3F3F3;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
              <tr>
                <td>
                  <!--[if gte mso 9]>
                  <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;">
                    <v:fill type="tile" src="" color="#333333" />
                    <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                  <![endif]-->
                  <div style="background-image: url('path-to-your-background-image.jpg'); background-color: #333333; background-position: center; background-repeat: no-repeat; background-size: cover; padding: 40px; text-align: center; color: #333333;">
        <!-- Header with Background Image -->
        <h1 style="margin: 0; font-family: poppins, sans-serif; color: #FCB418;">BACKPACKERS UNITED</h1>
    </div>
                  <!--[if gte mso 9]>
                    </v:textbox>
                  </v:rect>
                  <![endif]-->
                </td>
              </tr>
              <tr>
                <td class="content-block">
                  <h2 class="title-yellow title-shadow">Yay!!! Your Booking is Confirmed</h2>
                  <h2 class="title-yellow title-shadow">You are going to ${req.body.eventName || 'null'}.</h2>
                  <p class="text-dark">Dear ${req.body.username},</p>
                  <p class="text-light">We are absolutely thrilled to confirm your booking and are excited to be an integral part of your upcoming journey to ${req.body.eventName || 'null'}. Thank you for choosing Backpackers United as your travel partner. Below, you will find the details of your reservation, along with some helpful information for your travel. </p>
                  <!-- Original Tour Details -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Booking Details</h3>
                  <p class="text-dark"><strong>Booking ID:</strong> ${bookingId}</p>
                  <p class="text-dark"><strong>Name:</strong> ${req.body.username}</p>
                  <p class="text-dark"><strong>Tour Name:</strong> ${req.body.eventName || 'null'}</p>
                  <p class="text-dark"><strong>Contact:</strong>${req.body.phonenumber}</p>
                  <p class="text-dark"><strong>Email:</strong> ${req.body.email}</p>
                  <p class="text-dark"><strong>Departure Date:</strong>${req.body.selecteddate}</p>
                  <p class="text-dark"><strong>No of Tickets:</strong> ${req.body.tickets}</p>
                  <p class="text-dark"><strong>With Transportation From Bangalore:  </strong> ${req.body.withtransport || '0'} qty </p>
                  <p class="text-dark"><strong>  Without Transportation:  ${req.body.withouttransport || '0'} </strong>  qty</p>
                  <p class="text-dark"><strong>Total Amount Paid:</strong>  ${req.body.totalamount}</p>
                  <p>Pending Amount (INR) (Inclusive of Payment Gateway Charges): ${req.body.pendingamount || 'null'}</p>
                  <!-- Policy & Terms -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Policy & Terms</h3>
                  <ul class="ul-disc text-light">
                   <li>Cancellations made 30 days or more before the date of travel will incur a cancellation fee of 10.0% of the total tour cost.</li>
            <li>Cancellations made between 15 days to 30 days before the date of travel will incur a cancellation fee of 25.0% of the total tour cost.</li>
            <li>Cancellations made between 7 days to 15 days before the date of travel will incur a cancellation fee of 50.0% of the total tour cost.</li>
            <li>Cancellations made between 3 days to 7 days before the date of travel will incur a cancellation fee of 75.0% of the total tour cost.</li>
            <li>Cancellations made 0 days to 3 days before the date of travel will incur a cancellation fee of 100.0% of the total tour cost.</li>
                  </ul>
                  <p class="text-light">If you have any questions or need further assistance, feel free to contact our support team at <a href="mailto:info@backpackersunited.in" class="link-blue">info@backpackersunited.in</a> or <a href="tel:+918310180586" class="link-blue">+91 8310180586</a>.</p>
                  <p class="text-light">We look forward to providing you with an unforgettable experience on your upcoming tour with us.</p>
                  <p class="text-dark">Thank you for choosing “Backpackers United”.</p>
                  <p class="text-light">Adventure awaits!</p>
                  <p class="text-light">Best Regards,</p>
                  <p class="text-dark"><strong>Backpackers United</strong></p>
                  <p class="text-light">
                    <a href="mailto:info@backpackersunited.in" class="link-blue">info@backpackersunited.in</a><br>
                    <a href="tel:+918310180586" class="link-blue">+91 8310180586</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    
    const adminMailOptions = {
        from: 'info@backpackersunited.in',
        to: recipients,
        subject: 'New Payment Received',
        html: adminNotificationEmail,
    };
    

    transporter.sendMail(adminMailOptions, (error) => {
      if (error) {
        console.error('Error sending admin notification email:', error);
      } else {
        console.log('Admin notification email sent');
      }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  initiatepayment,
  verifypayment,
  savepayment
};