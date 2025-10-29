import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import NewProcessForm from "../processesManagement/NewProcessForm";
import ProcessesList from "../processesManagement/ProcessesList";

const transformProcesses = (processes) =>
    processes.map((process) => ({
        name: process.name,
        id: process.id,
    }));

export default function UserProcesses() {

    const [processes, setProcesses] = useState([]);
    const [hidden, setHidden] = useState(true);

    const fetchProcesses = () => {
        apiRequest('processesList')
            .then(result => {
                setProcesses(transformProcesses(JSON.parse(result)));
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchProcesses();
    }, []);

    if (!processes || processes.length === 0)
        return <p>Caricamento dei processi dell'utente...</p>;

    return (
        <>
            <ProcessesList processes={processes} setProcesses={setProcesses} setHidden={setHidden}></ProcessesList>
            <NewProcessForm isHidden={hidden} setHidden={setHidden}></NewProcessForm>
        </>
    );
}
