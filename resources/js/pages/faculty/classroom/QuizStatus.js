import React, { useState } from "react";
import {
    Col,
    Card,
    Table,
    Typography,
    Tag,
    Divider,
    Row,
    Statistic,
    Spin,
    Modal,
    Descriptions,
    Progress,
    List,
    Button,
} from "antd";
import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import PullToRefresh from "react-simple-pull-to-refresh";
import useQuizStatus from "~/hooks/useQuizStatus";
import { QuestionDetailsModal } from "~/components";
import QuizStatistics from "~/components/QuizStatistics";
import { formatDate } from "../../../utils/helper";
import { useQueryClient } from "react-query";

const { Title, Text } = Typography;

const getDuration = (start, end) => {
    if (!start || !end) return "—";

    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;

    if (isNaN(diffMs) || diffMs < 0) return "—";

    const hours = Math.floor(diffMs / 3600000); // 1h = 3600000ms
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    let parts = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (seconds > 0) parts.push(`${seconds} sec`);

    return parts.length > 0 ? parts.join(" ") : "0 sec";
};

const QuizStatus = ({ classwork_id }) => {
    const queryClient = useQueryClient();
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedScore, setSelectedScore] = useState(null);

    const {
        data: studentList = [],
        isLoading,
        isFetching,
        refetch,
    } = useQuizStatus(classwork_id);

    const columns = [
        {
            title: "Student Name",
            dataIndex: "studentName",
            key: "studentName",
            sorter: (a, b) => a.studentName.localeCompare(b.studentName),
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
            sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime),
        },
        {
            title: "Duration",
            dataIndex: "duration",
            key: "duration",
            sorter: (a, b) => {
                // Placeholder for a custom function to parse duration strings
                const parseDurationToSeconds = (durationStr) => {
                    // Your implementation here to convert "X hours Y minutes Z sec" to a number
                };
                const aSeconds = parseDurationToSeconds(a.duration);
                const bSeconds = parseDurationToSeconds(b.duration);
                return aSeconds - bSeconds;
            },
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
            sorter: (a, b) => a.score.total_score - b.score.total_score,
            render: (record) => {
                if (!record.total_points) {
                    return <div>-_</div>;
                }

                return (
                    <div
                        onClick={() => handleScoreClick(record)}
                        style={{
                            cursor:
                                record.status === "done"
                                    ? "pointer"
                                    : "default",
                            color:
                                record.status === "done"
                                    ? "#1890ff"
                                    : "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        {`${record?.total_score}/${record?.total_points}`}
                        {record.status === "done" && (
                            <EyeOutlined style={{ fontSize: "12px" }} />
                        )}
                    </div>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            // sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => {
                let color = "default";
                if (status === "done") color = "success";
                if (status === "pending") color = "orange";
                if (status === "approved-admin") color = "blue";
                return (
                    <Tag color={color}>
                        {status === "approved-admin"
                            ? "ONGOING"
                            : status?.toUpperCase() || ""}
                    </Tag>
                );
            },
        },
    ];

    const generateStudentData = () => {
        const students = [];

        for (let i = 0; i < studentList.length; i++) {
            const student = studentList[i];
            const studentId = student.student_id; // Assuming student has an ID field
            students.push({
                key: i.toString(),
                number: i + 1 + ".",
                studentName: `${student.student?.lname}, ${student.student?.fname}`,
                startTime: formatDate(student?.start_time, true),
                endTime: formatDate(student?.end_time, true),
                duration: getDuration(student?.start_time, student?.end_time),
                score: student,
                status: student?.status,
            });
        }

        return students;
    };

    const data = generateStudentData();

    const handleScoreClick = (record) => {
        if (record.total_points && record.status === "done") {
            setSelectedScore(record);
            setIsModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedScore(null);
    };

    const questionDetails = (item) => {
        setCurrentQuestion(item?.quiz_question_list?.question || {});
        setIsViewModalVisible(true);
    };

    return (
        <>
            {/* <Divider /> */}
            <Col xs={16}>
                <PullToRefresh
                    onRefresh={() => {
                        queryClient.invalidateQueries("questions-statistics");
                        refetch();
                    }}
                    pullingContent={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // padding: "20px 0",
                            }}
                        >
                            <DownOutlined style={{ marginRight: 8 }} />
                            <span>Pull down to refresh</span>
                        </div>
                    }
                    refreshingContent={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                // padding: "20px 0",
                            }}
                        >
                            <Spin tip="Loading..."></Spin>
                        </div>
                    }
                    maxPullDownDistance={100}
                >
                    <Card
                        loading={isLoading}
                        style={{ minHeight: 400 }}
                        title="Quiz Status"
                    >
                        <Table
                            dataSource={data}
                            columns={columns}
                            pagination={{
                                position: ["bottomCenter"], // You can also use 'topLeft' or 'topRight'
                                pageSize: 5,
                            }}
                            scroll={{ x: true }}
                            size="middle"
                        />
                    </Card>
                    <QuizStatistics classwork_id={classwork_id} />
                </PullToRefresh>
            </Col>
            <Modal
                title="Score Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        Close
                    </Button>,
                ]}
                width={1000}
            >
                {selectedScore ? (
                    <>
                        <Descriptions
                            bordered
                            column={1}
                            style={{ marginBottom: 24 }}
                        >
                            <Descriptions.Item label="Student">
                                {selectedScore?.student?.fname}{" "}
                                {selectedScore?.student?.lname}
                            </Descriptions.Item>
                            <Descriptions.Item label="Score">
                                {selectedScore.score}
                            </Descriptions.Item>
                            <Descriptions.Item label="Time Spent">
                                {getDuration(
                                    selectedScore?.start_time,
                                    selectedScore?.end_time
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Text strong>Question Details</Text>
                        <List
                            size="small"
                            dataSource={selectedScore?.questions || []}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                        }}
                                    >
                                        <span>
                                            {index + 1} ).
                                            <Button
                                                onClick={() =>
                                                    questionDetails(item)
                                                }
                                                type="link"
                                            >
                                                {" "}
                                                {item?.quiz_question_list
                                                    ?.question?.question || ""}
                                            </Button>
                                        </span>
                                        <Tag
                                            color={
                                                item.isCorrect === 1
                                                    ? "green"
                                                    : "red"
                                            }
                                        >
                                            {item.isCorrect === 1
                                                ? "Correct"
                                                : "Incorrect"}
                                        </Tag>
                                    </div>
                                </List.Item>
                            )}
                            style={{
                                marginTop: 16,
                                maxHeight: 300,
                                overflow: "auto",
                            }}
                        />
                    </>
                ) : (
                    <Text>No detailed score information available.</Text>
                )}
            </Modal>
            <QuestionDetailsModal
                open={isViewModalVisible}
                onClose={() => setIsViewModalVisible(false)}
                question={currentQuestion}
            />
        </>
    );
};

export default QuizStatus;
