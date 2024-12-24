import express from 'express';
import { createNotes, deleteAllNotes, deleteNotes, getAllNotes, updateNotes } from '../controllers/NotesController.js';
import { authenticateToken } from '../middleWares/userAuth.js';

const router = express.Router();

// Route to create a note
router.post('/create', authenticateToken, createNotes);
router.put('/update/:id', authenticateToken, updateNotes); // Update a specific note
router.delete('/delete/:id', authenticateToken, deleteNotes); // Delete a specific note
router.delete('/delete-all', authenticateToken, deleteAllNotes); // Delete all notes
router.get('/list', authenticateToken, getAllNotes);
export default router;
