import React from "react";
import {
    Row,
    Col,
    Card,
    List,
    Avatar,
    Table,
    Tag,
    Typography,
    Progress,
} from "antd";
import {
    TrophyOutlined,
    CheckCircleOutlined,
    BarChartOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const { Title, Text } = Typography;

// --- MOCK DATA ---
// You can replace this with data from your API

const topStudentsData = [
    {
        name: "Alex Doe",
        score: 98,
        avatar: "https://joeschmoe.io/api/v1/male/alex",
    },
    {
        name: "Jane Smith",
        score: 95,
        avatar: "https://joeschmoe.io/api/v1/female/jane",
    },
    {
        name: "Samuel Green",
        score: 92,
        avatar: "https://joeschmoe.io/api/v1/male/samuel",
    },
    {
        name: "Emily White",
        score: 91,
        avatar: "https://joeschmoe.io/api/v1/female/emily",
    },
];

const nearFailingStudents = [
    {
        name: "Michael Brown",
        score: 62,
        avatar: "https://joeschmoe.io/api/v1/male/michael",
        improvement: -5,
    },
    {
        name: "Jessica Davis",
        score: 58,
        avatar: "https://joeschmoe.io/api/v1/female/jessica",
        improvement: 2,
    },
    {
        name: "David Wilson",
        score: 65,
        avatar: "https://joeschmoe.io/api/v1/male/david",
        improvement: -8,
    },
];

const recentAttendanceData = [
    {
        key: "1",
        studentName: "Michael Brown",
        date: "2025-09-21",
        status: "Present",
    },
    {
        key: "2",
        studentName: "Jessica Davis",
        date: "2025-09-21",
        status: "Absent",
    },
    {
        key: "3",
        studentName: "David Wilson",
        date: "2025-09-21",
        status: "Late",
    },
    {
        key: "4",
        studentName: "Sarah Miller",
        date: "2025-09-20",
        status: "Present",
    },
    {
        key: "5",
        studentName: "Robert Garcia",
        date: "2025-09-20",
        status: "Present",
    },
    {
        key: "6",
        studentName: "Linda Martinez",
        date: "2025-09-19",
        status: "Absent",
    },
];

const mostAbsentStudents = [
    {
        name: "Linda Martinez",
        absences: 12,
        avatar: "https://joeschmoe.io/api/v1/female/linda",
        trend: "increasing",
    },
    {
        name: "Jessica Davis",
        absences: 9,
        avatar: "https://joeschmoe.io/api/v1/female/jessica",
        trend: "stable",
    },
    {
        name: "Robert Garcia",
        absences: 7,
        avatar: "https://joeschmoe.io/api/v1/male/robert",
        trend: "decreasing",
    },
];

const absenceChartData = [
    { name: "May", absences: 8 },
    { name: "June", absences: 12 },
    { name: "July", absences: 5 },
    { name: "August", absences: 9 },
    { name: "September", absences: 15 },
];

// --- COMPONENT ---

const ClassroomDashboard = () => {
    const attendanceColumns = [
        {
            title: "Student Name",
            dataIndex: "studentName",
            key: "studentName",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (status) => {
                let color = "geekblue";
                if (status === "Present") {
                    color = "green";
                } else if (status === "Absent") {
                    color = "volcano";
                } else if (status === "Late") {
                    color = "gold";
                }
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div>
            <Row gutter={[24, 24]}>
                {/* Top Students Card */}
                <Col xs={24} sm={24} md={8}>
                    <Card
                        title={
                            <>
                                <TrophyOutlined /> Top Performing Students
                            </>
                        }
                        bordered={false}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={topStudentsData}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={`${item.avatar}?key=${index}`}
                                            />
                                        }
                                        title={<a href="#">{item.name}</a>}
                                        description={
                                            <div>
                                                <Text>
                                                    Score: {item.score}%
                                                </Text>
                                                <Progress
                                                    percent={item.score}
                                                    size="small"
                                                    status="active"
                                                    strokeColor={{
                                                        from: "#108ee9",
                                                        to: "#87d068",
                                                    }}
                                                />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Recent Attendance and Most Absent Students Cards */}
                <Col xs={24} sm={24} md={8}>
                    {/* Near-Failing Students Card */}
                    <Card
                        title={
                            <>
                                <ExclamationCircleOutlined /> Near-Failing
                                Students
                            </>
                        }
                        bordered={false}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={nearFailingStudents}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={`${item.avatar}?key=nf-${index}`}
                                            />
                                        }
                                        title={<a href="#">{item.name}</a>}
                                        description={
                                            <div>
                                                <Text>
                                                    Score: {item.score}%{" "}
                                                </Text>
                                                <Text
                                                    type={
                                                        item.improvement > 0
                                                            ? "success"
                                                            : "danger"
                                                    }
                                                >
                                                    (
                                                    {item.improvement > 0
                                                        ? "+"
                                                        : ""}
                                                    {item.improvement}% change)
                                                </Text>
                                                <Progress
                                                    percent={item.score}
                                                    size="small"
                                                    status="exception"
                                                />
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Card
                        title={
                            <>
                                <UserOutlined /> Most Absent Students (This
                                Semester)
                            </>
                        }
                        bordered={false}
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={mostAbsentStudents}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                src={`${item.avatar}?key=abs-${index}`}
                                            />
                                        }
                                        title={<a href="#">{item.name}</a>}
                                        description={
                                            <div>
                                                <Text>
                                                    Total absences:{" "}
                                                    {item.absences}
                                                </Text>
                                                <div>
                                                    <Text
                                                        type={
                                                            item.trend ===
                                                            "increasing"
                                                                ? "danger"
                                                                : item.trend ===
                                                                  "decreasing"
                                                                ? "success"
                                                                : "warning"
                                                        }
                                                    >
                                                        Trend: {item.trend}
                                                    </Text>
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                {/* Absence Chart Card */}
                <Col xs={24}>
                    <Card
                        title={
                            <>
                                <BarChartOutlined /> Monthly Absence Analysis
                            </>
                        }
                        bordered={false}
                    >
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={18}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={absenceChartData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="absences"
                                            fill="#8884d8"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Col>
                            <Col xs={24} md={6}>
                                <Title level={5}>Summary</Title>
                                <Text>
                                    Absences have increased by 87% compared to
                                    last semester. The highest number of
                                    absences occurs on Mondays and Fridays.
                                    <div style={{ marginTop: 16 }}>
                                        <Text strong>Recommendations:</Text>
                                        <ul>
                                            <li>
                                                Contact parents of frequently
                                                absent students
                                            </li>
                                            <li>
                                                Implement attendance incentive
                                                program
                                            </li>
                                            <li>
                                                Review morning scheduling
                                                conflicts
                                            </li>
                                        </ul>
                                    </div>
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ClassroomDashboard;
