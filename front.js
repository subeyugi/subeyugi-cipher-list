async function showSongs(){
    if(songs.length == 0){
        await loadSongs();
    }
    for(let i = 0; i < songs.length; i++){
        if(songs[i] != null){
            document.getElementById("songList").insertAdjacentHTML("beforeend", `<li class="li_song box" onclick="showCiphers(${i})">${songs[i].title}</li>`);
        }
    };
}

async function showCiphers(songId){
    if(ciphers[songId].length == 0){
        await loadCiphers(songId);
    }
    console.log("ok", ciphers[songId]);
    document.getElementById("cipherTitle").innerText = songs[songId].title;
    document.getElementById("solveBoxArea").innerHTML = "";
    document.getElementById("boxEditButton").setAttribute("onclick", `showCipherInputDialog(${songId}, -1)`);

    for(let i = 0; i < ciphers[songId].length; ++i){
        let nowObj = ciphers[songId][i];
        if(nowObj != undefined){
            console.log(nowObj.solved?"solved":"unsolved");
            document.getElementById("solveBoxArea").insertAdjacentHTML("beforeend", `<span class="solvedBox ${nowObj.solved=="1"?"solved":"unsolved"}">${nowObj.id}</span>`);
        }
    }
    
    document.getElementById("cipherResult").innerHTML = "";
    console.log(songId);
    for(let i = 0; i < ciphers[songId].length; i++){
        const nowObj = ciphers[songId][i];
        if(nowObj !=  undefined){
            let html = `<div class="boxCipher">
                <span class="solvedBox ${nowObj.solved=="1"?"solved":"unsolved"} cipherBoxArea">${nowObj.id}</span>
                <div style="width: 100%;">
                    <div class="cipherTitle">${nowObj.title}<input class="boxEditButton" type="button" value="編集" onclick="showCipherInputDialog(${songId}, ${i})"></div>
                    <div class="cipherDetails">${convertMarkdown2HTML(sanitizing(nowObj.details))}</div>
                </div>
            </div>`;
            document.getElementById("cipherResult").insertAdjacentHTML("beforeend", html);
        }
    }
}

function showCipherInputDialog(songId, cipherId){
    nowSongId = songId;
    nowCipherId = cipherId;
    console.log(songId, cipherId)
    document.getElementById("cipherInputDialog").style.display="block";
    document.getElementById("cipherInputDialog_song").innerText = `${songs[songId].title}`;
    if(cipherId != -1){
        document.getElementById("cipherInputDialog_num").value = ciphers[songId][cipherId].id;
        document.getElementById("cipherInputDialog_caption").value = ciphers[songId][cipherId].title;
        document.getElementById("cipherInputDialog_solver").value = ciphers[songId][cipherId].solverId;
        document.getElementById("cipherInputDialog_solvedDate").value = ciphers[songId][cipherId].solvedTime;
        document.getElementById("cipherInputDialog_isSolved").value = ciphers[songId][cipherId].isSolved;
        document.getElementById("postTextarea").value = ciphers[songId][cipherId].details;
    }else{
        document.getElementById("cipherInputDialog_num").innerText = `cipher = [${-1}]`;
        document.getElementById("postTextarea").value = "";
    }
    let text = sanitizing(document.getElementById("postTextarea").value);
    document.getElementById("postRight").innerHTML = convertMarkdown2HTML(text);
}

document.getElementById("postTextarea").addEventListener("keyup", (e) => {
    let text = sanitizing(document.getElementById("postTextarea").value);
    document.getElementById("postRight").innerHTML = convertMarkdown2HTML(text);
});

function strCheck(text, i, target){
    if(text.length - i < target.length) return false;
    return text.substring(i, i + target.length) == target;
}

function sanitizing(text){
    //console.log("sanitizing", text);
    return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/`/g, "&#x60;");
}

function unsanitizing(text){
    return text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#x60;/g, "`");
}

function convertMarkdown2HTML(text){
    //console.log(text);
    let functionCharIdxs = [];
    let result = "";

    for(let i = 0; i < text.length; i++){
        if(strCheck(text, i, "**")){//強調
            if(functionCharIdxs.length > 0 && functionCharIdxs[functionCharIdxs.length - 1].type == "**"){
                result += "</b>";
                functionCharIdxs.pop();
            }else{
                result += "<b>"
                functionCharIdxs.push({type:"**", idx:i});
            }
            i += 1;
        }else if(strCheck(text, i, "* ")){//箇条書き
            result += "<ul>"
            result += "<li>"
            i += 1;
        }else if(strCheck(text, i, "\n* ")){//箇条書き次の行
            result += "</li>\n<li>"
            i += 2
        }else if(strCheck(text, i, "\n")){//箇条書き終了
            result += "</ul>"
        }else if(strCheck(text, i, "*")){//斜体
            if(functionCharIdxs.length > 0 && functionCharIdxs[functionCharIdxs.length - 1].type == "*"){
                result += "</i>";
                functionCharIdxs.pop();
            }else{
                result += "<i>"
                functionCharIdxs.push({type:"*", idx:i});
            }
        }else if(strCheck(text, i, "~~")){//取り消し線
            if(functionCharIdxs.length > 0 && functionCharIdxs[functionCharIdxs.length - 1].type == "~~"){
                result += "</s>";
                functionCharIdxs.pop();
            }else{
                result += "<s>"
                functionCharIdxs.push({type:"~~", idx:i});
            }
            i += 1;
        }else if(strCheck(text, i, "&#x60;&#x60;&#x60;")){//コード
            if(functionCharIdxs.length > 0 && functionCharIdxs[functionCharIdxs.length - 1].type == "```"){
                result += "</div></div>";
                functionCharIdxs.pop();
                i += 17;
            }else{
                let label = "", nextI = 0;
                for(let j = i + 18; j < text.length; j++){
                    if(text[j] == '\n'){
                        nextI = j;
                        break;
                    }
                    label += text[j];
                }
                if(label != ""){
                    result += `<div class='codeContain'><div class='codeLabel'>${label}</div><div class='code' id='code_${codeId}'><div class='copyIcon' onclick='codeCopyClick(${codeId++})'>📋</div>`;
                }else{
                    result += `<div class='codeContain'><div class='codeLabel' style='display:none;'></div><div class='code' id='code_${codeId}'><div class='copyIcon' onclick='codeCopyClick(${codeId++})'>📋</div>`;
                }
                functionCharIdxs.push({type:"```", idx:i});
                i = nextI;
            }
        }else if(strCheck(text, i, "&lt;/br&gt;")){//改行
            result += "</br>"
            i += 11;
        }else if(strCheck(text, i, "&lt;font color=&#x27;")){//色1
            result += "<font color=\""
            functionCharIdxs.push({type:"<font1>", idx:i});
            i += 20;
        }else if(strCheck(text, i, "&#x27;&gt;")){//色1
            if(functionCharIdxs.length > 0 && functionCharIdxs[functionCharIdxs.length - 1].type == "<font1>"){
                result += "\">";
                i += 9;
            }
        }else if(strCheck(text, i, "&lt;/font&gt;")){//色1,2
            if(functionCharIdxs.length > 0 && (functionCharIdxs[functionCharIdxs.length - 1].type == "<font1>" || functionCharIdxs[functionCharIdxs.length - 1].type == "<font2>")){
                result += "</font>";
                i += 12;
                functionCharIdxs.pop();
            }
        }else if(strCheck(text, i, "&lt;font color=&quot;")){//色2
            result += "<font color=\""
            functionCharIdxs.push({type:"<font2>", idx:i});
            i += 20;
        }else if(strCheck(text, i, "&quot;&gt;")){//色2
            if(functionCharIdxs.length > 0 && functionCharIdxs[functionCharIdxs.length - 1].type == "<font2>"){
                result += "\">";
                i += 9;
            }
        }else{
            result += text[i];
        }
    }
    return result;
}

function postButtonClicked(){
    ciphers[nowSongId][nowCipherId].details = document.getElementById("postTextarea").value;
    document.getElementById("cipherInputDialog").style.display = "none";
    showCiphers(nowSongId);
    console.log(ciphers[nowSongId])
}

function closeButtonClicked(){
    document.getElementById("cipherInputDialog").style.display = "none";
}

//色
function breakLineBtnClicked(){
    const textarea = document.getElementById("postTextarea");
    let pos = textarea.selectionStart;
    document.execCommand("insertText", false, "</br>\n");
    document.getElementById("postRight").innerHTML = convertMarkdown2HTML(sanitizing(textarea.value));
}

//プレーンテキスト
function planeBtnClicked(){
    const textarea = document.getElementById("postTextarea");
    let posStart = textarea.selectionStart;
    let posEnd = textarea.selectionEnd;
    document.execCommand("insertText", false, "```\n" + textarea.value.substring(posStart, posEnd) + "\n```\n");
    document.getElementById("postRight").innerHTML = convertMarkdown2HTML(sanitizing(textarea.value));
}

//色
function colorBtnClicked(){
    const textarea = document.getElementById("postTextarea");
    let posStart = textarea.selectionStart;
    let posEnd = textarea.selectionEnd;
    document.execCommand("insertText", false, '<font color="#ffea70">' + textarea.value.substring(posStart, posEnd) + "</font>");
    document.getElementById("postRight").innerHTML = convertMarkdown2HTML(sanitizing(textarea.value));
}

function sendSongButtonClicked(){
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    sendSong({
        "id": songs.length, 
        "title": title, 
        "author": author
    });
}

async function sendCipherButtonClicked(){
    const textarea = document.getElementById("postTextarea");
    let details = sanitizing(textarea.value)
    let date = new Date();
    await sendCipher({
        "id": nowCipherId, 
        "songId": nowSongId,
        "title": "タイトル", 
        "isSolved": 1,
        "solverId": 1,
        "solvedTime": date.toLocaleString(),
        "details": details,
        "deleted": 0
    });
    document.getElementById("cipherInputDialog").style="display:none"
    await showCiphers(nowSongId);
}

function codeCopyClick(id){
    let text = document.getElementById(`code_${id}`).innerText.substring(3);
    navigator.clipboard.writeText(text);
}

function songIconClicked(){
    console.log("ok")
    let tmp = document.getElementById("songArea");
    if(tmp.style.display == "none"){
        tmp.style.display = "block";
    }else{
        tmp.style.display = "none";
    }
}