

export default function card({ title, price, imageUrl }) {
  return (
    <div className="relative cursor-pointer border-none group [background-clip:content-box,_padding-box] min-w-[400px] w-[400px] h-[500px] p-[0px] rounded-[16px] 
    bg-[linear-gradient(to_bottom,_white_0%,_white_100%),_linear-gradient(to_bottom,_white_0%,_white_100%)] leading-5
    hover:duration-[400ms] hover:p-[0px]  duration-[400ms] hover: m-[10px] [box-shadow:2px_4px_2px_2px_#00000014] hover:[box-shadow:0px_12px_20px_16px#00000014]">
      <img src={imageUrl} 
      className="w-[100%] max-h-[100%] p-[10px] absolute bottom-[0%] object-contain rounded-[18px] group-hover:p-[0px] duration-[400ms]"  />

      <div className="absolute top-[calc(8%)] left-[calc(8%)] group-hover:top-[calc(8%-3px)] group-hover:left-[calc(8%-2px)] duration-[400ms] ease-in-out">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <h6>hkd {price} up</h6>
      </div>
    </div>
  )
}
