const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });
const port = 3000;
const DB = process.env.DB.replace("<password>", process.env.PASS);
mongoose.connect(DB).then(() => {
  console.log("Connection successful");
});

app.listen(port, () => {
  console.log("server is listening on the port", port);
});
