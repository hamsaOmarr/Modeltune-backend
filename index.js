const express = require("express");
const cors = require("cors");
// require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://www.modeltune.co"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// const corsOptions = {
//   origin: "https://www.modeltune.co",
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 1000000 })
);

const prisma = require("./prisma.js");

prisma
  .$connect()
  .then(() => console.log("Prisma Connection established"))
  .catch((err) => console.log(err));

const indexRouter = require("./routes/index.js");

app.use("/", indexRouter);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
