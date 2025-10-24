import {
    PlusOutlined,
    EditOutlined,
    ReloadOutlined,
    SearchOutlined,
    EyeOutlined,
    DeleteOutlined,
    FilterOutlined,
    DownloadOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    FilePdfOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    TagOutlined,
    StarFilled,
} from "@ant-design/icons";
import {
    Table,
    Tooltip,
    Button,
    message,
    Space,
    Card,
    Input,
    Row,
    Col,
    Tag,
    Statistic,
    Select,
    Divider,
    Modal,
    Typography,
    Progress,
    Descriptions,
    Badge,
    Avatar,
    List,
    Timeline,
    Tabs,
    Rate,
    Popconfirm,
    Dropdown,
    Menu,
    DatePicker,
} from "antd";
import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Layout, HeaderTitle, Breadcrumb } from "~/components";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Sample booking data with payment details
const sampleBookings = [
    {
        id: "BK001",
        bookingNumber: "BK2024-001",
        customer: {
            name: "John Smith",
            email: "john.smith@email.com",
            phone: "+1-555-0101",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
        },
        sport: "Tennis",
        coach: "Michael Johnson",
        type: "Private Session",
        date: "2024-03-20",
        time: "14:00 - 15:30",
        duration: "1.5 hours",
        status: "confirmed",
        paymentStatus: "paid",
        amount: 120,
        currency: "USD",
        paymentMethod: "credit_card",
        transactionId: "TXN78901234",
        createdAt: "2024-03-15 10:30:00",
        location: "Central Sports Complex - Court 3",
        notes: "Beginner level training session",
        rating: 4.5,
        equipment: ["Tennis Racket", "Balls"],
        participants: 1
    },
    {
        id: "BK002",
        bookingNumber: "BK2024-002",
        customer: {
            name: "Sarah Wilson",
            email: "sarah.w@email.com",
            phone: "+1-555-0102",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
        },
        sport: "Swimming",
        coach: "Emma Davis",
        type: "Group Lesson",
        date: "2024-03-22",
        time: "09:00 - 10:00",
        duration: "1 hour",
        status: "completed",
        paymentStatus: "paid",
        amount: 85,
        currency: "USD",
        paymentMethod: "paypal",
        transactionId: "TXN78901235",
        createdAt: "2024-03-14 15:45:00",
        location: "Aqua Center - Lane 4",
        notes: "Advanced technique improvement",
        rating: 5.0,
        equipment: ["Swim Cap", "Goggles"],
        participants: 4
    },
    {
        id: "BK003",
        bookingNumber: "BK2024-003",
        customer: {
            name: "Robert Brown",
            email: "robert.b@email.com",
            phone: "+1-555-0103",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
        },
        sport: "Basketball",
        coach: "James Wilson",
        type: "Team Training",
        date: "2024-03-25",
        time: "18:00 - 20:00",
        duration: "2 hours",
        status: "pending",
        paymentStatus: "pending",
        amount: 200,
        currency: "USD",
        paymentMethod: null,
        transactionId: null,
        createdAt: "2024-03-18 11:20:00",
        location: "City Arena - Court 1",
        notes: "Corporate team building session",
        rating: null,
        equipment: ["Basketballs", "Cones"],
        participants: 12
    },
    {
        id: "BK004",
        bookingNumber: "BK2024-004",
        customer: {
            name: "Lisa Garcia",
            email: "lisa.g@email.com",
            phone: "+1-555-0104",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        },
        sport: "Yoga",
        coach: "Sophia Chen",
        type: "Private Session",
        date: "2024-03-19",
        time: "07:00 - 08:00",
        duration: "1 hour",
        status: "cancelled",
        paymentStatus: "refunded",
        amount: 60,
        currency: "USD",
        paymentMethod: "bank_transfer",
        transactionId: "TXN78901236",
        createdAt: "2024-03-10 09:15:00",
        location: "Wellness Studio - Room A",
        notes: "Cancelled due to illness",
        rating: null,
        equipment: ["Yoga Mat"],
        participants: 1
    },
    {
        id: "BK005",
        bookingNumber: "BK2024-005",
        customer: {
            name: "Mike Thompson",
            email: "mike.t@email.com",
            phone: "+1-555-0105",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
        },
        sport: "Football",
        coach: "David Martinez",
        type: "Group Training",
        date: "2024-03-28",
        time: "16:00 - 17:30",
        duration: "1.5 hours",
        status: "confirmed",
        paymentStatus: "paid",
        amount: 45,
        currency: "USD",
        paymentMethod: "credit_card",
        transactionId: "TXN78901237",
        createdAt: "2024-03-16 14:30:00",
        location: "Sports Field - Pitch 2",
        notes: "Youth development program",
        rating: null,
        equipment: ["Football", "Bibs"],
        participants: 8
    }
];

const BookingPage = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [sportFilter, setSportFilter] = useState("all");
    const [dateRange, setDateRange] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewMode, setViewMode] = useState("table");

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed": return "blue";
            case "completed": return "green";
            case "pending": return "orange";
            case "cancelled": return "red";
            default: return "gray";
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case "paid": return "green";
            case "pending": return "orange";
            case "failed": return "red";
            case "refunded": return "purple";
            case "partially_paid": return "cyan";
            default: return "gray";
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case "credit_card": return <CreditCardOutlined />;
            case "paypal": return <BankOutlined />;
            case "bank_transfer": return <WalletOutlined />;
            case "cash": return <DollarOutlined />;
            default: return <CreditCardOutlined />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "confirmed": return <CheckCircleOutlined />;
            case "completed": return <CheckCircleOutlined />;
            case "pending": return <ClockCircleOutlined />;
            case "cancelled": return <CloseCircleOutlined />;
            default: return <ExclamationCircleOutlined />;
        }
    };

    const { filteredData, totalCount, stats } = useMemo(() => {
        const filtered = sampleBookings.filter((booking) => {
            const matchesSearch = !search || 
                booking.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                booking.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
                booking.sport.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
            const matchesPayment = paymentFilter === "all" || booking.paymentStatus === paymentFilter;
            const matchesSport = sportFilter === "all" || booking.sport === sportFilter;
            
            const matchesDate = !dateRange || (
                booking.date >= dateRange[0].format('YYYY-MM-DD') && 
                booking.date <= dateRange[1].format('YYYY-MM-DD')
            );

            return matchesSearch && matchesStatus && matchesPayment && matchesSport && matchesDate;
        });

        // Calculate statistics
        const stats = {
            total: filtered.length,
            totalRevenue: filtered.reduce((sum, booking) => sum + (booking.amount || 0), 0),
            completed: filtered.filter(b => b.status === 'completed').length,
            pending: filtered.filter(b => b.status === 'pending').length,
            paid: filtered.filter(b => b.paymentStatus === 'paid').length,
        };

        return {
            filteredData: filtered,
            totalCount: filtered.length,
            stats
        };
    }, [search, statusFilter, paymentFilter, sportFilter, dateRange]);

    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setModalVisible(true);
    };

    const handleConfirmBooking = (bookingId) => {
        message.success(`Booking ${bookingId} confirmed successfully!`);
        // Add your confirmation logic here
    };

    const handleCancelBooking = (bookingId) => {
        message.success(`Booking ${bookingId} cancelled successfully!`);
        // Add your cancellation logic here
    };

    const handleSendReminder = (booking) => {
        message.success(`Reminder sent to ${booking.customer.name}`);
        // Add your reminder logic here
    };

    const BookingDetailsModal = ({ booking, visible, onClose }) => {
        if (!booking) return null;

        return (
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarOutlined style={{ color: '#1890ff' }} />
                        <span>Booking Details - {booking.bookingNumber}</span>
                    </div>
                }
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose}>
                        Close
                    </Button>,
                    <Button key="reminder" icon={<MailOutlined />} onClick={() => handleSendReminder(booking)}>
                        Send Reminder
                    </Button>,
                    <Button key="edit" type="primary" icon={<EditOutlined />}>
                        Edit Booking
                    </Button>,
                ]}
                width={1000}
                style={{ top: 20 }}
            >
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Booking Information" key="1">
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Card title="Customer Details" size="small">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Space>
                                            <Avatar src={booking.customer.avatar} size={64} />
                                            <div>
                                                <Title level={5} style={{ margin: 0 }}>{booking.customer.name}</Title>
                                                <Text type="secondary">{booking.customer.email}</Text>
                                                <br />
                                                <Text type="secondary">{booking.customer.phone}</Text>
                                            </div>
                                        </Space>
                                    </Space>
                                </Card>

                                <Card title="Session Details" size="small" style={{ marginTop: 16 }}>
                                    <Descriptions column={1} size="small">
                                        <Descriptions.Item label="Sport">{booking.sport}</Descriptions.Item>
                                        <Descriptions.Item label="Coach">{booking.coach}</Descriptions.Item>
                                        <Descriptions.Item label="Session Type">{booking.type}</Descriptions.Item>
                                        <Descriptions.Item label="Date">{booking.date}</Descriptions.Item>
                                        <Descriptions.Item label="Time">{booking.time}</Descriptions.Item>
                                        <Descriptions.Item label="Duration">{booking.duration}</Descriptions.Item>
                                        <Descriptions.Item label="Participants">
                                            <TeamOutlined /> {booking.participants}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Location">
                                            <EnvironmentOutlined /> {booking.location}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card title="Payment Information" size="small">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text strong>Amount:</Text>
                                            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                                                ${booking.amount} {booking.currency}
                                            </Title>
                                        </div>
                                        
                                        <Descriptions column={1} size="small">
                                            <Descriptions.Item label="Payment Status">
                                                <Tag color={getPaymentStatusColor(booking.paymentStatus)}>
                                                    {booking.paymentStatus.toUpperCase()}
                                                </Tag>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Payment Method">
                                                <Space>
                                                    {getPaymentMethodIcon(booking.paymentMethod)}
                                                    {booking.paymentMethod ? booking.paymentMethod.replace('_', ' ').toUpperCase() : 'Not Selected'}
                                                </Space>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Transaction ID">
                                                {booking.transactionId || 'N/A'}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Booked On">
                                                {booking.createdAt}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Space>
                                </Card>

                                <Card title="Status & Actions" size="small" style={{ marginTop: 16 }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text strong>Booking Status:</Text>
                                            <Tag color={getStatusColor(booking.status)} icon={getStatusIcon(booking.status)}>
                                                {booking.status.toUpperCase()}
                                            </Tag>
                                        </div>
                                        
                                        {booking.rating && (
                                            <div>
                                                <Text strong>Customer Rating:</Text>
                                                <Rate disabled defaultValue={booking.rating} style={{ marginLeft: 8 }} />
                                                <Text style={{ marginLeft: 8 }}>{booking.rating}</Text>
                                            </div>
                                        )}

                                        <Divider style={{ margin: '12px 0' }} />

                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {booking.status === 'pending' && (
                                                <Space>
                                                    <Button 
                                                        type="primary" 
                                                        size="small"
                                                        onClick={() => handleConfirmBooking(booking.id)}
                                                    >
                                                        Confirm Booking
                                                    </Button>
                                                    <Popconfirm
                                                        title="Are you sure to cancel this booking?"
                                                        onConfirm={() => handleCancelBooking(booking.id)}
                                                    >
                                                        <Button danger size="small">
                                                            Cancel Booking
                                                        </Button>
                                                    </Popconfirm>
                                                </Space>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <Button type="primary" size="small">
                                                    Mark as Completed
                                                </Button>
                                            )}
                                        </Space>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>

                        {booking.notes && (
                            <Card title="Additional Notes" size="small" style={{ marginTop: 16 }}>
                                <Text>{booking.notes}</Text>
                            </Card>
                        )}
                    </TabPane>

                    <TabPane tab="Equipment & Requirements" key="2">
                        <Card title="Required Equipment">
                            <List
                                dataSource={booking.equipment}
                                renderItem={item => (
                                    <List.Item>
                                        <TagOutlined style={{ marginRight: 8 }} />
                                        {item}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab="Timeline" key="3">
                        <Timeline>
                            <Timeline.Item color="green">
                                <Text strong>Booking Created</Text>
                                <br />
                                <Text type="secondary">{booking.createdAt}</Text>
                            </Timeline.Item>
                            {booking.paymentStatus === 'paid' && (
                                <Timeline.Item color="green">
                                    <Text strong>Payment Completed</Text>
                                    <br />
                                    <Text type="secondary">${booking.amount} via {booking.paymentMethod}</Text>
                                </Timeline.Item>
                            )}
                            <Timeline.Item color="blue">
                                <Text strong>Session Scheduled</Text>
                                <br />
                                <Text type="secondary">{booking.date} at {booking.time}</Text>
                            </Timeline.Item>
                            {booking.status === 'completed' && (
                                <Timeline.Item color="green">
                                    <Text strong>Session Completed</Text>
                                    <br />
                                    {booking.rating && (
                                        <Text type="secondary">Rated {booking.rating} stars by customer</Text>
                                    )}
                                </Timeline.Item>
                            )}
                        </Timeline>
                    </TabPane>
                </Tabs>
            </Modal>
        );
    };

    const columns = [
        {
            title: "Booking Info",
            dataIndex: "bookingNumber",
            key: "booking",
            render: (bookingNumber, record) => (
                <Space>
                    <Avatar src={record.customer.avatar} />
                    <div>
                        <Text strong>{bookingNumber}</Text>
                        <br />
                        <Text type="secondary">{record.customer.name}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Sport & Coach",
            dataIndex: "sport",
            key: "sport",
            render: (sport, record) => (
                <div>
                    <Text strong>{sport}</Text>
                    <br />
                    <Text type="secondary">{record.coach}</Text>
                </div>
            ),
        },
        {
            title: "Session Details",
            key: "session",
            render: (record) => (
                <div>
                    <Text>{record.date}</Text>
                    <br />
                    <Text type="secondary">{record.time} ({record.duration})</Text>
                </div>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount, record) => (
                <Text strong style={{ color: '#52c41a' }}>
                    ${amount} {record.currency}
                </Text>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status, record) => (
                <Space direction="vertical">
                    <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
                        {status.toUpperCase()}
                    </Tag>
                    <Tag color={getPaymentStatusColor(record.paymentStatus)}>
                        {record.paymentStatus.toUpperCase()}
                    </Tag>
                </Space>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                            size="small"
                        />
                    </Tooltip>
                    <Tooltip title="Edit Booking">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            size="small"
                        />
                    </Tooltip>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="reminder" icon={<MailOutlined />}>
                                    Send Reminder
                                </Menu.Item>
                                <Menu.Item key="invoice" icon={<FilePdfOutlined />}>
                                    Download Invoice
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item key="cancel" danger icon={<CloseCircleOutlined />}>
                                    Cancel Booking
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button type="link"  size="small" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <Layout breadcrumb={Breadcrumb.College()}>
            <HeaderTitle title="Booking Management" />
            <div className="tabled">
                <Card
                    title={
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <CalendarOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 12 }} />
                                <span style={{ fontSize: 20, fontWeight: 600 }}>Bookings Overview</span>
                                <Badge count={totalCount} showZero style={{ marginLeft: 12 }} />
                            </div>
                            <Space>
                                <Button 
                                    type={viewMode === 'table' ? 'primary' : 'default'} 
                                    onClick={() => setViewMode('table')}
                                >
                                    Table View
                                </Button>
                                <Button 
                                    type={viewMode === 'card' ? 'primary' : 'default'} 
                                    onClick={() => setViewMode('card')}
                                >
                                    Card View
                                </Button>
                            </Space>
                        </div>
                    }
                    bordered={false}
                    style={{ borderRadius: 16 }}
                    extra={
                        <Space wrap>
                            <Button icon={<DownloadOutlined />}>Export</Button>
                            <Button type="primary" icon={<PlusOutlined />}>
                                New Booking
                            </Button>
                        </Space>
                    }
                >
                    {/* Statistics Row */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={6}>
                            <Card size="small">
                                <Statistic
                                    title="Total Bookings"
                                    value={stats.total}
                                    prefix={<CalendarOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Card size="small">
                                <Statistic
                                    title="Total Revenue"
                                    value={stats.totalRevenue}
                                    prefix="$"
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Card size="small">
                                <Statistic
                                    title="Completed"
                                    value={stats.completed}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Card size="small">
                                <Statistic
                                    title="Pending Payment"
                                    value={stats.pending}
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Filters */}
                    <Card size="small" style={{ marginBottom: 24 }}>
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={6}>
                                <Search
                                    placeholder="Search bookings..."
                                    allowClear
                                    onSearch={setSearch}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col xs={12} sm={4}>
                                <Select
                                    placeholder="Status"
                                    style={{ width: '100%' }}
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="confirmed">Confirmed</Option>
                                    <Option value="completed">Completed</Option>
                                    <Option value="cancelled">Cancelled</Option>
                                </Select>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Select
                                    placeholder="Payment"
                                    style={{ width: '100%' }}
                                    value={paymentFilter}
                                    onChange={setPaymentFilter}
                                >
                                    <Option value="all">All Payments</Option>
                                    <Option value="paid">Paid</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="failed">Failed</Option>
                                    <Option value="refunded">Refunded</Option>
                                </Select>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Select
                                    placeholder="Sport"
                                    style={{ width: '100%' }}
                                    value={sportFilter}
                                    onChange={setSportFilter}
                                >
                                    <Option value="all">All Sports</Option>
                                    {[...new Set(sampleBookings.map(b => b.sport))].map(sport => (
                                        <Option key={sport} value={sport}>{sport}</Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={12} sm={6}>
                                <RangePicker
                                    style={{ width: '100%' }}
                                    onChange={setDateRange}
                                    placeholder={['Start Date', 'End Date']}
                                />
                            </Col>
                        </Row>
                    </Card>

                    {/* Bookings Table */}
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} bookings`
                        }}
                        onRow={(record) => ({
                            onClick: () => handleViewDetails(record),
                            style: { cursor: 'pointer' }
                        })}
                    />
                </Card>

                {/* Booking Details Modal */}
                <BookingDetailsModal 
                    booking={selectedBooking} 
                    visible={modalVisible} 
                    onClose={() => setModalVisible(false)} 
                />
            </div>
        </Layout>
    );
};

export default BookingPage;