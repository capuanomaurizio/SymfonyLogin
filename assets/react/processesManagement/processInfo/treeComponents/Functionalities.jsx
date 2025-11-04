import {Dropdown, List, message, Space} from "antd";
import Requirements from "./Requirements";
import {DeleteOutlined, FunctionOutlined, EditOutlined, LoginOutlined} from "@ant-design/icons";
import React from "react";
import {apiRequest, updateRootEdit} from "../../../utils";

const Functionalities = ({functionalities, showRequirements, functionalityComponent, setProcess,
                             setFunctionalityToEdit, setOpenFunctionalityDrawer,
                                setRequirementToEdit, setOpenRequirementDrawer}) => {

    async function deleteFunctionality(functionalityId) {
        try {
            await apiRequest('deleteFunction', {componentId: functionalityComponent.id, functionId: functionalityId});
            const updatedComponent = {
                ...functionalityComponent,
                functionalities: functionalities.filter(f => f.id !== functionalityId)
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, functionalityComponent.id, updatedComponent)
            }));
            message.success("Funzione rimossa dal componente!");
        }
        catch (e) {
            console.error(e)
            message.error("Funzionalità non rimossa dal componente");
        }
    }

    function functionalityOptions(functionality) {
        const items = [
            {
                key: 'edit',
                label: 'Modifica funzione',
                icon: <EditOutlined />,
            },
            {
                key: 'delete',
                label: 'Elimina funzione',
                icon: <DeleteOutlined />,
            },
            {
                key: 'addRequirement',
                label: 'Aggiungi requisito',
                icon: <LoginOutlined />,
            },
        ];
        const handleMenuClick = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === 'edit') {
                setFunctionalityToEdit({'component': functionalityComponent, 'functionality': functionality});
                setOpenFunctionalityDrawer(true);
            } else if (key === 'delete') {
                deleteFunctionality(functionality.id);
            } else if (key === 'addRequirement') {
                setRequirementToEdit({'component': functionalityComponent, 'functionality': functionality, 'requirement': null});
                setOpenRequirementDrawer(true);
            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={e => e.stopPropagation()}>
                    <Space style={{ color: "deeppink" }}>
                        <FunctionOutlined style={{ verticalAlign: 'middle' }} />
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
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ opacity: 0.85, fontWeight: 500 }}>{func.name}</span>
                            {functionalityOptions(func)}
                        </div>
                        <div style={{ width: "100%" }}>
                            {showRequirements && func.requirements?.length > 0 && (
                                <Requirements
                                    setProcess={setProcess}
                                    requirements={func.requirements}
                                    functionalityComponent={functionalityComponent}
                                    requirementFunctionality={func}
                                    setRequirementToEdit={setRequirementToEdit}
                                    setOpenRequirementDrawer={setOpenRequirementDrawer}
                                />
                            )}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default Functionalities;
