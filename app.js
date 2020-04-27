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




port = 3000;
app.listen(port, function() {
    console.log('server has started on port' + port);
})