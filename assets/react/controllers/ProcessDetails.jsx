import {
    Button, Card, Collapse, ConfigProvider, Form, Input, message, Steps, Drawer, Space, Col, Row, Dropdown
} from "antd";
import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";

export default function ProcessDetails({ processId }) {

    const [componentToEdit, setComponentToEdit] = useState(null)
    const [componentToCreate, setComponentToCreate] = useState(null)
    const [processes, setProcesses] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [current, setCurrent] = useState(0);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);
    const [openCreateDrawer, setOpenCreateDrawer] = useState(false);

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
                ) : ( <></> )}
            </>
        ),
        extra: genExtra(component, component.id)
    });

    function genExtra(component, id) {
        const items = [
            {
                key: '1',
                label: (
                    <a onClick={(e) => {e.stopPropagation(); setComponentToEdit(findComponentById(component, id)); setOpenEditDrawer(true);}}>
                        Modifica
                    </a>
                ),
                icon: <EditOutlined />,
            },
            {
                key: '2',
                label: (
                    <a onClick={(e) => {e.stopPropagation(); setComponentToCreate(findComponentById(component, id)); setOpenCreateDrawer(true);}}>
                        Aggiungi figlio
                    </a>
                ),
                icon: <FileAddOutlined />,
            },
            {
                key: '3',
                label: (
                    <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                        Elimina
                    </a>
                ),
                icon: <DeleteOutlined/>,
            },
        ];
        return (
            <Dropdown menu={{items}}>
                <a onClick={e => e.stopPropagation()}>
                    <Space>
                        Opzioni
                        <DownOutlined/>
                    </Space>
                </a>
            </Dropdown>
        )
    }

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
    }

    async function createComponent(nameObj) {
        await apiRequest('createComponent', {'parent_id' : componentToCreate.id, 'name': nameObj.name});
        setRefreshKey(refreshKey + 1);
        message.success("Componente creato!");
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
            <Drawer
                key={refreshKey}
                title={"Modifica componente "+componentToEdit?.name}
                width={920}
                onClose={() => setOpenEditDrawer(false)}
                open={openEditDrawer}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={() => setOpenEditDrawer(false)}>Cancel</Button>
                        <Button htmlType="submit" form="editComponentForm" type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" requiredMark={false}
                    id="editComponentForm"
                    onFinish={(nameObj) => {
                        editComponent(nameObj);
                        setOpenEditDrawer(false);
                    }}>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                            >
                                <Input placeholder="Nuovo nome del componente" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>


            <Drawer
                title={"Crea nuovo componente"}
                width={920}
                onClose={() => setOpenCreateDrawer(false)}
                open={openCreateDrawer}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={() => setOpenCreateDrawer(false)}>Cancel</Button>
                        <Button htmlType="submit" form="createComponentForm" type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" requiredMark={false}
                    id="createComponentForm"
                    onFinish={(nameObj) => {
                        createComponent(nameObj);
                        setOpenCreateDrawer(false);
                    }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Nuovo nome del componente' }]}
                            >
                                <Input placeholder="Please enter user name" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
            </>
        )}
        </>
    );
}
