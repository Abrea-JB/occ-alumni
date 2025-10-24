import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Divider,
    DatePicker,
    Select,
    Upload,
    message,
    Typography,
    Card,
    Row,
    Col,
    Space,
    InputNumber,
    Tag,
    Switch,
    Table,
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    LinkOutlined,
    DeleteOutlined,
    BookOutlined,
    EditOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import useClassroomStore from "~/states/classroomState";
import { CLASS_WORK_TYPES } from "~/utils/constant";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

const FormClasswork = () => {
    const { id } = useParams();
    const { setField, formClassroom, term, formType, storeClasswork } =
        useClassroomStore();
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState("");
    const [fileList, setFileList] = useState([]);
    const [links, setLinks] = useState([""]);
    const [activeTab, setActiveTab] = useState("files");
    const [topics, setTopics] = useState([
        { value: "math", label: "Math" },
        { value: "science", label: "Science" },
        { value: "history", label: "History" },
        { value: "english", label: "English" },
    ]);
    const [newTopicInput, setNewTopicInput] = useState("");
    const [publishImmediately, setPublishImmediately] = useState(true);
    const [dueDateTime, setDueDateTime] = useState(null);
    const [rubrics, setRubrics] = useState([]);
    const [editingRubric, setEditingRubric] = useState(null);
    const [rubricModalVisible, setRubricModalVisible] = useState(false);
    const [rubricForm] = Form.useForm();

    const selectedType = CLASS_WORK_TYPES.find((item) => item.key === formType);

    const resetForm = () => {
        form.resetFields();
        setEditorContent("");
        setFileList([]);
        setLinks([""]);
        setNewTopicInput("");
        setDueDateTime(null);
        setPublishImmediately(true);
        setRubrics([]);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            if (!dueDateTime) {
                message.error("Please select due date and time");
                return;
            }

            const response = await storeClasswork({
                ...values,
                class_id: id,
                instructions: editorContent,
                attachments: fileList,
                links: links.filter((link) => link.trim() !== ""),
                fileList,
                due_date: dueDateTime.format("YYYY-MM-DD HH:mm:ss"),
                is_published: publishImmediately,
                rubrics: rubrics,
            });

            if (response.error) {
                throw new Error(response.message);
            }

            message.success(
                `${selectedType?.value || "Classwork"} created successfully!`
            );
            setField("formClassroom", false);
            resetForm();
        } catch (error) {
            console.error("Error:", error);
            message.error(error.message || "Failed to create classwork");
        }
    };

    // Rubric functions
    const handleAddRubric = () => {
        rubricForm.resetFields();
        setEditingRubric(null);
        setRubricModalVisible(true);
    };

    const handleEditRubric = (record) => {
        rubricForm.setFieldsValue(record);
        setEditingRubric(record);
        setRubricModalVisible(true);
    };

    const handleDeleteRubric = (id) => {
        setRubrics(rubrics.filter((rubric) => rubric.id !== id));
    };

    const handleRubricSubmit = () => {
        rubricForm
            .validateFields()
            .then((values) => {
                if (editingRubric) {
                    setRubrics(
                        rubrics.map((rubric) =>
                            rubric.id === editingRubric.id
                                ? { ...values, id: editingRubric.id }
                                : rubric
                        )
                    );
                } else {
                    setRubrics([
                        ...rubrics,
                        {
                            ...values,
                            id: Date.now(), // Using timestamp as temporary ID
                        },
                    ]);
                }
                setRubricModalVisible(false);
                rubricForm.resetFields();
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    const rubricColumns = [
        {
            title: "Criteria",
            dataIndex: "criteria",
            key: "criteria",
        },
        {
            title: "Excellent",
            dataIndex: "excellent",
            key: "excellent",
            render: (text) => (
                <Text style={{ color: "#52c41a", fontWeight: "bold" }}>
                    {text}
                </Text>
            ),
        },
        {
            title: "Good",
            dataIndex: "good",
            key: "good",
            render: (text) => (
                <Text style={{ color: "#1890ff", fontWeight: "bold" }}>
                    {text}
                </Text>
            ),
        },
        {
            title: "Needs Improvement",
            dataIndex: "needsImprovement",
            key: "needsImprovement",
            render: (text) => (
                <Text style={{ color: "#faad14", fontWeight: "bold" }}>
                    {text}
                </Text>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditRubric(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteRubric(record.id)}
                        danger
                    />
                </Space>
            ),
        },
    ];

    // ... (keep all your existing functions like beforeUpload, handleFileRemove, etc.)

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Create {selectedType?.value || ""}
                    </Title>
                    <Tag icon={<BookOutlined />} color="green">
                        {(term || "").toUpperCase()}
                    </Tag>
                </div>
            }
            visible={formClassroom}
            onCancel={() => setField("formClassroom", false)}
            width="90%"
            style={{ top: 20 }}
            footer={[
                <Button
                    key="back"
                    onClick={() => setField("formClassroom", false)}
                >
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Assign
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Row gutter={24}>
                    {/* ... (keep all your existing form fields) */}

                    <Col span={24}>
                        <Divider />
                        <Title level={5}>Rubrics</Title>
                        <Card
                            size="small"
                            extra={
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={handleAddRubric}
                                >
                                    Add Rubric
                                </Button>
                            }
                        >
                            {rubrics.length > 0 ? (
                                <Table
                                    columns={rubricColumns}
                                    dataSource={rubrics}
                                    rowKey="id"
                                    pagination={false}
                                    size="small"
                                />
                            ) : (
                                <Text type="secondary">
                                    No rubrics added yet. Click "Add Rubric" to
                                    create one.
                                </Text>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Form>

            {/* Rubric Modal */}
            <Modal
                title={editingRubric ? "Edit Rubric" : "Add Rubric"}
                visible={rubricModalVisible}
                onOk={handleRubricSubmit}
                onCancel={() => setRubricModalVisible(false)}
                destroyOnClose
            >
                <Form form={rubricForm} layout="vertical">
                    <Form.Item
                        name="criteria"
                        label="Criteria"
                        rules={[
                            {
                                required: true,
                                message: "Please enter criteria",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. Content Quality" />
                    </Form.Item>
                    <Form.Item
                        name="excellent"
                        label="Excellent (4 points)"
                        rules={[
                            {
                                required: true,
                                message: "Please describe excellent performance",
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="e.g. Thorough, well-researched, and insightful content"
                            rows={2}
                        />
                    </Form.Item>
                    <Form.Item
                        name="good"
                        label="Good (3 points)"
                        rules={[
                            {
                                required: true,
                                message: "Please describe good performance",
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="e.g. Solid content with minor gaps"
                            rows={2}
                        />
                    </Form.Item>
                    <Form.Item
                        name="needsImprovement"
                        label="Needs Improvement (1-2 points)"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Please describe needs improvement level",
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="e.g. Lacks depth or has significant issues"
                            rows={2}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};

export default FormClasswork;