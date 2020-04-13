if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const OAuthClientId = process.env.Client_ID;
const OAuthClientSecret = process.env.Client_Secret;

const express = require("express");
const app = express();
const request = require("request");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("./Frontend"));

let authenticated = false;
let accessToken;

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/authenticate", (req, res) => {
  res.render("authenticate.ejs", { OAuthClientId });
});

app.get("/main-page-authenticated", (req, res) => {
  const code = req.query.code;
  if (!authenticated) {
    request.post(
      `https://github.com/login/oauth/access_token?client_id=${OAuthClientId}&client_secret=${OAuthClientSecret}&code=${code}`,
      {
        json: true,
        headers: {
          "User-Agent": "jainrachitrj",
          Accept: "application/json",
        },
      },
      (err, response, body) => {
        if (err) {
          console.log("oops! some error occurred");
        }
        accessToken = body.access_token;
        authenticated = true;
        requestCompleted = true;
        res.render("main-page-authenticated.ejs", {
          accessToken: `""${accessToken}`,
        });
      }
    );
  }
  if (authenticated) {
    res.render("main-page-authenticated.ejs", {
      accessToken: `""${accessToken}`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
