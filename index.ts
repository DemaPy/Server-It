import { config } from "dotenv";
config();
import cookieParser from "cookie-parser";
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
  sectionPlaceholderRouter,
  componentPlaceholdersRouter,
  userRouter,
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
app.use(cookieParser());

const MIDDLEWARES = {
  admin: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN"]),
  ],
  developer: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN"]),
  ],
  private: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER"]),
  ],
  user: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER"]),
  ],
};

app.use("/templates", MIDDLEWARES.private, templateRouter);
app.use("/sections", MIDDLEWARES.private, sectionRouter);
app.use("/section-palceholders", MIDDLEWARES.private, sectionPlaceholderRouter);

app.use("/components", MIDDLEWARES.private, componentRouter);
app.use(
  "/component-palceholders",
  MIDDLEWARES.private,
  componentPlaceholdersRouter
);

app.use("/campaigns", MIDDLEWARES.private, campaignRouter);
app.use("/layouts", MIDDLEWARES.private, layoutRouter);

app.use("/auth", authRouter);
app.use("/user", MIDDLEWARES.private, userRouter);

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => {
  console.log("Server started at port:", PORT);
});
