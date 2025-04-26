import { expect } from 'chai';
import { registerUser, login, addContainer, finalizeTrip } from '../js/containerService.js';

describe('Pruebas de Sistema', () => {
    it('debe completar flujo completo de carga', async () => {
        // Registro de usuario
        const user = await registerUser({
            email: 'test@test.com',
            password: 'test123'
        });
        
        // Inicio de sesión
        const session = await login(user.email, user.password);
        expect(session.token).to.exist;
        
        // Agregar contenedor
        const container = await addContainer({
            type: 'A',
            weight: 15
        });
        expect(container.id).to.exist;
        
        // Finalizar viaje
        const trip = await finalizeTrip();
        expect(trip.status).to.equal('finished');
    });
});