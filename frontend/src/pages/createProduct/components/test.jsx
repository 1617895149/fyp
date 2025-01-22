import React from 'react'

export default function test() {
  return (
    <div className='max-w-full max-h-[200] relative'>
      <div className='w-[100%] h-[70%] max-h-[70%]'></div>
      <div className='w-[100%] h-[100%] max-h-[100%]'>//当前选中的图片</div>
      <div className='w-[100%] h-[30%] max-h-[30%] bottom-0 left-0 absolute'>//当前没有选中的图片
        <div className=''></div>
      </div>
    </div>
  )
}
