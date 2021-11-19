const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const invertoryRoutes = require("./routes/inventoryRoute");
const userRoutes = require("./routes/userRoute");

dotenv.config();
const app = express();
// Initialize Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting-up mongoose
connectDB();

app.use(invertoryRoutes, userRoutes);
app.use(cookieParser());

const { PORT } = process.env;
const port = PORT || 4000;

app.listen(port, () => console.log(`Server up and running at ${port}`));
