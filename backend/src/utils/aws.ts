import { S3 } from 'aws-sdk';

const s3 = new S3({
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
export const uploadFile = async (fileName: string, fileBuffer: Buffer): Promise<string> => {
    const response = await s3.upload({
        Body: fileBuffer,
        Bucket: 'removify',
        Key: fileName,
        ContentType: 'image/png' // Or detect dynamically if needed
    }).promise();

    return response.Location; // URL to access the uploaded file
};
