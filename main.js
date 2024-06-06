const crypto = require('crypto');

class Token {
    constructor(name, symbol, totalSupply) {
        this.name = name;
        this.symbol = symbol;
        this.totalSupply = totalSupply;
        this.balances = {};
    }

    createAccount(address) {
        if (!this.balances[address]) {
            this.balances[address] = 0;
        }
    }

    mint(address, amount) {
        this.createAccount(address);
        this.totalSupply += amount;
        this.balances[address] += amount;
    }

    transfer(fromAddress, toAddress, amount) {
        if (this.balances[fromAddress] >= amount) {
            this.createAccount(toAddress);
            this.balances[fromAddress] -= amount;
            this.balances[toAddress] += amount;
        } else {
            throw new Error('Insufficient balance');
        }
    }

    getBalance(address) {
        this.createAccount(address);
        return this.balances[address];
    }
}

class BountyToken extends Token {
    constructor(name, symbol, totalSupply) {
        super(name, symbol, totalSupply);
    }

    hashTransaction(transaction) {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(transaction))
            .digest('hex');
    }

    signTransaction(transaction, privateKey) {
        const sign = crypto.createSign('SHA256');
        sign.update(JSON.stringify(transaction));
        sign.end();
        return sign.sign(privateKey, 'hex');
    }

    verifyTransaction(transaction, signature, publicKey) {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify(transaction));
        verify.end();
        return verify.verify(publicKey, signature, 'hex');
    }
}

module.exports = BountyToken;
