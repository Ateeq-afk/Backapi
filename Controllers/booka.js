const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Book = require('../Model/Book.js');
const razorpay = require('../Middleware/razorpay.js');

// Initiate payment
const initiatepayment = async (req, res) => {
    // Create an order with Razorpay
    const amountInPaise = Math.round(parseFloat(req.body.amount) * 100);
    const options = {
        amount: amountInPaise, // amount in the smallest currency unit
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: '0'
    };

    try {
        const paymentCount = await Book.countDocuments();

        // Generate a unique booking ID
        const bookingId = `B0100${paymentCount + 1}`;
        const response = await razorpay.orders.create(options);
        // Create a record in the database with status 'pending'
        const newPayment = new Book({
            bookingId,
            status: 'pending',
            eventName: req.body.eventName,
            selecteddate: req.body.selecteddate,
            username: req.body.username,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            source:req.body.source,
            gst: req.body.gst,
            tcs: req.body.tcs,
            amount:req.body.amount,
            totalamount: req.body.totalamount,
            tickets: req.body.tickets,
            payableamount: req.body.payableamount,
            pendingamount: req.body.pendingamount,
            withtransport: req.body.withtransport,
            withouttransport: req.body.withouttransport,
            razorpayOrderId: response.id,
          });
        await newPayment.save();

        res.status(200).json({ order: response });
    } catch (error) {
        console.error('Error in /bookb/initiatePayment:', error);
        res.status(500).send(error);
    }
};

// Razorpay Webhook handler
const webhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest === req.headers['x-razorpay-signature']) {
            const event = req.body.event;
            if (event === 'payment.authorized') {
                const paymentId = req.body.payload.payment.entity.id;
                const orderId = req.body.payload.payment.entity.order_id;
                
                // Update the payment status in the database
                // await Book.findOneAndUpdate({ razorpayOrderId: orderId }, { status: 'successful', razorpayPaymentId: paymentId });
                await Book.findOneAndUpdate(
                    { razorpayOrderId: orderId }, 
                    { status: 'successful', razorpayPaymentId: paymentId },
                    { new: true }
                );
                // Retrieve payment details from the database
                const paymentDetails = await Book.findOne({ razorpayOrderId: orderId });

                // Check if paymentDetails exist, then send email
                if (paymentDetails) {
                    sendConfirmationEmail(paymentDetails);
                    res.status(200).json({ status: 'ok' });
                } else {
                    // Handle case where payment details are not found
                    res.status(200).json({ status: 'Payment details not found' });
                }
            } else {
                res.status(200).json({ status: 'event not handled' });
            }
        } else {
            res.status(401).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Function to send confirmation email

const sendConfirmationEmail = async (paymentDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'info@backpackersunited.in',
          pass: 'A53Eo-!*',
        },
    });
  
    // User confirmation email
  
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
          color: #FCB418 !important;
        }
        .title-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .text-dark {
          color: #333333 !important;
        }
        .text-light {
          color: #555555 !important;
        }
        .link-blue {
          color: #0066CC !important;
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
                  <h2 class="title-yellow title-shadow">Yay!!! Your Booking is Confirmed</h2>
                  <h2 class="title-yellow title-shadow">You are going to ${paymentDetails.eventName || 'null'} .</h2>
                  <p class="text-dark">Dear ${paymentDetails.username},</p>
                  <p class="text-light">We are absolutely thrilled to confirm your booking and are excited to be an integral part of your upcoming journey to ${paymentDetails.eventName || 'null'}. Thank you for choosing Backpackers United as your travel partner. Below, you will find the details of your reservation, along with some helpful information for your travel. </p>
                  <!-- Original Tour Details -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Booking Details</h3>
                  <p class="text-dark"><strong>Booking ID:</strong> ${paymentDetails.bookingId}</p>
                  <p class="text-dark"><strong>Name:</strong> ${paymentDetails.username}</p>
                  <p class="text-dark"><strong>Tour Name:</strong> ${paymentDetails.eventName || 'null'}</p>
                  <p class="text-dark"><strong>Contact:</strong>${paymentDetails.phonenumber}</p>
                  <p class="text-dark"><strong>Email:</strong> ${paymentDetails.email}</p>
                  <p class="text-dark"><strong>Departure Date:</strong>${paymentDetails.selecteddate}</p>
                  <p class="text-dark"><strong>No of Tickets:</strong> ${paymentDetails.tickets}</p>
                  <p class="text-dark"><strong>Total Amount Paid:</strong>  ${paymentDetails.totalamount}</p>
                  <p class="text-dark"><strong>GST:</strong> ${paymentDetails.gst}</p>
${paymentDetails.tcs ? `<p class="text-dark"><strong>TCS:</strong> ${paymentDetails.tcs}</p>` : ''}
                  <p>Pending Amount (INR) (Inclusive of Payment Gateway Charges): ${paymentDetails.pendingamount || 'null'}</p>
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
  `;// Your HTML email content using paymentDetails
  
    const mailOptions = {
        from: 'info@backpackersunited.in',
        to: paymentDetails.email,
        subject: 'Payment Confirmation',
        html: userConfirmationEmail,
    };
  
    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to user');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
  
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
          color: #FCB418 !important;
        }
        .title-shadow {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .text-dark {
          color: #333333 !important;
        }
        .text-light {
          color: #555555 !important;
        }
        .link-blue {
          color: #0066CC !important;
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
        <h1 style="margin: 0; font-family: poppins, sans-serif; color: #FCB418  !important;">BACKPACKERS UNITED</h1>
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
                  <h2 class="title-yellow title-shadow">You are going to ${paymentDetails.eventName || 'null'}.</h2>
                  <p class="text-dark">Dear ${paymentDetails.username},</p>
                  <p class="text-light">We are absolutely thrilled to confirm your booking and are excited to be an integral part of your upcoming journey to ${paymentDetails.eventName || 'null'}. Thank you for choosing Backpackers United as your travel partner. Below, you will find the details of your reservation, along with some helpful information for your travel. </p>
                  <!-- Original Tour Details -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Booking Details</h3>
                  <p class="text-dark"><strong>Booking ID:</strong> ${paymentDetails.bookingId}</p>
                  <p class="text-dark"><strong>Name:</strong> ${paymentDetails.username}</p>
                  <p class="text-dark"><strong>Tour Name:</strong> ${paymentDetails.eventName || 'null'}</p>
                  <p class="text-dark"><strong>Contact:</strong>${paymentDetails.phonenumber}</p>
                  <p class="text-dark"><strong>Email:</strong> ${paymentDetails.email}</p>
                  <p class="text-dark"><strong>Departure Date:</strong>${paymentDetails.selecteddate}</p>
                  <p class="text-dark"><strong>No of Tickets:</strong> ${paymentDetails.tickets}</p>
                  <p class="text-dark"><strong>With Transportation From Bangalore:  </strong> ${paymentDetails.withtransport || '0'} qty </p>
                  <p class="text-dark"><strong>  Without Transportation:  ${paymentDetails.withouttransport || '0'} </strong>  qty</p>
                  <p class="text-dark"><strong>Total Amount Paid:</strong>  ${paymentDetails.totalamount}</p>
                  <p class="text-dark"><strong>GST:</strong> ${paymentDetails.gst}</p>
                  ${paymentDetails.tcs ? `<p class="text-dark"><strong>TCS:</strong> ${paymentDetails.tcs}</p>` : ''}
                  <p>Pending Amount (INR) (Inclusive of Payment Gateway Charges): ${paymentDetails.pendingamount || 'null'}</p>
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
    
    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Admin notification email sent');
  } catch (error) {
      console.error('Error sending confirmation email:', error);
  }
  
  
  };
  const getTodaysBookings = async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  
      const todaysBookings = await Book.find({
        createdAt: { $gte: today },
        status: 'successful',
      });
  
      const totalTickets = todaysBookings.reduce((acc, booking) => acc + parseInt(booking.tickets), 0);
  
      res.status(200).json({ totalTickets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not retrieve today's bookings" });
    }
  };
  module.exports = {
    initiatepayment,
    webhook,
    getTodaysBookings
  };
