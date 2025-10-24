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
    Modal,
    Table,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    FilterOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Layout } from "~/components";
import usePlayer from "~/hooks/usePlayer";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;



const bookingColumns = [
  {
    title: "Booking ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Date",
    dataIndex: "created_at",
    key: "created_at",
    render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "-", // fallback if null
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (value) => 
      typeof value === "number" 
        ? value.toLocaleString("en-US", { style: "currency", currency: "PHP" }) 
        : "-", // fallback if null/invalid
  },
];


const BookingHistoryModal = ({ player, visible, onClose }) => {
    if (!player) return null;
  

    return (
        <Modal
            title={`Booking History - ${player?.fname} ${player?.lname}`}
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
            width={800}
        >
            <Table
                columns={bookingColumns}
                dataSource={Array.isArray(player.booking_history) ? player.booking_history : []}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                scroll={{ x: true }}
            />
        </Modal>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "green";
        case "inactive":
            return "red";
        default:
            return "blue";
    }
};

const getRoleColor = (role) => {
    switch (role) {
        case "admin":
            return "red";
        case "coach":
            return "blue";
        case "treasurer":
            return "orange";
        case "player":
            return "green";
        default:
            return "gray";
    }
};

const PlayerList = () => {
    const { isLoading, data: players = [], isFetching, refetch } = usePlayer();
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const filteredPlayers = players.filter((player) => {
        const matchesSearch =
            player.fname.toLowerCase().includes(searchText.toLowerCase()) ||
            player.lname.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || player.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleViewBookingHistory = (player) => {
        setSelectedPlayer(player);
        setModalVisible(true);
    };

    return (
        <Layout>
            {/* Header Section */}
            <Card
                style={{
                    marginBottom: "24px",
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
                        <Title level={2} style={{ margin: 0 }}>
                            User Management
                        </Title>
                        <Text type="secondary">
                            Manage all registered users
                        </Text>
                    </div>
                </div>

                {/* Filters and Search */}
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search users by name..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Roles"
                            style={{ width: "100%" }}
                            value={roleFilter}
                            onChange={setRoleFilter}
                            suffixIcon={<FilterOutlined />}
                            size="large"
                        >
                            <Option value="all">All Roles</Option>
                            <Option value="player">Player</Option>
                            <Option value="coach">Coach</Option>
                            <Option value="treasurer">Treasurer</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Status"
                            style={{ width: "100%" }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            suffixIcon={<FilterOutlined />}
                            size="large"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Users Grid */}
            <Row gutter={[16, 16]}>
                {filteredPlayers.map((player) => (
                    <Col key={player.id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: "8px",
                                height: "100%",
                            }}
                        >
                            <div style={{ textAlign: "center" }}>
                                {/* Avatar */}
                                <Avatar
                                    size={80}
                                    src={player.image}
                                    icon={<UserOutlined />}
                                    style={{
                                        marginBottom: "16px",
                                        border: "3px solid #f0f0f0",
                                    }}
                                />

                                {/* Name and Email */}
                                <Title level={4} style={{ margin: "8px 0" }}>
                                    {player.fname} {player.lname}
                                </Title>
                                <Text
                                    type="secondary"
                                    style={{
                                        display: "block",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {player.email}
                                </Text>

                                {/* Role and Status Tags */}
                                <Space
                                    size={[8, 8]}
                                    wrap
                                    style={{ marginBottom: "16px" }}
                                >
                                    <Tag color={getRoleColor(player.role)}>
                                        {player.role.toUpperCase()}
                                    </Tag>
                                    <Tag color={getStatusColor(player.status)}>
                                        {player.status.toUpperCase()}
                                    </Tag>
                                </Space>

                                {/* Action Button */}
                                <div style={{ marginTop: "16px" }}>
                                    <Button
                                        type="primary"
                                        icon={<EyeOutlined />}
                                        onClick={() =>
                                            handleViewBookingHistory(player)
                                        }
                                        block
                                    >
                                        View Booking History
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Booking History Modal */}
            <BookingHistoryModal
                player={selectedPlayer}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            {/* Empty State */}
            {filteredPlayers.length === 0 && (
                <Card
                    style={{
                        textAlign: "center",
                        padding: "60px",
                    }}
                >
                    <Title level={3} type="secondary">
                        No users found
                    </Title>
                    <Text type="secondary">
                        Try adjusting your search criteria or filters
                    </Text>
                </Card>
            )}
        </Layout>
    );
};

export default PlayerList;
