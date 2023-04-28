export const animalSchema = {
	_id: { type: 'string', format: 'uuid' },
	name: { type: 'string' },
	type: { type: 'string' },
	breed: { type: 'string' },
	birthDate: { type: 'string', format: 'date'},
	imgUrl: { type: 'string' },
	description: { type: 'string' },
	pedigree: { type: 'boolean' },
	created_at: { type: 'string', format: 'date-time' },
	updated_at: { type: 'string', format: 'date-time' },
	owner_id: {type: 'string', format: 'uuid'},
	owner_name: { type: 'string' },
	owner_lastname: { type: 'string' },
};

export const listAnimalsSchema = {
	summary: 'animals',
	description: 'animals',
	response: {
		200: {
			type: 'array',
			items: {
				properties: animalSchema
			}
		}
	}
};

export const deleteAnimalSchema = {
	summary: 'delete animal',
	description: 'delete animal',
	params: {
		type: 'object',
		required: ['_id'],
		properties: {
			_id: { type: 'string' }
		}
	},
	response: {
		200: {
			type: 'boolean'
		}
	}
};
