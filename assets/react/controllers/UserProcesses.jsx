import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import NewProcessForm from "../processesManagement/UserProcesses/NewProcessForm";
import ProcessesList from "../processesManagement/UserProcesses/ProcessesList";

const transformProcesses = (processes) =>
    processes.map((process) => ({
        name: process.name,
        id: process.id,
    }));

const transformComponents = (components) => {
    const childIds = new Set(
        components.flatMap((c) =>
            (c.childrenComponents || []).map((child) => child.id)
        )
    );
    const roots = components.filter((c) => !childIds.has(c.id));
    const buildTree = (comp) => ({
        value: comp.id,
        title: comp.name,
        children: (comp.childrenComponents || []).map(buildTree),
    });
    return roots.map(buildTree);
};

export default function UserProcesses() {

    const [components, setComponents] = useState(null);
    const [processes, setProcesses] = useState([]);
    const [hidden, setHidden] = useState(true);

    const fetchProcesses = () => {
        apiRequest('processesList')
            .then(result => {
                setProcesses(transformProcesses(JSON.parse(result)));
            })
            .catch(console.error);
    }

    const fetchComponents = () => {
        apiRequest('componentsList')
            .then(result => {
                setComponents(transformComponents(JSON.parse(result)));
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchComponents();
        fetchProcesses();
    }, []);

    if (!processes || processes.length === 0)
        return <p>Caricamento dei processi dell'utente...</p>;

    return (
        <>
            <ProcessesList processes={processes} setProcesses={setProcesses} setHidden={setHidden}></ProcessesList>
            <NewProcessForm isHidden={hidden} setHidden={setHidden} components={components}></NewProcessForm>
        </>
    );
}
