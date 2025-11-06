import {apiRequest} from "../../../utils";
import {Button, Card, DatePicker, Form, Input, message, Space, Switch} from "antd";
import React, {useState} from "react";
import {EditOutlined} from "@ant-design/icons";
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
                <Space size="middle">
                    {enabledForm && (
                        <Button variant="solid" form="editProcessForm" color="green" htmlType="submit">
                            Modifica processo
                        </Button>
                    )}
                    <Switch
                        checkedChildren={<EditOutlined />}
                        unCheckedChildren={<EditOutlined />}
                        checked={enabledForm}
                        onChange={() => setEnabledForm(!enabledForm)}
                    />
                </Space>
            }>
            <Form
                form={form}
                name="editProcessForm"
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
                <Form.Item
                    label="Nome processo"
                    name="name"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Informazioni di contesto"
                    name="contextInformation"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Prospetto termine"
                    name="expirationDate"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                >
                    <DatePicker></DatePicker>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ProcessDetails;
