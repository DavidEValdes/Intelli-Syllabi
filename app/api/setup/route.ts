import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { PineconeClient } from '@pinecone-database/pinecone';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  createIndex,
  updatePinecone
} from '../../../utils';
import { index } from '../../../config';
import { S3Client } from '@aws-sdk/client-s3';
import { TextractClient, StartDocumentAnalysisCommand, GetDocumentAnalysisCommand } from '@aws-sdk/client-textract';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import express from 'express';
import { post as uploadPost } from '../upload';

const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const textract = new TextractClient({
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const bucketName = 'syllabus-bucket';

const uploadToS3 = async (file: any) => {
  const { originalname, buffer } = file;

  const params = {
    Bucket: 'syllabus-bucket',
    Key: originalname,
    Body: buffer,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    console.log('File uploaded successfully to S3');
    return true;
  } catch (error) {
    console.error('Error uploading file to S3', error);
    throw error;
  }
};

async function startTextractJob(bucketName: string, keyName: string) {
  const params = {
    DocumentLocation: {
      S3Object: {
        Bucket: bucketName,
        Name: keyName,
      },
    },
    FeatureTypes: ['FORMS']
  };

  try {
    const data = await textract.send(new StartDocumentAnalysisCommand(params));
    return data.JobId;
  } catch (err) {
    console.error('Error in startTextractJob', err);
    throw err;
  }
}

async function getTextractJobResults(jobId: string) {
  const params = {
    JobId: jobId
  };

  let processing = false;
  do {
    let data;
    try {
      data = await textract.send(new GetDocumentAnalysisCommand(params));
    } catch (err) {
      console.error('Error in getTextractJobResults', err);
      throw err;
    }

    if (data.JobStatus === 'SUCCEEDED') {
      // Get raw text from the blocks
      let rawText = '';
      let formData = '';

      for (const block of data.Blocks) {
        if (block.BlockType === 'LINE' || block.BlockType === 'WORD') {
          rawText += ' ' + block.Text;
        }

        // Extract form data as raw text
        if (block.BlockType === 'KEY_VALUE_SET') {
          if (block.EntityTypes.includes('KEY')) {
            // Get the associated VALUE block
            const valueBlock = data.Blocks.find(
              b => b.Id === block.Relationships[0].Ids[0]
            );

            formData += `${block.Text}: ${valueBlock.Text}\n`;
          }
        }
      }

      return { rawText, formData };
    }

    if (data.JobStatus === 'FAILED') {
      console.error('Textract job failed', data.StatusMessage);
      throw new Error('Textract job failed');
    }

    if (!processing) {
      processing = true;
      console.log('Processing Textract job...');
    }

    // If the job status is not SUCCEEDED or FAILED, it's still running. Wait a bit before checking again.
    await new Promise(r => setTimeout(r, 5000));
  } while (true);
}



const apiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.body) {
      console.error('No file received');
      return res.status(400).json({ error: 'No file received' });
    }

    const file = req.body;
    await uploadToS3(file);
  const vectorDimensions = 1536;

  const client = new PineconeClient();
  client.projectName = '9e1ca4d';

  await client.init({
    apiKey: process.env.PINECONE_API_KEY || '',
    environment: process.env.PINECONE_ENVIRONMENT || '',
  });
  

  try {
    await createIndex(client, index, vectorDimensions);

    for (const doc of file) {
      const filePath = doc.metadata.source;
      if (!filePath) {
        console.error('File path is undefined');
        throw new Error('File path is undefined');
      }
      const s3Path = await uploadToS3(filePath);
      const jobId = await startTextractJob(bucketName, s3Path.toString() || ''); // Provide a default empty string value
      const textractResults = await getTextractJobResults(jobId || ''); // Provide a default empty string value

      // Combine the raw text and form data
      doc.pageContent = textractResults.rawText + '\n\nForm Data:\n' + textractResults.formData;

      // Update Pinecone
      await updatePinecone(client, index, [doc]);
    }
  } catch (err) {
    console.log('error: ', err);
  }

  return res.json({
    data: 'Successfully created index and loaded data into Pinecone',
  });
};

export default apiRoute;