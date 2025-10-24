import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    Card,
    Form,
    Input,
    Button,
    Upload,
    Avatar,
    List,
    Space,
    Typography,
    Flex,
    Tooltip,
    Spin,
    Badge,
    message,
    Popover,
    Modal
} from "antd";
import {
    UploadOutlined,
    LikeOutlined,
    LikeFilled,
    CommentOutlined,
    ShareAltOutlined,
    UserOutlined,
    PaperClipOutlined,
    BookOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    MoreOutlined,
    SyncOutlined,
    SmileOutlined,
    SendOutlined,
    CloseOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
import { DEFAULT_BANNER, HERO_IMAGE } from "~/utils/constant";
import EmojiPicker from "emoji-picker-react";

// Configure day.js
dayjs.extend(relativeTime);

const { Text, Title } = Typography;

// Quill editor configuration
const modules = {
    toolbar: [
        ["bold", "italic", "underline"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
];

const ActionButton = ({ icon, text, count, active, onClick, color }) => {
    return (
        <div
            className={`action-button ${active ? "active" : ""}`}
            onClick={onClick}
            style={color ? { color } : {}}
        >
            <span className="action-icon">{icon}</span>
            <span className="action-text">{text}</span>
            {count > 0 && <span className="action-count">{count}</span>}
        </div>
    );
};

const CommentInput = ({ value, onChange, onSubmit, onCancel, placeholder }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiData) => {
        onChange(value + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="comment-input-container">
            <div className="comment-input-wrapper">
                <Input.TextArea
                    rows={1}
                    autoSize
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="comment-textarea"
                />
                <Popover
                    content={
                        <EmojiPicker
                            onEmojiClick={handleEmojiClick}
                            width={300}
                            height={350}
                        />
                    }
                    trigger="click"
                    open={showEmojiPicker}
                    onOpenChange={setShowEmojiPicker}
                >
                    <Button
                        type="text"
                        icon={<SmileOutlined />}
                        className="emoji-button"
                    />
                </Popover>
            </div>
            <div className="comment-buttons">
                <Button type="text" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={onSubmit}
                    icon={<SendOutlined />}
                    disabled={!value.trim()}
                >
                    Post
                </Button>
            </div>
        </div>
    );
};

const BroadcastPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState({});
    const [form] = Form.useForm();
    const [description, setDescription] = useState("");
    const [lastUpdated, setLastUpdated] = useState(dayjs());
    const [previewImage, setPreviewImage] = useState(DEFAULT_BANNER);

    // Fetch classroom data
    const { data: classroom, isLoading: isClassroomLoading } = useQuery(
        ["classroom", id],
        () =>
            axiosConfig
                .get(`faculties/classroom-settings/${id}`)
                .then((res) => res.data)
    );

    useEffect(() => {
        if (classroom) {
            if (classroom.hero_image) {
                setPreviewImage(HERO_IMAGE + classroom.hero_image);
            }
        }
    }, [classroom]);

    // Fetch announcements with polling
    const { data: announcements = [], isLoading: isAnnouncementsLoading } =
        useQuery(
            ["announcements", id],
            () =>
                axiosConfig
                    .get(`classrooms/${id}/announcements`)
                    .then((res) => {
                        setLastUpdated(dayjs());
                        return res.data;
                    }),
            {
                refetchInterval: 10000, // Poll every 10 seconds
                refetchOnWindowFocus: true,
            }
        );

    // Create announcement mutation
    const createAnnouncement = useMutation(
        (newAnnouncement) => {
            const formData = new FormData();
            formData.append("title", newAnnouncement.title);
            formData.append("description", newAnnouncement.description);

            if (newAnnouncement.attachments) {
                newAnnouncement.attachments.forEach((file) => {
                    formData.append("attachments[]", file.originFileObj);
                });
            }

            return axiosConfig.post(
                `classrooms/${id}/announcements`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        },
        {
            onSuccess: () => {
                form.resetFields();
                setDescription("");
                message.success("Announcement posted!");
                queryClient.invalidateQueries(["announcements", id]);
            },
        }
    );

    // Like mutation
    const toggleLike = useMutation(
        ({ likeableType, likeableId }) => {
            return axiosConfig.post("likes/toggle", {
                likeable_type: likeableType,
                likeable_id: likeableId,
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["announcements", id]);
            },
        }
    );

    // Comment mutation
    const addComment = useMutation(
        ({ announcementId, content }) => {
            return axiosConfig.post(
                `announcements/${announcementId}/comments`,
                {
                    content,
                }
            );
        },
        {
            onSuccess: () => {
                setCommentText("");
                message.success("Comment added!");
                queryClient.invalidateQueries(["announcements", id]);
            },
        }
    );

    // Reply mutation
    const addReply = useMutation(
        ({ commentId, content }) => {
            return axiosConfig.post(`comments/${commentId}/replies`, {
                content,
            });
        },
        {
            onSuccess: () => {
                setReplyText({});
                message.success("Reply added!");
                queryClient.invalidateQueries(["announcements", id]);
            },
        }
    );

    // Helper functions
    const handleLike = (type, id) => {
        toggleLike.mutate({ likeableType: type, likeableId: id });
    };

    const handleCommentSubmit = (announcementId) => {
        if (!commentText.trim()) return;
        addComment.mutate({ announcementId, content: commentText });
    };

    const handleReplySubmit = (commentId) => {
        if (!replyText[commentId]?.trim()) return;
        addReply.mutate({ commentId, content: replyText[commentId] });
    };

    const openCommentModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setCommentModalVisible(true);
    };

    const closeCommentModal = () => {
        setCommentModalVisible(false);
        setSelectedAnnouncement(null);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const renderLikeButton = (item, type = "announcement") => {
        const isLiked = item.is_liked;
        const likeCount = item.likes_count || 0;

        return (
            <ActionButton
                icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
                text={isLiked ? "Liked" : "Like"}
                count={likeCount}
                active={isLiked}
                onClick={() => handleLike(type, item.id)}
                color={isLiked ? "#1877f2" : undefined}
            />
        );
    };

    if (isClassroomLoading || isAnnouncementsLoading) {
        return <Spin size="large" className="center-spinner" />;
    }

    return (
        <div className="broadcast-container">
            <div
                className="classroom-card-details"
                style={{ "--preview-image": `url(${previewImage})` }}
            >
                {/* Class Details */}
                <div className="class-details">
                    <div className="title-header">
                        <Title level={3}>
                            {classroom?.subject?.subject_name}
                        </Title>
                        <Text type="secondary">
                            {classroom?.subject?.subject_code}
                        </Text>
                    </div>
                    <div className="details-grid">
                        <div className="detail-item">
                            <BookOutlined />
                            <div className="detail-content">
                                <Text strong className="detail-label">
                                    Class
                                </Text>
                                <Text className="detail-value">
                                    {classroom?.class_name} - Section{" "}
                                    {classroom?.section}
                                </Text>
                            </div>
                        </div>

                        <div className="detail-item">
                            <EnvironmentOutlined />
                            <div className="detail-content">
                                <Text strong className="detail-label">
                                    Room
                                </Text>
                                <Text className="detail-value">
                                    {classroom?.room || "Not specified"}
                                </Text>
                            </div>
                        </div>

                        <div className="detail-item">
                            <CalendarOutlined />
                            <div className="detail-content">
                                <Text strong className="detail-label">
                                    Day
                                </Text>
                                <Text className="detail-value">
                                    {classroom?.day || "Not scheduled"}
                                </Text>
                            </div>
                        </div>

                        <div className="detail-item">
                            <ClockCircleOutlined />
                            <div className="detail-content">
                                <Text strong className="detail-label">
                                    Time
                                </Text>
                                <Text className="detail-value">
                                    {classroom?.time_in
                                        ? dayjs(
                                              classroom.time_in,
                                              "HH:mm:ss"
                                          ).format("h:mm A")
                                        : "--"}{" "}
                                    -{" "}
                                    {classroom?.time_out
                                        ? dayjs(
                                              classroom.time_out,
                                              "HH:mm:ss"
                                          ).format("h:mm A")
                                        : "--"}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Card title="Create Announcement" className="announcement-form">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        if (!description.trim()) {
                            message.warning("Please enter content");
                            return;
                        }
                        createAnnouncement.mutate({ ...values, description });
                    }}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[
                            { required: true, message: "Title is required" },
                        ]}
                    >
                        <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item label="Description" required>
                        <ReactQuill
                            theme="snow"
                            value={description}
                            onChange={setDescription}
                            modules={modules}
                            formats={formats}
                            placeholder="Write your announcement..."
                            className="editor"
                        />
                    </Form.Item>

                    <Form.Item
                        name="attachments"
                        label="Attachments"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload multiple beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>
                                Upload Files
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createAnnouncement.isLoading}
                            icon={
                                <SyncOutlined
                                    spin={createAnnouncement.isLoading}
                                />
                            }
                        >
                            Post Announcement
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <List
                itemLayout="vertical"
                dataSource={announcements}
                renderItem={(item) => (
                    <Card
                        key={item.id}
                        className={`announcement-card announcement-${item.id}`}
                    >
                        <div className="announcement-header">
                            <div>
                                <Avatar src={item.user?.avatar} size="large" />
                            </div>

                            <div className="announcement-meta">
                                <Text strong>{item.user?.name}</Text>
                                <Text type="secondary">
                                    {dayjs(item.created_at).fromNow()}
                                </Text>
                            </div>
                        </div>

                        <Title level={4} className="announcement-title">
                            {item.title}
                        </Title>

                        <div
                            className="announcement-content"
                            dangerouslySetInnerHTML={{
                                __html: item.description,
                            }}
                        />

                        {item.attachments?.length > 0 && (
                            <div className="attachments">
                                {item.attachments.map((attach) => (
                                    <div key={attach.id} className="attachment">
                                        <PaperClipOutlined />
                                        <a
                                            href={attach.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {attach.name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Like, Comment, Share buttons */}
                        <div className="announcement-actions">
                            <div className="action-buttons">
                                {renderLikeButton(item)}
                                <ActionButton
                                    icon={<CommentOutlined />}
                                    text="Comment"
                                    count={
                                        item.comments_count ||
                                        item.comments?.length ||
                                        0
                                    }
                                    onClick={() => openCommentModal(item)}
                                />
                                <ActionButton
                                    icon={<ShareAltOutlined />}
                                    text="Share"
                                />
                            </div>
                        </div>

                        {/* Like preview */}
                        {item.likes_count > 0 && (
                            <div className="likes-preview">
                                <div className="likes-icon">
                                    <LikeFilled style={{ color: "#1877f2" }} />
                                </div>
                                <span className="likes-count">
                                    {item.likes_count}
                                </span>
                            </div>
                        )}
                    </Card>
                )}
            />

            {/* Comments Modal */}
            <Modal
                title={
                    <div className="modal-header">
                        <span>Comments</span>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={closeCommentModal}
                        />
                    </div>
                }
                open={commentModalVisible}
                onCancel={closeCommentModal}
                footer={null}
                width={700}
                bodyStyle={{ padding: 0 }}
                className="comments-modal"
            >
                {selectedAnnouncement && (
                    <div className="modal-content">
                        <div className="original-post">
                            <div className="announcement-header">
                                <Avatar
                                    src={selectedAnnouncement.user?.avatar}
                                    size={48}
                                />
                                <div className="announcement-meta">
                                    <Text strong>
                                        {selectedAnnouncement.user?.name}
                                    </Text>
                                    <Text type="secondary">
                                        {dayjs(
                                            selectedAnnouncement.created_at
                                        ).fromNow()}
                                    </Text>
                                </div>
                            </div>

                            <Title level={4} className="announcement-title">
                                {selectedAnnouncement.title}
                            </Title>

                            <div
                                className="announcement-content"
                                dangerouslySetInnerHTML={{
                                    __html: selectedAnnouncement.description,
                                }}
                            />

                            {selectedAnnouncement.attachments?.length > 0 && (
                                <div className="attachments">
                                    {selectedAnnouncement.attachments.map(
                                        (attach) => (
                                            <div
                                                key={attach.id}
                                                className="attachment"
                                            >
                                                <PaperClipOutlined />
                                                <a
                                                    href={attach.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {attach.name}
                                                </a>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            <div className="announcement-actions">
                                {renderLikeButton(selectedAnnouncement)}
                            </div>
                        </div>

                        <div className="comments-section">
                            <div className="comment-input-container">
                                <Avatar
                                    src={classroom?.faculty?.avatar}
                                    size={40}
                                />
                                <div className="comment-input-wrapper">
                                    <Input.TextArea
                                        rows={1}
                                        autoSize
                                        value={commentText}
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                        placeholder="Write a comment..."
                                        className="comment-textarea"
                                    />
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            handleCommentSubmit(
                                                selectedAnnouncement.id
                                            )
                                        }
                                        disabled={!commentText.trim()}
                                        icon={<SendOutlined />}
                                    />
                                </div>
                            </div>

                            <div className="comments-list">
                                {selectedAnnouncement.comments?.map(
                                    (comment) => (
                                        <div
                                            key={comment.id}
                                            className={`comment comment-${comment.id}`}
                                        >
                                            <Avatar
                                                src={comment.user?.avatar}
                                                size={40}
                                                className="comment-avatar"
                                            />
                                            <div className="comment-content">
                                                <div className="comment-bubble">
                                                    <span className="comment-author">
                                                        {comment.user?.name}
                                                    </span>
                                                    <span className="comment-text">
                                                        {comment.content}
                                                    </span>
                                                </div>
                                                <div className="comment-footer">
                                                    {renderLikeButton(
                                                        comment,
                                                        "comment"
                                                    )}
                                                    <span
                                                        className="reply-button"
                                                        onClick={() => {
                                                            const newReplyText = {
                                                                ...replyText,
                                                                [comment.id]: ""
                                                            };
                                                            setReplyText(newReplyText);
                                                        }}
                                                    >
                                                        Reply
                                                    </span>
                                                    <span className="comment-time">
                                                        {dayjs(
                                                            comment.created_at
                                                        ).fromNow()}
                                                    </span>
                                                </div>

                                                {/* Replies */}
                                                {comment.replies?.length > 0 && (
                                                    <div className="replies-container">
                                                        {comment.replies.map(
                                                            (reply) => (
                                                                <div
                                                                    key={
                                                                        reply.id
                                                                    }
                                                                    className="reply"
                                                                >
                                                                    <Avatar
                                                                        src={
                                                                            reply
                                                                                .user
                                                                                ?.avatar
                                                                        }
                                                                        size={
                                                                            32
                                                                        }
                                                                        className="reply-avatar"
                                                                    />
                                                                    <div className="reply-content">
                                                                        <div className="reply-bubble">
                                                                            <span className="reply-author">
                                                                                {
                                                                                    reply
                                                                                        .user
                                                                                        ?.name
                                                                                }
                                                                            </span>
                                                                            <span className="reply-text">
                                                                                {
                                                                                    reply.content
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className="reply-footer">
                                                                            {renderLikeButton(
                                                                                reply,
                                                                                "reply"
                                                                            )}
                                                                            <span className="reply-time">
                                                                                {dayjs(
                                                                                    reply.created_at
                                                                                ).fromNow()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                {/* Reply form */}
                                                {replyText.hasOwnProperty(
                                                    comment.id
                                                ) && (
                                                    <div className="reply-form">
                                                        <div className="comment-input-container">
                                                            <Avatar
                                                                src={
                                                                    classroom
                                                                        ?.faculty
                                                                        ?.avatar
                                                                }
                                                                size={32}
                                                            />
                                                            <div className="comment-input-wrapper">
                                                                <Input.TextArea
                                                                    rows={1}
                                                                    autoSize
                                                                    value={
                                                                        replyText[
                                                                            comment
                                                                                .id
                                                                        ] || ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setReplyText(
                                                                            {
                                                                                ...replyText,
                                                                                [comment.id]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                    placeholder="Write a reply..."
                                                                    className="reply-textarea"
                                                                />
                                                                <Button
                                                                    type="primary"
                                                                    onClick={() =>
                                                                        handleReplySubmit(
                                                                            comment.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !replyText[
                                                                            comment
                                                                                .id
                                                                        ]?.trim()
                                                                    }
                                                                    icon={
                                                                        <SendOutlined />
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <style jsx global>{`
                .broadcast-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;

                    .classroom-card-details {
                        background: linear-gradient(
                                72deg,
                                rgb(206 0 206 / 44%),
                                rgb(59 245 245 / 35%)
                            ),
                            var(--preview-image);
                        background-size: cover;
                        background-position: center;
                        color: white;
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 20px;
                        height: 344px;
                        display: flex;
                        .title-header {
                            margin-bottom: 20px;

                            h3 {
                                color: white !important;
                                margin-bottom: 0;
                            }

                            .ant-typography-secondary {
                                color: rgba(255, 255, 255, 0.8);
                            }
                        }

                        .class-details {
                            background: rgba(255, 255, 255, 0.1);
                            backdrop-filter: blur(5px);
                            border-radius: 8px;
                            padding: 15px;

                            .details-grid {
                                display: grid;
                                grid-template-columns: repeat(
                                    auto-fit,
                                    minmax(200px, 1fr)
                                );
                                gap: 15px;

                                .detail-item {
                                    display: flex;
                                    align-items: center;

                                    .anticon {
                                        font-size: 20px;
                                        margin-right: 10px;
                                        color: white;
                                    }

                                    .detail-content {
                                        display: flex;
                                        flex-direction: column;

                                        .detail-label {
                                            color: rgba(255, 255, 255, 0.8);
                                            font-size: 12px;
                                        }

                                        .detail-value {
                                            color: white;
                                            font-size: 14px;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .announcement-form {
                        margin-bottom: 20px;

                        .editor {
                            background: white;
                            border-radius: 4px;
                        }
                    }

                    .announcement-card {
                        margin-bottom: 20px;
                        border-radius: 8px;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

                        .announcement-header {
                            display: flex;
                            align-items: center;
                            margin-bottom: 15px;

                            .announcement-meta {
                                margin-left: 12px;
                                display: flex;
                                flex-direction: column;
                                .ant-typography-strong {
                                    display: block;
                                }
                            }
                        }

                        .announcement-title {
                            margin-bottom: 10px;
                        }

                        .attachments {
                            margin: 15px 0;

                            .attachment {
                                display: flex;
                                align-items: center;
                                margin-bottom: 5px;

                                .anticon {
                                    margin-right: 8px;
                                }
                            }
                        }

                        .announcement-actions {
                            border-top: 1px solid #f0f0f0;
                            border-bottom: 1px solid #f0f0f0;
                            padding: 8px 0;
                            margin: 12px 0;

                            .action-buttons {
                                display: flex;
                                justify-content: space-around;

                                .action-button {
                                    display: flex;
                                    align-items: center;
                                    padding: 8px 12px;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    color: #65676b;
                                    font-weight: 600;
                                    transition: all 0.2s;

                                    &:hover {
                                        background-color: #f0f2f5;
                                    }

                                    &.active {
                                        color: #1877f2;
                                    }

                                    .action-icon {
                                        margin-right: 8px;
                                        font-size: 18px;
                                    }

                                    .action-count {
                                        margin-left: 6px;
                                        color: #65676b;
                                    }
                                }
                            }
                        }

                        .likes-preview {
                            display: flex;
                            align-items: center;
                            padding: 8px 12px;
                            border-bottom: 1px solid #f0f0f0;

                            .likes-icon {
                                background-color: #1877f2;
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-right: 6px;
                            }

                            .likes-count {
                                color: #65676b;
                                font-size: 13px;
                            }
                        }
                    }

                    .center-spinner {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }

                    .title-with-shadow {
                        text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff,
                            -1px 1px 0 #fff, 1px 1px 0 #fff, -2px -2px 0 #000,
                            2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000;
                    }
                }

                /* Comments Modal Styles */
                .comments-modal {
                    .ant-modal-header {
                        padding: 16px 24px;
                        border-bottom: 1px solid #f0f0f0;
                    }

                    .ant-modal-title {
                        font-size: 18px;
                        font-weight: 600;
                    }

                    .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .modal-content {
                        display: flex;
                        flex-direction: column;
                        height: 70vh;
                        overflow: hidden;

                        .original-post {
                            padding: 16px 24px;
                            border-bottom: 1px solid #f0f0f0;

                            .announcement-header {
                                display: flex;
                                align-items: center;
                                margin-bottom: 12px;

                                .ant-avatar {
                                    margin-right: 12px;
                                }

                                .announcement-meta {
                                    display: flex;
                                    flex-direction: column;

                                    .ant-typography-strong {
                                        font-size: 15px;
                                    }

                                    .ant-typography-secondary {
                                        font-size: 13px;
                                    }
                                }
                            }

                            .announcement-title {
                                margin-bottom: 8px;
                                font-size: 18px;
                            }

                            .announcement-content {
                                margin-bottom: 12px;
                                line-height: 1.5;
                            }

                            .attachments {
                                margin: 12px 0;

                                .attachment {
                                    display: flex;
                                    align-items: center;
                                    margin-bottom: 8px;

                                    .anticon {
                                        margin-right: 8px;
                                        color: #65676b;
                                    }

                                    a {
                                        color: #1877f2;
                                    }
                                }
                            }

                            .announcement-actions {
                                margin-top: 12px;
                                padding-top: 8px;
                                border-top: 1px solid #f0f0f0;
                            }
                        }

                        .comments-section {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            overflow: hidden;

                            .comment-input-container {
                                display: flex;
                                padding: 16px 24px;
                                border-bottom: 1px solid #f0f0f0;

                                .ant-avatar {
                                    margin-right: 12px;
                                    flex-shrink: 0;
                                }

                                .comment-input-wrapper {
                                    flex: 1;
                                    display: flex;
                                    align-items: center;

                                    .ant-input-textarea {
                                        flex: 1;
                                        margin-right: 8px;
                                    }

                                    .ant-btn {
                                        height: 40px;
                                    }
                                }
                            }

                            .comments-list {
                                flex: 1;
                                overflow-y: auto;
                                padding: 0 24px;

                                .comment {
                                    display: flex;
                                    padding: 12px 0;
                                    border-bottom: 1px solid #f0f0f0;

                                    .comment-avatar {
                                        margin-right: 12px;
                                        flex-shrink: 0;
                                    }

                                    .comment-content {
                                        flex: 1;

                                        .comment-bubble {
                                            background-color: #f0f2f5;
                                            border-radius: 18px;
                                            padding: 8px 12px;
                                            display: inline-block;
                                            max-width: 100%;

                                            .comment-author {
                                                font-weight: 600;
                                                margin-right: 6px;
                                                color: #385898;
                                            }

                                            .comment-text {
                                                word-break: break-word;
                                            }
                                        }

                                        .comment-footer {
                                            margin-top: 4px;
                                            font-size: 12px;
                                            color: #65676b;
                                            display: flex;
                                            align-items: center;

                                            span {
                                                margin-right: 12px;
                                                cursor: pointer;
                                                font-weight: 600;

                                                &:hover {
                                                    text-decoration: underline;
                                                }
                                            }
                                        }

                                        .replies-container {
                                            margin-left: 40px;
                                            border-left: 1px solid #f0f0f0;
                                            padding-left: 12px;

                                            .reply {
                                                display: flex;
                                                padding: 8px 0;

                                                .reply-avatar {
                                                    margin-right: 12px;
                                                    flex-shrink: 0;
                                                }

                                                .reply-content {
                                                    flex: 1;

                                                    .reply-bubble {
                                                        background-color: #f0f2f5;
                                                        border-radius: 18px;
                                                        padding: 8px 12px;
                                                        display: inline-block;
                                                        max-width: 100%;

                                                        .reply-author {
                                                            font-weight: 600;
                                                            margin-right: 6px;
                                                            color: #385898;
                                                        }

                                                        .reply-text {
                                                            word-break: break-word;
                                                        }
                                                    }

                                                    .reply-footer {
                                                        margin-top: 4px;
                                                        font-size: 12px;
                                                        color: #65676b;
                                                        display: flex;
                                                        align-items: center;

                                                        span {
                                                            margin-right: 12px;
                                                            cursor: pointer;
                                                            font-weight: 600;

                                                            &:hover {
                                                                text-decoration: underline;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        .reply-form {
                                            margin-top: 8px;
                                            margin-left: 40px;

                                            .comment-input-container {
                                                padding: 8px 0;
                                                border-bottom: none;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `}</style>
        </div>
    );
};

export default BroadcastPage;