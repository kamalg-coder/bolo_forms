import React, { useRef} from "react";
import { FaImage } from "react-icons/fa6";
import { FaQuestionCircle } from "react-icons/fa";

function CategorizePreview({ind,currentdata,data,setData, setShowImage, onOpen }) {
    const dragIteam= useRef()
    const dragContainer= useRef('')

    function handleDrag() {
        let newdata = {...data}
        newdata.questions[ind].items[dragIteam.current]["stored"]=dragContainer.current
        setData(newdata)
    }

  return (
    <div>
      <h3 className="capitalize flex gap-5 font-semibold text-[20px] items-center">
      <span>Question {ind+1}</span>
        {currentdata.image?<FaImage
          size={"25px"}
          onClick={() => {
            setShowImage(data.image);
            onOpen();
          }}
        />:null}
      </h3>
      <p className="ml-5 font-semibold flex gap-3 items-center "><FaQuestionCircle /><span className="first-letter:uppercase">{currentdata.question}</span></p>
      <div className="flex justify-center gap-5">{ currentdata.items.map((el,i)=>el.stored?null:<span key={i} draggable onDragEnd={handleDrag} onDragStart={()=>dragIteam.current=i} className="py-1 px-3 rounded-md font-semibold text-[20px]" style={{ border:'1px solid gray'}}>{el.value}</span>)}</div>
      <div className=" flex justify-center gap-3 mt-5">
        {currentdata.categories.map((el,x)=>
        <div key={x} className="text-center" onDragEnter={()=>dragContainer.current=el} >
                <div className='bg-red-200 rounded-md mb-3 py-2 px-5 font-semibold text-[20px]'>{el}</div>
                <div className='bg-red-200 flex flex-col gap-2 min-h-[110px] bg-${x%2==0?"red":"yellow"}-200 p-3 rounded-md'>
                    { currentdata.items.map((item,i)=>item.stored==el?<span key={i} draggable onDragEnd={handleDrag} onDragStart={()=>dragIteam.current=i} className="py-1 px-3 rounded-md font-semibold text-[20px]" style={{ border:'1px solid gray'}}>{item.value}</span>:null)}  
                </div>
        </div>)}
      </div>
    </div>
  );
}

export default CategorizePreview;