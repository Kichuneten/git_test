

//express（サーバー）のインポート
import express from "express";
import { readFileSync } from "node:fs";

//prisma（データベース）のインポート
import { PrismaClient } from "@prisma/client";
//データベースのクライアント
const client = new PrismaClient();



//配列から、<ul>タグ内に入れる行を生成する関数
const this_ls_html = (array) => {
    let html = "";
    for (var a = 0; a < array.length; a++) {
        html += "<li>" + array[a] + "</li>"
    }
    return html;
}

//express appの作成
const app = express();
app.use(express.urlencoded({ extended: true }));


//app.use(express.static("static"));
app.use("/static", express.static("static"));

//  get

app.get('/', async (request, response) => {

    //  投稿のデータを取得
    const words_data = await client.Words.findMany();

    //  投稿内容と時間を合わせた文字列を配列に格納(最近30件のみ)
    const words = (words_data.slice(words_data.length - 30, words_data.length).map((value) => {
        return `<div class='word' id='post_no${value.id}'>
                    <div class='front'>${value.front}</div>
                    <div class='rear'>${value.rear}</div>
                </div>`
    })).reverse();

    //  html化
    const words_html = this_ls_html(posts)

    //  テンプレートに組み込んでsend
    const template = readFileSync("static/index.html", "utf-8");
    const html = template.replace(
        "<!--words area-->",
        words_html
    );
    response.send(html);


});


//  投稿を送ったとき

app.post("/send", async (request, response) => {
    //  データベースに送る
    await client.Post.create({ data: { type: request.body.front, front: request.body.front, rear:request.body.rear } });
    //  "/"にリダイレクト
    response.redirect("/");
});


app.listen(3200);

