import React, { useState, useMemo } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Select,
    Typography,
    Space,
    Divider,
    Tabs,
    Form,
    Radio,
    Rate,
    Upload,
    message,
    Modal,
    List,
    Tag,
    Switch,
    InputNumber,
    Avatar,
    Tooltip,
    Popconfirm,
    Image,
    Table,
    Checkbox,
    Badge,
    Drawer,
    Empty,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CopyOutlined,
    UploadOutlined,
    PictureOutlined,
    StarOutlined,
    UnorderedListOutlined,
    QuestionCircleOutlined,
    SaveOutlined,
    CloseOutlined,
    SearchOutlined,
    FilterOutlined,
    MenuOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    FullscreenOutlined,
    CheckSquareOutlined,
    OrderedListOutlined,
} from "@ant-design/icons";
import { Layout } from "~/components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./QuestionsPage.css";
import axiosConfig from "~/utils/axiosConfig";
import useQuestions from "~/hooks/useQuestions";
import useQuiz from "~/hooks/useQuiz";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AlumniQuestionsPage = () => {
    const {
        isLoading,
        data: questions = [],
        isFetching,
        refetch,
    } = useQuestions();
    const {
        isLoading: isLoadingQuizzes,
        data: quizzes = [],
        isFetching: isFetchingQuizzes,
        refetch: refetchQuizzes,
    } = useQuiz();

    //const [questions, setQuestions] = useState([]);
    // const [quizzes, setQuizzes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [activeTab, setActiveTab] = useState("quizzes-result");
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isQuizDrawerVisible, setIsQuizDrawerVisible] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [title, setTitle] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [isSaving, setIsSaving] = useState(false);
    const [form] = Form.useForm();

    // Question types
    const questionTypes = [
        { value: "rate", label: "Rating Question", icon: <StarOutlined /> },
        {
            value: "abcd",
            label: "Multiple Choice (ABCD)",
            icon: <UnorderedListOutlined />,
        },
    ];

    // Filtered questions for the drawer
    const filteredQuestions = useMemo(() => {
        const list = Array.isArray(questions) ? questions : [];

        return list.filter((question) => {
            const matchesSearch =
                question.question
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                question.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesType =
                filterType === "all" || question.type === filterType;

            return matchesSearch && matchesType;
        });
    }, [questions, searchTerm, filterType]);

    // Show modal for adding/editing question
    const showModal = (question = null) => {
        setEditingQuestion(question);
        if (question) {
            form.setFieldsValue({
                type: question.type,
                question: question.question,
                description: question.description,
                required: question.required,
                choices: question.choices || [],
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                type: "rate",
                required: true,
            });
        }
        setIsModalVisible(true);
    };

    // Handle modal cancel
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingQuestion(null);
        form.resetFields();
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();

            // Append question fields
            formData.append("type", values.type);
            formData.append("question", values.question);
            formData.append("description", values.description || "");
            formData.append("required", values.required);

            // Append choices only for MCQ
            if (values.type === "abcd" && values.choices) {
                // values.choices.forEach((choice, index) => {
                //     formData.append(`choices[${index}]`, choice);
                // });
                values.choices.forEach((choice, index) => {
                    formData.append(
                        `choices[${index}][interpretation]`,
                        choice.interpretation || ""
                    );

                    // Just send the file directly if it exists
                    if (choice.image?.file) {
                        formData.append(
                            `choices[${index}][image]`,
                            choice.image.file
                        );
                    }
                });
            }

            // POST Create Question
            const response = await axiosConfig.post("/questions", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                refetch();
                message.success("Question added successfully!");
                // ✅ Update UI state (optional)
                // setQuestions((prev) => [...prev, response.data.question]);
            }

            handleCancel(); // close modal
        } catch (error) {
            message.error("Failed to save question");
            console.error("❌ Error saving question:", error);
        }
    };

    const setActive = async (item) => {
        try {
            const formData = new FormData();

            formData.append("id", item?.id);
            formData.append("type", item?.type);

            const response = await axiosConfig.post("/quiz-active", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                refetchQuizzes();
                message.success("Quiz set active!");
            }
        } catch (error) {
            message.error("Failed to save question");
            console.error("❌ Error saving question:", error);
        }
    };

    // Delete question
    const handleDelete = (questionId) => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        setSelectedQuestions((prev) => prev.filter((id) => id !== questionId));
        message.success("Question deleted successfully!");
    };

    // Open quiz creation drawer
    const openQuizDrawer = (quiz = null) => {
        setCurrentQuiz(quiz);
        setQuizQuestions(quiz ? quiz.questions : []);
        setIsQuizDrawerVisible(true);
    };

    // Close quiz drawer
    const closeQuizDrawer = () => {
        setIsQuizDrawerVisible(false);
        setCurrentQuiz(null);
        setQuizQuestions([]);
        setSearchTerm("");
        setFilterType("all");
    };

    // Add question to quiz
    const addQuestionToQuiz = (question) => {
        if (quizQuestions.find((q) => q.id === question.id)) {
            message.warning("Question already added to quiz");
            return;
        }

        setQuizQuestions((prev) => [
            ...prev,
            {
                ...question,
                displayOrder: prev.length + 1,
            },
        ]);
        message.success("Question added to quiz");
    };

    // Remove question from quiz
    const removeQuestionFromQuiz = (questionId) => {
        setQuizQuestions((prev) => prev.filter((q) => q.id !== questionId));
        message.success("Question removed from quiz");
    };

    // Handle drag and drop reordering
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(quizQuestions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update display order
        const updatedItems = items.map((item, index) => ({
            ...item,
            displayOrder: index + 1,
        }));

        setQuizQuestions(updatedItems);
    };

    // Save quiz
    const saveQuiz = async () => {
        if (filterType === "all") {
            message.error("Please select a question category");
            return;
        }

        if (!title?.trim()) {
            message.error("Please enter a quiz title");
            return;
        }

        setIsSaving(true);
        const questionIds = quizQuestions.map((question) => question.id);
        try {
            const formData = new FormData();
            formData.append("type", filterType);
            formData.append("questions", questionIds);
            formData.append("title", title.trim());

            const response = await axiosConfig.post("/quizzes", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                message.success("🎉 Quiz created successfully!");
                refetchQuizzes();
                closeQuizDrawer();
            } else {
                message.error("❌ Failed to create quiz");
            }
        } catch (error) {
            message.error("❌ Failed to save quiz");
            console.error("Error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Delete quiz
    const deleteQuiz = (quizId) => {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        message.success("Quiz deleted successfully!");
    };

    // View quiz details
    const viewQuizDetails = (quiz) => {
        setCurrentQuiz(quiz);
        setActiveTab("quiz-details");
    };

    // Quiz columns for table
    const quizColumns = [
        {
            title: "Quiz Name",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    <div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.questions.length} questions • Updated{" "}
                            {new Date(record.updated_at).toLocaleDateString()}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type, record) => {
                const color = type === "rate" ? "blue" : "green";
                return <Tag color={color}>{type}</Tag>;
            },
        },
        {
            title: "Active ?",
            dataIndex: "isActive",
            key: "isActive",
            width: 120,
            render: (isActive, record) =>
                isActive ? <Tag color="green">Yes</Tag> : null,
        },
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            render: (_, record) =>
                new Date(record.created_at).toLocaleDateString(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => viewQuizDetails(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Quiz">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openQuizDrawer(record)}
                            style={{ color: "#1890ff" }}
                        />
                    </Tooltip>
                    <Tooltip title="Set Active">
                        <Button
                            type="text"
                            icon={<CheckSquareOutlined />}
                            onClick={() => setActive(record)}
                            style={{ color: "#52c41a" }} // Green color
                        />
                    </Tooltip>
                    {/* <Tooltip title="Create Similar">
                        <Button
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={() =>
                                openQuizDrawer({
                                    ...record,
                                    id: null,
                                    title: `${record.title} (Copy)`,
                                })
                            }
                        />
                    </Tooltip> */}
                    <Popconfirm
                        title="Delete Quiz"
                        description="Are you sure you want to delete this quiz?"
                        onConfirm={() => deleteQuiz(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Question columns for drawer
    const questionColumns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type) => (
                <Tag
                    color={type === "rate" ? "blue" : "green"}
                    icon={
                        type === "rate" ? (
                            <StarOutlined />
                        ) : (
                            <UnorderedListOutlined />
                        )
                    }
                >
                    {type === "rate" ? "Rating" : "Multiple Choice"}
                </Tag>
            ),
        },
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            ellipsis: true,
            render: (text, record) => (
                <div>
                    <Text strong>{text}</Text>
                    {record.description && (
                        <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                                {record.description}
                            </Text>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => addQuestionToQuiz(record)}
                    disabled={quizQuestions.find((q) => q.id === record.id)}
                >
                    Add
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <div className="alumni-dashboard">
                {/* Header */}
                <Card className="dashboard-header-card">
                    <div className="dashboard-header">
                        <div>
                            <Title level={2}>Quiz Management</Title>
                            <Text type="secondary">
                                Create and manage quizzes for your events and
                                surveys
                            </Text>
                        </div>
                        <div className="header-controls">
                            <Space>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => openQuizDrawer()}
                                    size="large"
                                >
                                    Create New Quiz
                                </Button>
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => showModal()}
                                    size="large"
                                >
                                    Add Question
                                </Button>
                            </Space>
                        </div>
                    </div>
                </Card>

                {/* Tabs */}
                <Card style={{ marginTop: 20 }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className="questions-tabs"
                    >
                        <TabPane
                            tab={
                                <span>
                                    <OrderedListOutlined />
                                    Quizzes Result
                                    <Badge
                                        count={quizzes.length}
                                        style={{
                                            backgroundColor: "#1890ff",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="quizzes-result"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <UnorderedListOutlined />
                                    All Quizzes
                                    <Badge
                                        count={quizzes.length}
                                        style={{
                                            backgroundColor: "#1890ff",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="quizzes"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <QuestionCircleOutlined />
                                    All Questions
                                    <Badge
                                        count={questions.length}
                                        style={{
                                            backgroundColor: "#52c41a",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="questions"
                        />
                        {currentQuiz && (
                            <TabPane
                                tab={
                                    <span>
                                        <EyeOutlined />
                                        {currentQuiz.title}
                                    </span>
                                }
                                key="quiz-details"
                            />
                        )}
                    </Tabs>

                    {/* Quizzes Tab Content */}
                    {activeTab === "quizzes" && (
                        <div className="quizzes-tab-content">
                            {quizzes.length === 0 ? (
                                <Card className="empty-state-card">
                                    <div className="empty-state-content">
                                        <UnorderedListOutlined
                                            style={{
                                                fontSize: 48,
                                                color: "#d9d9d9",
                                            }}
                                        />
                                        <Title level={4}>
                                            No Quizzes Created
                                        </Title>
                                        <Text type="secondary">
                                            Create your first quiz to get
                                            started with assessments
                                        </Text>
                                        <br />
                                        <Button
                                            type="primary"
                                            onClick={() => openQuizDrawer()}
                                        >
                                            Create First Quiz
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <Table
                                    columns={quizColumns}
                                    dataSource={quizzes}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Questions Tab Content */}
                    {activeTab === "questions" && (
                        <div className="questions-tab-content">
                            <div className="table-header">
                                <Text strong>
                                    Total Questions: {questions.length}
                                </Text>
                                <Space>
                                    <Input
                                        placeholder="Search questions..."
                                        prefix={<SearchOutlined />}
                                        style={{ width: 250 }}
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <Select
                                        placeholder="Filter by type"
                                        style={{ width: 150 }}
                                        value={filterType}
                                        onChange={setFilterType}
                                    >
                                        <Option value="all">All Types</Option>
                                        <Option value="rate">Rating</Option>
                                        <Option value="abcd">
                                            Multiple Choice
                                        </Option>
                                    </Select>
                                </Space>
                            </div>

                            {questions.length === 0 ? (
                                <Card className="empty-state-card">
                                    <div className="empty-state-content">
                                        <QuestionCircleOutlined
                                            style={{
                                                fontSize: 48,
                                                color: "#d9d9d9",
                                            }}
                                        />
                                        <Title level={4}>
                                            No Questions Available
                                        </Title>
                                        <Text type="secondary">
                                            Create some questions first to build
                                            your quizzes
                                        </Text>
                                        <br />
                                        <Button
                                            type="primary"
                                            onClick={() => showModal()}
                                        >
                                            Create First Question
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <Table
                                    columns={[
                                        ...questionColumns,
                                        {
                                            title: "Actions",
                                            key: "actions",
                                            width: 120,
                                            render: (_, record) => (
                                                <Space size="small">
                                                    <Tooltip title="Edit">
                                                        <Button
                                                            type="text"
                                                            icon={
                                                                <EditOutlined />
                                                            }
                                                            onClick={() =>
                                                                showModal(
                                                                    record
                                                                )
                                                            }
                                                        />
                                                    </Tooltip>
                                                    <Popconfirm
                                                        title="Delete Question"
                                                        description="Are you sure you want to delete this question?"
                                                        onConfirm={() =>
                                                            handleDelete(
                                                                record.id
                                                            )
                                                        }
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Tooltip title="Delete">
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={
                                                                    <DeleteOutlined />
                                                                }
                                                            />
                                                        </Tooltip>
                                                    </Popconfirm>
                                                </Space>
                                            ),
                                        },
                                    ]}
                                    dataSource={questions}
                                    rowKey="id"
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* Quiz Details Tab Content */}
                    {activeTab === "quiz-details" && currentQuiz && (
                        <div className="quiz-details-content">
                            <Card
                                title={
                                    <Space>
                                        <Text strong>{currentQuiz.title}</Text>
                                        <Badge
                                            count={`${
                                                (Array.isArray(currentQuiz) &&
                                                    currentQuiz?.questions
                                                        ?.length) ||
                                                0
                                            } questions`}
                                        />
                                    </Space>
                                }
                                extra={
                                    <Space>
                                        <Button
                                            icon={<EditOutlined />}
                                            onClick={() =>
                                                openQuizDrawer(currentQuiz)
                                            }
                                        >
                                            Edit Quiz
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<FullscreenOutlined />}
                                        >
                                            Preview Quiz
                                        </Button>
                                    </Space>
                                }
                            >
                                <List
                                    dataSource={currentQuiz.questions}
                                    renderItem={(question, index) => (
                                        <List.Item className="quiz-question-item">
                                            <div className="question-number">
                                                <Text strong>#{index + 1}</Text>
                                            </div>
                                            <div className="question-content">
                                                <Space
                                                    direction="vertical"
                                                    style={{ width: "100%" }}
                                                >
                                                    <div className="question-header">
                                                        <Space>
                                                            <Tag
                                                                color={
                                                                    question.type ===
                                                                    "rate"
                                                                        ? "blue"
                                                                        : "green"
                                                                }
                                                            >
                                                                {question.type ===
                                                                "rate"
                                                                    ? "Rating"
                                                                    : "Multiple Choice"}
                                                            </Tag>
                                                            {question.required && (
                                                                <Tag color="red">
                                                                    Required
                                                                </Tag>
                                                            )}
                                                        </Space>
                                                    </div>
                                                    <Text strong>
                                                        {question.question}
                                                    </Text>
                                                    {question.description && (
                                                        <Text type="secondary">
                                                            {
                                                                question.description
                                                            }
                                                        </Text>
                                                    )}
                                                    {question.type === "abcd" &&
                                                        question.choices && (
                                                            <div className="choices-preview">
                                                                <Text strong>
                                                                    Options:
                                                                </Text>
                                                                <Row
                                                                    gutter={[
                                                                        16, 16,
                                                                    ]}
                                                                    style={{
                                                                        marginTop: 8,
                                                                    }}
                                                                >
                                                                    {question.choices.map(
                                                                        (
                                                                            choice,
                                                                            choiceIndex
                                                                        ) => (
                                                                            <Col
                                                                                span={
                                                                                    12
                                                                                }
                                                                                key={
                                                                                    choiceIndex
                                                                                }
                                                                            >
                                                                                <Card size="small">
                                                                                    <Space>
                                                                                        <Text
                                                                                            strong
                                                                                        >
                                                                                            {
                                                                                                choice.letter
                                                                                            }
                                                                                        </Text>
                                                                                        <Text>
                                                                                            {
                                                                                                choice.interpretation
                                                                                            }
                                                                                        </Text>
                                                                                    </Space>
                                                                                </Card>
                                                                            </Col>
                                                                        )
                                                                    )}
                                                                </Row>
                                                            </div>
                                                        )}
                                                </Space>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    )}
                </Card>

                {/* Quiz Creation/Editing Drawer */}
                <Drawer
                    title={
                        <Space>
                            {currentQuiz ? "Edit Quiz" : "Create New Quiz"}
                            {currentQuiz && (
                                <Tag color="blue">{currentQuiz.title}</Tag>
                            )}
                        </Space>
                    }
                    placement="right"
                    size="large"
                    open={isQuizDrawerVisible}
                    onClose={closeQuizDrawer}
                    width="90vw"
                    className="quiz-drawer"
                    extra={
                        <Space>
                            <Text type="secondary">
                                {quizQuestions.length} questions selected
                            </Text>
                            <Button onClick={closeQuizDrawer}>Cancel</Button>
                            <Button
                                loading={isSaving}
                                disabled={!title || filterType === "all"}
                                type="primary"
                                onClick={saveQuiz}
                            >
                                {currentQuiz ? "Update Quiz" : "Create Quiz"}
                            </Button>
                        </Space>
                    }
                >
                    <div className="quiz-drawer-content">
                        {/* Left Side - Questions List */}
                        <div className="questions-panel">
                            <Card
                                title="Available Questions"
                                className="questions-list-card"
                                extra={
                                    <Space>
                                        <Text type="secondary">
                                            {filteredQuestions.length} questions
                                        </Text>
                                    </Space>
                                }
                            >
                                <div className="search-filters">
                                    <Input
                                        placeholder="Search questions..."
                                        prefix={<SearchOutlined />}
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        style={{ marginBottom: 16 }}
                                    />
                                    <Input
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        style={{ marginBottom: 16 }}
                                    />
                                    <Select
                                        value={filterType}
                                        onChange={setFilterType}
                                        style={{
                                            width: "100%",
                                            marginBottom: 16,
                                        }}
                                    >
                                        <Option value="all">
                                            All Question Types
                                        </Option>
                                        <Option value="rate">
                                            Rating Questions
                                        </Option>
                                        <Option value="abcd">
                                            Multiple Choice
                                        </Option>
                                    </Select>
                                </div>

                                {filteredQuestions.length === 0 ? (
                                    <Empty
                                        description="No questions found"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ) : (
                                    <Table
                                        columns={questionColumns}
                                        dataSource={filteredQuestions}
                                        rowKey="id"
                                        pagination={false}
                                        scroll={{ y: 400 }}
                                        size="small"
                                    />
                                )}
                            </Card>
                        </div>

                        {/* Right Side - Quiz Builder */}
                        <div className="quiz-builder-panel">
                            <Card
                                title="Quiz Builder"
                                className="quiz-builder-card"
                                extra={
                                    <Space>
                                        <Text strong>Display Order</Text>
                                        <Text type="secondary">
                                            Drag to reorder
                                        </Text>
                                    </Space>
                                }
                            >
                                {quizQuestions.length === 0 ? (
                                    <Empty
                                        description="No questions added to quiz"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                ) : (
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Droppable droppableId="quiz-questions">
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="quiz-questions-list"
                                                >
                                                    {quizQuestions.map(
                                                        (question, index) => (
                                                            <Draggable
                                                                key={
                                                                    question.id
                                                                }
                                                                draggableId={question.id.toString()}
                                                                index={index}
                                                            >
                                                                {(
                                                                    provided,
                                                                    snapshot
                                                                ) => (
                                                                    <div
                                                                        ref={
                                                                            provided.innerRef
                                                                        }
                                                                        {...provided.draggableProps}
                                                                        className={`quiz-question-item ${
                                                                            snapshot.isDragging
                                                                                ? "dragging"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <div
                                                                            className="question-drag-handle"
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <MenuOutlined />
                                                                        </div>
                                                                        <div className="question-content">
                                                                            <div className="question-header">
                                                                                <Space>
                                                                                    <Tag
                                                                                        color={
                                                                                            question.type ===
                                                                                            "rate"
                                                                                                ? "blue"
                                                                                                : "green"
                                                                                        }
                                                                                    >
                                                                                        {question.type ===
                                                                                        "rate"
                                                                                            ? "Rating"
                                                                                            : "Multiple Choice"}
                                                                                    </Tag>
                                                                                    <Text
                                                                                        strong
                                                                                    >
                                                                                        #
                                                                                        {index +
                                                                                            1}
                                                                                    </Text>
                                                                                    {question.required && (
                                                                                        <Tag color="red">
                                                                                            Required
                                                                                        </Tag>
                                                                                    )}
                                                                                </Space>
                                                                                <Button
                                                                                    type="text"
                                                                                    danger
                                                                                    icon={
                                                                                        <DeleteOutlined />
                                                                                    }
                                                                                    onClick={() =>
                                                                                        removeQuestionFromQuiz(
                                                                                            question.id
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <Text
                                                                                type="secondary"
                                                                                style={{
                                                                                    display:
                                                                                        "block",
                                                                                    marginTop: 4,
                                                                                }}
                                                                            >
                                                                                {
                                                                                    question.description
                                                                                }
                                                                            </Text>
                                                                            )}
                                                                            {question.type ===
                                                                                "abcd" &&
                                                                                question.choices && (
                                                                                    <div className="choices-preview">
                                                                                        <Text
                                                                                            type="secondary"
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    "12px",
                                                                                                marginTop: 8,
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                question
                                                                                                    .choices
                                                                                                    .length
                                                                                            }{" "}
                                                                                            options
                                                                                            with
                                                                                            images
                                                                                        </Text>
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    )}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                )}
                            </Card>
                        </div>
                    </div>
                </Drawer>

                {/* Add/Edit Question Modal */}
                <Modal
                    title={
                        editingQuestion ? "Edit Question" : "Add New Question"
                    }
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={800}
                    className="question-modal"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="question-form"
                    >
                        <div className="form-sections">
                            {/* Basic Information */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3>Question Details</h3>
                                    <div className="section-divider"></div>
                                </div>
                                <div className="section-content">
                                    <Form.Item
                                        name="type"
                                        label="Question Type"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select question type",
                                            },
                                        ]}
                                    >
                                        <Radio.Group>
                                            <Space direction="vertical">
                                                {questionTypes.map((type) => (
                                                    <Radio
                                                        key={type.value}
                                                        value={type.value}
                                                    >
                                                        <Space>
                                                            {type.icon}
                                                            {type.label}
                                                        </Space>
                                                    </Radio>
                                                ))}
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>

                                    <Form.Item
                                        name="question"
                                        label="Question Text"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter question text",
                                            },
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Enter your question here..."
                                            className="form-textarea"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="description"
                                        label="Description (Optional)"
                                    >
                                        <Input.TextArea
                                            rows={2}
                                            placeholder="Additional context or instructions for this question..."
                                            className="form-textarea"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="required"
                                        label="Required"
                                        valuePropName="checked"
                                    >
                                        <Switch
                                            checkedChildren="Required"
                                            unCheckedChildren="Optional"
                                        />
                                    </Form.Item>
                                </div>
                            </div>

                            {/* Choices Section (Only for ABCD type) */}
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) =>
                                    prevValues.type !== currentValues.type
                                }
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue("type") === "abcd" && (
                                        <div className="form-section">
                                            <div className="section-header">
                                                <h3>Multiple Choice Options</h3>
                                                <div className="section-divider"></div>
                                            </div>
                                            <div className="section-content">
                                                <Form.List name="choices">
                                                    {(
                                                        fields,
                                                        { add, remove }
                                                    ) => (
                                                        <>
                                                            {fields.map(
                                                                (
                                                                    field,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            field.key
                                                                        }
                                                                        className="choice-item"
                                                                    >
                                                                        <Row
                                                                            gutter={
                                                                                16
                                                                            }
                                                                            align="middle"
                                                                        >
                                                                            <Col
                                                                                span={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <div className="choice-letter">
                                                                                    {String.fromCharCode(
                                                                                        65 +
                                                                                            index
                                                                                    )}
                                                                                </div>
                                                                            </Col>
                                                                            <Col
                                                                                span={
                                                                                    10
                                                                                }
                                                                            >
                                                                                <Form.Item
                                                                                    {...field}
                                                                                    name={[
                                                                                        field.name,
                                                                                        "image",
                                                                                    ]}
                                                                                    fieldKey={[
                                                                                        field.fieldKey,
                                                                                        "image",
                                                                                    ]}
                                                                                    label="Option Image"
                                                                                >
                                                                                    <Upload
                                                                                        listType="picture-card"
                                                                                        beforeUpload={() =>
                                                                                            false
                                                                                        }
                                                                                        maxCount={
                                                                                            1
                                                                                        }
                                                                                    >
                                                                                        <div>
                                                                                            <PictureOutlined />
                                                                                            <div
                                                                                                style={{
                                                                                                    marginTop: 8,
                                                                                                }}
                                                                                            >
                                                                                                Upload
                                                                                            </div>
                                                                                        </div>
                                                                                    </Upload>
                                                                                </Form.Item>
                                                                            </Col>
                                                                            <Col
                                                                                span={
                                                                                    10
                                                                                }
                                                                            >
                                                                                <Form.Item
                                                                                    {...field}
                                                                                    name={[
                                                                                        field.name,
                                                                                        "interpretation",
                                                                                    ]}
                                                                                    fieldKey={[
                                                                                        field.fieldKey,
                                                                                        "interpretation",
                                                                                    ]}
                                                                                    label="Interpretation Text"
                                                                                    rules={[
                                                                                        {
                                                                                            required: true,
                                                                                            message:
                                                                                                "Please enter interpretation text",
                                                                                        },
                                                                                    ]}
                                                                                >
                                                                                    <Input.TextArea
                                                                                        rows={
                                                                                            2
                                                                                        }
                                                                                        placeholder="Enter what this choice represents..."
                                                                                    />
                                                                                </Form.Item>
                                                                            </Col>
                                                                            <Col
                                                                                span={
                                                                                    2
                                                                                }
                                                                            >
                                                                                {fields.length >
                                                                                    2 && (
                                                                                    <Button
                                                                                        type="text"
                                                                                        danger
                                                                                        icon={
                                                                                            <DeleteOutlined />
                                                                                        }
                                                                                        onClick={() =>
                                                                                            remove(
                                                                                                field.name
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                )
                                                            )}
                                                            <Form.Item>
                                                                <Button
                                                                    type="dashed"
                                                                    onClick={() =>
                                                                        add()
                                                                    }
                                                                    icon={
                                                                        <PlusOutlined />
                                                                    }
                                                                    block
                                                                    disabled={
                                                                        fields.length >=
                                                                        4
                                                                    }
                                                                >
                                                                    Add Choice{" "}
                                                                    {
                                                                        fields.length
                                                                    }
                                                                    /4
                                                                </Button>
                                                            </Form.Item>
                                                        </>
                                                    )}
                                                </Form.List>
                                            </div>
                                        </div>
                                    )
                                }
                            </Form.Item>
                        </div>

                        <div className="form-actions">
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingQuestion
                                    ? "Update Question"
                                    : "Add Question"}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </Layout>
    );
};

export default AlumniQuestionsPage;
