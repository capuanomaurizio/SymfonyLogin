import {Avatar, Button, Card, List, message, Space} from "antd";
import {DeleteOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
import React from "react";
import {apiRequest} from "../utils";

const ProcessesList = ({processes, setProcesses, setHidden}) => {

    async function deleteProcess(id){
        try {
            await apiRequest('deleteProcess', {id});
            message.success("Processo eliminato con successo!");
            setProcesses(prev => prev.filter(process => process.id !== id));
        }
        catch (e) {
            message.error("Errore durante l'eliminazione del processo");
            console.error(e);
        }
    }

    return(
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
                            title={item.name}
                            description={item.id}
                        />
                        <Space size={"middle"}>
                            <Button variant="outlined" onClick={() => {window.location.href = "/collections/process/"+item.id}}>
                                <EditOutlined />
                            </Button>
                            <Button variant="outlined" color="danger" onClick={() => deleteProcess(item.id)}>
                                <DeleteOutlined />
                            </Button>
                        </Space>
                    </List.Item>
                )}
            />
        </Card>
    )
}

export default ProcessesList;
