const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const User = require('../models/User');
const Pet = require('../models/Pet');

/**
 * @swagger
 * components:
 *   schemas:
 *     Adoption:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la adopción
 *         owner:
 *           type: string
 *           description: ID del usuario que adopta
 *         pet:
 *           type: string
 *           description: ID de la mascota adoptada
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtiene todas las adopciones
 *     tags: [Adoptions]
 *     responses:
 *       200:
 *         description: Lista de adopciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const adoptions = await Adoption.find().populate('owner').populate('pet');
        res.json({ status: 'success', payload: adoptions });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * @swagger
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtiene una adopción por ID
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción
 *     responses:
 *       200:
 *         description: Adopción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adopción no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:aid', async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.aid).populate('owner').populate('pet');
        if (!adoption) {
            return res.status(404).json({ status: 'error', message: 'Adopción no encontrada' });
        }
        res.json({ status: 'success', payload: adoption });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * @swagger
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     summary: Crea una nueva adopción
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       201:
 *         description: Adopción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Usuario o mascota no encontrados
 *       400:
 *         description: La mascota ya tiene un dueño
 *       500:
 *         description: Error del servidor
 */
router.post('/:uid/:pid', async (req, res) => {
    try {
        const { uid, pid } = req.params;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        const pet = await Pet.findById(pid);
        if (!pet) {
            return res.status(404).json({ status: 'error', message: 'Mascota no encontrada' });
        }

        if (pet.owner) {
            return res.status(400).json({ status: 'error', message: 'La mascota ya tiene un dueño' });
        }

        const adoption = new Adoption({
            owner: uid,
            pet: pid
        });

        await adoption.save();

        pet.owner = uid;
        await pet.save();

        user.pets.push(pid);
        await user.save();

        res.status(201).json({
            status: 'success',
            message: 'Adopción creada exitosamente',
            payload: adoption
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * @swagger
 * /api/adoptions/{aid}:
 *   delete:
 *     summary: Elimina una adopción
 *     tags: [Adoptions]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción
 *     responses:
 *       200:
 *         description: Adopción eliminada exitosamente
 *       404:
 *         description: Adopción no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:aid', async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.aid);
        if (!adoption) {
            return res.status(404).json({ status: 'error', message: 'Adopción no encontrada' });
        }

        const pet = await Pet.findById(adoption.pet);
        if (pet) {
            pet.owner = null;
            await pet.save();
        }

        const user = await User.findById(adoption.owner);
        if (user) {
            user.pets = user.pets.filter(p => p.toString() !== adoption.pet.toString());
            await user.save();
        }

        await Adoption.findByIdAndDelete(req.params.aid);

        res.json({ status: 'success', message: 'Adopción eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
