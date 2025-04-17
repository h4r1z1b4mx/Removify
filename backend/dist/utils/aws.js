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
exports.getImage = exports.getDownloadUrl = exports.listFiles = exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const s3 = new aws_sdk_1.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
/**
 * Uploads a file buffer to S3.
 *
 * @param fileName - The name (with path) of the file in S3 (e.g., "original/abc123.png")
 * @param fileBuffer - The image buffer to upload
 * @returns The public URL of the uploaded file
 */
const uploadFile = (fileName, fileBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield s3.upload({
        Body: fileBuffer,
        Bucket: 'removify',
        Key: fileName,
        ContentType: 'image/png' // Or detect dynamically if needed
    }).promise();
    return response.Location; // URL to access the uploaded file
});
exports.uploadFile = uploadFile;
const listFiles = (prefix) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const params = {
        Bucket: 'removify',
        Prefix: prefix
    };
    const response = yield s3.listObjectsV2(params).promise();
    return ((_a = response.Contents) === null || _a === void 0 ? void 0 : _a.map(object => {
        return s3.getSignedUrl('getObject', {
            Bucket: 'removify',
            Key: object.Key,
            Expires: 3600 // URL expires in 1 hour
        });
    })) || [];
});
exports.listFiles = listFiles;
const getDownloadUrl = (userId, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `bg/${userId}/${imageId}`;
    const params = {
        Bucket: 'removify',
        Key: key,
        Expires: 60 * 5,
    };
    return s3.getSignedUrl('getObject', params);
});
exports.getDownloadUrl = getDownloadUrl;
const getImage = (userId, imageId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `bg/${userId}/${imageId}.jpg`;
    const localFilePath = path_1.default.join(__dirname, 'downloaded_image.jpg'); // Save image with its ID
    console.log('Looking for S3 key:', key);
    console.log('Saving to local path:', localFilePath);
    const params = {
        Bucket: 'removify',
        Key: key,
    };
    return new Promise((resolve, reject) => {
        const fileStream = fs_1.default.createWriteStream(localFilePath);
        s3.getObject(params)
            .createReadStream()
            .on('error', (err) => {
            console.error('S3 download error:', err);
            reject(new Error('Error downloading image from S3'));
        })
            .pipe(fileStream)
            .on('close', () => {
            console.log('Image downloaded to:', localFilePath);
            resolve(localFilePath);
        });
    });
});
exports.getImage = getImage;
