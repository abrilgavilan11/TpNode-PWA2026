const characters = require('./data/characters.js');

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png'
};

const server = http.createServer((req, res) => {
    const { url, method } = req;
    if (method === 'GET' && url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok' }));
    }

    if (url.startsWith('/api/characters')) {
        
        if (method === 'GET' && url === '/api/characters') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(characters));
        }

        const idMatch = url.match(/^\/api\/characters\/([a-zA-Z0-9]+)$/);
        
        // GET /api/characters/:id (Obtener un personaje por ID)
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;

        if (method === 'GET' && pathname === '/api/characters') {
            const nameQuery = parsedUrl.searchParams.get('name');
            
            let result = characters;
            
            if (nameQuery) {
                result = characters.filter(c => 
                    c.name.toLowerCase().includes(nameQuery.toLowerCase())
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(result));
        }
        
        // POST /api/characters (Crear un personaje)
        if (method === 'POST' && url === '/api/characters') {
            let body = '';
            
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    
                    const { name, race, role, level, universe } = data;
                    if (!name || !race || !role || level === undefined || !universe) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: "Faltan campos obligatorios" }));
                    }
                    if (typeof level !== 'number') {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: "El nivel debe ser un número" }));
                    }

                    const newCharacter = {
                        id: (characters.length + 1).toString(),
                        name, race, role, level, universe
                    };
                    
                    characters.push(newCharacter); 

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newCharacter));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "El formato JSON enviado es inválido" }));
                }
            });
            return;
        }

        // PUT /api/characters/:id (Actualizar un personaje)
        if (method === 'PUT' && idMatch) {
            const id = idMatch[1];
            const characterIndex = characters.findIndex(c => c.id === id);

            if (characterIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Personaje no encontrado para actualizar' }));
            }

            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    characters[characterIndex] = { ...characters[characterIndex], ...data, id };
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(characters[characterIndex]));
                } catch (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "El formato JSON enviado es inválido" }));
                }
            });
            return;
        }

        // DELETE /api/characters/:id (Eliminar un personaje) 
        if (method === 'DELETE' && idMatch) {
            const id = idMatch[1];
            const characterIndex = characters.findIndex(c => c.id === id);

            if (characterIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Personaje no encontrado para eliminar' }));
            }

            characters.splice(characterIndex, 1);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Personaje eliminado con éxito' }));
        }

        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Ruta de API no encontrada' }));
    }

    let filePath = url === '/' ? '/index.html' : url;
    
    let absolutePath = path.join(__dirname, 'public', filePath);

    let extname = path.extname(absolutePath);
    
    if (MIME_TYPES[extname]) {
        fs.readFile(absolutePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end('404 Not Found: El archivo no existe');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end('500 Internal Server Error');
                }
            }
            res.writeHead(200, { 'Content-Type': MIME_TYPES[extname] });
            res.end(content);
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found: Ruta no encontrada');
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo y escuchando en http://localhost:${PORT}`);
});