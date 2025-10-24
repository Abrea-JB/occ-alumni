import React, { useState, useMemo } from "react";
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
    Tabs,
    List,
    Descriptions,
    message,
    Badge,
    Image,
    Table,
    Collapse,
    Checkbox,
    InputNumber,
    Alert,
} from "antd";
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    UserOutlined,
    PhoneOutlined,
    CalendarOutlined,
    FilterOutlined,
    StarFilled,
    TeamOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    SolutionOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    DownloadOutlined,
    PieChartOutlined,
    MoneyCollectOutlined,
    RiseOutlined,
    FallOutlined,
    FileDoneOutlined,
    EnvironmentFilled,
    PhoneFilled,
    UsergroupAddOutlined,
    CalendarFilled,
} from "@ant-design/icons";
import { Layout, Breadcrumb } from "~/components";
import useBooking from "~/hooks/useBooking";
import dayjs from "dayjs";
import useSportsStore from "~/states/sportsState";
import { useMutation, useQueryClient } from "react-query";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;

// Player Join List Component
const PlayerJoinList = ({ players }) => {
    const playerColumns = [
        {
            title: "Player",
            dataIndex: "name",
            key: "name",
            render: (record) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <div>
                        <Text strong>
                            {`${record?.user?.fname || ""} ${
                                record?.user?.lname || ""
                            }`.trim()}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            ID: {record.id}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Join Date",
            dataIndex: "join_date",
            key: "join_date",
            render: (date) => (
                <>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {date}
                </>
            ),
        },
    ];

    const dataSource = players.map((player) => ({
        name: player,
        join_date: player?.created_at
            ? dayjs(player.created_at).format("MMM D, YYYY h:mm A")
            : "",
    }));

    return (
        <Card title="Registered Players" bordered={false}>
            <Table
                columns={playerColumns}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }}
                rowKey="id"
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

// Financial Summary Component
const FinancialSummary = ({ bookings }) => {
    const financialData = useMemo(() => {
        if (!Array.isArray(bookings)) return null;

        const totalRevenue = bookings.reduce(
            (sum, booking) =>
                sum + (booking.price || 0) * (booking.players?.length || 0),
            0
        );

        const coachCommissionRate = 0.15; // 15% commission
        const platformProfit = totalRevenue *  coachCommissionRate;
        const totalCoachCommission = totalRevenue  - platformProfit;

        return {
            totalRevenue,
            totalCoachCommission,
            platformProfit,
            coachCommissionRate: coachCommissionRate * 100,
            totalBookings: bookings.length,
            totalParticipants: bookings.reduce(
                (sum, booking) => sum + (booking.players?.length || 0),
                0
            ),
        };
    }, [bookings]);

    if (!financialData) return null;

    return (
        <Collapse
            defaultActiveKey={["1"]}
            style={{ marginBottom: 24, borderRadius: "12px" }}
            ghost
        >
            <Panel
                header={
                    <Space>
                        <PieChartOutlined style={{ color: "#1890ff" }} />
                        <Text strong style={{ fontSize: "16px" }}>
                            Financial Summary
                        </Text>
                    </Space>
                }
                key="1"
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{
                                background:
                                    "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                                borderRadius: "12px",
                                textAlign: "center",
                            }}
                        >
                            <Statistic
                                title="Total Revenue"
                                value={financialData.totalRevenue}
                                prefix="₱"
                                valueStyle={{ color: "#389e0d" }}
                                suffix={
                                    <MoneyCollectOutlined
                                        style={{ color: "#389e0d" }}
                                    />
                                }
                            />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                From {financialData.totalBookings} bookings
                            </Text>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{
                                background:
                                    "linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)",
                                borderRadius: "12px",
                                textAlign: "center",
                            }}
                        >
                            <Statistic
                                title="Coach Commission"
                                value={financialData.totalCoachCommission}
                                prefix="₱"
                                valueStyle={{ color: "#fa8c16" }}
                                suffix={
                                    <Text
                                        style={{
                                            fontSize: "12px",
                                            color: "#fa8c16",
                                        }}
                                    >
                                        ({financialData.coachCommissionRate}%)
                                    </Text>
                                }
                            />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Paid to coaches
                            </Text>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{
                                background:
                                    "linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)",
                                borderRadius: "12px",
                                textAlign: "center",
                            }}
                        >
                            <Statistic
                                title="Platform Profit"
                                value={financialData.platformProfit}
                                prefix="₱"
                                valueStyle={{ color: "#1890ff" }}
                                suffix={
                                    financialData.platformProfit >= 0 ? (
                                        <RiseOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                    ) : (
                                        <FallOutlined
                                            style={{ color: "#ff4d4f" }}
                                        />
                                    )
                                }
                            />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Net profit after commissions
                            </Text>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Card
                            bordered={false}
                            style={{
                                background:
                                    "linear-gradient(135deg, #f9f0ff 0%, #d3adf7 100%)",
                                borderRadius: "12px",
                                textAlign: "center",
                            }}
                        >
                            <Statistic
                                title="Total Participants"
                                value={financialData.totalParticipants}
                                valueStyle={{ color: "#722ed1" }}
                                prefix={<TeamOutlined />}
                            />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Across all sessions
                            </Text>
                        </Card>
                    </Col>
                </Row>

                {/* Detailed Breakdown */}
                <Card
                    title="Detailed Financial Breakdown"
                    style={{ marginTop: 16 }}
                    bordered={false}
                >
                    <Row gutter={[24, 16]}>
                        <Col span={24}>
                            <Descriptions bordered column={2} size="middle">
                                <Descriptions.Item label="Gross Revenue">
                                    <Text strong>
                                        ₱
                                        {financialData.totalRevenue.toLocaleString()}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Commission Rate">
                                    <Tag color="orange">
                                        {financialData.coachCommissionRate}%
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Coach Commission">
                                    <Text type="warning">
                                        ₱
                                        {financialData.totalCoachCommission.toLocaleString()}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Platform Profit">
                                    <Text
                                        type={
                                            financialData.platformProfit >= 0
                                                ? "success"
                                                : "danger"
                                        }
                                        strong
                                    >
                                        ₱
                                        {financialData.platformProfit.toLocaleString()}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label="Profit Margin"
                                    span={2}
                                >
                                    <Progress
                                        percent={
                                            financialData.totalRevenue > 0
                                                ? Math.round(
                                                      (financialData.platformProfit /
                                                          financialData.totalRevenue) *
                                                          100
                                                  )
                                                : 0
                                        }
                                        format={(percent) => `${percent}%`}
                                        status={
                                            financialData.platformProfit >= 0
                                                ? "active"
                                                : "exception"
                                        }
                                    />
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>
                    </Row>
                </Card>
            </Panel>
        </Collapse>
    );
};

// Release Payment Tab Component
const ReleasePaymentTab = ({ bookings }) => {
    const queryClient = useQueryClient();
    const { releasedPayment } = useSportsStore();
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState("all");
    const [releaseNote, setReleaseNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter completed bookings that are ready for payment
    const availableBookings = bookings.map((booking) => ({
        id: booking.id,
        booking_title: booking.booking_title,
        coach_name: `${booking.coach?.user?.fname || ""} ${
            booking.coach?.user?.lname || ""
        }`.trim(),
        coach_id: booking.coach?.id,
        session_date: booking.end_date,
        amount: (booking.price || 0) * (booking.players?.length || 0),
        participants: booking.players?.length || 0,
        status: "completed",
    }));

    const handleBookingSelect = (bookingId, checked) => {
        if (checked) {
            setSelectedBookings((prev) => [...prev, bookingId]);
        } else {
            setSelectedBookings((prev) =>
                prev.filter((id) => id !== bookingId)
            );
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            const filteredBookings = availableBookings
                .filter(
                    (booking) =>
                        selectedCoach === "all" ||
                        booking.coach_id?.toString() === selectedCoach
                )
                .map((booking) => booking.id);
            setSelectedBookings(filteredBookings);
        } else {
            setSelectedBookings([]);
        }
    };

    const handleReleasePayment = async () => {
        if (selectedBookings.length === 0) {
            message.warning(
                "Please select at least one booking to release payment"
            );
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await releasedPayment({
                booking_id: selectedBookings,
            });
            queryClient.invalidateQueries("bookings");

            message.success(
                `Successfully released payment for ${selectedBookings.length} booking(s)`
            );
            setSelectedBookings([]);
            setReleaseNote("");
        } catch (error) {
            console.log(error);
            message.error("Failed to release payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredBookings = availableBookings.filter(
        (booking) =>
            selectedCoach === "all" ||
            booking.coach_id?.toString() === selectedCoach
    );

    const selectedBookingsData = availableBookings.filter((booking) =>
        selectedBookings.includes(booking.id)
    );

    // Calculate financial breakdown
    const totalAmount = selectedBookingsData.reduce(
        (sum, booking) => sum + booking.amount,
        0
    );
    const commissionRate = 15; // 15% commission for coaches
    const commissionAmount = totalAmount * (commissionRate / 100);
    const netAmount = totalAmount - commissionAmount;

    // Get unique coaches for filter
    const coaches = Array.from(
        new Map(
            availableBookings
                .filter((booking) => booking.coach_id)
                .map((booking) => [
                    booking.coach_id,
                    {
                        id: booking.coach_id,
                        name: booking.coach_name,
                    },
                ])
        ).values()
    );

    return (
        <div>
            <Alert
                message="Payment Release Instructions"
                description="Select completed bookings and release payments to coaches. The system automatically deducts 15% platform commission."
                type="info"
                showIcon
                style={{ marginBottom: 16, borderRadius: "8px" }}
            />

            <Row gutter={[24, 24]}>
                {/* Available Bookings Section */}
                <Col span={14}>
                    <Card
                        title={
                            <Space>
                                <FileDoneOutlined />
                                Available Bookings for Payment Release
                                <Badge
                                    count={filteredBookings.length}
                                    showZero
                                />
                            </Space>
                        }
                        bordered={false}
                        style={{ borderRadius: "12px", height: "100%" }}
                        extra={
                            <Select
                                placeholder="Filter by Coach"
                                style={{ width: 200 }}
                                value={selectedCoach}
                                onChange={setSelectedCoach}
                                allowClear
                            >
                                <Option value="all">All Coaches</Option>
                                {coaches.map((coach) => (
                                    <Option
                                        key={coach.id}
                                        value={coach.id.toString()}
                                    >
                                        {coach.name}
                                    </Option>
                                ))}
                            </Select>
                        }
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Checkbox
                                onChange={(e) =>
                                    handleSelectAll(e.target.checked)
                                }
                                checked={
                                    selectedBookings.length ===
                                        filteredBookings.length &&
                                    filteredBookings.length > 0
                                }
                                indeterminate={
                                    selectedBookings.length > 0 &&
                                    selectedBookings.length <
                                        filteredBookings.length
                                }
                            >
                                <Text strong>
                                    Select All ({filteredBookings.length}{" "}
                                    bookings)
                                </Text>
                            </Checkbox>
                        </div>

                        <List
                            dataSource={filteredBookings}
                            renderItem={(booking) => (
                                <List.Item
                                    actions={[
                                        <Checkbox
                                            checked={selectedBookings.includes(
                                                booking.id
                                            )}
                                            onChange={(e) =>
                                                handleBookingSelect(
                                                    booking.id,
                                                    e.target.checked
                                                )
                                            }
                                        />,
                                    ]}
                                    style={{
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        padding: "12px",
                                        background: selectedBookings.includes(
                                            booking.id
                                        )
                                            ? "#f0f8ff"
                                            : "#fff",
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{
                                                    backgroundColor:
                                                        selectedBookings.includes(
                                                            booking.id
                                                        )
                                                            ? "#1890ff"
                                                            : "#f0f0f0",
                                                    color: selectedBookings.includes(
                                                        booking.id
                                                    )
                                                        ? "#fff"
                                                        : "#000",
                                                }}
                                            >
                                                {booking.coach_name?.charAt(
                                                    0
                                                ) || "C"}
                                            </Avatar>
                                        }
                                        title={
                                            <Space>
                                                <Text strong>
                                                    #{booking.id}
                                                </Text>
                                                <Text>
                                                    {booking.booking_title}
                                                </Text>
                                            </Space>
                                        }
                                        description={
                                            <Space
                                                direction="vertical"
                                                size={0}
                                            >
                                                <Text type="secondary">
                                                    Coach: {booking.coach_name}
                                                </Text>
                                                <Text type="secondary">
                                                    Date: {booking.session_date}
                                                </Text>
                                                <Text type="secondary">
                                                    Participants:{" "}
                                                    {booking.participants}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                    <div style={{ textAlign: "right" }}>
                                        <Text
                                            strong
                                            style={{
                                                color: "#52c41a",
                                                fontSize: "16px",
                                            }}
                                        >
                                            ₱{booking.amount}
                                        </Text>
                                        <br />
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: "12px" }}
                                        >
                                            Coach: ₱
                                            {(booking.amount * 0.85).toFixed(2)}
                                        </Text>
                                    </div>
                                </List.Item>
                            )}
                            pagination={{
                                pageSize: 5,
                                showSizeChanger: false,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} bookings`,
                            }}
                        />
                    </Card>
                </Col>

                {/* Release Form Section */}
                <Col span={10}>
                    <Card
                        title={
                            <Space>
                                <MoneyCollectOutlined />
                                Release Payment
                                {selectedBookings.length > 0 && (
                                    <Badge
                                        count={selectedBookings.length}
                                        style={{ backgroundColor: "#52c41a" }}
                                    />
                                )}
                            </Space>
                        }
                        bordered={false}
                        style={{ borderRadius: "12px" }}
                    >
                        {selectedBookings.length > 0 ? (
                            <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                            >
                                {/* Financial Summary */}
                                <Card
                                    size="small"
                                    style={{
                                        background: "#f6ffed",
                                        border: "1px solid #b7eb8f",
                                    }}
                                >
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Selected Bookings">
                                            <Text strong>
                                                {selectedBookings.length}{" "}
                                                bookings
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Total Amount">
                                            <Text strong>
                                                ₱{totalAmount.toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Platform Profit">
                                            <Text
                                                strong
                                                type="success"
                                                style={{ fontSize: "18px" }}
                                            >
                                                ₱{commissionAmount.toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={`Amount to Release (${commissionRate}%)`}
                                        >
                                            <Text type="warning" strong>
                                                ₱{netAmount.toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>

                                {/* Release Note */}
                                {/* <div>
                                    <Text strong>Release Notes</Text>
                                    <TextArea
                                        placeholder="Add payment release notes (optional)"
                                        value={releaseNote}
                                        onChange={(e) =>
                                            setReleaseNote(e.target.value)
                                        }
                                        rows={4}
                                        style={{ marginTop: 8 }}
                                    />
                                </div> */}

                                {/* Action Buttons */}
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <Button
                                        type="primary"
                                        icon={<MoneyCollectOutlined />}
                                        size="large"
                                        block
                                        loading={isSubmitting}
                                        onClick={handleReleasePayment}
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                                            border: "none",
                                            height: "45px",
                                            borderRadius: "8px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        RELEASE PAYMENT (₱
                                        {commissionAmount.toFixed(2)})
                                    </Button>

                                    <Button
                                        onClick={() => setSelectedBookings([])}
                                        disabled={isSubmitting}
                                        block
                                        size="large"
                                    >
                                        Clear Selection
                                    </Button>
                                </Space>

                                {/* Selected Bookings List */}
                                <div style={{ marginTop: 16 }}>
                                    <Text strong>Selected Bookings:</Text>
                                    <List
                                        size="small"
                                        dataSource={selectedBookingsData}
                                        renderItem={(booking) => (
                                            <List.Item>
                                                <Text>
                                                    #{booking.id} -{" "}
                                                    {booking.booking_title}
                                                </Text>
                                                <div
                                                    style={{
                                                        textAlign: "right",
                                                    }}
                                                >
                                                    <Text strong>
                                                        ₱{booking.amount}
                                                    </Text>
                                                    <br />
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        Coach: ₱
                                                        {(
                                                            booking.amount *
                                                            0.85
                                                        ).toFixed(2)}
                                                    </Text>
                                                </div>
                                            </List.Item>
                                        )}
                                        style={{
                                            marginTop: 8,
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                        }}
                                    />
                                </div>
                            </Space>
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px 0",
                                }}
                            >
                                <MoneyCollectOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Text type="secondary">
                                    Select bookings from the left to release
                                    payments
                                </Text>
                            </div>
                        )}
                    </Card>

                    {/* Quick Stats */}
                    <Card
                        title="Quick Stats"
                        bordered={false}
                        style={{ marginTop: 16, borderRadius: "12px" }}
                        size="small"
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <Statistic
                                    title="Available"
                                    value={availableBookings.length}
                                    prefix={<FileDoneOutlined />}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Selected"
                                    value={selectedBookings.length}
                                    valueStyle={{ color: "#1890ff" }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Col>
                        </Row>
                        <Divider style={{ margin: "12px 0" }} />
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Statistic
                                    title="Platform Commission"
                                    value={commissionAmount}
                                    prefix="₱"
                                    valueStyle={{ color: "#fa8c16" }}
                                    suffix={`(${commissionRate}%)`}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// Booking Details Modal Component
const BookingDetailsModal = ({ booking, visible, onClose }) => {
    const [activeTab, setActiveTab] = useState("details");

    const bookingFinancialData = useMemo(() => {
        if (!booking) return null;

        const totalRevenue =
            (booking.price || 0) * (booking.players?.length || 0);
        const coachCommission = totalRevenue * 0.15; // 15%
        const platformProfit = totalRevenue - coachCommission;

        return {
            totalRevenue,
            coachCommission,
            platformProfit,
            commissionRate: 15,
        };
    }, [booking]);

    if (!booking) {
        return null;
    }

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <FileTextOutlined style={{ color: "#1890ff" }} />
                    <span>Booking Details - {booking.booking_title}</span>
                </div>
            }
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="export" icon={<DownloadOutlined />}>
                    Export List
                </Button>,
                <Button key="contact" icon={<PhoneFilled />}>
                    {booking.contact}
                </Button>,
                <Button key="edit" type="primary" icon={<EditOutlined />}>
                    Edit Booking
                </Button>,
            ]}
            width={1200}
            style={{ top: 20 }}
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                type="card"
                size="large"
            >
                {/* Details Tab */}
                <TabPane
                    tab={
                        <span>
                            <FileTextOutlined /> Booking Details
                        </span>
                    }
                    key="details"
                >
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            {booking.banner && (
                                <div style={{ marginBottom: 24 }}>
                                    <Image
                                        src={booking.banner}
                                        alt={booking.booking_title}
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            )}

                            <Card title="Booking Information" bordered={false}>
                                <Descriptions column={2} bordered>
                                    <Descriptions.Item label="Booking Title">
                                        <Text strong>
                                            {booking.booking_title}
                                        </Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        <Tag
                                            color={
                                                booking.status === "active"
                                                    ? "green"
                                                    : "red"
                                            }
                                        >
                                            {String(
                                                booking.status
                                            ).toUpperCase()}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Coach">
                                        {booking.coach?.user?.fname || "N/A"}{" "}
                                        {booking.coach?.user?.lname || "N/A"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Sport">
                                        {booking.sport?.name || "N/A"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Date Range">
                                        <CalendarOutlined />{" "}
                                        {booking.start_date} to{" "}
                                        {booking.end_date}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Time">
                                        <ClockCircleOutlined />{" "}
                                        {booking.start_time} -{" "}
                                        {booking.end_time}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Duration">
                                        {calculateDuration(
                                            booking.start_time,
                                            booking.end_time
                                        )}{" "}
                                        hours
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Location">
                                        <EnvironmentFilled />{" "}
                                        {booking.localtion}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Price">
                                        <DollarOutlined /> ₱{booking.price}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Vacant Spots">
                                        <UsergroupAddOutlined />{" "}
                                        {booking.vacant} available
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Contact" span={2}>
                                        <PhoneFilled /> {booking.contact}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label="Description"
                                        span={2}
                                    >
                                        {booking.description}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Coach Information" bordered={false}>
                                <div
                                    style={{
                                        textAlign: "center",
                                        marginBottom: 16,
                                    }}
                                >
                                    <Avatar
                                        size={64}
                                        src={booking.coach?.image}
                                        icon={<UserOutlined />}
                                    />
                                    <Title level={5} style={{ marginTop: 8 }}>
                                        {booking.coach?.user?.fname}{" "}
                                        {booking.coach?.user?.lname}
                                    </Title>
                                    <Text type="secondary">
                                        {booking.coach?.sport}
                                    </Text>
                                </div>
                                <List size="small">
                                    <List.Item>
                                        <StarFilled
                                            style={{ color: "#faad14" }}
                                        />{" "}
                                        Rating: 4
                                    </List.Item>
                                    <List.Item>
                                        <TeamOutlined /> Clients: 33
                                    </List.Item>
                                    <List.Item>
                                        <DollarOutlined /> Hourly Rate: ₱
                                        {booking.coach?.fee || "N/A"}
                                    </List.Item>
                                </List>
                            </Card>

                            <Card
                                title="Quick Statistics"
                                style={{ marginTop: 24 }}
                                bordered={false}
                            >
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                    size="large"
                                >
                                    <div>
                                        <Text>Capacity Utilization</Text>
                                        <Progress
                                            percent={calculateCapacityPercent(
                                                booking.vacant,
                                                booking.total_capacity
                                            )}
                                            status="active"
                                        />
                                    </div>
                                    <Statistic
                                        title="Days Remaining"
                                        value={calculateDaysRemaining(
                                            booking.end_date
                                        )}
                                        valueStyle={{ color: "#52c41a" }}
                                    />
                                    <Statistic
                                        title="Total Revenue"
                                        value={
                                            booking.players?.filter(
                                                (p) => p.status === "released"
                                            ).length * booking.price
                                        }
                                        prefix="₱"
                                    />
                                </Space>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                {/* Players Tab */}
                <TabPane
                    tab={
                        <span>
                            <TeamOutlined /> Registered Players
                            {booking.players && booking.players.length > 0 && (
                                <Badge
                                    count={booking.players.length}
                                    style={{ marginLeft: 8 }}
                                />
                            )}
                        </span>
                    }
                    key="players"
                >
                    <PlayerJoinList players={booking.players || []} />

                    {/* Player Statistics */}
                    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                        <Col span={6}>
                            <Card
                                bordered={false}
                                style={{
                                    background: "#f6ffed",
                                    textAlign: "center",
                                }}
                            >
                                <Statistic
                                    title="Total Registered"
                                    value={booking.players?.length || 0}
                                    valueStyle={{ color: "#1890ff" }}
                                    prefix={<TeamOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                bordered={false}
                                style={{
                                    background: "#f6ffed",
                                    textAlign: "center",
                                }}
                            >
                                <Statistic
                                    title="Confirmed"
                                    value={
                                        booking.players?.filter(
                                            (p) => p.status === "confirmed"
                                        ).length || 0
                                    }
                                    valueStyle={{ color: "#52c41a" }}
                                    prefix={<CheckCircleFilled />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                bordered={false}
                                style={{
                                    background: "#fff7e6",
                                    textAlign: "center",
                                }}
                            >
                                <Statistic
                                    title="Pending"
                                    value={
                                        booking.players?.filter(
                                            (p) => p.status === "pending"
                                        ).length || 0
                                    }
                                    valueStyle={{ color: "#faad14" }}
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card
                                bordered={false}
                                style={{
                                    background: "#fff2f0",
                                    textAlign: "center",
                                }}
                            >
                                <Statistic
                                    title="Rejected"
                                    value={
                                        booking.players?.filter(
                                            (p) => p.status === "rejected"
                                        ).length || 0
                                    }
                                    valueStyle={{ color: "#ff4d4f" }}
                                    prefix={<CloseCircleFilled />}
                                />
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                {/* Payment Tab */}
                <TabPane
                    tab={
                        <span>
                            <CreditCardOutlined /> Payments
                        </span>
                    }
                    key="payments"
                >
                    <Card title="Payment Summary" bordered={false}>
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Statistic
                                    title="Total Expected Revenue"
                                    value={booking.price * booking.vacant}
                                    prefix="₱"
                                    valueStyle={{ color: "#3f8600" }}
                                />
                            </Col>
                            <Col span={12}>
                                <Statistic
                                    title="Received Payments"
                                    value={
                                        booking.players.length * booking.price
                                    }
                                    prefix="₱"
                                    valueStyle={{ color: "#52c41a" }}
                                />
                            </Col>
                        </Row>

                        {/* Financial Breakdown */}
                        {bookingFinancialData && (
                            <Card
                                title="Financial Breakdown"
                                style={{ marginTop: 24 }}
                                bordered={false}
                            >
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Statistic
                                            title="Total Revenue"
                                            value={
                                                bookingFinancialData.totalRevenue
                                            }
                                            prefix="₱"
                                            valueStyle={{ color: "#389e0d" }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Coach Commission"
                                            value={
                                                bookingFinancialData.coachCommission
                                            }
                                            prefix="₱"
                                            valueStyle={{ color: "#fa8c16" }}
                                        />
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: "12px" }}
                                        >
                                            {
                                                bookingFinancialData.commissionRate
                                            }
                                            % of revenue
                                        </Text>
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Platform Profit"
                                            value={
                                                bookingFinancialData.platformProfit
                                            }
                                            prefix="₱"
                                            valueStyle={{ color: "#1890ff" }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    </Card>
                </TabPane>
            </Tabs>
        </Modal>
    );
};

// Booking Card Component
const BookingCard = ({ booking, onView, updateStatus }) => {
    const daysRemaining = calculateDaysRemaining(booking.end_date);
    const capacityPercent = calculateCapacityPercent(
        booking.vacant,
        booking.total_capacity
    );
    const confirmedPlayers =
        booking.players?.filter((p) => p.status === "confirmed").length || 0;

    return (
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
            cover={
                <div style={{ position: "relative" }}>
                    <img
                        alt={booking.booking_title}
                        src={booking.banner}
                        style={{
                            height: 200,
                            objectFit: "cover",
                            width: "100%",
                        }}
                    />
                    <Tag
                        color={getStatusColor(booking.status)}
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            border: "none",
                            fontWeight: "bold",
                            borderRadius: "12px",
                        }}
                    >
                        {getStatusIcon(booking.status)}{" "}
                        {String(booking.status || "").toUpperCase()}
                    </Tag>
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
                            style={{ color: "white", fontSize: "12px" }}
                        >
                            #BK-{booking.id}
                        </Text>
                    </div>
                    {booking.players && booking.players.length > 0 && (
                        <Badge
                            count={`${confirmedPlayers}/${booking.players.length} players`}
                            style={{
                                position: "absolute",
                                bottom: "12px",
                                left: "12px",
                                background: "rgba(0,0,0,0.7)",
                                color: "white",
                            }}
                        />
                    )}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "12px",
                            left: "12px",
                            background: "rgb(0 142 255 / 80%)",
                            borderRadius: "12px",
                            padding: "4px 12px",
                        }}
                    >
                        <Text
                            strong
                            style={{ color: "white", fontSize: "12px" }}
                        >
                            {booking?.sports?.name}
                        </Text>
                    </div>
                </div>
            }
        >
            <div style={{ padding: "20px" }}>
                <Title
                    level={4}
                    style={{ margin: "0 0 8px 0", color: "#32d1b3" }}
                >
                    {booking.booking_title}
                </Title>

                <div style={{ marginBottom: "8px" }}>
                    <SolutionOutlined
                        style={{ marginRight: 8, color: "#1890ff" }}
                    />
                    <Text strong>
                        Coach: {booking.coach?.user?.fname || "N/A"}{" "}
                        {booking.coach?.user?.lname || "N/A"}
                    </Text>
                </div>

                <Tag
                    color="blue"
                    style={{ marginBottom: "12px", borderRadius: "12px" }}
                >
                    {booking.sport?.name}
                </Tag>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginBottom: "12px",
                        height: "40px",
                        overflow: "hidden",
                    }}
                >
                    {booking.description}
                </Text>

                <div style={{ marginBottom: "12px" }}>
                    <CalendarOutlined
                        style={{ marginRight: 8, color: "#1890ff" }}
                    />
                    <Text strong>
                        {dayjs(booking.start_date).format("MMM D, YYYY")} to{" "}
                        {dayjs(booking.end_date).format("MMM D, YYYY")}
                    </Text>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <ClockCircleOutlined
                        style={{ marginRight: 8, color: "#faad14" }}
                    />
                    <Text>
                        {dayjs(booking.start_time, "HH:mm").format("h:mm A")} -{" "}
                        {dayjs(booking.end_time, "HH:mm").format("h:mm A")}
                    </Text>
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <EnvironmentFilled
                        style={{ marginRight: 8, color: "#52c41a" }}
                    />
                    <Text type="secondary">{booking.localtion}</Text>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <Row gutter={[8, 8]} style={{ marginBottom: "16px" }}>
                    <Col span={6}>
                        <div style={{ textAlign: "center" }}>
                            <Title
                                level={5}
                                style={{ margin: 0, color: "#32d1b3" }}
                            >
                                ₱{booking.price}
                            </Title>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Price
                            </Text>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: "center" }}>
                            <Title
                                level={5}
                                style={{ margin: 0, color: "#52c41a" }}
                            >
                                {booking.vacant}/{booking?.players?.length}
                            </Title>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Vacant
                            </Text>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: "center" }}>
                            <Title
                                level={5}
                                style={{ margin: 0, color: "#faad14" }}
                            >
                                {daysRemaining}
                            </Title>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Days Left
                            </Text>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: "center" }}>
                            <Title
                                level={5}
                                style={{ margin: 0, color: "#1890ff" }}
                            >
                                {confirmedPlayers}
                            </Title>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                Players
                            </Text>
                        </div>
                    </Col>
                </Row>

                <Progress
                    percent={capacityPercent}
                    size="small"
                    style={{ marginBottom: "16px" }}
                />

                <Space style={{ width: "100%", justifyContent: "center" }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={onView}
                    >
                        View Details
                    </Button>
                    {booking.status === "done" && (
                        <Button
                            onClick={() => updateStatus(booking?.id)}
                            icon={<CheckCircleFilled />}
                        >
                            Ready for Release
                        </Button>
                    )}
                </Space>
            </div>
        </Card>
    );
};

// Utility functions
const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
};

const calculateCapacityPercent = (vacant, totalCapacity) => {
    if (!totalCapacity) return 0;
    return Math.round(((totalCapacity - vacant) / totalCapacity) * 100);
};

const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatusColor = (status) => {
    return status === "active" ? "green" : "red";
};

const getStatusIcon = (status) => {
    return status === "active" ? (
        <PlayCircleOutlined />
    ) : (
        <PauseCircleOutlined />
    );
};

// Main Component
const CoachBookingList = () => {
    const queryClient = useQueryClient();
    const { updateBookingStatus } = useSportsStore();
    const {
        isLoading,
        data: bookings = [],
        isFetching,
        refetch,
    } = useBooking();
    const forreleasedBookings = bookings.filter(
        (booking) => booking.status === "for-release"
    );
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sportFilter, setSportFilter] = useState("all");
    const [coachFilter, setCoachFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("sessions");

    // Get unique coaches for filter
    const coaches = Array.from(
        new Map(
            bookings
                .filter((booking) => booking.coach?.id)
                .map((booking) => [
                    booking.coach.id,
                    {
                        id: booking.coach.id,
                        name: `${booking.coach.user?.fname || ""} ${
                            booking.coach.user?.lname || ""
                        }`.trim(),
                    },
                ])
        ).values()
    );

    const sports = Array.from(
        new Map(
            bookings
                .filter((booking) => booking.sports?.id)
                .map((booking) => [
                    booking.sports.id,
                    {
                        id: booking.sports.id,
                        name: booking.sports?.name,
                    },
                ])
        ).values()
    );

    const handleViewBooking = (booking) => {
        setSelectedBooking(booking);
        setModalVisible(true);
    };

    const filteredBookings =
        Array.isArray(bookings) &&
        bookings.filter((booking) => {
            const matchesSearch =
                booking.booking_title
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                booking.description
                    ?.toLowerCase()
                    .includes(searchText.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || booking.status === statusFilter;
            const matchesSport =
                sportFilter === "all" || booking.sports?.name === sportFilter;
            const matchesCoach =
                coachFilter === "all" || booking.coach?.id === coachFilter;

            return (
                matchesSearch && matchesStatus && matchesSport && matchesCoach
            );
        });

    const activeBookings = filteredBookings.filter(
        (b) => b.status === "active"
    );
    const inactiveBookings = filteredBookings.filter(
        (b) => b.status === "inactive"
    );
    const ongoingBookings = filteredBookings.filter(
        (b) => b.status === "ongoing"
    );
    const doneBookings = filteredBookings.filter((b) => b.status === "done");
    const releasedBookings = filteredBookings.filter(
        (b) => b.status === "released"
    );

    const stats = {
        total: filteredBookings.length,
        active: activeBookings.length,
        inactive: inactiveBookings.length,
        totalRevenue: filteredBookings.reduce((sum, b) => sum + b.price, 0),
        totalParticipants: filteredBookings.reduce(
            (sum, b) => sum + (b.players?.length || 0),
            0
        ),
        totalCoaches: new Set(filteredBookings.map((b) => b.coach_id)).size,
    };

    const updateStatus = async (booking) => {
        const response = await updateBookingStatus({
            id: booking?.id,
            status: "for-release",
        });
        queryClient.invalidateQueries("bookings");
        message.success(`Booking Successfully Updated.`);
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
                            Coach Booking Sessions
                        </Title>
                        <Text type="secondary">
                            Manage coaching sessions, player registrations, and
                            coach payments
                        </Text>
                    </div>
                    <Statistic
                        title="Total Sessions"
                        value={stats.total}
                        valueStyle={{ color: "#32d1b3", fontSize: "35px" }}
                        prefix={<CalendarOutlined />}
                    />
                </div>

                {/* Enhanced Filters and Search */}
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Search
                            placeholder="Search sessions..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            style={{ borderRadius: "8px" }}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={3}>
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
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <Select
                            placeholder="All Sports"
                            style={{ width: "100%", borderRadius: "8px" }}
                            value={sportFilter}
                            onChange={setSportFilter}
                            suffixIcon={<FilterOutlined />}
                            size="large"
                        >
                            <Option value="all">All Sports</Option>
                            {sports.map((sport) => (
                                <Option key={sport.id} value={sport.name}>
                                    {sport.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Coaches"
                            style={{ width: "100%", borderRadius: "8px" }}
                            value={coachFilter}
                            onChange={setCoachFilter}
                            suffixIcon={<SolutionOutlined />}
                            size="large"
                        >
                            <Option value="all">All Coaches</Option>
                            {coaches.map((coach) => (
                                <Option key={coach.id} value={coach.id}>
                                    {coach.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                {/* Financial Summary Section */}
                <FinancialSummary bookings={filteredBookings} />

                {/* Enhanced Statistics Row */}
                <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card
                            bordered={false}
                            style={{
                                background: "#f6ffed",
                                borderRadius: "12px",
                            }}
                        >
                            <Statistic
                                title="Active Sessions"
                                value={stats.active}
                                valueStyle={{ color: "#52c41a" }}
                                prefix={<PlayCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card
                            bordered={false}
                            style={{
                                background: "#fff2f0",
                                borderRadius: "12px",
                            }}
                        >
                            <Statistic
                                title="Inactive Sessions"
                                value={stats.inactive}
                                valueStyle={{ color: "#ff4d4f" }}
                                prefix={<PauseCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card
                            bordered={false}
                            style={{
                                background: "#fff7e6",
                                borderRadius: "12px",
                            }}
                        >
                            <Statistic
                                title="Total Participants"
                                value={stats.totalParticipants}
                                valueStyle={{ color: "#fa8c16" }}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card
                            bordered={false}
                            style={{
                                background: "#f0f8ff",
                                borderRadius: "12px",
                            }}
                        >
                            <Statistic
                                title="Active Coaches"
                                value={stats.totalCoaches}
                                valueStyle={{ color: "#1890ff" }}
                                prefix={<SolutionOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
            </Card>
            <Card
                style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.95)",
                }}
            >
                <Tabs defaultActiveKey="active" type="card" size="large">
                    <TabPane
                        tab={
                            <span>
                                <PlayCircleOutlined /> Active Sessions
                                {activeBookings.length > 0 && (
                                    <Badge
                                        count={activeBookings.length}
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </span>
                        }
                        key="active"
                    >
                        {activeBookings.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {activeBookings.map((booking) => (
                                    <Col
                                        key={booking.id}
                                        xs={24}
                                        sm={12}
                                        lg={8}
                                    >
                                        <BookingCard
                                            booking={booking}
                                            onView={() =>
                                                handleViewBooking(booking)
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "60px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    marginTop: 24,
                                }}
                            >
                                <PlayCircleOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} type="secondary">
                                    No Active Sessions
                                </Title>
                                <Text type="secondary">
                                    There are no active booking sessions at the
                                    moment
                                </Text>
                            </Card>
                        )}
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <PauseCircleOutlined /> Inactive Sessions
                                {inactiveBookings.length > 0 && (
                                    <Badge
                                        count={inactiveBookings.length}
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </span>
                        }
                        key="inactive"
                    >
                        {inactiveBookings.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {inactiveBookings.map((booking) => (
                                    <Col
                                        key={booking.id}
                                        xs={24}
                                        sm={12}
                                        lg={8}
                                    >
                                        <BookingCard
                                            booking={booking}
                                            onView={() =>
                                                handleViewBooking(booking)
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "60px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    marginTop: 24,
                                }}
                            >
                                <PauseCircleOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} type="secondary">
                                    No Inactive Sessions
                                </Title>
                                <Text type="secondary">
                                    There are no completed or inactive booking
                                    sessions
                                </Text>
                            </Card>
                        )}
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <PauseCircleOutlined /> Ongoing Sessions
                                {ongoingBookings.length > 0 && (
                                    <Badge
                                        count={ongoingBookings.length}
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </span>
                        }
                        key="ongoing"
                    >
                        {ongoingBookings.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {ongoingBookings.map((booking) => (
                                    <Col
                                        key={booking.id}
                                        xs={24}
                                        sm={12}
                                        lg={8}
                                    >
                                        <BookingCard
                                            booking={booking}
                                            onView={() =>
                                                handleViewBooking(booking)
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "60px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    marginTop: 24,
                                }}
                            >
                                <PauseCircleOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} type="secondary">
                                    No ongoing Sessions
                                </Title>
                                <Text type="secondary">
                                    There are no ongoing booking sessions
                                </Text>
                            </Card>
                        )}
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <PauseCircleOutlined /> Done Sessions
                                {doneBookings.length > 0 && (
                                    <Badge
                                        count={doneBookings.length}
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </span>
                        }
                        key="done"
                    >
                        {doneBookings.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {doneBookings.map((booking) => (
                                    <Col
                                        key={booking.id}
                                        xs={24}
                                        sm={12}
                                        lg={8}
                                    >
                                        <BookingCard
                                            booking={booking}
                                            onView={() =>
                                                handleViewBooking(booking)
                                            }
                                            updateStatus={() =>
                                                updateStatus(booking)
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "60px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    marginTop: 24,
                                }}
                            >
                                <PauseCircleOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} type="secondary">
                                    No done Sessions
                                </Title>
                                <Text type="secondary">
                                    There are no done booking sessions
                                </Text>
                            </Card>
                        )}
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <MoneyCollectOutlined />
                                Release Payments
                                <Badge
                                    count={forreleasedBookings.length}
                                    style={{ marginLeft: 8 }}
                                />
                            </span>
                        }
                        key="payments"
                    >
                        {forreleasedBookings.length > 0 ? (
                            <ReleasePaymentTab bookings={forreleasedBookings} />
                        ) : (
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "60px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    marginTop: 24,
                                }}
                            >
                                <MoneyCollectOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} type="secondary">
                                    No Payments to Release
                                </Title>
                                <Text type="secondary">
                                    There are no completed sessions with
                                    payments pending release
                                </Text>
                            </Card>
                        )}
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <PauseCircleOutlined /> Relased Booking
                                {releasedBookings.length > 0 && (
                                    <Badge
                                        count={releasedBookings.length}
                                        style={{ marginLeft: 8 }}
                                    />
                                )}
                            </span>
                        }
                        key="realased"
                    >
                        {releasedBookings.length > 0 ? (
                            <Row gutter={[24, 24]}>
                                {releasedBookings.map((booking) => (
                                    <Col
                                        key={booking.id}
                                        xs={24}
                                        sm={12}
                                        lg={8}
                                    >
                                        <BookingCard
                                            booking={booking}
                                            onView={() =>
                                                handleViewBooking(booking)
                                            }
                                        />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <Card
                                style={{
                                    textAlign: "center",
                                    padding: "60px",
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    marginTop: 24,
                                }}
                            >
                                <PauseCircleOutlined
                                    style={{
                                        fontSize: "48px",
                                        color: "#d9d9d9",
                                        marginBottom: 16,
                                    }}
                                />
                                <Title level={3} type="secondary">
                                    No Payments to Release
                                </Title>
                                <Text type="secondary">
                                    There are no completed sessions with
                                    payments pending release
                                </Text>
                            </Card>
                        )}
                    </TabPane>
                </Tabs>
            </Card>

            {/* Booking Details Modal */}
            <BookingDetailsModal
                booking={selectedBooking}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            {/* Empty State */}
            {filteredBookings.length === 0 && activeTab === "sessions" && (
                <Card
                    style={{
                        textAlign: "center",
                        padding: "60px",
                        borderRadius: "20px",
                        background: "rgba(255, 255, 255, 0.95)",
                        marginTop: 24,
                    }}
                >
                    <Title level={3} type="secondary">
                        No booking sessions found
                    </Title>
                    <Text type="secondary">
                        Try adjusting your search criteria or create a new
                        session
                    </Text>
                </Card>
            )}
        </Layout>
    );
};

export default CoachBookingList;
