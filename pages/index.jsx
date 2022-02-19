import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function App() {
  const router = useRouter()
  const [auth, setAuth] = useState(false)
  const [err, setErr] = useState(null)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
      fetchData()
  }, []) 

  const config = {
    method: 'GET'
  };
  const fetchData = async () => {
    let status
    const json = await fetch('https://testpixelfix.herokuapp.com/api/store/val', config).then(response => {
      status = response.status
      return response.json()
    })
    if(status === 200) {
      setTimeout(() => {
        router.push({
        pathname: "/dashboard",
        query: {
          store_name: json.store_name,
          access_token: json.access_token
        }
      })}, 1000)
    } else {
      setTimeout(() => {
        router.push({
        pathname: "/license",
        query: {
          store_name: json.store_name,
          access_token: json.access_token
        }
      })}, 1000)
    }
  }
  

  return(
    <>
      <div className="loading-screen">
        <Image src={'/logo.png'} alt="Logo" width={500} height={200}/>
      </div>
    </>
  )
}