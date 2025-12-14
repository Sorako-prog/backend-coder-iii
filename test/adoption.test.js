const chai = require('chai');
const chaiHttp = require('chai-http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Adoption Router Tests', function () {
    this.timeout(30000);
    let mongoServer;
    let testUser;
    let testPet;
    let testAdoption;

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        await mongoose.connect(mongoUri);
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Adoption.deleteMany({});

        testUser = await User.create({
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'juan@test.com',
            age: 30,
            password: 'hashedpassword123',
            role: 'user',
            pets: []
        });

        testPet = await Pet.create({
            name: 'Max',
            species: 'dog',
            breed: 'Labrador',
            age: 3
        });
    });

    describe('GET /api/adoptions', () => {
        it('Debe retornar un array vacío cuando no hay adopciones', async () => {
            const res = await chai.request(app).get('/api/adoptions');

            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.be.an('array');
            expect(res.body.payload).to.have.lengthOf(0);
        });

        it('Debe retornar todas las adopciones existentes', async () => {
            testAdoption = await Adoption.create({
                owner: testUser._id,
                pet: testPet._id
            });

            const res = await chai.request(app).get('/api/adoptions');

            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.be.an('array');
            expect(res.body.payload).to.have.lengthOf(1);
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debe retornar una adopción por ID', async () => {
            testAdoption = await Adoption.create({
                owner: testUser._id,
                pet: testPet._id
            });

            const res = await chai.request(app).get(`/api/adoptions/${testAdoption._id}`);

            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.payload).to.have.property('_id');
        });

        it('Debe retornar 404 si la adopción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await chai.request(app).get(`/api/adoptions/${fakeId}`);

            expect(res).to.have.status(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('Adopción no encontrada');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debe crear una adopción exitosamente', async () => {
            const res = await chai.request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(res).to.have.status(201);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Adopción creada exitosamente');
            expect(res.body.payload).to.have.property('_id');

            const updatedPet = await Pet.findById(testPet._id);
            expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());

            const updatedUser = await User.findById(testUser._id);
            expect(updatedUser.pets).to.have.lengthOf(1);
        });

        it('Debe retornar 404 si el usuario no existe', async () => {
            const fakeUserId = new mongoose.Types.ObjectId();
            const res = await chai.request(app)
                .post(`/api/adoptions/${fakeUserId}/${testPet._id}`);

            expect(res).to.have.status(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('Usuario no encontrado');
        });

        it('Debe retornar 404 si la mascota no existe', async () => {
            const fakePetId = new mongoose.Types.ObjectId();
            const res = await chai.request(app)
                .post(`/api/adoptions/${testUser._id}/${fakePetId}`);

            expect(res).to.have.status(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('Mascota no encontrada');
        });

        it('Debe retornar 400 si la mascota ya tiene dueño', async () => {
            testPet.owner = testUser._id;
            await testPet.save();

            const res = await chai.request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);

            expect(res).to.have.status(400);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('La mascota ya tiene un dueño');
        });
    });

    describe('DELETE /api/adoptions/:aid', () => {
        it('Debe eliminar una adopción exitosamente', async () => {
            testAdoption = await Adoption.create({
                owner: testUser._id,
                pet: testPet._id
            });
            testPet.owner = testUser._id;
            await testPet.save();
            testUser.pets.push(testPet._id);
            await testUser.save();

            const res = await chai.request(app).delete(`/api/adoptions/${testAdoption._id}`);

            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('success');
            expect(res.body.message).to.equal('Adopción eliminada exitosamente');

            const deletedAdoption = await Adoption.findById(testAdoption._id);
            expect(deletedAdoption).to.be.null;

            const updatedPet = await Pet.findById(testPet._id);
            expect(updatedPet.owner).to.be.null;
        });

        it('Debe retornar 404 si la adopción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await chai.request(app).delete(`/api/adoptions/${fakeId}`);

            expect(res).to.have.status(404);
            expect(res.body.status).to.equal('error');
            expect(res.body.message).to.equal('Adopción no encontrada');
        });
    });
});
