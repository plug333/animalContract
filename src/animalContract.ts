import { Contract, Transaction, Returns, Context } from "fabric-contract-api";
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import {Animal} from "./animal";

export class AnimalContract extends Contract {
    @Transaction()
    public async CreateAnimal(ctx: Context, _animal: string): Promise<void> {
        console.log("**********************" +  _animal);
        console.log("********************** exists *" +  JSON.parse(_animal));
        const animal =  JSON.parse(_animal);
        const exists = await this.AnimalExists(ctx, animal.ID);
        console.log("********************** exists * id " animal.ID + " ? "+  exists);
        if (exists) {
            throw new Error(`The animal ${animal.ID} already exists`);
        }

/*        const animal = {
            id: _animal.ID,
            name: _animal.name,
            breed: _animal.breed,
            birthDate: _animal.ID,
            imgUrl: _animal.imgUrl,
            description: _animal.description,
            pedigree: _animal.pedigree
        };*/

        await ctx.stub.putState(animal.ID, Buffer.from(stringify(sortKeysRecursive(animal))));
    }

/*    @Transaction()
    public async CreateAnimal(ctx: Context, __id: string, _name: string, _breed: string, _birthDate: string, _imgUrl: string, _description: string, _pedigree: string): Promise<void> {
        const exists = await this.AnimalExists(ctx, __id);
        if (exists) {
            throw new Error(`The animal ${__id} already exists`);
        }

        const animal = {
            id: __id,
            name: _name,
            breed: _breed,
            birthDate: _birthDate,
            imgUrl: _imgUrl,
            description: _description,
            pedigree: _pedigree
        };

        await ctx.stub.putState(__id, Buffer.from(stringify(sortKeysRecursive(animal))));
    }*/

    @Transaction(false)
    @Returns('string')
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
    @Returns('string')
    public async GetAnimalHistory(ctx: Context, __id: string): Promise<string> {
        let resultsIterator = await ctx.stub.getHistoryForKey(__id);
        let results = await this._GetAllResults(resultsIterator, true);

        return JSON.stringify(results);
    }

    async _GetAllResults(iterator, isHistory: boolean): Promise<string[]> {
		let allResults: string[] = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes: any = {};
				console.log(res.value.value.toString());
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.txId;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString());
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString();
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString());
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString();
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

    @Transaction(false)
    @Returns('string')
    public async AnimalSearch(ctx: Context, __id: string): Promise<string> {
        console.log("************ ### " + __id);
        const animalJSON = await ctx.stub.getState(__id); // get the asset from chaincode state
        const xxx = await ctx.GetStube();
        if (!animalJSON || animalJSON.length === 0) {
            throw new Error(`The animal ${__id} does not exist`);
        }

        return animalJSON.toString();
    }
}