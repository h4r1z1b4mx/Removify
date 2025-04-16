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
exports.removeBackgroundFromImage = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const form_data_1 = __importDefault(require("form-data"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const removeBackgroundFromImage = (inputPath, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.REMOVEBG_API_KEY; // Set this key in your .env file
    const formData = new form_data_1.default();
    formData.append('image_file', fs_1.default.createReadStream(inputPath));
    formData.append('size', 'auto');
    try {
        const response = yield (0, axios_1.default)({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            headers: Object.assign({ 'X-Api-Key': apiKey }, formData.getHeaders()),
            responseType: 'arraybuffer'
        });
        const imageBuffer = response.data;
        fs_1.default.writeFileSync(outputPath, Buffer.from(imageBuffer));
        console.log('Background removed successfully!');
    }
    catch (error) {
        console.error('Error removing background:', error.message);
    }
});
exports.removeBackgroundFromImage = removeBackgroundFromImage;
