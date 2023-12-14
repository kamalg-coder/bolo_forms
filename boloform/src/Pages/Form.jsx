import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React from "react";
import CreateForm from "../Components/CreateForm";
import { useNavigate, useParams } from "react-router-dom";

function AddForm() {
  const params = useParams()

  return (
    <div>
      <h1 className="text-blue-500 text-center text-[30px] font-semibold">
        {params.action=='New'?"New":"Edit"}  Form
      </h1>
      <div className="w-[95%] m-auto max-w-[1100px]  max-xl:ml-[1%]">
        <CreateForm />
      </div>
    </div>
  );
}

export default AddForm;
