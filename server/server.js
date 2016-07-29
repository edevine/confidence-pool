const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const pg = require('pg');

const conString = 'postgres://' + process.env.DB_AUTH + '@localhost/confidence-pool';

// Validate port:
const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('Invalid port number: ' + process.env.PORT + '. Should be a number between 0 and 65535.')
}

// Verify database connection
const testClient = new pg.Client(conString);
testClient.connect(err => {
    testClient.end();
    if (err) {
        throw err;
    }
});

const users = {};

passport.serializeUser((user, done) => {
    done(null, user.email);
});
passport.deserializeUser(function (id, done) {
    done(null, users[id]);
});

passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        const client = new pg.Client(conString);
        client.connect(err => {
            if (err) {
                return done(err);
            }
            
            const query = client.query(
                'select email, name from public.users where email = $1 and password = crypt($2, password) limit 1',
                [email, password]
            );
            
            query.on('row', (row, result) => {
                result.addRow(row);
            });

            query.on('end', result => {
                if (result.rows.length > 0) {
                    done(null, result.rows[0]);
                }
                else {
                    done(null, false, "Unauthorized: Access is denied due to invalid credentials.");
                }
                client.end();
            });

            query.on('error', err => {
                client.end();
                done(err);
            });
        });
    }
));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use(passport.initialize());

app.use(passport.session());

app.post('/login',
    passport.authenticate('local'),
    (req, res, next) => {
        res.send();
    }
);

app.listen(port);
