import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { Transaction } from './transaction';

interface IBody{
    publicKey: string,
    toAddress: string,
    amount: number
}

@Controller('blockchain')
export class BlockchainController {
    constructor(private blockchainService: BlockchainService) { }

    @Get('blocks')
    getBlocks() {
        return this.blockchainService.getBlocks()
    }

    @Get('wallet')
    getWallet() {
        return this.blockchainService.generateWalletKeys()
    }

    @Get('transactions/pending')
    getPendingTransactions() {
        return this.blockchainService.getPendingTransactions()
    }

    @Get('transactions/mine')
    mineTransactions(){
        return this.blockchainService.minePendingTransactions()
    }

    @Post('transaction/isvalid')
    isValidTransaction(@Body() tx: Transaction){
        return this.blockchainService.isValidTransaction(tx)
    }

    @Post('add/transaction')
    addTransaction(@Body() { publicKey, toAddress, amount }: IBody){
        return this.blockchainService.createTransaction(publicKey, toAddress, amount)
    }
}
