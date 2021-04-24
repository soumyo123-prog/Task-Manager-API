const express = require('express');
const Task = require('../../models/tasks');
const checkValidity = require('../../utility/updateValidation');
const auth = require('../../middleware/auth');

const router = new express.Router();

// 4. For adding a new task
router.post('/tasks',auth,async (req,res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

// 5. For reading all tasks
router.get('/tasks',auth,async (req,res) => {
    try {
        const sort = {};
        if (req.query.sortBy) {
            const splitted = req.query.sortBy.split(':');
            sort[splitted[0]] = splitted[1] === 'asc' ? 1 : -1;
        }

        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : req.query.limit ? parseInt(req.query.limit) : 5,
                skip : 0 || parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})

// 6. For reading a single task by id
router.get('/tasks/:id',auth,async (req,res) => {
    try {
        const _id = req.params.id;
        const task = await Task.findOne({
            _id : _id,
            owner : req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Updating a task
router.patch('/tasks/:id',auth, async (req,res) => {
    const canUpdate = ["description","completed"];
    const validUpdate = checkValidity(req,canUpdate);

    if (!validUpdate) {
        return res.status(400).send({
            error : "Invalid update parameters"
        })
    }

    try {
        const task = await Task.findOne({
            _id : req.params.id,
            owner : req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }

        Object.keys(req.body).forEach(el => task[el] = req.body[el]);
        await task.save();

        res.send(task);

    } catch (error) {
        res.status(500).send(error);
    }
})

// For deleting a task
router.delete('/tasks/:id',auth,async (req,res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id : req.params.id,
            owner : req.user._id
        })
        
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);

    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;