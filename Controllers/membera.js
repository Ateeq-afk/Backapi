const Member = require('../Model/Member.js');
const crypto = require('crypto');
const razorpay = require('../Middleware/razorpay.js');
const nodemailer = require('nodemailer');

const initiatememberpayment = async (req, res, next) => {
    if (req.method !== 'POST') return res.status(405).end();

    // Create an order with Razorpay
    const options = {
        amount: req.body.totalamount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "receipt#1",
        payment_capture: '0'
    };

    try {
        const memberPaymentCount = await Member.countDocuments();

        // Generate a unique member payment ID
        const memberId = `M0100${memberPaymentCount + 1}`;
        const response = await razorpay.orders.create(options);

        // Create a record in the database with status 'pending'
        const newMemberPayment = new Member({
            memberId,
            status: 'pending',
            title: req.body.title,
            passtype: req.body.passtype,
            activationdate: req.body.activationdate,
            expiringdate: req.body.expiringdate,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            amount: req.body.amount,
            selecteddate: req.body.selecteddate,
            ticket:req.body.ticket,
            gst: req.body.gst,
            totalamount: req.body.totalamount,
            razorpayOrderId: response.id,
        });
        await newMemberPayment.save();

        res.status(200).json({ order: response });
    } catch (error) {
        console.error('Error in /member/initiatePayment:', error);
        res.status(500).send(error);
    }
};

const memberWebhook = async (req, res) => {
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
                await Member.findOneAndUpdate(
                    { razorpayOrderId: orderId }, 
                    { status: 'successful', razorpayPaymentId: paymentId },
                    { new: true }
                );
                // Retrieve payment details from the database
                const MemberPayment = await Member.findOne({ razorpayOrderId: orderId });

                // Retrieve updated payment details from the database
                if (MemberPayment) {
                    // Send confirmation email or perform other actions
                    await sendConfirmationEmail(MemberPayment);
                    res.status(200).json({ status: 'ok' });
                } else {
                    // Handle case where payment details are not found
                    res.status(404).json({ status: 'Payment details not found' });
                }
            } else {
                // Handle other events or ignore them
                res.status(200).json({ status: 'event not handled' });
            }
        } else {
            res.status(401).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendConfirmationEmail = async (memberDetails) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'info@backpackersunited.in',
            pass: 'A53Eo-!*',
        },
    });

    // User confirmation email
    const userConfirmationEmail = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Confirmation</title>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    body, html, table, tr, td, div, h1, h2, h3, p {
      font-family: 'Poppins', Arial, sans-serif;
    }
    .footer {
      background-color: #000;
      color: #fff;
      text-align: center;
      padding: 20px 0;
    }
    .footer img {
      max-width: 200px; /* Adjust as per your logo's dimensions */
    }
    .footer p {
      margin: 10px 0;
      color: #fff;
    }
    .footer .social-icons {
      font-size: 24px; /* Adjust as per your design */
    }
    .footer .social-icons a {
      color: #fff;
      margin: 0 10px;
      text-decoration: none;
    }
    </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F3F3F3; color:black;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; color: #000000;">
            <tr>
                <td align="center" bgcolor="#000000" style="padding: 40px 0 30px 0;">
                    <!-- Logo -->
                    <a href="https://ibb.co/42Js2F3" target="_blank">
                        <img src="https://i.ibb.co/HCXNCK3/Backpackers-logo-web.png" alt="Backpackers United Logo" width="300" style="display: block;"/>
                    </a>
                </td>
            </tr>
            <tr>
                                <td style="background-color: #FFFFFF; padding-left: 20px; padding-right:20px; font-family: 'Poppins', Arial, sans-serif;">
                                <h2 style="color: #FCB418; text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.3);">Welcome to the Backpackers United Family</h2>
                                    <p class="text-light" style="color: #333333;">Dear ${memberDetails.firstname} ${memberDetails.lastname},</p>
                                    <p class="text-light" style="color: #333333;">Thank you for choosing Backpackers United to enhance your travel experience! We are thrilled to confirm that your Travel Pass has been successfully activated and is ready to accompany you on your upcoming journeys. Below are the details of your Travel Pass:</p>
                                    <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 2px; color: #333333;">Travel Pass Details</h3>
                                    <p class="text-dark" style="color: #333333;"><strong>Member ID:</strong> ${memberDetails.memberId}</p>
                                    <p class="text-dark" style="color: #333333;"><strong>Pass Type:</strong> ${memberDetails.passtype}</p>
                                    <p class="text-dark" style="color: #333333;"><strong>Valid From:</strong> ${memberDetails.activationdate}</p>
                                    <p class="text-dark" style="color: #333333;"><strong>Valid Till:</strong> ${memberDetails.expiringdate}</p>
                                    <p class="text-dark" style="color: #333333;"><strong>Email Address:</strong> ${memberDetails.email}</p>
                                    <p class="text-dark" style="color: #333333;"><strong>Contact Number:</strong> ${memberDetails.phonenumber}</p>
                                    <p class="text-dark" style="color: #333333;"><strong>Total Pass Fee:</strong> ₹${memberDetails.totalamount}</p>
                                    <!-- Additional information -->
                                </td>
                            </tr>
                            <tr>
      <td style="background-color: #FFFFFF; padding-left: 20px; padding-right:20px ; font-family: 'Poppins', Arial, sans-serif; color: #000000;">
      <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 2px;">Travel Pass: Exclusive Member Benefits:</h3>
        <p style="color: #000000;">Your United Travel Pass unlocks a host of exclusive benefits designed to make your travels smoother, safer, and more enjoyable. Here's a glimpse of what awaits you:</p>
        <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 10px;">
          <li style="margin-bottom: 12px;">
            <p style=" color: #000000;"><strong style="font-size: 16px; color: #FCB418;">Monthly Adventure Selection:</strong> With your United Travel Pass, enjoy the benefit of selecting a monthly adventure, whether a trek or a tour, aligned with your pass type, at an exclusive 50% discount.</p>
          </li>
          <li style="margin-bottom: 12px;">
            <p style="color: #000000;"><strong style="font-size: 16px; color: #FCB418;">Exclusive Package Discounts:</strong> Venture beyond the typical 2-day, 1-night escapes with attractive discounts on a variety of travel packages. Save on extended itineraries crafted for the avid explorer in you.</p>
          </li>
          <li style="margin-bottom: 12px;">
            <p style="color: #000000;"><strong style="font-size: 16px; color: #FCB418;">Members-Only Invites:</strong> Step into an exclusive circle with access to special events and experiences. Your pass serves as your invitation to members-only gatherings, where like-minded travelers connect and unique opportunities unfold.</p>
          </li>
          <li style="margin-bottom: 12px;">
            <p style="color: #000000;"><strong style="font-size: 16px; color: #FCB418;">24/7 Support:</strong> At any hour, across all time zones, our dedicated travel assistance team is at your service, providing steadfast support to ensure your peace of mind.</p>
          </li>
        </ul>
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
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #FFFFFF; color: #000000;">
              <tr>
                <td style="padding-left: 20px; padding-right:20px; font-family: Arial, sans-serif; color: #333333;">
                  <!-- Payment Details Section -->
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 2px;">Payment Details:</h3>
                  <p><strong>Total Membership Fee:</strong> ${memberDetails.amount}</p>
                  <p><strong>GST (18%):</strong>${memberDetails.gst}</p>
                  <p><strong>Grand Total:</strong>${memberDetails.totalamount}</p>
                  <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 2px;">Cancellation Policy and Terms:
    </h3>
    <p>Refunds are not available once the Pass has been purchased. This ensures the commitment both from our side and the members to the unique experiences curated by Backpackers United.</p>
    <p>In exceptional circumstances, such as medical emergencies, passholders may request a deferral to the next month. Approval of such requests is at the discretion of Backpackers United, ensuring fairness and consideration for all our members.</p>
    <p>The United Travel Pass is designed for the personal use of the passholder only and cannot be gifted, sold, or transferred. The name on the Travel Pass is final and cannot be changed, preserving the integrity and personalized nature of our services.</p>
    <p>In case of a change of plans or if a traveler wishes to cancel their plan to travel that weekend using his or her Travel pass, it is required to inform us at least 7 days prior to the scheduled event. Failure to provide this notice may result in the cancellation of the Trek or Tour for that particular month, rendering the travel pass void for that period. Additionally, the traveler will lose one Trek or Tour from the 6 treks or tours included in the Travel Pass upon non-compliance with the cancellation policy.</p>
    <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 2px;">Important Notes:
    </h3>
                  <p>Your Travel Pass is valid for 12 months from the activation date. Each month, you can choose to join one tour of your choice using your United Travel Pass.</p>
                  <p>Please present your Travel Pass details during registrations and while boarding .</p>
                  <p>We're excited to have you as part of the Backpackers United family. Whether you're an avid adventurer or a first-time explorer, we're committed to providing you with unforgettable experiences.</p>
                  <p>If you have any questions or need further assistance, feel free to contact our membership services team at <a href="mailto:info@backpackersunited.in" style="color: #0066CC; text-decoration: none;">info@backpackersunited.in</a> or <a href="tel:+918310180586" style="color: #0066CC; text-decoration: none;">+91 8310180586</a>.</p>
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
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; background-color: #000000;  ">
            <tr>
              <td style="padding: 20px 0; text-align: center;">
                <img src="https://i.ibb.co/HCXNCK3/Backpackers-logo-web.png" alt="Backpackers United Logo" width="200" style="display: block; margin: 0 auto;"/>
                <p style="color: #FCB418; margin-top: 10px; font-family: 'Caveat Brush', cursive, sans-serif;">Its Time to Travel !</p>
                <p style="color: #fff; margin-bottom: 10px;">Copyright 2024 All Rights Reserved</p>
                <div class="social-icons">
      <!-- Add your Facebook image and link -->
      <a href="https://www.facebook.com/backpackersunited1/" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://i.ibb.co/4MWdQPZ/faceboo.png" alt="Facebook" style="border-radius: 50%; width: 24px; height: 24px; background-color: #fff;">
      </a>
      <!-- LinkedIn Image and Link -->
    <a href="https://www.linkedin.com/company/backpackers-united" target="_blank" style="margin: 0 10px; text-decoration: none;">
      <img src="https://i.ibb.co/8Bc4dtr/link.png" alt="LinkedIn" style="border-radius: 50%; width: 24px; height: 24px;">
    </a>
      <!-- Add your Instagram image and link -->
      <a href="https://www.instagram.com/backpackers_united_/?hl=en" target="_blank" style="margin: 0 10px; text-decoration: none;">
        <img src="https://i.ibb.co/HxgtGGv/insta.png" alt="Instagram" style="border-radius: 50%; width: 24px; height: 24px;">
      </a>
      <!-- Add your WhatsApp image and link -->
      <!-- Replace 'your-whatsapp-url' with the actual URL to your WhatsApp contact or profile -->
      <a href="https://wa.me/+919364099489" target="_blank" style="margin: 0 10px; text-decoration: none;">
                <img src="https://i.ibb.co/v4rcbCj/whatsapp.png" alt="WhatsApp" style="border-radius: 50%; width: 24px; height: 24px;">
              </a>
            </div>
            <!-- Visit Website -->
            <a href="https://backpackersunited.in/" target="_blank" style="color: #FCB418; text-decoration: none; display: inline-block; margin-top: 20px; font-family: 'Poppins', Arial, sans-serif;">Visit Our Website</a>
          </td>
        </tr>
      </table>
    </td>
      </tr>
    </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: 'info@backpackersunited.in',
        to: memberDetails.email,
        subject: 'Your Backpackers United Travel Pass is Confirmed!',
        html: userConfirmationEmail,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to member');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }

    // Admin notification email
    const adminNotificationEmail = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Member Registration Notification</title>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body, h1, h2, h3, p, a, li {
            font-family: 'Poppins', sans-serif;
            color: #000000;
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
        <div style="padding: 20px;">
            <h1>Member Registration Notification</h1>
            <p>A new Travel Pass has been registered in the system. Below are the details:</p>
            <ul>
                <li><strong>Member ID:</strong> ${memberDetails.memberId}</li>
                ${memberDetails.firstname || memberDetails.lastname ? `<li><strong>Name:</strong> ${memberDetails.firstname || ''} ${memberDetails.lastname || ''}</li>` : ''}
                <li><strong>Email:</strong> ${memberDetails.email}</li>
                <li><strong>Phone Number:</strong> ${memberDetails.phonenumber}</li>
                <li><strong>Pass Type:</strong> ${memberDetails.passtype}</li>
                <li><strong>Activation Date:</strong> ${memberDetails.activationdate}</li>
                <li><strong>Expiry Date:</strong> ${memberDetails.expiringdate}</li>
                <li><strong>Total Amount Paid:</strong> ₹${memberDetails.totalamount}</li>
                ${memberDetails.selecteddate ? `<li><strong>Travelling Date:</strong> ${memberDetails.selecteddate}</li>` : ''}
                ${memberDetails.ticket ? `<li><strong>Tickets:</strong> ${memberDetails.ticket}</li>` : ''}
            </ul>
        </div>
    </body>
    </html>
    `;

    const recipients = ['info@backpackersunited.in', 'ashwin@backpackersunited.in', 'habeeb@backpackersunited.in'];
    const adminMailOptions = {
        from: 'info@backpackersunited.in',
        to: recipients,
        subject: 'New Travel Pass Registration',
        html: adminNotificationEmail,
    };

    try {
        await transporter.sendMail(adminMailOptions);
        console.log('Admin notification email sent');
    } catch (error) {
        console.error('Error sending admin notification email:', error);
    }
};
module.exports = {
    initiatememberpayment,
    memberWebhook
  };
