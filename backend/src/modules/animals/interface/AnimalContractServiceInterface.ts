import {Animal} from '../entity';
import {AnimalBlockchain} from "../dto/animalBlockchain";

export interface AnimalContractServiceInterface {
    creteAnimal(animal: Animal): Promise<string>;
    updateAnimalName(id: string, name: string): Promise<string>;
    animalHistory(id: string): Promise<string>;
    searchAnimalByName(animalName: string): Promise<AnimalBlockchain>;
    searchAnimalByOwner(animalOwner: string): Promise<AnimalBlockchain>;
    updateAnimalOwner(id: string, animalOwner: string): Promise<string>;
}

