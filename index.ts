import { config } from "dotenv";
config();
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as cors from "cors";
import {
  templateRouter,
  sectionRouter,
  componentRouter,
  authRouter,
  campaignRouter,
  layoutRouter,
  userRouter,
} from "./routes";
import { handlePrismaError, logErrors } from "./middlewares/errorHandling";
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

app.use(logErrors);
app.use(handlePrismaError);

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => {
  console.log("Server started at port:", PORT);
});
