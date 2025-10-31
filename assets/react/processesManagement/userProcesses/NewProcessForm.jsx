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
                        <Form.Item
                            label="Informazioni di contesto"
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
                            rules={[{ required: true, message: "Seleziona componente radice del processo" }]}
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
                        <Form.Item
                            label="Requisiti"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
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
                                                            message: "Inserisci le informazioni del requisito o eliminalo",
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                        <Input
                                                            placeholder="Contenuto del requisito"
                                                            style={{ width: '50%' }}
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
                                                        style={{ width: '35%', marginLeft: 5 }}
                                                        options={[
                                                            { value: 'UnintendedOutput', label: 'Unintended output' },
                                                            { value: 'NonFunctional', label: 'Non functional' },
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
