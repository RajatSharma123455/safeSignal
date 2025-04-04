import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Create a new client instance
const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  console.log("Scan this QR code in WhatsApp:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp Bot is ready!");
});

// Send a message function
const sendMessage = async (phone, message) => {
  try {
    let phoneNumber = "";
    if (phone.length == 10) {
      phoneNumber = "91" + phone;
    } else {
      throw new Error("Phone number is not valid");
    }
    const formattedNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`;
    const msg = `*Emergency request raised by ${message.name}*
    
    *Victim Name*: ${message.name}
    *Location*: ${message.locationName}
    *Needs*: ${message.immediateNeeds}
    *Number of People*: ${message.numberOfPeople}
    `;
    const res = await client.sendMessage(formattedNumber, msg);
    if (res) {
      console.log(`Message sent to ${phone}`);
      return { res, msg };
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Start the client
client.initialize();

// Export function for external use
export default sendMessage;
