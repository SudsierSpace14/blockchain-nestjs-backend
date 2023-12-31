import { createHash } from 'crypto'
import { ec as EC } from 'elliptic'

class Transaction {
    fromAddress: string;
    toAddress: string;
    amount: number;
    timestamp: number;
    signature: string;

    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     */
    constructor(fromAddress?: string, toAddress?: string, amount?: number) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    /**
     * @returns {string}
     */
    calculateHash() {
        return createHash('sha256')
            .update(this.fromAddress + this.toAddress + this.amount + this.timestamp)
            .digest('hex');
    }

    /**
     * @param {string} signingKey
     */

    sign(signingKey) {
        // You can only send a transaction from the wallet that is linked to your
        // key. So here we check if the fromAddress matches your publicKey
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the transaction object
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        // If the transaction doesn't have a from address we assume it's a
        // mining reward and that it's valid. You could verify this in a
        // different way (special field for instance)
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const ec = new EC('secp256k1');
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

export { Transaction }