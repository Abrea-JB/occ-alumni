import React, { useState } from "react";
import {
    Layout,
    Tabs,
    Card,
    Typography,
    List,
    Avatar,
    Badge,
    Table,
    Tag,
} from "antd";
import {
    FileTextOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ClassworkGrades = () => {
    const [activeTab, setActiveTab] = useState("instructions");

    return (
        <Layout className="classroom-layout">
            <Header className="classroom-header">
                <Title level={3} style={{ color: "white", margin: 0 }}>
                    Science 101 - The Solar System
                </Title>
            </Header>

            <Content className="classroom-content">
                <Card>
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane
                            tab={
                                <span>
                                    <FileTextOutlined />
                                    Instructions
                                </span>
                            }
                            key="instructions"
                        >
                            <InstructionsTab />
                        </TabPane>

                        <TabPane
                            tab={
                                <span>
                                    <UserOutlined />
                                    Student Work
                                </span>
                            }
                            key="studentWork"
                        >
                            <StudentWorkTab />
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>
        </Layout>
    );
};

// Instruction Tab Component
const InstructionsTab = () => {
    return (
        <div className="instructions-tab">
            <Title level={4}>Assignment: Solar System Exploration</Title>
            <Paragraph>
                Due: <Text strong>May 25, 2023</Text>
            </Paragraph>

            <div className="assignment-description">
                <Title level={5}>Description</Title>
                <Paragraph>
                    Research one planet in our solar system and create a
                    presentation with the following:
                </Paragraph>
                <List
                    size="small"
                    dataSource={[
                        "Basic facts about the planet (size, composition, etc.)",
                        "Unique characteristics",
                        "Mission history (if any)",
                        "Comparison to Earth",
                        "At least 3 images",
                    ]}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />

                <Paragraph style={{ marginTop: "1em" }}>
                    <Text strong>Submission format:</Text> PowerPoint or Google
                    Slides (share link)
                </Paragraph>

                <Paragraph>
                    <Text strong>Grading rubric:</Text>
                </Paragraph>
                <List
                    size="small"
                    dataSource={[
                        "Content accuracy (30 points)",
                        "Presentation quality (20 points)",
                        "Creativity (10 points)",
                        "Citations (10 points)",
                        "Timeliness (10 points)",
                    ]}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                />
            </div>

            <div className="attachments" style={{ marginTop: "2em" }}>
                <Title level={5}>Attachments</Title>
                <List
                    itemLayout="horizontal"
                    dataSource={[
                        { name: "Solar System Overview.pdf", type: "PDF" },
                        { name: "Research Tips.docx", type: "Document" },
                        {
                            name: "Example Presentation.pptx",
                            type: "PowerPoint",
                        },
                    ]}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={`https://example.com/${item.type.toLowerCase()}.png`}
                                    />
                                }
                                title={<a href="#">{item.name}</a>}
                                description={item.type}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

// Student Work Tab Component
const StudentWorkTab = () => {
    const studentData = [
        {
            key: "1",
            name: "John Smith",
            status: "Turned in",
            grade: "A",
            submission: "May 24, 2023",
            comments: 2,
        },
        {
            key: "2",
            name: "Emily Johnson",
            status: "Turned in",
            grade: "B+",
            submission: "May 25, 2023",
            comments: 0,
        },
        {
            key: "3",
            name: "Michael Brown",
            status: "Missing",
            grade: "-",
            submission: "-",
            comments: 0,
        },
        {
            key: "4",
            name: "Sarah Davis",
            status: "Graded",
            grade: "A-",
            submission: "May 23, 2023",
            comments: 1,
        },
        {
            key: "5",
            name: "David Wilson",
            status: "Turned in",
            grade: "Pending",
            submission: "May 25, 2023",
            comments: 0,
        },
    ];

    const columns = [
        {
            title: "Student",
            dataIndex: "name",
            key: "name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let icon, color;
                if (status === "Turned in") {
                    icon = <CheckCircleOutlined />;
                    color = "green";
                } else if (status === "Missing") {
                    icon = <ClockCircleOutlined />;
                    color = "red";
                } else {
                    icon = <CheckCircleOutlined />;
                    color = "blue";
                }
                return (
                    <Tag icon={icon} color={color}>
                        {status}
                    </Tag>
                );
            },
        },
        {
            title: "Grade",
            dataIndex: "grade",
            key: "grade",
        },
        {
            title: "Submitted",
            dataIndex: "submission",
            key: "submission",
        },
        {
            title: "Comments",
            dataIndex: "comments",
            key: "comments",
            render: (count) => (
                <Badge count={count} style={{ backgroundColor: "#1890ff" }} />
            ),
        },
    ];

    return (
        <div className="student-work-tab">
            <Title level={4}>Student Submissions</Title>
            <Text type="secondary">
                2 students enrolled • 2 assignments turned in
            </Text>

            <Table
                columns={columns}
                dataSource={studentData}
                pagination={false}
                style={{ marginTop: "1em" }}
            />

            <div className="grade-summary" style={{ marginTop: "2em" }}>
                <Title level={5}>Grade Summary</Title>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={[
                        { title: "Assigned", value: 25 },
                        { title: "Turned in", value: 4 },
                        { title: "Graded", value: 3 },
                        { title: "Average", value: "B+" },
                    ]}
                    renderItem={(item) => (
                        <List.Item>
                            <Card>
                                <Text type="secondary">{item.title}</Text>
                                <Title level={3}>{item.value}</Title>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default ClassworkGrades;
