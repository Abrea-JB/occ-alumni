import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Table,
    Card,
    Divider,
    Space,
    message,
    Row,
    Col,
    InputNumber,
    Tag,
    Modal
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useQuestionStore from "~/states/questionState";
import { useQuestions, useQuiz } from "~/hooks";
import { useParams } from "react-router-dom";
import useClassroomStore from "~/states/classroomState";

const { Option } = Select;

const QuizManager = () => {
    const { id: classId } = useParams();
    const { page, perPage } = useQuestionStore();
    const { data: questionsData } = useQuestions(page, perPage, classId, "all");
    const { data: quizzes = [] } = useQuiz(classId);
    const { storeQuizes } = useClassroomStore();

    const [form] = Form.useForm();
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [searchParams, setSearchParams] = useState({
        category: "",
        difficulty: "",
        type: "",
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);

    useEffect(() => {
        if (Array.isArray(questionsData?.questions)) {
            setAvailableQuestions(questionsData?.questions);
        }
    }, [questionsData]);

    const questionColumns = [
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            render: (text) => <span>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</span>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={
                    type === "multiple-choice" ? "blue" : 
                    type === "true-false" ? "green" : "purple"
                }>
                    {type === "multiple-choice" ? "MCQ" : 
                     type === "true-false" ? "T/F" : "Fill Blank"}
                </Tag>
            ),
        },
        {
            title: "Difficulty",
            dataIndex: "difficulty",
            key: "difficulty",
            render: (difficulty) => (
                <Tag color={
                    difficulty === "easy" ? "green" : 
                    difficulty === "medium" ? "orange" : "red"
                }>
                    {difficulty}
                </Tag>
            ),
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddQuestion(record)}
                >
                    Add
                </Button>
            ),
        },
    ];

    const selectedQuestionColumns = [
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            render: (text) => <span>{text.length > 50 ? `${text.substring(0, 50)}...` : text}</span>,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={
                    type === "multiple-choice" ? "blue" : 
                    type === "true-false" ? "green" : "purple"
                }>
                    {type === "multiple-choice" ? "MCQ" : 
                     type === "true-false" ? "T/F" : "Fill Blank"}
                </Tag>
            ),
        },
        {
            title: "Points",
            dataIndex: "points",
            key: "points",
            render: (points, record) => (
                <InputNumber
                    min={1}
                    max={10}
                    value={points}
                    onChange={(value) => handlePointsChange(record.id, value)}
                />
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveQuestion(record.id)}
                />
            ),
        },
    ];

    const quizColumns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Time Limit (min)",
            dataIndex: "time_limit",
            key: "time_limit",
        },
        {
            title: "Total Points",
            dataIndex: "total_points",
            key: "total_points",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEditQuiz(record)}
                    />
                    <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteQuiz(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const handleAddQuestion = (question) => {
        if (!selectedQuestions.some((q) => q.id === question.id)) {
            setSelectedQuestions([...selectedQuestions, {
                ...question,
                points: question.points || 1
            }]);
            setAvailableQuestions(availableQuestions.filter((q) => q.id !== question.id));
            message.success("Question added to exam");
        } else {
            message.warning("Question already added");
        }
    };

    const handleRemoveQuestion = (questionId) => {
        const removedQuestion = selectedQuestions.find((q) => q.id === questionId);
        setSelectedQuestions(selectedQuestions.filter((q) => q.id !== questionId));
        setAvailableQuestions([...availableQuestions, removedQuestion]);
        message.success("Question removed from exam");
    };

    const handlePointsChange = (questionId, newPoints) => {
        if (newPoints < 1) {
            message.warning("Points cannot be less than 1");
            return;
        }
        setSelectedQuestions(
            selectedQuestions.map((q) =>
                q.id === questionId ? { ...q, points: newPoints } : q
            )
        );
    };

    const handleSearch = () => {
        let filtered = availableQuestions;

        if (searchParams.category) {
            filtered = filtered.filter((q) =>
                q.category.includes(searchParams.category)
            );
        }

        if (searchParams.difficulty) {
            filtered = filtered.filter(
                (q) => q.difficulty === searchParams.difficulty
            );
        }

        if (searchParams.type) {
            filtered = filtered.filter((q) => q.type === searchParams.type);
        }

        setAvailableQuestions(filtered);
    };

    const handleCreateQuiz = () => {
        setCurrentQuiz(null);
        setSelectedQuestions([]);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditQuiz = (quiz) => {
        setCurrentQuiz(quiz);
        setSelectedQuestions(quiz.questions || []);
        form.setFieldsValue({
            title: quiz.title,
            duration: quiz.time_limit,
        });
        setIsModalVisible(true);
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            // Add your delete API call here
            message.success("Quiz deleted successfully");
        } catch (error) {
            message.error("Failed to delete quiz");
        }
    };

    const handleSubmit = async (values) => {
        try {
            const quizData = {
                ...values,
                class_id: classId,
                time_limit: values.duration,
                questions: selectedQuestions,
                total_points: selectedQuestions.reduce((sum, q) => sum + q.points, 0),
            };

            await storeQuizes(quizData);
            message.success(currentQuiz ? "Quiz updated successfully!" : "Quiz created successfully!");
            setIsModalVisible(false);
        } catch (error) {
            message.error("Failed to save quiz");
        }
    };

    return (
        <div style={{ padding: "24px" }}>
            <Card
                title="Quizzes"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateQuiz}
                    >
                        New Quiz
                    </Button>
                }
            >
                <Table
                    columns={quizColumns}
                    dataSource={quizzes}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </Card>

            <Modal
                title={currentQuiz ? "Edit Quiz" : "Create New Quiz"}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label="Exam Title"
                                rules={[{ required: true, message: "Please enter exam title" }]}
                            >
                                <Input placeholder="Enter exam title" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="duration"
                                label="Duration (minutes)"
                                rules={[{ required: true, message: "Please enter duration" }]}
                            >
                                <InputNumber min={1} max={180} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Exam Questions</Divider>

                    <Card
                        title="Available Questions"
                        extra={
                            <Space>
                                <Select
                                    placeholder="Category"
                                    style={{ width: 120 }}
                                    onChange={(value) =>
                                        setSearchParams({ ...searchParams, category: value })
                                    }
                                    allowClear
                                >
                                    <Option value="React">React</Option>
                                    <Option value="JavaScript">JavaScript</Option>
                                    <Option value="HTML/CSS">HTML/CSS</Option>
                                </Select>
                                <Select
                                    placeholder="Difficulty"
                                    style={{ width: 120 }}
                                    onChange={(value) =>
                                        setSearchParams({ ...searchParams, difficulty: value })
                                    }
                                    allowClear
                                >
                                    <Option value="easy">Easy</Option>
                                    <Option value="medium">Medium</Option>
                                    <Option value="hard">Hard</Option>
                                </Select>
                                <Select
                                    placeholder="Type"
                                    style={{ width: 120 }}
                                    onChange={(value) =>
                                        setSearchParams({ ...searchParams, type: value })
                                    }
                                    allowClear
                                >
                                    <Option value="multiple-choice">Multiple Choice</Option>
                                    <Option value="true-false">True/False</Option>
                                    <Option value="fill-blanks">Fill Blanks</Option>
                                </Select>
                                <Button type="primary" onClick={handleSearch}>
                                    Search
                                </Button>
                            </Space>
                        }
                    >
                        <Table
                            columns={questionColumns}
                            dataSource={availableQuestions}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            size="small"
                        />
                    </Card>

                    <Card title="Selected Questions" style={{ marginTop: 16 }}>
                        <Table
                            columns={selectedQuestionColumns}
                            dataSource={selectedQuestions}
                            rowKey="id"
                            pagination={false}
                            footer={() => (
                                <div style={{ textAlign: "right", fontWeight: "bold" }}>
                                    Total Questions: {selectedQuestions.length} | 
                                    Total Points: {selectedQuestions.reduce((sum, q) => sum + q.points, 0)}
                                </div>
                            )}
                        />
                    </Card>

                    <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={selectedQuestions.length === 0}
                            >
                                {currentQuiz ? "Update Quiz" : "Create Quiz"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default QuizManager;