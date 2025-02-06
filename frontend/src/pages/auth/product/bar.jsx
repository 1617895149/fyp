import { useState } from "react";

function Bar() {
  const [top, settop] = useState(false)

  return (
    <div onClick={(e)=>{console.log(e.target.style.height = '100px')}}  className="bg-[#ccc] duration-300 overflow-y-hidden h-[0px] w-[100%] fixed z-[2]">
      <div className="bg-[#ccc]">
        hk $ 7999
      </div>
    </div>
  );
}


export default Bar