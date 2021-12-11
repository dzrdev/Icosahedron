const express = require('express');
const app = express();

app.use('/views', express.static('views'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

app.listen(8080, () => {
    console.log('running...')}
);