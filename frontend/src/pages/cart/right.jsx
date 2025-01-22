import { useRef, useState } from "react";


export default function Right() {
    const testRef = useRef(null);
    const testtRef = useRef(null);
    const [quantity, setQuantity] = useState(1);

    function test(e) {
        const state = e.target.checked;
        testRef.current.style.height = (state) ? '0px' : '100%';
        testtRef.current.style.height = (state) ? '220px' : '498px';
    }

    return (
        <div className="flex-grow-[7.5] flex flex-col duration-[500ms] p-[2%] box-content" style={{ height: '498px' }} ref={testtRef}>
            <div className="flex flex-row mb-4 ">
                <h1 className="text-2xl font-extrabold leading-[44px]">14 吋 MacBook Pro - 太空黑</h1>
                <form className="max-w-xs mx-auto">
                    <div className="relative flex items-center max-w-[8rem]">
                        <button
                            onClick={() => { if (quantity > 1) setQuantity(quantity - 1) }}
                            type="button"
                            id="decrement-button"
                            data-input-counter-decrement="quantity-input"
                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                        >
                            <svg
                                className="w-3 h-3 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M1 1h16"
                                />
                            </svg>
                        </button>
                        <input
                            type="text"
                            id="quantity-input"
                            data-input-counter=""
                            data-input-counter-min={1}
                            data-input-counter-max={50}
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={999}
                            defaultValue={quantity}
                            value={quantity}
                            required=""
                        />
                        <button
                            onClick={() => { setQuantity(quantity + 1) }}
                            type="button"
                            id="increment-button"
                            data-input-counter-increment="quantity-input"
                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                        >
                            <svg
                                className="w-3 h-3 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 1v16M1 9h16"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
                <h1 className="text-2xl font-extrabold leading-[44px]">${quantity * 14499}</h1>
            </div>

            <h1>产品规格
                <span className="float-end">
                    <input type="checkbox" id="age1" name="age" value="30" className="hidden" onChange={test} />
                    <label htmlFor="age1"><i className="bi bi-caret-down-fill"></i></label>
                </span>
            </h1>

            <div className=" h-[100%] duration-500 overflow-hidden border-y-2" ref={testRef}>
                <ul className="text-sm">
                    <h2>硬件</h2>
                    <li>
                        <span className="highlight">14吋 Liquid Retina XDR显示器</span>
                    </li>
                    <li>标准显示器</li>
                    <li>Apple M4芯片配备10核心CPU、10核心GPU、16核心神经网络引擎</li>
                    <li>24GB统一记忆体</li>
                    <li>512GB SSD存储</li>
                    <li>70W USB-C电源转换器</li>
                    <li>三个 Thunderbolt 4连接埠、HDMI连接埠、SDXC卡槽、耳筒插口、MagSafe 3连接埠</li>
                    <h2>软件</h2>
                    <li>照片、iMovie、GarageBand</li>
                    <li>Pages、Numbers、Keynote</li>
                    <li>macOS</li>
                    <li>照片、iMovie、GarageBand</li>
                </ul>
            </div>

            <div className="flex">
                <i className="bi bi-apple mx-2"></i>
                <div className="w-[100%]">
                    <h1 className="font-bold">加入「AppleCare+ 服務計劃適用於 14 吋 MacBook Pro (M4)」，價格為</h1>
                    <h1 className="font-bold">HK$2,299</h1>
                    <h1>可享長達三年的技術支援及意外損壞保障。</h1>
                </div>
            </div>
        </div>
    )
}



