
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const pastaUploads = path.resolve(__dirname, "../../uploads");

fs.mkdirSync(pastaUploads, { recursive: true });

const tiposPermitidos = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pastaUploads);
    },

    filename: function (req, file, cb) {
        const extensao = tiposPermitidos[file.mimetype];

        const nomeArquivo = `${crypto.randomUUID()}${extensao}`;

        cb(null, nomeArquivo);
    }
});

const uploads = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {
        if (!tiposPermitidos[file.mimetype]) {
            return cb(
                new Error("Envie somente imagens JPG, PNG ou WebP.")
            );
        }

        cb(null, true);
    }
});

module.exports = uploads;
