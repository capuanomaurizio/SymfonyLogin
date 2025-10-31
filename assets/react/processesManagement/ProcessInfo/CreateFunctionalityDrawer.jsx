import {Button, Col, Drawer, Form, Input, message, Row, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React from "react";
import {apiRequest} from "../../utils";

const CreateFunctionalityDrawer = ({openNewFunctionDrawer, setOpenNewFunctionDrawer,
                                   componentToEdit, setComponentToEdit, setProcess, updateRoot}) => {

    async function createFunction(values) {
        try {
            setOpenNewFunctionDrawer(false);
            const newFunction = await apiRequest('createFunction', {
                'componentId': componentToEdit.id,
                'values': values
            });
            setComponentToEdit(prev => {
                const updatedComponent = {
                    ...prev,
                    functionalities: [...prev.functionalities, newFunction]
                };
                setProcess(prev => ({
                    ...prev,
                    component: updateRoot(prev.component, componentToEdit.id, updatedComponent)
                }));
                return updatedComponent;
            });
            message.success("Funzionalità aggiunta al componente!");
        }
        catch (e) {
            message.error("Funzionalità non aggiunta al componente")
        }
    }

    return(
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
                      setOpenNewFunctionDrawer(false);
                  }}>
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name="name"
                            label="Nome"
                            rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                        >
                            <Input placeholder="Nome della funzione" />
                        </Form.Item>
                        <Form.Item
                            label="Requisiti"
                            required={false}
                        >
                            <Form.List name="requirements">
                                {(fields, { add, remove }) => (
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
                                                            message: "Inserisci le informazioni del requisito o eliminalo",
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder="Contenuto del requisito"
                                                        style={{ width: '50%' }}
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
                                                        style={{ width: '35%', marginLeft: 5 }}
                                                        options={[
                                                            { value: 'ControlFactor', label: 'Control factor' },
                                                            { value: 'Functional', label: 'Functional' },
                                                        ]}
                                                    />
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(name)}
                                                />
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

export default CreateFunctionalityDrawer;
