import {Button, Card, Col, DatePicker, Form, Input, message, Row, Select, TreeSelect} from "antd";
import {CloseOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
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

const newProcessForm = ({isHidden, setHidden, components}) => {
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
                layout={"horizontal"}
                labelWrap
                onFinish={(values) => createProcess(values)}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Nome processo"
                            name="name"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                        >
                            <Input placeholder='Nome del processo'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item>
                            <Button variant="outlined" color="green" htmlType="submit">
                                Crea processo
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default newProcessForm;
