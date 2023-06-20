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

export async function POST(){

    //Change loader to support different input route

    const loader = new DirectoryLoader('./documents', {
        ".txt": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),

        //What we will be using
        ".pdf": (path) => new PDFLoader(path)

    })

        const docs= await loader.load()
        const vectorDimensions = 1536

        const client = new PineconeClient()
        await client.init({
            apiKey: process.env.PINECONE_API_KEY || '',
            environment: process.env.PINECONE_ENVIRONMENT || ''
        })

        try{
            await createIndex(client, index, vectorDimensions)
            await updatePinecone(client, index, docs)
        } catch(err){
            console.log('error: ', err)
        }

        return NextResponse.json({
            data: 'successfully created index and loaded data into pinecone'
        })
}
