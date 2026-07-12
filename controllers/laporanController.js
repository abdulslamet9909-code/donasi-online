const db = require('../config/database');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// ==============================
// Cetak Laporan Donasi PDF
// ==============================
exports.cetakPDF = (req, res) => {

    db.query(
        "SELECT * FROM donasi ORDER BY tanggal DESC",
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            const doc = new PDFDocument({
                margin: 40,
                size: 'A4'
            });

            res.setHeader(
                'Content-Type',
                'application/pdf'
            );

            res.setHeader(
                'Content-Disposition',
                'inline; filename=laporan-donasi.pdf'
            );

            doc.pipe(res);

            // Judul
            doc
                .fontSize(18)
                .text('LAPORAN DONASI', {
                    align: 'center'
                });

            doc.moveDown();

            doc
                .fontSize(12)
                .text('Panti Asuhan Desa Sumber Asri');

            doc.moveDown();

            doc.text("====================================================");

            doc.moveDown();

            results.forEach((item, index) => {

                doc.fontSize(11);

                doc.text(
                    `${index + 1}. ${item.nama}`
                );

                doc.text(
                    `Program : ${item.program}`
                );

                doc.text(
                    `Nominal : Rp ${Number(item.nominal).toLocaleString('id-ID')}`
                );

                doc.text(
                    `Status : ${item.status}`
                );

                doc.text(
                    `Tanggal : ${item.tanggal}`
                );

                doc.moveDown();

            });

            doc.end();

        }
    );

};

// ==============================
// Export Laporan Donasi Excel
// ==============================
exports.cetakExcel = (req, res) => {

    db.query(
        "SELECT * FROM donasi ORDER BY tanggal DESC",
        async (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Terjadi kesalahan database.");
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Laporan Donasi');

            worksheet.columns = [
                { header: 'No', key: 'no', width: 8 },
                { header: 'Nama Donatur', key: 'nama', width: 30 },
                { header: 'Program', key: 'program', width: 30 },
                { header: 'Nominal', key: 'nominal', width: 20 },
                { header: 'Status', key: 'status', width: 20 },
                { header: 'Tanggal', key: 'tanggal', width: 25 }
            ];

            results.forEach((item, index) => {

                worksheet.addRow({
                    no: index + 1,
                    nama: item.nama,
                    program: item.program,
                    nominal: item.nominal,
                    status: item.status,
                    tanggal: item.tanggal
                });

            });

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=laporan-donasi.xlsx'
            );

            await workbook.xlsx.write(res);

            res.end();

        }
    );

};