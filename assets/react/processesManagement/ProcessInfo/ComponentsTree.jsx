import {Button, Collapse, ConfigProvider, Dropdown, List, message, Space} from "antd";
import React from "react";
import {apiRequest} from "../../utils";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";

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

const ComponentsTree = ({process, setProcess, setComponentToEdit, setOpenEditDrawer, setParentOfComponentToCreate,
                            setOpenCreateDrawer,setOpenEditFunctionDrawer, setFunctionToEdit, setFunctionToDelete}) => {

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

        const functionalitiesList = hasFunctionalities ? (
            <div style={{ marginLeft: 48, marginTop: 0, marginBottom: 12 }}>
                <List
                    size="small"
                    bordered={false}
                    split={false}
                    itemLayout="horizontal"
                    dataSource={component.functionalities}
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
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span style={{ opacity: 0.85 }}>{func.name}</span>
                            <Space size="small">
                                <Button
                                    type="text"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setComponentToEdit(component);
                                        setFunctionToEdit(func);
                                        setOpenEditDrawer(true);
                                        setOpenEditFunctionDrawer(true);
                                    }}
                                >
                                    <EditOutlined />
                                </Button>
                                <Button
                                    type="text"
                                    danger
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setComponentToEdit(component);
                                        setFunctionToDelete(func);
                                    }}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Space>
                        </List.Item>
                    )}
                />
            </div>
        ) : null;

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
            extra: genExtra(component, component.id),
            collapsible: hasChildren || hasFunctionalities ? undefined : 'disabled',
            showArrow: hasChildren || hasFunctionalities ? undefined : false,
        };
    };

    function genExtra(component, id) {
        const items = [
            {
                key: 'edit',
                label: 'Modifica',
                icon: <EditOutlined />,
            },
            {
                key: 'add',
                label: 'Aggiungi',
                icon: <FileAddOutlined />,
            },
            {
                key: 'delete',
                label: 'Elimina',
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
                deleteComponent(process.component, id)
            }
        };

        return (
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
                <a onClick={e => e.stopPropagation()}>
                    <Space>
                        Opzioni
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
                },
            }}
        >
            <Collapse
                items={treeData}
            />
        </ConfigProvider>
    )
}

export default ComponentsTree;
