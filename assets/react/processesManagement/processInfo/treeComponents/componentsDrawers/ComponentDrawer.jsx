import {Button, Drawer, Form, Input, Space, message, Switch} from "antd";
import {apiRequest, updateRootEdit, updateRootCreate} from "../../../../utils";
import React, {useEffect} from "react";

const ComponentDrawer = ({componentToEdit, setComponentToEdit, openComponentDrawer,setOpenComponentDrawer,
                             parentOfComponentToCreate, setProcess}) => {

    const [form] = Form.useForm();

    const handleClose = () => {
        setOpenComponentDrawer(false);
        setComponentToEdit(null);
        form.resetFields();
    }

    useEffect(() => {
        console.log(componentToEdit)
    }, [componentToEdit]);

    useEffect(() => {
        if (componentToEdit) {
            form.setFieldsValue({
                name: componentToEdit.name,
                isFeature: componentToEdit.isFeature,
            });
        } else {
            form.resetFields();
        }
    }, [componentToEdit, form]);

    async function createComponent(values) {
        const newComponent = await apiRequest('createComponent', {parentId: parentOfComponentToCreate.id, values});
        if(parentOfComponentToCreate?.isFeature)
            parentOfComponentToCreate.isFeature = false;
        setProcess(prev => ({
            ...prev,
            component: updateRootCreate(prev.component, parentOfComponentToCreate.id, newComponent)
        }));
        message.success("Componente creato!");
    }

    async function editComponent(values) {
        try{
            await apiRequest('editComponent', {id: componentToEdit.id, values});
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, componentToEdit.id, values)
            }));
            message.success("Componente modificato!");
        }
        catch (e) {
            message.error("Componente non modificato");
        }
    }

    return(
        <Drawer
            title={componentToEdit ? "Modifica componente "+componentToEdit?.name : "Crea nuovo componente"}
            width={620}
            onClose={handleClose}
            open={openComponentDrawer}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button htmlType="submit" form="componentDrawerForm" type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                labelWrap
                id="componentDrawerForm"
                onFinish={(values) => {
                    componentToEdit ? editComponent(values) : createComponent(values);
                    handleClose();
                }}
                initialValues={{isFeature: true}}
            >
                <Form.Item
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    name="name"
                    label="Nome"
                    rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                >
                    <Input placeholder="Nuovo nome del componente" />
                </Form.Item>
                {(componentToEdit?.isFeature || !componentToEdit) && <Form.Item
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        name="isFeature"
                        label="Caratteristica"
                        valuePropName="checked"
                    >
                        <Switch defaultChecked/>
                    </Form.Item>
                }
            </Form>
        </Drawer>
    )
}

export default ComponentDrawer;
