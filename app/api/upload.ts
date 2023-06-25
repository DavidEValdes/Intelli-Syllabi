import { NextApiRequest, NextApiResponse } from 'next';
import multer, { FileFilterCallback } from 'multer';
import { Request, Express } from 'express';
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadToS3 = async (file: Express.Multer.File) => {
  const { originalname, buffer } = file;

  const params = {
    Bucket: 'syllabus-bucket',
    Key: originalname,
    Body: buffer,
  };

  try {
    await s3.upload(params).promise();
    console.log('File uploaded successfully to S3');
    return true;
  } catch (error) {
    console.error('Error uploading file to S3', error);
    throw error;
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const post = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const uploadHandler = upload.single('file');
    await new Promise<void>((resolve, reject) => {
      uploadHandler(req as any, res as any, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    const file = (req as any).file;

    // Send the uploaded file to the S3 bucket for processing
    await uploadToS3(file);

    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error in file upload', error);
    return res.status(500).json({ error: 'File upload failed' });
  }
};