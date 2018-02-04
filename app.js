const express = require('express');

const app = express();

const router = require('./router');

const hostname = '127.0.0.1';
const port = 3000;
const path = require('path');
const fm = require('front-matter');

const fs = require('fs');

const folder = './articles';
const articles = [];

fs.readdirSync(folder).forEach((file) => {
  const pathToArticles = `${folder}/${file}`;
  if (file !== 'img') {
    fs.readFile(pathToArticles, 'utf8', function (err, data) {
      if (err) throw err;
      const article = fm(data);
      if (article.attributes.image == null) {
        article.attributes.image = './img/placeholder.jpg';
      }
      articles.push(article.attributes);
    });
  } 
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.render('article', { title: `Villa kom upp!`,html: '' });
});


app.use('/article', router);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'articles')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { title: 'Greinasafnið', articles });
});

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
