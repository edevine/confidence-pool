const bodyParser = require('body-parser');
const express = require('express');
const pg = require('pg');

const conString = 'postgres://' + process.env.DB_AUTH + '@localhost/confidence-pool';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/auth', (request, response) => {
    const client = new pg.Client(conString);
    response.setHeader('Content-Type', 'application/json');
    client.connect(err => {
        if (err) {
            response.status(500).send('"Internal Server Error"'); 
            return console.log(err);
        }
        
        const query = client.query('select email, name from public.users where email = $1 and password = crypt($2, password) limit 1', [request.body.email, request.body.password]);
        query.on('row', (row, result) => {
            result.addRow(row);
        });
        query.on('end', result => {
            if (result.rows.length > 0) {
                response.send(result.rows[0]);
            }
            else {
                response.status(401).send('"Unauthorized: Access is denied due to invalid credentials."');
            }
            client.end();
        });
        query.on('error', err => {
            console.error(err);
            response.status(500).send('"Internal Server Error"'); 
            client.end();
        });
    });
});

app.listen(process.env.PORT);
