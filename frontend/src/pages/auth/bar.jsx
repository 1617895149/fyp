import { useRef } from 'react';

export default function Bar(props) {
  const divRef = useRef(null);

  const handleFocus = () => {
    if (divRef.current) {
      divRef.current.style.boxShadow = "0px 0px 1px 2px #007bff";
    }
  };



  const handleBlur = () => {
    if (divRef.current) {
      divRef.current.style.boxShadow = "0px 0px 2px 2px rgba(0,0,0,0.1)"
    }
  };
  
  return (
    <div ref={divRef} className="border-solid rounded-2xl shadow-[0_1px_3px_3px_rgba(0,0,0,0.1)] my-[12px] box-border duration-[150ms]">
      <i className="bi bi-person-circle m-2 text-2xl">{props.bar}</i>
      <input 
        type={props.type}
        id={props.type} 
        placeholder={props.placeholder}
        className="border-none outline-none  text-2xl"
        onFocus={handleFocus}  // 绑定onFocus事件
        onBlur={handleBlur}   // 绑定onBlur事件
        onChange={props.onChange}
      />
    </div>
  );
}