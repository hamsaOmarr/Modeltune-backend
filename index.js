const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);

const prisma = require("./prisma.js");

prisma
  .$connect()
  .then(() => console.log("Prisma Connection established"))
  .catch((err) => console.log(err));

app.use(cors());

const indexRouter = require("./routes/index.js");

app.use("/", indexRouter);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
