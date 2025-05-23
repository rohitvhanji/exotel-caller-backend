const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: /\.vercel\.app$/
}));


app.use(bodyParser.json());

const SID = process.env.EXOTEL_SID;
const TOKEN = process.env.EXOTEL_TOKEN;
const FROM = process.env.FROM_NUMBER;
const MESSAGE_URL = process.env.MESSAGE_URL;

const numbers = [
  "919967440045"
];

app.post("/start-campaign", async (req, res) => {
  try {
    for (const to of numbers) {
      console.log(`📞 Initiating call to: ${to}`);
      
      const response = await axios.post(
        `https://${SID}:${TOKEN}@api.exotel.com/v1/Accounts/${SID}/Calls/connect.json`,
        new URLSearchParams({
          From: FROM,
          To: to,
          CallerId: FROM,
          Url: MESSAGE_URL,
          CallType: "trans"
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      console.log(`✅ Call to ${to} initiated successfully. Response:`);
      console.dir(response.data, { depth: null });
    }

    res.send("Calls initiated to all numbers.");
  } catch (err) {
    console.error("❌ Error during call initiation:");

    if (err.response) {
      console.error("Status Code:", err.response.status);
      console.error("Response Headers:", err.response.headers);
      console.error("Response Data:", err.response.data);
    } else if (err.request) {
      console.error("Request made but no response received:", err.request);
    } else {
      console.error("Error Message:", err.message);
    }

    res.status(500).send("Error sending calls.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
