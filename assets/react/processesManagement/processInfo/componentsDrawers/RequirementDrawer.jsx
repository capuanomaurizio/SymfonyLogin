import {Button, Drawer, Form, Input, message, Select, Space} from "antd";
import React, {useEffect} from "react";
import {apiRequest, updateRootEdit} from "../../../utils";

const FunctionalityDrawer = ({setProcess, requirementToEdit, setRequirementToEdit, openRequirementDrawer, setOpenRequirementDrawer}) => {

    const [form] = Form.useForm();

    const handleClose = () => {
        setOpenRequirementDrawer(false);
        setRequirementToEdit({'component': null, 'functionality': null, 'requirement': null});
        form.resetFields();
    }

    useEffect(() => {
        if (requirementToEdit.requirement) {
            form.setFieldsValue({
                content: requirementToEdit.requirement.content || "",
                type: requirementToEdit.requirement.requirementType === 'Control factor' ? 'ControlFactor' : 'Functional' || "",
            });
        } else {
            form.resetFields();
        }
    }, [requirementToEdit, form]);

    async function createRequirement(values) {
        try {
            const newRequirement = await apiRequest('createRequirement',
                {'functionalityId': requirementToEdit.functionality.id, 'values': values});
            const updatedComponent = {
                ...requirementToEdit.component,
                functionalities: requirementToEdit.component.functionalities.map(func => {
                    if (func.id === requirementToEdit.functionality.id) {
                        return {
                            ...func,
                            requirements: [...(func.requirements || []), newRequirement],
                        };
                    }
                    return func;
                }),
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, requirementToEdit.component.id, updatedComponent)
            }));
            message.success("Funzionalità aggiunta al componente!");
        }
        catch (e) {
            console.error(e)
            message.error("Funzionalità non aggiunta al componente")
        }
    }

    async function editRequirement(values) {
        try {
            const editedRequirement = await apiRequest('editRequirement',
                {'requirementId': requirementToEdit.requirement.id, 'values': values});
            const updatedComponent = {
                ...requirementToEdit.component,
                functionalities: requirementToEdit.component.functionalities.map(func => {
                    if (func.id === requirementToEdit.functionality.id) {
                        return {
                            ...func,
                            requirements: requirementToEdit.functionality.requirements.map(r =>
                                r.id === requirementToEdit.requirement.id ? editedRequirement : r
                            ),
                        };
                    }
                    return func;
                }),
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, requirementToEdit.component.id, updatedComponent)
            }));
            message.success("Requisito della funzione aggiornato!");
        }
        catch (e) {
            console.error(e)
            message.error("Requisito della funzione non aggiornato")
        }
    }

    return(
        <Drawer
            title={requirementToEdit?.requirement ?
                "Modifica requisito "+requirementToEdit.requirement?.id :
                "Crea nuovo requisito per "+requirementToEdit.functionality?.name}
            width={620}
            onClose={handleClose}
            open={openRequirementDrawer}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button htmlType="submit" form="requirementDrawerForm"  variant="solid" color="purple">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                labelWrap
                id="requirementDrawerForm"
                onFinish={(values) => {
                    requirementToEdit.requirement ? editRequirement(values) : createRequirement(values);
                    handleClose()
                }}
            >
                <Form.Item
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    label={'Contenuto: '}
                    name='content'
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: "Inserisci il contenuto del requisito",
                        },
                    ]}
                >
                    <Input placeholder="Contenuto del requisito" />
                </Form.Item>
                <Form.Item
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    label={'Tipologia: '}
                    name='type'
                    rules={[
                        { required: true, message: 'Seleziona una tipologia' },
                    ]}
                >
                    <Select
                        placeholder="Tipologia di requisito"
                        options={[
                            { value: 'ControlFactor', label: 'Control factor' },
                            { value: 'Functional', label: 'Functional' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default FunctionalityDrawer;
