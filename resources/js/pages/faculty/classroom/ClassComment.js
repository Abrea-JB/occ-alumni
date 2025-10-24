import React, { useState, useRef, useEffect } from "react";
import { 
    Avatar, 
    Button, 
    Card, 
    Divider, 
    Input, 
    List, 
    Space, 
    Tag, 
    Typography,
    Dropdown,
    Menu,
    message,
    Modal
} from "antd";
import { 
    CommentOutlined, 
    UserOutlined, 
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import axiosConfig from '~/utils/axiosConfig';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import secureLocalStorage from "react-secure-storage";

const { TextArea } = Input;
const { Text } = Typography;

const ClassComment = ({ classworkId }) => {
    const commentsEndRef = useRef(null);
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const userID = secureLocalStorage.getItem("userID");

    // Fetch comments from API
    const { data: comments = [], isLoading, isError, refetch } = useQuery(
        ['classMessages', classworkId],
        async () => {
            const response = await axiosConfig.get(
                `classwork/${classworkId}/class-messages`
            );
            return response.data.map(comment => ({
                ...comment,
                id: comment.id.toString(),
                author: comment.sender_type === 'teacher' ? 
                    comment.teacher?.name || 'Teacher' : 
                    (comment.user_id === userID ? 'You' : comment.user?.name || 'Student'),
                datetime: dayjs(comment.created_at).fromNow(),
                avatar: comment.sender_type === 'teacher' ? 
                    comment.teacher?.avatar : 
                    comment.user?.avatar,
                isMine: comment.sender_type === 'student' && comment.user_id === userID
            }));
        },
        {
            enabled: !!classworkId,
            refetchInterval: 10000,
        }
    );

    // Create comment mutation
    const createCommentMutation = useMutation(
        async (content) => {
            const response = await axiosConfig.post(
                `classwork/${classworkId}/class-messages`,
                { content }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['classMessages', classworkId]);
                message.success('Comment posted successfully');
            },
            onError: () => {
                message.error('Failed to post comment');
            }
        }
    );

    // Update comment mutation
    const updateCommentMutation = useMutation(
        async ({ commentId, content }) => {
            const response = await axiosConfig.put(
                `classwork/${classworkId}/class-messages/${commentId}`,
                { content }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['classMessages', classworkId]);
                message.success('Comment updated successfully');
            },
            onError: () => {
                message.error('Failed to update comment');
            }
        }
    );

    // Delete comment mutation
    const deleteCommentMutation = useMutation(
        async (commentId) => {
            await axiosConfig.delete(
                `classwork/${classworkId}/class-messages/${commentId}`
            );
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['classMessages', classworkId]);
                message.success('Comment deleted successfully');
            },
            onError: () => {
                message.error('Failed to delete comment');
            }
        }
    );

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;

        if (editingComment) {
            updateCommentMutation.mutate({
                commentId: editingComment,
                content: newComment.trim()
            });
        } else {
            createCommentMutation.mutate(newComment.trim());
        }
        
        setNewComment("");
        setEditingComment(null);
    };

    const handleEditComment = (comment) => {
        setNewComment(comment.content);
        setEditingComment(comment.id);
    };

    const handleDeleteComment = (commentId) => {
        deleteCommentMutation.mutate(commentId);
        setIsModalVisible(false);
    };

    const showDeleteConfirm = (commentId) => {
        setCommentToDelete(commentId);
        setIsModalVisible(true);
    };

    const commentMenu = (comment) => (
        <Menu>
            <Menu.Item 
                icon={<EditOutlined />} 
                onClick={() => handleEditComment(comment)}
            >
                Edit
            </Menu.Item>
            <Menu.Item 
                icon={<DeleteOutlined />} 
                onClick={() => showDeleteConfirm(comment.id)}
                danger
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    // Auto-scroll to bottom when new comments are added
    useEffect(() => {
        if (comments.length > 0) {
            setTimeout(() => {
                commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [comments]);

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading comments...</div>;
    }
  
    if (isError) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Failed to load comments</p>
                <Button onClick={() => refetch()}>Retry</Button>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ 
                flex: 1, 
                padding: "0 16px",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                marginBottom: "16px",
                overflowY: "auto"
            }}>
                <List
                    dataSource={comments}
                    renderItem={(item) => (
                        <List.Item style={{ padding: "12px 0" }}>
                            <Card 
                                size="small" 
                                style={{ width: "100%" }} 
                                bodyStyle={{ padding: 12 }}
                            >
                                <Space align="start">
                                    {item.avatar ? (
                                        <Avatar src={item.avatar} />
                                    ) : (
                                        <Avatar icon={<UserOutlined />} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <Space size="small" style={{ width: '100%', justifyContent: 'space-between' }}>
                                            <Space size="small">
                                                <Text strong>{item.author}</Text>
                                                <Text type="secondary">{item.datetime}</Text>
                                                {item.isPrivate && <Tag color="orange">Private</Tag>}
                                            </Space>
                                            {item.isMine && (
                                                <Dropdown 
                                                    overlay={commentMenu(item)} 
                                                    trigger={['click']}
                                                    placement="bottomRight"
                                                >
                                                    <Button 
                                                        type="text" 
                                                        icon={<EllipsisOutlined />} 
                                                        size="small"
                                                    />
                                                </Dropdown>
                                            )}
                                        </Space>
                                        <Text style={{ display: "block", marginTop: 4 }}>
                                            {item.content}
                                        </Text>
                                    </div>
                                </Space>
                            </Card>
                        </List.Item>
                    )}
                />
                <div ref={commentsEndRef} />
            </div>

            <Divider />

            <div style={{ marginTop: "auto" }}>
                <TextArea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={editingComment ? "Edit your comment..." : "Add a class comment..."}
                    style={{ marginBottom: 8 }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={handleSubmitComment}
                        icon={<CommentOutlined />}
                        loading={createCommentMutation.isLoading || updateCommentMutation.isLoading}
                    >
                        {editingComment ? "Update Comment" : "Post to Class"}
                    </Button>
                    {editingComment && (
                        <Button onClick={() => {
                            setEditingComment(null);
                            setNewComment("");
                        }}>
                            Cancel
                        </Button>
                    )}
                </Space>
            </div>

            {/* Delete confirmation modal */}
            <Modal
                title="Confirm Delete"
                visible={isModalVisible}
                onOk={() => handleDeleteComment(commentToDelete)}
                onCancel={() => setIsModalVisible(false)}
                okText="Delete"
                okButtonProps={{ danger: true }}
                confirmLoading={deleteCommentMutation.isLoading}
            >
                <p>Are you sure you want to delete this comment?</p>
            </Modal>
        </div>
    );
};

export default ClassComment;