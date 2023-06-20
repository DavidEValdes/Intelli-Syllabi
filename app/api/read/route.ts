import { NextRequest, NextResponse } from 'next/server'
import { PineconeClient} from '@pinecone-database/pinecone'
import {
        queryVectorStoreAndLLM,
} from '../../../utils'
import{ index } from '../../../config'

export async function POST(req: NextRequest){
    const body = await req.json()
    const client = new PineconeClient()
    await client.init({
        apiKey: process.env.PINECONE_API_KEY || '',
        environment: process.env.PINECONE_ENVIORNMENT || ''
    })
    const text = await queryVectorStoreAndLLM(client, index, body)
    return NextResponse.json({
        data: text
    })
}