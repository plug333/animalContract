import {Animal} from '../entity';

export interface AnimalContractServiceInterface {
    creteAnimal(animal: Animal): Promise<string>;
    updateAnimalName(id: string, name: string): Promise<string>;
    getAnimalHistory(id: string): Promise<string>;
}

