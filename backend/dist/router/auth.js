"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedBody = types_1.signUpSchema.safeParse(body);
    if (!parsedBody.success) {
        return res.status(400).json({
            msg: "Invalid body",
        });
    }
    const { firstName, lastName, email, password } = parsedBody.data;
    const userExists = yield db_1.prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (userExists) {
        return res.status(400).json({
            msg: "User already exists",
        });
    }
    const user = yield db_1.prisma.user.create({
        data: {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password
        }
    });
    return res.status(200).json({
        msg: "User created successfully",
    });
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedBody = types_1.signInSchema.safeParse(body);
    if (!parsedBody.success) {
        return res.status(404).json({
            msg: "Invalid Body"
        });
    }
    const { email, password } = parsedBody.data;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            email,
            password
        }
    });
    if (!user) {
        return res.status(404).json({
            "msg": "Credential Invalid"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id
    }, config_1.JWT_PASSWORD);
    return res.json({
        token
    });
}));
//@ts-ignore
router.get('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prisma.user.findFirst({
        where: {
            id
        }, select: {
            firstname: true,
            lastname: true,
            email: true
        }
    });
    res.json({
        user
    });
}));
exports.authRouter = router;
