import {Button, Card, Col, DatePicker, Form, Input, message, Row, TreeSelect} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import React from "react";
import {apiRequest} from "../../utils";

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
                autoComplete="off"
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
                        <Form.Item
                            label="Descrizione"
                            name="contextInformation"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                        >
                            <Input.TextArea placeholder="Descrizione del processo" />
                        </Form.Item>
                        <Form.Item
                            label="Prospetto termine"
                            name="expirationDate"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                        >
                            <DatePicker></DatePicker>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Componente radice"
                            name="rootId"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            <TreeSelect
                                showSearch
                                filterTreeNode={(input, treeNode) =>
                                    treeNode.title.toLowerCase().includes(input.toLowerCase())
                                }
                                style={{ width: '100%' }}
                                styles={{
                                    popup: { root: { maxHeight: 400, overflow: 'auto' } },
                                }}
                                placeholder="Seleziona il componente radice"
                                allowClear
                                treeDefaultExpandAll
                                treeData={components}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label={null}>
                    <Button block variant="outlined" color="green" htmlType="submit">
                        Crea processo
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default newProcessForm;
