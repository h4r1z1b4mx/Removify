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
exports.mainRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../db");
const fs_1 = __importDefault(require("fs"));
const aws_1 = require("../utils/aws");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const rg_1 = require("../utils/rg");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
//@ts-ignore
router.post('/upload', middleware_1.authMiddleware, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.id;
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }
        // Create filenames and paths
        const originalFilename = req.file.originalname;
        const uniqueSuffix = (0, uuid_1.v4)();
        const fileExt = path_1.default.extname(originalFilename);
        const newFileName = `${uniqueSuffix}${fileExt}`;
        const baseDir = path_1.default.join(__dirname, "..", "image", userId);
        const originalDir = path_1.default.join(baseDir, "original");
        const bgDir = path_1.default.join(baseDir, "bg");
        fs_1.default.mkdirSync(originalDir, { recursive: true });
        fs_1.default.mkdirSync(bgDir, { recursive: true });
        // Write original file to disk temporarily
        const originalLocalPath = path_1.default.join(originalDir, newFileName);
        console.log('Original Local Path', originalLocalPath);
        fs_1.default.writeFileSync(originalLocalPath, req.file.buffer);
        // Process image and save to bg path
        const processedLocalPath = path_1.default.join(bgDir, newFileName);
        console.log('Processed Local Path', processedLocalPath);
        yield (0, rg_1.removeBackgroundFromImage)(originalLocalPath, processedLocalPath);
        // Read processed file as buffer
        const processedBuffer = fs_1.default.readFileSync(processedLocalPath);
        // Upload to S3
        const originalS3Url = yield (0, aws_1.uploadFile)(`original/${userId}/${newFileName}`, req.file.buffer);
        const bgS3Url = yield (0, aws_1.uploadFile)(`bg/${userId}/${newFileName}`, processedBuffer);
        // Save to DB
        let userItem = yield db_1.prisma.userItem.findFirst({
            where: {
                userid: userId
            }
        });
        if (!userItem) {
            userItem = yield db_1.prisma.userItem.create({
                data: {
                    userid: userId
                }
            });
        }
        // Save to DB
        const imageData = yield db_1.prisma.images.create({
            data: {
                userid: userItem.id, // Connect to UserItem instead of User
                original_filename: originalFilename,
                processed_url: bgS3Url,
                status: "Done"
            }
        });
        return res.status(200).json(imageData);
    }
    catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Image upload failed", error });
    }
}));
//@ts-ignore
router.get('/status/:image_id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { image_id } = req.params;
    const image = yield db_1.prisma.images.findUnique({
        where: {
            id: image_id
        }, select: {
            status: true
        }
    });
    if (!image) {
        res.status(400).json({ message: "Image not found" });
    }
    return res.status(200).json(image);
}));
//@ts-ignore
router.get('/download/:image_id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { image_id } = req.params;
    const image = yield db_1.prisma.images.findUnique({
        where: {
            id: image_id
        }
    });
    if (!image) {
        res.status(400).json({ message: "Image not found" });
    }
    return res.status(200).json(image);
}));
//@ts-ignore
router.get('/images', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const userId = req.id;
        // Get images from S3 bucket's bg folder for this user
        const s3Images = yield (0, aws_1.listFiles)(`bg/${userId}/`);
        // Get database records
        const userItem = yield db_1.prisma.userItem.findFirst({
            where: {
                userid: userId
            }
        });
        if (!userItem) {
            return res.status(200).json({
                s3_images: s3Images,
                db_images: []
            });
        }
        const dbImages = yield db_1.prisma.images.findMany({
            where: {
                userid: userItem.id
            },
            orderBy: {
                createdid: 'desc'
            }
        });
        // Combine both sources of data
        const response = {
            s3_images: s3Images,
            db_images: dbImages
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({
            message: "Failed to fetch images",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}));
//@ts-ignore
router.get('/images/:image_id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const { image_id } = req.params;
    const image = yield db_1.prisma.images.findUnique({
        where: {
            id: image_id
        }
    });
    if (!image) {
        res.status(400).json({ message: "Image not found" });
    }
    return res.status(200).json(image);
}));
exports.mainRouter = router;
