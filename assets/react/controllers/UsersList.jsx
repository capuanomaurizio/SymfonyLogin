import {apiRequest} from '../utils'
import React, {useEffect, useState} from 'react';
import {Button, Space, Table, Tag} from 'antd';
import {EditFilled, UserAddOutlined, UserDeleteOutlined} from "@ant-design/icons";

const UsersList = ({ onEditClick }) => {

    const [users, setUsers] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setUsers(await apiRequest('userslist').finally(() => {setLoading(false)}));
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    async function changeUserStatus(email) {
        await apiRequest('changeUserStatus', { "email": email });
        setRefreshKey(refreshKey + 1);
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
                        let color;
                        switch (role) {
                            case 'UNABLED_USER':
                                color = 'red'; break;
                            case 'ADMIN_USER':
                                color = 'gold'; break;
                            case 'BASE_USER':
                                color = 'geekblue'; break;
                            default:
                                color = 'green'; break;
                        }
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
            title: 'Azione',
            key: 'azione',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => onEditClick(record)}><EditFilled /></Button>
                    {record.roles.includes('UNABLED_USER') ? (
                        <Button color="green" variant="solid" onClick={() => changeUserStatus(record.email)}><UserAddOutlined /></Button>
                    ) : (
                        <Button color="danger" variant="solid" onClick={() => changeUserStatus(record.email)}><UserDeleteOutlined /></Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="email"
            loading={loading}
            pagination={{ pageSize: 5 }}
        />
    );
};

export default UsersList;
