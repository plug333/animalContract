import { Contract, Transaction, Returns, Context } from "fabric-contract-api";
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Animal } from "./animal";

export class AnimalContract extends Contract {
    @Transaction()
    public async CreateAnimal(ctx: Context, __id: string, _name: string, _breed: string, _birthDate: Date, _imgUrl: string, _description: string, _pedigree: boolean): Promise<void> {
        const exists = await this.AnimalExists(ctx, __id);
        if (exists) {
            throw new Error(`The animal ${__id} already exists`);
        }

        const animal = {
            _id: __id,
            name: _name,
            breed: _breed,
            birthDate: _birthDate,
            imgUrl: _imgUrl,
            description: _description,
            pedigree: _pedigree
        };

        await ctx.stub.putState(__id, Buffer.from(stringify(sortKeysRecursive(animal))));
    }

    @Transaction(false)
    public async ReadAnimal(ctx: Context, __id: string): Promise<string> {
        const animalJSON = await ctx.stub.getState(__id); // get the asset from chaincode state
        if (!animalJSON || animalJSON.length === 0) {
            throw new Error(`The animal ${__id} does not exist`);
        }
        
        return animalJSON.toString();
    }

    @Transaction()
    public async UpdateAnimalName(ctx: Context, __id: string, _name: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, __id);
        if (!exists) {
            throw new Error(`The animal ${__id} does not exist`);
        }

        const updatedAnimalName = {
            name: _name
        }

        return ctx.stub.putState(__id, Buffer.from(stringify(sortKeysRecursive(updatedAnimalName))));
    }

    @Transaction(false)
    @Returns('boolean')
    public async AnimalExists(ctx: Context, __id: string): Promise<boolean> {
        const animalJSON = await ctx.stub.getState(__id);
        return animalJSON && animalJSON.length > 0;
    }

    @Transaction()
    public async UpdateAnimal(ctx: Context, __id: string, _name: string, _breed: string, _birthDate: Date, _imgUrl: string, _description: string, _pedigree: boolean): Promise<void> {
        const exists = await this.AnimalExists(ctx, __id);
        if (!exists) {
            throw new Error(`The animal ${__id} does not exist`);
        }

        const updatedAnimal = {
            _id: __id,
            name: _name,
            breed: _breed,
            birthDate: _birthDate,
            imgUrl: _imgUrl,
            description: _description,
            pedigree: _pedigree
        };

        return ctx.stub.putState(__id, Buffer.from(stringify(sortKeysRecursive(updatedAnimal))));
    }

    @Transaction()
    public async DeleteAnimal(ctx: Context, __id: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, __id);
        if (!exists) {
            throw new Error(`The animal ${__id} does not exist`);
        }

        return ctx.stub.deleteState(__id);
    }

    @Transaction(false)
    @Returns('string')
    public async GetAllAnimal(ctx: Context): Promise<string> {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while(!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch(err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    @Transaction()
    public async GetAnimalHistory() {}
}