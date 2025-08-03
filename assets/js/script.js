document.addEventListener("DOMContentLoaded", function() {
    carregarUsuarios();
    
    document.getElementById("form").addEventListener("submit", function(event) {
        event.preventDefault();
        cadastrarUsuario();
    });
});

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validarTelefone(telefone) {
    const re = /^[0-9]{10,11}$/;
    return re.test(telefone);
}

function cadastrarUsuario() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("mensagem");

    mensagem.innerText = "";
    mensagem.style.color = "red";

    if (!nome || !email || !telefone) {
        mensagem.innerText = "Por favor, preencha todos os campos.";
        return;
    }

    if (!validarEmail(email)) {
        mensagem.innerText = "Por favor, insira um email válido.";
        return;
    }

    if (!validarTelefone(telefone)) {
        mensagem.innerText = "Telefone deve ter 10 ou 11 dígitos.";
        return;
    }

    fetch("api/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.mensagem); });
        }
        return response.json();
    })
    .then(data => {
        mensagem.style.color = "green";
        mensagem.innerText = data.mensagem;
        document.getElementById("form").reset();
        carregarUsuarios();
    })
    .catch(error => {
        mensagem.innerText = error.message;
        console.error("Erro:", error);
    });
}

function carregarUsuarios() {
    fetch("api/listar.php")
    .then(response => response.json())
    .then(data => {
        const lista = document.createElement('div');
        lista.id = 'lista-usuarios';
        lista.innerHTML = '<h2>Usuários Cadastrados</h2>';
        
        if (data.length > 0) {
            const tabela = document.createElement('table');
            tabela.innerHTML = `
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                </tr>
            `;
            
            data.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.criado_em}</td>
                    <td><button class="excluir" data-id="${usuario.id}">Excluir</button></td>
                `;
                tabela.appendChild(row);
            });
            
            lista.appendChild(tabela);
            
            document.querySelectorAll('.excluir').forEach(button => {
                button.addEventListener('click', function() {
                    if (confirm('Tem certeza que deseja excluir este usuário?')) {
                        excluirUsuario(this.getAttribute('data-id'));
                    }
                });
            });
        } else {
            lista.innerHTML += '<p>Nenhum usuário cadastrado.</p>';
        }
        
        const container = document.querySelector('main');
        const oldList = document.getElementById('lista-usuarios');
        if (oldList) container.removeChild(oldList);
        container.appendChild(lista);
    })
    .catch(error => console.error('Erro:', error));
}

function excluirUsuario(id) {
    fetch("api/excluir.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.mensagem); });
        }
        return response.json();
    })
    .then(data => {
        alert(data.mensagem);
        carregarUsuarios();
    })
    .catch(error => {
        alert(error.message);
        console.error("Erro:", error);
    });
}