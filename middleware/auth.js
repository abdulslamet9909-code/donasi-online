module.exports = (req, res, next) => {

    if (!req.session.login) {
        return res.redirect('/login');
    }

    next();

};