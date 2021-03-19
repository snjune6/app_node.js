const express = require('express');
var app = express();
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const port = process.env.PORT || 80;
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb+srv://snjune6:faeqe14587@cluster0.ohyu1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err, client){
   
    if (err) return console.log(err);
   /* 
    db = client.db('app');

    db.collection('post').insertOne({이름1 : 'kim', _id : 100}, function(err, res){
        console.log('저장완료');
    });
*/
    db = client.db('app');

    

    

    app.listen(port, function() {
      console.log('listening on ${port')
    });

  });

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
});

app.get('/write', function(request, response){
    response.sendFile(__dirname + '/write.html');
});

app.get('/list', function(request, response){

    db.collection('post').find().toArray(function(error, result){
        //console.log(result);
        response.render('list.ejs', {posts : result});
    });



});

app.post('/add', function(request, response){

    db.collection('counter').findOne({name : '게시물갯수'}, function(error, result){
        //console.log(result.totalPost);
        var total = result.totalPost;

        db.collection('post').insertOne({_id : total + 1, 제목 : request.body.title, 날짜 : request.body.date}, function(err, res) {
            if(err) return console.log(err);
    
            console.log('저장완료!');
            response.send('저장완료');

            db.collection('counter').updateOne({name:'게시물갯수'}, {$inc : {totalPost:1}}, function(error, result){
                if(error) return console.log(error);


            });
        });
    });

});

app.delete('/delete', function(request, response){
    console.log(request.body);
    request.body._id = parseInt(request.body._id);
    db.collection('post').deleteOne(request.body, function(error, result){
        console.log('삭제완료');
    });
});