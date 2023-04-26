import {Object} from "fabric-contract-api";


export class Animal {

    ID: string;
    name: string
    type: string;
    breed: string;

    birthDate: string;
    imgUrl: string;
    description: string;
    pedigree: string;
/*    owner: {
        ID: string;
        name: string;
        surname: string;
    }*/

    ownerId: string;
    ownerName: string;
    ownerLastname: string;

    // constructor() {
    //     this.ID = "";
    //     this.name = "";
    //     this.type = "";
    //     this.breed = "";
    //
    //     this.birthDate = "";
    //     this.imgUrl = "";
    //     this.description = "";
    //     this.pedigree = "";
    // }
}