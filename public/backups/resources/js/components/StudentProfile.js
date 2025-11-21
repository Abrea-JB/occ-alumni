import React, { useState } from "react";
import {
    Layout,
    Modal,
    Avatar,
    Descriptions,
    Tag,
    Progress,
    Button,
    Card,
    Table,
    Divider,
    Timeline,
    Tabs,
    Drawer,
    Row,
    Col,
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    CheckCircleTwoTone,
    CloseOutlined,
} from "@ant-design/icons";
import useGlobalStore from "~/states/globalState";

const { Content } = Layout;
const { TabPane } = Tabs;

const StudentProfileModal = () => {
    const { studentProfile, setField } = useGlobalStore();
    const [open, setOpen] = useState(false);

    const student = {
        name: "Jane Doe",
        avatar: "https://i.pravatar.cc/150?img=47",
        email: "jane.doe@example.com",
        phone: "+1 (555) 123-4567",
        grade: "A",
        progress: 82,
        interests: ["Math", "AI", "Design"],
        academicRecordsByYear: [
            {
                year: "2023",
                curriculum: [
                    { subject: "Mathematics", score: 95, grade: "A", units: 4 },
                    { subject: "Physics", score: 89, grade: "B+", units: 3 },
                    { subject: "Chemistry", score: 90, grade: "A-", units: 3 },
                ],
            },
            {
                year: "2024",
                curriculum: [
                    {
                        subject: "Computer Science",
                        score: 98,
                        grade: "A+",
                        units: 4,
                    },
                    {
                        subject: "AI Foundations",
                        score: 94,
                        grade: "A",
                        units: 3,
                    },
                    {
                        subject: "Design Thinking",
                        score: 88,
                        grade: "B+",
                        units: 2,
                    },
                ],
            },
        ],
        classList: [
            "Introduction to AI",
            "Linear Algebra",
            "Human-Computer Interaction",
        ],
        milestones: [
            { date: "2023-10", title: "Won Math Olympiad" },
            { date: "2024-02", title: "AI Hackathon Finalist" },
            { date: "2024-06", title: "Dean’s List Award" },
        ],
        courseProspectus: [
            {
                course: "AI Foundations",
                description: "Introduction to AI concepts and applications.",
                units: 3,
            },
            {
                course: "Advanced Mathematics",
                description: "Linear Algebra and Calculus.",
                units: 4,
            },
        ],
        enrollmentHistory: [
            {
                semester: "Fall 2023",
                courses: ["Mathematics", "Physics", "Chemistry"],
            },
            {
                semester: "Spring 2024",
                courses: [
                    "Computer Science",
                    "AI Foundations",
                    "Design Thinking",
                ],
            },
        ],
    };

    const renderAcademicTable = (curriculum) => {
        const columns = [
            { title: "Subject", dataIndex: "subject", key: "subject" },
            { title: "Score", dataIndex: "score", key: "score" },
            { title: "Grade", dataIndex: "grade", key: "grade" },
            { title: "Units", dataIndex: "units", key: "units" },
        ];

        const dataWithKey = curriculum.map((item, index) => ({
            ...item,
            key: index,
        }));
        const totalUnits = curriculum.reduce(
            (sum, item) => sum + item.units,
            0
        );

        return (
            <Table
                columns={columns}
                dataSource={dataWithKey}
                pagination={false}
                footer={() => <strong>Total Units: {totalUnits}</strong>}
            />
        );
    };

    const renderCourseProspectusTable = () => {
        const columns = [
            { title: "Course", dataIndex: "course", key: "course" },
            {
                title: "Description",
                dataIndex: "description",
                key: "description",
            },
            { title: "Units", dataIndex: "units", key: "units" },
        ];
        const dataWithKey = student.courseProspectus.map((item, index) => ({
            ...item,
            key: index,
        }));
        return (
            <Table
                columns={columns}
                dataSource={dataWithKey}
                pagination={false}
            />
        );
    };

    const renderEnrollmentHistory = () => {
        return student.enrollmentHistory.map((semester, idx) => (
            <div key={idx} style={{ marginBottom: 16 }}>
                <h4>{semester.semester}</h4>
                <ul>
                    {semester.courses.map((course, i) => (
                        <li key={i}>{course}</li>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        <>
            {/* <Modal
                open={studentProfile}
                onCancel={() => setField("studentProfile", false)}
                footer={null}
                width={"90%"}
                centered
                bodyStyle={{
                    padding: "24px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            > */}
            <Drawer
                title="Student Profile"
                placement="bottom"
                height="90vh"
                className="custom-drawer"
                style={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                }}
                onClose={() => setField("studentProfile", false)}
                open={studentProfile}
                mask={true}
                extra={
                    <Button
                        className="mobile-hidden"
                        type="text"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => setField("studentProfile", false)}
                    >
                        Close
                    </Button>
                }
            >
                <Content className="classroom-content">
                    <Row gutter={[16, 16]}>
                        <Col xs={6}>
                            <Card border={false}>
                                <div className="student-image"> 
                                    <Avatar
                                        size={100}
                                        src={student.avatar}
                                        icon={<UserOutlined />}
                                    />
                                    <h2 style={{ marginTop: 16 }}>
                                        {student.name}
                                    </h2>
                                </div>

                                <Descriptions
                                    column={1}
                                    bordered={false}
                                    size="small"
                                >
                                    <Descriptions.Item label={<MailOutlined />}>
                                        {student.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item
                                        label={<PhoneOutlined />}
                                    >
                                        {student.phone}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Grade">
                                        {student.grade}
                                    </Descriptions.Item>
                                </Descriptions>
                                <div style={{ marginTop: 20 }}>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Learning Progress
                                    </p>
                                    <Progress
                                        percent={student.progress}
                                        status="active"
                                    />
                                </div>

                                <div style={{ marginTop: 20 }}>
                                    <p
                                        style={{
                                            fontWeight: 500,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Interests
                                    </p>
                                    {student.interests.map((interest) => (
                                        <Tag
                                            color="blue"
                                            key={interest}
                                            style={{ marginBottom: 4 }}
                                        >
                                            {interest}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                        <Col xs={18}>
                            <Card>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="Academic Records" key="1">
                                        {student.academicRecordsByYear.map(
                                            (yearData, idx) => (
                                                <div
                                                    key={idx}
                                                    style={{ marginBottom: 20 }}
                                                >
                                                    <h3>
                                                        <CalendarOutlined />{" "}
                                                        Year {yearData.year}
                                                    </h3>
                                                    {renderAcademicTable(
                                                        yearData.curriculum
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </TabPane>

                                    <TabPane tab="Class List" key="2">
                                        {student.classList.map((cls, idx) => (
                                            <p key={idx}>
                                                <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                                                <span style={{ marginLeft: 8 }}>
                                                    {cls}
                                                </span>
                                            </p>
                                        ))}
                                    </TabPane>

                                    <TabPane tab="Course Prospectus" key="4">
                                        {renderCourseProspectusTable()}
                                    </TabPane>

                                    <TabPane tab="Enrollment History" key="5">
                                        {renderEnrollmentHistory()}
                                    </TabPane>

                                    <TabPane tab="Milestones" key="3">
                                        <Timeline>
                                            {student.milestones.map(
                                                (m, idx) => (
                                                    <Timeline.Item
                                                        key={idx}
                                                        color="blue"
                                                    >
                                                        <strong>
                                                            {m.date}
                                                        </strong>{" "}
                                                        - {m.title}
                                                    </Timeline.Item>
                                                )
                                            )}
                                        </Timeline>
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Drawer>
        </>
    );
};

export default StudentProfileModal;
