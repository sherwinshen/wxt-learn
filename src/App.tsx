import { useState } from "react";
import { FloatButton } from "antd";
import "./styles/global.css";
function App() {
  const [enable, setEnable] = useState(true);
  const [clickTag, setClickTag] = useState("");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        const tagName = e.target.tagName;
        e.target.style.border = "1px solid blue"; // 对这个点击的元素加一个边框
        setClickTag(tagName || "");
      }
    };
    if (enable) {
      window.addEventListener("click", handleClick);
    } else {
      window.removeEventListener("click", handleClick);
    }
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [enable]);

  return (
    <>
      {enable && (
        <div className="fixed top-4 right-4 z-50">
          <div className="w-64 p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">悬浮卡片</h3>
            <p className="mt-2 text-gray-600">点击元素：{clickTag ?? "--"}</p>
          </div>
        </div>
      )}
      <FloatButton
        onClick={() => setEnable((val) => !val)}
        tooltip={<div className="text-xl font-bold">hello, sherwin</div>}
      />
    </>
  );
}

export default App;
