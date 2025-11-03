import {Button, Col, Drawer, Form, Input, Row, Space, message} from "antd";
import {apiRequest, updateRootEdit, updateRootCreate} from "../../../utils";
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
        if (componentToEdit) {
            form.setFieldsValue({
                name: componentToEdit.name,
            });
        } else {
            form.resetFields();
        }
    }, [componentToEdit, form]);

    async function createComponent(values) {
        const newComponent = await apiRequest('createComponent', {'parentId': parentOfComponentToCreate.id, 'name': values.name});
        setProcess(prev => ({
            ...prev,
            component: updateRootCreate(prev.component, parentOfComponentToCreate.id, newComponent)
        }));
        message.success("Componente creato!");
    }

    async function editComponent(values) {
        try{
            await apiRequest('editComponent', {'id': componentToEdit.id, 'newName': values.name});
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
            width={920}
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
                layout="vertical" requiredMark={false}
                id="componentDrawerForm"
                onFinish={(values) => {
                    componentToEdit ? editComponent(values) : createComponent(values);
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
        </Drawer>
    )
}

export default ComponentDrawer;
