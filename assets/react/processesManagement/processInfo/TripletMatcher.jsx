import React, {useEffect, useMemo, useRef, useState} from "react";
import { Row, Col, Card, List, Button, message } from "antd";
import { ArcherContainer, ArcherElement } from "react-archer";
import "antd/dist/reset.css";
import { apiRequest } from "../../utils";
import { BranchesOutlined, ReloadOutlined } from "@ant-design/icons";

// palette di colori ciclica
const tripletColors = [
    "#E6194B", "#3CB44B", "#0082C8", "#F58231",
    "#911EB4", "#46F0F0", "#F032E6", "#D2F53C",
    "#008080", "#AA6E28", "#800000", "#808000",
];

const ListBox = ({ title, prefix, items, selectedId, onSelect, selectedNextId, existingTriplets, onScrollRefresh }) => {

    // Genera una mappa ID → colore, memorizzata con useMemo
    const tripletColorMap = useMemo(() => {
        const map = new Map();
        existingTriplets.forEach((t, index) => {
            const color = tripletColors[index % tripletColors.length];
            const label = index + 1;
            map.set(t.id ?? `${t.f1.id}-${t.f2.id}-${t.f3.id}`, {color, label});
        });
        return map;
    }, [existingTriplets]);

    function generateRelationsForItem(prefix, id, triplets, colorMap) {
        const rels = [];
        triplets.forEach((t) => {
            const { f1, f2, f3 } = t;
            const tripletId = t.id ?? `${f1.id}-${f2.id}-${f3.id}`;
            const {color: tripletColor, label: tripletLabel} = colorMap.get(tripletId);

            if (prefix === "a" && f1?.id === id && f2) {
                const key = `a-${f1.id}-b-${f2.id}`;
                rels.push({
                    id: key,
                    targetId: `b-${f2.id}`,
                    sourceAnchor: "right",
                    targetAnchor: "left",
                    style: { strokeColor: tripletColor, strokeWidth: 2.5 },
                    tag: tripletLabel,
                });
            }
            if (prefix === "b" && f2?.id === id && f3) {
                const key = `b-${f2.id}-c-${f3.id}`;
                rels.push({
                    id: key,
                    targetId: `c-${f3.id}`,
                    sourceAnchor: "right",
                    targetAnchor: "left",
                    style: { strokeColor: tripletColor, strokeWidth: 2.5 },
                    tag: tripletLabel,
                });
            }
        });
        return rels;
    }

    const baseColor = "#000000";

    return (
        <Card
            title={title}
            style={{ height: 600, overflowY: "auto", backgroundColor: "rgba(255,255,255,0.97)" }}
            onScroll={onScrollRefresh}
        >
            <List
                dataSource={items}
                renderItem={(item) => {
                    const isSelected = selectedId === item.id;
                    let relations = [];
                    if (isSelected && selectedNextId) {
                        const nextPrefix = prefix === "a" ? "b" : prefix === "b" ? "c" : null;
                        if (nextPrefix) {
                            relations.push({
                                id: `sel-${prefix}-${item.id}-${nextPrefix}-${selectedNextId}`,
                                targetId: `${nextPrefix}-${selectedNextId}`,
                                sourceAnchor: "right",
                                targetAnchor: "left",
                                style: { strokeColor: baseColor, strokeWidth: 5, strokeDasharray: "6,4", },
                            });
                        }
                    }
                    const allRelations = [
                        ...generateRelationsForItem(prefix, item.id, existingTriplets, tripletColorMap),
                        ...relations,
                    ];

                    return (
                        <List.Item
                            onClick={() => onSelect(item.id)}
                            style={{
                                cursor: "pointer",
                                padding: "8px 12px",
                                background: isSelected ? `${baseColor}20` : `${baseColor}10`,
                                borderLeft: isSelected ? `4px solid ${baseColor}` : `4px solid ${baseColor}80`,
                                transition: "all 0.15s ease",
                            }}
                        >
                            <ArcherElement id={`${prefix}-${item.id}`}>
                                <div style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: "center",
                                    width: '100%',
                                }}>
                                    <div style={{marginLeft: 10}}>
                                        <strong>{item.name}</strong>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-evenly'
                                        }}
                                    >
                                    {allRelations.map((r, i) => (
                                        <ArcherElement
                                            key={`${r.id}-${i}`}
                                            id={`${r.id}-${i}`}
                                            relations={[r]}
                                        >
                                            <div
                                                style={{
                                                    height: 1,
                                                    width: 1,
                                                    marginBottom: 10,
                                                    marginTop: 10,
                                                }}
                                            >
                                                {r.tag && <span
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: 18,
                                                        height: 18,
                                                        borderRadius: "50%",
                                                        backgroundColor: r.style?.strokeColor || "#555",
                                                        color: "#fff",
                                                        fontSize: 11,
                                                        fontWeight: "bold",
                                                        lineHeight: "18px",
                                                        userSelect: "none",
                                                        transform: "translate(-85%, -65%)",
                                                    }}
                                                >
                                                    {r.tag}
                                                </span>}
                                            </div>
                                        </ArcherElement>
                                    ))}
                                    </div>
                                </div>
                            </ArcherElement>
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
};

export default function TripletMatcher({ functionalities, processId, componentId }) {
    const [selectedA, setSelectedA] = useState(null);
    const [selectedB, setSelectedB] = useState(null);
    const [selectedC, setSelectedC] = useState(null);
    const [existingTriplets, setExistingTriplets] = useState([]);
    const archerRef = useRef(null);

    useEffect(() => {
        async function loadTriplets() {
            try {
                const response = await apiRequest("getComponentTriplets", { componentId });
                setExistingTriplets(response || []);
            } catch (e) {
                console.error("Errore nel caricamento triplette:", e);
                message.error("Impossibile caricare le triplette esistenti");
            }
        }
        loadTriplets();
    }, [componentId]);

    async function checkIfTripletIsValid() {
        try {
            const response = await apiRequest("checkIfTripletIsValid", { processId, selectedA, selectedB, selectedC });
            if (response.length > 0) {
                setExistingTriplets((prev) => [
                    ...prev,
                    { f1: { id: selectedA }, f2: { id: selectedB }, f3: { id: selectedC } },
                ]);
                setSelectedA(null);
                setSelectedB(null);
                setSelectedC(null);
                message.success("Tripletta di funzioni correttamente registrata");
            } else {
                message.error("Tripletta di funzioni non registrata. Esiste già una istanza");
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div style={{ padding: 32, background: "#f0f2f5", borderRadius: 10 }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: 'space-between' }}>
                <Button
                    onClick={() => {
                        setSelectedA(null);
                        setSelectedB(null);
                        setSelectedC(null);
                    }}
                >
                    Reset
                    <ReloadOutlined />
                </Button>
                <Button
                    type={"primary"}
                    onClick={() => {
                        if (selectedA && selectedB && selectedC) checkIfTripletIsValid();
                    }}
                >
                    Crea tripletta
                    <BranchesOutlined />
                </Button>
            </div>

            <ArcherContainer
                ref={archerRef}
                className="archer-container"
                strokeColor="#999"
                strokeWidth={2}
                lineStyle="curve"
                endMarker={false}
            >
                <Row gutter={16} justify="space-between">
                    <Col span={6}>
                        <ListBox
                            title={"Funzioni del componente padre"}
                            prefix="a"
                            items={functionalities[0] || []}
                            selectedId={selectedA}
                            onSelect={(id) => setSelectedA(id)}
                            selectedNextId={selectedB}
                            existingTriplets={existingTriplets}
                            onScrollRefresh={() => archerRef.current?.refreshScreen()}
                        />
                    </Col>
                    <Col span={6}>
                        <ListBox
                            title={"Funzioni del componente esaminato"}
                            prefix="b"
                            items={functionalities[1] || []}
                            selectedId={selectedB}
                            onSelect={(id) => setSelectedB(id)}
                            selectedNextId={selectedC}
                            existingTriplets={existingTriplets}
                            onScrollRefresh={() => archerRef.current?.refreshScreen()}
                        />
                    </Col>
                    <Col span={6}>
                        <ListBox
                            title={"Funzioni dei livelli inferiori"}
                            prefix="c"
                            items={functionalities[2] || []}
                            selectedId={selectedC}
                            onSelect={(id) => setSelectedC(id)}
                            selectedNextId={null}
                            existingTriplets={existingTriplets}
                            onScrollRefresh={() => archerRef.current?.refreshScreen()}
                        />
                    </Col>
                </Row>
            </ArcherContainer>
        </div>
    );
}
