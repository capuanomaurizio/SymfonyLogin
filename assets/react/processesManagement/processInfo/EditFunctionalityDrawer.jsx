import {Button, Col, Drawer, Form, Input, message, Row, Space} from "antd";
import React from "react";
import {apiRequest} from "../../utils";

const EditFunctionalityDrawer = ({functionToEdit, openEditFunctionDrawer, setOpenEditFunctionDrawer,
                                 componentToEdit, setComponentToEdit, setProcess, updateRoot}) => {

    async function editFunction(values) {
        try {
            await apiRequest('editFunction', {'id': functionToEdit.id, 'newName': values.name});
            setComponentToEdit(prev => {
                const updatedComponent = {
                    ...prev,
                    functionalities: prev.functionalities.map(f =>
                        f.id === functionToEdit.id ? {...f, name: values.name} : f
                    ),
                };
                setProcess(prev => ({
                    ...prev,
                    component: updateRoot(prev.component, componentToEdit.id, updatedComponent)
                }));
                return updatedComponent;
            });
            message.success("Funzionalità del componente modificata!");
        }
        catch (e) {
            message.error("Funzionalità del componente non modificata")
        }
    }

    return(
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
    )
}

export default EditFunctionalityDrawer;
