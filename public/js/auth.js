async function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('registerName').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: `Usuario ${formData.name} registrado correctamente como ${formData.role === 'administrator' ? 'Administrador' : 'Cliente'}`,
                confirmButtonText: 'Ir al Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Cambiar a la pestaña de login
                    document.getElementById('login-tab').click();
                    // Limpiar el formulario de registro
                    document.getElementById('registerForm').reset();
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: 'Este correo electrónico ya está registrado. Por favor, utiliza otro correo.',
                confirmButtonText: 'Entendido'
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en el servidor. Por favor, intenta más tarde.'
        });
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
        role: document.getElementById('registerRoleLogin').value
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userName', data.name);
            
            window.location.href = data.role === 'administrator' ? '/admin-dashboard.html' : '/client-dashboard.html';
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: data.error
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error en el servidor'
        });
    }
}

function handleLogout() {
    // Limpiar el almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    
    // Redirigir al login
    window.location.href = '/';
}