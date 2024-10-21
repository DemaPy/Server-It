const { config } = require("dotenv");
config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const {
  templateRouter,
  sectionRouter,
  componentRouter,
  authRouter,
  campaignRouter,
  layoutRouter,
  userRouter,
} = require("./routes");
const { handlePrismaError, logErrors } = require("./middlewares/errorHandling");
const app = express();

var corsOptions = {
  origin: process.env.FRONTEND_DEV,
  credentials: true,
  methods: "GET,PUT,POST,OPTIONS,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/templates", templateRouter);
app.use("/sections", sectionRouter);
app.use("/components", componentRouter);
app.use("/campaigns", campaignRouter);
app.use("/layouts", layoutRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.get("/", (req, res) => res.send('Welcome to my app.<br/> <a href="https://github.com/DemaPy">Author</a>'));

app.use(logErrors);
app.use(handlePrismaError);

app.listen(3000, () => {
  console.log("Server started at port:", 3000);
});

module.exports = app;