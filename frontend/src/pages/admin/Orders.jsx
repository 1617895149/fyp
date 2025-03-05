import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";

export default function Orders() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  // 使用 useRef 创建一个引用，指向右侧的 div
  const detailsRef = useRef(null);

  // 模拟表格数据
  const tableData = [
    ["Header 1", "Header 2", "Header 3"],
    ["Cell 1-1", "Cell 1-2", "Cell 1-3"],
    ["Cell 2-1", "Cell 2-2", "Cell 2-3"],
    ["Cell 3-1", "Cell 3-2", "Cell 3-3"],
  ];

  // 点击行时更新 activeRow 并显示右侧 div
  const handleRowClick = (rowIndex) => {
    setActiveRow(rowIndex);
    if (detailsRef.current) {
      detailsRef.current.style.display = "flex"; // 显示右侧 div
    }
  };

  const handleDeleteClick = () => {
    if (detailsRef.current) {
      detailsRef.current.style.display = "none"; // 隐藏右侧 div
      setActiveRow(null); // 清除选中的行
    }
  };

  // 清除右侧 div 的显示状态（可选）
  useEffect(() => {
    return () => {
      if (detailsRef.current) {
        detailsRef.current.style.display = "none"; // 隐藏右侧 div
      }
    };
  }, []);

  return (
    <div className="w-[100%] h-[100%] flex flex-row">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="w-[100%] flex">
        <div className="grow-[6]">
          <div className="flex gap-4 justify-center p-8">
            <div className="w-[130px] h-20 bg-blue-500 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out" />
            <div className="w-[130px] h-20 bg-green-500 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out" />
            <div className="w-[130px] h-20 bg-yellow-500 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out" />
            <div className="w-[130px] h-20 bg-red-500 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out" />
          </div>

          <h1 className="text-2xl font-bold">Orders</h1>
          <h3>Select order and check details</h3>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                {tableData[0].map((header, index) => (
                  <th key={index} className="p-4 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`hover:bg-gray-100 cursor-pointer ${activeRow === rowIndex ? "bg-blue-500" : ""
                    }`}
                  onClick={() => handleRowClick(rowIndex)}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="grow-[4] bg-slate-200 p-4"
          ref={detailsRef}
          style={{ display: "none" }} // 默认隐藏
        >
          <div className="relative">
            <h2 className="text-xl font-bold">Order Details</h2>
            <i onClick={handleDeleteClick} className="bi bi-trash-fill top-0 right-0 hover:text-red-500 cursor-pointer"></i> {/* 使用 Bootstrap Icons 的删除图标 */}
           
          </div>
        </div>
      </div>
    </div>
  );
}



