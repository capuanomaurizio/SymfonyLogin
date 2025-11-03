import {Button, Col, Drawer, Form, Input, message, Row, Select, Space} from "antd";
import React, {useEffect} from "react";
import {apiRequest} from "../../utils";
import {PlusOutlined} from "@ant-design/icons";

const EditFunctionalityDrawer = ({functionToEdit, openEditFunctionDrawer, setOpenEditFunctionDrawer,
                                 componentToEdit, setComponentToEdit, setProcess, updateRoot}) => {

    const [form] = Form.useForm();

    useEffect(() => {
        if (functionToEdit) {
            form.setFieldsValue({
                name: functionToEdit.name || "",
                requirements: functionToEdit.requirements?.map(r => ({
                    content: r.content || "",
                    type: r.type === 'Control factor' ? 'ControlFactor' : 'Functional' || "",
                    id: r.id
                })) || [],
            });
        } else {
            form.resetFields();
        }
    }, [functionToEdit, form]);

    const handleClose = () => {
        setOpenEditFunctionDrawer(false);
        form.resetFields();
    }

    async function editFunction(values) {
        try {
            const editedFunction = await apiRequest('editFunction', {'functionId': functionToEdit.id, 'values': values});
            setComponentToEdit(prev => {
                const updatedComponent = {
                    ...prev,
                    functionalities: prev.functionalities.map(f =>
                        f.id === functionToEdit.id ? editedFunction : f
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
            onClose={handleClose}
            open={openEditFunctionDrawer}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button htmlType="submit" form="editFunctionForm" type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                id="editFunctionForm"
                onFinish={(values) => {
                    editFunction(values);
                    handleClose()
                }}
            >
                <Row gutter={16}>
                    <Col span={18}>
                        <Form.Item
                            name="name"
                            label="Nome"
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
                                                <Form.Item
                                                    name={[name, 'id']}
                                                    hidden
                                                    noStyle
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

export default EditFunctionalityDrawer;
