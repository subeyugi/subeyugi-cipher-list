let songs = []
let ciphers = [];
let nowSongId = undefined;
let nowCipherId = undefined;
let codeId = 0;

/*

曲を投稿する
curl -X POST -H "Content-Type: application/json; charset=UTF-8" -d {\"id\":2,\"title\":\"↕↕\",\"author\":\"全て遊戯の所為です。2\"} https://subeyugi-cipher3.pentate.workers.dev/api/songs
*/