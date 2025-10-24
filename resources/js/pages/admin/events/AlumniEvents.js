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
} from "@ant-design/icons";
import moment from "moment";
import "./AlumniEvents.css";
import { Layout, Breadcrumb } from "~/components";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Step } = Steps;

// Mock data for events
const initialEvents = [
  {
    id: 1,
    title: "Annual Alumni Gala 2024",
    description: "Join us for an unforgettable evening of networking, fine dining, and celebration. Reconnect with old friends and make new connections in a sophisticated setting with keynote speakers and live entertainment.",
    date: "2024-06-15",
    startTime: "18:30",
    endTime: "23:00",
    location: "Grand Ballroom, City Convention Center",
    eventType: "networking",
    category: "social",
    price: 125,
    capacity: 300,
    registered: 187,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "upcoming",
    organizer: "Alumni Relations Board",
    organizerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    tags: ["Black Tie", "Networking", "Dinner", "Awards", "Formal"],
    rating: 4.8,
    reviews: 42,
    featured: true,
    earlyBirdPrice: 99,
    earlyBirdEnd: "2024-05-15",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agenda: [
      "18:30 - Welcome Reception & Cocktails",
      "19:30 - Dinner Service",
      "20:45 - Alumni Achievement Awards",
      "21:30 - Live Music & Dancing",
      "23:00 - Event Concludes"
    ],
    speakers: [
      { name: "Dr. Sarah Johnson", role: "University President" },
      { name: "Michael Chen", role: "Alumni Association Chair" },
      { name: "Emily Rodriguez", role: "Keynote Speaker" }
    ]
  },
  {
    id: 2,
    title: "Tech Innovation Summit 2024",
    description: "Explore the future of technology with industry leaders. Featuring keynote speakers, panel discussions, and hands-on workshops on AI, blockchain, and quantum computing. Perfect for tech professionals and enthusiasts.",
    date: "2024-07-22",
    startTime: "09:00",
    endTime: "17:30",
    location: "Tech Innovation Campus, Building A",
    eventType: "conference",
    category: "professional",
    price: 199,
    capacity: 500,
    registered: 423,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "upcoming",
    organizer: "Computer Science Alumni Chapter",
    organizerAvatar: "https://images.unsplash.com/photo-1556157382-97eda3acf50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    tags: ["Technology", "AI", "Workshops", "Startups", "Innovation"],
    rating: 4.9,
    reviews: 67,
    featured: true,
    earlyBirdPrice: 149,
    earlyBirdEnd: "2024-06-22",
    images: [
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agenda: [
      "09:00 - Registration & Breakfast",
      "10:00 - Keynote: Future of AI",
      "11:30 - Breakout Sessions",
      "13:00 - Lunch & Networking",
      "14:30 - Workshop Sessions",
      "16:00 - Panel Discussion",
      "17:30 - Closing Remarks"
    ],
    speakers: [
      { name: "Dr. Lisa Wang", role: "AI Research Director" },
      { name: "James Wilson", role: "Tech Entrepreneur" },
      { name: "Maria Gonzalez", role: "Blockchain Expert" }
    ]
  },
  {
    id: 3,
    title: "Career Growth Workshop Series",
    description: "Master the skills you need to advance your career. Interactive sessions on leadership, negotiation, personal branding, and strategic career planning. Limited seats available.",
    date: "2024-05-10",
    startTime: "10:00",
    endTime: "16:00",
    location: "Business School Executive Center",
    eventType: "workshop",
    category: "professional",
    price: 75,
    capacity: 80,
    registered: 80,
    image: "https://images.unsplash.com/photo-1551836026-d5c88ac5d2d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "completed",
    organizer: "Career Development Office",
    organizerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    tags: ["Career", "Leadership", "Skills", "Professional", "Development"],
    rating: 4.7,
    reviews: 38,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1551836026-d5c88ac5d2d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 4,
    title: "Alumni Golf Championship",
    description: "Compete for the prestigious alumni trophy in our annual golf tournament. Includes breakfast, lunch, awards ceremony, and networking reception. All skill levels welcome.",
    date: "2024-08-12",
    startTime: "07:30",
    endTime: "18:00",
    location: "Pine Valley Golf & Country Club",
    eventType: "sports",
    category: "recreational",
    price: 150,
    capacity: 120,
    registered: 78,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "upcoming",
    organizer: "Sports Alumni Association",
    organizerAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    tags: ["Golf", "Competition", "Sports", "Networking", "Outdoor"],
    rating: 4.6,
    reviews: 31,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 5,
    title: "Global Alumni Virtual Mixer",
    description: "Connect with alumni worldwide in our virtual networking event. Perfect for international alumni who want to stay connected with the community. Breakout rooms by industry and region.",
    date: "2024-04-25",
    startTime: "19:00",
    endTime: "21:00",
    location: "Virtual Event - Zoom",
    eventType: "virtual",
    category: "networking",
    price: 0,
    capacity: 200,
    registered: 156,
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "upcoming",
    organizer: "International Alumni Network",
    organizerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    tags: ["Virtual", "Global", "Networking", "Free", "Online"],
    rating: 4.5,
    reviews: 28,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 6,
    title: "Entrepreneurship & Startup Showcase",
    description: "Discover the next generation of alumni entrepreneurs. Pitch sessions, investor meetings, and networking opportunities for the startup community. Don't miss this chance to connect with innovators.",
    date: "2024-09-05",
    startTime: "13:00",
    endTime: "19:00",
    location: "Innovation Hub & Startup Garage",
    eventType: "showcase",
    category: "professional",
    price: 45,
    capacity: 150,
    registered: 89,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    status: "upcoming",
    organizer: "Entrepreneurship Center",
    organizerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    tags: ["Startups", "Pitching", "Investors", "Innovation", "Entrepreneurship"],
    rating: 4.8,
    reviews: 45,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const eventTypes = [
  { value: "all", label: "All Events", color: "default", icon: <CalendarOutlined /> },
  { value: "networking", label: "Networking", color: "blue", icon: <TeamOutlined /> },
  { value: "conference", label: "Conference", color: "purple", icon: <VideoCameraOutlined /> },
  { value: "workshop", label: "Workshop", color: "orange", icon: <UserOutlined /> },
  { value: "sports", label: "Sports", color: "green", icon: <TrophyOutlined /> },
  { value: "virtual", label: "Virtual", color: "cyan", icon: <GlobalOutlined /> },
  { value: "showcase", label: "Showcase", color: "red", icon: <StarOutlined /> },
  { value: "fundraising", label: "Fundraising", color: "gold", icon: <DollarOutlined /> },
];

const eventCategories = [
  { value: "all", label: "All Categories" },
  { value: "professional", label: "Professional Development" },
  { value: "social", label: "Social & Networking" },
  { value: "recreational", label: "Recreational" },
  { value: "educational", label: "Educational" },
  { value: "philanthropy", label: "Philanthropy" },
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

const AlumniEvents = () => {
  const [events, setEvents] = useState(initialEvents);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

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

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
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
          event.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Event type filter
      if (filters.eventType !== "all" && event.eventType !== filters.eventType) {
        return false;
      }

      // Category filter
      if (filters.category !== "all" && event.category !== filters.category) {
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
        case "capacity":
          return (a.capacity - a.registered) - (b.capacity - b.registered);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, activeTab, filters, sortBy]);

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

  const showEventDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailModalVisible(true);
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
      image: values.images?.[0] || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      images: values.images || [],
      organizerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
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

  const getStatusTag = (status) => {
    const statusConfig = {
      upcoming: { color: "blue", text: "Upcoming", icon: <ClockCircleOutlined /> },
      ongoing: { color: "green", text: "Live Now", icon: <CheckCircleOutlined /> },
      completed: { color: "default", text: "Completed", icon: <CheckCircleOutlined /> },
      cancelled: { color: "red", text: "Cancelled", icon: <DeleteOutlined /> },
    };
    const config = statusConfig[status] || { color: "default", text: status };
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const EventCard = ({ event }) => {
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
            <Tooltip title="View Details" key="view">
              <EyeOutlined onClick={() => showEventDetails(event)} />
            </Tooltip>,
            <Tooltip title="Register" key="register">
              <UserOutlined />
            </Tooltip>,
            <Tooltip title="Share" key="share">
              <ShareAltOutlined />
            </Tooltip>,
            <Dropdown overlay={menu} trigger={['click']} key="more">
              <MoreOutlined />
            </Dropdown>,
          ]}
        >
          <div className="event-card-content">
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

            <div className="event-organizer">
              <Avatar size="small" src={event.organizerAvatar} />
              <Text type="secondary">Hosted by {event.organizer}</Text>
            </div>

            <Divider />

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
                  <Tag color="green" className="earlybird-tag">
                    Early Bird
                  </Tag>
                </div>
              ) : (
                <Text strong className="regular-price">
                  {event.price === 0 ? "FREE" : `$${event.price}`}
                </Text>
              )}
            </div>

            <div className="event-registration">
              <div className="registration-stats">
                <Text type="secondary">
                  {event.registered} / {event.capacity} registered
                </Text>
                <Text strong>
                  {event.capacity - event.registered} spots left
                </Text>
              </div>
              <Progress
                percent={getRegistrationProgress(event.registered, event.capacity)}
                size="small"
                status={
                  getRegistrationProgress(event.registered, event.capacity) >= 90
                    ? "exception"
                    : "normal"
                }
              />
            </div>

            <div className="event-tags">
              {event.tags.map((tag) => (
                <Tag key={tag} className="event-tag">
                  {tag}
                </Tag>
              ))}
            </div>

            <Button 
              type="primary" 
              block 
              className="register-btn"
              onClick={() => showEventDetails(event)}
            >
              {event.status === 'completed' ? 'View Recap' : 'Register Now'}
            </Button>
          </div>
        </Card>
      </Badge.Ribbon>
    );
  };

  const EventListItem = ({ event }) => (
    <List.Item className="event-list-item">
      <div className="list-item-content">
        <div className="list-item-image">
          <img src={event.image} alt={event.title} />
          <div className="image-overlay">
            {getStatusTag(event.status)}
          </div>
        </div>

        <div className="list-item-details">
          <div className="list-item-header">
            <div className="header-main">
              <Title level={5} className="list-item-title">
                {event.title}
                {event.featured && <StarOutlined className="featured-icon" />}
              </Title>
              <div className="event-meta">
                <Space size="middle">
                  <Tag color={getEventTypeConfig(event.eventType).color}>
                    {getEventTypeConfig(event.eventType).label}
                  </Tag>
                  <div className="organizer-info">
                    <Avatar size="small" src={event.organizerAvatar} />
                    <Text type="secondary">{event.organizer}</Text>
                  </div>
                  <div className="event-rating-small">
                    <Rate disabled defaultValue={event.rating} allowHalf size="small" />
                    <Text>({event.reviews})</Text>
                  </div>
                </Space>
              </div>
            </div>
            <div className="header-actions">
              <Space>
                <Button size="small" icon={<HeartOutlined />} />
                <Button size="small" icon={<ShareAltOutlined />} />
                <Dropdown overlay={
                  <Menu>
                    <Menu.Item icon={<EyeOutlined />} onClick={() => showEventDetails(event)}>
                      View Details
                    </Menu.Item>
                    <Menu.Item icon={<EditOutlined />}>
                      Edit Event
                    </Menu.Item>
                  </Menu>
                }>
                  <Button size="small" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            </div>
          </div>

          <Paragraph ellipsis={{ rows: 2 }} className="list-item-description">
            {event.description}
          </Paragraph>

          <div className="list-item-meta">
            <Space size="large" wrap>
              <div className="meta-item">
                <CalendarOutlined />
                <Text>{moment(event.date).format("MMM DD, YYYY")}</Text>
              </div>
              <div className="meta-item">
                <ClockCircleOutlined />
                <Text>{event.startTime} - {event.endTime}</Text>
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

          <div className="list-item-progress">
            <Progress 
              percent={getRegistrationProgress(event.registered, event.capacity)} 
              size="small" 
              showInfo={false}
            />
            <Text type="secondary">
              {event.capacity - event.registered} spots remaining
            </Text>
          </div>

          <div className="list-item-tags">
            {event.tags.slice(0, 3).map(tag => (
              <Tag key={tag} className="event-tag-small">{tag}</Tag>
            ))}
            {event.tags.length > 3 && (
              <Tag className="event-tag-small">+{event.tags.length - 3} more</Tag>
            )}
          </div>

          <div className="list-item-actions">
            <Space>
              <Button 
                type="primary" 
                size="small"
                onClick={() => showEventDetails(event)}
              >
                {event.status === 'completed' ? 'View Recap' : 'Register Now'}
              </Button>
              <Button size="small" icon={<EyeOutlined />}>
                Details
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </List.Item>
  );

  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    featured: events.filter(e => e.featured).length,
    totalRegistrations: events.reduce((sum, event) => sum + event.registered, 0),
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
                Discover, create, and manage alumni events. Connect with your community through meaningful gatherings.
              </Text>
            </div>
            <Statistic
              title="Total Events"
              value={stats.total}
              valueStyle={{ color: "#1890ff", fontSize: "35px" }}
              prefix={<CalendarOutlined />}
            />
          </div>

          {/* Quick Stats */}
          <Row gutter={[16, 16]} className="quick-stats">
            <Col xs={12} sm={4}>
              <div className="stat-item">
                <Text strong style={{ color: '#1890ff' }}>{stats.upcoming}</Text>
                <Text type="secondary">Upcoming</Text>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="stat-item">
                <Text strong style={{ color: '#52c41a' }}>{stats.ongoing}</Text>
                <Text type="secondary">Live Now</Text>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="stat-item">
                <Text strong style={{ color: '#faad14' }}>{stats.completed}</Text>
                <Text type="secondary">Completed</Text>
              </div>
            </Col>
            <Col xs={12} sm={4}>
              <div className="stat-item">
                <Text strong style={{ color: '#eb2f96' }}>{stats.featured}</Text>
                <Text type="secondary">Featured</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="stat-item">
                <Text strong style={{ color: '#13c2c2' }}>{stats.totalRegistrations}</Text>
                <Text type="secondary">Total Registrations</Text>
              </div>
            </Col>
          </Row>
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
                  <Badge count={stats.total} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
                </span>
              } 
              key="all" 
            />
            <TabPane 
              tab={
                <span>
                  <ClockCircleOutlined />
                  Upcoming
                  <Badge count={stats.upcoming} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
                </span>
              } 
              key="upcoming" 
            />
            <TabPane 
              tab={
                <span>
                  <CheckCircleOutlined />
                  Ongoing
                  <Badge count={stats.ongoing} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                </span>
              } 
              key="ongoing" 
            />
            <TabPane 
              tab={
                <span>
                  <BookOutlined />
                  Completed
                  <Badge count={stats.completed} style={{ backgroundColor: '#faad14', marginLeft: 8 }} />
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
                onChange={(e) => handleFilterChange("search", e.target.value)}
                style={{ width: 300 }}
                size="large"
              />
              
              <Select
                value={filters.eventType}
                onChange={(value) => handleFilterChange("eventType", value)}
                style={{ width: 180 }}
                placeholder="Event Type"
              >
                {eventTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    <Tag color={type.color}>{type.label}</Tag>
                  </Option>
                ))}
              </Select>

              <Select
                value={filters.category}
                onChange={(value) => handleFilterChange("category", value)}
                style={{ width: 200 }}
                placeholder="Category"
              >
                {eventCategories.map(category => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="controls-right">
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 200 }}
                suffixIcon={<SortAscendingOutlined />}
                placeholder="Sort by"
              >
                {sortOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>

              <Button.Group>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  onClick={() => setViewMode("grid")}
                >
                  Grid View
                </Button>
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  onClick={() => setViewMode("list")}
                >
                  List View
                </Button>
              </Button.Group>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateModal}
                size="large"
              >
                Create Event
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters">
            <Row gutter={[16, 16]} className="filter-row">
              <Col xs={24} sm={8}>
                <Text strong>Price Range</Text>
                <Select
                  value={filters.priceRange}
                  onChange={(value) => handleFilterChange("priceRange", value)}
                  style={{ width: "100%" }}
                  placeholder="Any Price"
                >
                  <Option value="all">Any Price</Option>
                  <Option value="free">Free Events</Option>
                  <Option value="0-50">$0 - $50</Option>
                  <Option value="50-100">$50 - $100</Option>
                  <Option value="100-200">$100 - $200</Option>
                  <Option value="200+">$200+</Option>
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
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
              
              <Col xs={24} sm={8}>
                <Text strong>Date Range</Text>
                <RangePicker
                  value={filters.dateRange}
                  onChange={(dates) => handleFilterChange("dateRange", dates)}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </div>
        </Card>

        {/* Events Display */}
        <div className="events-display">
          {filteredAndSortedEvents.length === 0 ? (
            <Card className="no-events-card">
              <div className="no-events-content">
                <Title level={3}>No events found</Title>
                <Text type="secondary">
                  Try adjusting your filters or create a new event to get started.
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
                <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
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
          title="Create New Event"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
          className="create-event-modal"
        >
          <Steps current={currentStep} className="create-event-steps">
            <Step title="Basic Info" />
            <Step title="Date & Time" />
            <Step title="Details" />
            <Step title="Media" />
          </Steps>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateEvent}
            className="event-form"
          >
            {currentStep === 0 && (
              <div className="form-step">
                <Form.Item
                  name="title"
                  label="Event Title"
                  rules={[{ required: true, message: "Please enter event title" }]}
                >
                  <Input size="large" placeholder="Enter a compelling event title" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Event Description"
                  rules={[{ required: true, message: "Please enter event description" }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Describe your event in detail. What will attendees experience?"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="eventType"
                      label="Event Type"
                      rules={[{ required: true, message: "Please select event type" }]}
                    >
                      <Select size="large" placeholder="Select event type">
                        {eventTypes.filter(et => et.value !== 'all').map((type) => (
                          <Option key={type.value} value={type.value}>
                            <Tag color={type.color}>{type.label}</Tag>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="category"
                      label="Category"
                      rules={[{ required: true, message: "Please select category" }]}
                    >
                      <Select size="large" placeholder="Select category">
                        {eventCategories.filter(ec => ec.value !== 'all').map((category) => (
                          <Option key={category.value} value={category.value}>
                            {category.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {currentStep === 1 && (
              <div className="form-step">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="date"
                      label="Event Date"
                      rules={[{ required: true, message: "Please select event date" }]}
                    >
                      <DatePicker style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="timeRange"
                      label="Event Time"
                      rules={[{ required: true, message: "Please select event time" }]}
                    >
                      <TimePicker.RangePicker style={{ width: "100%" }} size="large" format="HH:mm" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="location"
                  label="Event Location"
                  rules={[{ required: true, message: "Please enter event location" }]}
                >
                  <Input placeholder="Enter physical location or virtual platform" size="large" />
                </Form.Item>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="price" label="Ticket Price ($)">
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        min={0}
                        placeholder="0"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="capacity"
                      label="Capacity"
                      rules={[{ required: true, message: "Please enter event capacity" }]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        min={1}
                        placeholder="50"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="organizer"
                      label="Organizer"
                      rules={[{ required: true, message: "Please enter organizer name" }]}
                    >
                      <Input placeholder="Organizer name" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="tags" label="Event Tags">
                  <Select
                    mode="tags"
                    size="large"
                    placeholder="Add tags to help people find your event"
                    tokenSeparators={[","]}
                  />
                </Form.Item>

                <Form.Item name="agenda" label="Event Agenda">
                  <TextArea
                    rows={4}
                    placeholder="Enter event schedule (one item per line)"
                  />
                </Form.Item>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <Form.Item name="featured" label="Featured Event" valuePropName="checked">
                  <Switch checkedChildren="Featured" unCheckedChildren="Regular" />
                </Form.Item>

                <Form.Item name="images" label="Event Images">
                  <Upload
                    listType="picture-card"
                    multiple
                    beforeUpload={() => false}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>

                <Form.Item name="earlyBirdPrice" label="Early Bird Price ($)">
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    min={0}
                    placeholder="Optional early bird price"
                  />
                </Form.Item>

                <Form.Item name="earlyBirdEnd" label="Early Bird End Date">
                  <DatePicker style={{ width: "100%" }} size="large" />
                </Form.Item>
              </div>
            )}

            <div className="form-actions">
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Previous
                </Button>
              )}
              {currentStep < 3 ? (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  Next
                </Button>
              ) : (
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  Create Event
                </Button>
              )}
            </div>
          </Form>
        </Modal>

        {/* Event Details Modal */}
        <Modal
          title={selectedEvent?.title}
          open={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width={1000}
          className="event-details-modal"
        >
          {selectedEvent && (
            <div className="event-details-content">
              <Row gutter={[32, 32]}>
                <Col span={16}>
                  <div className="event-gallery">
                    <img src={selectedEvent.image} alt={selectedEvent.title} className="main-image" />
                    <div className="image-thumbnails">
                      {selectedEvent.images?.map((img, index) => (
                        <img key={index} src={img} alt={`${selectedEvent.title} ${index + 1}`} />
                      ))}
                    </div>
                  </div>

                  <div className="event-description-section">
                    <Title level={4}>About This Event</Title>
                    <Paragraph>{selectedEvent.description}</Paragraph>
                  </div>

                  {selectedEvent.agenda && (
                    <div className="event-agenda">
                      <Title level={4}>Event Agenda</Title>
                      <List
                        dataSource={selectedEvent.agenda}
                        renderItem={(item) => (
                          <List.Item>
                            <Text>{item}</Text>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}

                  {selectedEvent.speakers && (
                    <div className="event-speakers">
                      <Title level={4}>Featured Speakers</Title>
                      <List
                        dataSource={selectedEvent.speakers}
                        renderItem={(speaker) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar size="large">{speaker.name.charAt(0)}</Avatar>}
                              title={speaker.name}
                              description={speaker.role}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Col>

                <Col span={8}>
                  <Card className="event-sidebar">
                    <div className="event-meta">
                      <div className="meta-item">
                        <CalendarOutlined />
                        <div>
                          <Text strong>{moment(selectedEvent.date).format("dddd, MMMM DD, YYYY")}</Text>
                          <br />
                          <Text type="secondary">{selectedEvent.startTime} - {selectedEvent.endTime}</Text>
                        </div>
                      </div>

                      <div className="meta-item">
                        <EnvironmentOutlined />
                        <div>
                          <Text strong>Location</Text>
                          <br />
                          <Text>{selectedEvent.location}</Text>
                        </div>
                      </div>

                      <div className="meta-item">
                        <TeamOutlined />
                        <div>
                          <Text strong>Organizer</Text>
                          <br />
                          <Space>
                            <Avatar size="small" src={selectedEvent.organizerAvatar} />
                            <Text>{selectedEvent.organizer}</Text>
                          </Space>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    <div className="pricing-section">
                      {isEarlyBirdAvailable(selectedEvent) ? (
                        <div className="pricing-earlybird">
                          <Text delete className="original-price">${selectedEvent.price}</Text>
                          <Text strong className="earlybird-price">${selectedEvent.earlyBirdPrice}</Text>
                          <Tag color="green">Early Bird</Tag>
                          <Text type="secondary">Until {moment(selectedEvent.earlyBirdEnd).format("MMM DD")}</Text>
                        </div>
                      ) : (
                        <Text strong className="regular-price large">
                          {selectedEvent.price === 0 ? "FREE" : `$${selectedEvent.price}`}
                        </Text>
                      )}
                    </div>

                    <Divider />

                    <div className="registration-section">
                      <div className="registration-stats">
                        <Progress 
                          percent={getRegistrationProgress(selectedEvent.registered, selectedEvent.capacity)} 
                          status={
                            getRegistrationProgress(selectedEvent.registered, selectedEvent.capacity) >= 90
                              ? "exception"
                              : "normal"
                          }
                        />
                        <Text type="secondary">
                          {selectedEvent.registered} registered • {selectedEvent.capacity - selectedEvent.registered} spots left
                        </Text>
                      </div>

                      <Button type="primary" size="large" block className="register-btn">
                        {selectedEvent.status === 'completed' ? 'View Event Recap' : 'Register Now'}
                      </Button>

                      <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                        <Button icon={<HeartOutlined />} block>
                          Add to Favorites
                        </Button>
                        <Button icon={<ShareAltOutlined />} block>
                          Share Event
                        </Button>
                      </Space>
                    </div>

                    <Divider />

                    <div className="event-tags-section">
                      <Text strong>Tags</Text>
                      <div className="tags-container">
                        {selectedEvent.tags.map(tag => (
                          <Tag key={tag} className="event-tag">{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default AlumniEvents;