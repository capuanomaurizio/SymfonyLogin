import React, {useState} from "react";
import {Button, Table, Typography} from "antd";
import {BranchesOutlined, CheckOutlined} from "@ant-design/icons";
import {apiRequest} from "../../../utils";

const { Text } = Typography;

const MatrixSelector = ({ component, components = [] }) => {
    const [selectedCells, setSelectedCells] = useState(new Set());

    const toggleCell = (key) => {
        setSelectedCells((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };

    async function sendSelection(){
        try{
            await apiRequest("componentPairs", selectedCells);
        }
        catch (e) {

        }
    }

    const data = components;
    const dataSource = data.map((row) => ({
        key: row.id,
        label: row.name,
    }));

    const columns = [
        {
            title: "",
            dataIndex: "label",
            key: "label",
            fixed: "left",
            width: 180,
            render: (text) => <Text strong>{text}</Text>,
        },
        ...data.map((col) => ({
            title: col.name,
            dataIndex: col.id,
            key: col.id,
            align: "center",
            render: (_, record) => {
                const key = `${record.key}-${col.id}`;
                const rowIndex = data.findIndex(r => r.id === record.key);
                const colIndex = data.findIndex(c => c.id === col.id);

                if (colIndex >= rowIndex) return null;

                const isSelected = selectedCells.has(key);
                return (
                    <div
                        onClick={() => toggleCell(key)}
                        style={{
                            cursor: "pointer",
                            padding: "6px 10px",
                            textAlign: "center",
                            background: isSelected ? "#1677ff33" : "#fff",
                            border: "1px solid #ddd",
                            borderRadius: 4,
                            transition: "all 0.15s ease",
                        }}
                    >
                        {isSelected ? <CheckOutlined/> : "-"}
                    </div>
                );
            },
        })),
    ];

    return (
        <>
            <div
                style={{
                    backgroundColor: "#fafafa",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px 8px 0px 0px",
                    padding: 16,
                    textAlign: "right",
                }}
            >
                <Button type='primary'>
                    Invia selezioni <BranchesOutlined/>
                </Button>
            </div>
            <div style={{ overflowX: "auto", background: "#fff", padding: 16, borderRadius: "0px 0px 8px 8px" }}>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    bordered
                    size="small"
                    scroll={{ x: "max-content" }}
                />
            </div>
        </>
    );
};

export default MatrixSelector;
