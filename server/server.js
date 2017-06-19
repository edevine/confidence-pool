const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const co = require('co');
const Pool = require('pg-pool');


// Validate port:
const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error('Invalid port number: ' + process.env.PORT + '. Should be a number between 0 and 65535.')
}

const pool = new Pool({
  user: 'confidence_pool',
  password: process.env.PASSWORD,
  host: 'localhost',
  database: 'confidence_pool',
  max: 10,
  idleTimeoutMillis: 1000,
});

// Verify database connection
pool.connect((err, client, done) => {
    if (err) throw err;
    done();
});


const users = {};

passport.serializeUser((user, done) => {
    users[user.id] = user;
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    if (users.hasOwnProperty(id)) {
        done(null, users[id]);
    }
    else {
        done('Cannot find user', null);
    }
});

passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        pool.query(
            'select id, email, name from public.users where email = $1 and password = crypt($2, password) limit 1',
            [email, password],
            (err, result) => {
                if (err) {
                    done(err);
                    return console.error(err);
                }
                if (result.rows.length > 0) {
                    done(null, result.rows[0]);
                }
                else {
                    done(null, false, "Unauthorized: Access is denied due to invalid credentials.");
                }
            }
        );
    }
));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'lsritnhb9856b',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/leagues',
    })
);

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/');
    });
});

app.get('/leagues',
    passport.authenticate('session'),
    isLoggedIn,
    (req, res) => {
        pool.query(
            'select leagues.id, leagues.name from public.leagues, public.membership where membership.user_id = $1 and leagues.id = membership.league_id',
            [req.session.passport.user],
            (err, result) => {
                if (err) {
                    res.status(500).end();
                    return console.error(err);
                }
                res.header('Content-Type', 'application/json');
                res.send(result.rows);
            }
        );

    }
);

app.get('/leagues/:leagueid',
    passport.authenticate('session'),
    isLoggedIn,
    (req, res) => {
        co(function * () {
            try {
                let result = yield pool.query(
                    'select leagues.id, leagues.name from public.users, public.leagues, public.membership where membership.league_id = $1 and users.id = membership.user_id and leagues.id = membership.league_id and users.id = $2 limit 1',
                    [req.params.leagueid, req.session.passport.user]
                );

                if (result.rows.length === 0) {
                    return res.status(404).end();
                }

                const league = result.rows[0];

                result = yield pool.query(
                    'select users.name from public.users, public.leagues, public.membership where membership.league_id = $1 and users.id = membership.user_id and leagues.id = membership.league_id',
                    [req.params.leagueid]
                );

                res.header('Content-Type', 'application/json');
                res.send({
                    id: league.id,
                    name: league.name,
                    members: result.rows,
                });
            }
            catch (err) {
                res.status(500).end();
                console.error(err);
            }
        });
    }
);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).end();
}

app.listen(port);
