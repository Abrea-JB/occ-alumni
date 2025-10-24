import React, { useState, useMemo } from "react";
import {
    Layout,
    Card,
    Typography,
    Popover,
    Avatar,
    Badge,
    Table,
    Tag,
    Input,
    Button,
    Popconfirm,
    message,
    Drawer,
    Row,
    Col,
    Spin,
    Tooltip,
    List,
    Tabs,
    Modal,
    Checkbox,
    Space,
    Select,
} from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    CloseCircleFilled,
    MessageOutlined,
    PaperClipOutlined,
    DownOutlined,
    FileTextOutlined,
    CommentOutlined,
    BulkIcon, // You might need to import an appropriate icon
    CheckSquareOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import useStudentSubmission from "~/hooks/useStudentSubmission";
import useClassroomStore from "~/states/classroomState";
import { useLoadingStore } from "~/states/loadingState";
import { useQueryClient } from "react-query";
import ClassComment from "./ClassComment";
import useFileViewer from "~/hooks/useFileViewer";
import PullToRefresh from "react-simple-pull-to-refresh";
import { PrivateMessage } from "~/components";
import secureLocalStorage from "react-secure-storage";
import { formatDate } from "~/utils/helper";
import { CLASSWORK_ATTACHMENT } from "~/utils/constant";
import RquestExam from "./RquestExam";
import QuizStatus from "./QuizStatus";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ClassworkSubmission = () => {
    const { handleFileClick, renderFileIcon, FileViewerModal } =
        useFileViewer(CLASSWORK_ATTACHMENT);
    const queryClient = useQueryClient();
    const {
        addTopicClassworkScore,
        addBulkClassworkScores, // You'll need to add this to your store
        submission,
        setField,
        classwork_id,
        classwork_title,
        classwork_points,
    } = useClassroomStore();
    const {
        data: students = [],
        isLoading,
        isFetching,
        refetch,
    } = useStudentSubmission(classwork_id);

    const [submit, setSubmit] = useState(false);
    const [bulkSubmit, setBulkSubmit] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const { showLoading, hideLoading } = useLoadingStore();

    let list_students = [];
    let list_student_array = Array.isArray(students) ? students : [];

    if (!isLoading) {
        list_student_array.forEach((item, index) => {
            const { fname, lname, mname } = item.student || {};
            if (fname) {
                list_students.push({
                    item: item,
                    key: index,
                    name: `${lname || ""}, ${fname}${
                        mname ? " " + mname + "." : ""
                    }`,
                    status: item?.score?.status || "assigned",
                    score: `${item?.score?.score || "-"}`,
                    submission: formatDate(item?.created_at, true),
                    comments: item?.messageCount || 0,
                    attachments: item?.attachments || [],
                    studentId: item.student?.id,
                });
            }
        });
    }

    // Filter students based on search term
    const filteredStudents = useMemo(() => {
        if (!searchTerm) return list_students;

        return list_students.filter((student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [list_students, searchTerm]);

    const graded = list_student_array.filter(
        (item) => item.score !== null
    ).length;

    // Grade editing state
    const [editingKey, setEditingKey] = useState("");
    const [tempScore, setTempScore] = useState("");
    const [selected, setSelected] = useState(null);
    const [isActive, setIsActive] = useState(false);

    // Bulk update state
    const [bulkUpdateModalVisible, setBulkUpdateModalVisible] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [bulkScore, setBulkScore] = useState("");
    const [bulkStatus, setBulkStatus] = useState("graded");
    const [selectAll, setSelectAll] = useState(false);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        setSelected(record?.item || null);
        setEditingKey(record.key);
        setTempScore(record.score === "-" ? "" : record.score);
    };

    const cancel = () => {
        setEditingKey("");
    };

    const save = async (key) => {
        setSubmit(true);
        showLoading("Saving score...");
        const response = await addTopicClassworkScore({
            student_id: selected?.student?.id,
            classwork_id: classwork_id,
            scores: tempScore,
        });
        if (response.error) {
            throw new Error(response.message);
        }
        if (response.status === 200) {
            refetch();
            if (!isFetching) {
                setEditingKey("");
                queryClient.invalidateQueries("classwork-gradesheet-data");
                message.success("Score saved successfully!");
            }
        }
        hideLoading();
        setSubmit(false);
    };

    const handleScoreChange = (e) => {
        const maxScore = classwork_points;
        const value = e.target.value;

        if (value === "") {
            setTempScore("");
            return;
        }

        const match = value.match(/^(\d{1,3})(?:\/(\d{1,3}))?$/);
        if (match) {
            const score = parseInt(match[1], 10);
            const max = match[2] ? parseInt(match[2], 10) : maxScore;

            if (
                !isNaN(score) &&
                !isNaN(max) &&
                score >= 0 &&
                score <= maxScore &&
                max > 0 &&
                max <= maxScore
            ) {
                setTempScore(value);
            } else {
                message.error(
                    `Score and max must be between 0 and ${maxScore}`
                );
            }
        } else {
            message.error("Invalid format. Use 'score' or 'score/max'");
        }
    };

    // Bulk update functions
    const handleBulkScoreChange = (e) => {
        const maxScore = classwork_points;
        const value = e.target.value;

        if (value === "") {
            setBulkScore("");
            return;
        }

        const match = value.match(/^(\d{1,3})(?:\/(\d{1,3}))?$/);
        if (match) {
            const score = parseInt(match[1], 10);
            const max = match[2] ? parseInt(match[2], 10) : maxScore;

            if (
                !isNaN(score) &&
                !isNaN(max) &&
                score >= 0 &&
                score <= maxScore &&
                max > 0 &&
                max <= maxScore
            ) {
                setBulkScore(value);
            } else {
                message.error(
                    `Score and max must be between 0 and ${maxScore}`
                );
            }
        } else {
            message.error("Invalid format. Use 'score' or 'score/max'");
        }
    };

    const handleStudentSelect = (studentKey, checked) => {
        if (checked) {
            setSelectedStudents([...selectedStudents, studentKey]);
        } else {
            setSelectedStudents(
                selectedStudents.filter((key) => key !== studentKey)
            );
        }
    };

    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedStudents(list_students.map((student) => student.key));
        } else {
            setSelectedStudents([]);
        }
    };

    const openBulkUpdateModal = () => {
        setBulkUpdateModalVisible(true);
        setBulkScore("");
        setBulkStatus("graded");
    };

    const closeBulkUpdateModal = () => {
        setBulkUpdateModalVisible(false);
        setSelectedStudents([]);
        setSelectAll(false);
    };

    const executeBulkUpdate = async () => {
        if (selectedStudents.length === 0) {
            message.warning("Please select at least one student");
            return;
        }

        if (!bulkScore && bulkStatus === "graded") {
            message.warning("Please enter a score for graded students");
            return;
        }

        setBulkSubmit(true);
        showLoading("Updating scores in bulk...");

        try {
            const studentUpdates = selectedStudents.map((key) => {
                const student = list_students.find((s) => s.key === key);
                return {
                    student_id: student.studentId,
                    scores: bulkStatus === "graded" ? bulkScore : "0",
                    status: bulkStatus,
                };
            });
            const payload = {
                classwork_id: classwork_id, // Include classwork_id here
                scores: studentUpdates, // Array of student updates
            };

            // You'll need to implement addBulkClassworkScores in your store
            const response = await addBulkClassworkScores(payload);

            if (response.error) {
                throw new Error(response.message);
            }

            if (response.status === 200) {
                message.success(
                    `Successfully updated ${selectedStudents.length} students`
                );
                closeBulkUpdateModal();
                refetch();
                queryClient.invalidateQueries("classwork-gradesheet-data");
            }
        } catch (error) {
            message.error("Failed to update scores: " + error.message);
        } finally {
            hideLoading();
            setBulkSubmit(false);
        }
    };

    // Calculate average score
    const calculateAverage = () => {
        const total = 100;
        const validScores = list_students
            .map((student) => parseFloat(student?.score))
            .filter((score) => !isNaN(score) && score >= 0);

        if (validScores.length === 0) return "-";

        const percentages = validScores.map((score) => {
            const percentage = (Math.min(score, total) / total) * 100;
            return Math.min(100, percentage);
        });

        const average =
            percentages.reduce((sum, pct) => sum + pct, 0) / percentages.length;

        return `${Math.round(average)}`;
    };

    // Table columns
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
                if (status === "turned-in") {
                    color = "blue";
                } else if (status === "missing") {
                    icon = <CloseCircleFilled />;
                    color = "red";
                } else if (status === "graded") {
                    icon = <CheckCircleOutlined />;
                    color = "cyan";
                } else {
                    icon = <CheckCircleOutlined />;
                    color = "blue";
                }
                return (
                    <Tag icon={icon} color={color}>
                        {status === "turned_in"
                            ? "Turned In"
                            : (status || "").toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Score",
            dataIndex: "score",
            key: "score",
            width: 150,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Input
                        value={tempScore}
                        onChange={handleScoreChange}
                        placeholder={`"e.g. 0/${classwork_points}"`}
                        allowClear
                        size="small"
                    />
                ) : (
                    <span>{record.score}</span>
                );
            },
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
            align: "center",
            render: (count, record) => (
                <Popover
                    content={<PrivateMessage isActive={isActive} />}
                    title="Private Messages"
                    trigger="click"
                    destroyTooltipOnHide
                    onVisibleChange={(visible) => {
                        const student = record?.item?.student;
                        const faculty_id =
                            secureLocalStorage.getItem("faculty_id");
                        const name = secureLocalStorage.getItem("name");
                        setField("otherUser", {
                            id: student?.id,
                            name: `${student?.fname} ${student?.lname} `,
                            role: "student",
                            email: "",
                        });
                        setField("currentUser", {
                            id: faculty_id,
                            name: "Faculty Name",
                            role: "faculty",
                            email: "",
                        });
                        setIsActive(visible);
                    }}
                >
                    <Tooltip title="View Private Messages">
                        <Badge
                            count={count}
                            style={{
                                backgroundColor: "#E91E63",
                                cursor: "pointer",
                            }}
                        >
                            <Avatar
                                shape="square"
                                icon={<MessageOutlined />}
                                style={{
                                    backgroundColor: "#1890ff",
                                    cursor: "pointer",
                                }}
                            />
                        </Badge>
                    </Tooltip>
                </Popover>
            ),
        },
        {
            title: "Attachments",
            dataIndex: "attachments",
            key: "attachments",
            align: "center",
            render: (attachments) => {
                if (attachments?.length === 0) {
                    return <></>;
                }
                const content = (
                    <div style={{ maxWidth: 300 }}>
                        <List
                            dataSource={attachments}
                            renderItem={(file) => (
                                <List.Item
                                    onClick={() => handleFileClick(file)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <List.Item.Meta
                                        avatar={renderFileIcon(file)}
                                        title={`${
                                            file.type === "file"
                                                ? "View File"
                                                : "View Link"
                                        } `}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                );

                return (
                    <Popover
                        content={content}
                        title="Attachments"
                        trigger="click"
                    >
                        <Tooltip title="View Attachments">
                            <Badge count={attachments?.length} color="#faad14">
                                <Avatar
                                    shape="square"
                                    icon={<PaperClipOutlined />}
                                    style={{
                                        backgroundColor: "#00BCD4",
                                        cursor: "pointer",
                                    }}
                                />
                            </Badge>
                        </Tooltip>
                    </Popover>
                );
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            onClick={() => save(record.key)}
                            icon={<SaveOutlined />}
                            size="small"
                            style={{ marginRight: 8 }}
                            loading={submit}
                            disabled={submit}
                        />
                        <Popconfirm title="Cancel changes?" onConfirm={cancel}>
                            <Button icon={<CloseOutlined />} size="small" />
                        </Popconfirm>
                    </span>
                ) : (
                    <Button
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                        icon={<EditOutlined />}
                        size="small"
                    />
                );
            },
        },
    ];

    return (
        <Drawer
            title="Student Submissions"
            placement="bottom"
            height="98vh"
            className="custom-drawer"
            style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }}
            onClose={() => setField("submission", false)}
            open={submission}
            mask={true}
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<CheckSquareOutlined />}
                        onClick={openBulkUpdateModal}
                        disabled={
                            editingKey !== "" || list_students.length === 0
                        }
                    >
                        Bulk Update
                    </Button>
                    <Button
                        className="mobile-hidden"
                        type="text"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => setField("submission", false)}
                    >
                        Close
                    </Button>
                </Space>
            }
        >
            <Content className="classroom-content">
                <Tabs
                    defaultActiveKey="1"
                    tabBarGutter={32}
                    type="line"
                    className="classroom-tab"
                >
                    <TabPane
                        tab={
                            <span>
                                <FileTextOutlined />
                                Student Work
                            </span>
                        }
                        key="1"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24}>
                                <PullToRefresh
                                    onRefresh={() => refetch()}
                                    pullingContent={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "20px 0",
                                            }}
                                        >
                                            <DownOutlined
                                                style={{ marginRight: 8 }}
                                            />
                                            <span>Pull down to refresh</span>
                                        </div>
                                    }
                                    refreshingContent={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "20px 0",
                                            }}
                                        >
                                            <Spin tip="Loading..."></Spin>
                                        </div>
                                    }
                                    maxPullDownDistance={100}
                                >
                                    <Card
                                        loading={isLoading}
                                        extra={
                                            selectedStudents.length > 0 && (
                                                <Text>
                                                    {selectedStudents.length}{" "}
                                                    student(s) selected
                                                </Text>
                                            )
                                        }
                                    >
                                        <div className="student-work-tab">
                                            <Title level={4}>
                                                {classwork_title}
                                            </Title>
                                            <Text type="secondary">
                                                {list_students.length} students
                                                enrolled • {graded} assignments
                                                graded
                                            </Text>

                                            {/* Search and Score Header */}

                                            <div
                                                className="grade-summary"
                                                style={{ marginTop: 5 }}
                                            >
                                                {/* <Title
                                                    level={5}
                                                    style={{ marginBottom:10 }}
                                                >
                                                    Grade Summary
                                                </Title> */}
                                                <div
                                                    className="grade-summary-cards"
                                                    style={{
                                                        display: "flex",
                                                        gap: 16,
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {/* Assigned Card */}
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 150,
                                                            borderLeft:
                                                                "4px solid #1890ff",
                                                        }}
                                                        bodyStyle={{
                                                            padding:
                                                                "12px 16px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    background:
                                                                        "#e6f7ff",
                                                                    padding: 6,
                                                                    borderRadius: 6,
                                                                }}
                                                            >
                                                                <ClockCircleOutlined
                                                                    style={{
                                                                        color: "#1890ff",
                                                                        fontSize: 18,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    Assigned
                                                                </Text>
                                                                <Title
                                                                    level={4}
                                                                    style={{
                                                                        margin: 0,
                                                                    }}
                                                                >
                                                                    {
                                                                        list_students.length
                                                                    }
                                                                </Title>
                                                            </div>
                                                        </div>
                                                    </Card>

                                                    {/* Turned In Card */}
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 150,
                                                            borderLeft:
                                                                "4px solid #52c41a",
                                                        }}
                                                        bodyStyle={{
                                                            padding:
                                                                "12px 16px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    background:
                                                                        "#f6ffed",
                                                                    padding: 6,
                                                                    borderRadius: 6,
                                                                }}
                                                            >
                                                                <CheckCircleOutlined
                                                                    style={{
                                                                        color: "#52c41a",
                                                                        fontSize: 18,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    Turned In
                                                                </Text>
                                                                <Title
                                                                    level={4}
                                                                    style={{
                                                                        margin: 0,
                                                                    }}
                                                                >
                                                                    4
                                                                </Title>
                                                            </div>
                                                        </div>
                                                    </Card>

                                                    {/* Graded Card */}
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 150,
                                                            borderLeft:
                                                                "4px solid #722ed1",
                                                        }}
                                                        bodyStyle={{
                                                            padding:
                                                                "12px 16px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    background:
                                                                        "#f9f0ff",
                                                                    padding: 6,
                                                                    borderRadius: 6,
                                                                }}
                                                            >
                                                                <CheckCircleOutlined
                                                                    style={{
                                                                        color: "#722ed1",
                                                                        fontSize: 18,
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    Graded
                                                                </Text>
                                                                <Title
                                                                    level={4}
                                                                    style={{
                                                                        margin: 0,
                                                                    }}
                                                                >
                                                                    {graded ||
                                                                        0}
                                                                </Title>
                                                            </div>
                                                        </div>
                                                    </Card>

                                                    {/* Average Score Card */}
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            flex: 1,
                                                            minWidth: 150,
                                                            borderLeft:
                                                                "4px solid #13c2c2",
                                                        }}
                                                        bodyStyle={{
                                                            padding:
                                                                "12px 16px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    background:
                                                                        "#e6fffb",
                                                                    padding: 6,
                                                                    borderRadius: 6,
                                                                }}
                                                            >
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        color: "#13c2c2",
                                                                        fontSize: 18,
                                                                    }}
                                                                >
                                                                    %
                                                                </Text>
                                                            </div>
                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize: 12,
                                                                    }}
                                                                >
                                                                    Average
                                                                    Score
                                                                </Text>
                                                                <Title
                                                                    level={4}
                                                                    style={{
                                                                        margin: 0,
                                                                    }}
                                                                >
                                                                    {calculateAverage()}
                                                                </Title>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    marginTop: 10,
                                                    marginBottom:10,
                                                }}
                                            >
                                                {/* Search Input on the left */}
                                                <Input
                                                    placeholder="Search students..."
                                                    prefix={<SearchOutlined />}
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                        setSearchTerm(
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{ width: 300 }}
                                                    allowClear
                                                />

                                                {/* Score on the right */}
                                                <Title
                                                    level={5}
                                                    style={{ margin: 0 }}
                                                >
                                                    Score: _ /{classwork_points}{" "}
                                                    points
                                                </Title>
                                            </div>

                                            <Table
                                                columns={columns}
                                                dataSource={filteredStudents}
                                                pagination={false}
                                                style={{ marginTop: "1em" }}
                                                scroll={{ y: 350 }} 
                                                rowClassName={(record) =>
                                                    isEditing(record)
                                                        ? "editing-row"
                                                        : ""
                                                }
                                                rowSelection={{
                                                    selectedRowKeys:
                                                        selectedStudents,
                                                    onChange: (
                                                        selectedRowKeys
                                                    ) => {
                                                        setSelectedStudents(
                                                            selectedRowKeys
                                                        );
                                                    },
                                                    getCheckboxProps: (
                                                        record
                                                    ) => ({
                                                        disabled:
                                                            editingKey !== "", // Disable when editing
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </Card>
                                </PullToRefresh>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <CommentOutlined />
                                Class Comments
                            </span>
                        }
                        key="2"
                    >
                        <Card loading={isLoading}>
                            <div className="student-work-tab">
                                <Title level={4}>Class Comments</Title>
                                <ClassComment classworkId={classwork_id} />
                            </div>
                        </Card>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <CommentOutlined />
                                Quiz
                            </span>
                        }
                        key="3"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={8}>
                                <Card title="Exam Requests" loading={isLoading}>
                                    <RquestExam classwork_id={classwork_id} />
                                </Card>
                            </Col>
                            <QuizStatus classwork_id={classwork_id} />
                        </Row>
                    </TabPane>
                </Tabs>
                {/* Bulk Update Modal */}
                <Modal
                    title="Bulk Update Scores"
                    open={bulkUpdateModalVisible}
                    onCancel={closeBulkUpdateModal}
                    footer={[
                        <Button key="cancel" onClick={closeBulkUpdateModal}>
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={bulkSubmit}
                            onClick={executeBulkUpdate}
                            disabled={selectedStudents.length === 0}
                        >
                            Update {selectedStudents.length} Student(s)
                        </Button>,
                    ]}
                    width={600} // Increased width to accommodate student list
                >
                    <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size="large"
                    >
                        <div>
                            <Text strong>Selected Students: </Text>
                            <Text>{selectedStudents.length} student(s)</Text>

                            {/* Add this section to show selected student names */}
                            {selectedStudents.length > 0 && (
                                <div
                                    style={{
                                        marginTop: 8,
                                        maxHeight: 150,
                                        overflowY: "auto",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: 6,
                                        padding: 8,
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    {selectedStudents.map((key) => {
                                        const student = list_students.find(
                                            (s) => s.key === key
                                        );
                                        return (
                                            <div
                                                key={key}
                                                style={{ padding: "4px 0" }}
                                            >
                                                <Text>{student?.name}</Text>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div>
                            <Text strong>Status: </Text>
                            <Select
                                value={bulkStatus}
                                onChange={setBulkStatus}
                                style={{ width: 200, marginLeft: 8 }}
                            >
                                <Option value="graded">Graded</Option>
                                <Option value="missing">Missing</Option>
                                <Option value="turned-in">Turned In</Option>
                            </Select>
                        </div>

                        {bulkStatus === "graded" && (
                            <div>
                                <Text strong>Score: </Text>
                                <Input
                                    value={bulkScore}
                                    onChange={handleBulkScoreChange}
                                    placeholder={`e.g. 0/${classwork_points}`}
                                    style={{ width: 200, marginLeft: 8 }}
                                />
                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">
                                        Enter score in format "score" or
                                        "score/max"
                                    </Text>
                                </div>
                            </div>
                        )}

                        <div>
                            <Text type="secondary">
                                This will update the selected students with the
                                specified score and status.
                            </Text>
                        </div>
                    </Space>
                </Modal>
                <FileViewerModal />
            </Content>
        </Drawer>
    );
};

export default React.memo(ClassworkSubmission);
