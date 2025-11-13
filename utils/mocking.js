const bcrypt = require('bcrypt');
const faker = require('faker');
const mongoose = require('mongoose');

const generateUsers = async (quantity) => {
  const users = [];
  const hashedPassword = await bcrypt.hash('coder123', 10);
  
  for (let i = 0; i < quantity; i++) {
    const role = Math.random() > 0.5 ? 'admin' : 'user';
    
    const user = {
      _id: new mongoose.Types.ObjectId(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      age: faker.datatype.number({ min: 18, max: 80 }),
      password: hashedPassword,
      role: role,
      pets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    users.push(user);
  }
  
  return users;
};

const generatePets = (quantity) => {
  const pets = [];
  const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster'];
  const breeds = {
    dog: ['Labrador', 'Golden Retriever', 'Bulldog', 'Beagle', 'Poodle'],
    cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'],
    bird: ['Canary', 'Parrot', 'Cockatiel', 'Finch', 'Lovebird'],
    rabbit: ['Dutch', 'Lop', 'Angora', 'Rex', 'Lionhead'],
    hamster: ['Syrian', 'Dwarf', 'Roborovski', 'Chinese', 'European']
  };
  
  for (let i = 0; i < quantity; i++) {
    const selectedSpecies = species[Math.floor(Math.random() * species.length)];
    const selectedBreed = breeds[selectedSpecies][Math.floor(Math.random() * breeds[selectedSpecies].length)];
    
    const pet = {
      _id: new mongoose.Types.ObjectId(),
      name: faker.name.firstName(),
      species: selectedSpecies,
      breed: selectedBreed,
      age: faker.datatype.number({ min: 1, max: 15 }),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    pets.push(pet);
  }
  
  return pets;
};

module.exports = {
  generateUsers,
  generatePets
};

