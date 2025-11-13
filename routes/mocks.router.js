const express = require('express');
const router = express.Router();
const faker = require('faker');
const { generateUsers, generatePets } = require('../utils/mocking');
const User = require('../models/User');
const Pet = require('../models/Pet');

router.get('/mockingpets', (req, res) => {
  const pets = [];
  const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster'];
  const breeds = {
    dog: ['Labrador', 'Golden Retriever', 'Bulldog', 'Beagle', 'Poodle'],
    cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'],
    bird: ['Canary', 'Parrot', 'Cockatiel', 'Finch', 'Lovebird'],
    rabbit: ['Dutch', 'Lop', 'Angora', 'Rex', 'Lionhead'],
    hamster: ['Syrian', 'Dwarf', 'Roborovski', 'Chinese', 'European']
  };
  
  for (let i = 0; i < 50; i++) {
    const selectedSpecies = species[Math.floor(Math.random() * species.length)];
    const selectedBreed = breeds[selectedSpecies][Math.floor(Math.random() * breeds[selectedSpecies].length)];
    
    pets.push({
      name: faker.name.firstName(),
      species: selectedSpecies,
      breed: selectedBreed,
      age: faker.datatype.number({ min: 1, max: 15 })
    });
  }
  
  res.json({ status: 'success', payload: pets });
});

router.get('/mockingusers', async (req, res) => {
  try {
    const quantity = parseInt(req.query.quantity) || 50;
    const users = await generateUsers(quantity);
    res.json({ status: 'success', payload: users });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/generateData', async (req, res) => {
  try {
    const { users: usersQuantity, pets: petsQuantity } = req.body;
    
    if (!usersQuantity || !petsQuantity) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Se requieren los parámetros "users" y "pets"' 
      });
    }
    
    const usersData = await generateUsers(parseInt(usersQuantity));
    const petsData = generatePets(parseInt(petsQuantity));
    
    const insertedUsers = await User.insertMany(usersData);
    const insertedPets = await Pet.insertMany(petsData);
    
    res.json({ 
      status: 'success', 
      message: 'Datos generados e insertados correctamente',
      payload: {
        users: insertedUsers.length,
        pets: insertedPets.length
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;

