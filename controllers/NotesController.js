import Notes from '../models/Notes.js';

export const createNotes = async (req, res) => {
    const { notes } = req.body;

    if (!notes) {
        return res.status(400).json({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'All fields are required.' });
    }

    try {
        // Retrieve the user ID from the token
        const userId = req.user.userId;
        console.log('user :', userId);


        // Create the note
        const newNote = await Notes.create({ notes, userId });

        res.status(201).send({ code: process.env.STATUS_CODE_CREATED, message: 'Note created successfully.', data: newNote });
    } catch (error) {
        console.error('Error creating note:', error.message);
        res.status(500).send({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Internal server error.' });
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const userId = req.user.userId; // User ID from token
        const notes = await Notes.findAll({ userId });

        res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, data: notes });
    } catch (error) {
        console.error('Error fetching notes:', error.message);
        res.status(500).json({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Internal server error.' });
    }
};


export const updateNotes = async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    if (!notes) {
        return res.status(400).json({ code: process.env.STATUS_CODE_BAD_REQUEST, error: 'Note content is required.' });
    }

    try {
        const userId = req.user.userId; // User ID from token
        const existingNotes = await Notes.findOne({ where: { id,},userId});

        if (!existingNotes) {
            return res.status(404).json({ code: process.env.STATUS_CODE_NOT_FOUND, error: 'Note not found.' });
        }

        existingNotes.notes = notes;
        await existingNotes.save();

        res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, message: 'Note updated successfully.', data: existingNotes });
    } catch (error) {
        console.error('Error updating note:', error.message);
        res.status(500).json({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Internal server error.' });
    }
};

export const deleteNotes = async (req, res) => {
    const { id } = req.params;

    try {
        const userId = req.user.userId; // User ID from token
        const note = await Notes.findOne({ where: { id },userId});

        if (!note) {
            return res.status(404).json({ code: process.env.STATUS_CODE_NOT_FOUND, error: 'Note not found.' });
        }

        await note.destroy();

        res.status(200).json({ code: process.env.STATUS_CODE_SUCCESS, message: 'Note deleted successfully.' });
    } catch (error) {
        console.error('Error deleting note:', error.message);
        res.status(500).json({ code: process.env.STATUS_CODE_INTERNAL_ERROR, error: 'Internal server error.' });
    }
};

