import {message} from "antd";
import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import StepsNavigator from "../processesManagement/processInfo/StepsNavigator";
import ProcessDetails from "../processesManagement/processInfo/ProcessDetails"
import ComponentDrawer from "../processesManagement/processInfo/componentsDrawers/ComponentDrawer";
import Components from "../processesManagement/processInfo/treeComponents/Components";
import FunctionalityDrawer from "../processesManagement/processInfo/componentsDrawers/FunctionalityDrawer";
import RequirementDrawer from "../processesManagement/processInfo/componentsDrawers/RequirementDrawer";

export default function ProcessInfo({ processId }) {

    const [process, setProcess] = useState(null);
    const [page, setPage] = useState(0);
    const [collapsedComponents, setCollapsedComponents] = useState([]);

    const [parentOfComponentToCreate, setParentOfComponentToCreate] = useState(null)

    const [componentToEdit, setComponentToEdit] = useState(null)
    const [functionalityToEdit, setFunctionalityToEdit] = useState({'component': null, 'functionality': null})
    const [requirementToEdit, setRequirementToEdit] = useState({'component': null, 'functionality': null, 'requirement': null})

    const [openComponentDrawer, setOpenComponentDrawer] = useState(false);
    const [openFunctionalityDrawer, setOpenFunctionalityDrawer] = useState(false);
    const [openRequirementDrawer, setOpenRequirementDrawer] = useState(false);

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
        <StepsNavigator page={page} setPage={setPage} />
        {page === 0 ? (
            <ProcessDetails process={process} setProcess={setProcess} />
        ) : page === 1 ? (
            <>
                <Components
                    process={process}
                    setProcess={setProcess}
                    setParentOfComponentToCreate={setParentOfComponentToCreate}
                    collapsedComponents={collapsedComponents}
                    setCollapsedComponents={setCollapsedComponents}
                    setComponentToEdit={setComponentToEdit}
                    setFunctionalityToEdit={setFunctionalityToEdit}
                    setOpenComponentDrawer={setOpenComponentDrawer}
                    setOpenFunctionalityDrawer={setOpenFunctionalityDrawer}
                    setRequirementToEdit={setRequirementToEdit}
                    setOpenRequirementDrawer={setOpenRequirementDrawer}
                />
                <ComponentDrawer
                    setProcess={setProcess}
                    parentOfComponentToCreate={parentOfComponentToCreate}
                    componentToEdit={componentToEdit}
                    setComponentToEdit={setComponentToEdit}
                    openComponentDrawer={openComponentDrawer}
                    setOpenComponentDrawer={setOpenComponentDrawer}
                />
                <FunctionalityDrawer
                    setProcess={setProcess}
                    functionalityToEdit={functionalityToEdit}
                    setFunctionalityToEdit={setFunctionalityToEdit}
                    openFunctionalityDrawer={openFunctionalityDrawer}
                    setOpenFunctionalityDrawer={setOpenFunctionalityDrawer}
                />
                <RequirementDrawer
                    setProcess={setProcess}
                    requirementToEdit={requirementToEdit}
                    setRequirementToEdit={setRequirementToEdit}
                    openRequirementDrawer={openRequirementDrawer}
                    setOpenRequirementDrawer={setOpenRequirementDrawer}
                />
            </>
        ) : (
            <>

            </>
        )}
        </>
    );
}
