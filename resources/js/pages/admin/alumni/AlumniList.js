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
  Switch,
  Progress,
  Rate,
  Tooltip,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  EyeOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkedinOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  MoreOutlined,
  PlusOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  DollarOutlined
} from "@ant-design/icons";
import moment from "moment";
import "./AlumniList.css";
import { Layout, Breadcrumb } from "~/components";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Mock data for alumni
const initialAlumni = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    graduationYear: 2020,
    major: "Computer Science",
    employmentStatus: "employed",
    status: "approved",
    currentCompany: "Google",
    position: "Senior Software Engineer",
    location: "San Francisco, CA",
    salary: 185000,
    skills: ["React", "Node.js", "Python", "AWS"],
    lastActive: "2024-05-15",
    joinDate: "2020-06-01",
    rating: 4.8,
    reviews: 24,
    isFeatured: true,
    bio: "Full-stack developer passionate about building scalable applications and mentoring junior developers.",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "m.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    graduationYear: 2019,
    major: "Business Administration",
    employmentStatus: "employed",
    status: "approved",
    currentCompany: "McKinsey & Company",
    position: "Senior Business Analyst",
    location: "New York, NY",
    salary: 145000,
    skills: ["Strategy", "Consulting", "Data Analysis", "Leadership"],
    lastActive: "2024-05-10",
    joinDate: "2019-07-15",
    rating: 4.6,
    reviews: 18,
    isFeatured: false,
    bio: "Strategy consultant with focus on digital transformation and operational excellence.",
  },
  {
    id: 3,
    name: "Emily Watson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "emily.watson@email.com",
    phone: "+1 (555) 345-6789",
    graduationYear: 2021,
    major: "Biology",
    employmentStatus: "graduate_school",
    status: "pending",
    currentCompany: "Harvard Medical School",
    position: "PhD Candidate",
    location: "Boston, MA",
    salary: null,
    skills: ["Research", "Molecular Biology", "Data Analysis", "Publications"],
    lastActive: "2024-04-20",
    joinDate: "2021-08-01",
    rating: 4.9,
    reviews: 12,
    isFeatured: true,
    bio: "Biomedical researcher focusing on cancer therapeutics and drug discovery.",
  },
  {
    id: 4,
    name: "James Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "james.kim@email.com",
    phone: "+1 (555) 456-7890",
    graduationYear: 2022,
    major: "Electrical Engineering",
    employmentStatus: "under_employed",
    status: "approved",
    currentCompany: "Tech Startup Inc.",
    position: "Technical Support Specialist",
    location: "Austin, TX",
    salary: 55000,
    skills: ["Python", "Embedded Systems", "CAD", "Technical Support"],
    lastActive: "2024-05-18",
    joinDate: "2022-06-15",
    rating: 4.3,
    reviews: 8,
    isFeatured: false,
    bio: "Electrical engineer seeking opportunities in hardware design and embedded systems.",
  },
  {
    id: 5,
    name: "Jessica Brown",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "jessica.brown@email.com",
    phone: "+1 (555) 567-8901",
    graduationYear: 2023,
    major: "Psychology",
    employmentStatus: "unemployed",
    status: "pending",
    currentCompany: null,
    position: "Seeking Opportunities",
    location: "Chicago, IL",
    salary: null,
    skills: ["Counseling", "Research", "Data Analysis", "Communication"],
    lastActive: "2024-05-05",
    joinDate: "2023-07-01",
    rating: 4.5,
    reviews: 6,
    isFeatured: false,
    bio: "Recent psychology graduate seeking opportunities in clinical research or counseling.",
  },
  {
    id: 6,
    name: "David Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "david.wilson@email.com",
    phone: "+1 (555) 678-9012",
    graduationYear: 2018,
    major: "Mechanical Engineering",
    employmentStatus: "employed",
    status: "inactive",
    currentCompany: "Tesla",
    position: "Lead Mechanical Engineer",
    location: "Palo Alto, CA",
    salary: 165000,
    skills: ["CAD", "Thermodynamics", "Project Management", "3D Modeling"],
    lastActive: "2024-01-15",
    joinDate: "2018-06-20",
    rating: 4.7,
    reviews: 32,
    isFeatured: true,
    bio: "Mechanical engineer with expertise in automotive design and sustainable energy solutions.",
  },
  {
    id: 7,
    name: "Amanda Lee",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "amanda.lee@email.com",
    phone: "+1 (555) 789-0123",
    graduationYear: 2020,
    major: "Marketing",
    employmentStatus: "employed",
    status: "approved",
    currentCompany: "Apple",
    position: "Product Marketing Manager",
    location: "Cupertino, CA",
    salary: 135000,
    skills: ["Digital Marketing", "Brand Strategy", "Analytics", "Content Creation"],
    lastActive: "2024-05-20",
    joinDate: "2020-07-10",
    rating: 4.8,
    reviews: 19,
    isFeatured: true,
    bio: "Product marketing professional with passion for technology and consumer electronics.",
  },
  {
    id: 8,
    name: "Robert Taylor",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    email: "robert.taylor@email.com",
    phone: "+1 (555) 890-1234",
    graduationYear: 2021,
    major: "Finance",
    employmentStatus: "under_employed",
    status: "approved",
    currentCompany: "Local Credit Union",
    position: "Financial Advisor",
    location: "Denver, CO",
    salary: 48000,
    skills: ["Financial Analysis", "Investment", "Excel", "Risk Management"],
    lastActive: "2024-05-12",
    joinDate: "2021-08-15",
    rating: 4.2,
    reviews: 7,
    isFeatured: false,
    bio: "Finance professional seeking opportunities in investment banking or corporate finance.",
  },
];

const employmentStatusOptions = [
  { value: "all", label: "All Employment", color: "default" },
  { value: "employed", label: "Employed", color: "green" },
  { value: "unemployed", label: "Unemployed", color: "red" },
  { value: "under_employed", label: "Under Employed", color: "orange" },
  { value: "graduate_school", label: "Graduate School", color: "blue" },
];

const statusOptions = [
  { value: "all", label: "All Status", color: "default" },
  { value: "pending", label: "Pending Review", color: "orange" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "inactive", label: "Inactive", color: "red" },
];

const majorOptions = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Biology",
  "Psychology",
  "Marketing",
  "Finance",
  "Arts & Sciences",
];

const sortOptions = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "graduation-desc", label: "Graduation: Recent First" },
  { value: "graduation-asc", label: "Graduation: Oldest First" },
  { value: "salary-desc", label: "Salary: High to Low" },
  { value: "salary-asc", label: "Salary: Low to High" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "lastActive-desc", label: "Recently Active" },
];

const AlumniList = () => {
  const [alumni, setAlumni] = useState(initialAlumni);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [form] = Form.useForm();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    employmentStatus: "all",
    status: "all",
    major: "all",
    graduationYear: "all",
    featured: "all",
  });

  const [sortBy, setSortBy] = useState("name-asc");

  // Filter and sort alumni
  const filteredAndSortedAlumni = useMemo(() => {
    let filtered = alumni.filter(alumnus => {
      // Tab filter
      if (activeTab !== "all" && alumnus.status !== activeTab) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          alumnus.name.toLowerCase().includes(searchLower) ||
          alumnus.email.toLowerCase().includes(searchLower) ||
          alumnus.major.toLowerCase().includes(searchLower) ||
          alumnus.currentCompany?.toLowerCase().includes(searchLower) ||
          alumnus.position?.toLowerCase().includes(searchLower) ||
          alumnus.skills.some(skill => skill.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Employment status filter
      if (filters.employmentStatus !== "all" && alumnus.employmentStatus !== filters.employmentStatus) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && alumnus.status !== filters.status) {
        return false;
      }

      // Major filter
      if (filters.major !== "all" && alumnus.major !== filters.major) {
        return false;
      }

      // Featured filter
      if (filters.featured !== "all") {
        const isFeatured = filters.featured === "featured";
        if (alumnus.isFeatured !== isFeatured) return false;
      }

      return true;
    });

    // Sort alumni
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "graduation-desc":
          return b.graduationYear - a.graduationYear;
        case "graduation-asc":
          return a.graduationYear - b.graduationYear;
        case "salary-desc":
          return (b.salary || 0) - (a.salary || 0);
        case "salary-asc":
          return (a.salary || 0) - (b.salary || 0);
        case "rating-desc":
          return b.rating - a.rating;
        case "lastActive-desc":
          return moment(b.lastActive).diff(moment(a.lastActive));
        default:
          return 0;
      }
    });

    return filtered;
  }, [alumni, activeTab, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      employmentStatus: "all",
      status: "all",
      major: "all",
      graduationYear: "all",
      featured: "all",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "pending":
        return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "inactive":
        return <StopOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <UserOutlined />;
    }
  };

  const getEmploymentStatusTag = (status) => {
    const config = {
      employed: { color: "green", text: "Employed", icon: <CheckCircleOutlined /> },
      unemployed: { color: "red", text: "Seeking Work", icon: <ClockCircleOutlined /> },
      under_employed: { color: "orange", text: "Under Employed", icon: <ExclamationCircleOutlined /> },
      graduate_school: { color: "blue", text: "Graduate School", icon: <BookOutlined /> },
    };
    const statusConfig = config[status] || { color: "default", text: status };
    return (
      <Tag color={statusConfig.color} icon={statusConfig.icon}>
        {statusConfig.text}
      </Tag>
    );
  };

  const handleStatusUpdate = (alumnusId, newStatus) => {
    setAlumni(prev => prev.map(alumnus => 
      alumnus.id === alumnusId ? { ...alumnus, status: newStatus } : alumnus
    ));
    message.success(`Status updated to ${newStatus}`);
  };

  const AlumniCard = ({ alumnus }) => {
    const menu = (
      <Menu>
        <Menu.Item key="view" icon={<EyeOutlined />}>
          View Profile
        </Menu.Item>
        <Menu.Item key="edit" icon={<EditOutlined />}>
          Edit Information
        </Menu.Item>
        <Menu.Item key="email" icon={<MailOutlined />}>
          Send Email
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="approve" 
          onClick={() => handleStatusUpdate(alumnus.id, "approved")}
          icon={<CheckCircleOutlined />}
        >
          Approve
        </Menu.Item>
        <Menu.Item key="pending" 
          onClick={() => handleStatusUpdate(alumnus.id, "pending")}
          icon={<ClockCircleOutlined />}
        >
          Mark Pending
        </Menu.Item>
        <Menu.Item key="inactive" 
          onClick={() => handleStatusUpdate(alumnus.id, "inactive")}
          icon={<StopOutlined />}
        >
          Mark Inactive
        </Menu.Item>
      </Menu>
    );

    return (
      <Badge.Ribbon 
        text="Featured" 
        color="red"
        style={{ display: alumnus.isFeatured ? "block" : "none" }}
      >
        <Card
          className="alumni-card"
          actions={[
            <Tooltip title="View Profile" key="view">
              <EyeOutlined />
            </Tooltip>,
            <Tooltip title="Send Message" key="message">
              <MailOutlined />
            </Tooltip>,
            <Tooltip title="Connect" key="connect">
              <LinkedinOutlined />
            </Tooltip>,
            <Dropdown overlay={menu} trigger={['click']} key="more">
              <MoreOutlined />
            </Dropdown>,
          ]}
        >
          <div className="alumni-card-content">
            <div className="alumni-header">
              <Avatar size={64} src={alumnus.avatar} />
              <div className="alumni-basic-info">
                <Title level={4} className="alumni-name">
                  {alumnus.name}
                  {getStatusIcon(alumnus.status)}
                </Title>
                <Text type="secondary">{alumnus.major} • Class of {alumnus.graduationYear}</Text>
                <div className="alumni-rating">
                  <Rate disabled defaultValue={alumnus.rating} allowHalf size="small" />
                  <Text className="rating-text">({alumnus.reviews})</Text>
                </div>
              </div>
            </div>

            <Divider />

            <div className="alumni-details">
              <div className="detail-item">
                <TeamOutlined />
                <Text strong>Employment:</Text>
                {getEmploymentStatusTag(alumnus.employmentStatus)}
              </div>
              
              {alumnus.currentCompany && (
                <div className="detail-item">
                  <UserOutlined />
                  <Text>{alumnus.currentCompany}</Text>
                  <Text type="secondary">• {alumnus.position}</Text>
                </div>
              )}

              <div className="detail-item">
                <EnvironmentOutlined />
                <Text>{alumnus.location}</Text>
              </div>

              {alumnus.salary && (
                <div className="detail-item">
                  <DollarOutlined />
                  <Text strong>${alumnus.salary.toLocaleString()}</Text>
                  <Text type="secondary">/year</Text>
                </div>
              )}

              <div className="detail-item">
                <CalendarOutlined />
                <Text type="secondary">
                  Last active: {moment(alumnus.lastActive).fromNow()}
                </Text>
              </div>
            </div>

            <div className="alumni-skills">
              {alumnus.skills.slice(0, 4).map(skill => (
                <Tag key={skill} className="skill-tag">{skill}</Tag>
              ))}
              {alumnus.skills.length > 4 && (
                <Tag className="skill-tag">+{alumnus.skills.length - 4} more</Tag>
              )}
            </div>

            <Paragraph ellipsis={{ rows: 2 }} className="alumni-bio">
              {alumnus.bio}
            </Paragraph>

            <div className="alumni-actions">
              <Button type="primary" size="small" icon={<MailOutlined />}>
                Contact
              </Button>
              <Button size="small" icon={<LinkedinOutlined />}>
                Connect
              </Button>
              <Button size="small" icon={<ShareAltOutlined />}>
                Share
              </Button>
            </div>
          </div>
        </Card>
      </Badge.Ribbon>
    );
  };

  const AlumniListItem = ({ alumnus }) => (
    <List.Item className="alumni-list-item">
      <div className="list-item-content">
        <div className="list-item-main">
          <Avatar size={48} src={alumnus.avatar} />
          <div className="list-item-info">
            <div className="list-item-header">
              <Title level={5} className="list-item-name">
                {alumnus.name}
                {getStatusIcon(alumnus.status)}
                {alumnus.isFeatured && <StarOutlined style={{ color: '#faad14', marginLeft: 8 }} />}
              </Title>
              <Space>
                {getEmploymentStatusTag(alumnus.employmentStatus)}
                {alumnus.salary && (
                  <Text strong>${alumnus.salary.toLocaleString()}</Text>
                )}
              </Space>
            </div>
            
            <div className="list-item-details">
              <Space size="large">
                <div className="meta-item">
                  <UserOutlined />
                  <Text>{alumnus.major} • {alumnus.graduationYear}</Text>
                </div>
                <div className="meta-item">
                  <EnvironmentOutlined />
                  <Text>{alumnus.location}</Text>
                </div>
                <div className="meta-item">
                  <TeamOutlined />
                  <Text>{alumnus.currentCompany || "Seeking Opportunities"}</Text>
                </div>
                <div className="meta-item">
                  <CalendarOutlined />
                  <Text>Active {moment(alumnus.lastActive).fromNow()}</Text>
                </div>
              </Space>
            </div>

            <div className="list-item-skills">
              {alumnus.skills.slice(0, 3).map(skill => (
                <Tag key={skill} className="skill-tag-small">{skill}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div className="list-item-actions">
          <Space>
            <Button type="primary" size="small" icon={<MailOutlined />}>
              Contact
            </Button>
            <Button size="small" icon={<EyeOutlined />}>
              Profile
            </Button>
            <Dropdown overlay={
              <Menu>
                <Menu.Item icon={<CheckCircleOutlined />} onClick={() => handleStatusUpdate(alumnus.id, "approved")}>
                  Approve
                </Menu.Item>
                <Menu.Item icon={<ClockCircleOutlined />} onClick={() => handleStatusUpdate(alumnus.id, "pending")}>
                  Mark Pending
                </Menu.Item>
                <Menu.Item icon={<StopOutlined />} onClick={() => handleStatusUpdate(alumnus.id, "inactive")}>
                  Mark Inactive
                </Menu.Item>
              </Menu>
            }>
              <Button size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        </div>
      </div>
    </List.Item>
  );

  const stats = {
    total: alumni.length,
    employed: alumni.filter(a => a.employmentStatus === 'employed').length,
    unemployed: alumni.filter(a => a.employmentStatus === 'unemployed').length,
    underEmployed: alumni.filter(a => a.employmentStatus === 'under_employed').length,
    graduateSchool: alumni.filter(a => a.employmentStatus === 'graduate_school').length,
    pending: alumni.filter(a => a.status === 'pending').length,
    approved: alumni.filter(a => a.status === 'approved').length,
    inactive: alumni.filter(a => a.status === 'inactive').length,
  };

  return (
    <Layout>
      <div className="alumni-list-container">
        {/* Header Section */}
        <Card className="alumni-header-card">
          <div className="header-content">
            <div>
              <Title level={2}>Alumni Directory</Title>
              <Text type="secondary">
                Manage and connect with university alumni. Track employment status and engagement.
              </Text>
            </div>
            <Statistic
              title="Total Alumni"
              value={stats.total}
              valueStyle={{ color: "#1890ff", fontSize: "35px" }}
              prefix={<TeamOutlined />}
            />
          </div>

          {/* Quick Stats */}
          <Row gutter={[16, 16]} className="quick-stats">
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Text strong style={{ color: '#52c41a' }}>{stats.employed}</Text>
                <Text type="secondary">Employed</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Text strong style={{ color: '#ff4d4f' }}>{stats.unemployed}</Text>
                <Text type="secondary">Seeking Work</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Text strong style={{ color: '#faad14' }}>{stats.underEmployed}</Text>
                <Text type="secondary">Under Employed</Text>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <Text strong style={{ color: '#1890ff' }}>{stats.graduateSchool}</Text>
                <Text type="secondary">Graduate School</Text>
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
                  <TeamOutlined />
                  All Alumni
                  <Badge count={stats.total} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                </span>
              } 
              key="all" 
            />
            <TabPane 
              tab={
                <span>
                  <ClockCircleOutlined />
                  Pending Review
                  <Badge count={stats.pending} style={{ backgroundColor: '#faad14', marginLeft: 8 }} />
                </span>
              } 
              key="pending" 
            />
            <TabPane 
              tab={
                <span>
                  <CheckCircleOutlined />
                  Approved
                  <Badge count={stats.approved} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
                </span>
              } 
              key="approved" 
            />
            <TabPane 
              tab={
                <span>
                  <StopOutlined />
                  Inactive
                  <Badge count={stats.inactive} style={{ backgroundColor: '#ff4d4f', marginLeft: 8 }} />
                </span>
              } 
              key="inactive" 
            />
          </Tabs>
        </Card>

        {/* Controls Section */}
        <Card className="controls-card">
          <div className="controls-section">
            <div className="controls-left">
              <Input
                placeholder="Search alumni by name, email, major, skills..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                style={{ width: 300 }}
                size="large"
              />
              
              <Select
                value={filters.employmentStatus}
                onChange={(value) => handleFilterChange("employmentStatus", value)}
                style={{ width: 180 }}
                placeholder="Employment Status"
              >
                {employmentStatusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <Tag color={option.color}>{option.label}</Tag>
                  </Option>
                ))}
              </Select>

              <Select
                value={filters.major}
                onChange={(value) => handleFilterChange("major", value)}
                style={{ width: 180 }}
                placeholder="Filter by Major"
              >
                <Option value="all">All Majors</Option>
                {majorOptions.map(major => (
                  <Option key={major} value={major}>{major}</Option>
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
                onClick={() => setIsModalVisible(true)}
              >
                Add Alumni
              </Button>
            </div>
          </div>
        </Card>

        {/* Alumni Display */}
        <div className="alumni-display">
          {filteredAndSortedAlumni.length === 0 ? (
            <Card className="no-alumni-card">
              <div className="no-alumni-content">
                <Title level={3}>No alumni found</Title>
                <Text type="secondary">
                  Try adjusting your filters or search terms to find alumni.
                </Text>
                <br />
                <Button type="primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </Card>
          ) : viewMode === "grid" ? (
            <Row gutter={[24, 24]}>
              {filteredAndSortedAlumni.map((alumnus) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={alumnus.id}>
                  <AlumniCard alumnus={alumnus} />
                </Col>
              ))}
            </Row>
          ) : (
            <List
              className="alumni-list"
              dataSource={filteredAndSortedAlumni}
              renderItem={(alumnus) => <AlumniListItem alumnus={alumnus} />}
            />
          )}
        </div>

        {/* Add Alumni Modal */}
        <Modal
          title="Add New Alumni"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical">
            {/* Add form fields for new alumni */}
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default AlumniList;