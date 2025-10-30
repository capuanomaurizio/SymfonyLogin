import {Collapse, ConfigProvider, Dropdown, message, Space} from "antd";
import React from "react";
import {apiRequest} from "../../utils";
import {DeleteOutlined, DownOutlined, EditOutlined, FileAddOutlined} from "@ant-design/icons";

function findParentComponent(component, childId) {
    if (!component?.children_components) return null;
    for (const child of component.children_components) {
        if (child.id === childId) return component;
        const found = findParentComponent(child, childId);
        if (found) return found;
    }
    return null;
}

function filterRoot(component, idToRemove) {
    if (component.id === idToRemove) return null;
    if (component.children_components && component.children_components.length > 0) {
        component.children_components = component.children_components
            .map(child => filterRoot(child, idToRemove))
            .filter(child => child !== null);
    }
    return component;
}

const ComponentsTree = ({process, setProcess, setComponentToEdit, setOpenEditDrawer, setParentOfComponentToCreate, setOpenCreateDrawer}) => {

    async function deleteComponent(root, id) {
        try {
            const parent = findParentComponent(root, id)
            await apiRequest('deleteComponent', {'parent_id': parent.id, 'id': id});
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
        const hasChildren = component.children_components?.length > 0;
        return {
            key: component.id,
            label: component.name,
            children: hasChildren ? (
                <Collapse
                    ghost
                    items={component.children_components.map(transformComponent)}
                />
            ) : null,
            extra: genExtra(component, component.id),
            collapsible: hasChildren ? undefined : 'disabled',
            showArrow: hasChildren ? undefined : false
        }};

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
                icon: <DeleteOutlined/>,
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
