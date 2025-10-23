import React, {useEffect} from "react";
import {Button, Card, Form, Input, Select, Space} from "antd";
import {apiRequest} from "../utils";

export default function UserProfile({ user }) {

    user = JSON.parse(user)

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(user); // popola i campi
    }, [user, form]);

    async function sendEdits(values) {
        await apiRequest('editUser', values);
        window.location.reload();
    }

    const selectOptions = user.roles.map(role => ({
        label: role,
        value: role
    }));

    return(
        <Card title="Modifica profilo utente" >
            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                onFinish={sendEdits}
            >
                <Form.Item
                    label="Nome utente"
                    name="name"
                    rules={[{ required: true, message: "Inserisci il nome dell'utente!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Cognome utente"
                    name="surname"
                    rules={[{ required: true, message: "Inserisci il cognome dell'utente!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Inserisci l'email dell'utente!" }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label="Ruoli"
                    name="roles"
                    rules={[{ required: true, message: "Seleziona almeno un ruolo per l'utente!" }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Seleziona ruoli per l'utente"
                        options={selectOptions}
                    />
                </Form.Item>
                <Form.Item label={null}>
                    <Space size="middle">
                        <Button type="primary" htmlType="submit">
                            Modifica
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}
