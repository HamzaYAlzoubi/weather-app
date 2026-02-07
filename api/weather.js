const https = require("https");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const city = req.query.city;

  if (!city || city.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a city name" });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res
      .status(500)
      .json({ success: false, message: "Server config error" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&units=metric`;

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
              res.status(apiRes.statusCode).json({
                success: false,
                message: json.message || "City not found",
              });
              return resolve();
            }

            res.status(200).json({
              success: true,
              data: {
                city: json.name,
                country: json.sys?.country,
                temperature: Math.round(json.main?.temp),
                feelsLike: Math.round(json.main?.feels_like),
                tempMin: Math.round(json.main?.temp_min),
                tempMax: Math.round(json.main?.temp_max),
                humidity: json.main?.humidity,
                pressure: json.main?.pressure,
                description: json.weather?.[0]?.description,
                icon: json.weather?.[0]?.icon,
                iconUrl: `https://openweathermap.org/img/wn/${json.weather?.[0]?.icon}@4x.png`,
                windSpeed: json.wind?.speed,
                visibility: json.visibility,
                clouds: json.clouds?.all,
                sunrise: json.sys?.sunrise,
                sunset: json.sys?.sunset,
                timezone: json.timezone,
                coord: json.coord,
              },
            });
            resolve();
          } catch (e) {
            res.status(500).json({ success: false, message: "Parse error" });
            resolve();
          }
        });
      })
      .on("error", (e) => {
        res.status(500).json({ success: false, message: "Network error" });
        resolve();
      });
  });
};
