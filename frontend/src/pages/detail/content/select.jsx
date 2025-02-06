import { useContext, useState } from 'react';
import { supplementOpenContext } from '../root';

export default function Select() {
    const [selectedProduct, setSelectedProduct] = useState(11); // 假设默认选中11吋型号
    const supplementOpened = useContext(supplementOpenContext);

    const open = () => {
        supplementOpened[1]('block');
    };

    const handleProductChange = (event) => {
        setSelectedProduct(Number(event.target.value)); // 更新选中的产品尺寸
    };

    return (
        <div style={{ flexGrow: 3, height: "100%" }}>
            <br /><br /><br /><br /><br /><br /><br /><br /><br />
            <form id="productForm">
                <h3 className='text-left '>选择产品尺寸。</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 m-2 text-center cursor-pointer 
            transition-colors duration-300 w-[396px] flex justify-between items-center relative" id="tab11" >
                    <input
                        type="radio"
                        id="option11"
                        name="product"
                        value={11}
                        checked={selectedProduct === 11} // 根据状态设置checked属性
                        onChange={handleProductChange} // 添加onChange事件处理函数
                    />
                    <label htmlFor="option11" className='w-[100%]'>
                        <div className="title select-none">11 吋型号</div>
                        <div className="details select-none">Ultra Retina XDR 显示器</div>
                    </label>
                    <div className="price select-none absolute right-[3%]">HK$7,999 起</div>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4 m-2 text-center cursor-pointer 
            transition-colors duration-300 w-[396px] flex justify-between items-center relative" id="tab11">
                    <input
                        type="radio"
                        id="option13"
                        name="product"
                        value={13}
                        checked={selectedProduct === 13} // 根据状态设置checked属性
                        onChange={handleProductChange} // 添加onChange事件处理函数
                    />
                    <label htmlFor="option13" className='w-[100%]'>
                        <div className="title select-none">13 吋型号</div>
                        <div className="details select-none">Ultra Retina XDR 显示器</div>
                    </label>
                    <div className="price select-none absolute right-[3%]">HK$10,499 起</div>
                </div>
            </form>
            <div className="border-2 border-gray-300 rounded-lg p-4 m-2 text-center cursor-pointer 
            transition-colors duration-300 w-[396px] flex justify-between items-center relative"
             onClick={open} id="tab14" style={{ fontSize: "0.7em" }}>
                <label htmlFor="">
                    <div className="title">想進一步了解 Ultra Retina XDR？</div>
                    <div className="details">我們最先進的顯示器，讓你全情投入。</div>
                </label>
                <i className="bi bi-plus-circle" style={{ alignSelf: "start" }} />
            </div>
            <br /><br /><br /><br /><br /><br /><br />
            <h3>外观。挑选你喜爱的颜色。</h3>
            <div className="color-option" id="colorBlack">
                <div className="color-sample" style={{ backgroundColor: "#333" }} />
                <div className="color-name">太空黑</div>
            </div>
            <div className="color-option" id="colorSilver">
                <div className="color-sample" style={{ backgroundColor: "#e0e0e0" }} />
                <div className="color-name">银色</div>
            </div>
            <br /><br /><br /><br /><br />    <h3>儲存空間。選擇你需要的儲存空間。</h3>
        </div>
    );
}