const db = require('../config/database');

// ==========================
// Tampilkan Halaman Login
// ==========================
exports.formLogin = (req, res) => {

    res.render('login/index', {
        title: 'Login Admin',
        error: null
    });

};

// ==========================
// Proses Login
// ==========================
exports.prosesLogin = (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT *
        FROM admin
        WHERE username = ?
        AND password = ?
    `;

    db.query(sql, [username, password], (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (results.length > 0) {

            req.session.login = true;
            req.session.admin = results[0];

            return res.redirect('/admin');

        }

        res.render('login/index', {
            title: 'Login Admin',
            error: 'Username atau Password salah!'
        });

    });

};

// ==========================
// Logout
// ==========================
exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

};