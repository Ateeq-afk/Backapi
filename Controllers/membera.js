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
        <title>Travel Pass Confirmation</title>
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
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td>
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
                        <tr>
                            <td>
                                <div style="background-color: #333333; padding: 40px; text-align: center; color: #333333;">
                                    <h1 style="margin: 0; font-family: 'Poppins', sans-serif; color: #FCB418;">BACKPACKERS UNITED</h1>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="content-block">
                                <h2 class="title-yellow title-shadow">Welcome to the Backpackers United Family</h2>
                                <p class="text-light">Dear ${memberDetails.firstname} ${memberDetails.lastname},</p>
                                <p class="text-light">We are thrilled to confirm that your Travel Pass registration has been successfully processed. Below are the details of your Travel Pass:</p>
                                <h3 class="text-dark" style="border-bottom: 2px solid #333; padding-bottom: 5px;">Travel Pass Details</h3>
                                <p class="text-dark"><strong>Member ID:</strong> ${memberDetails.memberId}</p>
                                <p class="text-dark"><strong>Pass Type:</strong> ${memberDetails.passtype}</p>
                                <p class="text-dark"><strong>Valid From:</strong> ${memberDetails.activationdate}</p>
                                <p class="text-dark"><strong>Valid Till:</strong> ${memberDetails.expiringdate}</p>
                                <p class="text-dark"><strong>Email Address:</strong> ${memberDetails.email}</p>
                                <p class="text-dark"><strong>Contact Number:</strong> ${memberDetails.phonenumber}</p>
                                <p class="text-dark"><strong>Total Pass Fee:</strong> ₹${memberDetails.totalamount}</p>
                                <!-- Additional information -->
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

    const recipients = ['info@backpackersunited.in', 'ateeq@backpackersunited.in', 'habeeb@backpackersunited.in'];
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
