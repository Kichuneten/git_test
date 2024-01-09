

//もとのhtmlファイルから持ってくる変数たち.
console.log(front_word_list);
console.log(rear_word_list);
console.log(total_quiz_num);


//range関数.
function range(n) { return [...Array(n).keys()] };


//0~Nよりn個ランダムな数を抽出する関数.
function gen_random_nums(n, N) {
    let arr = range(N);
    let result = [];
    console.log(Array.isArray(arr))
    for (var i = 0; i < n; i++) {
        const randomN = Math.floor((N - i) * Math.random());
        result.push(arr[randomN]);
        arr = arr.slice(0, randomN).concat(arr.slice(randomN + 1));
    }
    return result
}

//グローバル変数たち.
let quiz_numbers = [];
let is_corrects = [];
let quiz_number = 0;
let correct_option_num = 0;

let state = 0;//0: クイズ中, 1: クイズ後

const quiz_area = document.getElementById("quiz_area");
const quiz_content_area = document.getElementById("quiz_content");
const quiz_option_area = document.getElementById("quiz_options");


function main(n) {
    quiz_area.classList.remove("hide");
    result_area.classList.add("hide");
    quiz_numbers = gen_random_nums(n, front_word_list.length - 1);
    console.log(quiz_numbers)
    state = 0;
    show_quiz();
}

function show_quiz() {
    quiz_content_area.textContent = `Q.${front_word_list[quiz_numbers[quiz_number]]}`;

    rear_word_list_ = rear_word_list.slice(0, quiz_numbers[quiz_number]).concat(rear_word_list.slice(quiz_numbers[quiz_number] + 1));
    const wrong_options_num = gen_random_nums(4, rear_word_list_.length)

    correct_option_num = Math.floor(Math.random() * 4);

    let text = "";

    var j = 0;
    for (var i = 0; i < 4; i++) {
        j++;
        if (correct_option_num == i) {
            text += `<input class="option_but" id="option${i}" type="button" value="${rear_word_list[quiz_numbers[quiz_number]]}" onclick="input_ans(this)">`;
            j -= 1;
        } else {
            text += `<input class="option_but" id="option${i}" type="button" value="${rear_word_list_[wrong_options_num[j]]}" onclick="input_ans(this)">`;
        }
    }

    //console.log(text)
    quiz_option_area.innerHTML = text;

    quiz_number++;

}


function input_ans(button) {
    const this_id = button.id;
    if (`option${correct_option_num}` == this_id) {
        console.log("correct!!");
        is_corrects.push(true);
    } else {
        console.log("wrong!!")
        is_corrects.push(false);
    }

    if (quiz_number < total_quiz_num) {
        show_quiz();
    } else {
        end_quiz();
    }
}

const result_area = document.getElementById("result_area");
const result_score_area = document.getElementById("result_score");
const result_detail_area = document.getElementById("result_detail");


function end_quiz() {
    state = 1;

    quiz_area.classList.add("hide");
    result_area.classList.remove("hide");

    let correct_num = 0;//正答数.
    result_detail_area.innerHTML = (is_corrects.map((value, index) => {
        if (value) {//correct
            correct_num++;
            return `<div class="result_line">
            <span class="num">${index + 1}.⭕️</span>
            <span class="left">${front_word_list[quiz_numbers[index]]}</span>
            <span> = </span>
            <span class="right">${rear_word_list[quiz_numbers[index]]}</span>
             </div>`;
        } else {//wrong
            return `<div class="result_line">
                <div class="left">
                    <span class="num">${index + 1}.❌</span>
                    <span>${front_word_list[quiz_numbers[index]]}</span>
                </div>
                <div class="right">
                    <span> = </span>
                    <span>${rear_word_list[quiz_numbers[index]]}</span>
                </div>
            </div>`;
        }
    })).join("");

    result_score_area.innerHTML = `<span>
    <span id="score">${correct_num}</span>
    <span id="max_score">点/${total_quiz_num}</span>
    <span></span>`;
}

window.addEventListener("load", main(total_quiz_num));




function go_back_home() {
    if (state == 1) {
        if (confirm("Do u wanna quit this quiz and go back home?\n( The progress won't be memorized. )")) {
            window.location.href = "/";
        }
    } else {
        window.location.href = "/";
    }
}