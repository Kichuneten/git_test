


//もとのhtmlファイルから持ってくる変数たち.
console.log(front_word_list);
console.log(rear_word_list);

//wordのリストの要素.
const word_list = document.getElementById("words_ul");

const form_alert_area = document.getElementById("form_alert_area");


function delete_word(id, this_form) {
    const this_front = this_form.previousElementSibling.previousElementSibling.textContent;

    const scroll = word_list.scrollTop;

    //確認ダイアログでconfirmしたら削除.
    if (window.confirm(`『${this_front}』 を削除しますか？`)) {
        //methodとactionのurlを指定.
        this_form.action = `/delete_word/${id}/${scroll}`;
        this_form.method = "post";
        return true;
    }else{
        return false;
    }

}


function add_word(this_form) {

    const scroll = word_list.scrollTop;


    const front_input = document.getElementById("add_front").value;
    const rear_input = document.getElementById("add_rear").value;

    //エラー時はメッセージ表示とともにsubmitを却下.
    if (front_input == "" || rear_input == "") {
        form_alert_area.textContent = "⚠︎入力されていない項目があります";
        return false;
    } else if (front_word_list.includes(front_input)) {
        form_alert_area.textContent = `⚠︎${front_input} はすでに登録されています`;
        return false;
    } else if (rear_word_list.includes(rear_input)) {
        form_alert_area.textContent = `⚠︎${rear_input} はすでに登録されています`;
        return false;
    } else {
        //okなら送信

        //methodとactionのurlを指定.
        this_form.action = `/add_word/${scroll}`;
        this_form.method = "post";
        return true;
    }
}