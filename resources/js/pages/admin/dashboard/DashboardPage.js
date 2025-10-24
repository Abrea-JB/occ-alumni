import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Statistic,
    Progress,
    Tag,
    List,
    Avatar,
    Typography,
    Space,
    Divider,
    Button,
    Select,
    DatePicker,
    Table,
    Tooltip,
    Badge,
    Rate,
} from "antd";
import {
    UserOutlined,
    TeamOutlined,
    DollarOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    RocketOutlined,
    BookOutlined,
    TrophyOutlined,
    ShareAltOutlined,
    EyeOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { Layout, Breadcrumb } from "~/components";
import "./AlumniDashboard.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Mock data for charts and metrics
const employmentData = {
    current: [
        { name: "Employed", value: 65, color: "#32d1b3" },
        { name: "Unemployed", value: 8, color: "#ff4d4f" },
        { name: "Under Employed", value: 15, color: "#faad14" },
        { name: "Graduate School", value: 12, color: "#1890ff" },
    ],
    trend: [
        { month: "Jan", employed: 58, unemployed: 12, underEmployed: 18 },
        { month: "Feb", employed: 60, unemployed: 11, underEmployed: 17 },
        { month: "Mar", employed: 62, unemployed: 10, underEmployed: 16 },
        { month: "Apr", employed: 63, unemployed: 9, underEmployed: 16 },
        { month: "May", employed: 64, unemployed: 8, underEmployed: 15 },
        { month: "Jun", employed: 65, unemployed: 8, underEmployed: 15 },
    ],
    byMajor: [
        {
            major: "Computer Science",
            employed: 92,
            unemployed: 2,
            underEmployed: 6,
        },
        {
            major: "Business Admin",
            employed: 78,
            unemployed: 5,
            underEmployed: 17,
        },
        { major: "Engineering", employed: 88, unemployed: 3, underEmployed: 9 },
        {
            major: "Arts & Sciences",
            employed: 65,
            unemployed: 10,
            underEmployed: 25,
        },
        { major: "Medicine", employed: 95, unemployed: 1, underEmployed: 4 },
    ],
};

const alumniMetrics = {
    totalAlumni: 15420,
    activeThisYear: 3245,
    averageSalary: 85600,
    satisfactionRate: 4.7,
    eventParticipation: 68,
    mentorshipEngagement: 42,
};

const industryDistribution = [
    { name: "Technology", value: 32, color: "#1890ff" },
    { name: "Healthcare", value: 18, color: "#52c41a" },
    { name: "Finance", value: 15, color: "#faad14" },
    { name: "Education", value: 12, color: "#722ed1" },
    { name: "Manufacturing", value: 8, color: "#fa541c" },
    { name: "Other", value: 15, color: "#13c2c2" },
];

const salaryProgression = [
    { year: "1 Year", salary: 65000 },
    { year: "2 Years", salary: 72000 },
    { year: "3 Years", salary: 78000 },
    { year: "5 Years", salary: 89000 },
    { year: "7 Years", salary: 102000 },
    { year: "10 Years", salary: 125000 },
];

const topEmployers = [
    { name: "Google", hires: 245, trend: "up" },
    { name: "Microsoft", hires: 189, trend: "up" },
    { name: "Amazon", hires: 167, trend: "stable" },
    { name: "Apple", hires: 142, trend: "up" },
    { name: "JPMorgan Chase", hires: 128, trend: "stable" },
    { name: "Mayo Clinic", hires: 115, trend: "up" },
];

const recentGraduates = [
    {
        id: 1,
        name: "Sarah Chen",
        major: "Computer Science",
        graduationYear: 2024,
        status: "employed",
        company: "Google",
        position: "Software Engineer",
        salary: 125000,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        major: "Business Administration",
        graduationYear: 2024,
        status: "employed",
        company: "McKinsey & Company",
        position: "Business Analyst",
        salary: 95000,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    {
        id: 3,
        name: "Emily Watson",
        major: "Biology",
        graduationYear: 2024,
        status: "graduate_school",
        institution: "Harvard Medical School",
        position: "Medical Student",
        salary: null,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    {
        id: 4,
        name: "James Kim",
        major: "Electrical Engineering",
        graduationYear: 2024,
        status: "under_employed",
        company: "Tech Startup Inc.",
        position: "Technical Support",
        salary: 55000,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
];

const upcomingEvents = [
    {
        id: 1,
        title: "Tech Industry Networking Night",
        date: "2024-06-15",
        type: "networking",
        attendees: 145,
        capacity: 200,
    },
    {
        id: 2,
        title: "Career Fair 2024",
        date: "2024-07-22",
        type: "career_fair",
        attendees: 324,
        capacity: 500,
    },
    {
        id: 3,
        title: "Alumni Mentorship Program Kickoff",
        date: "2024-06-01",
        type: "mentorship",
        attendees: 89,
        capacity: 100,
    },
];

const EmploymentPieChart = () => (
    <div className="chart-container">
        <Title level={4}>Employment Status Distribution</Title>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={employmentData.current}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {employmentData.current.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
        <div className="chart-legend">
            {employmentData.current.map((item, index) => (
                <div key={index} className="legend-item">
                    <div
                        className="legend-color"
                        style={{ backgroundColor: item.color }}
                    />
                    <Text>{item.name}</Text>
                    <Text strong>{item.value}%</Text>
                </div>
            ))}
        </div>
    </div>
);

const EmploymentTrendChart = () => (
    <div className="chart-container">
        <Title level={4}>Employment Trend (Last 6 Months)</Title>
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={employmentData.trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="employed"
                    stackId="1"
                    stroke="#32d1b3"
                    fill="#32d1b3"
                    fillOpacity={0.6}
                    name="Employed"
                />
                <Area
                    type="monotone"
                    dataKey="underEmployed"
                    stackId="1"
                    stroke="#faad14"
                    fill="#faad14"
                    fillOpacity={0.6}
                    name="Under Employed"
                />
                <Area
                    type="monotone"
                    dataKey="unemployed"
                    stackId="1"
                    stroke="#ff4d4f"
                    fill="#ff4d4f"
                    fillOpacity={0.6}
                    name="Unemployed"
                />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const IndustryDistributionChart = () => (
    <div className="chart-container">
        <Title level={4}>Industry Distribution</Title>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" name="Percentage">
                    {industryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const SalaryProgressionChart = () => (
    <div className="chart-container">
        <Title level={4}>Average Salary Progression</Title>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryProgression}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <RechartsTooltip
                    formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Salary",
                    ]}
                />
                <Line
                    type="monotone"
                    dataKey="salary"
                    stroke="#1890ff"
                    strokeWidth={3}
                    dot={{ fill: "#1890ff" }}
                    name="Salary"
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const EmploymentByMajorTable = () => (
    <div className="chart-container">
        <Title level={4}>Employment by Major</Title>
        <Table
            dataSource={employmentData.byMajor}
            pagination={false}
            size="small"
            columns={[
                {
                    title: "Major",
                    dataIndex: "major",
                    key: "major",
                },
                {
                    title: "Employed",
                    dataIndex: "employed",
                    key: "employed",
                    render: (value) => <Text strong>{value}%</Text>,
                },
                {
                    title: "Unemployed",
                    dataIndex: "unemployed",
                    key: "unemployed",
                    render: (value) => <Text type="secondary">{value}%</Text>,
                },
                {
                    title: "Under Employed",
                    dataIndex: "underEmployed",
                    key: "underEmployed",
                    render: (value) => <Text type="secondary">{value}%</Text>,
                },
            ]}
        />
    </div>
);

const AlumniDashboard = () => {
    const [timeRange, setTimeRange] = useState("current");
    const [selectedMajor, setSelectedMajor] = useState("all");

    const getStatusTag = (status) => {
        const statusConfig = {
            employed: { color: "green", text: "Employed" },
            unemployed: { color: "red", text: "Seeking" },
            under_employed: { color: "orange", text: "Under Employed" },
            graduate_school: { color: "blue", text: "Graduate School" },
        };
        const config = statusConfig[status] || {
            color: "default",
            text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    return (
        <Layout>
            <div className="alumni-dashboard">
                {/* Header Section */}
                <Card className="dashboard-header-card">
                    <div className="dashboard-header">
                        <div>
                            <Title level={2}>Alumni Dashboard</Title>
                            <Text type="secondary">
                                Comprehensive overview of alumni employment,
                                career progression, and engagement metrics
                            </Text>
                        </div>
                        <div className="header-controls">
                            <Select defaultValue="2024" style={{ width: 120 }}>
                                <Option value="2024">2024</Option>
                                <Option value="2023">2023</Option>
                                <Option value="2022">2022</Option>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Key Metrics */}
                <Row gutter={[24, 24]} className="metrics-row">
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="metric-card">
                            <Statistic
                                title="Total Alumni"
                                value={alumniMetrics.totalAlumni}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: "#1890ff" }}
                            />
                            <Progress
                                percent={100}
                                showInfo={false}
                                status="active"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="metric-card">
                            <Statistic
                                title="Active This Year"
                                value={alumniMetrics.activeThisYear}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: "#52c41a" }}
                            />
                            <Progress
                                percent={21}
                                showInfo={false}
                                status="active"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="metric-card">
                            <Statistic
                                title="Average Salary"
                                value={alumniMetrics.averageSalary}
                                prefix={<DollarOutlined />}
                                valueStyle={{ color: "#faad14" }}
                                formatter={(value) =>
                                    `$${value.toLocaleString()}`
                                }
                            />
                            <Text type="secondary">+5.2% from last year</Text>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className="metric-card">
                            <Statistic
                                title="Satisfaction Rate"
                                value={alumniMetrics.satisfactionRate}
                                prefix={<TrophyOutlined />}
                                valueStyle={{ color: "#722ed1" }}
                                suffix="/ 5"
                            />
                            <Rate disabled defaultValue={4.7} allowHalf />
                        </Card>
                    </Col>
                </Row>

                {/* Employment Charts Section */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <EmploymentPieChart />
                    </Col>
                    <Col xs={24} lg={12}>
                        <EmploymentTrendChart />
                    </Col>
                </Row>

                {/* Second Row Charts */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <IndustryDistributionChart />
                    </Col>
                    <Col xs={24} lg={12}>
                        <SalaryProgressionChart />
                    </Col>
                </Row>

                {/* Third Row - Tables and Lists */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <EmploymentByMajorTable />
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <TrophyOutlined />
                                    Top Employers
                                </Space>
                            }
                        >
                            <List
                                dataSource={topEmployers}
                                renderItem={(employer, index) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Badge
                                                    count={index + 1}
                                                    style={{
                                                        backgroundColor:
                                                            "#52c41a",
                                                    }}
                                                >
                                                    <Avatar
                                                        style={{
                                                            backgroundColor:
                                                                "#f0f0f0",
                                                        }}
                                                        size="large"
                                                    >
                                                        {employer.name.charAt(
                                                            0
                                                        )}
                                                    </Avatar>
                                                </Badge>
                                            }
                                            title={employer.name}
                                            description={`${employer.hires} alumni hires`}
                                        />
                                        <Tag
                                            color={
                                                employer.trend === "up"
                                                    ? "green"
                                                    : "blue"
                                            }
                                        >
                                            {employer.trend === "up"
                                                ? "📈 Growing"
                                                : "→ Stable"}
                                        </Tag>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Recent Graduates and Events */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Card
                            className="dashboard-card"
                            title={
                                <Space>
                                    <RocketOutlined />
                                    Recent Graduates (2024)
                                </Space>
                            }
                            extra={<Button type="link">View All</Button>}
                        >
                            <List
                                dataSource={recentGraduates}
                                renderItem={(alumni) => (
                                    <List.Item
                                        actions={[
                                            <Tooltip
                                                title="View Profile"
                                                key="view"
                                            >
                                                <Button
                                                    type="text"
                                                    icon={<EyeOutlined />}
                                                />
                                            </Tooltip>,
                                            <Tooltip
                                                title="Connect"
                                                key="connect"
                                            >
                                                <Button
                                                    type="text"
                                                    icon={<LinkedinOutlined />}
                                                />
                                            </Tooltip>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar src={alumni.avatar} />
                                            }
                                            title={
                                                <Space>
                                                    <Text strong>
                                                        {alumni.name}
                                                    </Text>
                                                    {getStatusTag(
                                                        alumni.status
                                                    )}
                                                </Space>
                                            }
                                            description={
                                                <Space
                                                    direction="vertical"
                                                    size={0}
                                                >
                                                    <Text>
                                                        {alumni.major} •{" "}
                                                        {alumni.graduationYear}
                                                    </Text>
                                                    <Text type="secondary">
                                                        {alumni.company ||
                                                            alumni.institution}{" "}
                                                        • {alumni.position}
                                                    </Text>
                                                    {alumni.salary && (
                                                        <Text strong>
                                                            $
                                                            {alumni.salary.toLocaleString()}
                                                        </Text>
                                                    )}
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card
                            className="dashboard-card"
                            title={
                                <Space>
                                    <CalendarOutlined />
                                    Upcoming Events
                                </Space>
                            }
                            extra={<Button type="link">View Calendar</Button>}
                        >
                            <List
                                dataSource={upcomingEvents}
                                renderItem={(event) => (
                                    <List.Item
                                        actions={[
                                            <Button type="primary" size="small">
                                                Register
                                            </Button>,
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    style={{
                                                        backgroundColor:
                                                            event.type ===
                                                            "networking"
                                                                ? "#1890ff"
                                                                : event.type ===
                                                                  "career_fair"
                                                                ? "#52c41a"
                                                                : "#722ed1",
                                                    }}
                                                    icon={<CalendarOutlined />}
                                                />
                                            }
                                            title={event.title}
                                            description={
                                                <Space
                                                    direction="vertical"
                                                    size={0}
                                                >
                                                    <Text>
                                                        <CalendarOutlined />{" "}
                                                        {event.date}
                                                    </Text>
                                                    <Progress
                                                        percent={Math.round(
                                                            (event.attendees /
                                                                event.capacity) *
                                                                100
                                                        )}
                                                        size="small"
                                                        showInfo={false}
                                                    />
                                                    <Text type="secondary">
                                                        {event.attendees} /{" "}
                                                        {event.capacity}{" "}
                                                        registered
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                <br></br>
                {/* Additional Metrics */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={8}>
                        <Card className="metric-card">
                            <Statistic
                                title="Event Participation Rate"
                                value={alumniMetrics.eventParticipation}
                                suffix="%"
                                valueStyle={{ color: "#13c2c2" }}
                            />
                            <Progress
                                percent={alumniMetrics.eventParticipation}
                                showInfo={false}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="metric-card">
                            <Statistic
                                title="Mentorship Engagement"
                                value={alumniMetrics.mentorshipEngagement}
                                suffix="%"
                                valueStyle={{ color: "#eb2f96" }}
                            />
                            <Text type="secondary">
                                Active mentor relationships
                            </Text>
                        </Card>
                    </Col>
                    <Col xs={24} md={8}>
                        <Card className="metric-card">
                            <Statistic
                                title="Alumni Donations"
                                value={4.2}
                                prefix="$"
                                suffix="M"
                                valueStyle={{ color: "#fa8c16" }}
                            />
                            <Text type="secondary">+12% from last year</Text>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default AlumniDashboard;
