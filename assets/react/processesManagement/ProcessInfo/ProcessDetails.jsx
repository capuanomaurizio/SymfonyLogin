import {apiRequest} from "../../utils";
import moment from "moment";
import {Button, Card, Col, DatePicker, Form, Input, message, Row, Switch} from "antd";
import React, {useState} from "react";
import {EditOutlined} from "@ant-design/icons";

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
                      defaultChecked={false}
                      onChange={() => setEnabledForm(!enabledForm)}
                  />
              }>
            <Form
                form={form}
                disabled={!enabledForm}
                autoComplete="off"
                initialValues={{
                    name: process.name,
                    contextInformation: process.contextInformation,
                    expirationDate: moment(process.expirationDate)
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
                            label="Descrizione"
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
