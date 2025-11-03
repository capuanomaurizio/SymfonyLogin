import {Button, Col, Drawer, Form, Input, message, Row, Select, Space} from "antd";
import React, {useEffect} from "react";
import {apiRequest, updateRootEdit} from "../../../utils";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const FunctionalityDrawer = ({setProcess, functionalityToEdit, setFunctionalityToEdit, openFunctionalityDrawer, setOpenFunctionalityDrawer}) => {

    const [form] = Form.useForm();

    const handleClose = () => {
        setOpenFunctionalityDrawer(false);
        setFunctionalityToEdit({'component': null, 'functionality': null});
        form.resetFields();
    }

    useEffect(() => {
        if (functionalityToEdit.functionality) {
            form.setFieldsValue({
                name: functionalityToEdit.functionality.name || "",
                requirements: functionalityToEdit.functionality.requirements?.map(r => ({
                    content: r.content || "",
                    type: r.type === 'Control factor' ? 'ControlFactor' : 'Functional' || "",
                    id: r.id
                })) || [],
            });
        } else {
            form.resetFields();
        }
    }, [functionalityToEdit, form]);

    async function createFunction(values) {
        try {
            const newFunction = await apiRequest('createFunction',
                {'componentId': functionalityToEdit.component.id, 'values': values});
            const updatedComponent = {
                ...functionalityToEdit.component,
                functionalities: [...(functionalityToEdit.component.functionalities || []), newFunction]
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, functionalityToEdit.component.id, updatedComponent)
            }));
            message.success("Funzionalità aggiunta al componente!");
        }
        catch (e) {
            console.error(e)
            message.error("Funzionalità non aggiunta al componente")
        }
    }

    async function editFunction(values) {
        try {
            const editedFunction = await apiRequest('editFunction',
                {'functionId': functionalityToEdit.functionality.id, 'values': values});
            const updatedComponent = {
                ...functionalityToEdit.component,
                functionalities: functionalityToEdit.component.functionalities.map(f =>
                    f.id === functionalityToEdit.functionality.id ? editedFunction : f
                ),
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, functionalityToEdit.component.id, updatedComponent)
            }));
            message.success("Funzionalità del componente modificata!");
        }
        catch (e) {
            message.error("Funzionalità del componente non modificata")
        }
    }

    return(
        <Drawer
            title={functionalityToEdit.functionality ?
                "Modifica funzione "+functionalityToEdit?.functionality.name :
                "Crea nuova funzione"}
            width={620}
            closable={false}
            onClose={handleClose}
            open={openFunctionalityDrawer}
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
                    functionalityToEdit.functionality ? editFunction(values) : createFunction(values);
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
                                                        style={{ width: '30%', marginLeft: 5 }}
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

export default FunctionalityDrawer;
