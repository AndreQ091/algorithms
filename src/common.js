const bigInt = require('big-integer');


const getRandomPrime = (bits) => {
    const min = bigInt.one.shiftLeft(bits - 1);
    const max = bigInt.one.shiftLeft(bits).prev();

    while (true) {
        let p = bigInt.randBetween(min, max);
        if (p.isProbablePrime(256)) {
            return p;
        }
    }
};

const hash = (text) => {
    const codes = text
        .split('')
        .map(i => i.charCodeAt())
        .join('');

    return bigInt(codes);
};

const unhash = (m) => {
    const hexNumber = m.toString();
    let string = '';

    for (let i = 0; i < hexNumber.length; i += 2) {
        let num = Number(hexNumber.substr(i, 2));

        if (num <= 30) {
            string += String.fromCharCode(Number(hexNumber.substr(i, 3)));
            i++;
        } else {
            string += String.fromCharCode(num);
        }
    }

    return string;
};

const findPrimitiveRoot = (prime) => {
    const primitiveRoot = bigInt.randBetween(bigInt(0), prime);
    if (bigInt.gcd(prime, primitiveRoot) !== bigInt(1)) {
        return primitiveRoot;
    }
    return generatePrimitiveRoot()
};

module.exports = {
    getRandomPrime,
    findPrimitiveRoot,
    hash,
    unhash,
};