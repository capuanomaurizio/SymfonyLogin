import React from "react";
import Components from "./treeComponents/Components";

const ComponentsTree = ({process, setProcess, setComponentToEdit, setOpenEditDrawer, setParentOfComponentToCreate,
                            setOpenCreateDrawer,setOpenEditFunctionDrawer, setFunctionToEdit, setFunctionToDelete}) => {

    return(
        <Components
            process={process}
            setProcess={setProcess}
            setComponentToEdit={setComponentToEdit}
            setOpenEditDrawer={setOpenEditDrawer}
            setParentOfComponentToCreate={setParentOfComponentToCreate}
            setOpenCreateDrawer={setOpenCreateDrawer}
            setOpenEditFunctionDrawer={setOpenEditFunctionDrawer}
            setFunctionToEdit={setFunctionToEdit}
            setFunctionToDelete={setFunctionToDelete}
        >
        </Components>
    )
}

export default ComponentsTree;
