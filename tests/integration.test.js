import { expect } from 'chai';
import { addContainer, getSummary, getTrips } from '../js/containerService.js';

describe('Pruebas de Integración', () => {
    describe('Flujo de Carga de Contenedores', () => {
        it('debe actualizar el resumen después de agregar contenedor', async () => {
            const container = {
                containerId: 1,
                type: 'A',
                weight: 10
            };
            
            await addContainer(container);
            const summary = getSummary();
            
            expect(summary.totalContainers).to.equal(1);
            expect(summary.totalWeight).to.equal(10);
        });

        it('debe crear nuevo viaje al exceder 500 toneladas', async () => {
            const container = {
                containerId: 2,
                type: 'A',
                weight: 501
            };
            
            await addContainer(container);
            const trips = getTrips();
            
            expect(trips.length).to.be.greaterThan(1);
        });
    });
});