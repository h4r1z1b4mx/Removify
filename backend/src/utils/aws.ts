import { S3 } from 'aws-sdk';
import path from 'path';
import fs from 'fs';

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
export const listFiles = async (prefix: string): Promise<string[]> => {
    const params = {
        Bucket: 'removify',
        Prefix: prefix
    };

    const response = await s3.listObjectsV2(params).promise();
    
    return response.Contents?.map(object => {
        return s3.getSignedUrl('getObject', {
            Bucket: 'removify',
            Key: object.Key,
            Expires: 3600 // URL expires in 1 hour
        });
    }) || [];
};

export const getDownloadUrl = async (userId: string, imageId: string): Promise<string> => {
    const key = `bg/${userId}/${imageId}`;

    const params = {
        Bucket: 'removify',
        Key: key,
        Expires: 60 * 5,
    };

    return s3.getSignedUrl('getObject', params);
};

export const getImage = async (userId: string, imageId: string): Promise<string> => {
    const key = `bg/${userId}/${imageId}.jpg`;
    const localFilePath = path.join(__dirname, 'downloaded_image.jpg'); // Save image with its ID
    console.log('Looking for S3 key:', key);
    console.log('Saving to local path:', localFilePath);
    const params = {
      Bucket: 'removify',
      Key: key,
    };
  
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(localFilePath);
  
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
  };