const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ========================
// Controller
// ========================
const donasiController = require('../controllers/donasiController');
const adminController = require('../controllers/adminController');
const programController = require('../controllers/programController');
const homeController = require('../controllers/homeController');
const laporanController = require('../controllers/laporanController');
const loginController = require('../controllers/loginController');

// Middleware Login
const auth = require('../middleware/auth');

// ========================
// Konfigurasi Upload
// ========================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        const namaFile = Date.now() + path.extname(file.originalname);
        cb(null, namaFile);
    }
});

const upload = multer({ storage });

// ========================
// Login
// ========================
router.get('/login', loginController.formLogin);
router.post('/login', loginController.prosesLogin);
router.get('/logout', loginController.logout);

// ========================
// Beranda
// ========================
router.get('/', homeController.index);

// ========================
// Dashboard Admin
// ========================
router.get('/admin', auth, adminController.dashboard);

// ========================
// Program Donasi
// ========================
router.get('/program', auth, programController.index);

router.get('/program/tambah', auth, programController.formTambah);

router.post(
    '/program/tambah',
    auth,
    upload.single('gambar'),
    programController.simpanProgram
);

router.get('/program/edit/:id', auth, programController.formEdit);

router.post(
    '/program/edit/:id',
    auth,
    upload.single('gambar'),
    programController.updateProgram
);

router.get('/program/hapus/:id', auth, programController.hapusProgram);

// ========================
// Admin Donasi
// ========================
router.get('/admin/edit/:id', auth, adminController.formEdit);

router.post('/admin/edit/:id', auth, adminController.updateStatus);

router.get('/admin/hapus/:id', auth, adminController.hapusDonasi);

// ========================
// Donasi
// ========================
router.get('/donasi', donasiController.tampilkanForm);

router.post(
    '/donasi',
    upload.single('bukti'),
    donasiController.simpanDonasi
);

router.get('/donasi/sukses', donasiController.tampilkanSukses);

// ========================
// Laporan
// ========================
router.get('/laporan/pdf', auth, laporanController.cetakPDF);

router.get('/laporan/excel', auth, laporanController.cetakExcel);

// ========================
module.exports = router;