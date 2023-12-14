import { Input, Select } from "@chakra-ui/react";
import axios from "axios";
import React, { useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { useToast } from '@chakra-ui/react'

function Categorize({ data, ind, question, setQuestions }) {
  // refs to store drag values
  const CatDragStart = useRef(0);
  const CatDragEnd = useRef(0);

  const ItemDragStart = useRef(0);
  const ItemDragEnd = useRef(0);

  const toast = useToast()

  function handletitleChange(e) {
    let newdata = [...question];
    newdata[ind].question = e.target.value;
    setQuestions(newdata);
  }
  function handleAddCategory(e) {
    if (e.target.value != "") {
      let newdata = [...question];
      // if it inculdes categories already the dont add
      if (!newdata[ind].categories.includes(e.target.value)) {
        newdata[ind].categories.push(e.target.value);
        setQuestions(newdata);
        e.target.value = "";
      }
    }
  }
  function handleChangeCategory(i, value) {
    let newdata = [...question];
    newdata[ind].categories[i] = value;
    setQuestions(newdata);
  }

  function handleDeleteCategory(i) {
    // delete category by index
    let newdata = [...question];
    if (newdata[ind].categories.length == 1) {
      return;
    }
    newdata[ind].categories = newdata[ind].categories.filter((el, I) => I != i);
    setQuestions(newdata);
  }

  function handleAddItems(e) {
    // add Element to items
    if (e.target.value != "") {
      let newdata = [...question];
      for (let i = 0; i < newdata[ind].items.length; i++) {
        if (newdata[ind].items[i].value == e.target.value) {
          return;
        }
      }

      newdata[ind].items.push({
        value: e.target.value,
        belong: newdata[ind].categories[0],
      });
      setQuestions(newdata);
      e.target.value = "";
    }
  }

  function handleChangeItems(i, value) {
    let newdata = [...question];
    newdata[ind].items[i].value = value;
    setQuestions(newdata);
  }
  function handleChangeItemsCategory(i, value) {
    let newdata = [...question];
    newdata[ind].items[i].belong = value;
    setQuestions(newdata);
  }

  function handleDeleteItems(i) {
    let newdata = [...question];
    if (newdata[ind].items.length == 1) {
      return;
    }
    newdata[ind].items = newdata[ind].items.filter((el, I) => I != i);
    setQuestions(newdata);
  }

  function handleCategoryDrag() {
    let newdata = [...question];
    let temp = newdata[ind].categories[CatDragStart.current];
    newdata[ind].categories[CatDragStart.current] =
      newdata[ind].categories[CatDragEnd.current];
    newdata[ind].categories[CatDragEnd.current] = temp;

    setQuestions([...newdata]);
  }

  function handleItemsDrag() {
    let newdata = [...question];
    let temp = newdata[ind].items[ItemDragStart.current];
    newdata[ind].items[ItemDragStart.current] =
      newdata[ind].items[ItemDragEnd.current];
    newdata[ind].items[ItemDragEnd.current] = temp;

    setQuestions([...newdata]);
  }

  function ShowToast(Message,Status="success") {
    toast({
      description: Message,
      status: Status,
      position:"top",
      duration: 4000,
      isClosable: true,
    })
  }

  async function uploadImage(e) {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "ztww0s1s");
    try {
      ShowToast("Uploading image...please wait...");
      let res = await axios.post(
        process.env.REACT_APP_CLOUDINARY_URL,
        formData
      );
      ShowToast("image uploaded successfully")
      let newdata = [...question];
      newdata[ind].image = res.data.secure_url;
      setQuestions(newdata);
    } catch (error) {
      ShowToast(error.message,"warning");
    }
  }

  return (
    <div>
      <h5 htmlFor="question" className="font-semibold">
        Question {ind + 1}
      </h5>
      <Input
        type="text"
        marginTop={"10px"}
        defaultValue={data.question}
        onChange={handletitleChange}
        placeholder="Enter description for the question"
      />

      {/* for image  selection */}
      <div
        onClick={() => document.getElementById(`${ind}getFile`).click()}
        
        className="text-center p-1 my-3 h-[70px] w-[200px]  border-2 border-gray flex flex-col justify-center rounded-xl cursor-pointer"
      >
        <h4 className="font-bold text-blue-500 text-[15px] flex justify-center items-center gap-3">
          <IoCloudUploadOutline size={"25px"} />{" "}
          <span>Image ( Optional )</span>
        </h4>
        <p className="overflow-hidden whitespace-nowrap">{data.image}</p>
        <input type="file" onChange={uploadImage} id={`${ind}getFile`} style={{ display: "none" }} />
      </div>
      <p className="my-3 font-semibold">Categories</p>

      {/* render categories */}
      <div>
        {data?.categories.map((el, i) => (
          <div
            draggable
            key={i}
            className="flex gap-3 my-3 items-center"
            onDragStart={(e) => (CatDragStart.current = i)}
            onDragEnter={() => (CatDragEnd.current = i)}
            onDragEnd={handleCategoryDrag}
          >
            <RxDragHandleHorizontal size={"20px"} />
            <Input
              type="text"
              placeholder={`Category ${i+1}`}
              width={"300px"}
              value={el}
              onChange={(e) => handleChangeCategory(i, e.target.value)}
            />
            <button onClick={() => handleDeleteCategory(i)}>
              <b>X</b>
            </button>
          </div>
        ))}
        <Input
          type="text"
          width={"250px"}
          className="ml-[50px] mt-3"
          onBlur={(e) => handleAddCategory(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddCategory(e);
            }
          }}
          placeholder="Add Category (optional)"
        />
      </div>

      {/* rebner items */}
      <div className="w-[800px]">
        <h5 className="font-semibold my-3">Items</h5>
        {data?.items.map((el, i) => (
          <div
            draggable
            key={i}
            className="flex justify-between my-3"
            onDragStart={(e) => (ItemDragStart.current = i)}
            onDragEnter={() => (ItemDragEnd.current = i)}
            onDragEnd={handleItemsDrag}
          >
            <div className="flex items-center gap-3">
              <RxDragHandleHorizontal size={"20px"} />
              <Input
                type="text"
                placeholder={`Item ${i+1}`}
                width={"300px"}
                value={el.value}
                onChange={(e) => handleChangeItems(i, e.target.value)}
              />
              <button onClick={() => handleDeleteItems(i)}>
                <b>X</b>
              </button>
            </div>
            <Select
              width={"300px"}
              onChange={(e) => handleChangeItemsCategory(i, e.target.value)}
            >
              {data?.categories.map((e) => (
                <option key={e} value={e} selected={e == el.belong}>
                  {e}
                </option>
              ))}
            </Select>
          </div>
        ))}
        <Input
          type="text"
          width={"250px"}
          className="ml-[50px] mt-3"
          onBlur={(e) => handleAddItems(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddItems(e);
            }
          }}
          placeholder="Add items (optional)"
        />
      </div>
    </div>
  );
}

export default Categorize;