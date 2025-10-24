import React, { useState, useEffect } from "react";
import {
    Card,
    Form,
    Input,
    Button,
    Upload,
    Avatar,
    List,
    Empty,
    Typography,
    Flex,
    Tooltip,
    Spin,
    Badge,
    message,
    Popover,
    Dropdown,
    Modal,
    Skeleton,
} from "antd";
import {
    UploadOutlined,
    LikeOutlined,
    LikeFilled,
    CommentOutlined,
    ShareAltOutlined,
    UserOutlined,
    BookOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    MoreOutlined,
    SyncOutlined,
    SmileOutlined,
    SendOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
    PaperClipOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FileZipOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosConfig from "~/utils/axiosConfig";
import { DEFAULT_BANNER, HERO_IMAGE } from "~/utils/constant";
import EmojiPicker from "emoji-picker-react";
import secureLocalStorage from "react-secure-storage";

// Configure day.js
dayjs.extend(relativeTime);

const { Text, Title } = Typography;
const { confirm } = Modal;

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
                    className="comment-textarea borderless-input"
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
    const [commentVisible, setCommentVisible] = useState({});
    const [replyVisible, setReplyVisible] = useState({});
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState({});
    const [form] = Form.useForm();
    const [description, setDescription] = useState("");
    const [lastUpdated, setLastUpdated] = useState(dayjs());
    const [previewImage, setPreviewImage] = useState(DEFAULT_BANNER);
    const [isModalVisible, setIsModalVisible] = useState(false); // Add this line
    const userID = secureLocalStorage.getItem("userID");

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
                // refetchInterval: 10000, // Poll every 10 seconds
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

    // Delete announcement mutation
    const deleteAnnouncement = useMutation(
        (announcementId) => {
            return axiosConfig.delete(`announcements/${announcementId}`);
        },
        {
            onSuccess: () => {
                message.success("Announcement deleted!");
                queryClient.invalidateQueries(["announcements", id]);
            },
        }
    );

    // Delete comment mutation
    const deleteComment = useMutation(
        (commentId) => {
            return axiosConfig.delete(`comments/${commentId}`);
        },
        {
            onSuccess: () => {
                message.success("Comment deleted!");
                queryClient.invalidateQueries(["announcements", id]);
            },
        }
    );

    // Delete reply mutation
    const deleteReply = useMutation(
        (replyId) => {
            return axiosConfig.delete(`replies/${replyId}`);
        },
        {
            onSuccess: () => {
                message.success("Reply deleted!");
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
        setCommentVisible((prev) => ({ ...prev, [announcementId]: false }));
    };

    const handleReplySubmit = (announcementId, commentId) => {
        const key = `${announcementId}-${commentId}`;
        if (!replyText[key]?.trim()) return;
        addReply.mutate({ commentId, content: replyText[key] });
        setReplyVisible((prev) => ({ ...prev, [key]: false }));
    };

    const toggleComment = (id) => {
        setCommentVisible((prev) => ({ ...prev, [id]: !prev[id] }));
        if (!commentVisible[id]) {
            setTimeout(() => {
                const input = document.querySelector(
                    `.announcement-${id} .comment-textarea`
                );
                if (input) input.focus();
            }, 100);
        }
    };

    const toggleReply = (announcementId, commentId) => {
        const key = `${announcementId}-${commentId}`;
        setReplyVisible((prev) => ({ ...prev, [key]: !prev[key] }));
        if (!replyVisible[key]) {
            setTimeout(() => {
                const input = document.querySelector(
                    `.comment-${commentId} .reply-textarea`
                );
                if (input) input.focus();
            }, 100);
        }
    };

    const showDeleteConfirm = (type, id, content = "") => {
        confirm({
            title: `Are you sure you want to delete this ${type}?`,
            icon: <ExclamationCircleFilled />,
            content: content,
            okText: "Yes, delete it",
            okType: "danger",
            cancelText: "No",
            onOk() {
                if (type === "announcement") {
                    deleteAnnouncement.mutate(id);
                } else if (type === "comment") {
                    deleteComment.mutate(id);
                } else if (type === "reply") {
                    deleteReply.mutate(id);
                }
            },
        });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const renderMoreMenu = (item, type) => {
        const items = [
            {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                onClick: () => {
                    showDeleteConfirm(
                        type,
                        item.id,
                        type === "announcement" ? item.title : item.content
                    );
                },
            },
        ];

        return (
            <Dropdown menu={{ items }} trigger={["click"]}>
                <Button
                    type="text"
                    icon={<MoreOutlined />}
                    className="more-button"
                />
            </Dropdown>
        );
    };

    const renderLikeButton = (item, type = "announcement") => {
        const isLiked = item.is_liked; // Comes from backend
        const likeCount = item.likes_count || 0; // Also from backend

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

    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

    return (
        <div className="broadcast-container">
            <Card
                loading={isClassroomLoading || isAnnouncementsLoading}
                title=""
                className="classroom-card-details"
                style={{ "--preview-image": `url(${previewImage})` }}
            >
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
            </Card>

            {/* Facebook-like input to open modal */}
            <div
                className="facebook-input-container"
                onClick={() => setIsModalVisible(true)}
            >
                <div className="facebook-input">
                    <Avatar src={classroom?.user?.avatar} size={40} />
                    <div className="facebook-input-placeholder">
                        Share something with the class...
                    </div>
                </div>
            </div>

            {/* Modal for creating announcement */}
            <Modal
                title="Create Announcement"
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setDescription("");
                }}
                footer={null}
                width={700}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        if (!description.trim()) {
                            message.warning("Please enter content");
                            return;
                        }
                        createAnnouncement.mutate({ ...values, description });
                        setIsModalVisible(false);
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
                        <div className="description-input-wrapper">
                            <Input.TextArea
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write your announcement..."
                                className="announcement-textarea"
                            />
                            <Popover
                                content={
                                    <EmojiPicker
                                        onEmojiClick={(emojiData) => {
                                            setDescription(
                                                description + emojiData.emoji
                                            );
                                        }}
                                        width={300}
                                        height={350}
                                        emojiStyle="native"
                                    />
                                }
                                trigger="click"
                                placement="topRight"
                            >
                                <Button
                                    type="text"
                                    icon={<SmileOutlined />}
                                    className="emoji-button"
                                />
                            </Popover>
                        </div>
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
            </Modal>

            <List
                itemLayout="vertical"
                dataSource={announcements}
                locale={{
                    emptyText: (
                        <div
                            style={{
                                textAlign: "center",
                                color: "rgba(0, 0, 0, 0.25)",
                            }}
                        >
                            <Empty description="No annoucment yet" />
                        </div>
                    ),
                }}
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
                            {item.user?.id === userID && (
                                <div className="announcement-actions-right">
                                    {renderMoreMenu(item, "announcement")}
                                </div>
                            )}
                        </div>

                        <Title level={4} className="announcement-title">
                            {item.title}
                        </Title>

                        <div
                            className="announcement-content"
                            dangerouslySetInnerHTML={{
                                __html: item.description
                                    .replace(/\n/g, "<br />")
                                    .replace(
                                        /(https?:\/\/[^\s]+)/g,
                                        '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#647fff; text-decoration:underline;">$1</a>'
                                    ),
                            }}
                        />

                        {item.attachments?.length > 0 && (
                            <div className="attachments">
                                {item.attachments.map((attach) => {
                                    // Determine icon based on MIME type
                                    let fileIcon;
                                    let iconColor = "#1890ff"; // Default blue color

                                    if (attach.mime_type) {
                                        if (
                                            attach.mime_type.includes("image/")
                                        ) {
                                            fileIcon = <FileImageOutlined />;
                                            iconColor = "#52c41a"; // Green for images
                                        } else if (
                                            attach.mime_type.includes("pdf")
                                        ) {
                                            fileIcon = <FilePdfOutlined />;
                                            iconColor = "#ff4d4f"; // Red for PDFs
                                        } else if (
                                            attach.mime_type.includes("word") ||
                                            attach.mime_type.includes(
                                                "msword"
                                            ) ||
                                            attach.mime_type.includes(
                                                "document"
                                            )
                                        ) {
                                            fileIcon = <FileWordOutlined />;
                                            iconColor = "#2b579a"; // MS Word blue
                                        } else if (
                                            attach.mime_type.includes(
                                                "excel"
                                            ) ||
                                            attach.mime_type.includes(
                                                "spreadsheet"
                                            )
                                        ) {
                                            fileIcon = <FileExcelOutlined />;
                                            iconColor = "#217346"; // Excel green
                                        } else if (
                                            attach.mime_type.includes(
                                                "powerpoint"
                                            ) ||
                                            attach.mime_type.includes(
                                                "presentation"
                                            )
                                        ) {
                                            fileIcon = <FilePptOutlined />;
                                            iconColor = "#d24726"; // PowerPoint orange
                                        } else if (
                                            attach.mime_type.includes("text/")
                                        ) {
                                            fileIcon = <FileTextOutlined />;
                                            iconColor = "#595959"; // Dark gray for text
                                        } else if (
                                            attach.mime_type.includes("zip") ||
                                            attach.mime_type.includes(
                                                "compressed"
                                            )
                                        ) {
                                            fileIcon = <FileZipOutlined />;
                                            iconColor = "#faad14"; // Yellow for archives
                                        } else {
                                            fileIcon = <PaperClipOutlined />;
                                        }
                                    } else {
                                        fileIcon = <PaperClipOutlined />;
                                    }

                                    return (
                                        <div
                                            key={attach.id}
                                            className="attachment"
                                        >
                                            <Tooltip
                                                title={
                                                    attach.mime_type ||
                                                    "Unknown file type"
                                                }
                                            >
                                                <span
                                                    className="file-icon"
                                                    style={{ color: iconColor }}
                                                >
                                                    {fileIcon}
                                                </span>
                                            </Tooltip>
                                            <a
                                                href={attach.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="file-link"
                                            >
                                                {attach.name}
                                                <span className="file-size">
                                                    {formatFileSize(
                                                        attach.size
                                                    )}
                                                </span>
                                            </a>
                                        </div>
                                    );
                                })}
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
                                    active={commentVisible[item.id]}
                                    onClick={() => toggleComment(item.id)}
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

                        {/* Comments section */}
                        <div className="comments-section">
                            {item.comments?.map((comment) => (
                                <div
                                    key={comment.id}
                                    className={`comment comment-${comment.id}`}
                                >
                                    <Avatar
                                        src={comment.user?.avatar}
                                        size={32}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-content">
                                        <div className="comment-bubble">
                                            <span className="comment-author">
                                                {comment.user?.name}
                                            </span>

                                            {comment.user?.id === userID && (
                                                <div className="comment-actions">
                                                    {renderMoreMenu(
                                                        comment,
                                                        "comment"
                                                    )}
                                                </div>
                                            )}
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
                                                onClick={() =>
                                                    toggleReply(
                                                        item.id,
                                                        comment.id
                                                    )
                                                }
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
                                                            key={reply.id}
                                                            className="reply"
                                                        >
                                                            <Avatar
                                                                src={
                                                                    reply.user
                                                                        ?.avatar
                                                                }
                                                                size={28}
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
                                                                    {reply.user
                                                                        ?.id ===
                                                                        userID && (
                                                                        <div className="reply-actions">
                                                                            {renderMoreMenu(
                                                                                reply,
                                                                                "reply"
                                                                            )}
                                                                        </div>
                                                                    )}
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
                                        {replyVisible[
                                            `${item.id}-${comment.id}`
                                        ] && (
                                            <div className="reply-form">
                                                <CommentInput
                                                    value={
                                                        replyText[
                                                            `${item.id}-${comment.id}`
                                                        ] || ""
                                                    }
                                                    onChange={(value) =>
                                                        setReplyText(
                                                            (prev) => ({
                                                                ...prev,
                                                                [`${item.id}-${comment.id}`]:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                    onSubmit={() =>
                                                        handleReplySubmit(
                                                            item.id,
                                                            comment.id
                                                        )
                                                    }
                                                    onCancel={() =>
                                                        toggleReply(
                                                            item.id,
                                                            comment.id
                                                        )
                                                    }
                                                    placeholder="Write a reply..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Comment form */}
                            {commentVisible[item.id] && (
                                <div className="comment-form">
                                    <CommentInput
                                        value={commentText}
                                        onChange={setCommentText}
                                        onSubmit={() =>
                                            handleCommentSubmit(item.id)
                                        }
                                        onCancel={() => toggleComment(item.id)}
                                        placeholder="Write a comment..."
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            />

            <style jsx global>{`
                .broadcast-container {
                    max-width: 900px;
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
                        height: 400px;
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
                            position: relative;

                            .announcement-meta {
                                margin-left: 12px;
                                display: flex;
                                flex-direction: column;
                                .ant-typography-strong {
                                    display: block;
                                }
                            }

                            .announcement-actions-right {
                                position: absolute;
                                right: 0;
                                top: 0;

                                .more-button {
                                    color: #65676b;
                                }
                            }
                        }

                        .announcement-title {
                            margin-bottom: 10px;
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

                        .comments-section {
                            padding: 0 12px;

                            .comment {
                                display: flex;
                                margin: 8px 0;

                                .comment-avatar {
                                    margin-right: 8px;
                                }

                                .comment-content {
                                    flex: 1;

                                    .comment-bubble {
                                        background-color: #f0f2f5;
                                        border-radius: 18px;
                                        padding: 8px 12px;
                                        display: inline-block;
                                        max-width: 100%;
                                        position: relative;

                                        .comment-author {
                                            font-weight: 600;
                                            margin-right: 6px;
                                            color: #385898;
                                        }

                                        .comment-actions {
                                            position: absolute;
                                            right: -34px;
                                            top: 2px;
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
                                            margin: 8px 0;

                                            .reply-avatar {
                                                margin-right: 8px;
                                            }

                                            .reply-content {
                                                .reply-bubble {
                                                    background-color: #f0f2f5;
                                                    border-radius: 18px;
                                                    padding: 8px 12px;
                                                    display: inline-block;
                                                    max-width: 100%;
                                                    position: relative;

                                                    .reply-author {
                                                        font-weight: 600;
                                                        margin-right: 6px;
                                                        color: #385898;
                                                    }

                                                    .reply-actions {
                                                        position: absolute;
                                                        right: -34px;
                                                        top: 2px;
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
                                        margin-top: 12px;
                                    }
                                }
                            }

                            .comment-form {
                                margin-top: 12px;
                            }
                        }
                    }

                    .comment-input-container {
                        display: flex;
                        flex-direction: column;

                        .comment-input-wrapper {
                            display: flex;
                            align-items: center;
                            background-color: #f0f2f5;
                            border-radius: 18px;
                            padding: 8px 12px;
                            padding-top: 12px;

                            .comment-textarea {
                                flex: 1;
                                border: none;
                                background: transparent;
                                resize: none;
                                max-height: 100px;
                                padding: 0;

                                &:focus {
                                    outline: none;
                                }
                            }

                            .emoji-button {
                                color: #65676b;
                                padding: 0;
                                margin-left: 8px;
                            }
                        }

                        .comment-buttons {
                            display: flex;
                            justify-content: flex-end;
                            margin-top: 8px;
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
                .description-input-wrapper {
                    position: relative;
                }

                .announcement-textarea {
                    min-height: 120px;
                    resize: vertical;
                    padding-right: 32px; /* Make space for emoji button */
                }

                .description-input-wrapper .emoji-button {
                    position: absolute;
                    right: 8px;
                    bottom: 8px;
                    z-index: 1;
                    color: #888;
                }

                .description-input-wrapper .emoji-button:hover {
                    color: #1890ff;
                }
                .edit-indicator {
                    font-size: 12px;
                    color: #999;
                    margin-left: 5px;
                    font-style: italic;
                }

                .edit-form {
                    margin-top: 10px;
                    padding: 10px;
                    background: #f5f5f5;
                    border-radius: 4px;
                }

                .attachments {
                    margin: 15px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .attachment {
                    display: flex;
                    align-items: center;
                    padding: 6px 10px;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                    transition: background-color 0.3s;
                }

                .attachment:hover {
                    background-color: #e6f7ff;
                }

                .file-icon {
                    font-size: 18px;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                }

                .file-link {
                    display: flex;
                    align-items: center;
                    color: #333;
                    text-decoration: none;
                    flex-grow: 1;
                }

                .file-link:hover {
                    color: #1890ff;
                }

                .file-size {
                    margin-left: 8px;
                    font-size: 12px;
                    color: #888;
                }

                .facebook-input-container {
                    background: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    margin-bottom: 20px;
                    cursor: pointer;
                }

                .facebook-input {
                    display: flex;s
                    align-items: center;
                    border: 1px solid #ddd;
                    border-radius: 50px;
                    padding: 8px 12px;
                    background-color: #f0f2f5;
                }

                .facebook-input-placeholder {
                    margin-left: 10px;
                    color: #65676b;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                }

                .facebook-input:hover {
                    background-color: #e4e6e9;
                }
            `}</style>
        </div>
    );
};

export default BroadcastPage;
