import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

export const removeBackgroundFromImage = async (inputPath: string, outputPath: string ) => {
  const apiKey = process.env.REMOVEBG_API_KEY; // Set this key in your .env file
  const formData = new FormData();
  formData.append('image_file', fs.createReadStream(inputPath));
  formData.append('size', 'auto');

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      headers: {
        'X-Api-Key': apiKey,
        ...formData.getHeaders()
      },
      responseType: 'arraybuffer'
    });

    const imageBuffer = response.data as unknown as ArrayBuffer;
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    console.log('Background removed successfully!');
  } catch (error: any) {
    console.error('Error removing background:', error.message);
  }
};

