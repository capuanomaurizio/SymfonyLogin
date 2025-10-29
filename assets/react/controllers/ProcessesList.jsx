import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Form, Input, List, message, Space} from "antd";
import {CloseOutlined, DeleteOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
import {apiRequest} from "../utils";

const transformProcesses = (processes) =>
    processes.map((process) => ({
        title: process.name,
        key: process.id,
    }));

function createProcess(nameObj){
    apiRequest('createProcess', nameObj).then(result => {
        if (result?.redirect) {
            window.location.href = result.redirect;
        } else {
            console.error('No redirect URL returned from API');
        }
    }).catch(console.error);
}

export default function ProcessesList() {

    const [processes, setProcesses] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchProcesses = () => {
        apiRequest('processesList')
            .then(result => {
                setProcesses(transformProcesses(JSON.parse(result)));
            })
            .catch(console.error);
    }

    function deleteProcess(id){
        apiRequest('deleteProcess', {id: id});
        message.success("Processo eliminato con successo!")
        setRefreshKey(refreshKey + 1);
    }

    useEffect(() => {
        fetchProcesses();
    }, [refreshKey]);

    if (!processes || processes.length === 0) {
        return <p>Caricamento dei processi dell'utente...</p>;
    }

    return (
        <>
        <Card
            title="Lista dei processi dell'utente"
            style={{ marginBottom: '1rem' }}
            extra={
                <Button variant="solid" color="green" onClick={() => {setHidden(false)}}>
                    Nuovo processo
                    <FileAddOutlined />
                </Button>
            }
        >
            <List
                itemLayout="horizontal"
                dataSource={processes}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index+5}`} />}
                            title={item.title}
                            description={item.key}
                        />
                        <Space size={"middle"}>
                            <Button variant="outlined" onClick={() => {window.location.href = "/collections/process/"+item.key}}>
                                <EditOutlined />
                            </Button>
                            <Button variant="outlined" color="danger" onClick={() => deleteProcess(item.key)}>
                                <DeleteOutlined />
                            </Button>
                        </Space>
                    </List.Item>
                )}
            />
        </Card>
        <Card
            title="Crea nuovo processo"
            hidden={hidden}
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
        </>
    );
}
