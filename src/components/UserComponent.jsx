import React from 'react';
import "../Sass/UserComponent.scss";
import User from "./common/User";
//import firebase from 'firebase';

export default function UserComponent() {
  
  return (
    <div className='user-form'>
      <User />
    </div>
  );
};
