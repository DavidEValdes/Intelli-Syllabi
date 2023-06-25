'use client'
 
import{
  useState
} from 'react'
import React from "react";
import { About } from "./icons/About";
import { Line1 } from "./icons/Line1";
import { Rectangle4 } from "./icons/Rectangle4";
import "./globals.css";


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
       <div className="index">
      <div className="div">
        <div className="frame">
          <div className="navbar">
            <div className="text-wrapper">Intelli Syllabi</div>
          </div>
        </div>
        <About
          style={{
            height: "21px",
            left: "1017px",
            position: "absolute",
            top: "85px",
            width: "73px",
          }}
        />
        <div className="text-wrapper-2">contact</div>
        <img
          className="list"
          alt="List"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/649760de33e84c01c9c19ed1/img/list-1@2x.png"
        />
        <img
          className="your-personalized"
          alt="Your personalized"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/649760de33e84c01c9c19ed1/img/your-personalized-study-blueprint-in-a-click.png"
        />
        <div className="overlap">
          <p className="p">
            Harnessing the power of AI, Intelli-syllabi transforms your complex syllabus into a personalized,
            streamlined study guide
          </p>
          <div className="div-wrapper">
            <div className="text-wrapper-3">Get Started</div>
          </div>
        </div>
        <img
          className="img"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/64979aad6a8025aba06a7fec/img/frame-4.png"
        />
        <div className="h-1-wrapper">
          <h1 className="h-1">Submit</h1>
        </div>
        <div className="frame-2">
          <div className="text-wrapper-4">Upload File</div>
        </div>
        <img
          className="frame-3"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/649760de33e84c01c9c19ed1/img/frame-5.png"
        />
        <div className="frame-4">
          <div className="text-wrapper-5">Exam Dates</div>
        </div>
        <div className="frame-5">
          <div className="text-wrapper-6">Grading Scale</div>
        </div>
        <div className="frame-6">
          <div className="text-wrapper-7">+ Add your Own</div>
        </div>
        <div className="frame-7">
          <div className="text-wrapper-8">Office Hours</div>
        </div>
        <div className="frame-8">
          <div className="text-wrapper-9">Professor Contact</div>
        </div>
        <div className="overlap-group">
          <Rectangle4
            style={{
              height: "1071px",
              left: "0",
              position: "absolute",
              top: "70px",
              width: "1084px",
            }}
          />
          <div className="frame-9">
            <div className="text-wrapper-10">ABOUT</div>
          </div>
          <div className="rectangle" />
          <p className="intelli-syllabi">
            Intelli Syllabi employs AWS Textract&#39;s Optical Search Recognition combined with OpenAI&#39;s Embeddings
            API to interpret and structure complex data from your syllabus. <br />
            <br />
            Leveraging Pinecone&#39;s advanced vector database and semantic search mechanisms with the combined power of
            LangChain’s framework and OpenAI’s DaVinci 3.5, we precisely contextualize and extract your query-specific
            content
            <br />
            <br />
            The result,
            <br />
            <br /> A streamlined study blueprint that saves both time and paper.
          </p>
        </div>
        <div className="overlap-group-2">
          <Rectangle4
            style={{
              height: "1218px",
              left: "0",
              position: "absolute",
              top: "62px",
              width: "1084px",
            }}
          />
          <div className="frame-10">
            <div className="text-wrapper-11">CONTACT</div>
          </div>
          <div className="rectangle-2" />
          <div className="text-wrapper-12">Email Address</div>
          <Line1
            style={{
              height: "1px",
              left: "122px",
              objectFit: "cover",
              position: "absolute",
              top: "379px",
              width: "681px",
            }}
          />
          <div className="rectangle-3" />
          <div className="text-wrapper-13">Message:</div>
          <div className="rectangle-4" />
          <div className="text-wrapper-14">Send</div>
        </div>
      </div>
    </div>
)
}
