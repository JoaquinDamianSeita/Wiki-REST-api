const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////// esta parte apunta a todos los articulos /////////////////////////////////////////////////


app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            };
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Se guardo bien!");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Se borraron todos los articulos!");
            } else {
                res.send(err);
            }
        });
    })

///////////////////////////////////////// esta parte apunta a un articulo especifico /////////////////////////////////////////////////


app.route("/articles/:articleTitle")

    .get((req, res) => {
        Article.findOne({
                title: req.params.articleTitle
            },
            (err, foundArticle) => {
                if (foundArticle) {
                    res.send(foundArticle)
                } else {
                    res.send("No se encontro el articulo!")
                }
            })
    })

    .put((req, res) => {
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },   
            (err) =>
            {
                if (err)
                {
                    res.send(err);
                }
                else
                {
                    res.send("Se actualizo correctamente!");
                }
            }
        );
    })

    .patch((req,res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Se reemplazaron los valores en el documento");
                }
            }
        );
    })

    .delete((req,res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Se borro correctamente!")
                }
            }
        );
    })









app.listen(3000, function () {
    console.log("Server started on port 3000");
});