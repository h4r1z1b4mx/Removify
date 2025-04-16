import { Router } from "express";
import { authMiddleware } from "../middleware";
import multer from "multer";
import { prisma } from "../db";
import fs from "fs";
import { uploadFile } from "../utils/aws";
import {v4 as uuidv4} from "uuid";
import path from "path";
import { removeBackgroundFromImage } from "../utils/rg";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


//@ts-ignore
router.post('/upload', authMiddleware, upload.single("image"), async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.id as string;
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        // Create filenames and paths
        const originalFilename = req.file.originalname;
        const uniqueSuffix = uuidv4();
        const fileExt = path.extname(originalFilename);
        const newFileName = `${uniqueSuffix}${fileExt}`;

        const baseDir = path.join(__dirname, "..", "image", userId);
        const originalDir = path.join(baseDir, "original");
        const bgDir = path.join(baseDir, "bg");

        fs.mkdirSync(originalDir, { recursive: true });
        fs.mkdirSync(bgDir, { recursive: true });

        // Write original file to disk temporarily
        const originalLocalPath = path.join(originalDir, newFileName);
        fs.writeFileSync(originalLocalPath, req.file.buffer);

        // Process image and save to bg path
        const processedLocalPath = path.join(bgDir, newFileName);
        await removeBackgroundFromImage(originalLocalPath, processedLocalPath);

        // Read processed file as buffer
        const processedBuffer = fs.readFileSync(processedLocalPath);

        // Upload to S3
        const originalS3Url = await uploadFile(`original/${newFileName}`, req.file.buffer);
        const bgS3Url = await uploadFile(`bg/${newFileName}`, processedBuffer);

        // Save to DB
        let userItem = await prisma.userItem.findFirst({
            where: {
                userid: userId
            }
        });

        if (!userItem) {
            userItem = await prisma.userItem.create({
                data: {
                    userid: userId
                }
            });
        }

        // Save to DB
        const imageData = await prisma.images.create({
            data: {
                userid: userItem.id,  // Connect to UserItem instead of User
                original_filename: originalFilename,
                processed_url: bgS3Url,
                status: "Done"
            }
        });

        return res.status(200).json(imageData);

    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Image upload failed", error });
    }
});
//@ts-ignore
router.get('/status/:image_id',authMiddleware , async(req, res) => {
    //@ts-ignore
    const {image_id} = req.params ;
    const image = await prisma.images.findUnique({
        where:{
            id:image_id
        },select:{
            status:true
        }
    })
    if(!image){
        res.status(400).json({message:"Image not found"})
    }
    return res.status(200).json(image)
});

//@ts-ignore
router.get('/download/:image_id',authMiddleware, async(req, res) => {
    //@ts-ignore
    const {image_id} = req.params ;
    const image = await prisma.images.findUnique({
        where:{
            id:image_id
        }
    })
    if(!image){
        res.status(400).json({message:"Image not found"})
    }
    return res.status(200).json(image)
});

//@ts-ignore
router.get('/images',authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id ;
    const images = await prisma.images.findMany({
        where:{
            userid:id
        }
    })
    res.status(200).json(images)
});

export const mainRouter = router;