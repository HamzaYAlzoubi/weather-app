const https = require("https");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const query = req.query.q;

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ success: false, suggestions: [] });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ success: false, message: "Server config error" });
  }

  const limit = 5;
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${apiKey}`;

  return new Promise((resolve) => {
    https
      .get(url, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
          data += chunk;
        });

        apiRes.on("end", () => {
          try {
            const json = JSON.parse(data);

            if (apiRes.statusCode !== 200) {
              res
                .status(apiRes.statusCode)
                .json({ success: false, suggestions: [] });
              return resolve();
            }

            const suggestions = json.map((item) => ({
              name: item.name,
              country: item.country,
              state: item.state,
              lat: item.lat,
              lon: item.lon,
            }));

            res.status(200).json({ success: true, suggestions });
            resolve();
          } catch (e) {
            res.status(500).json({ success: false, suggestions: [] });
            resolve();
          }
        });
      })
      .on("error", () => {
        res.status(500).json({ success: false, suggestions: [] });
        resolve();
      });
  });
};
