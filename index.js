"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var cookie_parser_1 = require("cookie-parser");
var express = require("express");
var cors = require("cors");
var routes_1 = require("./routes");
var app = express.default();
app.use(express.json());
var corsOptions = {
    origin: process.env.FRONTEND,
    credentials: true,
    methods: "GET,PUT,POST,OPTIONS,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
};
app.use(cors.default(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/templates", routes_1.templateRouter);
app.use("/sections", routes_1.sectionRouter);
app.use("/section-palceholders", routes_1.sectionPlaceholderRouter);
app.use("/components", routes_1.componentRouter);
app.use("/component-palceholders", routes_1.componentPlaceholdersRouter);
app.use("/campaigns", routes_1.campaignRouter);
app.use("/layouts", routes_1.layoutRouter);
app.use("/auth", routes_1.authRouter);
app.use("/user", routes_1.userRouter);
var PORT = process.env.PORT || 6666;
app.listen(PORT, function () {
    console.log("Server started at port:", PORT);
});
