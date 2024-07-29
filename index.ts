import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";
import * as express from "express";
import * as cors from "cors";
import {
  templateRouter,
  sectionRouter,
  componentRouter,
  authRouter,
  campaignRouter,
  layoutRouter,
  sectionPlaceholderRouter,
  componentPlaceholdersRouter,
  userRouter,
} from "./routes";
const app = express.default();

app.use(express.json());
var corsOptions = {
  origin: process.env.FRONTEND_DEV,
  credentials: true,
  methods: "GET,PUT,POST,OPTIONS,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors.default(corsOptions));
app.use(cookieParser());

app.use("/templates", templateRouter);
app.use("/sections", sectionRouter);
app.use("/section-palceholders", sectionPlaceholderRouter);

app.use("/components", componentRouter);
app.use("/component-palceholders", componentPlaceholdersRouter);

app.use("/campaigns", campaignRouter);
app.use("/layouts", layoutRouter);

app.use("/auth", authRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => {
  console.log("Server started at port:", PORT);
});
