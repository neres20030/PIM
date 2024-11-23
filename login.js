function handleLogin() {
    // Pegando os valores inseridos nos campos de entrada
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Dados fictícios de usuários para autenticação
    const users = {
        'joao': '240305',
        'kaian': '240305',
        'debora': '240305'
    };
  
    // Verificando se o nome de usuário e senha não estão vazios
    if (!username || !password) {
      alert('Por favor, preencha todos os campos!');
      return; // Impede o envio se os campos estiverem vazios
    }
  
    // Verificando se o usuário e a senha são válidos
    if (users[username] === password) {
        // Se o login for bem-sucedido, redireciona para a página 'index2.html'
        window.location.href = 'index3.html'; // Redirecionamento para a página de sucesso
    } else {
        // Se o login falhar
        alert('Usuário ou senha inválidos.');
    }
  }
  
  // Adicionando evento para o Enter no campo de senha
  document.getElementById('password').addEventListener('keydown', function(event) {
      // Verifica se a tecla pressionada foi o Enter (código 13)
      if (event.key === 'Enter') {
          event.preventDefault(); // Impede o comportamento padrão (evita o envio de formulário)
          handleLogin(); // Chama a função de login
      }
  });
  