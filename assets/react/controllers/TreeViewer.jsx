import { Tree } from "antd";
import React from 'react';

const transformComponent = (component) => ({
    title: component.name,
    key: component.id,
    children: (component.children_components || []).map(transformComponent),
});

const transformProcesses = (processes) =>
    processes.map((process) => ({
        title: process.name, // nome del processo
        key: process.id,
        children: process.component ? [transformComponent(process.component)] : [],
    }));

export default function TreeViewer({ processes }) {

    const treeData = transformProcesses(JSON.parse(processes));

    return (
        <Tree
            treeData={treeData}
            defaultExpandAll
            showLine
            selectable
            onSelect={(keys, info) => console.log("Nodo selezionato:", info.node)}
        />
    );
}
