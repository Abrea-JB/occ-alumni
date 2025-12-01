import React, { useState, useEffect } from "react";
import {
    FileTextOutlined,
    GroupOutlined,
    UserOutlined,
    CalendarOutlined,
    ProfileOutlined,
    PartitionOutlined,
    FolderOpenOutlined,
    SettingOutlined,
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    HomeOutlined,
    BankOutlined,
    ClusterOutlined,
    TeamOutlined,
    CreditCardOutlined,
    FileUnknownOutlined,
    BellOutlined,
    DribbbleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MailOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import {
    Layout,
    Menu,
    Tooltip,
    Avatar,
    Dropdown,
    Row,
    Col,
    Drawer,
    Button,
    List,
    Badge,
    Spin,
    Typography,
    Divider,
    Space,
    message,
    Switch,
    Modal,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import logoMini from "../../assets/images/site-logo.png";
import { setCookie } from "~/utils/helper";
import secureLocalStorage from "react-secure-storage";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useRealtimeNotification from "~/hooks/useRealtimeNotification";
import useProfile from "~/hooks/useProfile";
import { useHistory } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;
const { Text, Title } = Typography;

const MENU_ADMIN = [
    {
        key: 10,
        url: "/admin-dashboard",
        label: "Dashboard",
        icon: <DashboardOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/alumni",
        label: "Alumni",
        icon: <TeamOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/events",
        label: "Events",
        icon: <CalendarOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/questions",
        label: "Questions",
        icon: <QuestionCircleOutlined className="menu-icon" />,
    },
];

const MENU_ALUMNI = [
    {
        key: 120,
        url: "/alumni",
        label: "Alumni",
        icon: <TeamOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/events",
        label: "Events",
        icon: <CalendarOutlined className="menu-icon" />,
    },
    {
        key: 120,
        url: "/profile",
        label: "Profile",
        icon: <GroupOutlined className="menu-icon" />,
    },
];

const MainLayout = ({ children, breadcrumb }) => {
    const queryClient = useQueryClient();
   // const { isLoading, data, isFetching } = useRealtimeNotification();
    const { data: profile } = useProfile();
    const { pathname } = useLocation();
    const history = useHistory();
    const basePath = "/" + pathname.split("/").filter(Boolean)[0];
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [alumniQuizzes, setQuizzes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    

    const logout = () => {
        localStorage.removeItem("access_token");
        secureLocalStorage.removeItem("userRole");
        setCookie(["userLogin", ""]);
        window.location = "/login";
    };

    // User data (from secureLocalStorage)
const [userData, setUserData] = useState({
    name: secureLocalStorage.getItem("name") || "User Name",
    email: secureLocalStorage.getItem("email") || "",
    avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqpoo1iI8Lm9cp0sOpTVLVGX6dqt_Jld4I6g&s",
    role: secureLocalStorage.getItem("userRole") || "user",
});

// ⬇⬇⬇ Add this EXACT useEffect here
useEffect(() => {
    if (profile?.alumni) {
        const fullName = `${profile.alumni.first_name || "User"} ${
            profile.alumni.last_name || "Name"
        }`;

        setUserData((prev) => ({
            ...prev,
            name: fullName,
            email: profile.alumni.email || prev.email,
            // avatar & role remain unchanged
        }));

        // Keep storage updated
        secureLocalStorage.setItem("name", fullName);
        secureLocalStorage.setItem("email", profile.alumni.email || "");
    }
}, [profile]);


    const [settings, setSettings] = useState({
        emailNotifications: true,
        soundEnabled: false,
        darkMode: false,
    });

    const handleSettingsChange = (key, value) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
        message.success(`Settings updated successfully`);
    };

    const accountItems = [
        {
            label: (
                <div style={{ padding: "8px 0" }}>
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {userData.name}
                    </div>
                    <div style={{ color: "#666", fontSize: "12px" }}>
                        {userData.email}
                    </div>
                </div>
            ),
            key: "profile-header",
            disabled: true,
        },
        {
            type: "divider",
        },
        // {
        //     label: (
        //         <Space>
        //             <span>View Profile</span>
        //         </Space>
        //     ),
        //     key: "view-profile",
        //     icon: <UserOutlined />,
        // },
        // {
        //     label: (
        //         <Space>
        //             <span>Account Settings</span>
        //         </Space>
        //     ),
        //     key: "account-settings",
        //     icon: <SettingOutlined />,
        // },
        // {
        //     type: "divider",
        // },
        {
            label: "Sign out",
            key: "logout",
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    const handleAccountItemClick = (e) => {
        switch (e.key) {
            case "view-profile":
                history.push("/profile");
                break;
            case "account-settings":
                history.push("/settings");
                break;
            case "logout":
                logout();
                break;
            default:
                break;
        }
    };

    let menus = [];
    const role = secureLocalStorage.getItem("userRole");
    if (role === "admin") {
        menus = MENU_ADMIN;
    } else if (role === "alumni") {
        menus = MENU_ALUMNI;
    } else if (role === "faculty") {
        // menus = MENU_FACULTY;
    }

    const [collapsed, setCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [animateBell, setAnimateBell] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [filterUnread, setFilterUnread] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    const markAllAsReadMutation = useMutation(markAllNotificationsAsRead, {
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications", "classroom-list"]);
            message.success("All notifications marked as read");
        },
        onError: (error) => {
            message.error("Failed to mark all notifications as read");
        },
    });

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    const markAllNotificationsAsRead = async () => {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/notifications/mark-all-read", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to mark all notifications as read");
        }

        return response.json();
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Enhanced notification item component
    const NotificationItem = ({ notification }) => {
        const getPriorityColor = (priority) => {
            switch (priority) {
                case "high":
                    return "#ff4d4f";
                case "medium":
                    return "#faad14";
                case "low":
                    return "#52c41a";
                default:
                    return "#1890ff";
            }
        };

        const formatTime = (timestamp) => {
            if (!timestamp) return "Just now";
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString();
        };

        return (
            <List.Item
                style={{
                    padding: "12px 16px",
                    background: notification.read ? "#fff" : "#f0f7ff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderBottom: "1px solid #f0f0f0",
                    borderLeft: notification.read
                        ? "none"
                        : `3px solid ${getPriorityColor(
                              notification.priority
                          )}`,
                    borderRadius: "0",
                }}
                onClick={() => {}}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "100%",
                    }}
                >
                    <Avatar
                        size={40}
                        src={notification.sender?.avatar}
                        icon={!notification.sender?.avatar && <UserOutlined />}
                        style={{ marginRight: 12 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 4,
                            }}
                        >
                            <Text
                                strong
                                style={{ fontSize: "13px", lineHeight: "1.3" }}
                            >
                                {notification.title}
                            </Text>
                            <Badge
                                dot
                                color={getPriorityColor(notification.priority)}
                                size="small"
                                style={{ marginLeft: 8 }}
                            />
                        </div>
                        <Text
                            style={{
                                fontSize: "12px",
                                color: "#666",
                                lineHeight: "1.4",
                                display: "block",
                                marginBottom: 4,
                            }}
                        >
                            {notification.message}
                        </Text>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Space size="small">
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "11px" }}
                                >
                                    {notification.sender?.name}
                                </Text>
                                {!notification.read && (
                                    <Badge dot color="#1890ff" size="small" />
                                )}
                            </Space>
                            <Text type="secondary" style={{ fontSize: "10px" }}>
                                {formatTime(notification.created_at)}
                            </Text>
                        </div>
                    </div>
                </div>
            </List.Item>
        );
    };

    // Enhanced notifications dropdown
    const renderNotificationsDropdown = () => {
        const filteredNotifications = filterUnread
            ? notifications.filter((n) => !n.read)
            : notifications;

        return (
            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    width: 420,
                    maxHeight: 500,
                    overflow: "hidden",
                    border: "1px solid #f0f0f0",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "16px",
                        borderBottom: "1px solid #f0f0f0",
                        background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <Title
                                level={5}
                                style={{ color: "white", margin: 0 }}
                            >
                                Notifications
                            </Title>
                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.8)",
                                    fontSize: "12px",
                                }}
                            >
                                {unreadCount} unread{" "}
                                {unreadCount === 1 ? "message" : "messages"}
                            </Text>
                        </div>
                        <Space>
                            <Button
                                size="small"
                                type={filterUnread ? "primary" : "default"}
                                onClick={() => setFilterUnread(!filterUnread)}
                                style={{
                                    background: filterUnread
                                        ? "rgba(255,255,255,0.2)"
                                        : "transparent",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    color: "white",
                                }}
                            >
                                {filterUnread ? "Show All" : "Show Unread"}
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* Quick Actions */}
                <div
                    style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        background: "#fafafa",
                    }}
                >
                    <Space>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                type="link"
                                onClick={handleMarkAllAsRead}
                                loading={markAllAsReadMutation.isLoading}
                                icon={<EyeInvisibleOutlined />}
                                style={{ padding: 0, fontSize: "12px" }}
                            >
                                Mark all as read
                            </Button>
                        )}
                        <Button
                            size="small"
                            type="link"
                            icon={<MailOutlined />}
                            style={{ padding: 0, fontSize: "12px" }}
                            onClick={() => history.push("/notifications")}
                        >
                            Notification settings
                        </Button>
                    </Space>
                </div>

                {/* Notifications List */}
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {isLoading ? (
                        <div style={{ padding: 40, textAlign: "center" }}>
                            <Spin />
                            <div style={{ marginTop: 10, color: "#666" }}>
                                Loading notifications...
                            </div>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div
                            style={{
                                padding: 40,
                                textAlign: "center",
                                color: "#999",
                            }}
                        >
                            <BellOutlined
                                style={{
                                    fontSize: 32,
                                    marginBottom: 16,
                                    color: "#d9d9d9",
                                }}
                            />
                            <div style={{ fontSize: "14px" }}>
                                {filterUnread
                                    ? "No unread notifications"
                                    : "No notifications yet"}
                            </div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                We'll notify you when something arrives
                            </Text>
                        </div>
                    ) : (
                        <List
                            dataSource={filteredNotifications}
                            renderItem={(item) => (
                                <NotificationItem notification={item} />
                            )}
                        />
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div
                        style={{
                            borderTop: "1px solid #f0f0f0",
                            padding: "12px 16px",
                            textAlign: "center",
                            background: "#fafafa",
                        }}
                    >
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => history.push("/notifications")}
                            style={{ borderRadius: 6 }}
                        >
                            View All Notifications
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    // Enhanced account dropdown
    const renderAccountDropdown = () => (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                width: 280,
                padding: "8px 0",
            }}
        >
            {/* User Info Header */}
            <div
                style={{
                    padding: "16px",
                    textAlign: "center",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Avatar
                    size={64}
                    src={userData.avatar}
                    style={{ marginBottom: 12, border: "3px solid #1890ff" }}
                />
                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                    {userData.name}
                </Title>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                    {userData.email}
                </Text>
                <div style={{ marginTop: 8 }}>
                    <Badge
                        status="success"
                        text={
                            userData.role.charAt(0).toUpperCase() +
                            userData.role.slice(1)
                        }
                        style={{ fontSize: "11px" }}
                    />
                </div>
            </div>

            {/* Menu Items */}
            <Menu
                onClick={handleAccountItemClick}
                items={accountItems}
                style={{ border: "none" }}
            />
        </div>
    );

    const renderMenu = () => (
        <Menu theme="light" mode="inline">
            {menus.map((menu, i) => (
                <React.Fragment key={i}>
                    {!menu.subMenu && (
                        <Tooltip
                            title={isMobile ? null : menu.label}
                            placement="right"
                            className={
                                basePath === menu.url ||
                                basePath === menu.subUrl1 ||
                                basePath === menu.subUrl2
                                    ? "active-menu"
                                    : ""
                            }
                        >
                            <Menu.Item key={menu.key}>
                                {menu.icon}
                                <Link to={menu.url}>
                                    {isMobile ? menu.label : null}
                                </Link>
                            </Menu.Item>
                        </Tooltip>
                    )}
                    {menu.subMenu && (
                        <Menu.SubMenu
                            key={menu.key}
                            title={isMobile ? menu.label : null}
                            icon={menu.icon}
                        >
                            <Menu.ItemGroup key={menu.key}>
                                {menu.submenu.map((sub) => (
                                    <Menu.Item key={sub.key}>
                                        <Link to={sub.path}>{sub?.label}</Link>
                                    </Menu.Item>
                                ))}
                            </Menu.ItemGroup>
                        </Menu.SubMenu>
                    )}
                </React.Fragment>
            ))}
        </Menu>
    );

    useEffect(() => {
        if (
            Array.isArray(profile?.alumni_quizzes) &&
            profile?.alumni_quizzes?.length !== 2
        ) {
            setQuizzes(profile?.alumni_quizzes);
            setModalVisible(true);
        }
    }, [profile]);

    return (
        <>
            <Layout id="main-layout">
                {isMobile ? (
                    <Drawer
                        title={
                            <div className="logo">
                                <img src={logoMini} alt="Logo" />
                            </div>
                        }
                        placement="left"
                        closable={true}
                        onClose={toggleDrawer}
                        visible={drawerVisible}
                        width={280}
                        bodyStyle={{ padding: 0 }}
                    >
                        {renderMenu()}
                    </Drawer>
                ) : (
                    <div id={`sidebar-wrapper`} style={{ width: 80 }}>
                        <Sider
                            trigger={null}
                            collapsible
                            collapsed={!isMobile && collapsed}
                        >
                            <div className="logo">
                                <img
                                    src={logoMini}
                                    style={{ width: 80 }}
                                    alt="Logo"
                                />
                            </div>
                            {renderMenu()}
                        </Sider>
                    </div>
                )}

                <Layout className="site-layout">
                    <Header id="header">
                        <Row
                            style={{ flex: 1 }}
                            className="row-header"
                            justify="space-between"
                            align="middle"
                        >
                           <Col
    className="first"
    style={{ display: "flex", alignItems: "center", gap: 12 }}
>
    {isMobile && (
        <Button
            type="text"
            icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleDrawer}
            className="burger-menu"
        />
    )}

   <Text
    strong
    style={{
        fontSize: 28,
        fontWeight: 800,
        background: "linear-gradient(90deg, #667eea, #764ba2)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        letterSpacing: "0.5px",
        whiteSpace: "nowrap",
    }}
>
    Alumni Tracing Management System
</Text>

</Col>
                            <Col flex="230px" className="second">
                                <Space size="middle">
                                    {/* <Dropdown
                                        placement="bottomRight"
                                        trigger={["click"]}
                                        dropdownRender={
                                            renderNotificationsDropdown
                                        }
                                        overlayStyle={{ padding: 0 }}
                                        visible={dropdownVisible}
                                        onVisibleChange={setDropdownVisible}
                                    >
                                        <Badge
                                            count={unreadCount}
                                            offset={[-5, 5]}
                                            size="small"
                                            style={{
                                                boxShadow: "0 0 0 2px #fff",
                                            }}
                                        >
                                            <Button
                                                shape="circle"
                                                icon={<BellOutlined />}
                                                type="text"
                                                className={`btn-notification ${
                                                    animateBell
                                                        ? "bell-animate"
                                                        : ""
                                                }`}
                                                loading={isLoading}
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "1px solid #f0f0f0",
                                                }}
                                            />
                                        </Badge>
                                    </Dropdown> */}

                                    <Dropdown
                                        placement="bottomRight"
                                        trigger={["click"]}
                                        dropdownRender={renderAccountDropdown}
                                    >
                                        <Button
                                            type="text"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                height: 40,
                                                padding: "0 12px",
                                                border: "1px solid rgb(102 126 234)",
                                                borderRadius: 20,
                                                background: "#667eea40",
                                            }}
                                        >
                                            <Avatar
                                                size={24}
                                                src={userData.avatar}
                                                style={{ marginRight: 8 }}
                                            />
                                            <Text
                                                strong
                                                style={{ fontSize: "14px" }}
                                            >
                                                {userData.name.split(" ")[0]}
                                            </Text>
                                        </Button>
                                    </Dropdown>
                                </Space>
                            </Col>
                        </Row>
                    </Header>
                    <Content id="content">{children}</Content>
                    {/* <Footer id="footer">
                        <div className="copyright">© CoachConnect 2025</div>
                    </Footer> */}
                </Layout>
            </Layout>
            <Modal
                title="Select Quiz Type"
                open={modalVisible}
                onCancel={() => setModalVisible(true)}
                footer={null}
                closable={false}
                maskClosable={false}
            >
                <div style={{ textAlign: "center" }}>
                    <div
                        style={{
                            background: "#fff2e8",
                            border: "1px solid #ffbb96",
                            borderRadius: 6,
                            padding: 16,
                            marginBottom: 20,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    color: "#fa541c",
                                    fontSize: 18,
                                    marginRight: 8,
                                }}
                            >
                                ⚠
                            </span>
                            <span
                                style={{
                                    color: "#fa541c",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                }}
                            >
                                Required: Complete a quiz to continue using the
                                app
                            </span>
                        </div>
                    </div>

                    {Array.isArray(alumniQuizzes) &&
                        !alumniQuizzes.find((item) => item.type === "rating") && (
                            <Button
                                type="dashed"
                                size="large"
                                style={{ width: "100%", marginBottom: 16 }}
                                onClick={() =>
                                    (window.location.href = "answer-question")
                                }
                            >
                                Program Experience Rating ✅
                            </Button>
                        )}

                    {Array.isArray(alumniQuizzes) &&
                        !alumniQuizzes.find(
                            (item) => item.type === "abcd"
                        ) && (
                            <Button
                                type="dashed"
                                size="large"
                                style={{ width: "100%", marginBottom: 16 }}
                                onClick={() =>
                                    (window.location.href = "image-quiz")
                                }
                            >
                                Behavioral Assessment Questions ✅
                            </Button>
                        )}
                          {/* Logout Button */}
        <Button
            style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: "#fff", 
                borderColor: "#ff4d4f",  
                color: "#ff4d4f"         
            }}
            icon={<LogoutOutlined />} 
            onClick={logout}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fa8c16"; 
                e.currentTarget.style.color = "#fff";               
                e.currentTarget.style.borderColor = "#fa8c16";     
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";    
                e.currentTarget.style.color = "#ff4d4f";           
                e.currentTarget.style.borderColor = "#ff4d4f";   
            }}
            onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "#ff4d4f"; 
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#ff4d4f";
            }}
            onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = "#fa8c16"; 
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "#fa8c16";
            }}
        >
            Logout
        </Button>
                </div>
            </Modal>
        </>
    );
};

export default MainLayout;
