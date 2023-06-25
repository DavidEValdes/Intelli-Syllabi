'use client'
 
import{
  useState
} from 'react'
import React from "react";
import { About } from "./icons/About";
import { Line1 } from "./icons/Line1";
import { Rectangle4 } from "./icons/Rectangle4";
import { MaterialSymbolsCheck } from "./icons/MaterialSymbolsCheck";
import { MaterialSymbols } from "./components/MaterialSymbols";
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
        <MaterialSymbols />
        <MaterialSymbolsCheck
          style={{
            height: "24px",
            left: "0",
            position: "absolute",
            top: "0",
            width: "24px",
          }}
        />
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
        <img
          className="contact"
          alt="Contact"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/contact.png"
        />
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
        <p className="p">
          Harnessing the power of AI, Intelli-syllabi transforms your complex syllabus into a personalized, streamlined
          study guide
        </p>
        <div className="div-wrapper">
          <div className="text-wrapper-2">Get Started</div>
        </div>
        <img
          className="img"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/64979aad6a8025aba06a7fec/img/frame-4.png"
        />
        <img
          className="frame-2"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/frame-13.png"
        />
        <img
          className="frame-3"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/frame-12.png"
        />
        <div className="overlap-group">
          <img
            className="frame-4"
            alt="Frame"
            src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/frame-5.png"
          />
          <div className="frame-5">
            <div className="text-wrapper-3">Homework Dates</div>
          </div>
          <img
            className="frame-6"
            alt="Frame"
            src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/frame-5.png"
          />
          <div className="frame-7">
            <div className="text-wrapper-4">Professor Contact</div>
          </div>
        </div>
        <img
          className="frame-8"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/frame-16.png"
        />
        <div className="frame-9">
          <div className="text-wrapper-5">Office Hours</div>
        </div>
        <div className="add-your-own-wrapper">
          <h1 className="add-your-own">
            <span className="span">+</span>
            <span className="text-wrapper-6">&nbsp;&nbsp;Add Your Own</span>
          </h1>
        </div>
        <img
          className="frame-10"
          alt="Frame"
          src="https://anima-uploads.s3.amazonaws.com/projects/64975e87a1b0005e5700e7c4/releases/6497a70ee47f25472fae2123/img/frame-17.png"
        />
        <div className="overlap">
          <Rectangle4
            style={{
              height: "1071px",
              left: "0",
              position: "absolute",
              top: "70px",
              width: "1084px",
            }}
          />
          <div className="frame-11">
            <div className="text-wrapper-7">ABOUT</div>
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
        <div className="overlap-2">
          <Rectangle4
            style={{
              height: "1218px",
              left: "0",
              position: "absolute",
              top: "48px",
              width: "1084px",
            }}
          />
          <div className="frame-12">
            <div className="text-wrapper-8">CONTACT</div>
          </div>
          <div className="rectangle-2" />
          <div className="text-wrapper-9">Email Address</div>
          <Line1
            style={{
              height: "1px",
              left: "122px",
              objectFit: "cover",
              position: "absolute",
              top: "366px",
              width: "681px",
            }}
          />
          <div className="rectangle-3" />
          <div className="text-wrapper-10">Message:</div>
          <div className="rectangle-4" />
          <div className="text-wrapper-11">Send</div>
        </div>
        <div className="rectangle-5" />
      </div>
    </div>
)
}
