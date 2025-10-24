import React, { useState } from "react";
import {
    Button,
    Dropdown,
    Menu,
    Radio,
    Divider,
    Typography,
    Tag,
    Space,
    List,
    Collapse,
    Select
} from "antd";
import {
    PlusOutlined,
    DownOutlined,
    UpOutlined,
    CalendarOutlined,
    FileOutlined,
    LinkOutlined,
    ClockCircleOutlined,
    BookOutlined,
    StarOutlined,
} from "@ant-design/icons";
import FormClasswork from "./FormClasswork";
import useClassroomStore from "~/states/classroomState";
import { CLASS_WORK_TYPES } from "~/utils/constant";

import {
    DragDropContext,
    Droppable,
    Draggable
} from "react-beautiful-dnd";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const ClassworkTab = () => {
    const { setField } = useClassroomStore();
    const [selectedTerm, setSelectedTerm] = useState("midterm");
    const [activePanels, setActivePanels] = useState([]);
    const [assignments, setAssignments] = useState([
        {
            id: "1",
            title: "Algebraic Equations Homework",
            instructions: `<p>Complete the following algebraic equations from Chapter 3. Show all your work step by step.</p>
                          <ol>
                            <li>Solve for x: 2x + 5 = 15</li>
                            <li>Factor the quadratic: x² - 5x + 6</li>
                            <li>Graph the equation: y = 2x + 3</li>
                          </ol>
                          <p>Submit your work as a PDF document.</p>`,
            points: 100,
            dueDate: "2023-06-15",
            dueTime: "23:59",
            topic: "math",
            attachments: [
                { name: "textbook-chapter3.pdf", type: "pdf" },
                { name: "example-problems.docx", type: "word" },
            ],
            links: [
                "https://example.com/algebra-tutorial",
                "https://example.com/quadratic-equations-guide",
            ],
            createdAt: "2023-06-01T10:30:00Z",
            status: "published"
        },
        {
            id: "2",
            title: "History Research Paper",
            instructions: `<p>Write a 5-page research paper on the Industrial Revolution.</p>
                          <p>Include at least 3 primary sources and 5 secondary sources.</p>
                          <p>Format should be in Chicago style.</p>`,
            points: 200,
            dueDate: "2023-07-10",
            dueTime: "23:59",
            topic: "history",
            attachments: [
                { name: "research-guidelines.pdf", type: "pdf" },
            ],
            links: [
                "https://example.com/chicago-style-guide",
                "https://example.com/industrial-revolution-sources"
            ],
            createdAt: "2023-06-15T09:15:00Z",
            status: "draft"
        },
        {
            id: "3",
            title: "Science Lab Report",
            instructions: `<p>Complete the lab experiment on chemical reactions and submit a detailed report.</p>
                          <p>Include your hypothesis, materials, procedure, observations, and conclusions.</p>`,
            points: 150,
            dueDate: "2023-06-20",
            dueTime: "23:59",
            topic: "science",
            attachments: [
                { name: "lab-instructions.pdf", type: "pdf" },
                { name: "report-template.docx", type: "word" }
            ],
            links: [],
            createdAt: "2023-06-05T14:20:00Z",
            status: "published"
        }
    ]);

    const handleTermChange = (e) => {
        setSelectedTerm(e.target.value);
    };

    const handleSortChange = (value) => {
        // optional: re-add sorting logic if you want to toggle between manual and automatic
    };

    const formatDueDate = (dueDate, dueTime) => `${dueDate} at ${dueTime}`;

    const getFileIcon = (type) => {
        switch (type) {
            case "pdf":
                return <FileOutlined style={{ color: "#ff4d4f" }} />;
            case "word":
                return <FileOutlined style={{ color: "#1890ff" }} />;
            default:
                return <FileOutlined />;
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case "published":
                return <Tag color="green">Published</Tag>;
            case "draft":
                return <Tag color="orange">Draft</Tag>;
            default:
                return <Tag>Unknown</Tag>;
        }
    };

    const handleActivitySelect = (type) => {
        setField("formClassroom", true);
        setField("formType", type);
        setField("term", selectedTerm);
    };

    const handlePanelChange = (keys) => {
        setActivePanels(keys);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(assignments);
        const [movedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, movedItem);
        setAssignments(items);
    };

    const menu = (
        <Menu>
            <Menu.ItemGroup title={<Text strong>Select Term</Text>}>
                <Menu.Item key="term-selection" disabled>
                    <Radio.Group
                        value={selectedTerm}
                        onChange={handleTermChange}
                        style={{ marginLeft: 8 }}
                    >
                        <Radio value="midterm">Midterm</Radio>
                        <Radio value="final">Final</Radio>
                    </Radio.Group>
                </Menu.Item>
            </Menu.ItemGroup>

            <Divider style={{ margin: "4px 0" }} />

            <Menu.ItemGroup title={<Text strong>Activity Type</Text>}>
                {CLASS_WORK_TYPES.filter(
                    (item) => !item.term || item.term === selectedTerm
                ).map((item) => (
                    <Menu.Item
                        key={item.key}
                        onClick={() => handleActivitySelect(item.key)}
                    >
                        {item.value}
                    </Menu.Item>
                ))}
            </Menu.ItemGroup>
        </Menu>
    );

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Dropdown overlay={menu} trigger={["click"]}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Create
                    </Button>
                </Dropdown>
                <Space>
                    <Text strong>{assignments.length} Assignments</Text>
                </Space>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="assignments">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {assignments.map((assignment, index) => (
                                <Draggable key={assignment.id} draggableId={assignment.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                marginBottom: 12,
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <Collapse
                                                activeKey={activePanels}
                                                onChange={handlePanelChange}
                                                expandIconPosition="right"
                                                expandIcon={({ isActive }) =>
                                                    isActive ? <UpOutlined /> : <DownOutlined />
                                                }
                                            >
                                                <Panel
                                                    key={assignment.id}
                                                    header={
                                                        <Space>
                                                            <Text strong>{assignment.title}</Text>
                                                            {getStatusTag(assignment.status)}
                                                            <Text type="secondary">
                                                                Due: {formatDueDate(assignment.dueDate, assignment.dueTime)}
                                                            </Text>
                                                        </Space>
                                                    }
                                                    extra={
                                                        <Tag icon={<BookOutlined />} color="blue">
                                                            {assignment.topic.toUpperCase()}
                                                        </Tag>
                                                    }
                                                >
                                                    <Space direction="vertical" style={{ width: "100%" }}>
                                                        <Space>
                                                            <Text type="secondary">
                                                                <StarOutlined /> {assignment.points} points
                                                            </Text>
                                                            <Text type="secondary">
                                                                <ClockCircleOutlined /> Posted on{" "}
                                                                {new Date(assignment.createdAt).toLocaleDateString()}
                                                            </Text>
                                                        </Space>

                                                        <div
                                                            style={{
                                                                background: "#fff7e6",
                                                                padding: 12,
                                                                borderRadius: 4,
                                                                marginBottom: 16,
                                                            }}
                                                        >
                                                            <Text strong>
                                                                <CalendarOutlined /> Due: {formatDueDate(assignment.dueDate, assignment.dueTime)}
                                                            </Text>
                                                        </div>

                                                        <Title level={4}>Instructions</Title>
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: assignment.instructions }}
                                                            style={{
                                                                borderLeft: "3px solid #1890ff",
                                                                paddingLeft: 16,
                                                                marginBottom: 24,
                                                            }}
                                                        />

                                                        {assignment.attachments.length > 0 && (
                                                            <>
                                                                <Title level={4}>Files</Title>
                                                                <List
                                                                    itemLayout="horizontal"
                                                                    dataSource={assignment.attachments}
                                                                    renderItem={(item) => (
                                                                        <List.Item>
                                                                            <List.Item.Meta
                                                                                avatar={getFileIcon(item.type)}
                                                                                title={<a>{item.name}</a>}
                                                                                description={`${item.type.toUpperCase()} file`}
                                                                            />
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                            </>
                                                        )}

                                                        {assignment.links.length > 0 && (
                                                            <>
                                                                <Title level={4}>Links</Title>
                                                                <List
                                                                    itemLayout="horizontal"
                                                                    dataSource={assignment.links}
                                                                    renderItem={(item) => (
                                                                        <List.Item>
                                                                            <List.Item.Meta
                                                                                avatar={<LinkOutlined />}
                                                                                title={
                                                                                    <a href={item} target="_blank" rel="noopener noreferrer">
                                                                                        {item}
                                                                                    </a>
                                                                                }
                                                                            />
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                            </>
                                                        )}

                                                        <Divider />
                                                        <Space>
                                                            <Button type="primary">Submit Assignment</Button>
                                                            {assignment.status === "draft" && (
                                                                <Button>Publish Now</Button>
                                                            )}
                                                            <Button danger>Delete</Button>
                                                        </Space>
                                                    </Space>
                                                </Panel>
                                            </Collapse>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <FormClasswork />
        </div>
    );
};

export default React.memo(ClassworkTab);
