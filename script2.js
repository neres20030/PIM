// script.js

// Função para mostrar a seção selecionada
function showSection(section) {
    // Oculta todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.style.display = 'none');
    
    // Exibe a seção selecionada
    document.getElementById(section).style.display = 'block';
}
