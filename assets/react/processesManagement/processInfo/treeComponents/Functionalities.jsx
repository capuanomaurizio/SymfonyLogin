import {Dropdown, List, Space} from "antd";
import Requirements from "./Requirements";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
import React from "react";

const Functionalities = ({functionalities, showRequirements}) => {

    function functionalityOptions(functionality) {
        const items = [
            {
                key: 'edit',
                label: 'Modifica funzione',
                icon: <EditOutlined />,
            },
            {
                key: 'add',
                label: 'Aggiungi funzione',
                icon: <FileAddOutlined />,
            },
            {
                key: 'delete',
                label: 'Elimina funzione',
                icon: <DeleteOutlined />,
            },
        ];
        const handleMenuClick = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === 'edit') {

            } else if (key === 'add') {

            } else if (key === 'delete') {

            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={e => e.stopPropagation()}>
                    <Space style={{ color: "deeppink" }}>
                        Funzione
                        <DownOutlined/>
                    </Space>
                </a>
            </Dropdown>
        )
    }

    return(
        <div style={{ marginLeft: 48, marginTop: 0, marginBottom: 12 }}>
            <List
                size="small"
                bordered={false}
                split={false}
                dataSource={functionalities}
                style={{
                    background: "transparent",
                    fontSize: 13,
                }}
                renderItem={(func) => (
                    <List.Item
                        style={{
                            padding: "2px 0",
                            border: "none",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ opacity: 0.85, fontWeight: 500 }}>{func.name}</span>
                            {functionalityOptions(func)}
                        </div>
                        <div style={{ width: "100%" }}>
                            {showRequirements && func.requirements?.length > 0 && (
                                <Requirements requirements={func.requirements} />
                            )}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Functionalities;
