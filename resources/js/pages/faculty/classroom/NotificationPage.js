import React, { useEffect, useState } from "react";
import {
    List,
    Avatar,
    Badge,
    Pagination,
    Button,
    Modal,
    Typography,
    notification,
    Card,
    Empty,
} from "antd";
import useClassroomNotification from "~/hooks/useClassroomNotification";
import { useParams } from "react-router-dom";
import {
    BellOutlined,
    FileTextOutlined,
    MessageOutlined,
    NotificationOutlined,
    BookOutlined,
    CheckOutlined,
    ReadOutlined,
} from "@ant-design/icons";
import useClassroomStore from "~/states/classroomState";
import { useMutation } from "react-query";

const { Text, Title } = Typography;

export default function NotificationListWithPagination({
    initialPage = 1,
    pageSize = 8,
}) {
    const { id } = useParams();
    const { isLoading, data, isFetching } = useClassroomNotification(id);
    const { markNotificationAsRead } = useClassroomStore();

    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [itemsPerPage, setItemsPerPage] = useState(pageSize);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Transform API data
    useEffect(() => {
        if (Array.isArray(data)) {
            const transformed = data.map((notification) => {
                let parsedData = {};
                try {
                    parsedData = notification.data
                        ? JSON.parse(notification.data)
                        : {};
                } catch (err) {
                    console.error("Error parsing notification data:", err);
                }

                return {
                    id: notification.id,
                    title:
                        notification.title ||
                        parsedData.title ||
                        "Notification",
                    message:
                        notification.message ||
                        parsedData.message ||
                        "New notification",
                    read: notification.read,
                    datetime: notification.created_at,
                    type: notification.type,
                    avatarSeed: notification.id,
                    data: parsedData,
                };
            });
            setNotifications(transformed);
        }
    }, [data]);

    // Handle pagination
    useEffect(() => {
        if (!notifications.length) return;
        setLoading(true);

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const t = setTimeout(() => {
            setCurrentPageData(notifications.slice(start, end));
            setLoading(false);
        }, 250);

        return () => clearTimeout(t);
    }, [page, itemsPerPage, notifications]);

    // Open detail modal
    const openNotificationDetail = (item) => {
        Modal.info({
            title: item.title,
            content: (
                <div>
                    <p>{item.message}</p>
                    <Text type="secondary">
                        {new Date(item.datetime).toLocaleString()}
                    </Text>
                </div>
            ),
            okText: "Mark as read",
            onOk() {
                markAsRead(item.id);
            },
        });
    };

    const markAsReadMutation = useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: (data, id) => {
            // Update local state
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            notification.success({
                message: "Marked read",
                description: `Notification ${id} marked as read.`,
                placement: "bottomRight",
            });
        },
        onError: () => {
            message.error("Failed to mark notification as read");
        },
    });

    // Mark single notification as read
    const markAsRead = (id) => {
        // optimistic update (immediate UI change)
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );

        // trigger API call
        markAsReadMutation.mutate(id);
    };

    // Mark all notifications as read
    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        notification.open({
            message: "All notifications marked read",
            icon: <CheckOutlined />,
            placement: "bottomRight",
        });
    };

    const handlePageChange = (p, size) => {
        setPage(p);
        setItemsPerPage(size);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "assignment":
                return <FileTextOutlined />;
            case "message":
                return <MessageOutlined />;
            case "announcement":
                return <NotificationOutlined />;
            case "class":
                return <BookOutlined />;
            default:
                return <BellOutlined />; // fallback
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
            <Card
                bordered
                style={{
                    borderRadius: 16,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background:
                            "linear-gradient(90deg, rgb(219 166 250), rgb(0 237 248))",
                        padding: "16px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: "#fff",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <BellOutlined style={{ fontSize: 22 }} />
                        <Title level={4} style={{ margin: 0, color: "#fff" }}>
                            Notifications
                        </Title>
                        <Badge
                            count={notifications.filter((d) => !d.read).length}
                            overflowCount={99}
                            style={{ backgroundColor: "#ff4d4f" }}
                        />
                    </div>
                    <Button
                        onClick={markAllRead}
                        type="primary"
                        icon={<ReadOutlined />}
                    >
                        Mark all read
                    </Button>
                </div>

                {/* List */}
                <div style={{ padding: 20 }}>
                    <List
                        bordered={false}
                        itemLayout="horizontal"
                        loading={loading || isLoading || isFetching}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No notifications"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ),
                        }}
                        dataSource={currentPageData}
                        renderItem={(item) => (
                            <List.Item
                                key={item.id}
                                style={{
                                    cursor: "pointer",
                                    padding: "16px 12px",
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    borderLeft: item.read
                                        ? "4px solid transparent"
                                        : "4px solid #1677ff",
                                    background: item.read ? "#fff" : "#f0f7ff",
                                    transition: "all 0.3s",
                                }}
                                onClick={() => openNotificationDetail(item)}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.boxShadow =
                                        "0 2px 8px rgba(0,0,0,0.08)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.boxShadow = "none")
                                }
                                actions={[
                                    item.read ? (
                                        <Text type="secondary">Read</Text>
                                    ) : (
                                        <Button
                                            size="small"
                                            type="link"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(item.id);
                                            }}
                                        >
                                            Mark read
                                        </Button>
                                    ),
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Badge
                                            dot={!item.read}
                                            offset={[-6, 6]}
                                        >
                                            <Avatar
                                                style={{
                                                    backgroundColor: "#1677ff",
                                                    color: "#fff",
                                                }}
                                                icon={getNotificationIcon(
                                                    item.type
                                                )}
                                            />
                                        </Badge>
                                    }
                                    title={<Text strong>{item.title}</Text>}
                                    description={
                                        <div>
                                            <Text
                                                ellipsis
                                                style={{
                                                    maxWidth: 500,
                                                    display: "block",
                                                }}
                                            >
                                                {item.message}
                                            </Text>
                                            <div style={{ marginTop: 6 }}>
                                                <Text type="secondary">
                                                    {new Date(
                                                        item.datetime
                                                    ).toLocaleString()}
                                                </Text>
                                            </div>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />

                    {/* Pagination */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: 16,
                        }}
                    >
                        <Pagination
                            current={page}
                            pageSize={itemsPerPage}
                            total={notifications.length}
                            showSizeChanger
                            pageSizeOptions={[5, 8, 12, 20]}
                            onChange={handlePageChange}
                            onShowSizeChange={handlePageChange}
                            showTotal={(total) =>
                                `Total ${total} notifications`
                            }
                            style={{
                                background: "#fafafa",
                                padding: "8px 16px",
                                borderRadius: 8,
                            }}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
