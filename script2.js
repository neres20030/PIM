// script2.js

// Lógica para cadastro de frutas
let fruits = []; // Array para armazenar as frutas cadastradas

// Função para mostrar a seção selecionada
function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.style.display = 'none');
    
    document.getElementById(section).style.display = 'block';
}

// Função que será chamada ao enviar o formulário de frutas
document.getElementById('fruitForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const fruitName = document.getElementById('fruitName').value;
    
    if (fruitName) {
        // Adiciona a fruta no array
        fruits.push(fruitName);

        // Limpa o campo de entrada
        document.getElementById('fruitName').value = '';

        // Atualiza a lista de frutas exibida
        displayFruits();
    }
});

// Função para exibir a lista de frutas cadastradas
function displayFruits() {
    const fruitList = document.getElementById('fruitItems');
    fruitList.innerHTML = ''; // Limpa a lista atual

    // Adiciona cada fruta na lista
    fruits.forEach(fruit => {
        const li = document.createElement('li');
        li.textContent = fruit;
        fruitList.appendChild(li);
    });

    // Exibe o botão de envio para WhatsApp se houver frutas
    const sendButton = document.getElementById('sendToWhatsApp');
    if (fruits.length > 0) {
        sendButton.style.display = 'block'; // Exibe o botão
    }
}

// Função para enviar a lista de frutas para o WhatsApp
document.getElementById('sendToWhatsApp').addEventListener('click', function() {
    const fruitListText = fruits.join('\n'); // Junta as frutas em uma string separada por linhas
    const whatsappNumber = '5562986226761'; // Número de WhatsApp
    const message = encodeURIComponent(`Lista de frutas cadastradas:\n\n${fruitListText}`); // Formata a mensagem

    // Cria o link para enviar pelo WhatsApp
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Abre o link do WhatsApp
    window.open(whatsappLink, '_blank');
});
