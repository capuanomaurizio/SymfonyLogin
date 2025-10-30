import {apiRequest} from "../../utils";
import {Button, Card, Form, Input, message} from "antd";

const ProcessDetails = ({ process, setProcess }) => {

    async function editProcess(nameObj) {
        try{
            const result = await apiRequest('editProcess', {'id': process.id, 'new_name': nameObj.name});
            setProcess(result)
            message.success("Processo modificato!")
        }
        catch (e) {
            message.error("Processo non modificato")
        }

    }

    return (
        <Card title={"Processo "+process.name} style={{ minHeight: '35vh' }} >
            <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                autoComplete="off"
                onFinish={(nameObj) => editProcess(nameObj)}
            >
                <Form.Item
                    label="Nome processo"
                    name="name"
                    rules={[{ required: true, message: "Non lasciare vuoto il campo" }]}
                >
                    <Input placeholder={process.name}/>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Modifica
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ProcessDetails;
