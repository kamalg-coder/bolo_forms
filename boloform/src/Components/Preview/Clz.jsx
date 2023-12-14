import React, { useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";

function ClozePreview({ind,currentdata,data,setData,setShowImage,onOpen}) {

  const [options, setOptions] = useState([]);

  const dragIteam = useRef();
  const dragContainer = useRef();

  function handleDrag() {
    
    let newOptions=[...options];
    newOptions[dragIteam.current].store = dragContainer.current;
    setOptions(newOptions)
    setTimeout(()=>{
        let newdata = {...data}
        newdata.questions[ind]["answer"]=document.getElementById("clozeAns").innerText.replace('\n\n',"\n").split("\n").join(" ")
        setData(newdata)
    },0)
    
  }

  useEffect(()=>{
    setOptions(currentdata.option.map((el) => ({ value: el, store: null })))
  },[])

  return (
    <div>
      <h3 className="flex gap-5 font-semibold text-[20px] items-center">
      <span>Question {ind+1}</span>
        {currentdata.image ? (
          <FaImage
            size={"25px"}
            onClick={() => {
              setShowImage(data.image);
              onOpen();
            }}
          />
        ) : null}
      </h3>
      {/* to render options */}
      <div className="my-5 ml-3">
        Options :
        {options.map((el, i) =>
          el.store !=null ? null : (
            <span
              key={i}
              onDragStart={() => (dragIteam.current = i)}
              onDragEnd={handleDrag}
              draggable
              className="mx-3 text-white font-semibold rounded-md bg-blue-500 py-1 px-3"
            >
              {el.value}
            </span>
          )
        )}
      </div>
      <div className="flex gap-2 items-center ml-3" id="clozeAns">
        {currentdata.question
          .replace(/\*([^*]+)\*/g, "_") 
          .split(" ") 
          .map((el, x) =>
            el == "_" ? (
             <p
                key={x}
                onDragEnter={() => (dragContainer.current = x)}
                className="bg-gray-200 p-1 min-w-[80px] min-h-[35px] rounded-sm flex gap-1"
              >
                {options.map((el, i) =>
                  el.store == x ? 
                    <span
                      key={i}
                      draggable
                      onDragEnd={handleDrag}
                      onDragStart={() => (dragIteam.current = i)}
                      className=" text-white font-semibold rounded-md bg-blue-500 py-1 px-3"
                    >
                      {el.value}
                    </span>
                   : null
                )}
              </p>
            ) : (
              <span key={x} className="font-semibold">
                {el}
              </span>
            )
          )}
      </div>
    </div>
  );
}

export default ClozePreview;
