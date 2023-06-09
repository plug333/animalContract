import {deleteAnimalSchema, listAnimalsSchema} from './schema';
import {getAnimalContractService} from "../common/ServiceFactory";
import {Animal} from "./entity";
import console from "console";

export default function animalHandler(server, options, next) {
	server.get(
		'/',
		{ schema: listAnimalsSchema },
		async (req, res) => {
			req.log.info('list animals from db');
			const animals = await server.db.animals.find();
			res.send(animals);
		}
	);

	server.get('/:_id', async (req, res) => {
		req.log.info('get one animals from db');
		const animal = await server.db.animals.findOne(req.params._id);
		res.send(animal);
	});

	server.post('/', async (req, res) => {
		req.log.info('Add animals to db');
		let animals = await server.db.animals.save(req.body) as Animal;
		animals.transactionHash = await getAnimalContractService().creteAnimal(animals);
		animals = await server.db.animals.save(req.body) as Animal;
		res.status(201).send(animals);
	});

	server.put('/:_id', async (req, res) => {
		req.log.info('Update animal to db');
		const _id = req.params._id;
		const animals = await server.db.animals.save({ _id, ...req.body });
		res.status(200).send(animals);
	});

	server.put('/:_id/name', async (req, res) => {
		req.log.info('Update animal name to db');
		const _id = req.params._id;
		const animal = await server.db.animals.findOne(req.params._id);
		animal.transactionHash = await getAnimalContractService().updateAnimalName(animal._id, req.body.name );
		animal.name = req.body.name;
		const animals = await server.db.animals.save({ _id, ...animal });
		res.status(200).send(animals);
	});

	server.get('/:name/name', async (req, res) => {
		req.log.info('Search animal by name');
		const name = req.params.name;
		res.status(200).send(await getAnimalContractService().searchAnimalByName(name));
	});

	server.get('/:ownerId/ownerId', async (req, res) => {
		req.log.info('Search animal by ownerId');
		const ownerId = req.params.ownerId;
		res.status(200).send(await getAnimalContractService().searchAnimalByOwner(ownerId));
	});

	server.get('/:_id/history', async (req, res) => {
		req.log.info('transaction animal history');
		res.send(await getAnimalContractService().animalHistory(req.params._id));
	});

	server.delete(
		'/:_id',
		{ schema: deleteAnimalSchema },
		async (req, res) => {
			req.log.info(`delete animal ${req.params._id} from db`);
			const animal = await server.db.animals.findOne(req.params._id);
			await server.db.animals.remove(animal);
			res.code(200).send({});
		}
	);

	server.put('/:_id/ownerId', async (req, res) => {
		req.log.info('Update animal owner to db');
		const _id = req.params._id;
		const animal = await server.db.animals.findOne(req.params._id);
		animal.transactionHash = await getAnimalContractService().updateAnimalOwner(animal._id, req.body.ownerId );
		animal.ownerId = req.body.ownerId;
		const animals = await server.db.animals.save({ _id, ...animal });
		res.status(200).send(animals);
	});

	next();
}
