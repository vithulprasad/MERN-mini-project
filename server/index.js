const express = require("express");
const colors = require("colors");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const admin_route = require("./routes/adminRoute");
const user_route = require("./routes/userRoute");
const path = require("path");
mongoose
  .connect("mongodb://127.0.0.1:27017/MERN-MiniProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB".cyan.bold);
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

  const publicFolderPath = path.join(__dirname, 'public', 'profileImages');
  app.use('/public', express.static(publicFolderPath));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000/",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    allowedHeaders: ["Content-Type"],
  })
);
app.use("/", user_route);
app.use("/admin", admin_route);


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON ${PORT} `.blue.bold);
});
