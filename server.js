const express = require("express");
const fetch = require("node-fetch");
const os = require("os");
const app = express();

const WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";

app.get("/api/systeminfo", async (req, res) => {
  const info = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().map(cpu => cpu.model),
    totalMem: os.totalmem(),
    freeMem: os.freemem()
  };

  try {
    const response = await fetch("https://ipinfo.io/json?token=YOUR_TOKEN");
    const data = await response.json();
    info.publicIP = data.ip;
    info.city = data.city;
    info.region = data.region;
    info.country = data.country;
  } catch {
    info.publicIP = "Unavailable";
  }

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: "📊 New System Info",
      embeds: [
        {
          title: "System Report",
          fields: Object.keys(info).map(key => ({
            name: key,
            value: String(info[key]),
            inline: false
          }))
        }
      ]
    })
  });

  res.json({ status: "sent", data: info });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
