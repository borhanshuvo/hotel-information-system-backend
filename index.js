const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
dotenv.config();

// Database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

// Request process
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// internal route
const userRouters = require("./routers/userRouters");
const hotelRouters = require("./routers/hotelRouters");
const roomRouters = require("./routers/roomRouters");
const loginRoute = require("./routers/loginRouter");
const bookingRoute = require("./routers/bookingRouter");
const reviewRoute = require("./routers/reviewRouters");
const contactRoute = require("./routers/contactRouters");

// route
app.get("/", (req, res) => {
  res.send("Hey, Buddy!!! What's up!");
});
app.use("/user", userRouters);
app.use("/hotel", hotelRouters);
app.use("/room", roomRouters);
app.use("/login", loginRoute);
app.use("/booking", bookingRoute);
app.use("/review", reviewRoute);
app.use("/contact", contactRoute);

app.listen(process.env.PORT, () => {
  console.log(`app listening at ${process.env.PORT}`);
});
