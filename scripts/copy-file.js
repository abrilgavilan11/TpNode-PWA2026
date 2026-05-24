const fs = require('fs');
const { performance } = require('perf_hooks');

const sourcePath = process.argv[2];
const destinationPath = process.argv[3];

if (!sourcePath || !destinationPath) {
    console.error('Error: Faltan argumentos.');
    console.log('Uso correcto: node scripts/copy-file.js <origen> <destino>');
    process.exit(1);
}

const startTime = performance.now();

const readStream = fs.createReadStream(sourcePath);
const writeStream = fs.createWriteStream(destinationPath);

readStream.on('error', (err) => {
    if (err.code === 'ENOENT') {
        console.error(`Error de lectura: El archivo de origen "${sourcePath}" no existe.`);
    } else {
        console.error(`Error de lectura: ${err.message}`);
    }
});

writeStream.on('error', (err) => {
    console.error(`Error de escritura: Verificá que la ruta de destino sea válida. Detalle: ${err.message}`);
});

writeStream.on('finish', () => {
    const endTime = performance.now();
    const timeTaken = Math.round(endTime - startTime); 
    
    console.log('Archivo copiado correctamente.');
    console.log(`Tiempo total: ${timeTaken}ms`);
});

readStream.pipe(writeStream);