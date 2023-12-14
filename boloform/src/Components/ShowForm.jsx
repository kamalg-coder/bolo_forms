import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function ShowForm() {
  const [DeleteId,SetDeleteId]=useState('')
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allData,setALlData]=useState([])
  const Navigate = useNavigate();

  async function fetchData() {
    let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/form`);
    setALlData(res.data);
  }

  async function handleDelete() {
    let res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/form/${DeleteId}`);
    onClose()
    setALlData((prev)=>prev.filter((el)=>el._id != DeleteId))
  }
  
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="max-w-[1200px] mx-auto mt-5 p-3">
      <div className="flex items-start flex-col  sm:flex-row sm:justify-between sm:items-center mb-[20px]">
        <h2 className="text-[#7E22CE] text-[60px] font-bold">Forms</h2>
        <button
          onClick={() => Navigate("/form/New")}
          className="flex items-center gap-3  text-white  px-[15px] py-[7px] rounded-[10px] text-[22px] bg-black hover:text-black hover:bg-white hover:border-[2px] border-black"
        >
          <FiPlusCircle size={"25px"} />
          Create New Form
        </button>
      </div>

      {/* setting loader */}
      { allData.length==0?<h2 className="text-center font-semibold text-[20px] my-5">Loading <span id="loderAnimation">. . .</span></h2>:null  }

      {/* mapping alldata into card */}
      <div className=" flex flex-col gap-5">
          {
            allData.map(data=><div key={data._id} className="border-4 border-gray-100 p-5 rounded-lg flex justify-between items-center  hover:border-purple-100">
              <h3 className="font-semibold text-[25px] first-letter:capitalize">{data.title}</h3>
              <div className="flex gap-3">
                <button className="py-1 px-3 rounded-md text-white font-semibold bg-blue-500" onClick={()=>Navigate(`/view/${data._id}`)}>Preview</button>
                <button className="py-1 px-3 rounded-md text-white font-semibold bg-green-500" onClick={()=>Navigate(`/form/${data._id}`)}>Edit</button>
                <button className="py-1 px-3 rounded-md text-white font-semibold bg-red-500" onClick={()=>{SetDeleteId(data._id);onOpen()}}>Delete</button>
              </div>
            </div>)
          }
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent padding={"10px"}>
          <ModalCloseButton bg={"white"} />
          <ModalHeader textAlign={"center"} fontSize={'25px'}>Confirm Delete</ModalHeader>
          <ModalBody  display={"flex"} justifyContent={'space-around'}>
              <button onClick={handleDelete} className="px-10 py-1 text-[20px] font-bold rounded-md text-white bg-green-500">Yes</button>
              <button onClick={onClose} className="px-10 py-1 text-[20px] font-bold rounded-md text-white bg-red-500">NO</button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ShowForm;
