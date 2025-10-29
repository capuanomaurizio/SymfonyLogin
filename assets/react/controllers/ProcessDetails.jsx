import {
    Button, Card, Collapse, ConfigProvider, Form, Input, message, Steps, Drawer, Space, Col, Row, Dropdown, List, Avatar
} from "antd";
import React, {useEffect, useState} from 'react';
import {apiRequest} from "../utils";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddFilled, FileAddOutlined} from "@ant-design/icons";

export default function ProcessDetails({ processId }) {

    const [componentToEdit, setComponentToEdit] = useState(null)
    const [functionToEdit, setFunctionToEdit] = useState(null)
    const [componentToCreate, setComponentToCreate] = useState(null)
    const [processes, setProcesses] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [current, setCurrent] = useState(0);
    const [openEditDrawer, setOpenEditDrawer] = useState(false);
    const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
    const [openEditFunctionDrawer, setOpenEditFunctionDrawer] = useState(false);
    const [openNewFunctionDrawer, setOpenNewFunctionDrawer] = useState(false);

    function findComponentById(component, id) {
        if (component.id === id) return component;
        for (const child of component.children_components || []) {
            const result = findComponentById(child, id);
            if (result) return result;
        }
        return null;
    }

    function findParentComponent(component, childId) {
        if (!component?.children_components) return null;
        for (const child of component.children_components) {
            if (child.id === childId) return component;
            const found = findParentComponent(child, childId);
            if (found) return found;
        }
        return null;
    }

    const transformComponent = (component) => {
        const hasChildren = component.children_components?.length > 0;
        return {
            key: component.id,
            label: component.name,
            children: hasChildren ? (
                <Collapse
                    ghost
                    items={component.children_components.map(transformComponent)}
                />
                ) : null,
            extra: genExtra(component, component.id),
            collapsible: hasChildren ? undefined : 'disabled'
        }};

    function genExtra(component, id) {
        const items = [
            {
                key: 'edit',
                label: 'Modifica',
                icon: <EditOutlined />,
            },
            {
                key: 'add',
                label: 'Aggiungi',
                icon: <FileAddOutlined />,
            },
            {
                key: 'delete',
                label: 'Elimina',
                icon: <DeleteOutlined/>,
            },
        ];
        const handleMenuClick = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === 'edit') {
                setComponentToEdit(component);
                setOpenEditDrawer(true);
            } else if (key === 'add') {
                setComponentToCreate(component);
                setOpenCreateDrawer(true);
            } else if (key === 'delete') {
                deleteComponent(process.component, id)
            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
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
        await apiRequest('editProcess', {'id': process.id, 'new_name': nameObj.name});
        setRefreshKey(refreshKey + 1);
        message.success("Nome del processo modificato!")
    }

    async function createComponent(nameObj) {
        await apiRequest('createComponent', {'parent_id': componentToCreate.id, 'name': nameObj.name});
        setRefreshKey(refreshKey + 1);
        message.success("Componente creato!");
    }

    async function editComponent(nameObj) {
        await apiRequest('editComponent', {'id': componentToEdit.id, 'new_name': nameObj.name});
        setRefreshKey(refreshKey + 1);
        message.success("Nome del componente modificato!");
    }

    async function deleteComponent(root, id) {
        const parent = findParentComponent(root, id)
        await apiRequest('deleteComponent', {'parent_id': parent.id, 'id': id});
        setRefreshKey(refreshKey + 1);
        message.success("Componente eliminato!");
    }

    async function createFunction(nameObj) {
        setOpenNewFunctionDrawer(false);
        const newFunction = await apiRequest('createFunction', {'component_id': componentToEdit.id, 'name': nameObj.name});
        setComponentToEdit(prev => ({
            ...prev,
            functionalities: [...prev.functionalities, newFunction]
        }));
        message.success("Funzione aggiunta al componente!");
    }

    async function editFunction(nameObj) {
        await apiRequest('editFunction', {'id': functionToEdit.id, 'new_name': nameObj.name});
        setComponentToEdit(prev => ({
            ...prev,
            functionalities: prev.functionalities.map(f =>
                f.id === functionToEdit.id ? { ...f, name: nameObj.name } : f
            ),
        }));
        message.success("Nome della funzione modificato!");
    }

    async function deleteFunction(id) {
        await apiRequest('deleteFunction', {'component_id': componentToEdit.id, 'function_id': id});
        setComponentToEdit(prev => ({
            ...prev,
            functionalities: prev.functionalities.filter(f => f.id !== id)
        }));
        message.success("Funzione rimossa dal componente!");
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
            <Card title={"Processo "+process.name} style={{ minHeight: '35vh' }} key={refreshKey} >
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
                onClose={() => {setOpenEditDrawer(false); setRefreshKey(refreshKey+1)}}
                open={openEditDrawer}
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
                                label="Nome"
                                rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                            >
                                <Input placeholder="Nuovo nome del componente" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <List
                    header={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <b>Funzioni del componente</b>
                            <Button variant="solid" color="green" onClick={() => setOpenNewFunctionDrawer(true)}>
                                Nuova funzione
                                <FileAddOutlined />
                            </Button>
                        </div>
                    }
                    bordered
                    itemLayout="horizontal"
                    dataSource={componentToEdit?.functionalities || []}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                key={item.id}
                                title={item.name}
                            />
                            <Space size={"middle"}>
                                <Button variant="outlined" onClick={() => {
                                    setFunctionToEdit(componentToEdit?.functionalities.find(obj => obj.id === item.id));
                                    setOpenEditFunctionDrawer(true)
                                }}>
                                    <EditOutlined />
                                </Button>
                                <Button variant="outlined" color="danger" onClick={ () => deleteFunction(item.id) }>
                                    <DeleteOutlined />
                                </Button>
                            </Space>
                        </List.Item>
                    )}
                />
                <Drawer
                    title={"Modifica funzione "+functionToEdit?.name}
                    width={620}
                    closable={false}
                    onClose={() => setOpenEditFunctionDrawer(false)}
                    open={openEditFunctionDrawer}
                    extra={
                        <Space>
                            <Button onClick={() => setOpenEditFunctionDrawer(false)}>Cancel</Button>
                            <Button htmlType="submit" form="editFunctionForm" type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" requiredMark={false}
                          id="editFunctionForm"
                          onFinish={(nameObj) => {
                              editFunction(nameObj);
                              setOpenEditFunctionDrawer(false);
                          }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Nome"
                                    rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                                >
                                    <Input placeholder="Nuovo nome della funzione" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </Drawer>
            <Drawer
                key={openNewFunctionDrawer-5}
                title={"Nuova funzione di "+componentToEdit?.name}
                width={620}
                closable={false}
                onClose={() => setOpenNewFunctionDrawer(false)}
                open={openNewFunctionDrawer}
                extra={
                    <Space>
                        <Button onClick={() => setOpenNewFunctionDrawer(false)}>Cancel</Button>
                        <Button htmlType="submit" form="newFunctionForm" type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" requiredMark={false}
                      id="newFunctionForm"
                      onFinish={(nameObj) => {
                          createFunction(nameObj);
                          setOpenEditFunctionDrawer(false);
                      }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Nome"
                                rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                            >
                                <Input placeholder="Nome della funzione" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
            <Drawer
                key={refreshKey+1}
                title={"Crea nuovo componente"}
                width={920}
                onClose={() => setOpenCreateDrawer(false)}
                open={openCreateDrawer}
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
                                label="Nome"
                                rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                            >
                                <Input placeholder="Nome del nuovo componente" />
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
