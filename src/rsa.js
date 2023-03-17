const bigInt = require('big-integer');
const { hash, unhash, getRandomPrime } = require('./common');

const getPublicExponent = (phi) => {
    const e = bigInt(2).pow(16).next(); //2^16 + 1 = 65537.
    while (bigInt.gcd(e, phi).notEquals(1)) {
        e.next();
    }
    return e;
};

const getPrivateExponent = (e, phi) => {
    return e.modInv(phi);
};

const rsaSign = (hash, privateKey) => {
    const { d, n } = privateKey;
    const s = bigInt(hash).modPow(d, n);
    return s;
};

const rsaUnsign = (signature, publicKey) => {
    const { e, n } = publicKey;
    return bigInt(signature).modPow(e, n);
};

const rsaVerify = (hash, decrypted) => {
    return decrypted.compare(hash) === 0;
};

const generateRSAKeys = (bitLength) => {
    const p = getRandomPrime(bitLength);
    const q = getRandomPrime(bitLength);
    const n = p.multiply(q);
    const phi = p.subtract(1).multiply(q.subtract(1)); // (p - 1) * (q - 1);

    const e = getPublicExponent(phi);
    const d = getPrivateExponent(e, phi);

    return {
        publicKey: { e, n },
        privateKey: { d, n },
    };
};



const bits = 256;
const { privateKey, publicKey } = generateRSAKeys(bits);
const message = 'hello12354';

const hashed = hash(message);
const signature = rsaSign(hashed, privateKey);
const decrypted = rsaUnsign(signature, publicKey);
const unhashed = unhash(decrypted);
const isVerified = rsaVerify(hashed, decrypted)


console.log(`
-------------------------------------------------------------------------------------------------

RSA Public Key (n = p * q): ${publicKey.n.toString()}
RSA Public Key length: ${publicKey.n.toString().length}

RSA Private Key: ${privateKey.d.toString()}
RSA Private Key length: ${privateKey.d.toString().length}

Original Message: ${message}
Encoded message: ${hashed}
Encrypted message: ${signature}
Decrypted message: ${decrypted}
Decoded message: ${unhashed}

isVerified: ${isVerified}

-------------------------------------------------------------------------------------------------

`);
