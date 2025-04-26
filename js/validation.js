export const validateWeight = (weight) => {
    const numWeight = parseFloat(weight);
    return numWeight >= 1 && numWeight <= 20;
};

export const validateType = (type) => {
    return ['A', 'B', 'C'].includes(type);
};

export const validateContainer = {
    validateWeight,
    validateType
};