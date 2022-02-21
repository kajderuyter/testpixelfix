import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from '/public/images/logo.png'

export default function App() {
  const router = useRouter()
  useEffect(() => {
      fetchData()
  }, []) 

  const config = {
    method: 'GET'
  };
  const fetchData = async () => {
    let status
    const json = await fetch('https://74f0-2a02-a210-2786-ce80-f4ae-5fec-32ce-34b8.ngrok.io/api/store/val', config).then(response => {
      status = response.status
      return response.json()
    }).catch(err => (console.log(err)))
    if(status === 401) {
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
        <div className="loading-logo">
          <Image src={Logo} width={250} height={50} alt='Logo'/>
        </div>
      </div>
    </>
  )
}