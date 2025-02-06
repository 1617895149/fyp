import "bootstrap-icons/font/bootstrap-icons.css";
import PictureBox from "./content/pictureBox";
import Select from "./content/select";

function Content() {
  return (
    <>
      <h1 className="absolute my-[21.4px] text-xl font-bold">购买 iPad Pro</h1>
      HK$15, 999起
      < div
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          height: "600vh",
          flexDirection: "row",
          borderBottom: "#333"
        }
        }
      >
        <PictureBox />
        <Select />

      </div >
    </>
  );
}

export default Content;