import React, { useState, useMemo } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    TimePicker,
    Tag,
    Avatar,
    Progress,
    Divider,
    Typography,
    Space,
    message,
    Upload,
    Switch,
    Rate,
    Statistic,
    Badge,
    List,
    Tooltip,
    InputNumber,
} from "antd";
import {
    PlusOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    UserOutlined,
    TeamOutlined,
    DollarOutlined,
    StarOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UploadOutlined,
    VideoCameraOutlined,
    TrophyOutlined,
    HeartOutlined,
    ShareAltOutlined,
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    FireOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./AlumniEvents.css";
import { Layout, Breadcrumb } from "~/components";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Mock data for events
const initialEvents = [
    {
        id: 1,
        title: "Annual Alumni Gala 2024",
        description: "Join us for an unforgettable evening of networking, fine dining, and celebration. Reconnect with old friends and make new connections in a sophisticated setting.",
        date: "2024-06-15",
        startTime: "18:30",
        endTime: "23:00",
        location: "Grand Ballroom, City Convention Center",
        eventType: "networking",
        price: 125,
        capacity: 300,
        registered: 187,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        status: "upcoming",
        organizer: "Alumni Relations Board",
        tags: ["Black Tie", "Networking", "Dinner", "Awards"],
        rating: 4.8,
        reviews: 42,
        featured: true,
        earlyBirdPrice: 99,
        earlyBirdEnd: "2024-05-15",
    },
    {
        id: 2,
        title: "Tech Innovation Summit 2024",
        description: "Explore the future of technology with industry leaders. Featuring keynote speakers, panel discussions, and hands-on workshops on AI, blockchain, and quantum computing.",
        date: "2024-07-22",
        startTime: "09:00",
        endTime: "17:30",
        location: "Tech Innovation Campus, Building A",
        eventType: "conference",
        price: 199,
        capacity: 500,
        registered: 423,
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        status: "upcoming",
        organizer: "Computer Science Alumni Chapter",
        tags: ["Technology", "AI", "Workshops", "Startups"],
        rating: 4.9,
        reviews: 67,
        featured: true,
        earlyBirdPrice: 149,
        earlyBirdEnd: "2024-06-22",
    },
    {
        id: 3,
        title: "Career Growth Workshop Series",
        description: "Master the skills you need to advance your career. Interactive sessions on leadership, negotiation, personal branding, and strategic career planning.",
        date: "2024-05-10",
        startTime: "10:00",
        endTime: "16:00",
        location: "Business School Executive Center",
        eventType: "workshop",
        price: 75,
        capacity: 80,
        registered: 80,
        image: "https://images.unsplash.com/photo-1551836026-d5c88ac5d2d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        status: "completed",
        organizer: "Career Development Office",
        tags: ["Career", "Leadership", "Skills", "Professional"],
        rating: 4.7,
        reviews: 38,
        featured: false,
    },
    {
        id: 4,
        title: "Alumni Golf Championship",
        description: "Compete for the prestigious alumni trophy in our annual golf tournament. Includes breakfast, lunch, awards ceremony, and networking reception.",
        date: "2024-08-12",
        startTime: "07:30",
        endTime: "18:00",
        location: "Pine Valley Golf & Country Club",
        eventType: "sports",
        price: 150,
        capacity: 120,
        registered: 78,
        image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        status: "upcoming",
        organizer: "Sports Alumni Association",
        tags: ["Golf", "Competition", "Sports", "Networking"],
        rating: 4.6,
        reviews: 31,
        featured: false,
    },
    {
        id: 5,
        title: "Global Alumni Virtual Mixer",
        description: "Connect with alumni worldwide in our virtual networking event. Perfect for international alumni who want to stay connected with the community.",
        date: "2024-04-25",
        startTime: "19:00",
        endTime: "21:00",
        location: "Virtual Event - Zoom",
        eventType: "virtual",
        price: 0,
        capacity: 200,
        registered: 156,
        image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        status: "upcoming",
        organizer: "International Alumni Network",
        tags: ["Virtual", "Global", "Networking", "Free"],
        rating: 4.5,
        reviews: 28,
        featured: true,
    },
    {
        id: 6,
        title: "Entrepreneurship & Startup Showcase",
        description: "Discover the next generation of alumni entrepreneurs. Pitch sessions, investor meetings, and networking opportunities for the startup community.",
        date: "2024-09-05",
        startTime: "13:00",
        endTime: "19:00",
        location: "Innovation Hub & Startup Garage",
        eventType: "showcase",
        price: 45,
        capacity: 150,
        registered: 89,
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        status: "upcoming",
        organizer: "Entrepreneurship Center",
        tags: ["Startups", "Pitching", "Investors", "Innovation"],
        rating: 4.8,
        reviews: 45,
        featured: false,
    },
];

const eventTypes = [
    { value: "all", label: "All Events", color: "default", icon: <TeamOutlined /> },
    { value: "networking", label: "Networking", color: "blue", icon: <TeamOutlined /> },
    { value: "conference", label: "Conference", color: "purple", icon: <VideoCameraOutlined /> },
    { value: "workshop", label: "Workshop", color: "orange", icon: <UserOutlined /> },
    { value: "sports", label: "Sports", color: "green", icon: <TrophyOutlined /> },
    { value: "virtual", label: "Virtual", color: "cyan", icon: <EyeOutlined /> },
    { value: "showcase", label: "Showcase", color: "red", icon: <StarOutlined /> },
    { value: "fundraising", label: "Fundraising", color: "gold", icon: <DollarOutlined /> },
];

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const priceRangeOptions = [
    { value: "all", label: "Any Price" },
    { value: "free", label: "Free Events" },
    { value: "0-50", label: "$0 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100-200", label: "$100 - $200" },
    { value: "200+", label: "$200+" },
];

const sortOptions = [
    { value: "date-asc", label: "Date: Earliest First" },
    { value: "date-desc", label: "Date: Latest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" },
    { value: "title-asc", label: "Title: A to Z" },
];

const AlumniEvents = () => {
    const [events, setEvents] = useState(initialEvents);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    
    // Filter states
    const [filters, setFilters] = useState({
        search: "",
        eventType: "all",
        status: "all",
        priceRange: "all",
        featured: "all",
        dateRange: null,
    });
    
    const [sortBy, setSortBy] = useState("date-asc");
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        let filtered = events.filter(event => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch = 
                    event.title.toLowerCase().includes(searchLower) ||
                    event.description.toLowerCase().includes(searchLower) ||
                    event.location.toLowerCase().includes(searchLower) ||
                    event.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                    event.organizer.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Event type filter
            if (filters.eventType !== "all" && event.eventType !== filters.eventType) {
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
                        if (event.price < 100 || event.price > 200) return false;
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
                if (!eventDate.isBetween(startDate, endDate, 'day', '[]')) {
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
                default:
                    return 0;
            }
        });

        return filtered;
    }, [events, filters, sortBy]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            search: "",
            eventType: "all",
            status: "all",
            priceRange: "all",
            featured: "all",
            dateRange: null,
        });
        setSortBy("date-asc");
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.eventType !== "all") count++;
        if (filters.status !== "all") count++;
        if (filters.priceRange !== "all") count++;
        if (filters.featured !== "all") count++;
        if (filters.dateRange) count++;
        return count;
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setSelectedEvent(null);
    };

    const handleCreateEvent = (values) => {
        const newEvent = {
            id: events.length + 1,
            ...values,
            date: values.date.format("YYYY-MM-DD"),
            startTime: values.timeRange[0].format("HH:mm"),
            endTime: values.timeRange[1].format("HH:mm"),
            registered: 0,
            status: "upcoming",
            rating: 0,
            reviews: 0,
            featured: values.featured || false,
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        };

        setEvents([...events, newEvent]);
        message.success("Event created successfully!");
        handleCancel();
    };

    const getEventTypeConfig = (type) => {
        return eventTypes.find((et) => et.value === type) || eventTypes[0];
    };

    const getRegistrationProgress = (registered, capacity) => {
        return (registered / capacity) * 100;
    };

    const isEarlyBirdAvailable = (event) => {
        return (
            event.earlyBirdPrice &&
            moment().isBefore(moment(event.earlyBirdEnd))
        );
    };

    const EventCard = ({ event }) => (
        <Badge.Ribbon
            text="Featured"
            color="red"
            style={{ display: event.featured ? "block" : "none" }}
        >
            <Card
                className="event-card"
                cover={
                    <div className="event-cover">
                        <img alt={event.title} src={event.image} />
                        <div className="event-cover-overlay">
                            <div className="event-type-tag">
                                <Tag
                                    color={getEventTypeConfig(event.eventType).color}
                                    icon={getEventTypeConfig(event.eventType).icon}
                                >
                                    {getEventTypeConfig(event.eventType).label}
                                </Tag>
                            </div>
                            <div className="event-actions">
                                <Button
                                    type="text"
                                    icon={<HeartOutlined />}
                                    className="action-btn"
                                />
                                <Button
                                    type="text"
                                    icon={<ShareAltOutlined />}
                                    className="action-btn"
                                />
                            </div>
                        </div>
                    </div>
                }
                actions={[
                    <Tooltip title="View Details" key="view">
                        <EyeOutlined />
                    </Tooltip>,
                    <Tooltip title="Edit Event" key="edit">
                        <EditOutlined />
                    </Tooltip>,
                    <Tooltip title="Delete Event" key="delete">
                        <DeleteOutlined />
                    </Tooltip>,
                ]}
            >
                <div className="event-content">
                    <div className="event-header">
                        <Title level={4} className="event-title">
                            {event.title}
                        </Title>
                        <div className="event-rating">
                            <Rate disabled defaultValue={event.rating} allowHalf />
                            <Text className="rating-text">({event.reviews})</Text>
                        </div>
                    </div>

                    <Paragraph ellipsis={{ rows: 2 }} className="event-description">
                        {event.description}
                    </Paragraph>

                    <div className="event-details">
                        <div className="detail-item">
                            <CalendarOutlined />
                            <Text>{moment(event.date).format("MMM DD, YYYY")}</Text>
                        </div>
                        <div className="detail-item">
                            <ClockCircleOutlined />
                            <Text>{event.startTime} - {event.endTime}</Text>
                        </div>
                        <div className="detail-item">
                            <EnvironmentOutlined />
                            <Text ellipsis={{ tooltip: event.location }}>{event.location}</Text>
                        </div>
                    </div>

                    <div className="event-pricing">
                        {isEarlyBirdAvailable(event) ? (
                            <div className="pricing-earlybird">
                                <Text delete className="original-price">${event.price}</Text>
                                <Text strong className="earlybird-price">${event.earlyBirdPrice}</Text>
                                <Tag color="green" className="earlybird-tag">Early Bird</Tag>
                            </div>
                        ) : (
                            <Text strong className="regular-price">
                                {event.price === 0 ? "FREE" : `$${event.price}`}
                            </Text>
                        )}
                    </div>

                    <div className="event-registration">
                        <div className="registration-stats">
                            <Text type="secondary">{event.registered} / {event.capacity} registered</Text>
                            <Text strong>{event.capacity - event.registered} spots left</Text>
                        </div>
                        <Progress
                            percent={getRegistrationProgress(event.registered, event.capacity)}
                            size="small"
                            status={getRegistrationProgress(event.registered, event.capacity) >= 90 ? "exception" : "normal"}
                        />
                    </div>

                    <div className="event-tags">
                        {event.tags.map((tag) => (
                            <Tag key={tag} className="event-tag">{tag}</Tag>
                        ))}
                    </div>

                    <Button type="primary" block className="register-btn">
                        Register Now
                    </Button>
                </div>
            </Card>
        </Badge.Ribbon>
    );

    const EventListItem = ({ event }) => (
        <List.Item className="event-list-item">
            <div className="list-item-content">
                <div className="list-item-image">
                    <img src={event.image} alt={event.title} />
                    <Tag color={getEventTypeConfig(event.eventType).color} className="type-tag-mobile">
                        {getEventTypeConfig(event.eventType).label}
                    </Tag>
                </div>

                <div className="list-item-details">
                    <div className="list-item-header">
                        <Title level={5} className="list-item-title">{event.title}</Title>
                        {event.featured && <Tag color="red">Featured</Tag>}
                    </div>

                    <Paragraph ellipsis={{ rows: 2 }} className="list-item-description">
                        {event.description}
                    </Paragraph>

                    <div className="list-item-meta">
                        <Space size="large">
                            <div className="meta-item">
                                <CalendarOutlined />
                                <Text>{moment(event.date).format("MMM DD, YYYY")}</Text>
                            </div>
                            <div className="meta-item">
                                <EnvironmentOutlined />
                                <Text>{event.location}</Text>
                            </div>
                            <div className="meta-item">
                                <TeamOutlined />
                                <Text>{event.registered}/{event.capacity}</Text>
                            </div>
                            <div className="meta-item">
                                <DollarOutlined />
                                <Text strong={isEarlyBirdAvailable(event)}>
                                    {isEarlyBirdAvailable(event) ? `$${event.earlyBirdPrice}` : event.price === 0 ? "FREE" : `$${event.price}`}
                                </Text>
                                {isEarlyBirdAvailable(event) && (
                                    <Text delete type="secondary" className="original-price-small">
                                        ${event.price}
                                    </Text>
                                )}
                            </div>
                        </Space>
                    </div>

                    <div className="list-item-actions">
                        <Space>
                            <Button type="primary" size="small">Register</Button>
                            <Button size="small" icon={<EyeOutlined />}>Details</Button>
                            <Button size="small" icon={<ShareAltOutlined />} />
                        </Space>
                    </div>
                </div>
            </div>
        </List.Item>
    );

    return (
        <Layout>
            <div className="alumni-events-container">
                {/* Header Section */}
                <Card className="events-header-card">
                    <div className="events-header">
                        <div className="header-content">
                            <Title level={2} className="primary-text">
                                Alumni Events & Networking
                            </Title>
                            <Text type="secondary">
                                Discover and join amazing events with your alumni community. Connect, learn, and grow together.
                            </Text>
                        </div>
                        <Statistic
                            title="Total Events"
                            value={filteredAndSortedEvents.length}
                            valueStyle={{ color: "#32d1b3", fontSize: "35px" }}
                            prefix={<CalendarOutlined />}
                        />
                    </div>
                </Card>

                {/* Search and Filter Section */}
                <Card className="filters-card">
                    <div className="search-section">
                        <Input
                            placeholder="Search events by title, description, location, or tags..."
                            prefix={<SearchOutlined />}
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            size="large"
                            className="search-input"
                        />
                        
                        <div className="filter-controls">
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => setShowFilters(!showFilters)}
                                type={showFilters ? "primary" : "default"}
                            >
                                Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                            </Button>
                            
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: 200 }}
                                suffixIcon={<SortAscendingOutlined />}
                            >
                                {sortOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={showModal}
                                className="create-event-btn"
                            >
                                Create Event
                            </Button>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showFilters && (
                        <div className="advanced-filters">
                            <Divider />
                            <Row gutter={[16, 16]} className="filter-row">
                                <Col xs={24} sm={12} md={6}>
                                    <Text strong>Event Type</Text>
                                    <Select
                                        value={filters.eventType}
                                        onChange={(value) => handleFilterChange("eventType", value)}
                                        style={{ width: "100%" }}
                                        placeholder="All Event Types"
                                    >
                                        {eventTypes.map(type => (
                                            <Option key={type.value} value={type.value}>
                                                <Tag color={type.color}>{type.label}</Tag>
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                
                                <Col xs={24} sm={12} md={6}>
                                    <Text strong>Status</Text>
                                    <Select
                                        value={filters.status}
                                        onChange={(value) => handleFilterChange("status", value)}
                                        style={{ width: "100%" }}
                                        placeholder="All Status"
                                    >
                                        {statusOptions.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                {status.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                
                                <Col xs={24} sm={12} md={6}>
                                    <Text strong>Price Range</Text>
                                    <Select
                                        value={filters.priceRange}
                                        onChange={(value) => handleFilterChange("priceRange", value)}
                                        style={{ width: "100%" }}
                                        placeholder="Any Price"
                                    >
                                        {priceRangeOptions.map(price => (
                                            <Option key={price.value} value={price.value}>
                                                {price.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                
                                <Col xs={24} sm={12} md={6}>
                                    <Text strong>Featured</Text>
                                    <Select
                                        value={filters.featured}
                                        onChange={(value) => handleFilterChange("featured", value)}
                                        style={{ width: "100%" }}
                                        placeholder="All Events"
                                    >
                                        <Option value="all">All Events</Option>
                                        <Option value="featured">Featured Only</Option>
                                        <Option value="regular">Regular Only</Option>
                                    </Select>
                                </Col>
                                
                                <Col xs={24} sm={12} md={12}>
                                    <Text strong>Date Range</Text>
                                    <RangePicker
                                        value={filters.dateRange}
                                        onChange={(dates) => handleFilterChange("dateRange", dates)}
                                        style={{ width: "100%" }}
                                    />
                                </Col>
                                
                                <Col xs={24} sm={12} md={12}>
                                    <div className="filter-actions">
                                        <Button onClick={clearAllFilters} style={{ marginTop: 24 }}>
                                            Clear All Filters
                                        </Button>
                                        <Text type="secondary" style={{ marginLeft: 12, marginTop: 24, display: "block" }}>
                                            Showing {filteredAndSortedEvents.length} of {events.length} events
                                        </Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Card>

                {/* View Mode Toggle */}
                <div className="view-mode-toggle">
                    <Button.Group>
                        <Button
                            type={viewMode === "grid" ? "primary" : "default"}
                            icon={<i className="fas fa-th-large" />}
                            onClick={() => setViewMode("grid")}
                        >
                            Grid View
                        </Button>
                        <Button
                            type={viewMode === "list" ? "primary" : "default"}
                            icon={<i className="fas fa-list" />}
                            onClick={() => setViewMode("list")}
                        >
                            List View
                        </Button>
                    </Button.Group>
                </div>

                {/* Events Display */}
                <div className="events-display">
                    {filteredAndSortedEvents.length === 0 ? (
                        <Card className="no-events-card">
                            <div className="no-events-content">
                                <Title level={3}>No events found</Title>
                                <Text type="secondary">
                                    Try adjusting your filters or search terms to find more events.
                                </Text>
                                <br />
                                <Button type="primary" onClick={clearAllFilters}>
                                    Clear All Filters
                                </Button>
                            </div>
                        </Card>
                    ) : viewMode === "grid" ? (
                        <Row gutter={[24, 24]}>
                            {filteredAndSortedEvents.map((event) => (
                                <Col xs={24} sm={12} lg={8} key={event.id}>
                                    <EventCard event={event} />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <List
                            className="events-list"
                            dataSource={filteredAndSortedEvents}
                            renderItem={(event) => <EventListItem event={event} />}
                        />
                    )}
                </div>

                {/* Create Event Modal */}
                <Modal
                    title={
                        <div className="modal-title">
                            <PlusOutlined />
                            <span>Create New Event</span>
                        </div>
                    }
                    open={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                    width={800}
                    className="create-event-modal"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateEvent}
                        initialValues={{
                            price: 0,
                            capacity: 50,
                            featured: false,
                            eventType: "networking",
                        }}
                    >
                        {/* ... existing form content ... */}
                    </Form>
                </Modal>
            </div>
        </Layout>
    );
};

export default AlumniEvents;