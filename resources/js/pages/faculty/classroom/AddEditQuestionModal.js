import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Space,
    Divider,
    Row,
    Col,
    InputNumber,
    Checkbox,
    Radio,
    message,
} from "antd";
import useTopics from "~/hooks/useTopics";
import useClassroomStore from "~/states/classroomState";
import { useLoadingStore } from "~/states/loadingState";
import { useQueryClient } from "react-query";

const { Option } = Select;
const { TextArea } = Input;

const AddEditQuestionModal = ({
    visible,
    onCancel,
    onSave,
    question,
    isEdit,
    id,
}) => {
    const [form] = Form.useForm();
    const {
        isLoading,
        data: topics,
        refetch: refetchTopics,
        isFetching,
    } = useTopics(id);
    const { showLoading, hideLoading } = useLoadingStore();
    const [submit, setSubmit] = useState(false);
    const queryClient = useQueryClient();
    const { storeQuestion } = useClassroomStore();

    React.useEffect(() => {
        if (question) {
            // Format the question data based on type
            let formattedQuestion = { ...question };

            if (question.type === "multiple-choice") {
                formattedQuestion = {
                    ...formattedQuestion,
                    optionA: question.options?.[0] || "",
                    optionB: question.options?.[1] || "",
                    optionC: question.options?.[2] || "",
                    optionD: question.options?.[3] || "",
                    correctOption:
                        question.options?.indexOf(question.correctAnswer) >= 0
                            ? ["A", "B", "C", "D"][
                                  question.options.indexOf(
                                      question.correctAnswer
                                  )
                              ]
                            : undefined,
                };
            } else if (question.type === "true-false") {
                formattedQuestion = {
                    ...formattedQuestion,
                    correctAnswer: question.correctAnswer?.toString() || "true",
                };
            } else if (question.type === "fill-blanks") {
                formattedQuestion = {
                    ...formattedQuestion,
                    blanks: question.blanks || [],
                };
            }

            form.setFieldsValue(formattedQuestion);
        } else {
            form.resetFields();
        }
    }, [question, form]);

    const onFinish = (values) => {
        showLoading("Processing data...");
        setSubmit(true);
        let processedValues = { ...values };

        switch (values.type) {
            case "multiple-choice":
                processedValues = {
                    ...processedValues,
                    options: [
                        values.optionA,
                        values.optionB,
                        values.optionC,
                        values.optionD,
                    ].filter((opt) => opt && opt.trim() !== ""),
                    correctAnswer: values[`option${values.correctOption}`],
                };
                break;

            case "true-false":
                processedValues = {
                    ...processedValues,
                    correctAnswer: values.correctAnswer === "true",
                };
                break;

            case "fill-blanks":
                processedValues = {
                    ...processedValues,
                    correctAnswer: values.blanks.join("|"), // Join blanks with delimiter
                };
                break;

            default:
                // For short answer and others
                processedValues = {
                    ...processedValues,
                    correctAnswer: values.correctAnswer,
                };
        }

        handleSave(processedValues);
    };

    const handleSave = async (values) => {
        values.id = id;
        let topicId = null;
        if (
            values.topic &&
            typeof values.topic === "object" &&
            "value" in values.topic
        ) {
            topicId = values.topic.value;
        } else {
            topicId = values.topic;
        }
        values.topic = topicId;
        const response = await storeQuestion(values);
        if (response.error) {
            throw new Error(response.message);
        }
        if (response.status === 200) {
            queryClient.invalidateQueries("questions");
            message.success(`Question created successfully!`);
            form.resetFields();
        }
        setSubmit(false);
    };

    return (
        <Modal
            title={isEdit ? "Edit Question" : "Add New Question"}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    type: "multiple-choice",
                    difficulty: "medium",
                }}
            >
                <Form.Item
                    name="question"
                    label="Question Text"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the question",
                        },
                    ]}
                >
                    <TextArea rows={3} placeholder="Enter the question text" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Question Type"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="multiple-choice">
                            Multiple Choice (ABCD)
                        </Option>
                        <Option value="true-false">True/False</Option>
                        <Option value="fill-blanks">Fill in the Blanks</Option>
                        <Option value="short-answer">Short Answer</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                        prevValues.type !== currentValues.type
                    }
                >
                    {({ getFieldValue }) => {
                        const type = getFieldValue("type");
                        const questionText = getFieldValue("question") || "";

                        if (type === "multiple-choice") {
                            return (
                                <>
                                    <Divider orientation="left">
                                        Multiple Choice Options
                                    </Divider>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="optionA"
                                                label="Option A"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter Option A",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter option A" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="optionB"
                                                label="Option B"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter Option B",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter option B" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="optionC"
                                                label="Option C"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter Option C",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter option C (optional)" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="optionD"
                                                label="Option D"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Please enter Option D",
                                                    },
                                                ]}
                                            >
                                                <Input placeholder="Enter option D (optional)" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        name="correctOption"
                                        label="Correct Option"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please select the correct option",
                                            },
                                        ]}
                                    >
                                        <Select placeholder="Select correct option">
                                            <Option value="A">Option A</Option>
                                            <Option value="B">Option B</Option>
                                            <Option value="C">Option C</Option>
                                            <Option value="D">Option D</Option>
                                        </Select>
                                    </Form.Item>
                                </>
                            );
                        }

                        if (type === "true-false") {
                            return (
                                <Form.Item
                                    name="correctAnswer"
                                    label="Correct Answer"
                                    rules={[{ required: true }]}
                                >
                                    <Radio.Group>
                                        <Radio value="true">True</Radio>
                                        <Radio value="false">False</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            );
                        }

                        if (type === "fill-blanks") {
                            // Count the number of blanks in the question text
                            const blankCount = (
                                questionText.match(/_{3,}/g) || []
                            ).length;
                            const blanks = Array(blankCount).fill("");

                            return (
                                <>
                                    <Divider orientation="left">
                                        Blank Answers
                                    </Divider>
                                    <p>
                                        Enter the correct answers for each blank
                                        (___) in order:
                                    </p>
                                    <Form.List
                                        name="blanks"
                                        initialValue={blanks}
                                    >
                                        {(fields) => (
                                            <>
                                                {fields.map((field, index) => (
                                                    <Form.Item
                                                        {...field}
                                                        label={`Blank ${
                                                            index + 1
                                                        }`}
                                                        key={field.key}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: `Please enter answer for blank ${
                                                                    index + 1
                                                                }`,
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            placeholder={`Answer for blank ${
                                                                index + 1
                                                            }`}
                                                        />
                                                    </Form.Item>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </>
                            );
                        }

                        return (
                            <Form.Item
                                name="correctAnswer"
                                label="Correct Answer"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please enter the correct answer",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter the correct answer" />
                            </Form.Item>
                        );
                    }}
                </Form.Item>

                <Divider />

                <Form.Item
                    name="difficulty"
                    label="Difficulty Level"
                    rules={[{ required: true }]}
                >
                    <Select>
                        <Option value="easy">Easy</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="hard">Hard</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="topic"
                    label="Topic"
                    rules={[
                        {
                            required: true,
                            message: "Please select a topic",
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a topic"
                        rules={[
                            {
                                required: true,
                                message: "Please select a topic",
                            },
                        ]}
                    >
                        {Array.isArray(topics) &&
                            topics.map((topic) => (
                                <Option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>

                <Form.Item name="points" label="Points" initialValue={1}>
                    <InputNumber min={1} max={10} />
                </Form.Item>

                <Form.Item name="explanation" label="Explanation (Optional)">
                    <TextArea
                        rows={2}
                        placeholder="Explanation for the correct answer"
                    />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button
                            loading={submit}
                            disabled={submit}
                            type="primary"
                            htmlType="submit"
                        >
                            {isEdit ? "Update Question" : "Add Question"}
                        </Button>
                        <Button onClick={onCancel}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditQuestionModal;
