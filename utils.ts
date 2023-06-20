import {OpenAIEmbeddings} from 'langchain/embeddings/openai'
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter'
import {OpenAI} from 'langchain/llms/openai'
import {loadQAStuffChain} from 'langchain/chains'
import {Document} from 'langchain/document'
import { timeout } from './config'

export const createIndex = async (client,indexName, vectorDimension) =>
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

export const updatePinecone = async (client, indexName, docs) =>
{
    const index = client.Index(indexName);
    console.log('found pinecone index: ${indexName}');

    for(const doc of docs)
    {
        console.log('processing: ${doc.metadata.source}');
        const textPath = doc.metadata.source;
        const text = doc.pageContent;
        const textSplitter = new RecursiveCharacterTextSplitter( {chunkSize:1000,});

        console.log('splitting text');

        const chunks = await textSplitter.createDocuments([text]);

        console.log('text split into ${chunks.length}' chunks);
        console.log('calli');

        const embeddingsArray = await new OpenAIEmbeddings().embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
        );

        const batchSize = 1000;
        let batch:any = [];
        for (let i = 0; i < chunks.length; i++)
        {
            const chunk = chunks[i];
            const vector = 
            {
                id = '${textPath}_${i}',
                values: embeddingsArray[i],
                metadata:
                {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    txtPath: textPath,
                },
            };
            batch = [...batch,vector]

            if(batch.length === batchSize || i = chunks.length-1)
            {
                await index.upsert(
                {
                    upsertRequest:
                    {
                        vectors: batch,
                    },
                });
                batch = [];
            }
        }
    }
}
