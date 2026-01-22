import React from 'react'
import { Flex, Spin } from 'antd';

export default function Loader() {
  return (
    <div className='loader'>
    <Spin size="large" />
    <p>Please wait...</p>
    </div>
  )
}
