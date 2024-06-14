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
  admin: [authMiddleware, roleMiddleware(["DEVELOPER", "ADMIN"])],
  private: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER"]),
  ],
  user: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER"]),
  ],
  guest: [
    authMiddleware,
    roleMiddleware(["DEVELOPER", "ADMIN", "PROJECT_MANAGER", "USER", "GUEST"]),
  ],
};

app.use("/templates", MIDDLEWARES.guest, templateRouter);
app.use("/sections", MIDDLEWARES.guest, sectionRouter);
app.use("/section-palceholders", MIDDLEWARES.guest, sectionPlaceholderRouter);

app.use("/components", MIDDLEWARES.guest, componentRouter);
app.use(
  "/component-palceholders",
  MIDDLEWARES.guest,
  componentPlaceholdersRouter
);

app.use("/campaigns", MIDDLEWARES.guest, campaignRouter);
app.use("/layouts", MIDDLEWARES.guest, layoutRouter);

app.use("/auth", authRouter);
app.use("/user", MIDDLEWARES.admin, userRouter);

const PORT = process.env.PORT || 6666;
app.listen(PORT, () => {
  console.log("Server started at port:", PORT);
});
