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

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("sorry article does not exist");
      }
    });
  })
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      err => {
        if (!err) {
          res.send("Article succesfully updated");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      err => {
        if (!err) {
          res.send("article updated");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, err => {
      if (!err) {
        res.send("Article deleted");
      } else {
        res.send("error deleting article");
      }
    });
  });

app.listen(3000, () => {
  console.log("server running on port 3000");
});
