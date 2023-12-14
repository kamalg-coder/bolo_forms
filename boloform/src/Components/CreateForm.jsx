import {
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    useDisclosure,
  } from "@chakra-ui/react";
  import React, { useEffect, useRef, useState } from "react";
  import QuestionCard from "./QuestionCard";
  import { IoCloudUploadOutline } from "react-icons/io5";
  import axios from "axios";
  import { useToast } from "@chakra-ui/react";
  import sucessIcon from "../assests/successIcon.svg";
  import { useNavigate, useParams } from "react-router-dom";
  
  function CreateForm() {
    const params = useParams();
  
    const [question, setQuestions] = useState([
      {
        type: "Categorize",
        question: "",
        image: "",
        categories: [""],
        items: [{ value: "", belong: "" }],
      },
    ]);
  
    const [header, setHeader] = useState("");
    const [FormID, setFormID] = useState("");
    const [image, setImage] = useState("");
    const formName = useRef();
  
    const toast = useToast()
    const Navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
  
   
    function ShowToast(Message,Status="success") {
      toast({
        description: Message,
        status: Status,
        position:"top",
        duration: 4000,
        isClosable: true,
      })
    }
  
    async function handleSubmit() {
      if (header == "") {
        ShowToast("Form Header required", "warning");
        formName.current.focus();
      } else {
        console.log(question)
        try {
          onOpen();
          let res;
          if (params.action == "New") {
            res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/form`, {
              title: header,
              image: image,
              questions: question,
            });
            console.log(res.data.data._id)
            setFormID(res.data.data._id)
          } else {
            res = await axios.patch(
              `${process.env.REACT_APP_BACKEND_URL}/form/${FormID}`,
              {
                title: header,
                image: image,
                questions: question,
              }
            );
          }
          
        } catch (error) {
          console.log(error.message, "error");
        }
      }
    }
  
  async function uploadImage(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ztww0s1s");
      try {
        ShowToast('Image uploading please wait...')
        let res = await axios.post(
          process.env.REACT_APP_CLOUDINARY_URL,
          formData
        );
        ShowToast('image uploaded successfully')
        setImage(res.data.secure_url);
      } catch (error) {
        ShowToast(error.message);
      }
    }
  
    async function fetchData() {
      let res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/form/get/${params.action}`
      );
      setFormID(res.data[0]._id);
      setHeader(res.data[0].title);
      setImage(res.data[0].image);
      setQuestions(res.data[0].questions);
    }
  
    useEffect(() => {
     if (params.action != "New") {
        fetchData();
      }
    }, []);
  
    if(params.action != "New" && header==""){return <h2 className="text-center text-[20px] font-semibold my-5">Loading <span id="loderAnimation">. . .</span></h2>}
  
    return (
      <div>
        <div className="border-b-2 border-gray-300 pb-5 mb-5">
          <Input
            onChange={(e) => setHeader(e.target.value)}
            ref={formName}
            value={header}
            type="text"
            className="outline-none border-none"
            placeholder="Enter form Name"
          />
        </div>
        <div
          onClick={() => document.getElementById("getFile").click()}
          className="text-center h-[100px] border-4 border-gray flex flex-col justify-center rounded-xl cursor-pointer"
        >
          <h4 className="font-bold text-blue-500 text-[20px] flex justify-center items-center gap-3">
            <IoCloudUploadOutline size={"25px"} />{" "}
            <span>Select Header Image ( Optional )</span>
          </h4>
          <p>{image}</p>
          <input
            type="file"
            onChange={(e) => uploadImage(e.target.files[0])}
            id="getFile"
            style={{ display: "none" }}
          />
        </div>
  
        {/* mapping questions */}
        {question.map((el, ind) => (
          <QuestionCard
            key={ind}
            data={el}
            ind={ind}
            question={question}
            setQuestions={setQuestions}
          />
        ))}
  
        <div className="flex gap-5 justify-center my-5">
          <button
            className="px-3 py-1 font-bold text-[25px] text-white bg-blue-500 rounded-lg"
            onClick={() =>
              setQuestions((prev) => [
                ...prev,
                {
                  type: "Categorize",
                  question: "",
                  image: "",
                  categories: [""],
                  items: [{ value: "", belong: "" }],
                },
              ])
            }
          >
            Add Question
          </button>
          <button
            className="px-3 py-1 font-bold text-[25px] text-white bg-purple-500 rounded-lg"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="px-3 py-1 font-bold text-[25px] text-white bg-red-500 rounded-lg"
            onClick={() => Navigate(-1)}
          >
            Cancel
          </button>
        </div>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent minHeight={'400px'}>
            <ModalCloseButton />
            <ModalBody
              padding={"40px 0px"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"end"}
            >
              <img src={sucessIcon} alt="" className="block m-auto w-[200px]" />
              <h3 className="font-bold text-center text-[25px] my-3">
                {" "}
                Form {params.action=='New'?"Created":"Updated"} Successfully
              </h3>
              <div  style={{width:"100%", display:'flex',justifyContent:'space-evenly'}}>
                <button
                  className="py-1 px-3 bg-blue-500 text-white rounded-lg text-[25px]"
                  onClick={() => Navigate(`/View/${FormID}`,{ replace: true })}
                >
                  Preview
                </button>
                <button
                  className="py-1 px-3 bg-red-500 text-white rounded-lg text-[25px]"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  className="py-1 px-3 bg-green-500 text-white rounded-lg text-[25px]"
                  onClick={()=>Navigate('/',{ replace: true })}
                >
                  Home
                </button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  }
  
  export default CreateForm;
  