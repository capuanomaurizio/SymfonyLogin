import {Button, Col, Drawer, Form, Input, List, Row, Space, message} from "antd";
import {DeleteOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
import {apiRequest} from "../../utils";

function updateRoot(component, idToUpdate, updatedFields) {
    if (component.id === idToUpdate) return { ...component, ...updatedFields };
    if (component.children_components && component.children_components.length > 0) {
        component.children_components = component.children_components
            .map(child => updateRoot(child, idToUpdate, updatedFields))
            .filter(child => child !== null);
    }
    return component;
}

const EditComponentDrawer = ({componentToEdit, setComponentToEdit, functionToEdit, setFunctionToEdit, openEditDrawer, setOpenEditDrawer,
                             openNewFunctionDrawer, setOpenNewFunctionDrawer, openEditFunctionDrawer, setOpenEditFunctionDrawer, setProcess}) => {

    async function editComponent(values) {
        try{
            await apiRequest('editComponent', {'id': componentToEdit.id, 'new_name': values.name});
            setProcess(prev => ({
                ...prev,
                component: updateRoot(prev.component, componentToEdit.id, values)
            }));
            message.success("Nome del componente modificato!");
        }
        catch (e) {
            message.error("Nome del componente non modificato");
        }
    }

    async function createFunction(values) {
        setOpenNewFunctionDrawer(false);
        const newFunction = await apiRequest('createFunction', {'component_id': componentToEdit.id, 'name': values.name});
        setComponentToEdit(prev => ({
            ...prev,
            functionalities: [...prev.functionalities, newFunction]
        }));
        setProcess(prev => ({
            ...prev,
            component: updateRoot(prev.component, componentToEdit.id, componentToEdit)
        }));
        message.success("Funzione aggiunta al componente!");
    }

    async function editFunction(values) {
        await apiRequest('editFunction', {'id': functionToEdit.id, 'new_name': values.name});
        setComponentToEdit(prev => ({
            ...prev,
            functionalities: prev.functionalities.map(f =>
                f.id === functionToEdit.id ? { ...f, name: values.name } : f
            ),
        }));
        setProcess(prev => ({
            ...prev,
            component: updateRoot(prev.component, componentToEdit.id, componentToEdit)
        }));
        message.success("Nome della funzione modificato!");
    }

    async function deleteFunction(id) {
        await apiRequest('deleteFunction', {'component_id': componentToEdit.id, 'function_id': id});
        setComponentToEdit(prev => ({
            ...prev,
            functionalities: prev.functionalities.filter(f => f.id !== id)
        }));
        setProcess(prev => ({
            ...prev,
            component: updateRoot(prev.component, componentToEdit.id, componentToEdit)
        }));
        message.success("Funzione rimossa dal componente!");
    }

    return(
        <Drawer
            title={"Modifica componente "+componentToEdit?.name}
            width={920}
            onClose={() => {setOpenEditDrawer(false)}}
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
                  onFinish={(values) => {
                      editComponent(values);
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
                      onFinish={(values) => {
                          editFunction(values);
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
            <Drawer
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
                      onFinish={(values) => {
                          createFunction(values);
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
        </Drawer>
    )
}

export default EditComponentDrawer;
