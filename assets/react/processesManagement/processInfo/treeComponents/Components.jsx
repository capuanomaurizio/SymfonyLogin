import {Collapse, ConfigProvider, Dropdown, message, Space, Switch} from "antd";
import React, {useState} from "react";
import {apiRequest} from "../../../utils";
import {DeleteOutlined, PlusCircleOutlined, EditOutlined, FileAddOutlined, FunctionOutlined, LoginOutlined} from "@ant-design/icons";
import Functionalities from "./Functionalities";

function findParentComponent(component, childId) {
    if (!component?.childrenComponents) return null;
    for (const child of component.childrenComponents) {
        if (child.id === childId) return component;
        const found = findParentComponent(child, childId);
        if (found) return found;
    }
    return null;
}

function filterRoot(component, idToRemove) {
    if (component.id === idToRemove) return null;
    if (component.childrenComponents && component.childrenComponents.length > 0) {
        component.childrenComponents = component.childrenComponents
            .map(child => filterRoot(child, idToRemove))
            .filter(child => child !== null);
    }
    return component;
}

const Components = ({process, setProcess, setComponentToEdit, setOpenComponentDrawer, setParentOfComponentToCreate,
                        setFunctionalityToEdit, setOpenFunctionalityDrawer, setRequirementToEdit, setOpenRequirementDrawer}) => {

    const [showRequirements, setShowRequirements] = useState(true);
    const [showFunctionalities, setShowFunctionalities] = useState(true);

    async function deleteComponent(root, id) {
        try {
            const parent = findParentComponent(root, id)
            await apiRequest('deleteComponent', {parentId: parent.id, id});
            setProcess(prev => ({
                ...prev,
                component: filterRoot(prev.component, id)
            }));
            message.success("Componente eliminato!");
        }
        catch (e) {
            message.error("Componente non eliminato");
        }
    }

    const transformComponent = (component) => {
        const hasChildren = component.childrenComponents?.length > 0;
        const hasFunctionalities = component.functionalities?.length > 0;

        const functionalitiesList = hasFunctionalities && showFunctionalities ? (
            <Functionalities
                functionalities={component.functionalities}
                showRequirements={showRequirements}
                functionalityComponent={component}
                setProcess={setProcess}
                setFunctionalityToEdit={setFunctionalityToEdit}
                setOpenFunctionalityDrawer={setOpenFunctionalityDrawer}
                setRequirementToEdit={setRequirementToEdit}
                setOpenRequirementDrawer={setOpenRequirementDrawer}
            ></Functionalities> ) : null;

        const childrenContent = (
            <>
                {functionalitiesList}
                {hasChildren && (
                    <Collapse
                        ghost
                        items={component.childrenComponents.map(transformComponent)}
                    />
                )}
            </>
        );

        return {
            key: component.id,
            label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{component.name}</span>
                    {componentOptions(component)}
                </div>
            ),
            children: childrenContent,
            collapsible: hasChildren || hasFunctionalities ? undefined : 'disabled',
            showArrow: hasChildren || hasFunctionalities ? undefined : false,
        };
    };

    function componentOptions(component) {
        const items = [
            {
                key: 'edit',
                label: 'Modifica componente',
                icon: <EditOutlined />,
            },
            {
                key: 'add',
                label: 'Aggiungi componente figlio',
                icon: <FileAddOutlined />,
            },
            {
                key: 'delete',
                label: 'Elimina componente',
                icon: <DeleteOutlined />,
            },
            {
                key: 'addFunctionality',
                label: 'Nuova funzione',
                icon: <FunctionOutlined />,
            },
        ];
        const handleMenuClick = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === 'edit') {
                setComponentToEdit(component);
                setOpenComponentDrawer(true);
            } else if (key === 'add') {
                setParentOfComponentToCreate(component);
                setOpenComponentDrawer(true);
            } else if (key === 'delete') {
                deleteComponent(process.component, component.id)
            } else if (key === 'addFunctionality') {
                setFunctionalityToEdit({'component': component, 'functionality': null});
                setOpenFunctionalityDrawer(true);
            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={e => e.stopPropagation()}>
                    <Space>
                        <PlusCircleOutlined style={{ verticalAlign: 'middle' }} />
                    </Space>
                </a>
            </Dropdown>
        )
    }

    const treeData = process?.component ? [transformComponent(process.component)] : [];

    return(
        <ConfigProvider
            theme={{
                components: {
                    Collapse: {
                        headerBg: '#fff',
                        contentBg: '#fff',
                        headerPadding: '8px 16px',
                    },
                    Switch: {
                        colorPrimary: '#722ed1',
                        colorPrimaryHover: '#9254de',
                        handleBg: '#fff',
                    },
                },
            }}
        >
            <div
                style={{
                    backgroundColor: "#fafafa",
                    border: "1px solid #f0f0f0",
                    borderRadius: 8,
                    padding: "12px 20px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                }}
            >
                    <Space>
                        <FunctionOutlined style={{ color: "deeppink" }} />
                        <span style={{ fontSize: 13, opacity: 0.85 }}>Visualizza funzionalità dei componenti</span>
                        <Switch
                            size="small"
                            checked={showFunctionalities}
                            onChange={() => {setShowFunctionalities(!showFunctionalities); setShowRequirements(false)}}
                            style={{
                                backgroundColor: showFunctionalities ? "deeppink" : "",
                            }}
                        />
                    </Space>
                    <Space>
                        <LoginOutlined style={{ color: "rebeccapurple" }} />
                        <span style={{ fontSize: 13, opacity: 0.85 }}>Visualizza requisiti delle funzioni</span>
                        <Switch
                            disabled={!showFunctionalities}
                            size="small"
                            checked={showRequirements}
                            onChange={setShowRequirements}
                        />
                    </Space>
            </div>
            <Collapse
                items={treeData}
            />
        </ConfigProvider>
    )
}

export default Components;
