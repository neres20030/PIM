function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Neymar' && password === 'The best') {
        alert('Login bem-sucedido!');
    } else {
        alert('Usuário ou senha inválidos.');
    }
}