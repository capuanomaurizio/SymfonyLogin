import {Collapse, ConfigProvider, Dropdown, message, Space, Switch} from "antd";
import React, {useState} from "react";
import {apiRequest} from "../../../utils";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";
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

const Components = ({process, setProcess, setComponentToEdit, setOpenEditDrawer, setParentOfComponentToCreate,
                            setOpenCreateDrawer,setOpenEditFunctionDrawer, setFunctionToEdit, setFunctionToDelete}) => {

    const [showRequirements, setShowRequirements] = useState(true);
    const [showFunctionalities, setShowFunctionalities] = useState(true);

    async function deleteComponent(root, id) {
        try {
            const parent = findParentComponent(root, id)
            await apiRequest('deleteComponent', {'parentId': parent.id, 'id': id});
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
            label: component.name,
            children: childrenContent,
            extra: componentOptions(component),
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
        ];
        const handleMenuClick = ({ key, domEvent }) => {
            domEvent.stopPropagation();
            if (key === 'edit') {
                setComponentToEdit(component);
                setOpenEditDrawer(true);
            } else if (key === 'add') {
                setParentOfComponentToCreate(component);
                setOpenCreateDrawer(true);
            } else if (key === 'delete') {
                deleteComponent(process.component, component.id)
            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={e => e.stopPropagation()}>
                    <Space>
                        Componente
                        <DownOutlined/>
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
                        <FileAddOutlined style={{ color: "deeppink" }} />
                        <span style={{ fontSize: 13, opacity: 0.85 }}>Visualizza funzionalità dei componenti</span>
                        <Switch
                            size="small"
                            checked={showFunctionalities}
                            onChange={setShowFunctionalities}
                            style={{
                                backgroundColor: showFunctionalities ? "deeppink" : "",
                            }}
                        />
                    </Space>
                    <Space>
                        <EditOutlined style={{ color: "rebeccapurple" }} />
                        <span style={{ fontSize: 13, opacity: 0.85 }}>Visualizza requisiti delle funzioni</span>
                        <Switch
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
