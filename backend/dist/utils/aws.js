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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
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
