import { Input, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, {useRef } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { RxDragHandleHorizontal } from "react-icons/rx";

function Comprehension({ data, ind, question, setQuestions }) {
  // refs to store drag values
  const QuestionDragStart = useRef(0);
  const QuestionDragEnd = useRef(0);
  const OptionDragStart = useRef(0);
  const OptionDragEnd = useRef(0);

  const toast = useToast()

  function handlePassageChange(e) {
    // function to change passage
    let newdata = [...question];
    newdata[ind].passage = e.target.value;
    setQuestions(newdata);
  }

  function AddSubquestion() {
    // function to add new question
    let newdata = [...question];
    newdata[ind].questions.push({
      question: "",
      option: ["", ""],
      answer: "",
    });
    setQuestions(newdata);
  }

  function DeleteSubquestion(i) {
    // function to delete subquestion by index
    let newdata = [...question];
    if (newdata[ind].questions.length == 1) {
      return;
    }
    newdata[ind].questions.splice(i, 1);
    setQuestions(newdata);
  }

  function EditSubQuestion(i, value) {
    // edit question of subquation
    let newdata = [...question];
    newdata[ind].questions[i].question = value;
    setQuestions(newdata);
  }


  //option functions
  //*********************************************************************************** */
  function handleDeleteOption(i, x) {
    // delete option of mcq by index
    let newdata = [...question];
    if (newdata[ind].questions[i].option.length == 1) {
      return;
    }
    newdata[ind].questions[i].option.splice(x, 1);
    setQuestions(newdata);
  }

  function handleAddOption(i, e) {
    // add option to question
    if (e.target.value != "") {
      let newdata = [...question];
      // if it inculdes categories already the dont add
      if (!newdata[ind].questions[i].option.includes(e.target.value)) {
        let newdata = [...question];
        newdata[ind].questions[i].option.push(e.target.value);
        setQuestions(newdata);
        e.target.value = "";
      }
    }
  }
  function handleChangeOption(i, x, value) {
    let newdata = [...question];
    newdata[ind].questions[i].option[x] = value;
    newdata[ind].questions[i].answer = value;
    setQuestions(newdata);
  }
  //*********************************************************************************** */


  // drag function
  //*********************************************************************************** */
  function handleQuestionDrag() {
    let newdata = [...question];
    // swaping drag start and end values
    let temp = newdata[ind].questions[QuestionDragStart.current];
    newdata[ind].questions[QuestionDragStart.current] =
      newdata[ind].questions[QuestionDragEnd.current];
    newdata[ind].questions[QuestionDragEnd.current] = temp;

    setQuestions([...newdata]);
  }
  function handleOptionDrag(i) {
    let newdata = [...question];
    // swaping drag start and end values
    let temp = newdata[ind].questions[i].option[OptionDragStart.current];
    newdata[ind].questions[i].option[OptionDragStart.current] =
      newdata[ind].questions[i].option[OptionDragEnd.current];
    newdata[ind].questions[i].option[OptionDragEnd.current] = temp;

    setQuestions([...newdata]);
  }
  //*********************************************************************************** */


  //habdle checkbocx change 
  function handleCheckbox(i, value) {
    let newdata = [...question];
    newdata[ind].questions[i].answer = value;
    setQuestions([...newdata]);
  }

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

  // upload image 
  async function uploadImage(e) {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "ztww0s1s");
    try {
      ShowToast('image uploading...')
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
      <h5 className="my-3 mt-0 font-semibold"> Question {ind + 1}</h5>
      <label htmlFor="question">Passage :</label>
      <Textarea
        id="question"
        rows={4}
        marginTop={"5px"}
        defaultValue={data.passage}
        onChange={handlePassageChange}
        placeholder="Add passage here..."
      />

      {/* for image  selection */}
      <div
        onClick={() => document.getElementById(`${ind}getFile`).click()}
        className="text-center p-1 my-3 h-[70px] w-[200px] overflow-hidden border-2 border-gray flex flex-col justify-center rounded-xl cursor-pointer"
      >
        <h4 className="font-bold text-blue-500 text-[15px] flex justify-center items-center gap-3">
          <IoCloudUploadOutline size={"25px"} /> <span>Image ( Optional )</span>
        </h4>
        <p className="overflow-hidden whitespace-nowrap">{data.image}</p>
        <input
          type="file"
          onChange={uploadImage}
          id={`${ind}getFile`}
          style={{ display: "none" }}
        />
      </div>

      {/* render mcqs */}
      <div>
        {data?.questions.map((el, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => (QuestionDragStart.current = i)}
            onDragEnter={() => (QuestionDragEnd.current = i)}
            onDragEnd={handleQuestionDrag}
            className="questionCard relative my-5 w-[90%] m-auto  border-2 rounded-lg p-5 border-gray-300"
          >
            <h4 className="flex gap-1 items-center font-semibold mb-3">
              <RxDragHandleHorizontal size={"25px"} /> Question {ind + 1}.
              {i + 1}
            </h4>
            <Input
              type="text"
              placeholder="Add Question here"
              value={el.question}
              onChange={(e) => EditSubQuestion(i, e.target.value)}
            />
            <div>
              {el.option.map((op, x) => (
                <div key={x}
                  draggable
                  onDragStart={(e) => (OptionDragStart.current = x)}
                  onDragEnter={() => (OptionDragEnd.current = x)}
                  onDragEnd={() => handleOptionDrag(i)}
                  className="flex items-center gap-3 my-3 ml-5"
                >
                  <RxDragHandleHorizontal size={"25px"} />
                  <input
                    checked={el.answer == op && op != ""}
                    onChange={() => handleCheckbox(i, op)}
                    name="question"
                    type="checkbox"
                    className="w-[25px] h-[25px]"
                  />
                  <Input
                    type="text"
                    width={"300px"}
                    placeholder={`option ${x+1}`}
                    value={op}
                    onChange={(e) => handleChangeOption(i, x, e.target.value)}
                  />
                  <button onClick={() => handleDeleteOption(i, x)}>
                    <b>X</b>
                  </button>
                </div>
              ))}
              {/* if option is less then 4 then show this add option input */}
              {el.option.length < 4 ? (
                <Input
                  type="text"
                  className="ml-[100px]"
                  width={"300px"}
                  placeholder="Add Option (optional)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddOption(i, e);
                    }
                  }}
                  onBlur={(e) => handleAddOption(i, e)}
                />
              ) : null}
            </div>
            <button
              onClick={() => DeleteSubquestion(i)}
              className=" py-5 px-5 absolute right-[-50px] top-[50%] translate-y-[-50%]"
            >
              <MdDeleteOutline size={"25px"} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={AddSubquestion}
        className="py-1 px-3 block m-auto rounded-md bg-green-300 font-semibold"
      >
        Add SubQuestion
      </button>
    </div>
  );
}

export default Comprehension;
