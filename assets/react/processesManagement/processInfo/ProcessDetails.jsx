import {apiRequest} from "../../utils";
import {Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Switch} from "antd";
import React, {useState} from "react";
import {EditOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const ProcessDetails = ({ process, setProcess }) => {

    const [form] = Form.useForm();
    const [enabledForm, setEnabledForm] = useState(false);

    async function editProcess(values) {
        try{
            const result = await apiRequest('editProcess', {'id': process.id, values});
            setProcess(result)
            message.success("Processo modificato!")
        }
        catch (e) {
            console.error(e)
            message.error("Processo non modificato")
        }
    }

    return (
        <Card title={"Processo "+process.name} style={{ minHeight: '35vh' }}
              extra={
                  <Switch
                      checkedChildren={<EditOutlined />}
                      unCheckedChildren={<EditOutlined />}
                      checked={enabledForm}
                      onChange={() => setEnabledForm(!enabledForm)}
                  />
              }>
            <Form
                form={form}
                disabled={!enabledForm}
                labelWrap
                initialValues={{
                    name: process.name,
                    contextInformation: process.contextInformation ? process.contextInformation : "",
                    expirationDate: process.expirationDate ? dayjs(process.expirationDate) : null,
                    requirements: process.requirements?.map(r => ({
                        content: r.content || "",
                        type: r.type === 'Unintended output' ? 'UnintendedOutput' : 'NonFunctional' || "",
                        id: r.id
                    })) || [],
                }}
                onFinish={(values) => {editProcess(values); setEnabledForm(false)}}
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
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Informazioni di contesto"
                            name="contextInformation"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                        >
                            <Input.TextArea />
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
                <Form.Item label={null} hidden={!enabledForm}>
                    <Button block variant="outlined" color="green" htmlType="submit">
                        Modifica processo
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ProcessDetails;
