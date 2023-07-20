import { Injectable } from '@nestjs/common';
import { ec as EC } from 'elliptic'
import { Blockchain } from './blockchain';
import { Transaction } from './transaction';

export interface IWalletKey {
    keyObj: any;
    publicKey: string;
    privateKey: string;
}

@Injectable()
export class BlockchainService {

    public blockchainInstance = new Blockchain();
    public walletKeys: IWalletKey[] = [];

    constructor() {
        this.blockchainInstance.difficulty = 1;
        this.blockchainInstance.minePendingTransactions('my-wallet-adress');

        this.generateWalletKeys()
    }

    getBlocks() {
        return this.blockchainInstance.chain;
    }

    generateWalletKeys() {
        // codigo usando elliptic que nao suporta importação module
        const ec = new EC('secp256k1')
        const key = ec.genKeyPair();

        this.walletKeys.push({
            keyObj: key,
            publicKey: key.getPublic('hex'),
            privateKey: key.getPrivate('hex')
        })

        return this.walletKeys
    }

    isValidTransaction(tx: Transaction): boolean {
        const transaction = new Transaction(
            tx.fromAddress,
            tx.toAddress,
            tx.amount
        )
        return transaction.isValid();
    }

    getPendingTransactions() {
        return this.blockchainInstance.pendingTransactions;
    }

    minePendingTransactions() {
        return this.blockchainInstance.minePendingTransactions(
            this.walletKeys[0].publicKey
        );
    }

    createTransaction(publicKey: string, toAddress: string, amount: number){
        const tx = new Transaction();
        const wallet = this.walletKeys.find(key => key.publicKey === publicKey)
        tx.fromAddress = publicKey;
        tx.toAddress = toAddress;
        tx.amount = amount;
        tx.sign(wallet.keyObj)

        return this.blockchainInstance.addTransaction(tx);
    }
}