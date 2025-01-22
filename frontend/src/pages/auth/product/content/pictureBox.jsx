import { useRef, useState } from 'react';

function PictureBox() {
    const inputRef = useRef(null);
    const [index, setIndex] = useState(0);

    const foward = () => {
        inputRef.current.style.animation = 'forward 1s forwards';
        console.log(document.getElementsByTagName('input'))
        setIndex(index+1)
    };

    const backward = () => {
        inputRef.current.style.animation = 'backward 1s forwards';
        setIndex(index-1)
    };

    return (
        <div
            className='pb max-w-[70%] w-[70%] flex-grow-7 h-[80vh] sticky transform translate-x-0
            top-[100px] overflow-hidden'>
            <div
                style={{
                    width: "90%",
                    height: "90%",
                    paddingLeft: '1%',
                    paddingRight: '1%',
                    paddingTop: '6%',
                    justifySelf: "center",
                    borderRadius: "3%",
                    display: "flex",
                    overflow: "hidden"
                }}
            >
                <div
                    ref={inputRef}
                    style={{
                        width: "180%",
                        height: "180%",
                        flexGrow: 1,
                        display: "grid",
                        position: "absolute",
                        gridTemplateColumns: "repeat(2, 50%)",
                        gridTemplateRows: "repeat(1, auto)",
                        gap: "3%"
                    }}
                >
                    <img
                        src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202405?wid=5120&hei=2880&fmt=webp&qlt=70&.v=cXN0QTVTNDBtbGIzcy91THBPRThnNE5sSFgwakNWNmlhZ2d5NGpHdllWY09WV3R2ZHdZMXRzTjZIcWdMTlg4eUJQYkhSV3V1dC9oa0s5K3lqMGtUaFMvR01EVDlzK0hIS1J2bTdpY0pVeTF1Yy9kL1dQa3EzdWh4Nzk1ZnZTYWY&traceId=1"
                        alt="ipad"
                        style={{
                            objectFit: "cover",
                            borderRadius: "3%",
                            overflow: "hidden",
                            position: "relative",
                            width: "100%",
                            height: "50%"
                        }}
                    />
                    <img
                        src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202405?wid=5120&hei=2880&fmt=webp&qlt=70&.v=cXN0QTVTNDBtbGIzcy91THBPRThnNE5sSFgwakNWNmlhZ2d5NGpHdllWY09WV3R2ZHdZMXRzTjZIcWdMTlg4eUJQYkhSV3V1dC9oa0s5K3lqMGtUaFMvR01EVDlzK0hIS1J2bTdpY0pVeTF1Yy9kL1dQa3EzdWh4Nzk1ZnZTYWY&traceId=1"
                        alt="ipad"
                        style={{
                            objectFit: "cover",
                            borderRadius: "3%",
                            overflow: "hidden",
                            position: "relative",
                            width: "100%",
                            height: "50%"
                        }}
                    />
                </div>
            </div>
            <svg
                onClick={backward}
                className="cursor-pointer back"
                style={{ position: "absolute", top: "50%", left: "10%" }}
                xmlns="http://www.w3.org/2000/svg"
                width={52}
                height={52}
                fill="black"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
                />
            </svg>
            <svg 
                onClick={foward}
                className="cursor-pointer next"
                style={{ position: "absolute", top: "50%", right: "8%" }}
                xmlns="http://www.w3.org/2000/svg"
                width={52}
                height={52}
                fill="currentColor"
                viewBox="0 0 16 16"
            >
                <path
                    fillRule="evenodd"
                    d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
                />
            </svg>
            <div
                style={{
                    width: "10%",
                    height: "10%",
                    position: "absolute",
                    bottom: "0%",
                    left: "48%"
                }}
            >
                <input
                    type="radio"
                    id="radio1"
                    defaultValue="male"
                    defaultChecked=""
                    checked={index === 0}
                />
                <label htmlFor="radio1" className="custom-radio" />
                <input type="radio" id="radio2"  checked={index === 1} />
                <label htmlFor="radio2" className="custom-radio" />
            </div>
        </div>
    );
}

export default PictureBox