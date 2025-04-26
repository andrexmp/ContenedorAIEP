import { expect } from 'chai';
import { addContainerManually, finalizeTrip, editContainer } from '../js/containerService.js';

describe('Pruebas Funcionales', () => {
        it('debe agregar contenedor manualmente', async () => {
            const result = await addContainerManually({
                type: 'A',
                weight: 15
            });
            expect(result.success).to.be.true;
        });

        it('debe finalizar viaje correctamente', async () => {
            const result = await finalizeTrip(1);
            expect(result.status).to.equal('finished');
        });

        it('debe editar contenedor existente', async () => {
            const result = await editContainer(1, {
                type: 'B',
                weight: 18
            });
            expect(result.success).to.be.true;
        });
});