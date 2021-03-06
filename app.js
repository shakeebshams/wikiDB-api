const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema);


app.get('/articles', function(req, res) {
    Article.find(function(err, found) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(found);
            res.send(found);
        }
    })
});

app.get('/articles/:title', function(req, res) {
    Article.findOne({title: req.params.title}, function(err, article) {
        if (err) {
            res.send(err);
        } else if (article) {
            res.send(article);
        } else {
            console.log("bruh");
        }
    })
});

app.put('/articles/:title', function(req, res) {
    Article.update(
        {title: req.params.title},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err, article) {
            if (err) {
                res.send(err);
            } else if (article) {
                res.send("successfully update article");
            } else {
                console.log("bruh");
            }
        }
    )
});

app.patch('/articles/:title', function(req, res) {
    Article.update(
        {title: req.params.title},
        {$set: req.body},
        function(err) {
            if (err) {
                console.log("is it getting here")
                res.send(err);
            } else {
                res.send("successfully updated through patch request");
            }
        }
    )
})

app.post('/articles', function(req, res) {
    const title = req.body.title;
    const content = req.body.content;

    const article = new Article({
        title: title,
        content: content
    });

    article.save(function(err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.delete('/articles', function(req, res) {
    Article.deleteMany(function(err) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

app.delete('/articles/:title', function(req, res) {
    Article.deleteOne(
        {title: req.params.title},
        function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send("deleted article with title: " + req.params.title);
            }
        }
    );
});




port = 3000;
app.listen(port, function() {
    console.log('server has started on port ' + port);
})