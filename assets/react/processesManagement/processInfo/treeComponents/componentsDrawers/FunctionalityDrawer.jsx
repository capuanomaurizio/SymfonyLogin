import {Button, Drawer, Form, Input, message, Space} from "antd";
import React, {useEffect} from "react";
import {apiRequest, updateRootEdit} from "../../../../utils";

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
                "Modifica funzione "+functionalityToEdit.functionality?.name :
                "Crea nuova funzione per "+functionalityToEdit.component?.name}
            width={620}
            onClose={handleClose}
            open={openFunctionalityDrawer}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button htmlType="submit" form="functionalityDrawerForm" variant="solid" color={'pink'}>
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                labelWrap
                id="functionalityDrawerForm"
                onFinish={(values) => {
                    functionalityToEdit.functionality ? editFunction(values) : createFunction(values);
                    handleClose()
                }}
            >
                <Form.Item
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    name="name"
                    label="Nome"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: "Inserisci il contenuto del requisito",
                        },
                    ]}
                >
                    <Input placeholder="Nuovo nome della funzione" />
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default FunctionalityDrawer;
