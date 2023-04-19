import { Property, Object } from "fabric-contract-api";

@Object()
export class Animal {
    @Property()
    public _id: string;

    @Property()
    public name: string;

//   @Column({
//     type: 'varchar',
//     enum: AnimalType,
//     default: AnimalType.DOG
//   })
//   type: AnimalType;
  
    @Property()
    public breed: string;

    @Property()
    public birthDate: Date;

    @Property()
    public imgUrl: string;

    @Property()
    public description: string;

    @Property()
    public pedigree: boolean;
}