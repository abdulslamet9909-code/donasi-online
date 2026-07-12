const db = require('../config/database');

// ============================
// Beranda Website
// ============================
exports.index = (req, res) => {

    // Ambil semua program aktif
    const sqlProgram = `
        SELECT *
        FROM program_donasi
        WHERE status = 'Aktif'
        ORDER BY id DESC
    `;

    // Hitung total dana terkumpul dan jumlah program
    const sqlStatistik = `
        SELECT
            SUM(dana_terkumpul) AS total_dana,
            COUNT(*) AS total_program
        FROM program_donasi
        WHERE status='Aktif'
    `;

    // Hitung jumlah donatur yang donasinya diterima
    const sqlDonatur = `
        SELECT COUNT(*) AS total_donatur
        FROM donasi
        WHERE status='Diterima'
    `;

    db.query(sqlProgram, (err, program) => {

        console.log(program);

        if (err) {
            console.log(err);
            return res.send("Terjadi kesalahan database.");
        }

        db.query(sqlStatistik, (err, statistik) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            db.query(sqlDonatur, (err, donatur) => {

                if (err) {
                    console.log(err);
                    return res.send("Terjadi kesalahan database.");
                }

                res.render('home/index', {

                    title: 'Beranda',

                    program: program,

                    totalDana:
                        statistik[0].total_dana || 0,

                    totalProgram:
                        statistik[0].total_program || 0,

                    totalDonatur:
                        donatur[0].total_donatur || 0

                });

            });

        });

    });

};