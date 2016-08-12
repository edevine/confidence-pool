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

function addRow(row, result) {
    result.addRow(row);
}

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
        const client = new pg.Client(conString);
        client.connect(err => {
            if (err) {
                return done(err);
            }
            
            const query = client.query(
                'select id, email, name from public.users where email = $1 and password = crypt($2, password) limit 1',
                [email, password]
            );
            
            query.on('row', addRow);

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
    (req, res, next) => {
        const client = new pg.Client(conString);
        client.connect(err => {
            if (err) {
                return res.status(500).send(err);
            }
            
            const query = client.query(
                'select leagues.id, leagues.name from public.leagues, public.membership where membership.user = $1 and leagues.id = membership.league',
                [req.session.passport.user]
            );

            query.on('error', err => {
                client.end();
                res.status(500).send(err);
            });
            
            query.on('row', addRow);

            query.on('end', result => {
                res.header('Content-Type', 'application/json');
                res.send(result.rows);
                client.end();
            });
        });
    }
);

app.get('/leagues/:leagueid',
    passport.authenticate('session'),
    isLoggedIn,
    (req, res) => {
        const client = new pg.Client(conString);
        client.connect(err => {
            if (err) {
                return res.status(500).send(err);
            }

            const query = client.query(
                'select leagues.id, leagues.name from public.users, public.leagues, public.membership where membership.league = $1 and users.id = membership.user and leagues.id = membership.league and users.id = $2 limit 1',
                [req.params.leagueid, req.session.passport.user]
            );
            
            query.on('error', err => {
                client.end();
                res.status(500).send(err);
            });
            
            query.on('row', addRow);

            query.on('end', result => {
                if (result.rows.length === 0) {
                    res.status(404).end();
                    client.end();
                    return;
                }
                const league = result.rows[0];
            
                const query = client.query(
                    'select users.name from public.users, public.leagues, public.membership where membership.league = $1 and users.id = membership.user and leagues.id = membership.league',
                    [req.params.leagueid]
                );

                query.on('error', err => {
                    client.end();
                    res.status(500).send(err);
                });
                
                query.on('row', addRow);

                query.on('end', result => {
                    res.header('Content-Type', 'application/json');
                    res.send({
                        id: league.id,
                        name: league.name,
                        members: result.rows,
                    });
                    client.end();
                });

            });

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
