import React, { useState } from "react";
import { List, Card, Form, Input, Button, message, Drawer, Select, Divider, Popconfirm, Dropdown, Menu, Space } from "antd";
import { FilePptOutlined, PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined, EyeOutlined } from "@ant-design/icons";
import { FloatingButton } from "~/components";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import useClassroomStore from "~/states/classroomState";
import useTopics from "~/hooks/useTopics";
import usePresentations from "~/hooks/usePresentations";
import { isArray } from "lodash";

const { Option } = Select;

const GoogleSlidesList = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPresentation, setEditingPresentation] = useState(null);
    const { storePresentation, updatePresentation, deletePresentation } = useClassroomStore();
    const [slides, setSlides] = useState([
        {
            id: "1",
            title: "Quarterly Report Q1 2023",
            url: "https://docs.google.com/presentation/d/1qRsP8fZjebsUEJuIEbHXt-WkfJXE9M6M/edit",
            createdAt: "2023-04-15T09:30:00",
        },
        {
            id: "2",
            title: "Product Launch Deck",
            url: "https://docs.google.com/presentation/d/2aBcD3eF4gHiJkLmNoPqRsTuVwXyZ/edit",
            createdAt: "2023-05-20T14:15:00",
        },
        {
            id: "3",
            title: "Team Meeting Slides",
            url: "https://docs.google.com/presentation/d/3mNoPqRsTuVwXyZaBcD4eF5gHiJkL/edit",
            createdAt: "2023-06-10T11:45:00",
        },
    ]);
    const {
        data: topics,
        refetch: refetchTopics,
    } = useTopics(id);

    const {
        isLoading,
        data: presentations,
        refetch,
        isFetching,
    } = usePresentations(id);

    const showDrawer = () => {
        setEditingPresentation(null);
        setOpen(true);
    };

    const showEditDrawer = (presentation) => {
        setEditingPresentation(presentation);
        form.setFieldsValue({
            title: presentation.title,
            url: presentation.link,
            topic: presentation.topic_id
        });
        setOpen(true);
    };

    const onClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        values.class_id = id;

        try {
            let response;
            if (editingPresentation) {
                response = await updatePresentation(editingPresentation.id, values);
            } else {
                response = await storePresentation(values);
            }
            
            if (response?.status === 200) {
                message.success(`Presentation ${editingPresentation ? 'updated' : 'added'} successfully`);
                refetch();
                onClose();
            } else {
                message.error(`Failed to ${editingPresentation ? 'update' : 'add'} presentation`);
            }
        } catch (error) {
            message.error(`Failed to ${editingPresentation ? 'update' : 'add'} presentation`);
            console.error("Error saving presentation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (presentationId) => {
        try {
            const response = await deletePresentation({id: presentationId});
            if (response?.status === 200) {
                message.success("Presentation deleted successfully");
                refetch();
            } else {
                message.error("Failed to delete presentation");
            }
        } catch (error) {
            message.error("Failed to delete presentation");
            console.error("Error deleting presentation:", error);
        }
    };

    const handleView = (url) => {
        window.open(url, "_blank");
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format("MMMM D, YYYY h:mm A");
    };

    const menu = (presentation) => (
        <Menu>
            <Menu.Item 
                key="view" 
                icon={<EyeOutlined />} 
                onClick={() => handleView(presentation.link)}
            >
                View
            </Menu.Item>
            <Menu.Item 
                key="edit" 
                icon={<EditOutlined />} 
                onClick={() => showEditDrawer(presentation)}
            >
                Edit
            </Menu.Item>
            <Menu.Item key="divider" style={{ padding: 0 }}>
                <Divider style={{ margin: 0 }} />
            </Menu.Item>
            <Menu.Item 
                key="delete" 
                icon={<DeleteOutlined />}
                danger
            >
                <Popconfirm
                    title="Are you sure you want to delete this presentation?"
                    onConfirm={() => handleDelete(presentation.id)}
                    okText="Yes"
                    cancelText="No"
                    placement="left"
                >
                    Delete
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div style={{ padding: "24px" }}>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
                    dataSource={isArray(presentations) ? presentations : []}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                // onClick={() => handleView(item.link)}
                                style={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                    maxWidth: 200,
                                    minWidth: 200,
                                }}
                                bodyStyle={{ padding: "16px" }}
                                cover={
                                    <div style={{ 
                                        padding: "16px 16px 0",
                                        position: "relative"
                                    }}>
                                        <FilePptOutlined
                                            style={{
                                                fontSize: "48px",
                                                color: "#F4B400",
                                            }}
                                        />
                                        <div style={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                        }}>
                                            <Dropdown 
                                                overlay={menu(item)} 
                                                trigger={['click']}
                                                placement="bottomRight"
                                                arrow
                                            >
                                                <Button 
                                                    type="text" 
                                                    icon={<MoreOutlined />} 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                    style={{
                                                        color: "rgba(0, 0, 0, 0.45)"
                                                    }}
                                                />
                                            </Dropdown>
                                        </div>
                                    </div>
                                }
                            >
                                <div
                                    style={{
                                        fontWeight: "500",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis"
                                    }}
                                    title={item.title}
                                >
                                    {item.title}
                                </div>
                                <div
                                    style={{
                                        marginTop: "8px",
                                        color: "#666",
                                        fontSize: "12px",
                                    }}
                                >
                                    {formatDate(item.createdAt)}
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>

            <FloatingButton
                icon={<PlusOutlined />}
                label="Create New Slides"
                onClick={showDrawer}
            />

            <Drawer
                title={editingPresentation ? "Edit Slides" : "Create New Slides"}
                placement="right"
                onClose={onClose}
                open={open}
                width={500}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => form.submit()}
                            type="primary"
                            loading={isSubmitting}
                        >
                            {editingPresentation ? 'Update' : 'Create'}
                        </Button>
                    </div>
                }
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="title"
                        label="Presentation Title"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the presentation title",
                            },
                            {
                                max: 100,
                                message: "Title cannot exceed 100 characters",
                            },
                        ]}
                    >
                        <Input placeholder="Enter presentation title" />
                    </Form.Item>

                    <Form.Item
                        name="url"
                        label="Google Slides URL"
                        rules={[
                            {
                                required: true,
                                message: "Please enter the Google Slides URL",
                            },
                            {
                                pattern: new RegExp(
                                    /^https:\/\/docs\.google\.com\/presentation\/d\/.+/
                                ),
                                message:
                                    "Please enter a valid Google Slides URL",
                            },
                        ]}
                    >
                        <Input placeholder="https://docs.google.com/presentation/d/..." />
                    </Form.Item>
                    <Form.Item name="topic" label="Topic">
                        <Select
                            placeholder="Select a topic"
                        >
                            {Array.isArray(topics) &&
                                topics.map((topic) => (
                                    <Option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
};

export default GoogleSlidesList;