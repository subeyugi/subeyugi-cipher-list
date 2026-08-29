const url = "https://subeyugi-cipher3.pentate.workers.dev"

async function loadSongs(){
    await fetch(url + '/get/songs', {headers: { "Access-Control-Allow-Origin": "*"}})
        .then((response) => response.json())
        .then((data) => {
            data.forEach(e => {
                songs[e.id] = e;
                ciphers[e.id] = [];
            });
        });
    console.log("songs", songs);
}

async function loadCiphers(songId){
    //console.log(url + `/get/ciphers?songid=${songId}`)
    ciphers[songId] = [];
    await fetch(url + `/get/ciphers?songid=${songId}`, {headers: { "Access-Control-Allow-Origin": "*"}})
        .then((response) => response.json())
        .then((data) => {
            /* ciphers[songId] = data;
            for(let i = 0; i < ciphers[songId].length; i++){
                ciphers[songId][i].details = unsanitizing(ciphers[songId][i].details);
            } */
            for(let i = 0; i < data.length; i++){
                console.log("now", data[i])
                ciphers[songId][data[i].id] = data[i];
                ciphers[songId][data[i].id].details = unsanitizing(data[i].details);
            }
        });
    console.log(`ciphers[${songId}]`, ciphers[songId]);
}

async function sendSong(data){
    await fetch(url + '/post/song', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'charset': 'UTF-8',
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(data)
    }).then((response) => response.text())
    .then((res) => {
        console.log("res:", res);
    });
    console.log("ok");
}

async function sendCipher(data){
    console.log("sendCipher, data=", data);
    await fetch(url + '/post/cipher', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'charset': 'UTF-8', 
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(data)
    }).then((response) => response.text())
    .then((res) => {
        console.log("res:", res);
    });
    console.log("ok");
}