const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.set("view engine", ejs);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articlesSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, article) => {
      if (!err) {
        res.send(article);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const newArticle = new Article({
      title: title,
      content: content
    });

    newArticle.save(err => {
      if (!err) {
        res.send("succesfully added a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany({}, err => {
      if (!err) {
        res.send("all articles deleted");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
