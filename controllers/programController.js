const db = require('../config/database');

// ============================
// Menampilkan Data Program Donasi
// ============================
exports.index = (req, res) => {

    const sql = `
        SELECT *
        FROM program_donasi
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Terjadi kesalahan database.");
        }

        res.render('program/index', {
            title: 'Program Donasi',
            program: results
        });

    });

};

// ============================
// Form Tambah Program
// ============================
exports.formTambah = (req, res) => {

    res.render('program/tambah', {
        title: 'Tambah Program Donasi'
    });

};

// ============================
// Simpan Program Donasi
// ============================
exports.simpanProgram = (req, res) => {

    const {
        nama_program,
        deskripsi,
        target_donasi,
        status
    } = req.body;

    const gambar = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO program_donasi
        (nama_program, deskripsi, target_donasi, dana_terkumpul, gambar, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nama_program,
            deskripsi,
            target_donasi,
            0,
            gambar,
            status
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Gagal menyimpan program.");
            }

            res.redirect('/program');

        }
    );

};

// ============================
// Form Edit Program
// ============================
exports.formEdit = (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM program_donasi WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            if (results.length === 0) {
                return res.send("Program tidak ditemukan.");
            }

            res.render("program/edit", {
                title: "Edit Program Donasi",
                program: results[0]
            });

        }
    );

};

// ============================
// Update Program Donasi
// ============================
exports.updateProgram = (req, res) => {

    const id = req.params.id;

    const {
        nama_program,
        deskripsi,
        target_donasi,
        status
    } = req.body;

    // Ambil data lama terlebih dahulu
    db.query(
        "SELECT * FROM program_donasi WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            if (results.length === 0) {
                return res.send("Program tidak ditemukan.");
            }

            // Jika tidak upload gambar baru, gunakan gambar lama
            let gambar = results[0].gambar;

            if (req.file) {
                gambar = req.file.filename;
            }

            db.query(
                `UPDATE program_donasi
                 SET nama_program = ?,
                     deskripsi = ?,
                     target_donasi = ?,
                     gambar = ?,
                     status = ?
                 WHERE id = ?`,
                [
                    nama_program,
                    deskripsi,
                    target_donasi,
                    gambar,
                    status,
                    id
                ],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Gagal mengupdate program.");
                    }

                    res.redirect('/program');

                }
            );

        }
    );

};

// ============================
// Hapus Program Donasi
// ============================
exports.hapusProgram = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM program_donasi WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Gagal menghapus program.");
            }

            res.redirect("/program");

        }
    );

};