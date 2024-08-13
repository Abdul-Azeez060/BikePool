const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

async function sendNotification(phoneNumber) {
  try {
    const message = await client.messages.create({
      body: "Someone booked your ride",
      messagingServiceSid: process.env.MESSAGING_SERVICE_ID,

      to: phoneNumber,
    });
    return message;
  } catch (error) {
    console.log("failed to send notification");
    return null;
  }
}

module.exports = sendNotification;
