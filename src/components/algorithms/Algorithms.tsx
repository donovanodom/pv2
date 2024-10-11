'use client'

import {useState, useLayoutEffect, useRef, useEffect} from 'react'
import Tags from '../reusable/Tags'
import { filterByTags, initTags } from '../../util/helpers'
import DOMPurify from "isomorphic-dompurify"
import { BASE_URL } from '../../util/constants'
import { Algo, AlgoTag } from '../../types/types'
import { useNavigate } from 'react-router'

export default function Algorithms(){
  
  const [initAlgorithms, setInitAlgorithms] = useState<Algo[]>([])
  const [filteredAlgorithms, setFilteredAlgorithms] = useState<Algo[]>([])
  const [height, setHeight] = useState<number>(0)
  const [toggleTags, setToggleTags] = useState<boolean>(false)
  const [tags, setTags] = useState<AlgoTag[]>([])
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : null)
  const [loading, setLoading] = useState<boolean>(true)

  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleToggle  = () => {
    setToggleTags(() => !toggleTags)
  }

  const handleWindowSizeChange = () => {
    if(typeof window !== "undefined"){
      setWidth(window.innerWidth)
    }
  }

  const handleSelection = (tag: AlgoTag) => {
    const tagIndex = tags.findIndex((curTag) => curTag.name == tag.name)
    const deactivateTag = tags[tagIndex].active
    if(deactivateTag){
      const updatedTag = {...tags[tagIndex], active: false};
      const newTags = [
        ...tags.slice(0, tagIndex),
        updatedTag,
        ...tags.slice(tagIndex + 1)
      ]
      setTags(newTags)
    } else {
      const updatedTag = {...tags[tagIndex], active: true};
      const newTags = [
        ...tags.slice(0, tagIndex),
        updatedTag,
        ...tags.slice(tagIndex + 1)
      ]
      setTags(newTags)
    }
  }

  useEffect(() => { 
    const fetchAlgorithms = async () => {
      setLoading(true)
      try{
        const res = await fetch(BASE_URL + `/algorithms`)
        const data = await res.json()
        setInitAlgorithms(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlgorithms()
  }, [])

  useEffect(() => {
    setTags(() => initTags(initAlgorithms))
    console.log(initAlgorithms)
  }, [initAlgorithms])

  useEffect(() => {
    const selected = tags.some((tag) => tag.active)
    if(selected){
      const newFilteredAlgorithms = filterByTags(filteredAlgorithms,tags)
      setFilteredAlgorithms(newFilteredAlgorithms)
    }else{
      setFilteredAlgorithms(initAlgorithms)
    }
  }, [tags])

  useEffect(() => {
    if(typeof window !== "undefined"){
      window.addEventListener('resize', handleWindowSizeChange)
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange)
      }
    }
}, [])

  useLayoutEffect(() => { 
    if(ref?.current && width){
      const newHeight = ref.current.clientHeight
      setHeight(newHeight)
    }
  }, [width, toggleTags])

  return (
    <div className="md:px-12 md:py-4 px-4 py-4 md:mt-14 mt-20">
      <Tags 
        ref={ref}
        tags={tags} 
        toggleTags={toggleTags} 
        handleToggle={handleToggle}
        handleSelection={handleSelection}
        selected={tags.some((tag) => tag.active)}
      />
      <div className='h-4'></div>
      { !loading ?
      <div style={{marginTop: `${height}px` }} className={`cursor-default grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:pt-2 xl:grid-cols-4 grid-cols-1`}>
        {!!filteredAlgorithms.length ? 
        filteredAlgorithms?.map((algorithm: Algo, index: number) => (
          <div key={index} onClick={() => navigate(`/algorithms/${algorithm.id}`)} className="text-black pointer [&_pre]:whitespace-pre-wrap overflow-hidden max-h-[600px] md:max-h-[400px] p-2 lg:p-0 [mask-image:linear-gradient(0deg,transparent_0%,#000_40%,#000_80%)]">
            <h1 className="hover:text-blue-500 mb-4 text-xl font-extrabold leading-none tracking-tight md:text-2xl">{algorithm.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(algorithm.content) }} className='text-gray-500'/>
          </div> 
        )) :
        initAlgorithms?.map((algorithm: Algo, index: number) => (
          <div key={index} onClick={() => navigate(`/algorithms/${algorithm.id}`)}  className="text-black pointer [&_pre]:whitespace-pre-wrap overflow-hidden max-h-[600px] md:max-h-[400px] p-2 lg:p-0 [mask-image:linear-gradient(0deg,transparent_0%,#000_40%,#000_80%)]">
            <h1 className="hover:text-blue-500 mb-4 text-xl font-extrabold leading-none tracking-tight md:text-2xl">{algorithm.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(algorithm.content) }} className='text-gray-500'/>
          </div> 
        ))
        }
      </div> :
      null }
    </div>
  )
}