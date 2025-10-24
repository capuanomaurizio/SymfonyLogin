import {Button, Card, Form, Input, message, Steps, Tree} from "antd";
import React, {useState} from 'react';
import {apiRequest} from "../utils";

const transformComponent = (component) => ({
    title: component.name,
    key: component.id,
    children: (component.children_components || []).map(transformComponent),
});

const transformProcesses = (processes) =>
    processes.map((process) => ({
        title: process.name,
        key: process.id,
    }));

function findComponentById(dataSet, processId, componentId) {
    const process = dataSet.find(p => p.id === processId);
    if (!process) return null;

    function searchComponent(component) {
        if (component.id === componentId) return component;

        for (const child of component.children_components || []) {
            const result = searchComponent(child);
            if (result) return result;
        }
        return null;
    }

    return searchComponent(process.component);
}

export default function ProcessComponents({ processTree }) {

    const rawData = JSON.parse(processTree);
    if(rawData.length === 0)
        message.error("Processo cercato inesistente");
    const process = rawData[0];
    const treeData = [transformComponent(process.component)];

    const [current, setCurrent] = useState(0);



    async function editComponent(nameObj) {
        //const found = findComponentById(rawData, process.key, component.key);
        //found.name = nameObj.name
        console.log(await apiRequest('editComponent', rawData));
    }

    return (
        <>
        <Steps
            type="navigation"
            style={{ backgroundColor: 'white', borderRadius: 10, marginBottom: '1rem' }}
            current={current}
            onChange={(value) => setCurrent(value)}
            items={[
                {
                    status: 'process',
                    title: 'Informazioni processo',
                },
                {
                    status: 'process',
                    title: 'Componenti processo',
                },
            ]}
        />
        {current === 0 ? (
            <Card title={"Processo "+process.id} style={{ minHeight: '35vh' }} >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    onFinish={(nameObj) => editComponent(nameObj)}
                >
                    <Form.Item
                        label="Nome processo"
                        name="name"
                        rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                    >
                        <Input placeholder={process.name}/>
                    </Form.Item>
                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Modifica
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        ) : (
            <Tree
                key={current}
                treeData={treeData}
                defaultExpandAll={true}
                showLine
                selectable
                //onSelect={(keys, info) => {setComponent(info.node); setCurrent(2)}}
                style={{ minHeight: '35vh' }}
            />
        )}
        </>
    );
}
