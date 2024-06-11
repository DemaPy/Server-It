import { config } from "dotenv";
config();
import cookieParser from 'cookie-parser'
import express from "express";
import cors from "cors";
import { authMiddleware, roleMiddleware } from "./middlewares";
import {
  templateRouter,
  sectionRouter,
  componentRouter,
  authRouter,
  campaignRouter,
  layoutRouter,
  placeholderRouter,
} from "./routes";

const app = express();

app.use(express.json());
var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,PUT,POST,OPTIONS,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(cookieParser())

const MIDDLEWARES = [authMiddleware, roleMiddleware(['DEVELOPER', 'USER'])]

app.use("/templates", MIDDLEWARES, templateRouter);
app.use("/sections", MIDDLEWARES, sectionRouter);
app.use("/palceholders", MIDDLEWARES, placeholderRouter);

app.use("/components", MIDDLEWARES, componentRouter);

app.use("/campaigns", MIDDLEWARES, campaignRouter);
app.use("/layouts", MIDDLEWARES, layoutRouter);

app.use("/auth", authRouter);

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => {
  console.log("Server started at port:", PORT);
});
