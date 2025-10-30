import {Button, Col, Drawer, Form, Input, message, Row, Space} from "antd";
import React from "react";
import {apiRequest} from "../../utils";

function updateRoot(component, parentId, newComponent) {
    if (component.id === parentId) return { ...component, childrenComponents: [...component.childrenComponents, newComponent] };
    if (component.childrenComponents && component.childrenComponents.length > 0) {
        component.childrenComponents = component.childrenComponents
            .map(child => updateRoot(child, parentId, newComponent))
            .filter(child => child !== null);
    }
    return component;
}

const CreateComponentDrawer = ({parentOfComponentToCreate, openCreateDrawer, setOpenCreateDrawer, setProcess}) => {

    async function createComponent(values) {
        const newComponent = await apiRequest('createComponent', {'parentId': parentOfComponentToCreate.id, 'name': values.name});
        setProcess(prev => ({
            ...prev,
            component: updateRoot(prev.component, parentOfComponentToCreate.id, newComponent)
        }));
        message.success("Componente creato!");
    }

    return(
        <Drawer
            title={"Crea nuovo componente figlio di "+parentOfComponentToCreate?.name}
            width={920}
            onClose={() => setOpenCreateDrawer(false)}
            open={openCreateDrawer}
            extra={
                <Space>
                    <Button onClick={() => setOpenCreateDrawer(false)}>Cancel</Button>
                    <Button htmlType="submit" form="createComponentForm" type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" requiredMark={false}
                  id="createComponentForm"
                  onFinish={(values) => {
                      createComponent(values);
                      setOpenCreateDrawer(false);
                  }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Nome"
                            rules={[{ required: true, message: 'Non lasciare il campo vuoto' }]}
                        >
                            <Input placeholder="Nome del nuovo componente" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    )
}

export default CreateComponentDrawer;
