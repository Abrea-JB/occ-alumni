import React, { useState, useEffect } from "react";
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
} from "antd";
import {
    PlusOutlined,
    UploadOutlined,
    LinkOutlined,
    DeleteOutlined,
    BookOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";
import useClassroomStore from "~/states/classroomState";
import { CLASS_WORK_TYPES } from "~/utils/constant";
import { useParams } from "react-router-dom";
import useTopics from "~/hooks/useTopics";
import { useLoadingStore } from "~/states/loadingState";
import { useQueryClient } from "react-query";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CLASSWORK_ATTACHMENT } from "~/utils/constant";
import { useQuiz } from "~/hooks";

dayjs.extend(customParseFormat);

const { Title, Text } = Typography;
const { Option } = Select;

const FormClasswork = () => {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const { data: quizzes = [] } = useQuiz(id);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const {
        setField,
        formClassroom,
        term,
        formType,
        storeClasswork,
        addTopicClasswork,
        editClasswork,
    } = useClassroomStore();
    const {
        isLoading,
        data: topics,
        refetch: refetchTopics,
        isFetching,
    } = useTopics(id);
    const { showLoading, hideLoading } = useLoadingStore();

    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState("");
    const [fileList, setFileList] = useState([]);
    const [links, setLinks] = useState([{ link: "" }]);
    const [activeTab, setActiveTab] = useState("files");

    const [newTopicInput, setNewTopicInput] = useState("");
    const [publishImmediately, setPublishImmediately] = useState(true);
    const [dueDateTime, setDueDateTime] = useState(null);
    const [closeAfterDueDate, setCloseAfterDueDate] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [selectValue, setSelectValue] = useState(null);

    const selectedType = CLASS_WORK_TYPES.find((item) => item.key === formType);

    useEffect(() => {
        if (!dueDateTime && closeAfterDueDate) {
            setCloseAfterDueDate(false);
        }
    }, [dueDateTime, closeAfterDueDate]);

    useEffect(() => {
        if (editClasswork) {
            form.setFieldsValue({
                title: editClasswork.title,
                topic: editClasswork.topic_id,
                points: editClasswork.points_possible,
                due_date: editClasswork.due_date
                    ? dayjs(editClasswork.due_date, "YYYY-MM-DD HH:mm")
                    : "",
            });
            setDueDateTime(
                editClasswork.due_date
                    ? dayjs(editClasswork.due_date, "YYYY-MM-DD HH:mm")
                    : ""
            );
            setEditorContent(editClasswork.instructions);
            setCloseAfterDueDate(
                editClasswork?.close_after_due_date === 1 ? true : false
            );
            const attachments = editClasswork?.attachment || [];
            const links = editClasswork?.links || [];

            const formattedAttachments = attachments.map((item, index) => ({
                uid: `${item?.id}`, // unique id as string
                name: item.file_link, // file name
                status: "done", // mark as uploaded
                url: CLASSWORK_ATTACHMENT + item.file_link, // download URL
            }));

            const formattedLinks = links.map((item, index) => ({
                link: item?.link,
            }));
            setPublishImmediately(
                editClasswork?.published === 1 ? true : false
            );

            setLinks(formattedLinks);
            setFileList(formattedAttachments);
        }
    }, [editClasswork]);

    const resetForm = () => {
        form.resetFields();
        setEditorContent("");
        setFileList([]);
        setLinks([{ link: "" }]);
        setNewTopicInput("");
        setDueDateTime(null);
        setPublishImmediately(true);
        setCloseAfterDueDate(false);
    };

    const submitForm = async () => {
        showLoading("Processing data...");
        setSubmit(true);
        const values = await form.validateFields();
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

        const files = fileList.filter((item) => item instanceof File);
        const nonFiles = fileList.filter((item) => !(item instanceof File));
        const response = await storeClasswork({
            ...values,
            classworkId: editClasswork?.id || null,
            class_id: id,
            instructions: editorContent,
            attachments: files,
            nonFiles: nonFiles,
            selectValue,
            links:
                Array.isArray(links) &&
                links.length > 0 &&
                links.filter(
                    (item) =>
                        item?.link &&
                        typeof item.link === "string" &&
                        item.link.trim() !== ""
                ),
            fileList,
            due_date: dueDateTime
                ? dueDateTime.format("YYYY-MM-DD HH:mm:ss")
                : null,
            is_published: publishImmediately,
            close_after_due_date: closeAfterDueDate,
            term: formType,
        });

        if (response.error) {
            setSubmit(false);
            throw new Error(response.message);
        }

        if (response.status === 200) {
            setSubmit(false);
            queryClient.invalidateQueries("classroom-classwork-list");
            queryClient.invalidateQueries("classwork-gradesheet-data");
            message.success(
                `${selectedType?.value || "Classwork"} created successfully!`
            );
            setField("formClassroom", false);
            resetForm();
        }
        setSubmit(false);
        hideLoading();
    };

    const beforeUpload = (file) => {
        const isAllowedType = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type);

        const isLt10MB = file.size / 1024 / 1024 < 10;

        if (!isAllowedType) {
            message.error("You can only upload JPG/PNG/GIF/PDF/Word files!");
            return Upload.LIST_IGNORE;
        }

        if (!isLt10MB) {
            message.error("File must be smaller than 10MB!");
            return Upload.LIST_IGNORE;
        }

        setFileList((prev) => [...prev, file]);
        return false;
    };

    const handleFileRemove = (file) => {
        setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    };

    const addLink = () => {
        setLinks((prevLinks) => [...prevLinks, { link: "" }]);
    };

    const removeLink = (index) => {
        setLinks((prev) => {
            // If only one link remains, keep one empty link object
            if (prev.length <= 1) {
                return [{ url: "" }]; // Consistent object structure
            }
            // Otherwise remove the specified link
            return prev.filter((_, i) => i !== index);
        });
    };

    const updateLink = (index, value) => {
        setLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
    };

    const validateLink = (_, value) => {
        if (!value || value.trim() === "") return Promise.resolve();
        try {
            new URL(value.startsWith("http") ? value : `https://${value}`);
            return Promise.resolve();
        } catch {
            return Promise.reject("Please enter a valid URL");
        }
    };

    const handleAddTopic = async () => {
        const trimmedTopic = newTopicInput.trim();
        if (!trimmedTopic) {
            message.warning("Please enter a topic name");
            return;
        }

        const isDuplicate = topics.some(
            (topic) => topic.name.toLowerCase() === trimmedTopic.toLowerCase()
        );

        if (isDuplicate) {
            message.error(`"${trimmedTopic}" already exists as a topic`);
            return;
        }

        const response = await addTopicClasswork({
            class_id: id,
            topic: trimmedTopic,
        });

        if (response.status === 200) {
            message.success(`"${trimmedTopic}" added as a new topic`);
            refetchTopics();
            setNewTopicInput("");
            setTimeout(() => {
                form.setFieldsValue({
                    topic: {
                        value: response.data.message.id,
                        label: response.data.message.name,
                    },
                });
            }, 1000);
        }
    };

    const editorModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
        ],
    };

    const editorFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block",
        "list",
        "bullet",
        "link",
    ];

    const closeModal = () => {
        if (editClasswork) {
            resetForm();
        }
        setField("editClasswork", null);
        setTimeout(() => {
            setField("formClassroom", false);
        }, 200);
    };

    // Add these functions to your component
    const handleQuizSelect = (quizId) => {
        const quiz = quizzes.find((q) => q.id === quizId);
        setSelectedQuiz(quiz);
        setSelectValue(quizId);
    };

    const handleUpdateQuiz = () => {
        // Implement your quiz update logic here
        console.log("Updating quiz:", selectedQuiz);
        // After update, you might want to:
        // 1. Refresh the quizzes list
        // 2. Clear the selected quiz
        // 3. Show a success message
    };

    const handleRemoveQuiz = () => {
        if (!selectedQuiz) return;

        // Implement your quiz removal logic
        console.log("Removing quiz:", selectedQuiz.id);
        // After successful removal:
        setSelectedQuiz(null);
        setSelectValue(null); // This clears the select input
        // refreshQuizzes(); // If you have a refresh function
    };

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
            onCancel={() => {
                closeModal();
            }}
            width="90%"
            style={{ top: 20 }}
            footer={[
                <Button
                    key="back"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={submit}
                    disabled={submit}
                    onClick={() => form.submit()}
                >
                    {editClasswork ? "Update" : "Assign"}{" "}
                </Button>,
            ]}
        >
            <Form
                onFinish={(params) => submitForm(params)}
                form={form}
                layout="vertical"
                onFinishFailed={() => {
                    message.error("Please check the form and fix errors.");
                }}
            >
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter title",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter title"
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Instructions">
                            <ReactQuill
                                theme="snow"
                                value={editorContent}
                                onChange={setEditorContent}
                                modules={editorModules}
                                formats={editorFormats}
                                placeholder="Add instructions for your students..."
                                style={{
                                    height: "200px",
                                    marginBottom: "50px",
                                }}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Card
                            title="Attachments"
                            size="small"
                            tabList={[
                                { key: "files", tab: "Files" },
                                { key: "links", tab: "Links" },
                                { key: "quiz", tab: "Quiz" },
                            ]}
                            activeTabKey={activeTab}
                            onTabChange={(key) => setActiveTab(key)}
                        >
                            {activeTab === "files" && (
                                <>
                                    <Upload
                                        beforeUpload={beforeUpload}
                                        onRemove={handleFileRemove}
                                        fileList={fileList}
                                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                                        multiple
                                        maxCount={5}
                                    >
                                        <Button icon={<UploadOutlined />}>
                                            Select Files (Max 10MB)
                                        </Button>
                                    </Upload>
                                    <Text
                                        type="secondary"
                                        style={{
                                            display: "block",
                                            marginTop: 8,
                                        }}
                                    >
                                        Allowed: JPG, PNG, GIF, PDF, Word (Max 5
                                        files)
                                    </Text>
                                </>
                            )}

                            {activeTab === "links" && (
                                <Form.Item>
                                    {Array.isArray(links) &&
                                        links.map((item, index) => {
                                            const linkValue = item?.link
                                                ? item?.link
                                                : "";
                                            return (
                                                <Space
                                                    key={index}
                                                    style={{
                                                        display: "flex",
                                                        marginBottom: 8,
                                                    }}
                                                    align="baseline"
                                                >
                                                    <Form.Item
                                                        name={`link-${index}`}
                                                        rules={[
                                                            {
                                                                validator:
                                                                    validateLink,
                                                            },
                                                        ]}
                                                        style={{
                                                            flex: 1,
                                                            width: 300,
                                                        }}
                                                    >
                                                        <Input
                                                            prefix={
                                                                <LinkOutlined />
                                                            }
                                                            placeholder="https://example.com"
                                                            value={linkValue}
                                                            defaultValue={
                                                                linkValue
                                                            }
                                                            onChange={(e) => {
                                                                const newLinks =
                                                                    [...links];
                                                                newLinks[
                                                                    index
                                                                ] = {
                                                                    ...newLinks[
                                                                        index
                                                                    ],
                                                                    link: e
                                                                        .target
                                                                        .value,
                                                                };
                                                                setLinks(
                                                                    newLinks
                                                                );
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    {links.length > 1 && (
                                                        <Button
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            onClick={() =>
                                                                removeLink(
                                                                    index
                                                                )
                                                            }
                                                            danger
                                                        />
                                                    )}
                                                </Space>
                                            );
                                        })}
                                    <Button
                                        type="dashed"
                                        onClick={addLink}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Link
                                    </Button>
                                </Form.Item>
                            )}
                            {activeTab === "quiz" && (
                                <>
                                    <Form.Item label="Select Quiz">
                                        <Select
                                            showSearch
                                            placeholder="Search quizzes..."
                                            optionFilterProp="children"
                                            onChange={handleQuizSelect}
                                            value={selectValue}
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            style={{ width: "100%" }}
                                            allowClear
                                            onClear={() => {
                                                setSelectedQuiz(null);
                                                setSelectValue(null);
                                            }}
                                        >
                                            {quizzes.map((quiz) => (
                                                <Select.Option
                                                    key={quiz.id}
                                                    value={quiz.id}
                                                >
                                                    {quiz.title ||
                                                        `Quiz ${quiz.id}`}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {selectedQuiz && (
                                        <div style={{ marginBottom: 16 }}>
                                            <Space>
                                                <Button
                                                    danger
                                                    onClick={handleRemoveQuiz}
                                                >
                                                    Remove Quiz
                                                </Button>
                                            </Space>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Divider />
                        <Title level={5}>Assignment Details</Title>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="points" label="Points">
                            <InputNumber
                                min={0}
                                max={1000}
                                style={{ width: "100%" }}
                                placeholder="Ungraded"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="due_date" label="Due Date & Time">
                            <DatePicker
                                showTime={{
                                    format: "HH:mm",
                                    minuteStep: 10,
                                    defaultValue: dayjs("06:00", "HH:mm"),
                                }}
                                format="YYYY-MM-DD HH:mm"
                                style={{ width: "100%" }}
                                onChange={setDueDateTime}
                                disabledDate={(current) =>
                                    current && current < dayjs().startOf("day")
                                }
                                disabledTime={() => ({
                                    disabledHours: () => {
                                        const hours = [];
                                        for (let i = 0; i < 24; i++) {
                                            if (i < 6 || i > 22) {
                                                hours.push(i);
                                            }
                                        }
                                        return hours;
                                    },
                                })}
                                placeholder="No due date"
                                allowClear
                                value={dueDateTime}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Close submissions after due date">
                            <Space>
                                <Switch
                                    checked={closeAfterDueDate}
                                    onChange={setCloseAfterDueDate}
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                    disabled={!dueDateTime}
                                />
                                <Text type="secondary">
                                    {closeAfterDueDate
                                        ? "Submissions will be closed automatically"
                                        : dueDateTime
                                        ? "Allow late submissions"
                                        : "Set due date to enable"}
                                </Text>
                            </Space>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item name="topic" label="Topic">
                            <Select
                                placeholder="Select or create topic"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: "8px 0" }} />
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "nowrap",
                                                padding: 8,
                                            }}
                                        >
                                            <Input
                                                style={{ flex: "auto" }}
                                                value={newTopicInput}
                                                onChange={(e) =>
                                                    setNewTopicInput(
                                                        e.target.value
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    e.key === "Enter" &&
                                                    handleAddTopic()
                                                }
                                                placeholder="New topic name"
                                                maxLength={100}
                                                showCount
                                            />
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={handleAddTopic}
                                                disabled={!newTopicInput.trim()}
                                            />
                                        </div>
                                    </>
                                )}
                            >
                                {Array.isArray(topics) &&
                                    topics.map((topic) => (
                                        <Option key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Form.Item label="Publish Immediately">
                            <Space>
                                <Switch
                                    checked={publishImmediately}
                                    onChange={setPublishImmediately}
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                />
                                <Text type="secondary">
                                    {publishImmediately
                                        ? "Visible to students now"
                                        : "Save as draft"}
                                </Text>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default FormClasswork;
