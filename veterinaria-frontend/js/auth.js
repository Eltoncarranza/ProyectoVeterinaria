
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
                const token = await respuesta.text(); 
                localStorage.setItem('tokenJWT', token);
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

const formRegistro = document.getElementById('formRegistro');

if (formRegistro) {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const rol = document.getElementById('regRol').value;
        const successMsg = document.getElementById('successMsg');

        try {
            const respuesta = await fetch('http://localhost:8080/api/auth/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rol }) 
            });

            if (respuesta.ok) {
                successMsg.style.display = 'block';
                successMsg.style.color = 'green';
                successMsg.textContent = '¡Cuenta creada! Redirigiendo al login...';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                successMsg.style.display = 'block';
                successMsg.style.color = 'red';
                successMsg.textContent = 'Error al registrar el usuario. Intenta con otro nombre.';
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            successMsg.style.display = 'block';
            successMsg.style.color = 'red';
            successMsg.textContent = 'Error de conexión con el servidor.';
        }
    });
}