

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el siguiente ID disponible al cargar la página
    fetch('/api/containers/next-id')
        .then(response => response.json())
        .then(data => {
            document.getElementById('containerId').value = data.nextId;
        })
        .catch(error => console.error('Error:', error));

    // Manejar el envío del formulario
    document.getElementById('containerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const containerId = document.getElementById('containerId').value;
        const type = document.getElementById('containerType').value;
        const weight = document.getElementById('weight').value;

        try {
            const response = await fetch('/api/containers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    containerId,
                    type,
                    weight
                })
            });

            const data = await response.json();
            if (data.success) {
                // Agregar el contenedor al array local
                containers.push({
                    containerId: parseInt(containerId),
                    type,
                    weight
                });
                
                updateContainerList();
                updateSummary();
                e.target.reset();
                
                // Obtener siguiente ID
                const nextIdResponse = await fetch('/api/containers/next-id');
                const nextIdData = await nextIdResponse.json();
                document.getElementById('containerId').value = nextIdData.nextId;
                
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Contenedor agregado correctamente',
                    icon: 'success',
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el contenedor',
                icon: 'error'
            });
        }
    });
});

function updateContainerList() {
    const containerList = document.getElementById('containerList');
    containerList.innerHTML = '';
    containers.forEach(container => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${container.containerId}</td>
            <td>${container.type}</td>
            <td>${container.weight}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editContainer(${container.containerId})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteContainer(${container.containerId})">Eliminar</button>
            </td>
        `;
        containerList.appendChild(row);
    });
}

// Variables globales
let trips = []; 
let currentTripIndex = 0;
let containers = [];
let finalized = false;
const MAX_WEIGHT_PER_TRIP = 500;

// Función updateSummary modificada para incluir total de viajes
function updateSummary() {
    const totalContainers = containers.length;
    const totalWeight = containers.reduce((sum, container) => sum + parseFloat(container.weight), 0);
    const totalTrips = trips.length + (containers.length > 0 ? 1 : 0);
    
    document.getElementById('totalContainers').textContent = totalContainers;
    document.getElementById('totalWeight').textContent = `${totalWeight} toneladas`;
    document.getElementById('totalTrips').textContent = totalTrips;
    
    // Verificar si se necesita un nuevo viaje
    if (totalWeight > MAX_WEIGHT_PER_TRIP) {
        Swal.fire({
            title: 'Límite de peso excedido',
            text: 'Se ha superado el límite de 500 toneladas. Se creará un nuevo viaje.',
            icon: 'warning',
            confirmButtonText: 'Entendido'
        }).then(() => {
            createNewTrip();
        });
    }
}

// Eliminar las siguientes declaraciones duplicadas:
// - Primera declaración de containers y finalized (líneas 1-2)
// - Segunda declaración de variables globales (líneas 89-93)
// - Tercera declaración de variables (líneas 181-184)

document.addEventListener('DOMContentLoaded', () => {
    createNewTrip();
    
    // Obtener el siguiente ID disponible
    fetch('/api/containers/next-id')
        .then(response => response.json())
        .then(data => {
            document.getElementById('containerId').value = data.nextId;
        })
        .catch(error => console.error('Error:', error));

    // Manejar el envío del formulario
    document.getElementById('containerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const containerId = document.getElementById('containerId').value;
        const type = document.getElementById('containerType').value;
        const weight = document.getElementById('weight').value;

        try {
            const response = await fetch('/api/containers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    containerId,
                    type,
                    weight
                })
            });

            const data = await response.json();
            if (data.success) {
                // Agregar el contenedor al array local
                containers.push({
                    containerId: parseInt(containerId),
                    type,
                    weight
                });
                
                updateContainerList();
                updateSummary();
                e.target.reset();
                
                // Obtener siguiente ID
                const nextIdResponse = await fetch('/api/containers/next-id');
                const nextIdData = await nextIdResponse.json();
                document.getElementById('containerId').value = nextIdData.nextId;
                
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Contenedor agregado correctamente',
                    icon: 'success',
                    timer: 2000
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el contenedor',
                icon: 'error'
            });
        }
    });
});

function updateContainerList() {
    const containerList = document.getElementById('containerList');
    containerList.innerHTML = '';
    containers.forEach(container => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${container.containerId}</td>
            <td>${container.type}</td>
            <td>${container.weight}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editContainer(${container.containerId})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteContainer(${container.containerId})">Eliminar</button>
            </td>
        `;
        containerList.appendChild(row);
    });
}



// Función para actualizar la lista de viajes
function updateTripsList() {
    const tripsList = document.getElementById('tripsList');
    tripsList.innerHTML = '';
    
    trips.forEach((trip, index) => {
        const totalWeight = trip.containers.reduce((sum, container) => sum + parseFloat(container.weight), 0);
        
        const tripHtml = `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index === currentTripIndex ? '' : 'collapsed'}" 
                            type="button" data-bs-toggle="collapse" 
                            data-bs-target="#trip${index}">
                        Viaje ${index + 1} - ${trip.status}
                        (${trip.containers.length} contenedores, ${totalWeight} toneladas)
                    </button>
                </h2>
                <div id="trip${index}" 
                     class="accordion-collapse collapse ${index === currentTripIndex ? 'show' : ''}"
                     data-bs-parent="#tripsList">
                    <div class="accordion-body">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${trip.containers.map(container => `
                                    <tr>
                                        <td>${container.containerId}</td>
                                        <td>${container.type}</td>
                                        <td>${container.weight}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        tripsList.insertAdjacentHTML('beforeend', tripHtml);
    });
}

// Modificar la función updateSummary para verificar el límite de peso
function updateSummary() {
    const totalContainers = containers.length;
    const totalWeight = containers.reduce((sum, container) => sum + parseFloat(container.weight), 0);
    
    document.getElementById('totalContainers').textContent = totalContainers;
    document.getElementById('totalWeight').textContent = `${totalWeight} toneladas`;
    document.getElementById('totalTrips').textContent = trips.length + (containers.length > 0 ? 1 : 0);
    
    // Verificar si se necesita un nuevo viaje
    if (totalWeight > MAX_WEIGHT_PER_TRIP) {
        Swal.fire({
            title: 'Límite de peso excedido',
            text: `Se ha superado el límite de ${MAX_WEIGHT_PER_TRIP} toneladas. Se creará un nuevo viaje.`,
            icon: 'warning',
            confirmButtonText: 'Entendido'
        }).then(() => {
            createNewTrip();
        });
    }
}

// Función para crear un nuevo viaje
function createNewTrip() {
    if (containers.length > 0) {
        trips.push({
            containers: [...containers],
            status: 'En progreso',
            totalWeight: containers.reduce((sum, container) => sum + parseFloat(container.weight), 0)
        });
    }
    containers = [];
    currentTripIndex = trips.length;
    updateTripsList();
    updateContainerList();
    updateSummary();
}

// Modificar el evento finalizeBtn
// Un solo event listener para finalizeBtn
document.getElementById('finalizeBtn').addEventListener('click', async () => {
    if (containers.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos un contenedor antes de finalizar.', 'error');
        return;
    }

    const result = await Swal.fire({
        title: '¿Finalizar viaje actual?',
        text: "¿Estás seguro de finalizar este viaje?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch('/api/trips/finalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tripIndex: currentTripIndex,
                    containers: containers,
                    totalContainers: containers.length,
                    totalWeight: containers.reduce((sum, container) => sum + parseFloat(container.weight), 0)
                })
            });

            const data = await response.json();
            if (data.success) {
                if (currentTripIndex < trips.length) {
                    trips[currentTripIndex].status = 'Finalizado';
                } else {
                    trips.push({
                        containers: [...containers],
                        status: 'Finalizado'
                    });
                }
                
                finalized = true;
                containers = [];
                updateTripsList();
                updateContainerList();
                updateSummary();
                
                document.getElementById('containerForm').disabled = true;
                document.getElementById('finalizeBtn').disabled = true;
                
                Swal.fire('¡Éxito!', 'Viaje finalizado correctamente', 'success')
                    .then(() => {
                        window.location.href = '/dashboard.html';
                    });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo finalizar el viaje', 'error');
        }
    }
});

// Inicializar el primer viaje al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    createNewTrip();
    // ... resto del código existente de DOMContentLoaded
});

async function editContainer(containerId) {
    const container = containers.find(c => c.containerId === containerId);
    
    const { value: formValues } = await Swal.fire({
        title: 'Editar Contenedor',
        html: `
            <select id="swal-type" class="swal2-select mb-3">
                <option value="A" ${container.type === 'A' ? 'selected' : ''}>Tipo A (18m)</option>
                <option value="B" ${container.type === 'B' ? 'selected' : ''}>Tipo B (15m)</option>
                <option value="C" ${container.type === 'C' ? 'selected' : ''}>Tipo C (12m)</option>
            </select>
            <input id="swal-weight" class="swal2-input" type="number" min="1" max="20" value="${container.weight}" placeholder="Peso">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const type = document.getElementById('swal-type').value;
            const weight = parseFloat(document.getElementById('swal-weight').value);
            
            if (!['A', 'B', 'C'].includes(type)) {
                Swal.showValidationMessage('Tipo de contenedor inválido');
                return false;
            }
            
            if (weight < 1 || weight > 20) {
                Swal.showValidationMessage('El peso debe estar entre 1 y 20 toneladas');
                return false;
            }
            
            return { type, weight };
        }
    });

    if (formValues) {
        try {
            const response = await fetch(`/api/containers/${containerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues)
            });

            const data = await response.json();
            if (data.success) {
                const index = containers.findIndex(c => c.containerId === containerId);
                containers[index] = { ...containers[index], ...formValues };
                updateContainerList();
                updateSummary();
                Swal.fire('¡Éxito!', 'Contenedor actualizado correctamente', 'success');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo actualizar el contenedor', 'error');
        }
    }
}

async function deleteContainer(containerId) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`/api/containers/${containerId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                containers = containers.filter(c => c.containerId !== containerId);
                updateContainerList();
                updateSummary();
                Swal.fire('¡Eliminado!', 'El contenedor ha sido eliminado.', 'success');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo eliminar el contenedor', 'error');
        }
    }
}

document.getElementById('finalizeBtn').addEventListener('click', async () => {
    if (containers.length === 0) {
        Swal.fire('Error', 'Debe agregar al menos un contenedor antes de finalizar.', 'error');
        return;
    }

    const result = await Swal.fire({
        title: '¿Finalizar carga?',
        text: "No podrás agregar más contenedores después de esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch('/api/trips/finalize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    totalContainers: containers.length,
                    totalWeight: containers.reduce((sum, container) => sum + parseFloat(container.weight), 0)
                })
            });

            const data = await response.json();
            if (data.success) {
                finalized = true;
                Swal.fire('¡Éxito!', 'Carga finalizada exitosamente', 'success');
                document.getElementById('containerForm').disabled = true;
                document.getElementById('finalizeBtn').disabled = true;
                window.location.href = '/dashboard.html';
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'No se pudo finalizar la carga', 'error');
        }
    }
});

// Agregar botón de cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', async () => {
    const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: "¿Estás seguro que deseas salir?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
});