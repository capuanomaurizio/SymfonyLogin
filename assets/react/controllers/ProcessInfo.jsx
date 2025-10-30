import {message} from "antd";
import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import StepsNavigator from "../processesManagement/ProcessInfo/StepsNavigator";
import ProcessDetails from "../processesManagement/ProcessInfo/ProcessDetails"
import ComponentsTree from "../processesManagement/ProcessInfo/ComponentsTree";
import EditComponentDrawer from "../processesManagement/ProcessInfo/EditComponentDrawer";
import CreateComponentDrawer from "../processesManagement/ProcessInfo/CreateComponentDrawer";

export default function ProcessInfo({ processId }) {

    const [process, setProcess] = useState(null);
    const [page, setPage] = useState(0);

    const [componentToEdit, setComponentToEdit] = useState(null)
    const [functionToEdit, setFunctionToEdit] = useState(null)
    const [functionToDelete, setFunctionToDelete] = useState(null)
    const [parentOfComponentToCreate, setParentOfComponentToCreate] = useState(null)

    const [openEditDrawer, setOpenEditDrawer] = useState(false);
    const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
    const [openEditFunctionDrawer, setOpenEditFunctionDrawer] = useState(false);
    const [openNewFunctionDrawer, setOpenNewFunctionDrawer] = useState(false);

    const fetchProcesses = () => {
        apiRequest('processesList')
            .then(result => {
                if(!JSON.parse(result).find(obj => obj.id === processId))
                    message.error("Il processo cercato è inesistente").then(() => window.location.href = "/collections/processes");
                setProcess(JSON.parse(result).find(obj => obj.id === processId))
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchProcesses();
    }, []);

    if (!process) {
        return <p>Caricamento dei dettagli del processo...</p>;
    }

    return (
        <>
        <StepsNavigator page={page} setPage={setPage}></StepsNavigator>
        {page === 0 ? (
            <ProcessDetails process={process} setProcess={setProcess}></ProcessDetails>
        ) : (
            <>
            <ComponentsTree
                process={process}
                setProcess={setProcess}
                setComponentToEdit={setComponentToEdit}
                setOpenEditDrawer={setOpenEditDrawer}
                setParentOfComponentToCreate={setParentOfComponentToCreate}
                setOpenCreateDrawer={setOpenCreateDrawer}
                setOpenEditFunctionDrawer={setOpenEditFunctionDrawer}
                setFunctionToEdit={setFunctionToEdit}
                setFunctionToDelete={setFunctionToDelete}
            ></ComponentsTree>
            <EditComponentDrawer
                componentToEdit={componentToEdit}
                setComponentToEdit={setComponentToEdit}
                functionToEdit={functionToEdit}
                setFunctionToEdit={setFunctionToEdit}
                openEditDrawer={openEditDrawer}
                setOpenEditDrawer={setOpenEditDrawer}
                openNewFunctionDrawer={openNewFunctionDrawer}
                setOpenNewFunctionDrawer={setOpenNewFunctionDrawer}
                openEditFunctionDrawer={openEditFunctionDrawer}
                setOpenEditFunctionDrawer={setOpenEditFunctionDrawer}
                setProcess={setProcess}
                functionToDelete={functionToDelete}
            ></EditComponentDrawer>
            <CreateComponentDrawer
                parentOfComponentToCreate={parentOfComponentToCreate}
                openCreateDrawer={openCreateDrawer}
                setOpenCreateDrawer={setOpenCreateDrawer}
                setProcess={setProcess}
            ></CreateComponentDrawer>
            </>
        )}
        </>
    );
}
