const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
dotenv.config();
const app = express();

const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect(
  process.env.MONGOOSE_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log("Connected to MongoDB Database");
  }
);

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const Blog = mongoose.model("Blog", blogSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  Blog.find({}, (err, foundBlog) => {
    res.render("home", { blogItems: foundBlog });
  });
});
app.get("/about", (req, res) => {
  res.render("about", { aboutData: aboutContent });
});
app.get("/contact", (req, res) => {
  res.render("contact", { contactData: contactContent });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});
app.post("/compose", (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
  });
  blog.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", (req, res) => {
  const targetId = req.params.postId;
  Blog.findOne({ _id: targetId }, (err, postData) => {
    res.render("post", {
      title: postData.title,
      content: postData.content,
    });
  });
});
const PORT = process.env.PORT || 3000;
const HOSTNAME = "localhost";
app.listen(PORT, function () {
  console.log(`Server started on http://${HOSTNAME}:${PORT}`);
});
