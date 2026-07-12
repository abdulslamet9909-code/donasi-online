const db = require("../config/database");

exports.tampilkanForm = (req, res) => {
    res.render("donasi/index", {
        title: "Donasi"
    });
};

exports.simpanDonasi = (req, res) => {

    const {
        nama,
        email,
        hp,
        program,
        nominal,
        metode,
        pesan
    } = req.body;

    const bukti = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO donasi
        (nama, email, hp, program, nominal, metode, bukti, pesan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nama,
            email,
            hp,
            program,
            nominal,
            metode,
            bukti,
            pesan || "-"
        ],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Gagal menyimpan data donasi.");
            }

            res.redirect("/donasi/sukses");

        }
    );

};

exports.tampilkanSukses = (req, res) => {
    res.render("donasi/sukses", {
        title: "Donasi Berhasil"
    });
};