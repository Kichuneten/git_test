

//express（サーバー）のインポート
import express from "express";
import { readFileSync } from "node:fs";

//prisma（データベース）のインポート
import { PrismaClient } from "@prisma/client";
import { re } from "mathjs";
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
    const words_data = await client.Word.findMany();

    //  投稿内容と時間を合わせた文字列を配列に格納(最近30件のみ)
    const words = (words_data.slice(words_data.length - 30, words_data.length).map((value) => {
        return `<div class='post' id='word_no${value.id}'>
                    <div class='post_head'>
                        <span class='front_word'>${value.front}</span>
                        <span class='rear_word'> ${value.rear}</span>
                    </div>
                </div>`
    }));

    //  html化
    const words_html = this_ls_html(words);

    //  テンプレートに組み込んでsend
    const template = readFileSync("static/index.html", "utf-8");
    const html = template.replace(
        "<!--words area-->",
        words_html
    );
    response.send(html);


});



app.get('/select_test', async (request, response) => {

    //  投稿のデータを取得.
    const words_data = await client.Word.findMany();

    // front と rear にわけて配列に格納、htmlファイルに組み込むために変数名とともにString化.
    const fornt_words_list = `const front_word_list=[${words_data.map((value) => { return `"${value.front}"` })}];`;
    const rear_words_list = `const rear_word_list=[${words_data.map((value) => { return `"${value.rear}"` })}];`;


    //  テンプレートに組み込んでsend.
    const template = readFileSync("static/select_test.html", "utf-8");
    const html = template.replace(
        "//fornt_words_list",
        fornt_words_list
    ).replace(
        "//rear_words_list",
        rear_words_list
    );
    response.send(html);


});


//  投稿を送ったとき.

app.post("/send", async (request, response) => {
    const type = request.body.type;
    const front = request.body.front;
    const rear = request.body.rear;

    //  エラーなしならデータベースに送る
    await client.Word.create({ data: { type: type, front: front, rear: rear } });

    //  "/"にリダイレクト
    response.redirect("/");
});


app.listen(3200);