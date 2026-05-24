
let editingId = null;
const API_URL = '/api/characters';

const charactersContainer = document.getElementById('characters-container');
const characterForm = document.getElementById('character-form');
const formMessage = document.getElementById('form-message');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

async function fetchCharacters(searchName = '') {
    try {
        let fetchUrl = API_URL;
        if (searchName) {
            fetchUrl += `?name=${encodeURIComponent(searchName)}`;
        }

        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Error al obtener los personajes');
        
        const characters = await response.json();
        renderCharacters(characters);
    } catch (error) {
        console.error(error);
        charactersContainer.innerHTML = '<p>Error al cargar personajes.</p>';
    }
}

function renderCharacters(characters) {
    charactersContainer.innerHTML = '';

    if (characters.length === 0) {
        charactersContainer.innerHTML = '<p>No hay personajes almacenados.</p>';
        return;
    }

    characters.forEach(char => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        card.innerHTML = `
            <h3>${char.name}</h3>
            <p><strong>Raza:</strong> ${char.race}</p>
            <p><strong>Rol:</strong> ${char.role}</p>
            <p><strong>Nivel:</strong> ${char.level}</p>
            <p><strong>Universo:</strong> ${char.universe}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button onclick="prepareEdit('${char.id}', '${char.name}', '${char.race}', '${char.role}', ${char.level}, '${char.universe}')" style="background-color: #4a6fa5;">✏️ Editar</button>
                <button onclick="deleteCharacter('${char.id}')" style="background-color: #b4135f;">🗑️ Eliminar</button>
            </div>
        `;
        charactersContainer.appendChild(card);
    });
}

// Eliminar un personaje
window.deleteCharacter = async (id) => {
    if (confirm('¿Estás segura de que querés eliminar este personaje?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchCharacters(searchInput.value);
            } else {
                alert('No se pudo eliminar el personaje.');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }
};

window.prepareEdit = (id, name, race, role, level, universe) => {
    editingId = id; 
    
    document.getElementById('name').value = name;
    document.getElementById('race').value = race;
    document.getElementById('role').value = role;
    document.getElementById('level').value = level;
    document.getElementById('universe').value = universe;
    
    document.querySelector('.form-section h2').textContent = 'Editar Personaje';
    document.querySelector('#character-form button[type="submit"]').textContent = 'Actualizar Personaje';
    
    if (!document.getElementById('cancel-edit-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-edit-btn';
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancelar Edición';
        cancelBtn.style.backgroundColor = '#666';
        cancelBtn.style.marginTop = '10px';
        cancelBtn.onclick = resetForm;
        characterForm.appendChild(cancelBtn);
    }
    
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
};

function resetForm() {
    editingId = null;
    characterForm.reset();
    
    document.querySelector('.form-section h2').textContent = 'Crear Nuevo Personaje';
    document.querySelector('#character-form button[type="submit"]').textContent = 'Guardar Personaje';
    
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) cancelBtn.remove();
}

characterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const race = document.getElementById('race').value;
    const role = document.getElementById('role').value;
    const levelInput = document.getElementById('level').value;
    const universe = document.getElementById('universe').value;

    const level = parseInt(levelInput, 10);
    const characterData = { name, race, role, level, universe };

    let url = API_URL;
    let method = 'POST';

    if (editingId) {
        url = `${API_URL}/${editingId}`; 
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(characterData)
        });

        const result = await response.json();

        if (response.ok) {
            formMessage.style.color = 'green';
            formMessage.textContent = editingId ? '¡Personaje actualizado con éxito!' : '¡Personaje creado con éxito!';
            
            resetForm();      
            fetchCharacters(searchInput.value); 
        } else {
            formMessage.style.color = 'red';
            formMessage.textContent = `Error: ${result.error || 'No se pudo procesar'}`;
        }
    } catch (error) {
        console.error(error);
        formMessage.style.color = 'red';
        formMessage.textContent = 'Error de red al intentar conectar con el servidor.';
    }
});

searchInput.addEventListener('input', (e) => {
    fetchCharacters(e.target.value);
});

themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}
fetchCharacters();