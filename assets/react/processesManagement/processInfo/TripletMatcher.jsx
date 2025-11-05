import React, {useEffect, useRef, useState} from "react";
import { Row, Col, Button, message } from "antd";
import { ArcherContainer } from "react-archer";
import "antd/dist/reset.css";
import { apiRequest } from "../../utils";
import { BranchesOutlined, ReloadOutlined } from "@ant-design/icons";
import FunctionalitiesList from "./FunctionalitiesList";

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
                    <Col span={7}>
                        <FunctionalitiesList
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
                    <Col span={7}>
                        <FunctionalitiesList
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
                    <Col span={7}>
                        <FunctionalitiesList
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
