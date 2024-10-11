import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { BASE_URL } from '../../util/constants';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Algo } from '../../types/types';

export default function AlgorithmDetails(){

  const { slug } = useParams()
  const [algorithm, setAlgorithm] = useState<Algo>({
    id: "",
    title: "",
    content: "",
    code: "",
    tags: []
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => { 
    const fetchAlgorithm = async () => {
      setLoading(true)
      try{
        const res = await fetch(BASE_URL + `/algorithms/${slug}`)
        const data = await res.json()
        setAlgorithm(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlgorithm()
  }, []) 

  function convertUnicode(input: string): string {
    return input?.replace(/\\+u([0-9a-fA-F]{4})/g, (a: string, b: string) =>
      String.fromCharCode(parseInt(b, 16)));
  }

  return (
    <div className="md:px-12 md:py-4 px-4 py-4 md:mt-14 mt-20">
      { !loading ? 
      <div className="text-black [&_pre]:whitespace-pre-wrap">
        <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-3xl lg:text-4xl">{algorithm.title}</h1>
        <div dangerouslySetInnerHTML={{__html: algorithm.content}}/>
        <br/>
        <span className='font-bold text-lg'>Solution:</span>
        <SyntaxHighlighter language="javascript" style={nightOwl}>
          {convertUnicode(algorithm.code)}
        </SyntaxHighlighter>
      </div> :
      null }
    </div>
  )
}
