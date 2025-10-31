import {Button, Col, Drawer, Form, Input, List, Row, Space, message} from "antd";
import {DeleteOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
import {apiRequest} from "../../utils";
import React, {useEffect} from "react";
import EditFunctionalityDrawer from "./EditFunctionalityDrawer";
import CreateFunctionalityDrawer from "./CreateFunctionalityDrawer";

function updateRoot(component, idToUpdate, updatedFields) {
    if (component.id === idToUpdate) return { ...component, ...updatedFields };
    if (component.childrenComponents && component.childrenComponents.length > 0) {
        component.childrenComponents = component.childrenComponents
            .map(child => updateRoot(child, idToUpdate, updatedFields))
            .filter(child => child !== null);
    }
    return component;
}

const EditComponentDrawer = ({componentToEdit, setComponentToEdit, functionToEdit, setFunctionToEdit, openEditDrawer, setOpenEditDrawer, functionToDelete,
                             openNewFunctionDrawer, setOpenNewFunctionDrawer, openEditFunctionDrawer, setOpenEditFunctionDrawer, setProcess}) => {

    const [form] = Form.useForm();

    const handleClose = () => {
        setOpenEditDrawer(false);
        form.resetFields();
    }

    async function editComponent(values) {
        try{
            await apiRequest('editComponent', {'id': componentToEdit.id, 'newName': values.name});
            setProcess(prev => ({
                ...prev,
                component: updateRoot(prev.component, componentToEdit.id, values)
            }));
            message.success("Componente modificato!");
        }
        catch (e) {
            message.error("Componente non modificato");
        }
    }

    async function deleteFunction(id) {
        try {
            await apiRequest('deleteFunction', {'componentId': componentToEdit.id, 'functionId': id});
            setComponentToEdit(prev => {
                const updatedComponent = {
                    ...prev,
                    functionalities: prev.functionalities.filter(f => f.id !== id)
                };
                setProcess(prev => ({
                    ...prev,
                    component: updateRoot(prev.component, componentToEdit.id, updatedComponent)
                }));
                return updatedComponent;
            });
            message.success("Funzione rimossa dal componente!");
        }
        catch (e) {
            message.error("Funzionalità non rimossa dal componente");
        }
    }

    useEffect(() => {
        if(functionToDelete)
            deleteFunction(functionToDelete.id);
    }, [functionToDelete])

    return(
        <Drawer
            title={"Modifica componente "+componentToEdit?.name}
            width={920}
            onClose={handleClose}
            open={openEditDrawer}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button htmlType="submit" form="editComponentForm" type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical" requiredMark={false}
                id="editComponentForm"
                onFinish={(values) => {
                    editComponent(values);
                    handleClose();
                }}
            >
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
                itemLayout="horizontals"
                dataSource={componentToEdit?.functionalities || []}
                renderItem={(functionality) => (
                    <List.Item key={functionality.id} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <List.Item.Meta
                            title={functionality.name}
                        />
                        <Space size={"middle"}>
                            <Button variant="outlined" onClick={() => {
                                setFunctionToEdit(componentToEdit?.functionalities.find(obj => obj.id === functionality.id));
                                setOpenEditFunctionDrawer(true)
                            }}>
                                <EditOutlined />
                            </Button>
                            <Button variant="outlined" color="danger" onClick={ () => deleteFunction(functionality.id) }>
                                <DeleteOutlined />
                            </Button>
                        </Space>
                        </div>
                        {functionality.requirements?.length > 0 && (
                            <>
                            <strong>Requisiti della funzione: </strong>
                            <ul style={{ listStyleType: 'none' }}>
                                {functionality.requirements.map((req) => (
                                    <li key={req.id}><strong>{req.requirementType}</strong> {req.content}</li>
                                ))}
                            </ul>
                            </>
                        )}
                    </List.Item>
                )}
            />
            <EditFunctionalityDrawer
                functionToEdit={functionToEdit}
                openEditFunctionDrawer={openEditFunctionDrawer}
                setOpenEditFunctionDrawer={setOpenEditFunctionDrawer}
                componentToEdit={componentToEdit}
                setComponentToEdit={setComponentToEdit}
                setProcess={setProcess}
                updateRoot={updateRoot}
            ></EditFunctionalityDrawer>
            <CreateFunctionalityDrawer
                openNewFunctionDrawer={openNewFunctionDrawer}
                setOpenNewFunctionDrawer={setOpenNewFunctionDrawer}
                componentToEdit={componentToEdit}
                setComponentToEdit={setComponentToEdit}
                setProcess={setProcess}
                updateRoot={updateRoot}
            ></CreateFunctionalityDrawer>
        </Drawer>
    )
}

export default EditComponentDrawer;
