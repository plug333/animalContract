import {AnimalContractServiceInterface} from './interface/AnimalContractServiceInterface';
import {Animal} from './entity';
import {BlockchainServiceInterface} from '../fabric/interface/BlockchainServiceInterface';
import {getBlockchainService} from '../common/ServiceFactory';
import config from '../../config/Config';
import {TextDecoder} from 'util';
import {AnimalBlockchain} from "./dto/animalBlockchain";
import * as console from "console";

export class AnimalContractService implements AnimalContractServiceInterface {

    private blockchainService: BlockchainServiceInterface = getBlockchainService();
    private utf8Decoder = new TextDecoder();

    async creteAnimal(animal: Animal): Promise<string> {
        const gateway = await this.blockchainService.connect();
        const network = gateway.getNetwork(config.fabric.channel.name);
        const contract = network.getContract(config.fabric.chaincode.name);
        console.log("*********************************");
        console.log(JSON.stringify(new AnimalBlockchain(animal)));
        console.log("*********************************");
        try {
            const commit = await contract.submitAsync('CreateAnimal',
                {arguments: [JSON.stringify(new AnimalBlockchain(animal))]});

            return commit.getTransactionId();
        } catch (error) {
            console.log("Error during the transaction with message: ", error);
            throw error;
        }
    }

    async updateAnimalName(id: string, name: string): Promise<string> {
        const gateway = await this.blockchainService.connect();
        const network = gateway.getNetwork(config.fabric.channel.name);
        const contract = network.getContract(config.fabric.chaincode.name);
        try {
            const commit = await contract.submitAsync('UpdateAnimalName',
                {arguments: [id, name]});
            const resultJson = this.utf8Decoder.decode(commit.getResult());

            return commit.getTransactionId();
        } catch (error) {
            console.log("Error during the animal name update with message: ", error);
            throw error;
        }
    }

    async animalHistory(id: string): Promise<string> {
        const gateway = await this.blockchainService.connect();
        const network = gateway.getNetwork(config.fabric.channel.name);
        const contract = network.getContract(config.fabric.chaincode.name);
        try {
            const resultBytes = await contract.evaluateTransaction('GetAnimalHistory',
                id);
            const resultJson = this.utf8Decoder.decode(resultBytes);
            return this.prettyJSONString(resultJson);
        } catch (error) {
            console.log("Error during the animal name update with message: ", error);
            throw error;
        }
    }

    async searchAnimalByName(animalName: string): Promise<AnimalBlockchain> {
        const gateway = await this.blockchainService.connect();
        const network = gateway.getNetwork(config.fabric.channel.name);
        const contract = network.getContract(config.fabric.chaincode.name);
        try {
            const resultBytes = await contract.evaluateTransaction('AnimalSearch',
                 `{"selector":{"name": "${animalName}"} }`);
                // animalName);
            console.log(" ***************  " + animalName);
            const resultJson = this.utf8Decoder.decode(resultBytes);
            return JSON.parse(resultJson) as AnimalBlockchain;
        } catch (error) {
            console.log("Error during the animal search: ", error);
            throw error;
        }
    }

    async searchAnimalByOwner(animalOwner: string): Promise<AnimalBlockchain> {
        const gateway = await this.blockchainService.connect();
        const network = gateway.getNetwork(config.fabric.channel.name);
        const contract = network.getContract(config.fabric.chaincode.name);
        try {
            const resultBytes = await contract.evaluateTransaction('AnimalSearch',
                `{"selector":{"ownerId": "${animalOwner}"} }`);
            // animalName);
            console.log(" ***************  " + animalOwner);
            const resultJson = this.utf8Decoder.decode(resultBytes);
            return JSON.parse(resultJson) as AnimalBlockchain;
        } catch (error) {
            console.log("Error during the animal search: ", error);
            throw error;
        }
    }

    private prettyJSONString(inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    }

    async updateAnimalOwner(id: string, ownerId: string): Promise<string> {
        const gateway = await this.blockchainService.connect();
        const network = gateway.getNetwork(config.fabric.channel.name);
        const contract = network.getContract(config.fabric.chaincode.name);
        try {
            const commit = await contract.submitAsync('UpdateAnimalOwner',
                {arguments: [id, ownerId]});
            const resultJson = this.utf8Decoder.decode(commit.getResult());

            return commit.getTransactionId();
        } catch (error) {
            console.log("Error during the animal owner update with message: ", error);
            throw error;
        }
    }

}
