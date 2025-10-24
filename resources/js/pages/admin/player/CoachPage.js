import React, { useState } from "react";
import {
    Row,
    Col,
    Card,
    Avatar,
    Tag,
    Button,
    Space,
    Input,
    Select,
    Typography,
    Tooltip,
    Modal,
    Statistic,
    Divider,
    Progress,
    Rate,
    Tabs,
    Table,
    List,
    Descriptions,
    Timeline,
    Popconfirm,
    message,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    FilterOutlined,
    PlusOutlined,
    StarFilled,
    TrophyOutlined,
    TeamOutlined,
    MessageOutlined,
    EnvironmentOutlined,
    CrownOutlined,
    FireOutlined,
    HeartOutlined,
    ShareAltOutlined,
    DownloadOutlined,
    FlagOutlined,
    CloseCircleOutlined,
    SafetyCertificateOutlined,
    BookOutlined,
    HistoryOutlined,
    TrophyFilled,
    CrownFilled,
    SolutionOutlined,
    ExperimentOutlined,
    BulbOutlined,
    RocketOutlined,
    SafetyOutlined,
    GlobalOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { FloatingButton, Layout, Breadcrumb } from "~/components";
import useCoach from "~/hooks/useCoach";
import useSportsStore from "~/states/sportsState";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CoachDetailsModal = ({ coach, visible, onClose }) => {
    if (!coach) return null;

    return (
        <Modal
            title={`Coach Profile - ${coach?.user?.fname} ${coach?.user?.lname}`}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="edit" type="primary" icon={<EditOutlined />}>
                    Edit Profile
                </Button>,
            ]}
            width={800}
        >
            {/* Basic Info */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar size={80} src={coach.user?.image} />
                <Title level={3} style={{ margin: "16px 0 8px" }}>
                    {coach?.user?.fname} {coach?.user?.lname}
                </Title>
                <Space size={[8, 8]} wrap>
                    <Tag color={getStatusColor(coach.status)}>
                        {coach.status}
                    </Tag>
                    <Tag color="gold">
                        <StarFilled /> {coach.average_rating || 0}
                    </Tag>
                </Space>
            </div>

            {/* Main Details */}
            <Card title="Professional Information" style={{ marginBottom: 16 }}>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="Sport">
                        {coach.sport}
                    </Descriptions.Item>
                    <Descriptions.Item label="Specialization">
                        {coach.specialization}
                    </Descriptions.Item>
                    <Descriptions.Item label="Experience">
                        {coach.years_experience}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hourly Fee">
                        ₱{coach.fee}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bio">
                        {coach.detailed_bio}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Quick Stats */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Statistic title="Active Clients" value={coach.clients} />
                </Col>
                <Col span={8}>
                    <Statistic title="Rating" value={coach.rating} />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Hourly Fee"
                        value={coach.fee}
                        prefix="₱"
                    />
                </Col>
            </Row>

            {/* Specialties */}
            <Card title="Specialties" style={{ marginBottom: 16 }}>
                <Space wrap>
                    {Array.isArray(coach.specialties) &&
                        coach.specialties.map((specialty, index) => (
                            <Tag key={index} color="blue">
                                {specialty}
                            </Tag>
                        ))}
                </Space>
            </Card>
            <Card title="Valid ID">
                <img src={coach?.valid_id} />
            </Card>
        </Modal>
    );
};
// Booking history columns for coaches
const coachBookingColumns = [
    {
        title: "Booking ID",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
    },
    {
        title: "Event Type",
        dataIndex: "event",
        key: "event",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <Tag
                color={
                    status === "completed"
                        ? "green"
                        : status === "confirmed"
                        ? "blue"
                        : "orange"
                }
            >
                {status.toUpperCase()}
            </Tag>
        ),
    },
    {
        title: "Fee",
        dataIndex: "amount",
        key: "amount",
    },
];

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "green";
        case "pending":
            return "orange";
        case "inactive":
            return "red";
        default:
            return "blue";
    }
};

const getLevelColor = (level) => {
    switch (level) {
        case "Legendary":
            return "gold";
        case "Hall of Fame":
            return "purple";
        case "World Class":
            return "blue";
        case "Olympic":
            return "cyan";
        default:
            return "green";
    }
};

const CoachList = () => {
    const { approveCoach } = useSportsStore();
    const { isLoading, data: coaches = [], isFetching, refetch } = useCoach();
    const [searchText, setSearchText] = useState("");
    const [sportFilter, setSportFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    const getSpecializationColor = (specialization) => {
        const colors = {
            "Team Management": "blue",
            "Defensive Strategies": "red",
            "Player Development": "green",
            "Women's Football": "pink",
            "Technique Development": "cyan",
            "Offensive Systems": "orange",
        };
        return colors[specialization] || "default";
    };

    const filteredCoaches = coaches.filter((coach) => {
        const fullName = `${coach?.user?.fname || ""} ${
            coach?.user?.lname || ""
        }`.toLowerCase();

        const matchesSearch = fullName.includes(searchText.toLowerCase());
        const matchesSport =
            sportFilter === "all" || coach?.sport === sportFilter;
        const matchesStatus =
            statusFilter === "all" || coach?.status === statusFilter;

        return matchesSearch && matchesSport && matchesStatus;
    });

    const handleViewProfile = (coach) => {
        setSelectedCoach(coach);
        setModalVisible(true);
    };

    const handleApprove = async (coachName, coachId) => {
        try {
            // Your approve API call
            await approveCoach({ coach_id: coachId, status: "approved" });
            message.success(`Coach ${coachName} approved successfully!`);
            refetch();
        } catch (error) {
            message.error("Failed to approve coach. Please try again.");
        }
    };

    const handleDecline = async (coachName, coachId, reason) => {
        try {
            // Your decline API call with reason
            await approveCoach({
                coach_id: coachId,
                status: "declined",
                reason_declined: reason,
            });
            message.success(`Coach ${coachName} has been declined.`);
            setShowDeclineModal(false);
            setDeclineReason("");
            setSelectedCoach(null);
        } catch (error) {
            message.error("Failed to decline coach. Please try again.");
        }
    };

    const openDeclineModal = (coach) => {
        setSelectedCoach(coach);
        setShowDeclineModal(true);
    };

    const closeDeclineModal = () => {
        setShowDeclineModal(false);
        setDeclineReason("");
        setSelectedCoach(null);
    };

    const renderActionButtons = (coach) => {
        const coachName = `${coach?.user?.fname} ${coach?.user?.lname}`;

        switch (coach.status) {
            case "pending":
                return (
                    <Space
                        size="small"
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        <Tooltip title="View Profile">
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={() => handleViewProfile(coach)}
                            >
                                View
                            </Button>
                        </Tooltip>

                        <Popconfirm
                            title="Approve Coach"
                            description={`Are you sure you want to approve ${coachName} as a coach?`}
                            onConfirm={() =>
                                handleApprove(coachName, coach?.id)
                            }
                            okText="Yes"
                            cancelText="No"
                            okType="primary"
                        >
                            <Tooltip title="Approve Coach">
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    style={{
                                        borderRadius: "6px",
                                        background: "#52c41a",
                                        color: "white",
                                        border: "none",
                                    }}
                                >
                                    Approve
                                </Button>
                            </Tooltip>
                        </Popconfirm>

                        <Tooltip title="Decline Coach">
                            <Button
                                icon={<CloseCircleOutlined />}
                                size="small"
                                danger
                                style={{ borderRadius: "6px" }}
                                onClick={() => openDeclineModal(coach)}
                            >
                                Decline
                            </Button>
                        </Tooltip>
                    </Space>
                );

            case "approved":
                return (
                    <Space
                        size="small"
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        <Tooltip title="View Profile">
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                onClick={() => handleViewProfile(coach)}
                            >
                                View Profile
                            </Button>
                        </Tooltip>

                        {/* <Tag
                            color="green"
                            style={{ margin: 0, padding: "4px 8px" }}
                        >
                            <CheckCircleOutlined /> Approved
                        </Tag> */}
                    </Space>
                );

            case "declined":
                return (
                    <Space
                        size="small"
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        <Tooltip title="View Profile">
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                size="small"
                                style={{
                                    borderRadius: "6px",
                                    background:
                                        "linear-gradient(45deg, #32d1b3, #ff4d82)",
                                    border: "none",
                                }}
                                onClick={() => handleViewProfile(coach)}
                            >
                                View
                            </Button>
                        </Tooltip>

                        <Popconfirm
                            title="Approve Coach"
                            description={`Are you sure you want to approve ${coachName}?`}
                            onConfirm={() =>
                                handleApprove(coachName, coach?.id)
                            }
                            okText="Yes"
                            cancelText="No"
                            okType="primary"
                        >
                            <Tooltip title="Approve Coach">
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    size="small"
                                    style={{
                                        borderRadius: "6px",
                                        background: "#52c41a",
                                        color: "white",
                                        border: "none",
                                    }}
                                >
                                    Approve
                                </Button>
                            </Tooltip>
                        </Popconfirm>

                        <Tag
                            color="red"
                            style={{ margin: 0, padding: "4px 8px" }}
                        >
                            <CloseCircleOutlined /> Declined
                        </Tag>
                    </Space>
                );

            default:
                return null;
        }
    };

    return (
        <Layout breadcrumb={Breadcrumb.College()}>
            {/* Header Section */}
            <Card
                style={{
                    borderRadius: "20px",
                    marginBottom: "24px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    marginTop: 55,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <div>
                        <Title level={2} className="primary-text">
                            Coach Registry
                        </Title>
                        <Text type="secondary">
                            Manage professional coaches with comprehensive
                            profiles and booking system
                        </Text>
                    </div>
                    <Statistic
                        title="Total Coaches"
                        value={filteredCoaches.length}
                        valueStyle={{
                            color: "#32d1b3",
                            fontSize: "35px",
                        }}
                        prefix={<SolutionOutlined />}
                    />
                    {/* <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{
                            borderRadius: "8px",
                            background:
                                "linear-gradient(45deg, #32d1b3, #ff4d82)",
                            border: "none",
                        }}
                    >
                        Add New Coach
                    </Button> */}
                </div>

                {/* Filters and Search */}
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search coaches by name..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            style={{ borderRadius: "8px" }}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Sports"
                            style={{ width: "100%", borderRadius: "8px" }}
                            value={sportFilter}
                            onChange={setSportFilter}
                            suffixIcon={<FilterOutlined />}
                            size="large"
                        >
                            <Option value="all">All Sports</Option>
                            <Option value="Football">Football</Option>
                            <Option value="Basketball">Basketball</Option>
                            <Option value="Tennis">Tennis</Option>
                            <Option value="Swimming">Swimming</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Status"
                            style={{ width: "100%", borderRadius: "8px" }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            suffixIcon={<FilterOutlined />}
                            size="large"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={8}
                        style={{ textAlign: "right" }}
                    ></Col>
                </Row>
            </Card>

            {/* Coaches Grid */}
            <Row gutter={[24, 24]}>
                {filteredCoaches.map((coach) => (
                    <Col key={coach.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: "20px",
                                overflow: "hidden",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                border: "none",
                                height: "100%",
                            }}
                            bodyStyle={{ padding: "0" }}
                        >
                            {/* Profile Banner */}
                            <div
                                style={{
                                    position: "relative",
                                    height: "200px",
                                    //     ? `url(${coach.bannerImage})`
                                    //     : "linear-gradient(45deg, #32d1b3, #ff4d82)",
                                    backgroundImage: coach.bannerImage
                                        ? `url(${coach.bannerImage})`
                                        : "url(https://images.unsplash.com/photo-1678371270802-24596a4de23f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                                    // backgroundImage: coach.bannerImage"
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: "rgba(0,0,0,0.3)",
                                    }}
                                ></div>

                                {/* Profile Picture */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "-40px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        border: "4px solid white",
                                        borderRadius: "50%",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Avatar
                                        size={80}
                                        src={coach.image}
                                        icon={<UserOutlined />}
                                        style={{
                                            border: "3px solid #32d1b3",
                                        }}
                                    />
                                </div>

                                {/* Status Badge */}
                                <Tag
                                    color={getStatusColor(coach.status)}
                                    style={{
                                        position: "absolute",
                                        top: "12px",
                                        right: "12px",
                                        border: "none",
                                        fontWeight: "bold",
                                        borderRadius: "12px",
                                    }}
                                >
                                    {coach.status.toUpperCase()}
                                </Tag>

                                {/* Coach ID */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "12px",
                                        left: "12px",
                                        background: "rgba(0,0,0,0.7)",
                                        borderRadius: "12px",
                                        padding: "4px 12px",
                                    }}
                                >
                                    <Text
                                        strong
                                        style={{
                                            color: "white",
                                            fontSize: "12px",
                                        }}
                                    >
                                        #COACH-{coach.id}
                                    </Text>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div
                                style={{
                                    padding: "60px 20px 20px 20px",
                                    textAlign: "center",
                                }}
                            >
                                {/* Name and Level */}
                                <Title
                                    level={4}
                                    style={{
                                        margin: "8px 0 4px 0",
                                        color: "#32d1b3",
                                    }}
                                >
                                    {coach?.user?.fname} {coach?.user?.lname}
                                </Title>
                                <Tag
                                    color={getLevelColor(coach.level)}
                                    style={{
                                        marginBottom: "8px",
                                        borderRadius: "12px",
                                    }}
                                >
                                    {coach.level || "World Class"}
                                </Tag>

                                {/* Sport and Specialization */}
                                <div style={{ marginBottom: "8px" }}>
                                    <Text strong style={{ color: "#52c41a" }}>
                                        {coach.sport}
                                    </Text>
                                    <Text type="secondary">
                                        {" "}
                                        •{" "}
                                        {coach.specialization ||
                                            "Specialization"}
                                    </Text>
                                </div>

                                {/* Specialization Tag */}
                                <Tag
                                    color={getSpecializationColor(
                                        coach.specialization ||
                                            "Team Management"
                                    )}
                                    style={{
                                        marginBottom: "12px",
                                        borderRadius: "12px",
                                    }}
                                >
                                    {coach.specialization || "Team Management"}
                                </Tag>

                                {/* Rating */}
                                <div style={{ marginBottom: "16px" }}>
                                    <Rate
                                        disabled
                                        defaultValue={coach.average_rating || 0}
                                        allowHalf
                                        style={{ fontSize: "14px" }}
                                    />
                                    <Text
                                        style={{
                                            marginLeft: "8px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {coach.average_rating || 0}
                                    </Text>
                                </div>

                                <Divider style={{ margin: "12px 0" }} />

                                {/* Stats */}
                                <Row
                                    gutter={[8, 8]}
                                    style={{ marginBottom: "16px" }}
                                >
                                    <Col span={8}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={5}
                                                style={{
                                                    margin: 0,
                                                    color: "#32d1b3",
                                                }}
                                            >
                                                {coach.clients || 0}
                                            </Title>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Clients
                                            </Text>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={5}
                                                style={{
                                                    margin: 0,
                                                    color: "#52c41a",
                                                }}
                                            >
                                                {coach.years_experience || 0}
                                            </Title>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Experience
                                            </Text>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div style={{ textAlign: "center" }}>
                                            <Title
                                                level={5}
                                                style={{
                                                    margin: 0,
                                                    color: "#faad14",
                                                }}
                                            >
                                                {coach.fee || 233}
                                            </Title>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: "12px" }}
                                            >
                                                Hourly
                                            </Text>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Action Buttons */}
                                {renderActionButtons(coach)}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Coach Details Modal */}
            <CoachDetailsModal
                coach={selectedCoach}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            {/* Empty State */}
            {filteredCoaches.length === 0 && (
                <Card
                    style={{
                        textAlign: "center",
                        padding: "60px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.95)",
                    }}
                >
                    <Title level={3} type="secondary">
                        No coaches found
                    </Title>
                    <Text type="secondary">
                        Try adjusting your search criteria or filters
                    </Text>
                </Card>
            )}
            {/* Decline Reason Modal */}
            <Modal
                title="Decline Coach Application"
                open={showDeclineModal}
                onCancel={closeDeclineModal}
                footer={[
                    <div style={{ marginTop: 50 }}>
                        <Button key="cancel" onClick={closeDeclineModal}>
                            Cancel
                        </Button>
                        ,
                        <Button
                            key="submit"
                            type="primary"
                            danger
                            onClick={() =>
                                handleDecline(
                                    `${selectedCoach?.user?.fname} ${selectedCoach?.user?.lname}`,
                                    selectedCoach?.id,
                                    declineReason
                                )
                            }
                            disabled={!declineReason.trim()}
                        >
                            Submit Decline
                        </Button>
                        ,
                    </div>,
                ]}
            >
                <Text strong>
                    Please provide a reason for declining{" "}
                    {selectedCoach?.user?.fname} {selectedCoach?.user?.lname}'s
                    application:
                </Text>
                <TextArea
                    placeholder="Enter reason for decline (e.g., incomplete documentation, insufficient experience, etc.)"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    rows={4}
                    style={{ marginTop: 16 }}
                    maxLength={500}
                    showCount
                />
            </Modal>
        </Layout>
    );
};

export default CoachList;
