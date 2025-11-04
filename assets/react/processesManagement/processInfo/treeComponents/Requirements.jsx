import {Dropdown, List, message, Space} from "antd";
import {DeleteOutlined, EditOutlined, LoginOutlined} from "@ant-design/icons";
import React from "react";
import {apiRequest, updateRootEdit} from "../../../utils";

const Requirements = ({ setProcess, requirements, functionalityComponent, requirementFunctionality,
                          setRequirementToEdit, setOpenRequirementDrawer, rootComponent }) => {

    async function deleteRequirement(requirementId) {
        try {
            await apiRequest('deleteRequirement', {functionId: requirementFunctionality.id, requirementId});
            const updatedComponent = {
                ...functionalityComponent,
                functionalities: functionalityComponent.functionalities.map(func => {
                    if (func.id === requirementFunctionality.id) {
                        return {
                            ...func,
                            requirements: func.requirements.filter(req => req.id !== requirementId),
                        };
                    }
                    return func;
                }),
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, functionalityComponent.id, updatedComponent),
            }));
            message.success("Requisito rimosso dalla funzionalità!");
        } catch (e) {
            message.error("Requisito non rimosso dalla funzionalità");
        }
    }

    async function deleteRootRequirement(requirementId) {
        try {
            await apiRequest('deleteRootRequirement', {rootId: rootComponent.id, requirementId});
            const updatedComponent = {
                ...rootComponent,
                requirements: rootComponent.requirements.filter(req => req.id !== requirementId),
            };
            setProcess(prev => ({
                ...prev,
                component: updateRootEdit(prev.component, rootComponent.id, updatedComponent),
            }));
            message.success("Requisito rimosso dal componente radice!");
        } catch (e) {
            console.error(e)
            message.error("Requisito non rimosso dal componente radice");
        }
    }

    const requirementOptions = (requirement) => {
        const items = [
            {
                key: "edit",
                label: "Modifica requisito",
                icon: <EditOutlined />,
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
                if(rootComponent){
                    setRequirementToEdit({
                        'component': rootComponent,
                        'functionality': null,
                        'requirement': requirement
                    })
                } else {
                    setRequirementToEdit({
                        'component': functionalityComponent,
                        'functionality': requirementFunctionality,
                        'requirement': requirement
                    })
                }
                setOpenRequirementDrawer(true);
            } else if (key === 'delete') {
                if(rootComponent) deleteRootRequirement(requirement.id);
                else deleteRequirement(requirement.id);
            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={(e) => e.stopPropagation()}>
                    <Space style={{color: "rebeccapurple"}}>
                        <LoginOutlined style={{ verticalAlign: 'middle' }} />
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
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
