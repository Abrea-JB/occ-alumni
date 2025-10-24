import React, { useState } from "react";
import {
    Drawer,
    Card,
    Avatar,
    Button,
    Divider,
    Input,
    Upload,
    message,
    Checkbox,
    Row,
    Col,
    Typography,
    Space,
    List,
    Tag,
} from "antd";
import {
    UserOutlined,
    PaperClipOutlined,
    CheckOutlined,
    CommentOutlined,
    UploadOutlined,
    SendOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import useClassroomStore from "~/states/classroomState";
import { CLASSWORK_ATTACHMENT } from "~/utils/constant";

const { TextArea } = Input;
const { Text, Title } = Typography;

const StudentWork = () => {
    const { studentSubmission, setField } = useClassroomStore();
    const [comments, setComments] = useState([
        {
            id: "1",
            author: "Teacher Smith",
            avatar: "https://i.pravatar.cc/150?img=3",
            content: "Remember to cite your sources in APA format",
            datetime: "2 days ago",
            isPrivate: false,
        },
        {
            id: "2",
            author: "You",
            avatar: <Avatar icon={<UserOutlined />} />,
            content: "I have a question about the grading rubric",
            datetime: "1 day ago",
            isPrivate: true,
        },
    ]);

    const [newComment, setNewComment] = useState("");
    const [privateComment, setPrivateComment] = useState("");
    const [fileList, setFileList] = useState([]);
    const [markedAsDone, setMarkedAsDone] = useState(false);
    const [links, setLinks] = useState([]);
    const [currentLink, setCurrentLink] = useState("");

    const handleUpload = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleAddLink = () => {
        if (!currentLink.trim()) {
            message.warning("Please enter a valid link!");
            return;
        }

        // Basic URL validation
        if (!currentLink.startsWith('http://') && !currentLink.startsWith('https://')) {
            message.warning("Please enter a valid URL starting with http:// or https://");
            return;
        }

        setLinks([...links, { id: Date.now().toString(), url: currentLink }]);
        setCurrentLink("");
    };

    const handleRemoveLink = (id) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const handlePublicComment = () => {
        if (!newComment.trim()) {
            message.warning("Please enter a comment!");
            return;
        }

        setComments([
            ...comments,
            {
                id: Date.now().toString(),
                author: "You",
                avatar: <Avatar icon={<UserOutlined />} />,
                content: newComment,
                datetime: "Just now",
                isPrivate: false,
            },
        ]);
        setNewComment("");
    };

    const handlePrivateComment = () => {
        if (!privateComment.trim()) {
            message.warning("Please enter a private comment!");
            return;
        }

        setComments([
            ...comments,
            {
                id: Date.now().toString(),
                author: "You",
                avatar: <Avatar icon={<UserOutlined />} />,
                content: privateComment,
                datetime: "Just now",
                isPrivate: true,
            },
        ]);
        setPrivateComment("");
        message.success("Private comment sent to instructor");
    };

    const handleMarkAsDone = () => {
        setMarkedAsDone(!markedAsDone);
        message.success(
            !markedAsDone ? "Work marked as done" : "Work unmarked"
        );
    };

    return (
        <Drawer
            title="Your Work"
            placement="bottom"
            height="90vh"
            width="80%"
            onClose={() => setField("studentSubmission", false)}
            open={studentSubmission}
            mask={true}
            bodyStyle={{ padding: 0, overflowX: "hidden" }}
        >
            <div>
                <Row gutter={16} style={{ height: "100%" }}>
                    {/* Left Column - Comments */}
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{ padding: 16, flex: 1, overflowY: "auto" }}
                        >
                            <Title level={4}>Your Work</Title>

                            <Card
                                title="Assignment Submission"
                                style={{ marginBottom: 16 }}
                                extra={
                                    <Checkbox
                                        checked={markedAsDone}
                                        onChange={handleMarkAsDone}
                                    >
                                        Mark as done
                                    </Checkbox>
                                }
                            >
                                <Upload
                                    multiple
                                    fileList={fileList}
                                    onChange={handleUpload}
                                    beforeUpload={() => false}
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Upload Files
                                    </Button>
                                </Upload>

                                <Divider>Or add links</Divider>
                                
                                <Space.Compact style={{ width: '100%', marginBottom: 8 }}>
                                    <Input
                                        placeholder="https://drive.google.com/..."
                                        value={currentLink}
                                        onChange={(e) => setCurrentLink(e.target.value)}
                                        addonBefore={<PaperClipOutlined />}
                                    />
                                    <Button 
                                        type="primary" 
                                        onClick={handleAddLink}
                                        disabled={!currentLink.trim()}
                                    >
                                        Add Link
                                    </Button>
                                </Space.Compact>
                                
                                {links.length > 0 && (
                                    <List
                                        size="small"
                                        dataSource={links}
                                        renderItem={(link) => (
                                            <List.Item
                                                actions={[
                                                    <Button
                                                        type="text"
                                                        icon={<CloseOutlined />}
                                                        onClick={() => handleRemoveLink(link.id)}
                                                    />
                                                ]}
                                            >
                                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                    {link.url}
                                                </a>
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </Card>

                            <Card title="Private Comments (for instructor only)">
                                <TextArea
                                    rows={3}
                                    value={privateComment}
                                    onChange={(e) =>
                                        setPrivateComment(e.target.value)
                                    }
                                    placeholder="Add a private comment for your instructor..."
                                    style={{ marginBottom: 8 }}
                                />
                                <Button
                                    onClick={handlePrivateComment}
                                    icon={<SendOutlined />}
                                >
                                    Send Private Comment
                                </Button>

                                <Divider />

                                <List
                                    dataSource={comments.filter(
                                        (c) => c.isPrivate
                                    )}
                                    renderItem={(item) => (
                                        <List.Item style={{ padding: "8px 0" }}>
                                            <Space align="start">
                                                <Avatar
                                                    src={item.avatar}
                                                    icon={<UserOutlined />}
                                                    size="small"
                                                />
                                                <div>
                                                    <Text
                                                        style={{
                                                            display: "block",
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Text>
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {item.datetime}
                                                    </Text>
                                                </div>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>

                        <div
                            style={{
                                padding: 16,
                                borderTop: "1px solid #f0f0f0",
                            }}
                        >
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    disabled={!markedAsDone}
                                >
                                    Turn In
                                </Button>
                                <Button>Save as Draft</Button>
                                <Button danger>Cancel</Button>
                            </Space>
                        </div>
                    </Col>
                    <Col
                        xs={24}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{
                            borderRight: "1px solid #f0f0f0",
                            height: "100%",
                            overflowY: "auto",
                        }}
                    >
                        <div>
                         

                            <List
                                dataSource={comments.filter(
                                    (c) => !c.isPrivate
                                )}
                                renderItem={(item) => (
                                    <List.Item style={{ padding: "12px 0" }}>
                                        <Card
                                            size="small"
                                            style={{ width: "100%" }}
                                            bodyStyle={{ padding: 12 }}
                                        >
                                            <Space align="start">
                                                <Avatar
                                                    src={item.avatar}
                                                    icon={<UserOutlined />}
                                                />
                                                <div>
                                                    <Space size="small">
                                                        <Text strong>
                                                            {item.author}
                                                        </Text>
                                                        <Text type="secondary">
                                                            {item.datetime}
                                                        </Text>
                                                        {item.isPrivate && (
                                                            <Tag color="orange">
                                                                Private
                                                            </Tag>
                                                        )}
                                                    </Space>
                                                    <Text
                                                        style={{
                                                            display: "block",
                                                            marginTop: 4,
                                                        }}
                                                    >
                                                        {item.content}
                                                    </Text>
                                                </div>
                                            </Space>
                                        </Card>
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            <div style={{ marginTop: 24 }}>
                                <TextArea
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    placeholder="Add a class comment..."
                                    style={{ marginBottom: 8 }}
                                />
                                <Button
                                    type="primary"
                                    onClick={handlePublicComment}
                                    icon={<CommentOutlined />}
                                >
                                    Post to Class
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Drawer>
    );
};

export default StudentWork;