import React, { useState } from 'react'
import '../Sass/DefaultComponent.scss'
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function DefaultComponent() {
  let navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/home');
  };

  return (
    <div>
      <img width={490} src={logo} onClick={handleNavigate} alt="Logo" style={{cursor: 'pointer'}}/>
      <h1 className='error-nf'>
        ERROR 404 <br />
        PAGE NOT FOUND
      </h1>
    </div>
  );
}
