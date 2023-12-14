import { Input, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxDragHandleHorizontal } from "react-icons/rx";

function Cloze({ data, ind, question, setQuestions }) {
  const OptionDragStart = useRef(0);
  const OptionDragEnd = useRef(0);

  const toast = useToast()
  const [preview, setPreview] = useState("");


  function handleChange(value) {
    let newdata = [...question];
    newdata[ind].question = value;

    let matches = value.match(/\*([^*]+)\*/g);
    if (matches) {
      newdata[ind].option = matches.map((match) => match.replace(/\*/g, ""));
    }

    setPreview(value.replace(/\*([^*]+)\*/g, "_ _"));
    setQuestions(newdata);
  }

  // drag functions 
  //***********************************************************************************
  function handleOptionDrag() {
    let newdata = [...question];
    // swaping drag start and end values
    let temp = newdata[ind].option[OptionDragStart.current];
    newdata[ind].option[OptionDragStart.current] =
      newdata[ind].option[OptionDragEnd.current];
    newdata[ind].option[OptionDragEnd.current] = temp;

    setQuestions([...newdata]);
  }
  //*********************************************************************************** 
  function ShowToast(Message,Status="success") {
    //function to show toast
    toast({
      description: Message,
      status: Status,
      position:"top",
      duration: 9000,
      isClosable: true,
    })
  }


  async function uploadImage(e) {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "ztww0s1s");
    try {
      ShowToast('Uploading image...')
      let res = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData
      );
      ShowToast('Image uploaded successfully')
      let newdata = [...question];
      newdata[ind].image = res.data.secure_url;
      setQuestions(newdata);
    } catch (error) {
      ShowToast(error.message,"warning");
    }
  }

  return (
    <div>
      <h5 htmlFor="question" className="my-3 font-semibold">
        Question {ind + 1}
      </h5>

      {/* for image  selection */}
      <div
        onClick={() => document.getElementById(`${ind}getFile`).click()}
        className="text-center p-1 my-3 h-[70px] w-[200px] overflow-hidden border-2 border-gray flex flex-col justify-center rounded-xl cursor-pointer"
      >
        <h4 className="font-bold text-blue-500 text-[15px] flex justify-center items-center gap-3">
          <IoCloudUploadOutline size={"25px"} />{" "}
          <span>Image ( Optional )</span>
        </h4>
        <p className="overflow-hidden whitespace-nowrap">{data.image}</p>
        <input type="file" onChange={uploadImage} id={`${ind}getFile`} style={{ display: "none" }} />
      </div>

      <p className="font-semibold mb-2">Preview :</p>
      <div className="mb-[20px] min-h-[25px]">{preview}</div>

      <label htmlFor="Sentence" className="font-semibold mt-[20px]">
        Sentence
      </label>
      <Input
        type="text"
        id="Sentence"
        value={data.question}
        marginTop={"10px"}
        onChange={(e)=>handleChange(e.target.value)}
        placeholder="Enter your Sentence"
      />
      <p className="text-red-400 text-[15px] ml-3">
        Wrap words with ( * ) to covert them into blank space
      </p>

      <div className="mt-[20px]">
        {data?.option.length == 0 ? (
          <Input
            marginLeft={"50px"}
            width={"250px"}
            type="text"
            placeholder="Options will render here."
          />
        ) : (
          data.option.map((el, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => (OptionDragStart.current = i)}
              onDragEnter={() => (OptionDragEnd.current = i)}
              onDragEnd={handleOptionDrag}
              className="flex gap-3 items-center my-2 ml-5"
            >
              <RxDragHandleHorizontal size={"25px"} />
              <Input type="text" width={"200px"} value={el} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cloze;
