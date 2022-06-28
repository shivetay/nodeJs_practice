const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const DB = process.env.MONGO_DB.replace(`<PASSWORD>`, process.env.DB_PASSWORD);

const app = require("./app");

mongoose
  .connect(DB, {})
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app running on ${port}`);
});
