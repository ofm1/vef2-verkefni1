const express = require('express');

const path = require('path');

const router = express.Router();
const fs = require('fs');

const fm = require('front-matter');

const folder = './articles';
const articles = [];
const marked = require('marked');

const html = [];

router.use(express.static(path.join(__dirname, 'public')));
router.use(express.static(path.join(__dirname, 'articles')));


fs.readdirSync(folder).forEach((file) => {
  const pathToArticles = `${folder}/${file}`;
  if (file !== 'img') {
    fs.readFile(pathToArticles, 'utf8', function(err, data) {
      if (err) throw err;
      const oneHtml = marked(data);
      const article = fm(data);
      html.push({ html: oneHtml, title: article.attributes.title });
      if (article.attributes.image == null) {
        article.attributes.image = './img/placeholder.jpg';
      }
      articles.push(article.attributes);
    });
  }
});

router.get('/:data', (req, res) => {
  let oneHtml = null;
  let title = null;
  articles.forEach((articles) => {
    if (articles.slug === req.params.data) {
      title = articles.title;
    }
  });
  html.forEach((html) => {
    if (html.title === title) {
      oneHtml = html.html;
    }
  });
  if (title === null) {
    res.render('article', { title: `Ekkert fannst`, html: '<h1>Efni fannst ekki!</h1>' });
  }
  res.render('article', { title: `${title}`, html: oneHtml });
});

module.exports = router;
