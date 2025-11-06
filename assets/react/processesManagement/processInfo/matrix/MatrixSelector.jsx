import React, {useEffect, useState} from "react";
import {Button, message, Table, Typography} from "antd";
import {BranchesOutlined, CheckOutlined} from "@ant-design/icons";
import {apiRequest} from "../../../utils";

const { Text } = Typography;

const MatrixSelector = ({ components = [] }) => {
    const [selectedCells, setSelectedCells] = useState(new Set());

    useEffect(() => {
        async function fetchExistingPairs() {
            try {
                const res = await apiRequest("getAllComponentPairs");
                const newSet = new Set(
                    res.pairs.map((p) => JSON.stringify(p))
                );
                setSelectedCells(newSet);
            } catch (e) {
                message.error("Errore nel caricamento delle coppie esistenti");
            }
        }
        fetchExistingPairs();
    }, [components]);

    const toggleCell = (sourceId, targetId) => {
        setSelectedCells((prev) => {
            const newSet = new Set(prev);
            const key = JSON.stringify({ sourceId, targetId });
            if (newSet.has(key)) newSet.delete(key);
            else newSet.add(key);
            return newSet;
        });
    };

    async function uploadComponentPairs() {
        try {
            const pairs = Array.from(selectedCells).map((k) => JSON.parse(k));
            await apiRequest("uploadComponentPairs", { pairs });
            message.success("Selezioni inviate con successo!");
        } catch (e) {
            message.error("Errore durante l'invio delle selezioni");
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
                const rowId = record.key;
                const colId = col.id;

                const rowIndex = data.findIndex((r) => r.id === rowId);
                const colIndex = data.findIndex((c) => c.id === colId);

                if (colIndex >= rowIndex) return null;

                const isSelected = selectedCells.has(
                    JSON.stringify({ sourceId: rowId, targetId: colId })
                );

                return (
                    <div
                        onClick={() => toggleCell(rowId, colId)}
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
                        {isSelected ? <CheckOutlined /> : "-"}
                    </div>
                );
            }
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
                <Button type='primary' onClick={uploadComponentPairs}>
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
