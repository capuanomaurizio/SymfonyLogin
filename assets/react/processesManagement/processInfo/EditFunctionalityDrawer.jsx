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
                        <Form.Item
                            label="Requisiti"
                            required={false}
                        >
                            <Form.List name="requirements">
                                {(fields, { add }) => (
                                    <>
                                        {fields.map(({ key, name}) => (
                                            <Form.Item required={false} key={key}>
                                                <Form.Item
                                                    name={[name, 'content']}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message: "Inserisci le informazioni del requisito",
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder="Contenuto del requisito"
                                                        style={{ width: '55%' }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    name={[name, 'type']}
                                                    rules={[
                                                        { required: true, message: 'Seleziona una tipologia' },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Select
                                                        placeholder="Tipologia di requisito"
                                                        style={{ width: '40%', marginLeft: 5 }}
                                                        options={[
                                                            { value: 'ControlFactor', label: 'Control factor' },
                                                            { value: 'Functional', label: 'Functional' },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        ))}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                style={{ width: '100%' }}
                                                icon={<PlusOutlined />}
                                            >
                                                Aggiungi requisito
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    )
}

export default EditFunctionalityDrawer;
