"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
class AnimalContract extends fabric_contract_api_1.Contract {
    async CreateAnimal(ctx, _animal) {
        console.log("**********************" + _animal);
        console.log("********************** exists *" + JSON.parse(_animal));
        const animal = JSON.parse(_animal);
        const exists = await this.AnimalExists(ctx, animal.ID);
        console.log("********************** exists * id ", animal.ID + " ? " + exists);
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
        await ctx.stub.putState(animal.ID, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(animal))));
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
    async ReadAnimal(ctx, __id) {
        const animalJSON = await ctx.stub.getState(__id); // get the asset from chaincode state
        if (!animalJSON || animalJSON.length === 0) {
            throw new Error(`The animal ${__id} does not exist`);
        }
        return animalJSON.toString();
    }
    async UpdateAnimalName(ctx, __id, _name) {
        const exists = await this.AnimalExists(ctx, __id);
        if (!exists) {
            throw new Error(`The animal ${__id} does not exist`);
        }
        const updatedAnimalName = {
            name: _name
        };
        return ctx.stub.putState(__id, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(updatedAnimalName))));
    }
    async AnimalExists(ctx, __id) {
        const animalJSON = await ctx.stub.getState(__id);
        return animalJSON && animalJSON.length > 0;
    }
    async UpdateAnimal(ctx, __id, _name, _breed, _birthDate, _imgUrl, _description, _pedigree) {
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
        return ctx.stub.putState(__id, Buffer.from(json_stringify_deterministic_1.default(sort_keys_recursive_1.default(updatedAnimal))));
    }
    async DeleteAnimal(ctx, __id) {
        const exists = await this.AnimalExists(ctx, __id);
        if (!exists) {
            throw new Error(`The animal ${__id} does not exist`);
        }
        return ctx.stub.deleteState(__id);
    }
    async GetAllAnimal(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            }
            catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
    async GetAnimalHistory(ctx, __id) {
        let resultsIterator = await ctx.stub.getHistoryForKey(__id);
        let results = await this._GetAllResults(resultsIterator, true);
        return JSON.stringify(results);
    }
    async _GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString());
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString());
                    }
                    catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString();
                    }
                }
                else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString());
                    }
                    catch (err) {
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
    async AnimalSearch(ctx, __id) {
        console.log("************ ### " + __id);
        const animalJSON = await ctx.stub.getState(__id); // get the asset from chaincode state
        if (!animalJSON || animalJSON.length === 0) {
            throw new Error(`The animal ${__id} does not exist`);
        }
        return animalJSON.toString();
    }
}
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "CreateAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "ReadAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "UpdateAnimalName", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "AnimalExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, Date, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "UpdateAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "DeleteAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "GetAllAnimal", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "GetAnimalHistory", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], AnimalContract.prototype, "AnimalSearch", null);
exports.AnimalContract = AnimalContract;
//# sourceMappingURL=animalContract.js.map