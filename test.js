const express = require('express');

var app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));
app.use('/public', express.static('public'));

app.get('/', function(req, res) {
    res.send('hello world!');
});

app.get('/form-put-test', function(req, res) {
    res.json({
        'name': 'test name',
        'category': 'test category'
    });
});

app.put('/form-put-test', function(req, res) {
    res.json({
        'message': 'data saved.'
    });
});

app.listen(process.env.PORT || 8000, function() {
    console.log('server started.');
});