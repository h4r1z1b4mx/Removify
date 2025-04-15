"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/upload', () => {
});
router.get('/status/:image_id', () => {
});
router.get('/download/:image_id', () => {
});
router.get('/images', () => {
});
exports.mainRouter = router;
