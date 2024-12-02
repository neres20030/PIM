// script.js

// Array para armazenar as pragas
let pests = [];

// Função para renderizar a lista de pragas
function renderPests() {
    const pestList = document.getElementById('pest-list');
    pestList.innerHTML = ''; // Limpa a lista antes de renderizar

    pests.forEach((pest, index) => {
        const li = document.createElement('li');
        li.textContent = `${pest.name} - Local: ${pest.location}`;
        
        // Botão para remover praga
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => removePest(index);
        
        li.appendChild(removeButton);
        pestList.appendChild(li);
    });
}

// Função para adicionar uma nova praga
function addPest(event) {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página ao enviar o formulário

    const name = document.getElementById('pest-name').value;
    const location = document.getElementById('location').value;

    if (name && location) {
        const pest = { name, location };
        pests.push(pest); // Adiciona a nova praga à lista

        alert(`Praga "${name}" registrada com sucesso no local: ${location}.`);

        // Limpa os campos de entrada após o registro
        document.getElementById('pest-name').value = '';
        document.getElementById('location').value = '';

        renderPests(); // Atualiza a lista de pragas
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

// Função para remover uma praga da lista
function removePest(index) {
    pests.splice(index, 1); // Remove a praga do array de pragas
    renderPests(); // Atualiza a lista
}

// Adiciona o ouvinte de evento para o formulário
document.getElementById('pest-form').addEventListener('submit', addPest);

// Renderiza a lista de pragas ao carregar a página
renderPests();