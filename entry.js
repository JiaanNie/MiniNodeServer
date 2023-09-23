//configuration files
require("dotenv").config();
const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsOptions");

// core packages from nodejs
const path = require("path");

// external packages installed via npm
const express = require("express");
const mongoose = require("mongoose");

// custom middlewares
const { logger } = require("./middlewares/logEvent");
const errorHanlder = require("./middlewares/errorHanlder");
const { verifyJWT } = require("./middlewares/jwtVerifier");
const credentials = require("./middlewares/credentials");

// 3rd party middlewares
const cors = require("cors");
const cookieParser = require("cookie-parser");

connectDB();

// routers
const employeesRouter = require("./routers/api/employees");
const registerRouter = require("./routers/api/register");
const authRouter = require("./routers/api/auth");
const refreshTokenRoute = require("./routers/api/refreshToken");
const logoutRoute = require("./routers/api/logout");
const userRouter = require("./routers/api/user");

// constant
const PORT = process.env.PORT || 3500;

const app = express();
// let use some buildin middlewares

// the urlencoded is for when form data are being submitted in the url
// this allow the app to decode and get the data from the url
// because this function is being call right after the app being created
// all the get function will have this urlendcoded functionality, since this work like a waterfall

// all these are buildin middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// the default value is the / you dont need but for reability i think is good to have it

// the modual.export=<name> has to match when you import it using the require statment
app.use(credentials);
//3party middlewares cors

app.use(cors(corsOptions));

app.use(errorHanlder);

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/subdir", express.static(path.join(__dirname, "public")));

//applying new router which is a middlewire buildin

// non protected routes
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshTokenRoute);
app.use("/logout", logoutRoute);
// protected routes
app.use(verifyJWT);
app.use("/employees", employeesRouter);
app.use("/users", userRouter);

// custom middlewares
app.use(logger);

// adding custom error handler middleware
// the order of the param does matter ahhhh
mongoose.connection.once("open", () => {
  console.log("connected to mongo db");
  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
});
