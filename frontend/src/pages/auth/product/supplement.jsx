import { useRef, useContext } from 'react';
import { supplementOpenContext } from './root'



function Supplement() {
    const myRef = useRef(null);
    const supplementOpened = useContext(supplementOpenContext);

    const close = () => {
        console.log(supplementOpened[0])
        supplementOpened[1]('none')
    };
    

    return (
        <div
            className="supplement"
            ref={myRef}
            style={{
                display: supplementOpened[0],
                position: "fixed",
                top: 0,
                width: "100%",
                height: "200vh",
                backgroundColor: "white",
                opacity: "0.5",
                zIndex: 2,
                overflow: "scroll"
            }}
        >
            <div
                style={{
                    width: "50%",
                    height: "100%",
                    backgroundColor: "aquamarine",
                    position: "absolute",
                    top: "3%",
                    left: "25%",
                    borderRadius: 32
                }}
            >
                <svg
                    className="cursor-pointer cancel"
                    onClick={close}
                    style={{ position: "absolute", top: "1.5%", right: "3%" }}
                    xmlns="http://www.w3.org/2000/svg"
                    width={36}
                    height={36}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
            </div>
        </div>

    );
}

export default Supplement