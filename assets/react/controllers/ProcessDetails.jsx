import {Button, Card, Collapse, ConfigProvider, Form, Input, message, Steps, Tree} from "antd";
import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import {CloseOutlined, EditOutlined} from "@ant-design/icons";

export default function ProcessDetails({ processId }) {

    const [componentToEdit, setComponentToEdit] = useState(null)
    const [processes, setProcesses] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [current, setCurrent] = useState(0);

    function findComponentById(component, id) {
        if (component.id === id) return component;
        for (const child of component.children_components || []) {
            const result = findComponentById(child, id);
            if (result) return result;
        }
        return null;
    }

    const transformComponent = (component) => ({
        key: component.id,
        label: component.name,
        children: (
            <>
                {component.children_components?.length > 0 ? (
                    <Collapse
                        ghost
                        items={component.children_components.map(transformComponent)}
                    />
                ) : (<></>)}
            </>
        ),
        extra: genExtra(component, component.id)
    });

    const genExtra = (component, id) => (
        <Button onClick={event => {
            event.stopPropagation();
            setComponentToEdit(findComponentById(component, id))
        }}>
            <EditOutlined/>
        </Button>
    );

    const fetchProcesses = () => {
        apiRequest('processesList')
            .then(result => {
                setProcesses(JSON.parse(result))
            })
            .catch(console.error);
    }

    useEffect(() => {
        fetchProcesses();
    }, [refreshKey]);

    if (!processes || processes.length === 0) {
        return <p>Caricamento dei dettagli del processo...</p>;
    }

    if(!processes.some(obj => obj.id === processId)){
        message.error("Il processo cercato è inesistente").then(() => window.location.href = "/collections/processes");
        return <></>
    }

    const process = processes.find(obj => obj.id === processId);
    const treeData = process.component ? [transformComponent(process.component)] : [];

    async function editProcess(nameObj) {
        await apiRequest('editProcess', {'id' : process.id, 'new_name': nameObj.name});
        setRefreshKey(refreshKey + 1);
        message.success("Nome del processo modificato!")
    }

    async function editComponent(nameObj) {
        await apiRequest('editComponent', {'id' : componentToEdit.id, 'new_name': nameObj.name});
        setRefreshKey(refreshKey + 1);
        message.success("Nome del componente modificato!");
        setComponentToEdit(null)
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
            <Card title={"Processo "+process.id} style={{ minHeight: '35vh' }} key={refreshKey} >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    autoComplete="off"
                    onFinish={(nameObj) => editProcess(nameObj)}
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
            <>
                <ConfigProvider
                    theme={{
                        components: {
                            Collapse: {
                                headerBg: '#fff',
                                contentBg: '#fff',
                                headerPadding: '8px 16px',
                            },
                        },
                    }}
                >
                    <Collapse
                        items={treeData}
                    />
                </ConfigProvider>
                {componentToEdit === null ? (
                    <></>
                    ) : (
                    <Card
                        title={"Componente "+componentToEdit.id}
                        style={{ minHeight: '35vh', marginTop: '1rem' }}
                        extra={<Button onClick={() => setComponentToEdit(null)} >
                                    <CloseOutlined/>
                                </Button>}
                        key={refreshKey}>
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            autoComplete="off"
                            onFinish={(nameObj) => editComponent(nameObj)}
                        >
                            <Form.Item
                                label="Nome componente"
                                name="name"
                                rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                            >
                                <Input placeholder={componentToEdit.name}/>
                            </Form.Item>
                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit">
                                    Modifica
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    )}
            </>
        )}
        </>
    );
}
