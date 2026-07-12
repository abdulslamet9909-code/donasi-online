const moment = require('moment');
require('moment/locale/id');
moment.locale('id');

const db = require('../config/database');

// ============================
// Cek Login
// ============================

// ============================
// Dashboard Admin
// ============================
exports.dashboard = (req, res) => {

    if (!req.session.login) {
        return res.redirect('/login');
    }

    const sql = `
        SELECT *
        FROM donasi
        ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.send("Terjadi kesalahan database.");
        }

        // Format tanggal Indonesia
        results.forEach(item => {
            item.tanggal = moment(item.tanggal)
                .format('dddd, DD MMMM YYYY | HH:mm') + ' WIB';
        });

        res.render('admin/index', {
            title: 'Dashboard Admin',
            donasi: results
        });

    });

};

// ============================
// Form Edit Status
// ============================
exports.formEdit = (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM donasi WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            if (results.length === 0) {
                return res.send("Data tidak ditemukan.");
            }

            res.render('admin/edit', {
                title: 'Edit Status Donasi',
                donasi: results[0]
            });

        }
    );

};

// ============================
// Update Status Donasi
// ============================
exports.updateStatus = (req, res) => {

    const id = req.params.id;
    const statusBaru = req.body.status;

    // Ambil data donasi terlebih dahulu
    db.query(
        "SELECT * FROM donasi WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            if (results.length === 0) {
                return res.send("Data tidak ditemukan.");
            }

            const donasi = results[0];
            const statusLama = donasi.status;

            // Update status donasi
            db.query(
                "UPDATE donasi SET status = ? WHERE id = ?",
                [statusBaru, id],
                (err) => {

                    if (err) {
                        console.log(err);
                        return res.send("Gagal mengubah status.");
                    }

                    // Jika baru pertama kali diterima
                    if (statusLama !== "Diterima" && statusBaru === "Diterima") {

                        db.query(
                            `UPDATE program_donasi
                             SET dana_terkumpul = dana_terkumpul + ?
                             WHERE nama_program = ?`,
                            [donasi.nominal, donasi.program],
                            (err) => {

                                if (err) {
                                    console.log(err);
                                }

                                return res.redirect("/admin");

                            }
                        );

                    } else {

                        return res.redirect("/admin");

                    }

                }
            );

        }
    );

};

// ============================
// Hapus Donasi
// ============================
exports.hapusDonasi = (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM donasi WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Gagal menghapus data.");
            }

            res.redirect("/admin");

        }
    );

};