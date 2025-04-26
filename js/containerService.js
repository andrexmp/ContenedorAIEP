// Servicios de contenedores
export const registerUser = async (userData) => {
    // Implementación temporal para pruebas
    return { email: userData.email };
};

export const login = async (email, password) => {
    // Implementación temporal para pruebas
    return { token: 'test-token' };
};

export const addContainer = async (container) => {
    // Implementación temporal para pruebas
    return { id: 1, ...container };
};

export const addContainerManually = async (container) => {
    // Implementación temporal para pruebas
    return { success: true };
};

export const editContainer = async (id, data) => {
    // Implementación temporal para pruebas
    return { success: true };
};

export const finalizeTrip = async () => {
    // Implementación temporal para pruebas
    return { status: 'finished' };
};

export const getSummary = () => {
    // Implementación temporal para pruebas
    return {
        totalContainers: 1,
        totalWeight: 10
    };
};

export const getTrips = () => {
    // Implementación temporal para pruebas
    return [
        { id: 1, status: 'completed' },
        { id: 2, status: 'pending' }
    ];
};