import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {OpenAI} from 'langchain/llms/openai'
import {loadQAStuffChain} from 'langchain/chains'
import {Document} from 'langchain/document'
import { timeout } from './config'

export const createIndex = async (client,indexName, vectorDimension)=>
{
    console.log('testing "${indexName}"...');
    const Indexes = await client.listIndexes();

    if(!Indexes.includes(indexName))
    {
        console.log('creating "${indexName}"...');

        await client.createIndex(
        {
            createRequest:
            {
                name: indexName,
                dimension: vectorDimension,
                metric: 'cosine',
            },
        });
        await new Promise((resolve) => setTimeout(resolve,timeout));
    }
    else
    {
        console.log('"${indexName}" already exists');
    }
}

