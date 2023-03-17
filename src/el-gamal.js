const bigInt = require('big-integer');
const { getRandomPrime, hash, findPrimitiveRoot } = require('./common');


const generateElGamalKeys = (bits) => {
    const p = getRandomPrime(bits);
    const g = findPrimitiveRoot(p);

    const x = bigInt.randBetween(2, p.minus(2n)); // random secret
    const y = g.modPow(x, p); // public // g ** x % p

    return {
        publicKey: { p, g, y },
        privateKey: { x }
    };
};

const signElGamal = (m, publicKey, privateKey) => {
    const { p, g } = publicKey;
    const { x } = privateKey;

    const k = getRandomPrime(bigInt.randBetween(2, p.minus(2n)).bitLength());
    const r = g.modPow(k, p);

    const h = hash(m);
    const xr = x.multiply(r);
    const kInv = k.modInv(p.minus(1n));
    const s = h.minus(xr).multiply(kInv).mod(p.minus(1n));

    return { r, s };
};

const verifyElGamal = (m, signature, publicKey) => {
    const { p, g, y } = publicKey;
    const { r, s } = signature;

    const h = hash(m);

    const v1 = g.modPow(h, p);
    const v2 = y.modPow(r, p).multiply(r.modPow(s, p)).mod(p);

    return v1.equals(v2);
};


const bits = 128;

const { privateKey, publicKey } = generateElGamalKeys(bits);

const message = 'hell  o123';
const signature = signElGamal(message, publicKey, privateKey);
const isVerified = verifyElGamal(message, signature, publicKey);

console.log(`
-------------------------------------------------------------------------------------------------

Public Key: ${publicKey.y.toString()}
Public Key length: ${publicKey.y.toString().length}

Private Key: ${privateKey.x.toString()}
Private Key length): ${privateKey.x.toString().length}

Original Message: ${message}
Encrypted message: ${signature.r.toString()}${signature.s.toString()}

isVerified: ${isVerified}

-------------------------------------------------------------------------------------------------
`);
