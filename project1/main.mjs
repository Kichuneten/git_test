

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

//express appの作成.
const app = express();
app.use(express.urlencoded({ extended: true }));


//app.use(express.static("static"));
app.use("/static", express.static("static"));

//  get.




//ホーム.

app.get('/', async (request, response) => {

    //  テンプレートに組み込んでsend.
    const template = readFileSync("static/index.html", "utf-8");
    const html = template;
    response.send(html);
});




//単語リストのページ.

app.get('/list', async (request, response) => {

    //  投稿のデータを取得.
    const words_data = await client.Word.findMany();

    // front と rear にわけて配列に格納、htmlファイルに組み込むために変数名とともにString化.
    const front_words_list = `const front_word_list=[${words_data.map((value) => { return `"${value.front}"` })}];`;
    const rear_words_list = `const rear_word_list=[${words_data.map((value) => { return `"${value.rear}"` })}];`;


    //  投稿内容と時間を合わせた文字列を配列に格納(最近30件のみ).
    const words = (words_data.map((value) => {
        return `<div class='word' id='word_no${value.id}'>
                        <span class='front_word'>${value.front}</span>
                        <span class='rear_word'> ${value.rear}</span>
                        <form if="word_delete_form_${value.id}" onsubmit="return delete_word(${value.id},this)">
                            <button id="word_delete_${value.id}" class="material-symbols-outlined word_delete_but">delete</button>
                        </form>
                </div>`
    })).reverse();

    //  html化.
    const words_html = this_ls_html(words);

    //  テンプレートに組み込んでsend.
    const template = readFileSync("static/words_list.html", "utf-8");
    const html = template.replace(
        //wordのリストのhtmlを表示する.
        "<!--words area-->",
        words_html
    ).replace(
        //frontの配列をページのスクリプトに渡す.
        "//front_words_list",
        front_words_list
    ).replace(
        //rearの配列をページのスクリプトに渡す.
        "//rear_words_list",
        rear_words_list
    );;
    response.send(html);


});


app.get('/list/:scroll', async (request, response) => {

    //  投稿のデータを取得.
    const words_data = await client.Word.findMany();

    // front と rear にわけて配列に格納、htmlファイルに組み込むために変数名とともにString化.
    const front_words_list = `const front_word_list=[${words_data.map((value) => { return `"${value.front}"` })}];`;
    const rear_words_list = `const rear_word_list=[${words_data.map((value) => { return `"${value.rear}"` })}];`;


    //  投稿内容と時間を合わせた文字列を配列に格納(最近30件のみ).
    const words = (words_data.map((value) => {
        return `<div class='word' id='word_no${value.id}'>
                        <span class='front_word'>${value.front}</span>
                        <span class='rear_word'> ${value.rear}</span>
                        <form if="word_delete_form_${value.id}" onsubmit="return delete_word(${value.id},this)">
                            <button id="word_delete_${value.id}" class="material-symbols-outlined word_delete_but">delete</button>
                        </form>
                </div>`
    })).reverse();

    //  html化.
    const words_html = this_ls_html(words);

    //  テンプレートに組み込んでsend.
    const template = readFileSync("static/words_list.html", "utf-8");
    const html = template.replace(
        //wordのリストのhtmlを表示する.
        "<!--words area-->",
        words_html
    ).replace(
        //frontの配列をページのスクリプトに渡す.
        "//front_words_list",
        front_words_list
    ).replace(
        //rearの配列をページのスクリプトに渡す.
        "//rear_words_list",
        rear_words_list
    ).replace(
        "//scroll_set",
        `const a=document.getElementById('words_ul');
        a.scrollTop=Math.min(a.scrollHeight,${request.params.scroll});`
    );
    response.send(html);


});





//選択問題のページ.

app.get('/choice_quiz', async (request, response) => {

    //  単語のデータを取得.
    const words_data = await client.Word.findMany();

    // すべての単語でデータをfront と rear にわけて配列に格納、htmlファイルに組み込むために変数名とともにString化.
    const front_words_list = `const front_word_list=[${words_data.map((value) => { return `"${value.front}"` })}];`;
    const rear_words_list = `const rear_word_list=[${words_data.map((value) => { return `"${value.rear}"` })}];`;

    //  テンプレートに組み込んでsend.
    const template = readFileSync("static/choice_quiz.html", "utf-8");
    let html = template.replace(
        "//front_words_list",
        front_words_list
    ).replace(
        "//rear_words_list",
        rear_words_list
    );

    //登録単語数が10に満たないときはそれを問題数にする(初期値は10).
    if (words_data.length < 10) {
        html = html.replace(
            "const total_quiz_num = 10 //問題数",
            `const total_quiz_num = ${words_data.length} //問題数`
        );
    }
    response.send(html);


});


//  単語を追加するフォームを送ったとき.

app.post("/add_word/:scroll", async (request, response) => {
    const front = request.body.front;
    const rear = request.body.rear;
    const date = new Date().toISOString();

    //  エラーなしならデータベースに送る
    await client.Word.create({ data: { front: front, rear: rear, addedDate: date, lastChecked: date, lastIsCorrect: true } });

    //  "/"にリダイレクト
    response.redirect("/list/0");
});




app.post("/delete_word/:id/:scroll", async (request, response) => {
    await client.Word.delete({
        where: { id: parseInt(request.params.id, 10) }
    });
    //response.redirect("/:request.params.scroll");
    response.redirect(`/list/${request.params.scroll}`);
});

app.listen(3200);
