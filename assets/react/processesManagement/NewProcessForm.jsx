import {Button, Card, Form, Input, message} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import React from "react";
import {apiRequest} from "../utils";

function createProcess(nameObj){
    apiRequest('createProcess', nameObj).then(result => {
        if (result?.redirect) {
            window.location.href = result.redirect;
        } else {
            message.error('Creazione del processo fallita');
        }
    }).catch(console.error);
}

const newProcessForm = ({isHidden, setHidden}) => {
    return(
        <Card
            title="Crea nuovo processo"
            hidden={isHidden}
            extra={
                <Button variant="dashed" onClick={() => {setHidden(true)}}>
                    <CloseOutlined />
                </Button>
            }
        >
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                onFinish={(nameObj) => createProcess(nameObj)}
            >
                <Form.Item
                    label="Nome processo"
                    name="name"
                    rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                >
                    <Input placeholder='Nome del processo'/>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="default" htmlType="submit">
                        Salva
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default newProcessForm;
