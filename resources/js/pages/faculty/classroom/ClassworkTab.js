import React, { useEffect, useState } from "react";
import {
    Button,
    Dropdown,
    Menu,
    Modal,
    Divider,
    Typography,
    Tag,
    Space,
    List,
    Collapse,
    Select,
    Card,
    Skeleton,
    Empty,
    message,
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
    EyeOutlined,
    EyeInvisibleOutlined,
} from "@ant-design/icons";
import FormClasswork from "./FormClasswork";
import useClassroomStore from "~/states/classroomState";
import { CLASS_WORK_TYPES } from "~/utils/constant";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useClassworks from "~/hooks/useClassworks";
import useClassRoomSettings from "~/hooks/useClassRoomSettings";
import { formatDate, formatDueDate } from "../../../utils/helper";
import { useHistory } from "react-router-dom";
import ClassworkSubmission from "./ClassworkSubmission";
import { CLASSWORK_ATTACHMENT } from "~/utils/constant";
import StudentWork from "./StudentWork";
import { getStorage } from "~/utils/helper";
import { useLoadingStore } from "~/states/loadingState";
import { useQueryClient } from "react-query";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const ClassworkTab = () => {
    const queryClient = useQueryClient();
    const { id } = useParams();
    const {
        isLoading,
        data: classworks,
        refetch,
        isFetching,
    } = useClassworks(id);
    const {
        isLoading: loadingSettings,
        data: classroom,
        refetch: refetchSettings,
    } = useClassRoomSettings(id);
    const { setField, deleteClasswork } = useClassroomStore();
    const [selectedTerm, setSelectedTerm] = useState("midterm");
    const [activePanels, setActivePanels] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const role = getStorage("userRole");
    const { showLoading, hideLoading } = useLoadingStore();

    useEffect(() => {
        if (classroom?.term) {
            setSelectedTerm(classroom?.term);
        }
    }, [classroom]);

    useEffect(() => {
        if (Array.isArray(classworks)) {
            setAssignments(classworks);
        }
    }, [classworks]);

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

    const handleSubmission = (slug, title, points_possible) => {
        setField("classwork_id", slug);
        setField("classwork_title", title);
        setField("classwork_points", points_possible);
        if (role === "student") {
            setField("studentSubmission", true);
        } else {
            setField("submission", true);
        }
    };

    const menu = (
        <Menu>
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

    const handleEdit = (data) => {
        setField("editClasswork", data);
        setField("formClassroom", true);
        setField("formType", data?.type);
        setField("term", data?.term);
    };

    const handleDelete = async (id) => {
        showLoading("Processing data...");
        const response = await deleteClasswork({ id });
        if (response.error) {
            throw new Error(response.message);
        }
        if (response.status === 200) {
            queryClient.invalidateQueries("classroom-classwork-list");
            queryClient.invalidateQueries("classwork-gradesheet-data");
            message.success(`Classwork deleted successfully!`);
        }
        hideLoading();
    };

    const AssignmentItem = ({
        assignment,
        isDraggable,
        dragProps,
        activePanels,
        handlePanelChange,
        handleSubmission,
    }) => (
        <div
            key={assignment.id}
            style={{ marginBottom: 12 }}
            {...(isDraggable ? dragProps : {})}
        >
            <Collapse
                activeKey={activePanels}
                onChange={handlePanelChange}
                expandIconPosition="right"
                expandIcon={({ isActive }) =>
                    isActive ? <UpOutlined /> : <DownOutlined />
                }
                size="large"
                style={{
                    background: "#fff",
                    borderLeftWidth: 5,
                    borderLeftColor: "#1890ff",
                    borderLeftStyle: "solid",
                }}
            >
                <Panel
                    title={assignment.title}
                    key={assignment.id}
                    header={
                        <Space>
                            <div className="title">
                                <Text strong>{assignment.title}</Text>
                            </div>
                            <Text type="secondary" className="mobile-hidden">
                                Due:{" "}
                                {assignment.due_date
                                    ? formatDueDate(assignment.due_date)
                                    : "No due"}
                            </Text>
                        </Space>
                    }
                    extra={
                        <Space>
                            <div className="tag-term">
                                <Tag
                                    bordered={false}
                                    color="geekblue"
                                >
                                    {
                                        CLASS_WORK_TYPES.find(
                                            (item) =>
                                                item.key === assignment?.type
                                        )?.value
                                    }
                                </Tag>
                                <Tag
                                    icon={<BookOutlined />}
                                    color={
                                        assignment?.term?.toLowerCase() ===
                                        "midterm"
                                            ? "blue"
                                            : "green"
                                    }
                                >
                                    {assignment?.term?.toUpperCase?.() || "N/A"}
                                </Tag>
                            </div>
                            {assignment.published ? (
                                <EyeOutlined />
                            ) : (
                                <EyeInvisibleOutlined />
                            )}
                        </Space>
                    }
                >
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                            <Text type="secondary">
                                <StarOutlined /> {assignment.points_possible}{" "}
                                points
                            </Text>
                            <Text type="secondary">
                                <ClockCircleOutlined /> Posted on{" "}
                                {new Date(
                                    assignment.created_at
                                ).toLocaleDateString()}
                            </Text>
                            <Text type="secondary">
                                <CalendarOutlined /> Due:{" "}
                                {assignment.due_date
                                    ? formatDate(assignment.due_date, true)
                                    : "No due date"}
                            </Text>
                        </Space>
                        <Title className="mobile-show" level={4}>
                            Title: {assignment.title}
                        </Title>
                        {assignment?.topic && (
                            <Title level={4}>
                                Topic: {assignment?.topic?.name}
                            </Title>
                        )}

                        <Title level={5}>Instructions</Title>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: assignment.instructions || "",
                            }}
                            // className="with-border"
                        />

                        {Array.isArray(assignment.attachment) &&
                            assignment.attachment.length > 0 && (
                                <>
                                    <Title level={4}>Files</Title>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={assignment.attachment}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={getFileIcon("pdf")}
                                                    title={
                                                        <a
                                                            href={
                                                                CLASSWORK_ATTACHMENT +
                                                                item?.file_link
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {item?.file_link}
                                                        </a>
                                                    }
                                                    description={`pdf file`}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </>
                            )}

                        {Array.isArray(assignment?.links) &&
                            assignment?.links.length > 0 && (
                                <>
                                    <Title level={4}>Links</Title>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={assignment?.links || []}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<LinkOutlined />}
                                                    title={
                                                        <a
                                                            href={item?.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {item?.link}
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
                            <Button
                                type="primary"
                                onClick={() =>
                                    handleSubmission(
                                        assignment.slug,
                                        assignment.title,
                                        assignment.points_possible
                                    )
                                }
                            >
                                View Work
                            </Button>
                            <Button
                                type="dashed"
                                onClick={() => handleEdit(assignment)}
                            >
                                Edit
                            </Button>
                            {assignment.status === "draft" && (
                                <Button>Publish Now</Button>
                            )}

                            <Button
                                type="text"
                                danger
                                size="small"
                                style={{ padding: 0 }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: "Are you sure you want to delete this classwork?",
                                        content:
                                            "This action cannot be undone.",
                                        okText: "Yes, delete it",
                                        okType: "danger",
                                        cancelText: "Cancel",
                                        onOk() {
                                            return handleDelete(assignment?.id);
                                        },
                                    });
                                }}
                            >
                                Delete
                            </Button>
                        </Space>
                    </Space>
                </Panel>
            </Collapse>
        </div>
    );

    return (
        <div className="class-work">
            {isLoading ? (
                <Card>
                    <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
            ) : (
                <>
                    {role === "faculty" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 16,
                            }}
                        >
                            <Dropdown overlay={menu} trigger={["click"]}>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    size="large"
                                >
                                    Create
                                </Button>
                            </Dropdown>
                            <Space>
                                <Text strong>
                                    {assignments.length} Classwork
                                </Text>
                            </Space>
                        </div>
                    )}
                    {isFetching && (
                        <Card style={{ marginBottom: 20 }}>
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </Card>
                    )}
                    {role === "student" && (
                        <div>
                            {Array.isArray(assignments) &&
                                assignments.map((assignment) => (
                                    <AssignmentItem
                                        key={assignment.id}
                                        assignment={assignment}
                                        isDraggable={false}
                                        activePanels={activePanels}
                                        handlePanelChange={handlePanelChange}
                                        handleSubmission={handleSubmission}
                                    />
                                ))}
                            {Array.isArray(assignments) &&
                                assignments.length > 0 && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            color: "rgba(0, 0, 0, 0.25)",
                                        }}
                                    >
                                        <Empty description="No Classwork yet" />
                                    </div>
                                )}
                        </div>
                    )}
                    {role === "faculty" && (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="assignments">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                            minHeight: 60, // Ensure droppable area has some height when empty
                                            background:
                                                Array.isArray(assignments) &&
                                                assignments.length === 0
                                                    ? "#fafafa"
                                                    : "transparent",
                                            border:
                                                Array.isArray(assignments) &&
                                                assignments.length === 0
                                                    ? "1px dashed #d9d9d9"
                                                    : "none",
                                            borderRadius: 4,
                                            padding:
                                                Array.isArray(assignments) &&
                                                assignments.length === 0
                                                    ? 16
                                                    : 0,
                                        }}
                                    >
                                        {Array.isArray(assignments) &&
                                        assignments.length > 0
                                            ? assignments.map(
                                                  (assignment, index) => (
                                                      <Draggable
                                                          key={assignment.id}
                                                          draggableId={assignment.id.toString()}
                                                          index={index}
                                                      >
                                                          {(provided) => (
                                                              <AssignmentItem
                                                                  assignment={
                                                                      assignment
                                                                  }
                                                                  isDraggable={
                                                                      true
                                                                  }
                                                                  dragProps={{
                                                                      ref: provided.innerRef,
                                                                      ...provided.draggableProps,
                                                                      ...provided.dragHandleProps,
                                                                      style: {
                                                                          marginBottom: 12,
                                                                          ...provided
                                                                              .draggableProps
                                                                              .style,
                                                                      },
                                                                  }}
                                                                  activePanels={
                                                                      activePanels
                                                                  }
                                                                  handlePanelChange={
                                                                      handlePanelChange
                                                                  }
                                                                  handleSubmission={
                                                                      handleSubmission
                                                                  }
                                                              />
                                                          )}
                                                      </Draggable>
                                                  )
                                              )
                                            : !isLoading && (
                                                  <div
                                                      style={{
                                                          textAlign: "center",
                                                          color: "rgba(0, 0, 0, 0.25)",
                                                      }}
                                                  >
                                                      <Empty description="No Classwork yet" />
                                                  </div>
                                              )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                    <FormClasswork />
                    <ClassworkSubmission />
                    <StudentWork />
                </>
            )}
        </div>
    );
};

export default React.memo(ClassworkTab);
