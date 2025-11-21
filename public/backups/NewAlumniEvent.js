import React, { useState, useMemo } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Select,
    Tag,
    Avatar,
    Typography,
    Space,
    Divider,
    List,
    Tabs,
    Badge,
    Dropdown,
    Menu,
    Modal,
    Form,
    DatePicker,
    TimePicker,
    Switch,
    Progress,
    Rate,
    Tooltip,
    Statistic,
    Upload,
    message,
    Steps,
    Cascader,
    InputNumber,
    Carousel,
    Image,
    Alert,
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    TeamOutlined,
    DollarOutlined,
    UserOutlined,
    PlusOutlined,
    UploadOutlined,
    MoreOutlined,
    VideoCameraOutlined,
    ShareAltOutlined,
    HeartOutlined,
    BookOutlined,
    TrophyOutlined,
    StarOutlined,
    CheckCircleOutlined,
    DownloadOutlined,
    GlobalOutlined,
    PhoneOutlined,
    MailOutlined,
    CopyOutlined,
    SolutionOutlined,
    IdcardOutlined,
    UserSwitchOutlined,
    CustomerServiceOutlined,
    FileTextOutlined,
    SmileOutlined,
    ToolOutlined,
    ReadOutlined,
    ShoppingOutlined,
    RocketOutlined,
    CodeOutlined,
    UserAddOutlined,
    GiftOutlined,
    AudioOutlined,
    BankOutlined,
    DesktopOutlined,
    ShareAltOutlined as ShareIcon,
    PictureOutlined,
    PhoneFilled,
    MailFilled,
    LinkOutlined,
    PlayCircleOutlined,
    SafetyCertificateOutlined,
    LikeOutlined,
    DislikeOutlined,
    MessageOutlined,
    ExclamationCircleOutlined,
    CloseCircleOutlined,
    CloseOutlined,
    InfoCircleOutlined,
    TagsOutlined, // Added for tags in details modal
    HeartFilled, // Added for liked state in details modal
} from "@ant-design/icons";
import moment from "moment";
import "./AlumniEvents.css";
import { Layout, Breadcrumb } from "~/components";
import axiosConfig from "~/utils/axiosConfig";
import useEvents from "~/hooks/useEvents";
import secureLocalStorage from "react-secure-storage";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const eventTypes = [
    {
        value: "all",
        label: "All Events",
        color: "default",
        icon: <CalendarOutlined />,
    },

    {
        value: "job-fair",
        label: "Job Fair",
        color: "geekblue",
        icon: <SolutionOutlined />,
    },
    {
        value: "hiring",
        label: "Hiring Event",
        color: "cyan",
        icon: <IdcardOutlined />,
    },
    {
        value: "interview",
        label: "Interview Day",
        color: "blue",
        icon: <UserSwitchOutlined />,
    },
    {
        value: "career-networking",
        label: "Career Networking",
        color: "gold",
        icon: <TeamOutlined />,
    },
    {
        value: "career-coaching",
        label: "Career Coaching",
        color: "purple",
        icon: <CustomerServiceOutlined />,
    },
    {
        value: "resume",
        label: "Resume Workshop",
        color: "orange",
        icon: <FileTextOutlined />,
    },
    {
        value: "internship",
        label: "Internship Event",
        color: "volcano",
        icon: <SmileOutlined />,
    },
    {
        value: "apprenticeship",
        label: "Apprenticeship Event",
        color: "magenta",
        icon: <ToolOutlined />,
    },

    {
        value: "conference",
        label: "Conference",
        color: "purple",
        icon: <VideoCameraOutlined />,
    },
    {
        value: "workshop",
        label: "Workshop",
        color: "orange",
        icon: <UserOutlined />,
    },
    {
        value: "seminar",
        label: "Seminar",
        color: "red",
        icon: <ReadOutlined />,
    },
    {
        value: "trade-show",
        label: "Trade Show",
        color: "geekblue",
        icon: <ShoppingOutlined />,
    },
    {
        value: "pitch",
        label: "Startup Pitch",
        color: "lime",
        icon: <RocketOutlined />,
    },
    {
        value: "fundraising",
        label: "Fundraising",
        color: "gold",
        icon: <DollarOutlined />,
    },
    {
        value: "networking",
        label: "Networking",
        color: "blue",
        icon: <TeamOutlined />,
    },

    {
        value: "class",
        label: "Class / Training",
        color: "green",
        icon: <BookOutlined />,
    },
    {
        value: "hackathon",
        label: "Hackathon",
        color: "volcano",
        icon: <CodeOutlined />,
    },
    {
        value: "mentoring",
        label: "Mentoring",
        color: "cyan",
        icon: <UserAddOutlined />,
    },

    {
        value: "sports",
        label: "Sports",
        color: "green",
        icon: <TrophyOutlined />,
    },
    {
        value: "fitness",
        label: "Fitness",
        color: "lime",
        icon: <HeartOutlined />,
    },

    {
        value: "showcase",
        label: "Showcase",
        color: "red",
        icon: <StarOutlined />,
    },
    {
        value: "festival",
        label: "Festival",
        color: "magenta",
        icon: <GiftOutlined />,
    },
    {
        value: "concert",
        label: "Concert",
        color: "purple",
        icon: <AudioOutlined />,
    },
    { value: "party", label: "Party", color: "volcano", icon: <SmileOutlined /> },

    { value: "expo", label: "Expo", color: "blue", icon: <BankOutlined /> },

    {
        value: "virtual",
        label: "Virtual",
        color: "cyan",
        icon: <GlobalOutlined />,
    },
    {
        value: "webinar",
        label: "Webinar",
        color: "geekblue",
        icon: <DesktopOutlined />,
    },
    {
        value: "hybrid",
        label: "Hybrid Event",
        color: "gold",
        icon: <ShareAltOutlined />,
    },
];

const eventCategories = [
    { value: "all", label: "All Categories" },
    { value: "professional", label: "Professional Development" },
    { value: "social", label: "Social & Networking" },
    { value: "recreational", label: "Recreational" },
    { value: "educational", label: "Educational" },
    { value: "philanthropy", label: "Philanthropy & Service" },
    { value: "campus_traditions", label: "Campus & Traditions" },
    { value: "student_engagement", label: "Student Engagement" },
    { value: "regional_global", label: "Regional & Global Chapters" },
    { value: "family", label: "Family & Community" },
    { value: "arts_culture", label: "Arts & Cultural" },
    { value: "athletics", label: "Athletics & Spirit" },
    { value: "virtual", label: "Virtual / Hybrid" },
    { value: "affinity", label: "Affinity & Identity Groups" },
];

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const sortOptions = [
    { value: "date-asc", label: "Date: Earliest First" },
    { value: "date-desc", label: "Date: Latest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" },
    { value: "title-asc", label: "Title: A to Z" },
    { value: "capacity", label: "Availability" },
];

const getEventTypeConfig = (type) => {
    return eventTypes.find((et) => et.value === type) || eventTypes[0];
};

const EventDetailsModal = ({ event, visible, onClose, onEdit, onDelete, onDuplicate, onRegister }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerForm] = Form.useForm();

    if (!event) return null;

    const handleRegister = () => {
        setShowRegisterModal(true);
    };

    const handleRegisterSubmit = async (values) => {
        try {
            // Call parent onRegister function if provided
            if (onRegister) {
                await onRegister(event, values);
            }
            setIsRegistered(true);
            setShowRegisterModal(false);
            registerForm.resetFields();
            message.success(`Successfully registered for ${event.title}!`);
        } catch (error) {
            message.error("Failed to register. Please try again.");
        }
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        message.success(
            isLiked ? "Removed from favorites" : "Added to favorites"
        );
    };

    const handleShare = (platform) => {
        const eventUrl = window.location.href;
        const eventTitle = encodeURIComponent(event.title);
        const eventDescription = encodeURIComponent(event.description);
        
        let shareUrl = '';
        
        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(eventUrl);
                message.success("Event link copied to clipboard!");
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${eventUrl}&text=${eventTitle}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${eventTitle}%20${eventUrl}`;
                window.open(shareUrl, '_blank', 'width=600,height=400');
                break;
            case 'email':
                shareUrl = `mailto:?subject=${eventTitle}&body=${eventDescription}%0A%0A${eventUrl}`;
                window.location.href = shareUrl;
                break;
            default:
                break;
        }
    };

    const menu = (
        <Menu>
            <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => {
                    onEdit(event);
                    onClose();
                }}
            >
                Edit Event
            </Menu.Item>
            <Menu.Item 
                key="duplicate" 
                icon={<CopyOutlined />}
                onClick={() => {
                    if (onDuplicate) {
                        onDuplicate(event);
                    }
                    onClose();
                }}
            >
                Duplicate Event
            </Menu.Item>
            <Menu.Divider />
            <Menu.SubMenu
                key="share"
                icon={<ShareAltOutlined />}
                title="Share Event"
            >
                <Menu.Item 
                    key="copy" 
                    icon={<LinkOutlined />}
                    onClick={() => handleShare('copy')}
                >
                    Copy Link
                </Menu.Item>
                <Menu.Item 
                    key="facebook" 
                    onClick={() => handleShare('facebook')}
                >
                    Facebook
                </Menu.Item>
                <Menu.Item 
                    key="twitter" 
                    onClick={() => handleShare('twitter')}
                >
                    Twitter
                </Menu.Item>
                <Menu.Item 
                    key="linkedin" 
                    onClick={() => handleShare('linkedin')}
                >
                    LinkedIn
                </Menu.Item>
                <Menu.Item 
                    key="whatsapp" 
                    onClick={() => handleShare('whatsapp')}
                >
                    WhatsApp
                </Menu.Item>
                <Menu.Item 
                    key="email" 
                    icon={<MailOutlined />}
                    onClick={() => handleShare('email')}
                >
                    Email
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="export" icon={<DownloadOutlined />}>
                Export Registrations
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item 
                key="delete" 
                icon={<DeleteOutlined />} 
                danger
                onClick={() => {
                    Modal.confirm({
                        title: 'Delete Event',
                        icon: <ExclamationCircleOutlined />,
                        content: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
                        okText: 'Delete',
                        okType: 'danger',
                        cancelText: 'Cancel',
                        onOk: () => {
                            if (onDelete) {
                                onDelete(event);
                            }
                            onClose();
                        }
                    });
                }}
            >
                Delete Event
            </Menu.Item>
        </Menu>
    );

    const shareMenu = (
        <Menu>
            <Menu.Item 
                key="copy" 
                icon={<LinkOutlined />}
                onClick={() => handleShare('copy')}
            >
                Copy Link
            </Menu.Item>
            <Menu.Item 
                key="facebook" 
                onClick={() => handleShare('facebook')}
            >
                Facebook
            </Menu.Item>
            <Menu.Item 
                key="twitter" 
                onClick={() => handleShare('twitter')}
            >
                Twitter
            </Menu.Item>
            <Menu.Item 
                key="linkedin" 
                onClick={() => handleShare('linkedin')}
            >
                LinkedIn
            </Menu.Item>
            <Menu.Item 
                key="whatsapp" 
                onClick={() => handleShare('whatsapp')}
            >
                WhatsApp
            </Menu.Item>
            <Menu.Item 
                key="email" 
                icon={<MailOutlined />}
                onClick={() => handleShare('email')}
            >
                Email
            </Menu.Item>
        </Menu>
    );

    return (
        <>
        <Modal
            title={
                <div className="event-detail-header">
                    <Title level={3} style={{ margin: 0 }}>
                        {event.title}
                    </Title>
                    <div className="event-header-actions">
                        <Tooltip
                            title={
                                isLiked
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                            }
                        >
                            <Button
                                type="text"
                                icon={
                                    <HeartOutlined
                                        style={{
                                            color: isLiked ? "#ff4d4f" : "#999",
                                            fontSize: 20,
                                        }}
                                    />
                                }
                                onClick={handleLike}
                            />
                        </Tooltip>
                        <Dropdown overlay={shareMenu} trigger={["click"]}>
                            <Tooltip title="Share event">
                                <Button
                                    type="text"
                                    icon={
                                        <ShareAltOutlined
                                            style={{ fontSize: 20 }}
                                        />
                                    }
                                />
                            </Tooltip>
                        </Dropdown>
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Button
                                type="text"
                                icon={
                                    <MoreOutlined style={{ fontSize: 20 }} />
                                }
                            />
                        </Dropdown>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            className="event-details-modal"
            style={{ top: 20 }}
        >
            <div className="event-details-content">
                {/* Image Gallery */}
                <div className="event-gallery-section">
                    {event.images && event.images.length > 0 ? (
                        <Carousel autoplay dotPosition="bottom">
                            {event.images.map((img, index) => (
                                <div key={index} className="carousel-slide">
                                    <img
                                        src={img || "/placeholder.svg"}
                                        alt={`${event.title} - ${index + 1}`}
                                        className="event-detail-image"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <div className="image-placeholder">
                            <PictureOutlined style={{ fontSize: 64 }} />
                            <Text type="secondary">No images available</Text>
                        </div>
                    )}
                </div>

                {/* Event Details Body */}
                <div className="event-details-body">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={16}>
                            {/* Status and Meta */}
                            <div className="event-status-header">
                                <Space size="middle">
                                    <Tag
                                        color={
                                            eventTypes.find(
                                                (t) =>
                                                    t.value === event.eventType
                                            )?.color
                                        }
                                    >
                                        {event.eventType}
                                    </Tag>
                                    <Badge
                                        status={
                                            event.status === "upcoming"
                                                ? "success"
                                                : event.status === "ongoing"
                                                ? "processing"
                                                : "default"
                                        }
                                        text={
                                            event.status 
                                                ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
                                                : 'Unknown'
                                        }
                                    />
                                    {event.featured && (
                                        <Tag
                                            icon={<StarOutlined />}
                                            color="gold"
                                        >
                                            Featured
                                        </Tag>
                                    )}
                                </Space>
                                <Rate disabled value={event.rating} />
                            </div>

                            <Divider />

                            {/* Description */}
                            <Card
                                title={
                                    <Space>
                                        <InfoCircleOutlined />
                                        <Text strong>About This Event</Text>
                                    </Space>
                                }
                                bordered={false}
                            >
                                <Paragraph className="event-description-detailed">
                                    {event.description}
                                </Paragraph>
                            </Card>

                            {/* Event Details Grid */}
                            <Card
                                title={
                                    <Space>
                                        <CalendarOutlined />
                                        <Text strong>Event Details</Text>
                                    </Space>
                                }
                                className="event-details-grid"
                                bordered={false}
                            >
                                <Space
                                    direction="vertical"
                                    size="middle"
                                    style={{ width: "100%" }}
                                >
                                    <div className="detail-item-large">
                                        <CalendarOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text type="secondary" strong>
                                                Date
                                            </Text>
                                            <Text>
                                                {moment(event.date).format(
                                                    "dddd, MMMM Do YYYY"
                                                )}
                                            </Text>
                                        </div>
                                    </div>

                                    <div className="detail-item-large">
                                        <ClockCircleOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text type="secondary" strong>
                                                Time
                                            </Text>
                                            <Text>{`${event.startTime} - ${event.endTime}`}</Text>
                                        </div>
                                    </div>

                                    <div className="detail-item-large">
                                        <EnvironmentOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text type="secondary" strong>
                                                Location
                                            </Text>
                                            <Text>{event.location}</Text>
                                        </div>
                                    </div>

                                    <div className="detail-item-large">
                                        <UserOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text type="secondary" strong>
                                                Organizer
                                            </Text>
                                            <Text>{event.organizer}</Text>
                                        </div>
                                    </div>

                                    <div className="detail-item-large">
                                        <TeamOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text type="secondary" strong>
                                                Capacity
                                            </Text>
                                            <Text>{event.capacity} attendees</Text>
                                        </div>
                                    </div>
                                </Space>
                            </Card>

                            {/* Registration Progress */}
                            {event.registered && event.capacity && (
                                <Card
                                    title={
                                        <Space>
                                            <TeamOutlined />
                                            <Text strong>
                                                Registration Status
                                            </Text>
                                        </Space>
                                    }
                                    className="registration-progress"
                                    bordered={false}
                                >
                                    <Space
                                        direction="vertical"
                                        size="small"
                                        style={{ width: "100%" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text strong>
                                                {event.registered} registered
                                            </Text>
                                            <Text type="secondary">
                                                {event.capacity - event.registered}{" "}
                                                spots left
                                            </Text>
                                        </div>
                                        <Progress
                                            percent={Math.round(
                                                (event.registered /
                                                    event.capacity) *
                                                    100
                                            )}
                                            status={
                                                event.registered >=
                                                event.capacity
                                                    ? "exception"
                                                    : "active"
                                            }
                                        />
                                    </Space>
                                </Card>
                            )}

                            {/* Agenda */}
                            {event.agenda && event.agenda.length > 0 && (
                                <Card
                                    title={
                                        <Space>
                                            <FileTextOutlined />
                                            <Text strong>Event Agenda</Text>
                                        </Space>
                                    }
                                    className="agenda-card"
                                    bordered={false}
                                >
                                    <List
                                        dataSource={event.agenda}
                                        renderItem={(item, index) => (
                                            <List.Item className="agenda-item">
                                                <Space
                                                    align="start"
                                                    style={{ width: "100%" }}
                                                >
                                                    <Tag
                                                        color="blue"
                                                        className="agenda-time"
                                                    >
                                                        {index + 1}
                                                    </Tag>
                                                    <div className="agenda-content">
                                                        <Text>{item}</Text>
                                                    </div>
                                                </Space>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            )}

                            {/* Tags */}
                            <Card
                                title={
                                    <Space>
                                        <TagsOutlined />
                                        <Text strong>Tags</Text>
                                    </Space>
                                }
                                className="tags-card"
                                bordered={false}
                            >
                                <div className="event-tags-detailed">
                                    {event.tags?.map((tag, index) => (
                                        <Tag
                                            key={index}
                                            className="event-tag-detailed"
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            {/* Pricing Card */}
                            <Card className="pricing-card" bordered={false}>
                                <div className="pricing-header">
                                    <Text type="secondary">Price</Text>
                                    {event.earlyBird ? (
                                        <div className="early-bird-pricing">
                                            <Title level={2} style={{ margin: 0 }}>
                                                ${event.earlyBird}
                                            </Title>
                                            <Tag color="green">Early Bird</Tag>
                                        </div>
                                    ) : (
                                        <Title level={2} style={{ margin: 0 }}>
                                            {event.price === 0
                                                ? "FREE"
                                                : `$${event.price}`}
                                        </Title>
                                    )}
                                    {event.earlyBird && (
                                        <Text delete type="secondary">
                                            Regular: ${event.price}
                                        </Text>
                                    )}
                                </div>

                                <Divider />

                                {isRegistered ? (
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        disabled
                                        icon={<CheckCircleOutlined />}
                                        className="register-btn"
                                    >
                                        Already Registered
                                    </Button>
                                ) : event.registered >= event.capacity ? (
                                    <Button
                                        type="default"
                                        size="large"
                                        block
                                        disabled
                                        icon={<CloseCircleOutlined />}
                                    >
                                        Event Full
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        size="large"
                                        block
                                        icon={<UserAddOutlined />}
                                        onClick={handleRegister}
                                        className="register-btn"
                                    >
                                        Register Now
                                    </Button>
                                )}

                                <Divider />

                                {/* Organizer Info */}
                                <Card
                                    title={
                                        <Space>
                                            <UserOutlined />
                                            <Text strong>Organizer</Text>
                                        </Space>
                                    }
                                    bordered={false}
                                    size="small"
                                >
                                    <div className="event-organizer-detailed">
                                        <div className="organizer-header">
                                            <Avatar
                                                size={48}
                                                icon={<UserOutlined />}
                                            />
                                            <div className="organizer-info">
                                                <Text strong>
                                                    {event.organizer}
                                                </Text>
                                                <Text type="secondary" style={{fontSize: 12}}>
                                                    Event Organizer
                                                </Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
        
        <Modal
            title="Register for Event"
            open={showRegisterModal}
            onCancel={() => {
                setShowRegisterModal(false);
                registerForm.resetFields();
            }}
            footer={null}
            width={600}
        >
            <Form
                form={registerForm}
                layout="vertical"
                onFinish={handleRegisterSubmit}
            >
                <Alert
                    message="Event Registration"
                    description={`You are registering for "${event?.title}". Please fill in your details below.`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your full name",
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Enter your full name"
                        prefix={<UserOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "Please enter a valid email",
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Enter your email"
                        prefix={<MailOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your phone number",
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Enter your phone number"
                        prefix={<PhoneOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="graduationYear"
                    label="Graduation Year"
                >
                    <InputNumber
                        size="large"
                        placeholder="Enter graduation year"
                        style={{ width: "100%" }}
                        min={1950}
                        max={new Date().getFullYear() + 10}
                    />
                </Form.Item>

                <Form.Item
                    name="dietaryRequirements"
                    label="Dietary Requirements (Optional)"
                >
                    <TextArea
                        rows={3}
                        placeholder="Please mention any dietary requirements or allergies"
                    />
                </Form.Item>

                <Form.Item
                    name="specialRequests"
                    label="Special Requests (Optional)"
                >
                    <TextArea
                        rows={3}
                        placeholder="Any special requests or requirements"
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                        <Button
                            onClick={() => {
                                setShowRegisterModal(false);
                                registerForm.resetFields();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" size="large">
                            Complete Registration
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
        </>
    );
};

const AlumniEvents = () => {
    const { isLoading, data: events = [], isFetching, refetch } = useEvents();
    //const [events, setEvents] = useState(initialEvents);
    const [viewMode, setViewMode] = useState("grid");
    const [activeTab, setActiveTab] = useState("all");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const role = secureLocalStorage.getItem("userRole");
    const [isEditMode, setIsEditMode] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        search: "",
        eventType: "all",
        category: "all",
        status: "all",
        priceRange: "all",
        featured: "all",
        dateRange: null,
    });

    const [sortBy, setSortBy] = useState("date-asc");

    const showEventDetails = (event) => {
        console.log({ event });
        setSelectedEvent(event);
        setIsDetailModalVisible(true);
    };

    const handleCloseDetails = () => {
        setIsDetailModalVisible(false);
        setSelectedEvent(null);
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setIsDetailModalVisible(false);
        setIsModalVisible(true);
        setIsEditMode(true);
        // Pre-fill the form with event data for editing
        form.setFieldsValue({
            title: event.title,
            description: event.description,
            event_type: event.eventType,
            category: event.category,
            date: moment(event.date),
            timeRange: [
                moment(event.startTime, "HH:mm"),
                moment(event.endTime, "HH:mm"),
            ],
            location: event.location,
            price: event.price,
            capacity: event.capacity,
            organizer: event.organizer,
            tags: event.tags,
            agenda: event.agenda?.join("\n"),
            featured: event.featured,
        });
    };

    const handleDeleteEvent = async (event) => {
        try {
            const response = await axiosConfig.delete(`/events/${event.id}`);
            if (response.status === 200) {
                message.success(`Event "${event.title}" deleted successfully!`);
                refetch(); // Refresh the events list
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            message.error("Failed to delete event. Please try again.");
        }
    };

    const handleDuplicateEvent = (event) => {
        setIsModalVisible(true);
        setIsEditMode(false);
        setSelectedEvent(null);
        // Pre-fill form with event data but create as new
        form.setFieldsValue({
            title: `${event.title} (Copy)`,
            description: event.description,
            event_type: event.eventType,
            category: event.category,
            date: moment(event.date),
            timeRange: [
                moment(event.startTime, "HH:mm"),
                moment(event.endTime, "HH:mm"),
            ],
            location: event.location,
            price: event.price,
            capacity: event.capacity,
            organizer: event.organizer,
            tags: event.tags,
            agenda: event.agenda?.join("\n"),
            featured: false, // Reset featured status for duplicate
        });
        message.info("Creating a duplicate event. Modify details as needed.");
    };

    const handleRegisterForEvent = async (event, registrationData) => {
        try {
            // Send registration data to backend
            const response = await axiosConfig.post(`/events/${event.id}/register`, registrationData);
            
            if (response.status === 200 || response.status === 201) {
                message.success(`Successfully registered for "${event.title}"!`);
                refetch(); // Refresh to update registration count
                return true;
            }
        } catch (error) {
            console.error("Error registering for event:", error);
            throw error;
        }
    };

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        let filtered = events.filter((event) => {
            // Tab filter
            if (activeTab !== "all" && event.status !== activeTab) {
                return false;
            }

            // Search filter
            if (
                filters.search &&
                !event.title
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) &&
                !event.description
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) &&
                !event.organizer
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())
            ) {
                return false;
            }

            // Event type filter
            if (
                filters.eventType !== "all" &&
                event.eventType !== filters.eventType
            ) {
                return false;
            }

            // Category filter
            if (
                filters.category !== "all" &&
                event.category !== filters.category
            ) {
                return false;
            }

            // Status filter (dropdown)
            if (
                filters.status !== "all" &&
                event.status !== filters.status
            ) {
                return false;
            }

            // Price range filter
            if (filters.priceRange !== "all") {
                const price = event.earlyBird || event.price;
                if (filters.priceRange === "free" && price !== 0) return false;
                if (
                    filters.priceRange === "0-50" &&
                    (price < 0 || price > 50)
                )
                    return false;
                if (
                    filters.priceRange === "50-100" &&
                    (price < 50 || price > 100)
                )
                    return false;
                if (filters.priceRange === "100+" && price < 100) return false;
            }

            // Featured filter
            if (
                filters.featured !== "all" &&
                event.featured !== (filters.featured === "true")
            ) {
                return false;
            }

            // Date range filter
            if (filters.dateRange && filters.dateRange.length === 2) {
                const eventDate = moment(event.date);
                if (
                    !eventDate.isBetween(
                        filters.dateRange[0],
                        filters.dateRange[1],
                        "day",
                        "[]"
                    )
                ) {
                    return false;
                }
            }

            return true;
        });

        // Sort events
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "date-asc":
                    return moment(a.date).diff(moment(b.date));
                case "date-desc":
                    return moment(b.date).diff(moment(a.date));
                case "price-asc":
                    return (a.earlyBird || a.price) - (b.earlyBird || b.price);
                case "price-desc":
                    return (b.earlyBird || b.price) - (a.earlyBird || a.price);
                case "rating-desc":
                    return b.rating - a.rating;
                case "capacity-desc":
                    return b.capacity - a.capacity;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [events, filters, sortBy, activeTab]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            search: "",
            eventType: "all",
            category: "all",
            status: "all",
            priceRange: "all",
            featured: "all",
            dateRange: null,
        });
    };

    const showCreateModal = () => {
        setIsModalVisible(true);
        setCurrentStep(0);
        setIsEditMode(false);
        setSelectedEvent(null);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedEvent(null);
        setIsEditMode(false);
    };

    // Update the handleCreateEvent function
    const handleCreateEvent = async (values) => {
        try {
            const formData = new FormData();

            // Append all form data
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("event_type", values.event_type);
            formData.append("category", values.category);
            formData.append("date", values.date.format("YYYY-MM-DD"));
            formData.append(
                "timeRange[0]",
                values.timeRange[0].format("HH:mm")
            );
            formData.append(
                "timeRange[1]",
                values.timeRange[1].format("HH:mm")
            );
            formData.append("location", values.location);
            formData.append("price", values.price || 0);
            formData.append("capacity", values.capacity);
            formData.append("organizer", values.organizer);
            formData.append("agenda", values.agenda || "");
            formData.append("featured", values.featured || false);

            // Handle tags
            if (values.tags) {
                values.tags.forEach((tag) => {
                    formData.append("tags[]", tag);
                });
            }

            // Handle images
            if (values.images && values.images.fileList) {
                values.images.fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append("images[]", file.originFileObj);
                    }
                });
            }

            let response;
            if (isEditMode && selectedEvent) {
                // Update existing event
                response = await axiosConfig.put(`/events/${selectedEvent.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                message.success("Event updated successfully!");
            } else {
                // Create new event
                response = await axiosConfig.post("/events", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                message.success("Event created successfully!");
            }

            if (response.status === 200 || response.status === 201) {
                setIsModalVisible(false);
                form.resetFields();
                setIsEditMode(false);
                setSelectedEvent(null);
                refetch(); // Refresh the events list
            }
        } catch (error) {
            console.error("Error saving event:", error);
            message.error(
                isEditMode 
                    ? "Failed to update event. Please try again."
                    : "Failed to create event. Please try again."
            );
        }
    };

    const getRegistrationProgress = (registered, capacity) => {
        return (registered / capacity) * 100;
    };

    const stats = {
        total: events.length,
        upcoming: events.filter((e) => e.status === "upcoming").length,
        ongoing: events.filter((e) => e.status === "ongoing").length,
        completed: events.filter((e) => e.status === "completed").length,
        featured: events.filter((e) => e.featured).length,
        totalRegistrations: events.reduce(
            (sum, event) => sum + event.registered,
            0
        ),
    };

    const EventCard = ({ event }) => {
        const eventMenu = (
            <Menu>
                <Menu.Item
                    key="view"
                    icon={<EyeOutlined />}
                    onClick={() => showEventDetails(event)}
                >
                    View Details
                </Menu.Item>
                <Menu.Item
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => handleEditEvent(event)}
                >
                    Edit Event
                </Menu.Item>
                <Menu.Item
                    key="duplicate"
                    icon={<CopyOutlined />}
                    onClick={() => handleDuplicateEvent(event)}
                >
                    Duplicate Event
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    key="share"
                    icon={<ShareAltOutlined />}
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        message.success("Event link copied!");
                    }}
                >
                    Share Event
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => {
                        Modal.confirm({
                            title: 'Delete Event',
                            icon: <ExclamationCircleOutlined />,
                            content: `Are you sure you want to delete "${event.title}"?`,
                            okText: 'Delete',
                            okType: 'danger',
                            cancelText: 'Cancel',
                            onOk: () => handleDeleteEvent(event)
                        });
                    }}
                >
                    Delete Event
                </Menu.Item>
            </Menu>
        );

        return (
            <Card
                className="event-card"
                hoverable
                cover={
                    <div className="event-cover">
                        <img
                            alt={event.title}
                            src={
                                event.images && event.images[0]
                                    ? event.images[0]
                                    : "https://via.placeholder.com/400x200?text=Event+Image"
                            }
                        />
                        <div className="event-cover-overlay">
                            <div className="event-type-tag">
                                <Tag
                                    color={
                                        eventTypes.find(
                                            (t) => t.value === event.eventType
                                        )?.color
                                    }
                                >
                                    {event.eventType}
                                </Tag>
                            </div>
                            <div className="event-actions">
                                <Tooltip title="View Details">
                                    <Button
                                        className="action-btn"
                                        icon={<EyeOutlined />}
                                        onClick={() => showEventDetails(event)}
                                    />
                                </Tooltip>
                                <Tooltip title="Edit Event">
                                    <Button
                                        className="action-btn"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditEvent(event)}
                                    />
                                </Tooltip>
                                <Dropdown overlay={eventMenu} trigger={["click"]}>
                                    <Button
                                        className="action-btn"
                                        icon={<MoreOutlined />}
                                    />
                                </Dropdown>
                            </div>
                        </div>
                        <Badge
                            status={
                                event.status === "upcoming"
                                    ? "success"
                                    : event.status === "ongoing"
                                    ? "processing"
                                    : "default"
                            }
                            text={
                                event.status 
                                    ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
                                    : 'Unknown'
                            }
                            className="event-status-badge"
                        />
                    </div>
                }
            >
                <div className="event-card-content">
                    <div className="event-header">
                        <Title level={4} className="event-title">
                            {event.featured && (
                                <StarOutlined
                                    style={{ color: "#faad14", marginRight: 8 }}
                                />
                            )}
                            {event.title}
                        </Title>
                        <div className="event-rating">
                            <Rate disabled value={event.rating} />
                            <Text className="rating-text">
                                ({event.rating}/5)
                            </Text>
                        </div>
                    </div>

                    <div className="event-organizer">
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Text type="secondary">{event.organizer}</Text>
                    </div>

                    <Paragraph
                        className="event-description"
                        ellipsis={{ rows: 2 }}
                    >
                        {event.description}
                    </Paragraph>

                    <div className="event-details">
                        <div className="detail-item">
                            <CalendarOutlined />
                            <Text>{moment(event.date).format("MMM DD, YYYY")}</Text>
                        </div>
                        <div className="detail-item">
                            <ClockCircleOutlined />
                            <Text>{`${event.startTime} - ${event.endTime}`}</Text>
                        </div>
                        <div className="detail-item">
                            <EnvironmentOutlined />
                            <Text>{event.location}</Text>
                        </div>
                    </div>

                    {event.earlyBird ? (
                        <div className="event-pricing">
                            <div className="pricing-earlybird">
                                <Text delete className="original-price">
                                    ${event.price}
                                </Text>
                                <Text className="earlybird-price">
                                    ${event.earlyBird}
                                </Text>
                                <Tag
                                    color="green"
                                    className="earlybird-tag"
                                    icon={<CheckCircleOutlined />}
                                >
                                    Early Bird
                                </Tag>
                            </div>
                        </div>
                    ) : (
                        <div className="event-pricing">
                            <Text className="regular-price">
                                {event.price === 0 ? "FREE" : `$${event.price}`}
                            </Text>
                        </div>
                    )}

                    {event.registered && event.capacity && (
                        <div className="event-registration">
                            <div className="registration-stats">
                                <Text>
                                    <TeamOutlined /> {event.registered}/
                                    {event.capacity}
                                </Text>
                                <Text type="secondary">
                                    {event.capacity - event.registered} spots left
                                </Text>
                            </div>
                            <Progress
                                percent={Math.round(
                                    (event.registered / event.capacity) * 100
                                )}
                                showInfo={false}
                            />
                        </div>
                    )}

                    <div className="event-tags">
                        <Tag
                            className="event-tag"
                            color={
                                eventCategories.find(
                                    (c) => c.value === event.category
                                )?.color
                            }
                        >
                            {event.category}
                        </Tag>
                        {event.tags?.slice(0, 2).map((tag, index) => (
                            <Tag key={index} className="event-tag">
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };

    const EventListItem = ({ event }) => {
        const eventMenu = (
            <Menu>
                <Menu.Item
                    key="view"
                    icon={<EyeOutlined />}
                    onClick={() => showEventDetails(event)}
                >
                    View Details
                </Menu.Item>
                <Menu.Item
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => handleEditEvent(event)}
                >
                    Edit Event
                </Menu.Item>
                <Menu.Item
                    key="duplicate"
                    icon={<CopyOutlined />}
                    onClick={() => handleDuplicateEvent(event)}
                >
                    Duplicate Event
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    key="share"
                    icon={<ShareAltOutlined />}
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        message.success("Event link copied!");
                    }}
                >
                    Share Event
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => {
                        Modal.confirm({
                            title: 'Delete Event',
                            icon: <ExclamationCircleOutlined />,
                            content: `Are you sure you want to delete "${event.title}"?`,
                            okText: 'Delete',
                            okType: 'danger',
                            cancelText: 'Cancel',
                            onOk: () => handleDeleteEvent(event)
                        });
                    }}
                >
                    Delete Event
                </Menu.Item>
            </Menu>
        );

        return (
            <div className="event-list-item">
                <div className="list-item-content">
                    <div className="list-item-image">
                        <img
                            alt={event.title}
                            src={
                                event.images && event.images[0]
                                    ? event.images[0]
                                    : "https://via.placeholder.com/200x120?text=Event"
                            }
                        />
                        <div className="image-overlay">
                            <Tag
                                color={
                                    eventTypes.find(
                                        (t) => t.value === event.eventType
                                    )?.color
                                }
                            >
                                {event.eventType}
                            </Tag>
                        </div>
                    </div>

                    <div className="list-item-details">
                        <div className="list-item-header">
                            <div className="header-main">
                                <Title level={4} className="list-item-title">
                                    {event.featured && (
                                        <StarOutlined className="featured-icon" />
                                    )}
                                    {event.title}
                                </Title>
                                <div className="event-meta">
                                    <Space size="small">
                                        <div className="organizer-info">
                                            <Avatar
                                                size="small"
                                                icon={<UserOutlined />}
                                            />
                                            <Text type="secondary">
                                                {event.organizer}
                                            </Text>
                                        </div>
                                        <Divider type="vertical" />
                                        <div className="event-rating-small">
                                            <Rate
                                                disabled
                                                value={event.rating}
                                                style={{ fontSize: 12 }}
                                            />
                                            <Text type="secondary" style={{fontSize: 11}}>
                                                ({event.rating})
                                            </Text>
                                        </div>
                                        <Divider type="vertical" />
                                        <Badge
                                            status={
                                                event.status === "upcoming"
                                                    ? "success"
                                                    : event.status === "ongoing"
                                                    ? "processing"
                                                    : "default"
                                            }
                                            text={
                                                event.status 
                                                    ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
                                                    : 'Unknown'
                                            }
                                        />
                                    </Space>
                                </div>
                            </div>
                            <div className="header-actions">
                                <Space>
                                    <Button
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => showEventDetails(event)}
                                    />
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditEvent(event)}
                                    />
                                    <Dropdown overlay={eventMenu} trigger={["click"]}>
                                        <Button
                                            type="text"
                                            icon={<MoreOutlined />}
                                        />
                                    </Dropdown>
                                </Space>
                            </div>
                        </div>

                        <Paragraph
                            className="list-item-description"
                            ellipsis={{ rows: 2 }}
                        >
                            {event.description}
                        </Paragraph>

                        <div className="list-item-meta">
                            <Space size="middle" wrap>
                                <div className="meta-item">
                                    <CalendarOutlined />
                                    <Text>
                                        {moment(event.date).format("MMM DD, YYYY")}
                                    </Text>
                                </div>
                                <div className="meta-item">
                                    <ClockCircleOutlined />
                                    <Text>{`${event.startTime} - ${event.endTime}`}</Text>
                                </div>
                                <div className="meta-item">
                                    <EnvironmentOutlined />
                                    <Text>{event.location}</Text>
                                </div>
                                <div className="meta-item">
                                    <DollarOutlined />
                                    {event.earlyBird ? (
                                        <Space size={4}>
                                            <Text strong style={{ color: "#52c41a" }}>
                                                ${event.earlyBird}
                                            </Text>
                                            <Text
                                                delete
                                                type="secondary"
                                                className="original-price-small"
                                            >
                                                ${event.price}
                                            </Text>
                                            <Tag
                                                color="green"
                                                style={{
                                                    fontSize: 10,
                                                    padding: "0 4px",
                                                    margin: 0,
                                                }}
                                            >
                                                Early Bird
                                            </Tag>
                                        </Space>
                                    ) : (
                                        <Text strong>
                                            {event.price === 0
                                                ? "FREE"
                                                : `$${event.price}`}
                                        </Text>
                                    )}
                                </div>
                            </Space>
                        </div>

                        {event.registered && event.capacity && (
                            <div className="list-item-progress">
                                <Space
                                    style={{
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text>
                                        <TeamOutlined /> {event.registered}/
                                        {event.capacity} registered
                                    </Text>
                                    <Text type="secondary">
                                        {event.capacity - event.registered} spots
                                        left
                                    </Text>
                                </Space>
                                <Progress
                                    percent={Math.round(
                                        (event.registered / event.capacity) * 100
                                    )}
                                    showInfo={false}
                                    style={{ marginTop: 8 }}
                                />
                            </div>
                        )}

                        <div className="list-item-tags">
                            <Tag
                                className="event-tag-small"
                                color={
                                    eventCategories.find(
                                        (c) => c.value === event.category
                                    )?.color
                                }
                            >
                                {event.category}
                            </Tag>
                            {event.tags?.slice(0, 3).map((tag, index) => (
                                <Tag key={index} className="event-tag-small">
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <Layout>
            <div className="alumni-events-container">
                {/* Header Section */}
                <Card className="events-header-card">
                    <div className="header-content">
                        <div>
                            <Title level={2}>Alumni Events & Networking</Title>
                            <Text type="secondary">
                                Discover, create, and manage alumni events.
                                Connect with your community through meaningful
                                gatherings.
                            </Text>
                        </div>
                        <Statistic
                            title="Total Events"
                            value={stats.total}
                            valueStyle={{ color: "#1890ff", fontSize: "35px" }}
                            prefix={<CalendarOutlined />}
                        />
                    </div>
                </Card>

                {/* Status Tabs */}
                <Card className="tabs-card">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        className="status-tabs"
                    >
                        <TabPane
                            tab={
                                <span>
                                    <CalendarOutlined />
                                    All Events
                                    <Badge
                                        count={stats.total}
                                        style={{
                                            backgroundColor: "#1890ff",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="all"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <ClockCircleOutlined />
                                    Upcoming
                                    <Badge
                                        count={stats.upcoming}
                                        style={{
                                            backgroundColor: "#1890ff",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="upcoming"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <CheckCircleOutlined />
                                    Ongoing
                                    <Badge
                                        count={stats.ongoing}
                                        style={{
                                            backgroundColor: "#52c41a",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="ongoing"
                        />
                        <TabPane
                            tab={
                                <span>
                                    <BookOutlined />
                                    Completed
                                    <Badge
                                        count={stats.completed}
                                        style={{
                                            backgroundColor: "#faad14",
                                            marginLeft: 8,
                                        }}
                                    />
                                </span>
                            }
                            key="completed"
                        />
                    </Tabs>
                </Card>

                {/* Controls Section */}
                <Card className="controls-card">
                    <div className="controls-section">
                        <div className="controls-left">
                            <Input
                                placeholder="Search events by title, description, location..."
                                prefix={<SearchOutlined />}
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                style={{ width: 300 }}
                                size="large"
                            />

                            <Select
                                value={filters.eventType}
                                onChange={(value) =>
                                    handleFilterChange("eventType", value)
                                }
                                style={{ width: 180 }}
                                placeholder="Event Type"
                            >
                                {eventTypes.map((type) => (
                                    <Option key={type.value} value={type.value}>
                                        <Tag color={type.color}>
                                            {type.label}
                                        </Tag>
                                    </Option>
                                ))}
                            </Select>

                            <Select
                                value={filters.category}
                                onChange={(value) =>
                                    handleFilterChange("category", value)
                                }
                                style={{ width: 200 }}
                                placeholder="Category"
                            >
                                {eventCategories.map((category) => (
                                    <Option
                                        key={category.value}
                                        value={category.value}
                                    >
                                        {category.label}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="controls-right">
                            {role === "admin" && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showCreateModal}
                                    size="large"
                                >
                                    Create Event
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Events Display */}
                <div className="events-display">
                    {filteredAndSortedEvents.length === 0 ? (
                        <Card className="no-events-card">
                            <div className="no-events-content">
                                <Title level={3}>No events found</Title>
                                <Text type="secondary">
                                    Try adjusting your filters or create a new
                                    event to get started.
                                </Text>
                                <br />
                                <Button
                                    type="primary"
                                    onClick={clearAllFilters}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Row gutter={[24, 24]}>
                            {filteredAndSortedEvents.map((event) => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    lg={8}
                                    xl={6}
                                    key={event.id}
                                >
                                    <EventCard event={event} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

                {/* Create Event Modal */}
                <Modal
                    title={isEditMode ? "Edit Event" : "Create New Event"}
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={900}
                    className="create-event-modal"
                    style={{ top: 20 }}
                >
                    <div className="event-form-container">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleCreateEvent}
                            className="event-form-full"
                        >
                            <div className="form-sections">
                                {/* Basic Info Section */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3>Basic Information</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="section-content">
                                        <Form.Item
                                            name="title"
                                            label="Event Title"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter event title",
                                                },
                                            ]}
                                        >
                                            <Input
                                                size="large"
                                                placeholder="Enter a compelling event title"
                                                className="form-input"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="description"
                                            label="Event Description"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter event description",
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="Describe your event in detail. What will attendees experience?"
                                                className="form-textarea"
                                            />
                                        </Form.Item>

                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="event_type"
                                                    label="Event Type"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please select event type",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        size="large"
                                                        placeholder="Select event type"
                                                    >
                                                        {eventTypes
                                                            .filter(
                                                                (et) =>
                                                                    et.value !==
                                                                    "all"
                                                            )
                                                            .map((type) => (
                                                                <Option
                                                                    key={
                                                                        type.value
                                                                    }
                                                                    value={
                                                                        type.value
                                                                    }
                                                                >
                                                                    <Tag
                                                                        color={
                                                                            type.color
                                                                        }
                                                                    >
                                                                        {
                                                                            type.label
                                                                        }
                                                                    </Tag>
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="category"
                                                    label="Category"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please select category",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        size="large"
                                                        placeholder="Select category"
                                                    >
                                                        {eventCategories
                                                            .filter(
                                                                (ec) =>
                                                                    ec.value !==
                                                                    "all"
                                                            )
                                                            .map((category) => (
                                                                <Option
                                                                    key={
                                                                        category.value
                                                                    }
                                                                    value={
                                                                        category.value
                                                                    }
                                                                >
                                                                    {
                                                                        category.label
                                                                    }
                                                                </Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>

                                {/* Date & Time Section */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3>Date & Time</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="section-content">
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="date"
                                                    label="Event Date"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please select event date",
                                                        },
                                                    ]}
                                                >
                                                    <DatePicker
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        size="large"
                                                        className="form-datepicker"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="timeRange"
                                                    label="Event Time"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please select event time",
                                                        },
                                                    ]}
                                                >
                                                    <TimePicker.RangePicker
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        size="large"
                                                        format="hh:mm A"   // <-- 12-hour format with AM/PM
                                                        use12Hours          // <-- Enables AM/PM selector
                                                        className="form-timepicker"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            name="location"
                                            label="Event Location"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please enter event location",
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Enter physical location or virtual platform"
                                                size="large"
                                                className="form-input"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                {/* Event Details Section */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3>Event Details</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="section-content">
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="price"
                                                    label="Ticket Price (₱)"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please enter ticket price",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        size="large"
                                                        min={0}
                                                        placeholder="0"
                                                        className="form-input-number"
                                                        formatter={(value) =>
                                                            `₱ ${value}`.replace(
                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                ","
                                                            )
                                                        }
                                                        parser={(value) =>
                                                            value.replace(
                                                                /₱\s?|(,*)/g,
                                                                ""
                                                            )
                                                        }
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="capacity"
                                                    label="Capacity"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter event capacity",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                        size="large"
                                                        min={1}
                                                        placeholder="50"
                                                        className="form-input-number"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    name="organizer"
                                                    label="Organizer"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Please enter organizer name",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Organizer name"
                                                        size="large"
                                                        className="form-input"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item
                                            name="tags"
                                            label="Event Tags"
                                            rules={[
                                                {
                                                    type: "array",
                                                    required: true,
                                                    message: "Please add at least one tag",
                                                },
                                            ]}
                                        >
                                            <Select
                                                mode="tags"
                                                size="large"
                                                placeholder="Add tags to help people find your event"
                                                tokenSeparators={[","]}
                                                className="form-tags"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="agenda"
                                            label="Event Agenda"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please enter the event agenda",
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="Enter event schedule (one item per line)"
                                                className="form-textarea"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                {/* Media Section */}
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3>Media & Settings</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="section-content">
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="featured"
                                                    label="Featured Event"
                                                    valuePropName="checked"
                                                >
                                                    <div className="featured-switch-container">
                                                        <Switch
                                                            checkedChildren="Featured"
                                                            unCheckedChildren="Regular"
                                                            className="featured-switch"
                                                        />
                                                        <span className="switch-label">
                                                            Mark this event as
                                                            featured to
                                                            highlight it on the
                                                            platform
                                                        </span>
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="images"
                                                    label="Event Images"
                                                >
                                                    <Upload
                                                        listType="picture-card"
                                                        multiple
                                                        beforeUpload={() =>
                                                            false
                                                        }
                                                        className="event-images-upload"
                                                    >
                                                        <div className="upload-placeholder">
                                                            <PlusOutlined />
                                                            <div
                                                                style={{
                                                                    marginTop: 8,
                                                                }}
                                                            >
                                                                Upload Images
                                                            </div>
                                                        </div>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions-full">
                                <Button
                                    onClick={handleCancel}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="submit-btn"
                                >
                                    {isEditMode ? "Update Event" : "Create Event"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
            <EventDetailsModal
                event={selectedEvent}
                visible={isDetailModalVisible}
                onClose={handleCloseDetails}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onDuplicate={handleDuplicateEvent}
                onRegister={handleRegisterForEvent}
            />
        </Layout>
    );
};

export default AlumniEvents;
