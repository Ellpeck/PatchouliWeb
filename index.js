const fs = require("fs");
const jsonc = require("jsonc-parser");
const {
    JSDOM
} = require("jsdom");

let config = getJson("config.jsonc");

let template = new JSDOM(fs.readFileSync(__dirname + "/template.html"));
let templateDoc = template.window.document;
templateDoc.title = config.title;
let docEntries = templateDoc.getElementById("entries");

let entryPath = config.rootPath + "/" + config.language + "/entries";
let entryCategories = fs.readdirSync(entryPath);
for (let dir of entryCategories) {
    let entries = fs.readdirSync(entryPath + "/" + dir);
    for (let entry of entries) {
        let entryContent = getJson(entryPath + "/" + dir + "/" + entry);
        writeContent(entryContent);
    }
}

fs.writeFileSync("index.html", template.serialize());

function writeContent(entry) {
    let t = "";
    t += '<div class="entry">'
    t += `<h1>${entry.name}</h1>`
    for (let page of entry.pages) {
        if (!page.text)
            continue;
        t += `<p>${page.text}</p>`
    }
    t += '</div>'
    docEntries.innerHTML += t;
}

function getJson(location) {
    return jsonc.parse(fs.readFileSync(location).toString());
}