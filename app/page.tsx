'use client'
 
import{
  useState
} from 'react'

export default function Home()
{
  const [query, setQuery] = useState('')
  const [result,setResult] = useState('')
  const [loading, setLoading] = useState(false)


async function createIndexAndEmbeddings()
{
    try
    {
        const result = await fetch('/api/setup', {
            method: "POST"
        })
        const json = await result.json()
        console.log('result: ', json);
    } 
    catch (err){
    console.log('err', err)
  }
}


async function sendQuery()
{
    if(!query) return
    setResult('')
    setLoading(true)
    try
    {
        const result = await fetch('/api/read',
        {
            method:"POST",
            body: JSON.stringify(query),
        })
        const json = await result.json()
        setResult(json.data)
        setLoading(false)
    } 

    catch(err)
    {
        console.log('err', err)
        setLoading(false) 
    }
}


  return(
    <main className = "flex min-h screen flex-col items-center justify-between p-24">

    <input
      className = 'text-black px-2 py-1'
      onChange={e => setQuery(e.target.value)}
      />
      <button className = "px-7 py-1 rounded-2x1 bg-white text-black mt-2 mb-2" onClick= {sendQuery}>
        Ask the compiling cowboys
      </button>
      {
        loading && <p> Asking the Cowboys ...</p>
      }
      {
        result && <p>{result}</p>
      }
      <button onClick ={createIndexAndEmbeddings}>send to pinecone</button>
    </main>
  )

}
