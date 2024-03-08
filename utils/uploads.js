const multer = require('multer');

// Función para configurar el almacenamiento de imágenes
function configureStorage(destinationPath) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../uploads/' + destinationPath);
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });
}

// Función para configurar la subida de archivos
function configureUpload(storage) {
    return multer({ storage: storage });
}

// Configuración de subida para habitaciones
const storageHabitaciones = configureStorage('habitaciones');
const uploadHabitaciones = configureUpload(storageHabitaciones);

// Configuración de subida para incidencias
const storageIncidencias = configureStorage('incidencias');
const uploadIncidencias = configureUpload(storageIncidencias);

// Exportación de los objetos de subida
module.exports = {
    uploadHabs: uploadHabitaciones,
    uploadIncs: uploadIncidencias
};
