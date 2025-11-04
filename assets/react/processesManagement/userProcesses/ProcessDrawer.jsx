import {Button, Drawer, Form, Input, message, Space} from "antd";
import React from "react";
import {apiRequest} from "../../utils";
import '../../../styles/NewProcessForm.css'

function createProcess(values){
    apiRequest('createProcess', values).then(result => {
        if (result?.redirect) {
            window.location.href = result.redirect;
        } else {
            message.error('Creazione del processo fallita');
        }
    }).catch(console.error);
}

const ProcessDrawer = ({openProcessDrawer, setOpenProcessDrawer}) => {

    const [form] = Form.useForm();

    const handleClose = () => {
        setOpenProcessDrawer(false)
        form.resetFields()
    }

    return(
        <Drawer
            title='Crea nuovo processo'
            width={620}
            onClose={handleClose}
            open={openProcessDrawer}
            extra={
                <Space>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="solid" color="green" form={'processDrawerForm'} htmlType="submit">
                        Crea processo
                    </Button>
                </Space>
            }
        >
            <Form
                layout={"horizontal"}
                form={form}
                name={'processDrawerForm'}
                labelWrap
                onFinish={(values) => createProcess(values)}
            >
                <Form.Item
                    label="Nome processo"
                    name="name"
                    rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                >
                    <Input placeholder='Nome del processo'/>
                </Form.Item>
            </Form>
        </Drawer>
    )
}

export default ProcessDrawer;
