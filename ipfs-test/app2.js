const bodyParser = require('body-parser');
const express = require('express');

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('start');
});

app.post('/upload', (req, res) => {

    const testString = req.body.testString;
    const testNum =  req.body.testNum;

    const arr = testString.match(/\d/g);
    const result = arr.join("");

    const result2 = parseInt(result) % parseInt(testNum) + 1

    res.render('end', {testString, testNum, result, result2});

});


app.listen(3002,()=> {
    console.log('server is listening on port 3002 ');
});