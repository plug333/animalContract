import { Contract, Context } from "fabric-contract-api";
export declare class AnimalContract extends Contract {
    CreateAnimal(ctx: Context, _animal: string): Promise<void>;
    ReadAnimal(ctx: Context, __id: string): Promise<string>;
    UpdateAnimalName(ctx: Context, __id: string, _name: string): Promise<void>;
    AnimalExists(ctx: Context, __id: string): Promise<boolean>;
    UpdateAnimal(ctx: Context, __id: string, _name: string, _breed: string, _birthDate: Date, _imgUrl: string, _description: string, _pedigree: boolean): Promise<void>;
    DeleteAnimal(ctx: Context, __id: string): Promise<void>;
    GetAllAnimal(ctx: Context): Promise<string>;
    GetAnimalHistory(ctx: Context, __id: string): Promise<string>;
    _GetAllResults(iterator: any, isHistory: boolean): Promise<string[]>;
    AnimalSearch(ctx: Context, query: string): Promise<string>;
    UpdateAnimalOwner(ctx: Context, __id: string, _ownerId: string): Promise<void>;
}
