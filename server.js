const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
require("dotenv").config();

const app = express();

mongoose.set("strictQuery", true);
const dbURI = `${process.env.DB_CONNECTION}`;
mongoose
  .connect(dbURI)
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await shortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.post("/shortUrls", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
  console.log("url Shorted");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrls = await shortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrls.clicks++;
  shortUrls.save();

  res.redirect(shortUrls.full);
});

app.listen(process.env.PORT || 5000);
