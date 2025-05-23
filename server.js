const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());  
app.use(bodyParser.json());

const SID = process.env.EXOTEL_SID;
const TOKEN = process.env.EXOTEL_TOKEN;
const FROM = process.env.FROM_NUMBER;
const MESSAGE_URL = process.env.MESSAGE_URL; // Exotel Applet URL

const numbers = [
  "919967440045"
];

app.post("/start-campaign", async (req, res) => {
  try {
    for (const to of numbers) {
      await axios.post(
        `https://${SID}:${TOKEN}@api.exotel.com/v1/Accounts/${SID}/Calls/connect.json`,
        new URLSearchParams({
          From: FROM,
          To: to,
          CallerId: FROM,
          Url: MESSAGE_URL,
          CallType: "trans"  // transactional
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
    }
    res.send("Calls initiated to all numbers.");
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    res.status(500).send("Error sending calls.");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
