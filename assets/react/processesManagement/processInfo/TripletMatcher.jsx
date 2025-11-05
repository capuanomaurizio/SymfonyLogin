import React, {useState} from "react";
import {Row, Col, Card, List, Button, Space, message} from "antd";
import { ArcherContainer, ArcherElement } from "react-archer";
import "antd/dist/reset.css";
import {apiRequest} from "../../utils";

const colorA = "#1890ff";
const colorB = "#fa8c16";
const colorC = "#52c41a";

const ListBox = ({ title, prefix, items, selectedId, onSelect, color, selectedNextId }) => {
    return (
        <Card
            title={title}
            style={{
                height: 600,
                overflowY: "auto",
                backgroundColor: "rgba(255,255,255,0.97)",
                position: "relative",
                zIndex: 2,
            }}
        >
            <List
                dataSource={items}
                renderItem={(item) => {
                    // Se questo item è il selezionato e c'è un target nella lista successiva, crea relations
                    const isSelected = selectedId === item.id;
                    const relations =
                        isSelected && selectedNextId
                            ? [
                                {
                                    targetId: `${prefix === "a" ? "b" : "c"}-${selectedNextId}`,
                                    sourceAnchor: "right",
                                    targetAnchor: "left",
                                    style: {
                                        strokeColor: prefix === "a" ? colorA : colorB,
                                        strokeWidth: 3,
                                    },
                                },
                            ]
                            : [];

                    return (
                        <ArcherElement id={`${prefix}-${item.id}`} relations={relations}>
                                <List.Item
                                    onClick={() => onSelect(item.id)}
                                    style={{
                                        cursor: "pointer",
                                        padding: "8px 12px",
                                        background: isSelected ? `${color}20` : undefined,
                                        borderLeft: isSelected ? `4px solid ${color}` : "4px solid transparent",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <strong>{item.name}</strong>
                                </List.Item>
                        </ArcherElement>
                    );
                }}
            />
        </Card>
    );
};

export default function TripletMatcher({functionalities, processId}) {
    const [selectedA, setSelectedA] = useState(null);
    const [selectedB, setSelectedB] = useState(null);
    const [selectedC, setSelectedC] = useState(null);

    async function checkIfTripletIsValid(){
        try{
            const response = await apiRequest("checkIfTripletIsValid", {processId, selectedA, selectedB, selectedC});
            if(response.length > 0)
                message.success("Tripletta di funzioni correttamente registrata")
            else
                message.error("Tripletta di funzioni non registrata. Esiste già una istanza")
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div style={{ padding: 32, background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{ marginBottom: 16, textAlign: "right" }}>
                <Space size={"middle"}>
                    <Button
                        onClick={() => {
                            setSelectedA(null);
                            setSelectedB(null);
                            setSelectedC(null);
                        }}
                    >
                        Reset selezioni
                    </Button>
                    <Button type={"primary"}
                        onClick={() => {
                            if(selectedA && selectedB && selectedC)
                                checkIfTripletIsValid()
                        }}
                    >
                        Invia selezioni
                    </Button>
                </Space>
            </div>

            {/* ArcherContainer avvolge tutto: ogni ArcherElement discendente è considerato */}
            <ArcherContainer className="archer-container" strokeColor="#999" strokeWidth={2} lineStyle="curve" endMarker={false}>
                <Row gutter={16}>
                    <Col span={8}>
                        {/* per la prima lista passiamo selectedNextId = selectedB */}
                        <ListBox
                            title={'Funzioni del componente padre'}
                            prefix="a"
                            items={functionalities[0] || []}
                            selectedId={selectedA}
                            onSelect={(id) => setSelectedA(id)}
                            color={colorA}
                            selectedNextId={selectedB}
                        />
                    </Col>
                    <Col span={8}>
                        {/* la lista B può avere relazioni verso C */}
                        <ListBox
                            title={'Funzioni del componente esaminato'}
                            prefix="b"
                            items={functionalities[1] || []}
                            selectedId={selectedB}
                            onSelect={(id) => setSelectedB(id)}
                            color={colorB}
                            selectedNextId={selectedC}
                        />
                    </Col>
                    <Col span={8}>
                        {/* la lista C non punta oltre, quindi selectedNextId non serve */}
                        <ListBox
                            title={'Funzioni dei livelli inferiori'}
                            prefix="c"
                            items={functionalities[2] || []}
                            selectedId={selectedC}
                            onSelect={(id) => setSelectedC(id)}
                            color={colorC}
                            selectedNextId={null}
                        />
                    </Col>
                </Row>
            </ArcherContainer>
        </div>
    );
}
