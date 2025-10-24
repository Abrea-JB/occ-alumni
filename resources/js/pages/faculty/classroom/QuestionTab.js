import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Card,
    Tag,
    Space,
    message,
    Descriptions,
    List,
    Divider,
    Pagination,
} from "antd";
import {
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import AddEditQuestionModal from "./AddEditQuestionModal";
import { useParams } from "react-router-dom";
import useQuestionStore from "~/states/questionState";
import { useQuestions } from "~/hooks";

const QuestionTab = () => {
    const { id } = useParams();
    const { page, perPage, setPage, setField } = useQuestionStore();

    const { isLoading, data, isFetching } = useQuestions(page, perPage, id);

    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Question",
            dataIndex: "question",
            key: "question",
            ellipsis: true,
            render: (text, record) => (
                <span style={{ fontWeight: 500 }}>
                    {text.length > 50 ? `${text.substring(0, 50)}...` : text}
                    {record.type === "fill-blanks" && (
                        <Tag style={{ marginLeft: 8 }}>Fill Blanks</Tag>
                    )}
                </span>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
            render: (type) => {
                let color = "blue";
                if (type === "true-false") color = "green";
                if (type === "fill-blanks") color = "purple";
                return (
                    <Tag color={color}>
                        {type === "multiple-choice"
                            ? "Multiple Choice"
                            : type === "true-false"
                            ? "True/False"
                            : "Fill Blanks"}
                    </Tag>
                );
            },
        },
        {
            title: "Difficulty",
            dataIndex: "difficulty",
            key: "difficulty",
            width: 120,
            render: (difficulty) => {
                let color = "";
                switch (difficulty) {
                    case "easy":
                        color = "green";
                        break;
                    case "medium":
                        color = "orange";
                        break;
                    case "hard":
                        color = "red";
                        break;
                    default:
                        color = "gray";
                }
                return <Tag color={color}>{difficulty.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Topic",
            dataIndex: "topic",
            key: "topic",
            width: 150,
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setCurrentQuestion(null);
        setIsAddModalVisible(true);
    };

    const handleView = (question) => {
        setCurrentQuestion(question);
        setIsViewModalVisible(true);
    };

    const handleEdit = (question) => {
        setCurrentQuestion(question);
        setIsEditModalVisible(true);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Delete Question",
            content: "Are you sure you want to delete this question?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                setQuestions(questions.filter((q) => q.id !== id));
                message.success("Question deleted successfully");
            },
        });
    };

    const handleSave = (values) => {
        if (currentQuestion) {
            // Edit existing question
            setQuestions(
                questions.map((q) =>
                    q.id === currentQuestion.id ? { ...q, ...values } : q
                )
            );
            message.success("Question updated successfully");
        } else {
            // Add new question
            const newQuestion = {
                ...values,
                id: Math.max(...questions.map((q) => q.id)) + 1,
            };
            setQuestions([...questions, newQuestion]);
            message.success("Question added successfully");
        }
        setIsAddModalVisible(false);
        setIsEditModalVisible(false);
    };

    const renderQuestionDetails = (question) => {
        switch (question.type) {
            case "multiple-choice":
                return (
                    <>
                        <Descriptions.Item label="Options">
                            <List
                                size="small"
                                dataSource={question.options.map((opt, i) => ({
                                    letter: String.fromCharCode(65 + i),
                                    text: opt,
                                    isCorrect: opt === question.correctAnswer,
                                }))}
                                renderItem={(item) => (
                                    <List.Item>
                                        <strong>{item.letter}:</strong>{" "}
                                        {item.text}
                                        {item.isCorrect && (
                                            <Tag
                                                color="green"
                                                style={{ marginLeft: 8 }}
                                            >
                                                Correct
                                            </Tag>
                                        )}
                                    </List.Item>
                                )}
                            />
                        </Descriptions.Item>
                    </>
                );
            case "true-false":
                return (
                    <Descriptions.Item label="Correct Answer">
                        <Tag color={question.correctAnswer ? "green" : "red"}>
                            {question.correctAnswer ? "TRUE" : "FALSE"}
                        </Tag>
                    </Descriptions.Item>
                );
            case "fill-blanks":
                const blankAnswers = question.correctAnswer.split("|");
                const questionParts = question.question.split("___");

                return (
                    <>
                        <Descriptions.Item label="Question with Blanks">
                            <div style={{ whiteSpace: "pre-wrap" }}>
                                {questionParts.map((part, i) => (
                                    <span key={i}>
                                        {part}
                                        {i < questionParts.length - 1 && (
                                            <span
                                                style={{
                                                    backgroundColor: "#f6ffed",
                                                    padding: "0 4px",
                                                }}
                                            >
                                                {blankAnswers[i] || "______"}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Blank Answers">
                            <List
                                size="small"
                                dataSource={blankAnswers}
                                renderItem={(answer, index) => (
                                    <List.Item>
                                        <strong>Blank {index + 1}:</strong>{" "}
                                        {answer}
                                    </List.Item>
                                )}
                            />
                        </Descriptions.Item>
                    </>
                );
            default:
                return (
                    <Descriptions.Item label="Correct Answer">
                        {question.correctAnswer}
                    </Descriptions.Item>
                );
        }
    };


    const onShowSizeChange = (current, pageSize) => {};

    const onChange = (page, pageSize) => {
        setPage(page - 1);
    };

    
    const question_list =
        !isLoading && Array.isArray(data?.questions)
            ? data.questions.map((item, index) => {
                  let parsedOptions = [];

                  try {
                      parsedOptions =
                          typeof item?.options === "string"
                              ? JSON.parse(item.options)
                              : item?.options || [];
                  } catch (e) {
                      parsedOptions = [];
                      console.error("Failed to parse options:", e);
                  }

                  return {
                      key: index,
                      id: item?.id || "",
                      question: item?.question || "",
                      questionType: item?.type || "",
                      difficulty: item?.difficulty || "",
                      options: parsedOptions,
                      correctAnswer: item?.correct_answer || "",
                      explanation: item?.explanation || "",
                      type: item?.type || "",
                      topic: item?.topic_id || "",
                  };
              })
            : [];

    return (
        <div className="quiz-list-container">
            <Card
                title="Quiz Questions"
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Add Question
                    </Button>
                }
            >
                <div className="table-responsive">
                    <Table
                        loading={isFetching}
                        pagination={false}
                        columns={columns}
                        dataSource={question_list}
                        className="ant-border-space"
                    />
                </div>
                <div className="pagination-table shadow-none">
                    {!isLoading && (
                        <Pagination
                            defaultCurrent={page + 1}
                            total={data?.total || 0}
                            pageSize={perPage}
                            showSizeChanger={false}
                            onShowSizeChange={onShowSizeChange}
                            onChange={onChange}
                            className="mt-5"
                        />
                    )}
                </div>
            </Card>

            <AddEditQuestionModal
                visible={isAddModalVisible || isEditModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    setIsEditModalVisible(false);
                }}
                onSave={handleSave}
                question={currentQuestion}
                isEdit={isEditModalVisible}
                id={id}
            />

            <Modal
                title="Question Details"
                visible={isViewModalVisible}
                onCancel={() => setIsViewModalVisible(false)}
                footer={null}
                width={700}
            >
                {currentQuestion && (
                    <>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Question">
                                {currentQuestion.question}
                            </Descriptions.Item>
                            <Descriptions.Item label="Type">
                                <Tag
                                    color={
                                        currentQuestion.type ===
                                        "multiple-choice"
                                            ? "blue"
                                            : currentQuestion.type ===
                                              "true-false"
                                            ? "green"
                                            : "purple"
                                    }
                                >
                                    {currentQuestion.type === "multiple-choice"
                                        ? "Multiple Choice"
                                        : currentQuestion.type === "true-false"
                                        ? "True/False"
                                        : "Fill in the Blanks"}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Difficulty">
                                <Tag
                                    color={
                                        currentQuestion.difficulty === "easy"
                                            ? "green"
                                            : currentQuestion.difficulty ===
                                              "medium"
                                            ? "orange"
                                            : "red"
                                    }
                                >
                                    {currentQuestion.difficulty.toUpperCase()}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Category">
                                {currentQuestion.category}
                            </Descriptions.Item>
                            {renderQuestionDetails(currentQuestion)}
                        </Descriptions>

                        {currentQuestion.explanation && (
                            <>
                                <Divider orientation="left">
                                    Explanation
                                </Divider>
                                <div style={{ padding: "0 16px" }}>
                                    {currentQuestion.explanation}
                                </div>
                            </>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
};

export default QuestionTab;
