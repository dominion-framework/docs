const fs  = require("fs");
const hljs = require("highlight.js");

const md = require("markdown-it")({
    typographer:  true,
    linkify: true,
    html: true,
    highlight: function (str, lang) {
        const _id = "_" + Math.round(Math.random()*1e5).toString(26);
        let copyButton = `<button data-clipboard-target="#${_id}" title="Copy to clipboard"><svg viewBox="-40 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m271 512h-191c-44.113281 0-80-35.886719-80-80v-271c0-44.113281 35.886719-80 80-80h191c44.113281 0 80 35.886719 80 80v271c0 44.113281-35.886719 80-80 80zm-191-391c-22.054688 0-40 17.945312-40 40v271c0 22.054688 17.945312 40 40 40h191c22.054688 0 40-17.945312 40-40v-271c0-22.054688-17.945312-40-40-40zm351 261v-302c0-44.113281-35.886719-80-80-80h-222c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20h222c22.054688 0 40 17.945312 40 40v302c0 11.046875 8.953125 20 20 20s20-8.953125 20-20zm0 0"/></svg></button>`
        try {
            str = hljs.highlight(lang, str, true).value;
        } catch (error) {
            str = md.utils.escapeHtml(str);
            copyButton = "";
        }

        return `<pre class="hljs">${copyButton}<code class="highlight" id="${_id}">${str}</code></pre>`;
    }
});

const tpl = fs.readFileSync("./_tpl/index.html", "utf-8");

const walk = function(dir, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

walk("./_src", function (err, pages) {
    pages.forEach(page => {
        const article = md.render(fs.readFileSync(page, "utf-8"));
        let htmlPath = page.replace("/_src", "");
        htmlPath = htmlPath.substring(0, htmlPath.lastIndexOf("/"));
        let pageUri = htmlPath.replace("./", "");
        let pageTitle = pageUri.match(/([^\/]*)$/)[1];
        pageTitle = pageTitle.substring(0,1).toUpperCase()+pageTitle.substring(1).replace(/\-/g, " ");
        let parentUri = htmlPath.substring(2, htmlPath.indexOf("/", 2));
        fs.mkdirSync(htmlPath, {recursive: true});
        let htmlPage = tpl.replace("${result}", article)
            .replace(`class="link" href="/${pageUri}/"`, `class="link active" href="/${pageUri}/"`);
        if(parentUri.indexOf(".") === -1) {
            htmlPage = htmlPage
                .replace(`class="link" href="/${parentUri}/"`, `class="link opened" href="/${parentUri}/"`);
        }
        htmlPage = htmlPage
            .replace("${title}", `${pageTitle !== '.'? pageTitle + ` — `: ""}`);

        fs.writeFileSync(htmlPath + "/index.html", htmlPage);
    });
});


