import { NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import{
    createIndex,
    updatePinecone
} from '../../../utils'
import { index } from '../../../config'
import { Textract } from 'aws-sdk';
import { promises as fs } from 'fs';
import * as openai from 'openai';

interface Document<T> {
    text: string;
    id: string;
    pageContent: string;
    metadata: T;
  }
  
  class TextLoaderWithProtectedPath {
    private path: string;
  
    constructor(path: string) {
      this.path = path;
    }
  
    protected getPath(): string {
      return this.path;
    }
  }
  
  class TextractLoader extends TextLoaderWithProtectedPath {
    constructor(path: string) {
      super(path);
    }
  
    async load(): Promise<Document<Record<string, any>>[]> {
      const textract = new Textract({
        region: 'us-east-2',
        accessKeyId: 'AKIAQ2ZZFTKRBXO5ZYGE',
        secretAccessKey: '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'
      });
  
      const fileBytes = await fs.readFile(this.getPath());
      const response = await textract.detectDocumentText({
        Document: { Bytes: fileBytes }
      }).promise();
  
      const text = response.Blocks?.filter(block => block.BlockType === 'LINE').map(line => line.Text).join('\n') || '';
      const id = this.getPath();  
  
      return [{
        text,
        id,
        pageContent: text,
        metadata: {}
      }];
    }
  
    async loadAndSplit(): Promise<Document<Record<string, any>>[]> {
      const documents = await this.load();
      return documents;
    }
  }
  




  export async function POST() {

    
    const textract = new Textract({
      region: 'us-east-1',
      accessKeyId:'AKIAQ2ZZFTKRBXO5ZYGE',
      secretAccessKey: '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'
    });
  
    
    const loader = new DirectoryLoader('./documents', {
      '.txt': (path) => new TextLoader(path),
      '.md': (path) => new TextLoader(path),
      '.pdf': (path) => new TextractLoader(path)
    });
  
    const docs = await loader.load();
    const vectorDimensions = 1536;
  
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY || '',
      environment: process.env.PINECONE_ENVIRONMENT || ''
    });
  
    try {
      await createIndex(client, index, vectorDimensions);
      await updatePinecone(client, index, docs);
    } catch (err) {
      console.log('error: ', err);
    }
  
    return NextResponse.json({
      data: 'successfully created index and loaded data into pinecone'
    });
  }