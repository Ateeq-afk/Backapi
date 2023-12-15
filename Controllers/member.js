const Member = require('../Model/Member.js');
const crypto = require('crypto');
const razorpay = require('../Middleware/razorpay.js');
const nodemailer = require('nodemailer');

exports.initiatememberpayment = async (req,res,next)=>{
  if (req.method !== 'POST') return res.status(405).end();
  console.log(req.body.totalamount,"hey")
  const options = {
    amount: req.body.totalamount * 100,
    currency: "INR",
    receipt: "receipt#1",
    payment_capture: '0'
  };
console.log(req.body.totalamount,"hey")
  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({ orderId: response.id });
  } catch (error) {
    res.status(500).send(error);
  }
}

exports.verifymemberpayment = async (req,res,next)=>{
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

exports.savemember = async (req, res, next) => {
    try {
      const memberCount = await Member.countDocuments();
  
      const memberId = `M0100${memberCount + 1}`;
      const newMember = new Member({
        memberId,
        title: req.body.title,
        passtype: req.body.passtype,
        activationdate: req.body.activationdate,
        expiringdate: req.body.expiringdate,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        amount: req.body.amount,
        gst: req.body.gst,
        totalamount: req.body.totalamount,
        razorpayOrderId: req.body.razorpayOrderId,
        razorpayPaymentId: req.body.razorpayPaymentId,
        // Add any other fields you need to save
      });
  
      await newMember.save();

      const userConfirmationEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>The United Pass Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
          body, h1, h2, h3, p, a, li {
            font-family: 'Poppins', sans-serif;
            color: #000000
          }
          .content-block {
            background-color: #FFFFFF;
            padding: 10px;
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
                      <h1 style="margin: 0; font-family: poppins, sans-serif; color: #FCB418 !important;">BACKPACKERS UNITED</h1>
                    </div>
                    <!--[if gte mso 9]>
                      </v:textbox>
                    </v:rect>
                    <![endif]-->
                  </td>
                </tr>
                <tr>
                  <td class="content-block">
                    <h2 class="title-yellow title-shadow">Welcome to Backpackers United Family</h2>
                   <p class="text-light">We are thrilled to confirm that your Travel Pass registration has been successfully processed. Below are the details of your Travel Pass</p>
                  </td>
                </tr>
                <tr>
                  <td class="content-block">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <!-- Membership Details -->
                      <tr>
                        <td style="font-family: Arial, sans-serif; color: #333333;">
                          <h3 style="border-bottom: 2px solid #333333; padding-bottom: 5px;">Travel Pass Details</h3>
                          <p><strong>Customer Name:</strong> ${req.body.firstname} ${req.body.lastname}</p>
                          <p><strong>Pass ID:</strong> ${memberId}</p>
                          <p><strong>Contact Number:</strong>  ${req.body.phonenumber}</p>
                          <p><strong>Email Address:</strong> ${req.body.email}</p>
                          <p><strong>Valid Till :</strong> ${req.body.expiringdate}</p>
                        </td>
                      </tr>
                      <!-- Travel  Pass Benefits -->
                      <tr>
                        <td style="font-family: Arial, sans-serif; color: #333333; padding-top: 20px;">
                          <h3 style="border-bottom: 2px solid #333333; padding-bottom: 5px;">Travel Pass Benefits:</h3>
                          <p>As a valued member, you are entitled to participate in one adventurous Tour/Trek each month using your exclusive the United Travel card.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #FFFFFF;">
                <tr>
                  <td style="padding: 20px; font-family: Arial, sans-serif; color: #333333;">
                    <!-- Payment Details Section -->
                    <h2 style="font-size: 20px; margin: 0 0 10px 0;">Payment Details:</h2>
                    <p><strong>Total Pass Fee:</strong>  ₹${req.body.amount}</p>
                    <p><strong>GST (18%):</strong> ₹${req.body.gst}</p>
                    <p><strong>Grand Total:</strong>₹${req.body.totalamount}</p>
                    <h2 style="font-size: 20px; margin: 20px 0 10px;">Payment Method:</h2>
                    <p><strong>Payment Transaction ID:</strong> ₹${req.body.razorpayPaymentId}</p>
                    <p><strong>Payment Date:</strong> ${req.body.activationdate}</p>
                    <h2 style="font-size: 20px; margin: 20px 0 10px;">Cancellation Policy and Terms:</h2>
                    <p>We understand that plans may change. In the event of a cancellation, please adhere to the following policy:</p>
                    <p>No refunds will be provided for cancellations after registering for the pass.</p>
                    <h2 style="font-size: 20px; margin: 20px 0 10px;">Important Notes:</h2>
                    <p>Your Pass is valid for 6 months from the activation date. Each month, you can choose to join one tour of your choice using your Travel Pass.</p>
                    <p>We're excited to have you as part of the Backpackers United family. Whether you're an avid adventurer or a first-time explorer, we're committed to providing you with unforgettable experiences.</p>
                    <p>If you have any questions or need further assistance, feel free to contact our pass services team at <a href="mailto:info@backpackersunited.in" style="color: #0066CC; text-decoration: none;">info@backpackersunited.in</a> or <a href="tel:+918310180586" style="color: #0066CC; text-decoration: none;">+91 8310180586</a>.</p>
                    <p>Thank you for choosing Backpackers United. Get ready for a journey filled with exciting escapades and new friendships!</p>
                    <p>Adventure awaits!</p>
                    <p>Best Regards,</p>
                    <p><strong>Backpackers United</strong><br>
                    <a href="mailto:info@backpackersunited.in" style="color: #0066CC; text-decoration: none;">info@backpackersunited.in</a><br>
                    <a href="tel:+918310180586" style="color:#0066cc; text-decoration: none;">+91 8310180586</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;


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
        subject: 'Your Backpackers United Travel Pass is Confirmed! Its Time to Travel!',
        html: userConfirmationEmail,
      };
      await transporter.sendMail(mailOptions);
      console.log('User confirmation email sent');
      const recipients = ['info@backpackersunited.in', 'ateeq@backpackersunited.in', 'habeeb@backpackersunited.in'];
      const staffNotificationEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Processed Notification</title>
  <style>
    /* CSS styles */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #000000 !important;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      color: #000000 !important;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1, h2 {
      color: #3498db;
    }
    p, ul, li {
      margin-bottom: 10px;
      color: #000000 !important;
    }
    /* Additional styles */
  </style>
</head>
<body>
  <div class="container">
    <h1>Payment Processed Successfully</h1>
    <p>A new payment has been successfully processed. Below are the details of the transaction for your records.</p>
    
    <h2>User Details:</h2>
    <ul> 
    <li><strong>Member Id:</strong> ${memberId}</li>
    <li><strong>Title:</strong> ${req.body.title}</li>
      <li><strong>Name:</strong> ${req.body.firstname} ${req.body.lastname}</li>
      <li><strong>Email:</strong> ${req.body.email}</li>
      <li><strong>Phone Number:</strong> ${req.body.phonenumber}</li>
      <li><strong>Pass Activation Date:</strong> ${req.body.activationdate}</li>
      <li><strong>Pass Expiry Date:</strong> ${req.body.expiringdate}</li>
      <!-- Add more user details as needed -->
    </ul>
    
    <h2>Payment Details:</h2>
    <ul>
      <li><strong>Razorpay Order ID:</strong> ${req.body.razorpayOrderId}</li>
      <li><strong>Razorpay Payment ID:</strong> ${req.body.razorpayPaymentId}</li>
      <li><strong>Amount:</strong> ₹${req.body.amount}</li>
      <li><strong>GST:</strong> ₹${req.body.gst}</li>
      <li><strong>Total Amount:</strong> ₹${req.body.totalamount}</li>
      <!-- Add more payment details as needed -->
    </ul>
    
    <p>If there are any issues or further actions required, please contact the finance team immediately.</p>
    <p>Thank you,</p>
    <p>Backpackers United System Notification</p>
  </div>
</body>
</html>
`;
    const adminMailOptions = {
        from: 'info@backpackersunited.in',
        to: recipients,
        subject: 'New Payment Received',
        html: staffNotificationEmail,
    };
    

    await transporter.sendMail(adminMailOptions);
    console.log('Admin notification email sent');
  
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }

}

