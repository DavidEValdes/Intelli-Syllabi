'use client'
 
import{
  useState
} from 'react'

export default function Home()
{
  const [query, setQuery] = useState('')
  const [result,setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [preferences, setPreferences] = useState({
    examDates: false,
    homeworkDates: false,
    professorContact: false,
    professorName: false,
  })

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleCheckboxChange = (e) => {
    setPreferences(prevState => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }))
  }

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

return (
  <main className="flex flex-col items-center justify-between p-24 space-y-6">
     <input
      className = 'text-black px-2 py-1'
      onChange={e => setQuery(e.target.value)}
      />
      <button className = "px-7 py-1 rounded-2x1 bg-white text-black mt-2 mb-2" onClick= {sendQuery}>
        Ask the compiling cowboys
      </button>
    <h1 className="text-4xl font-bold">Intelli Syllabi</h1>
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file-upload">
        Upload a document
      </label>
      <input id="file-upload" type="file" onChange={handleFileChange} />
    </div>
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">What would you like to see?</h2>
      <label>
        <input type="checkbox" name="examDates" onChange={handleCheckboxChange} />
        Exam Dates
      </label>
      <label>
        <input type="checkbox" name="homeworkDates" onChange={handleCheckboxChange} />
        Homework Dates
      </label>
      <label>
        <input type="checkbox" name="professorContact" onChange={handleCheckboxChange} />
        Professor's Preferred Contact
      </label>
      <label>
        <input type="checkbox" name="professorName" onChange={handleCheckboxChange} />
        Professor's Name
      </label>
    </div>
    <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={sendQuery}>
      Submit
    </button>
    {loading && <p>Processing...</p>}
    {result && <p>{result}</p>}
    <button onClick={createIndexAndEmbeddings}>Send to Pinecone</button>
  </main>
)
}
