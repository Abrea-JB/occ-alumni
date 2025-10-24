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
    Tabs,
    Table,
    List,
    Descriptions,
    Timeline,
    Popconfirm,
    message,
    Badge,
    Image,
    Steps,
    Form,
    InputNumber,
    DatePicker,
    Switch,
    Upload,
    Alert,
    Checkbox,
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
    TeamOutlined,
    MessageOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    UserSwitchOutlined,
    SolutionOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ExportOutlined,
    DownloadOutlined,
    BankOutlined,
    WalletOutlined,
    TransactionOutlined,
    SafetyCertificateOutlined,
    RocketOutlined,
    HistoryOutlined,
    FileDoneOutlined,
    FileProtectOutlined,
    MoneyCollectOutlined,
    FundOutlined,
    AuditOutlined,
    SecurityScanOutlined,
} from "@ant-design/icons";
import { Layout, Breadcrumb } from "~/components";
import useBooking from "~/hooks/useBooking";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Step } = Steps;

// Booking List Tab Component
const BookingListTab = () => {
    
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [coachFilter, setCoachFilter] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    // Mock data for bookings not withdrawn by coach
    const mockAvailableBookings = [
        {
            id: "BK1001",
            booking_title: "Tennis Training Camp",
            coach_name: "Michael Johnson",
            coach_id: 101,
            coach_avatar: "https://i.pravatar.cc/150?img=1",
            coach_contact: "+1-555-0101",
            coach_email: "michael@coach.com",
            session_date: "2024-01-10",
            amount: 500,
            net_amount: 475,
            tax_rate: 5,
            tax_amount: 25,
            participants: 4,
            status: "completed",
            description:
                "Advanced tennis training session for intermediate players",
            completion_date: "2024-01-10",
            duration: "2 hours",
            location: "Central Tennis Court",
            coach_rating: 4.8,
            coach_total_earnings: 12500,
            coach_completed_sessions: 45,
        },
        {
            id: "BK1002",
            booking_title: "Private Swimming Lessons",
            coach_name: "Sarah Wilson",
            coach_id: 102,
            coach_avatar: "https://i.pravatar.cc/150?img=2",
            coach_contact: "+1-555-0102",
            coach_email: "sarah@coach.com",
            session_date: "2024-01-12",
            amount: 750,
            net_amount: 712.5,
            tax_rate: 5,
            tax_amount: 37.5,
            participants: 1,
            status: "completed",
            description: "One-on-one swimming technique improvement",
            completion_date: "2024-01-12",
            duration: "1.5 hours",
            location: "Olympic Swimming Pool",
            coach_rating: 4.9,
            coach_total_earnings: 8900,
            coach_completed_sessions: 32,
        },
        {
            id: "BK1003",
            booking_title: "Basketball Group Session",
            coach_name: "David Miller",
            coach_id: 103,
            coach_avatar: "https://i.pravatar.cc/150?img=3",
            coach_contact: "+1-555-0103",
            coach_email: "david@coach.com",
            session_date: "2024-01-14",
            amount: 1250,
            net_amount: 1187.5,
            tax_rate: 5,
            tax_amount: 62.5,
            participants: 10,
            status: "completed",
            description: "Team basketball training and strategy session",
            completion_date: "2024-01-14",
            duration: "3 hours",
            location: "City Sports Arena",
            coach_rating: 4.7,
            coach_total_earnings: 15600,
            coach_completed_sessions: 28,
        },
        {
            id: "BK1004",
            booking_title: "Yoga Meditation Class",
            coach_name: "Emily Chen",
            coach_id: 104,
            coach_avatar: "https://i.pravatar.cc/150?img=4",
            coach_contact: "+1-555-0104",
            coach_email: "emily@coach.com",
            session_date: "2024-01-15",
            amount: 300,
            net_amount: 285,
            tax_rate: 5,
            tax_amount: 15,
            participants: 8,
            status: "completed",
            description: "Relaxing yoga and meditation session",
            completion_date: "2024-01-15",
            duration: "1 hour",
            location: "Peace Yoga Studio",
            coach_rating: 4.9,
            coach_total_earnings: 7200,
            coach_completed_sessions: 24,
        },
    ];

    const bookingColumns = [
        {
            title: "Booking ID",
            dataIndex: "id",
            key: "id",
            render: (id) => <Text strong>#{id}</Text>,
            width: 120,
        },
        {
            title: "Session Title",
            dataIndex: "booking_title",
            key: "booking_title",
            render: (title, record) => (
                <div>
                    <Text strong>{title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.description}
                    </Text>
                </div>
            ),
        },
        {
            title: "Coach",
            dataIndex: "coach_name",
            key: "coach_name",
            render: (name, record) => (
                <Space>
                    <Avatar src={record.coach_avatar} size="small" />
                    <div>
                        <Text strong>{name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            Rating: {record.coach_rating} ⭐
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Session Date",
            dataIndex: "session_date",
            key: "session_date",
            render: (date) => (
                <Space>
                    <CalendarOutlined />
                    {date}
                </Space>
            ),
            width: 120,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount, record) => (
                <div style={{ textAlign: "center" }}>
                    <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                        ${amount}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Net: ${record.net_amount}
                    </Text>
                </div>
            ),
            width: 100,
        },
        {
            title: "Participants",
            dataIndex: "participants",
            key: "participants",
            render: (participants) => (
                <div style={{ textAlign: "center" }}>
                    <TeamOutlined style={{ color: "#1890ff" }} />
                    <br />
                    <Text strong>{participants}</Text>
                </div>
            ),
            width: 100,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={status === "completed" ? "green" : "orange"}
                    style={{ borderRadius: "12px" }}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
            width: 100,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            icon={<EyeOutlined />}
                            size="small"
                            onClick={() => {
                                setSelectedBooking(record);
                                setBookingModalVisible(true);
                            }}
                        >
                            Details
                        </Button>
                    </Tooltip>
                </Space>
            ),
            width: 120,
        },
    ];

    const filteredBookings = mockAvailableBookings.filter((booking) => {
        const matchesSearch =
            booking.coach_name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            booking.booking_title
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || booking.status === statusFilter;
        const matchesCoach =
            coachFilter === "all" ||
            booking.coach_id.toString() === coachFilter;

        return matchesSearch && matchesStatus && matchesCoach;
    });

    const stats = {
        totalBookings: mockAvailableBookings.length,
        totalAmount: mockAvailableBookings.reduce(
            (sum, b) => sum + b.amount,
            0
        ),
        totalNetAmount: mockAvailableBookings.reduce(
            (sum, b) => sum + b.net_amount,
            0
        ),
    };

    return (
        <div>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={8}>
                    <Card
                        bordered={false}
                        style={{
                            background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "12px",
                        }}
                    >
                        <Statistic
                            title="Available Bookings"
                            value={stats.totalBookings}
                            valueStyle={{ color: "#fff" }}
                            prefix={<FileDoneOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card
                        bordered={false}
                        style={{
                            background:
                                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            borderRadius: "12px",
                        }}
                    >
                        <Statistic
                            title="Total Amount"
                            value={stats.totalAmount}
                            prefix="$"
                            valueStyle={{ color: "#fff" }}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={8}>
                    <Card
                        bordered={false}
                        style={{
                            background:
                                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                            borderRadius: "12px",
                        }}
                    >
                        <Statistic
                            title="Net Amount"
                            value={stats.totalNetAmount}
                            prefix="$"
                            valueStyle={{ color: "#fff" }}
                            prefix={<FundOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card
                style={{ marginBottom: 24, borderRadius: "12px" }}
                bodyStyle={{ padding: "16px" }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Search bookings, coaches..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Status"
                            style={{ width: "100%" }}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            size="large"
                        >
                            <Option value="all">All Status</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="approved">Approved</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <Select
                            placeholder="All Coaches"
                            style={{ width: "100%" }}
                            value={coachFilter}
                            onChange={setCoachFilter}
                            size="large"
                        >
                            <Option value="all">All Coaches</Option>
                            <Option value="101">Michael Johnson</Option>
                            <Option value="102">Sarah Wilson</Option>
                            <Option value="103">David Miller</Option>
                            <Option value="104">Emily Chen</Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Bookings Table */}
            <Card
                title={
                    <Space>
                        <FileDoneOutlined />
                        Available Bookings for Withdrawal
                        <Badge
                            count={filteredBookings.length}
                            style={{ backgroundColor: "#52c41a" }}
                        />
                    </Space>
                }
                bordered={false}
                style={{ borderRadius: "12px" }}
            >
                <Table
                    columns={bookingColumns}
                    dataSource={filteredBookings}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    rowKey="id"
                    scroll={{ x: 1000 }}
                    rowClassName={() => "booking-table-row"}
                />
            </Card>

            {/* Booking Detail Modal */}
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
                        <span>Booking Details - {selectedBooking?.id}</span>
                    </div>
                }
                visible={bookingModalVisible}
                onCancel={() => setBookingModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedBooking && (
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Booking ID">
                            #{selectedBooking.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Session Title">
                            {selectedBooking.booking_title}
                        </Descriptions.Item>
                        <Descriptions.Item label="Coach">
                            <Space>
                                <Avatar
                                    src={selectedBooking.coach_avatar}
                                    size="small"
                                />
                                {selectedBooking.coach_name}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Coach Rating">
                            <StarFilled style={{ color: "#ffc107" }} />{" "}
                            {selectedBooking.coach_rating}
                        </Descriptions.Item>
                        <Descriptions.Item label="Session Date">
                            {selectedBooking.session_date}
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">
                            {selectedBooking.duration}
                        </Descriptions.Item>
                        <Descriptions.Item label="Location">
                            {selectedBooking.location}
                        </Descriptions.Item>
                        <Descriptions.Item label="Participants">
                            {selectedBooking.participants}
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount" span={2}>
                            <div>
                                <Text
                                    strong
                                    style={{
                                        fontSize: "18px",
                                        color: "#52c41a",
                                    }}
                                >
                                    ${selectedBooking.amount}
                                </Text>
                                <br />
                                <Text type="secondary">
                                    Net: ${selectedBooking.net_amount} (Tax: $
                                    {selectedBooking.tax_amount})
                                </Text>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={2}>
                            {selectedBooking.description}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

// Release Payment Tab Component
const ReleasePaymentTab = ({availableBookings}) => {
    const [selectedBookings, setSelectedBookings] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState("all");
    const [releaseNote, setReleaseNote] = useState("");
    const [taxRate, setTaxRate] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock available bookings for release
    // const availableBookings = [
    //     {
    //         id: "BK1001",
    //         booking_title: "Tennis Training Camp",
    //         coach_name: "Michael Johnson",
    //         coach_id: 101,
    //         session_date: "2024-01-10",
    //         amount: 500,
    //         status: "completed",
    //     },
    //     {
    //         id: "BK1002",
    //         booking_title: "Private Swimming Lessons",
    //         coach_name: "Sarah Wilson",
    //         coach_id: 102,
    //         session_date: "2024-01-12",
    //         amount: 750,
    //         status: "completed",
    //     },
    //     {
    //         id: "BK1003",
    //         booking_title: "Basketball Group Session",
    //         coach_name: "David Miller",
    //         coach_id: 103,
    //         session_date: "2024-01-14",
    //         amount: 1250,
    //         status: "completed",
    //     },
    //     {
    //         id: "BK1004",
    //         booking_title: "Yoga Meditation Class",
    //         coach_name: "Emily Chen",
    //         coach_id: 104,
    //         session_date: "2024-01-15",
    //         amount: 300,
    //         status: "completed",
    //     },
    // ];

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
                        booking.coach_id.toString() === selectedCoach
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            message.success(
                `Successfully released payment for ${selectedBookings.length} booking(s)`
            );
            setSelectedBookings([]);
            setReleaseNote("");
        } catch (error) {
            message.error("Failed to release payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredBookings = availableBookings.filter(
        (booking) =>
            selectedCoach === "all" ||
            booking.coach_id.toString() === selectedCoach
    );

    console.log('filteredBookings. -->', filteredBookings[0])

    const selectedBookingsData = availableBookings.filter((booking) =>
        selectedBookings.includes(booking.id)
    );

    const totalAmount = selectedBookingsData.reduce(
        (sum, booking) => sum + booking.amount,
        0
    );
    const taxAmount = totalAmount * (taxRate / 100);
    const netAmount = totalAmount - taxAmount;

    return (
        <div>
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
                                <Option value="101">Michael Johnson</Option>
                                <Option value="102">Sarah Wilson</Option>
                                <Option value="103">David Miller</Option>
                                <Option value="104">Emily Chen</Option>
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
                                                
                                                {booking?.coach?.user?.fname?.charAt(0)}
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
                                                    Coach: {booking?.coach?.user?.fname} {booking?.coach?.user?.lname}
                                                </Text>
                                                <Text type="secondary">
                                                   Date: {dayjs(booking.created_at).format("MMMM D, YYYY h:mm A")}
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
                                            ${booking.amount}
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
                                {/* Summary */}
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
                                                ${totalAmount.toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item
                                            label={`Tax (${taxRate}%)`}
                                        >
                                            <Text strong>
                                                ${taxAmount.toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Net Amount">
                                            <Text
                                                strong
                                                type="success"
                                                style={{ fontSize: "18px" }}
                                            >
                                                ${netAmount.toFixed(2)}
                                            </Text>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>

                                {/* Tax Rate */}
                                <div>
                                    <Text strong>Tax Rate (%)</Text>
                                    <InputNumber
                                        min={0}
                                        max={100}
                                        value={taxRate}
                                        onChange={setTaxRate}
                                        style={{ width: "100%", marginTop: 8 }}
                                        addonAfter="%"
                                    />
                                </div>

                                {/* Release Note */}
                                <div>
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
                                </div>

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
                                        RELEASE PAYMENT (${netAmount.toFixed(2)}
                                        )
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
                                                <Text strong>
                                                    ${booking.amount}
                                                </Text>
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
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const CoachWithdrawalPage = () => {
    const {
        isLoading,
        data: bookings = [],
        isFetching,
        refetch,
    } = useBooking();
    // Filter pending bookings
    const pendingBookings = bookings.filter(
        (booking) => booking.payment_status === "pending" && booking.status === "inactive"
    );
    const [activeTab, setActiveTab] = useState("bookings");

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
                            💰 Payment Release System
                        </Title>
                        <Text type="secondary">
                            Manage coach payments and release funds for
                            completed sessions
                        </Text>
                    </div>
                    <Space>
                        <Button icon={<ExportOutlined />} size="large">
                            Export Report
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            type="primary"
                            size="large"
                        >
                            Download Summary
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Main Content */}
            <Card
                style={{
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.95)",
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="card"
                    size="large"
                    style={{ overflow: "visible" }}
                >
                    <TabPane
                        tab={
                            <span style={{ padding: "0 16px" }}>
                                <FileDoneOutlined />
                                Available Bookings
                            </span>
                        }
                        key="bookings"
                    >
                        <BookingListTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <span style={{ padding: "0 16px" }}>
                                <MoneyCollectOutlined />
                                Release Payments
                            </span>
                        }
                        key="release"
                    >
                        <ReleasePaymentTab availableBookings={pendingBookings} />
                    </TabPane>
                </Tabs>
            </Card>
        </Layout>
    );
};

export default CoachWithdrawalPage;
