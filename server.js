const express = require('express');
const Database = require('better-sqlite3');
const app = express();
const port = 3000;

// フォームのデータを受け取れるようにする設定
app.use(express.urlencoded({ extended: true }));
//静的ファイル　（ＣＳＳ，　画像など）を公開する設定
app.use(express.static(__dirname));


//EJSをテンプレートエンジンとして使う設定を追加
app.set('view engine', 'ejs');

//SQliteに接続
const db = new Database('books.db');

//テーブルを作成（すでにあれば何もしない）
db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        no   INTEGER PRIMARY KEY ,
        bookname TEXT
    )
`);

console.log('テーブル準備完了OK!');

// HTMLファイルを返す
app.get('/', (req, res) => {//ブラウザで開くときhttp://localhost:3000/の最後の(/)がこれ
    res.sendFile(__dirname + '/index.html');
});


//追加ボタン　→　SQLiteにINSERT
app.post('/add',(req, res) => {
    
    const bookname = req.body.bookname;

    //空白はエラーに
    if(!bookname || bookname.trim() === ''){
        res.send('タイトルを入力してください！→<a href="/">戻る</a>');
        return;
    }

    const existing = db.prepare('SELECT * FROM books WHERE bookname = ?').get(bookname);
    if(existing){
        res.send('すでに読破されています！ → <a href="/">戻る</a>');
        return;
    }
    try{// ここで今の最大番号を取得して+1にする処理
        const maxNo = db.prepare('SELECT MAX(no) as maxNo FROM books').get().maxNo || 0;
        db.prepare('INSERT INTO books (no, bookname) VALUES (?, ?)').run(maxNo + 1, bookname);
        res.send('追加しました！→ <a href="/">戻る</a>')
    }catch(e){
        res.send('エラーが発生しました！→ <a href="/">戻る</a>');
    }
    

    

})


//修正画面を表示
app.post('/edit/:no',(req, res) => {
    const no = req.params.no;
    const book = db.prepare('SELECT * FROM books WHERE no = ?').get(no);
    res.render('edit', {book: book});
})

//更新処理
app.post('/update', (req, res) =>{
    const no = req.body.no;
    const bookname = req.body.bookname;
    db.prepare('UPDATE books SET bookname = ? WHERE no = ?').run(bookname, no);
    res.send('更新しました！→<a href="/">戻る</a>');
})
// 表示ボタン → SQLiteからSELECT
//20260331ここを修正！
app.post('/list', (req, res) => {
    const books = db.prepare('SELECT * FROM books').all();
    res.render('list', {books: books});


    //ここをEJSを使って表示するよう変更　20260331
    /*let html = '<h1>読書済みの本リスト</h1>';
    html += '<table border="1">';
    html += '<tr><th>番号</th><th>タイトル</th></tr>';

    books.forEach(book => {
        html += `<tr><td>${book.no}</td><td>${book.bookname}</td></tr>`;
    });

    html += '</table>';
    html += '<br><a href="/">戻る</a>';

    res.send(html);*/
});

/*
   ~.run()について、これはSQLを実行するメソッドです。
   .run()、.get()j、.all()などはINSERT UPDATE DELETE , SELECT , SELECT（全件検索）
*/


app.post('/delete/:no', (req, res) => {
    const no = req.params.no;

    //削除する
    db.prepare('DELETE FROM books WHERE no = ?').run(no);

    //残った本を取得
    const books = db.prepare('SELECT * FROM books ORDER BY no').all();

    //番号を振りなおす
    books.forEach((book, index) =>{
        db.prepare('UPDATE books SET no = ? WHERE no = ?').run(index + 1,book.no);
    });
    res.send('削除しました！→<a href="/">戻る</a>');
})
// サーバー起動
app.listen(port, () => {
    console.log(`サーバー起動中 → http://localhost:${port}`);
});