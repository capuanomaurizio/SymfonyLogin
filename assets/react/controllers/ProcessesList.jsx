import React, {useState} from 'react';
import {Avatar, Button, Card, Form, Input, List} from "antd";
import {EditFilled, FileAddFilled} from "@ant-design/icons";
import {apiRequest} from "../utils";


const transformProcesses = (processes) =>
    processes.map((process) => ({
        title: process.name,
        key: process.id,
    }));

function createProcess(nameObj){
    apiRequest('createProcess', nameObj);
}
export default function ProcessesList({ processes }) {

    const data = transformProcesses(JSON.parse(processes));
    const [hidden, setHidden] = useState(true);

    return (
        <>
        <Card title="Lista dei processi dell'utente" style={{ marginBottom: '1rem' }} >
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index+5}`} />}
                            title={item.title}
                            description={item.key}
                        />
                        <Button variant="outlined" onClick={() => {window.location.href = "/collections/process/"+item.key}}>
                            <EditFilled />
                        </Button>
                    </List.Item>
                )}
            >
                <List.Item>
                    <List.Item.Meta
                        title="Crea un nuovo processo"
                    />
                    <Button variant="solid" color="green" onClick={() => {setHidden(false)}}>
                        <FileAddFilled />
                    </Button>
                </List.Item>
            </List>
        </Card>
        <Card title="Crea nuovo processo" hidden={hidden} >
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
        </>
    );
}
