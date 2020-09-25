const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const router = Router();
const middleware = require('./middleware');
const entityList = require("../models/list");

// /api/data/read
router.post(
    "/read",
    middleware,
    [
        check("entity").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные запроса"
                });
            }

            const { entity } = req.body;

            const dbClass = entityList[entity];

            if (!dbClass) {
                return res.status(400).json({ message: "Данной сущности не существует" });
            }

            const data = await dbClass.find();

            res.status(200).json({ data });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

// /api/data/create
router.post(
    "/create",
    middleware,
    [
        check("entity").exists(),
        check("data").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные запроса"
                });
            }

            const { entity, data } = req.body;

            const dbClass = entityList[entity];

            if (!dbClass) {
                return res.status(400).json({ message: "Данной сущности не существует" });
            }

            const created = await dbClass.create(data);

            res.status(201).json({ ...created._doc });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

// /api/data/delete
router.post(
    "/delete",
    middleware,
    [
        check("entity").exists(),
        check("id").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные запроса"
                });
            }

            const { entity, id } = req.body;

            const dbClass = entityList[entity];

            if (!dbClass) {
                return res.status(400).json({ message: "Данной сущности не существует" });
            }

            const deleted = await dbClass.findOne({_id: id});
            await dbClass.deleteOne({_id: id});

            res.status(200).json({ ...deleted._doc });
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
);

module.exports = router;
