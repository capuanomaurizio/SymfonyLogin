import { Dropdown, List, Space } from "antd";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
import React from "react";

const Requirements = ({ requirements }) => {
    const requirementOptions = (requirement) => {
        const items = [
            {
                key: "edit",
                label: "Modifica requisito",
                icon: <EditOutlined />,
            },
            {
                key: 'add',
                label: 'Aggiungi requisito',
                icon: <FileAddOutlined />,
            },
            {
                key: "delete",
                label: "Elimina requisito",
                icon: <DeleteOutlined />,
            },
        ];

        const handleMenuClick = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === 'edit') {

            } else if (key === 'add') {

            } else if (key === 'delete') {

            }        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={(e) => e.stopPropagation()}>
                    <Space style={{color: "rebeccapurple"}}>
                        Requisito
                        <DownOutlined style={{ fontSize: 10 }} />
                    </Space>
                </a>
            </Dropdown>
        );
    };

    return (
        <div
            style={{
                marginLeft: 32,
                marginTop: 4,
                marginBottom: 4,
                display: "block",
            }}
        >
            <List
                size="small"
                bordered={false}
                split={false}
                itemLayout="horizontal"
                dataSource={requirements}
                style={{
                    background: "transparent",
                    fontSize: 13,
                }}
                renderItem={(req) => (
                    <List.Item
                        style={{
                            padding: "2px 0",
                            border: "none",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <span style={{ opacity: 0.85 }}>
                                {req.content}{" "}<i style={{ color: "#888" }}>({req.requirementType})</i>
                            </span>
                            {requirementOptions(req)}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Requirements;
