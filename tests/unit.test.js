import { expect } from 'chai';
import { validateWeight, validateType } from '../js/validation.js';

describe('Pruebas Unitarias de Contenedores', () => {
    describe('Validación de Peso', () => {
        it('debe rechazar peso menor a 1 tonelada', () => {
            expect(validateWeight(0)).to.be.false;
        });

        it('debe rechazar peso mayor a 20 toneladas', () => {
            expect(validateWeight(21)).to.be.false;
        });

        it('debe aceptar peso válido', () => {
            expect(validateWeight(15)).to.be.true;
        });
    });

    describe('Validación de Tipo', () => {
        it('debe aceptar tipos válidos', () => {
            expect(validateType('A')).to.be.true;
            expect(validateType('B')).to.be.true;
            expect(validateType('C')).to.be.true;
        });

        it('debe rechazar tipos inválidos', () => {
            expect(validateType('D')).to.be.false;
            expect(validateType('')).to.be.false;
        });
    });
});