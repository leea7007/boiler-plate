const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://gPro:<1029384756aA!>@project0.gvq59.mongodb.net/?retryWrites=true&w=majority&appName=project0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connection..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("되는거니?");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
