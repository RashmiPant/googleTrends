const fetch = require("node-fetch");
const parser = require("fast-xml-parser");
const express = require("express");
const app = express();

app.get("/", (request,response)=> response.redirect("/googleTrends"));

app.get("/googleTrends", (request, response) => {
    fetch("https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN")
        .then(res => res.text())
        .then(body => {
            let ext = parser.parse(body);
            let trending = ext.rss.channel.item;
            let news = [];
            trending.forEach(newsTag => {
                news.push({
                    "title": newsTag.title,
                    "link": newsTag.link,
                    "publishedDate": newsTag.pubDate,
                    "traffic": newsTag["ht:approx_traffic"]
                });
            });
            response.header("Content-Type",'application/json');
            response.send(JSON.stringify(news, null, 4));
        })
        .catch((error) => {
            console.log(error);
        });
});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});