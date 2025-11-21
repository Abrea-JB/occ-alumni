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
    {
        value: "party",
        label: "Party",
        color: "volcano",
        icon: <SmileOutlined />,
    },
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

const EventDetailsModal = ({ event, visible, onClose, onEdit }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    if (!event) return null;

    const handleRegister = () => {
        setIsRegistered(true);
        message.success("Successfully registered for this event!");
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        message.success(
            isLiked ? "Removed from favorites" : "Added to favorites"
        );
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success("Event link copied to clipboard!");
    };

    const menu = (
        <Menu>
            <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => onEdit(event)}
            >
                Edit Event
            </Menu.Item>
            <Menu.Item key="duplicate" icon={<CopyOutlined />}>
                Duplicate Event
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
                key="share"
                icon={<ShareAltOutlined />}
                onClick={handleShare}
            >
                Share Event
            </Menu.Item>
            <Menu.Item key="export" icon={<DownloadOutlined />}>
                Export Registrations
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                Delete Event
            </Menu.Item>
        </Menu>
    );

    return (
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
                                    isLiked ? (
                                        <HeartFilled
                                            style={{ color: "#ff4d4f" }}
                                        />
                                    ) : (
                                        <HeartOutlined />
                                    )
                                }
                                onClick={handleLike}
                            />
                        </Tooltip>
                        <Tooltip title="Share event">
                            <Button
                                type="text"
                                icon={<ShareIcon />}
                                onClick={handleShare}
                            />
                        </Tooltip>
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1200}
            className="event-details-modal"
        >
            <div className="event-details-content">
                {/* Image Gallery */}
                <div className="event-gallery-section">
                    <Carousel
                        arrows
                        dots={{ className: "custom-dots" }}
                        className="event-carousel"
                    >
                        {event.image_urls?.map((image, index) => (
                            <div key={index} className="carousel-slide">
                                <Image
                                    src={image}
                                    alt={`${event.title} - Image ${index + 1}`}
                                    className="event-detail-image"
                                    placeholder={
                                        <div className="image-placeholder">
                                            <PictureOutlined />
                                            <div>Loading image...</div>
                                        </div>
                                    }
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>

                <Row gutter={32} className="event-details-body">
                    {/* Left Column - Main Content */}
                    <Col span={16}>
                        {/* Event Status & Basic Info */}
                        <Card className="event-info-card">
                            <Paragraph className="event-description-detailed">
                                {event.description}
                            </Paragraph>

                            <Divider />

                            {/* Event Details Grid */}
                            <Row
                                gutter={[16, 16]}
                                className="event-details-grid"
                            >
                                <Col span={12}>
                                    <div className="detail-item-large">
                                        <CalendarOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text strong>Date</Text>
                                            <Text>
                                                {moment(event.date).format(
                                                    "dddd, MMMM DD, YYYY"
                                                )}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="detail-item-large">
                                        <ClockCircleOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text strong>Time</Text>
                                            <Text>
                                                {event.startTime} -{" "}
                                                {event.endTime}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="detail-item-large">
                                        <EnvironmentOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text strong>Location</Text>
                                            <Text>{event.location}</Text>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="detail-item-large">
                                        <TeamOutlined className="detail-icon" />
                                        <div className="detail-content">
                                            <Text strong>Capacity</Text>
                                            <Text>{event.capacity}</Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Registration Progress */}
                            <div className="registration-progress">
                                <Text strong>Registration Progress</Text>
                                <Progress
                                    percent={Math.round(
                                        (event.registered / event.capacity) *
                                        100
                                    )}
                                    status="active"
                                    strokeColor={{
                                        from: "#108ee9",
                                        to: "#87d068",
                                    }}
                                />
                                <Text type="secondary">
                                    {event.capacity - event.registered} spots
                                    remaining
                                </Text>
                            </div>
                        </Card>

                        {/* Agenda Section */}
                        {event.agenda && (
                            <Card title="Event Agenda" className="agenda-card">
                                <List
                                    dataSource={
                                        typeof event.agenda === "string"
                                            ? event.agenda.split("\n")
                                            : event.agenda
                                    }
                                    renderItem={(item, index) => {
                                        // Handle both formats: "time - description" and plain text
                                        const hasTimeFormat =
                                            item.includes(" - ");
                                        const timePart = hasTimeFormat
                                            ? item.split(" - ")[0]
                                            : `Item ${index + 1}`;
                                        const contentPart = hasTimeFormat
                                            ? item.split(" - ")[1]
                                            : item;

                                        return (
                                            <List.Item className="agenda-item">
                                                <div className="agenda-time">
                                                    <Text strong>
                                                        {timePart}
                                                    </Text>
                                                </div>
                                                <div className="agenda-content">
                                                    <Text>{contentPart}</Text>
                                                </div>
                                            </List.Item>
                                        );
                                    }}
                                />
                            </Card>
                        )}

                        {/* Speakers Section */}
                        {event.speakers && (
                            <Card
                                title="Featured Speakers"
                                className="speakers-card"
                            >
                                <Row gutter={[16, 16]}>
                                    {event.speakers.map((speaker, index) => (
                                        <Col span={8} key={index}>
                                            <div className="speaker-card">
                                                <Avatar
                                                    size={64}
                                                    icon={<UserOutlined />}
                                                />
                                                <div className="speaker-info">
                                                    <Text strong>
                                                        {speaker.name}
                                                    </Text>
                                                    <Text type="secondary">
                                                        {speaker.role}
                                                    </Text>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        )}
                    </Col>

                    {/* Right Column - Sidebar */}
                    <Col span={8}>
                        {/* Pricing & Registration Card */}
                        <Card className="pricing-card">
                            <div className="pricing-header">
                                <Title level={3} style={{ margin: 0 }}>
                                    {event.price === 0
                                        ? "FREE"
                                        : `₱${event.price}`}
                                </Title>
                                {event.earlyBirdPrice &&
                                    isEarlyBirdAvailable(event) && (
                                        <div className="early-bird-pricing">
                                            <Text delete type="secondary">
                                                ₱{event.price}
                                            </Text>
                                            <Text
                                                strong
                                                style={{
                                                    color: "#ff4d4f",
                                                    fontSize: "20px",
                                                }}
                                            >
                                                ₱{event.earlyBirdPrice}
                                            </Text>
                                            <Tag color="red">Early Bird</Tag>
                                        </div>
                                    )}
                            </div>

                            {/* <Button
                                type="primary"
                                size="large"
                                block
                                onClick={handleRegister}
                                disabled={
                                    isRegistered ||
                                    event.registered >= event.capacity
                                }
                                className="register-btn"
                            >
                                {isRegistered
                                    ? <CheckCircleOutlined /> + " Registered"
                                    : event.registered >= event.capacity
                                    ? "Sold Out"
                                    : "Register Now"}
                            </Button> */}

                            {event.registered >= event.capacity && (
                                <Text
                                    type="danger"
                                    style={{
                                        textAlign: "center",
                                        display: "block",
                                        marginTop: 8,
                                    }}
                                >
                                    This event is fully booked
                                </Text>
                            )}

                            <Divider />

                            <div className="event-organizer-detailed">
                                <div className="organizer-header">
                                    <Avatar
                                        size="large"
                                        src={event.organizerAvatar}
                                        icon={<UserOutlined />}
                                    />
                                    <div className="organizer-info">
                                        <Text strong>
                                            Hosted by {event.organizer}
                                        </Text>
                                        <Text type="secondary">
                                            Event Organizer
                                        </Text>
                                    </div>
                                </div>
                                <div className="organizer-actions">
                                    <Button
                                        type="text"
                                        icon={<PhoneFilled />}
                                        size="small"
                                    />
                                    <Button
                                        type="text"
                                        icon={<MailFilled />}
                                        size="small"
                                    />
                                    <Button
                                        type="text"
                                        icon={<MessageOutlined />}
                                        size="small"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Event Tags */}
                        <Card title="Event Tags" className="tags-card">
                            <div className="event-tags-detailed">
                                {event.tags.map((tag) => (
                                    <Tag
                                        key={tag}
                                        className="event-tag-detailed"
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </Card>

                        <Card
                            title="Safety & Guidelines"
                            className="safety-card"
                            extra={
                                <Tooltip title="All safety measures are strictly enforced">
                                    <SafetyCertificateOutlined
                                        style={{
                                            color: "#52c41a",
                                            fontSize: "16px",
                                        }}
                                    />
                                </Tooltip>
                            }
                        >
                            <Space
                                direction="vertical"
                                size="middle"
                                style={{ width: "100%" }}
                            >
                                {/* Health & Hygiene */}
                                <div className="guideline-category">
                                    <div className="category-header">
                                        <HeartOutlined
                                            style={{ color: "#ff4d4f" }}
                                        />
                                        <Text strong>Health & Hygiene</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            COVID-19 safety protocols enforced
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Hand sanitizing stations throughout
                                            venue
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Enhanced cleaning between sessions
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Medical staff and first aid
                                            available
                                        </Text>
                                    </div>
                                </div>

                                {/* Security */}
                                <div className="guideline-category">
                                    <div className="category-header">
                                        <SafetyCertificateOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text strong>Security & Safety</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Professional security personnel on
                                            duty
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Bag checks and metal detection at
                                            entrance
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Emergency evacuation procedures in
                                            place
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            CCTV surveillance throughout the
                                            venue
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Lost and found service available
                                        </Text>
                                    </div>
                                </div>

                                {/* Accessibility */}
                                <div className="guideline-category">
                                    <div className="category-header">
                                        <TeamOutlined
                                            style={{ color: "#722ed1" }}
                                        />
                                        <Text strong>Accessibility</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Wheelchair accessible venue and
                                            facilities
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Reserved seating for special needs
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Sign language interpreters available
                                            upon request
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CheckCircleOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text>
                                            Quiet rooms available for sensory
                                            breaks
                                        </Text>
                                    </div>
                                </div>

                                {/* Event Conduct */}
                                <div className="guideline-category">
                                    <div className="category-header">
                                        <UserOutlined
                                            style={{ color: "#fa8c16" }}
                                        />
                                        <Text strong>Event Conduct</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <InfoCircleOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            Respectful behavior towards all
                                            attendees required
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <InfoCircleOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            No smoking except in designated
                                            areas
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <InfoCircleOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            Professional photography and
                                            recording only
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <InfoCircleOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            Age restrictions may apply for
                                            certain areas
                                        </Text>
                                    </div>
                                </div>

                                {/* Emergency Information */}
                                <div className="guideline-category">
                                    <div className="category-header">
                                        <ExclamationCircleOutlined
                                            style={{ color: "#fa541c" }}
                                        />
                                        <Text strong>
                                            Emergency Information
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <PhoneOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            Emergency contact: (555) 123-HELP
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <EnvironmentOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            First aid stations located at main
                                            entrances
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <TeamOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            Event staff identifiable by blue
                                            badges
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <InfoCircleOutlined
                                            style={{ color: "#1890ff" }}
                                        />
                                        <Text>
                                            Emergency exits clearly marked
                                            throughout venue
                                        </Text>
                                    </div>
                                </div>

                                {/* Prohibited Items */}
                                <div className="guideline-category">
                                    <div className="category-header">
                                        <CloseCircleOutlined
                                            style={{ color: "#f5222d" }}
                                        />
                                        <Text strong>Prohibited Items</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CloseOutlined
                                            style={{ color: "#f5222d" }}
                                        />
                                        <Text>Weapons of any kind</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CloseOutlined
                                            style={{ color: "#f5222d" }}
                                        />
                                        <Text>Outside food and beverages</Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CloseOutlined
                                            style={{ color: "#f5222d" }}
                                        />
                                        <Text>
                                            Large bags or backpacks (over
                                            12x12x6)
                                        </Text>
                                    </div>
                                    <div className="guideline-item">
                                        <CloseOutlined
                                            style={{ color: "#f5222d" }}
                                        />
                                        <Text>
                                            Professional camera equipment
                                            without permit
                                        </Text>
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <Alert
                                    message="Important Notice"
                                    description="By attending this event, you agree to comply with all safety guidelines and acknowledge that failure to do so may result in removal from the venue without refund."
                                    type="warning"
                                    showIcon
                                    closable
                                />
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

const EventCard = ({ event, showEventDetails }) => {
    const menu = (
        <Menu>
            <Menu.Item key="edit" icon={<EditOutlined />}>
                Edit Event
            </Menu.Item>
            <Menu.Item key="duplicate" icon={<CopyOutlined />}>
                Duplicate Event
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="share" icon={<ShareAltOutlined />}>
                Share Event
            </Menu.Item>
            <Menu.Item key="export" icon={<DownloadOutlined />}>
                Export Registrations
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                Delete Event
            </Menu.Item>
        </Menu>
    );

    return (
        <Badge.Ribbon
            text="Featured"
            color="red"
            style={{ display: event.featured ? "block" : "none" }}
        >
            <Card
                className="event-card"
                cover={
                    <div className="event-cover">
                        {event.image_urls?.map((img, i) => (
                            <img key={i} alt={event.title} src={img} />
                        ))}
                        <div className="event-cover-overlay">
                            <div className="event-type-tag">
                                <Tag
                                    color={
                                        getEventTypeConfig(event.eventType)
                                            .color
                                    }
                                    icon={
                                        getEventTypeConfig(event.eventType).icon
                                    }
                                >
                                    {getEventTypeConfig(event.eventType).label}
                                </Tag>
                            </div>
                            <div className="event-actions">
                                <Tooltip title="Add to Favorites">
                                    <Button
                                        type="text"
                                        icon={<HeartOutlined />}
                                        className="action-btn"
                                    />
                                </Tooltip>
                                <Tooltip title="Share Event">
                                    <Button
                                        type="text"
                                        icon={<ShareAltOutlined />}
                                        className="action-btn"
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="event-status-badge">
                            {getStatusTag(event.status)}
                        </div>
                    </div>
                }
                actions={[
                    // Everyone can see
                    <Tooltip title="View Details" key="view">
                        <EyeOutlined onClick={() => showEventDetails(event)} />
                    </Tooltip>,

                    // Admin only
                    ...(secureLocalStorage.getItem("userRole") === "admin"
                        ? [
                            <Tooltip title="Register" key="register">
                                <UserOutlined />
                            </Tooltip>,
                            <Tooltip title="Share" key="share">
                                <ShareAltOutlined />
                            </Tooltip>,
                            <Dropdown overlay={menu} trigger={["click"]} key="more">
                                <MoreOutlined />
                            </Dropdown>,
                        ]
                        : []),
                ]}

            >
                <div className="event-card-content">
                    <div className="event-header">
                        <Title level={4} className="event-title">
                            {event.title}
                        </Title>
                    </div>

                    <Paragraph
                        ellipsis={{ rows: 2 }}
                        className="event-description"
                    >
                        {event.description}
                    </Paragraph>

                    <div className="event-organizer">
                        <Avatar size="small" icon={<UserOutlined />} />
                        <Text type="secondary">
                            Hosted by {event.organizer}
                        </Text>
                    </div>

                    <Divider />

                    <div className="event-details">
                        <div className="detail-item">
                            <CalendarOutlined />
                            <Text>
                                {moment(event.date).format("MMM DD, YYYY")}
                            </Text>
                        </div>
                        <div className="detail-item">
                            <ClockCircleOutlined />
                            <Text>
                                {moment(event.start_time, "HH:mm").format("hh:mm A")} -
                                {moment(event.end_time, "HH:mm").format("hh:mm A")}
                            </Text>
                        </div>
                        <div className="detail-item">
                            <EnvironmentOutlined />
                            <Text ellipsis={{ tooltip: event.location }}>
                                {event.location}
                            </Text>
                        </div>
                    </div>

                    <div className="event-pricing">
                        <Text strong className="regular-price">
                            {parseFloat(event.price) === 0
                                ? "FREE"
                                : ` ₱${event.price}`}
                        </Text>
                    </div>

                    <div className="event-tags">
                        {event.tags.map((tag) => (
                            <Tag key={tag} className="event-tag">
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </Card>
        </Badge.Ribbon>
    );
};

const isEarlyBirdAvailable = (event) => {
    return (
        event.earlyBirdPrice && moment().isBefore(moment(event.earlyBirdEnd))
    );
};

const getStatusTag = (status) => {
    const statusConfig = {
        upcoming: {
            color: "blue",
            text: "Upcoming",
            icon: <ClockCircleOutlined />,
        },
        ongoing: {
            color: "green",
            text: "Live Now",
            icon: <CheckCircleOutlined />,
        },
        completed: {
            color: "default",
            text: "Completed",
            icon: <CheckCircleOutlined />,
        },
        cancelled: {
            color: "red",
            text: "Cancelled",
            icon: <DeleteOutlined />,
        },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return (
        <Tag color={config.color} icon={config.icon}>
            {config.text}
        </Tag>
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

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        let filtered = events.filter((event) => {
            // Tab filter
            if (activeTab !== "all" && event.status !== activeTab) {
                return false;
            }

            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    event.title.toLowerCase().includes(searchLower) ||
                    event.description.toLowerCase().includes(searchLower) ||
                    event.location.toLowerCase().includes(searchLower) ||
                    event.organizer.toLowerCase().includes(searchLower) ||
                    event.tags.some((tag) =>
                        tag.toLowerCase().includes(searchLower)
                    );
                if (!matchesSearch) return false;
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

            // Status filter
            if (filters.status !== "all" && event.status !== filters.status) {
                return false;
            }

            // Price range filter
            if (filters.priceRange !== "all") {
                switch (filters.priceRange) {
                    case "free":
                        if (event.price !== 0) return false;
                        break;
                    case "0-50":
                        if (event.price === 0 || event.price > 50) return false;
                        break;
                    case "50-100":
                        if (event.price < 50 || event.price > 100) return false;
                        break;
                    case "100-200":
                        if (event.price < 100 || event.price > 200)
                            return false;
                        break;
                    case "200+":
                        if (event.price < 200) return false;
                        break;
                    default:
                        break;
                }
            }

            // Featured filter
            if (filters.featured !== "all") {
                const isFeatured = filters.featured === "featured";
                if (event.featured !== isFeatured) return false;
            }

            // Date range filter
            if (filters.dateRange && filters.dateRange.length === 2) {
                const eventDate = moment(event.date);
                const startDate = filters.dateRange[0];
                const endDate = filters.dateRange[1];
                if (!eventDate.isBetween(startDate, endDate, "day", "[]")) {
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
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "rating-desc":
                    return b.rating - a.rating;
                case "popularity":
                    return b.registered - a.registered;
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "capacity":
                    return (
                        a.capacity - a.registered - (b.capacity - b.registered)
                    );
                default:
                    return 0;
            }
        });

        return filtered;
    }, [events, activeTab, filters, sortBy]);

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
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedEvent(null);
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

            const response = await axiosConfig.post("/events", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                message.success("Event created successfully!");
                form.resetFields();
                handleCancel();
                refetch()
            }
        } catch (error) {
            message.error("Failed to create event");
            console.error("Event creation error:", error);
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

    return (
        <Layout>
            <div className="alumni-dashboard">
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
                                </Button>)}
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
                                    <EventCard
                                        event={event}
                                        showEventDetails={(event) =>
                                            showEventDetails(event)
                                        }
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

                {/* Create Event Modal */}
                <Modal
                    title="Create New Event"
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
                                    icon={<PlusOutlined />}
                                    className="submit-btn"
                                    size="large"
                                >
                                    Create Event
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
            />
        </Layout>
    );
};

export default AlumniEvents;
