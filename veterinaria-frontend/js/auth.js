const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMsg');

        try {
            const respuesta = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (respuesta.ok) {
                const token = await respuesta.text(); // El backend devuelve el token en texto plano
                
                // Paso 2: Almacenamiento seguro en el navegador
                localStorage.setItem('tokenJWT', token);
                
                // Redirigir al módulo principal (Mascotas)
                window.location.href = 'mascotas.html';
            } else {
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            errorMsg.textContent = "Error de conexión con el servidor";
            errorMsg.style.display = 'block';
        }
    });
}