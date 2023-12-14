import React from 'react'
import { FaImage } from 'react-icons/fa6';

function ComprehensionPreview({ind,currentdata,data,setData, setShowImage, onOpen }) {

  function hadhelChange(i,value){
      let newdata={...data}
      newdata.questions[ind].questions[i]["stored"]=value
      setData(newdata)
  }



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
      <div className='mt-5'>
        <h3 className='ml-3 font-semibold '>Passage :</h3>
        <p className='ml-3 first-letter:uppercase'>{currentdata.passage}</p>
      </div>
      <div className='mt-5 ml-3'>
          {currentdata.questions.map((que,i)=>
            <div key={i} className='p-3 my-3 rounded-lg border-l-4 border-l-gray-400 border-2 border-gray-300'>
                <p className='font-semibold'>{que.question}</p>
                 {
                  que.option.map((el,x)=><div key={x} className='flex gap-3'>
                    <input checked={que.stored==el} onChange={()=>hadhelChange(i,el)} type="checkbox" id={`${i}${x}`}/>
                    <label htmlFor={`${i}${x}`}>{el}</label>
                  </div>)
                 }
            </div>
          )}
      </div>
    </div>
  )
}

export default ComprehensionPreview
