import React, {useEffect, useState} from 'react';
import {Button, message, Space, Table, Tag, Typography} from 'antd';
const { Text, Link } = Typography;

async function changeUserStatus(email) {
    try {
        await fetch('/api/changeUserStatus', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ "email": email})
        });
        window.location.reload();
    } catch (err) {
        message.error('Errore nella ricezione dei dati');
        console.error(err);
    }
}

const columns = [
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: text => <b>{text}</b>,
    },
    {
        title: 'Nome',
        dataIndex: 'name',
        key: 'nome',
    },
    {
        title: 'Cognome',
        dataIndex: 'surname',
        key: 'cognome',
    },
    {
        title: 'Data registrazione',
        dataIndex: 'createdAt',
        key: 'data_registrazione',
    },
    {
        title: 'Ruoli',
        key: 'ruoli',
        dataIndex: 'roles',
        render: (_, { roles }) => (
            <>
                {roles.map(role => {
                    let color = role.length > 5 ? 'geekblue' : 'green';
                    return (
                        <Tag color={color} key={role}>
                            {role.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Stato',
        key: 'stato',
        render: (_, record) => (
            <>
                {record.enabled ? (
                    <Text type="success">Abilitato</Text>
                ) : (
                    <Text type="danger">Disabilitato</Text>
                )}
            </>
        ),
    },
    {
        title: 'Azione',
        key: 'azione',
        render: (_, record) => (
            <Space size="middle">
                {record.enabled ? (
                    <Button color="danger" variant="solid" onClick={() => changeUserStatus(record.email)}>Disabilita utente</Button>
                ) : (
                    <Button color="green" variant="solid" onClick={() => changeUserStatus(record.email)}>Abilita utente</Button>
                )}
            </Space>
        ),
    },
];

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/userslist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                message.error('Errore nella ricezione dei dati');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="email"
            loading={loading}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default UsersList;
