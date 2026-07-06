const apiUrl = 'http://localhost:3000/eventos';

document.addEventListener('DOMContentLoaded', () => {
    loadEventos();
    
    document.getElementById('eventoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEvento();
    });

    document.getElementById('btnCancel').addEventListener('click', function() {
        resetForm();
    });
});

async function loadEventos() {
    try {
        const response = await fetch(apiUrl);
        const eventos = await response.json();
        const tbody = document.getElementById('tabelaEventos');
        tbody.innerHTML = '';
        
        eventos.forEach(evento => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${evento.title}</td>
                <td>${evento.start}</td>
                <td>${evento.end}</td>
                <td><span class="badge bg-info">${evento.type}</span></td>
                <td>${evento.location}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editEvento('${evento.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEvento('${evento.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
}

async function saveEvento() {
    const id = document.getElementById('eventoId').value;
    const title = document.getElementById('title').value;
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const type = document.getElementById('type').value;
    const location = document.getElementById('location').value;

    const evento = { title, start, end, type, location };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${apiUrl}/${id}` : apiUrl;

    try {
        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento)
        });
        resetForm();
        loadEventos();
    } catch (error) {
        console.error("Erro ao salvar evento:", error);
    }
}

async function editEvento(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const evento = await response.json();
        
        document.getElementById('eventoId').value = evento.id;
        document.getElementById('title').value = evento.title;
        document.getElementById('start').value = evento.start;
        document.getElementById('end').value = evento.end;
        document.getElementById('type').value = evento.type;
        document.getElementById('location').value = evento.location;

        document.getElementById('btnCancel').style.display = 'inline-block';
    } catch (error) {
        console.error("Erro ao buscar evento para edição:", error);
    }
}

async function deleteEvento(id) {
    if (confirm("Tem certeza que deseja excluir este evento?")) {
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            });
            loadEventos();
        } catch (error) {
            console.error("Erro ao deletar evento:", error);
        }
    }
}

function resetForm() {
    document.getElementById('eventoForm').reset();
    document.getElementById('eventoId').value = '';
    document.getElementById('btnCancel').style.display = 'none';
}
