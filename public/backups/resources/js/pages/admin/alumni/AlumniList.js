import React, { useState, useMemo, useEffect } from "react";
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
    message,
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
    DollarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./AlumniList.css";
import { Layout, AlumniDetails } from "~/components";
import useAlumni from "~/hooks/useAlumni";
import useEmployeeStatus from "~/hooks/useEmployeeStatus";
import axiosConfig from "~/utils/axiosConfig";
import { BASE_URL } from "~/utils/constant";
import secureLocalStorage from "react-secure-storage";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const statusColors = {
    Employed: "green",
    Unemployed: "red",
    "Under Employed": "orange",
};

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
        Employed: {
            color: "green",
            text: "Employed",
            icon: <CheckCircleOutlined />,
        },
        Unemployed: {
            color: "red",
            text: "Seeking Work",
            icon: <ClockCircleOutlined />,
        },
        "Under Employed": {
            color: "orange",
            text: "Under Employed",
            icon: <ExclamationCircleOutlined />,
        },
    };
    const statusConfig = config[status] || {
        color: "default",
        text: status,
    };
    return (
        <Tag color={statusConfig.color} icon={statusConfig.icon}>
            {statusConfig.text}
        </Tag>
    );
};

const StatusUpdateModal = ({
    visible,
    onCancel,
    onOk,
    alumnus,
    loading,
    statuses,
}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState("pending");

    useEffect(() => {
        if (alumnus) {
            form.setFieldsValue({
                status: alumnus.status || "pending",
                employment_status_id: alumnus.employment_status_id,
                admin_notes: alumnus.admin_notes || "",
            });

            setSelectedStatus(alumnus.status || "pending");
        }
    }, [alumnus, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onOk({
                ...values,
                status: selectedStatus,
            });
        });
    };

    const handleClose = () => {
        form.resetFields();
        onCancel();
    };

    const getStatusDescription = (status) => {
        const descriptions = {
            approved:
                "Alumni will be visible in the directory and can be contacted by other users.",
            pending:
                "Alumni profile will be under review and not visible to others until approved.",
            inactive:
                "Alumni profile will be hidden from the directory and marked as inactive.",
        };
        return descriptions[status] || "";
    };
    return (
        <Modal
            title={`Update Status - ${alumnus?.first_name ?? ""} ${
                alumnus?.last_name ?? ""
            }`}
            open={visible}
            onCancel={handleClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="New Status"
                    name="status"
                    rules={[
                        { required: true, message: "Please select a status" },
                    ]}
                >
                    <Select onChange={setSelectedStatus}>
                        <Option value="approved">
                            <Space>
                                <CheckCircleOutlined
                                    style={{ color: "#52c41a" }}
                                />
                                Approved
                            </Space>
                        </Option>
                        <Option value="pending">
                            <Space>
                                <ClockCircleOutlined
                                    style={{ color: "#faad14" }}
                                />
                                Pending Review
                            </Space>
                        </Option>
                        <Option value="inactive">
                            <Space>
                                <StopOutlined style={{ color: "#ff4d4f" }} />
                                Inactive
                            </Space>
                        </Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="employment_status_id"
                    label="Current Employment Status"
                    rules={[
                        {
                            required: true,
                            message: "Please select employment status",
                        },
                    ]}
                >
                    <Select placeholder="Select employment status">
                        {statuses?.map((status) => (
                            <Option key={status.id} value={status.id}>
                                {status.status_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {selectedStatus && (
                    <div
                        style={{
                            padding: "12px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "6px",
                            marginBottom: "16px",
                        }}
                    >
                        <Text type="secondary">
                            {getStatusDescription(selectedStatus)}
                        </Text>
                    </div>
                )}

                <Form.Item
                    label="Admin Notes"
                    name="admin_notes"
                    rules={[
                        {
                            required: true,
                            message:
                                "Please provide notes for this status change",
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        maxLength={500}
                        showCount
                        placeholder="Explain the reason for the status change"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const AlumniCard = ({ alumnus, handleView, handleStatusUpdate }) => {
    const role = secureLocalStorage.getItem("userRole");
    return (
        <Badge.Ribbon
            text="Featured"
            color="red"
            style={{ display: alumnus.isFeatured ? "block" : "none" }}
        >
            <Card
                className="alumni-card"
                actions={[
                    <Tooltip
                        key="view"
                        onClick={() => handleView(alumnus)}
                        title="View Profile"
                    >
                        <EyeOutlined />
                    </Tooltip>,
                    ...(role === "admin"
                        ? [
                              <Tooltip
                                  title="Edit Status"
                                  key="edit"
                                  onClick={() =>
                                      handleStatusUpdate(alumnus, "approved")
                                  }
                              >
                                  <EditOutlined />
                              </Tooltip>,
                          ]
                        : []),
                ]}
            >
                <div className="alumni-card-content">
                    <div className="alumni-header">
                        <Avatar size={64} src={alumnus.profile_image_url} />
                        <div className="alumni-basic-info">
                            <Title level={4} className="alumni-name">
                                {alumnus.first_name} {alumnus.last_name}
                                {getStatusIcon(alumnus.status)}
                            </Title>
                            <Text type="secondary">
                                {alumnus.major} • Class of{" "}
                                {alumnus.graduation_year}
                            </Text>
                        </div>
                    </div>

                    <Divider />

                    <div className="alumni-details">
                        <div className="detail-item-alumini">
                            <TeamOutlined />
                            <Text strong>Employment:</Text>
                            {getEmploymentStatusTag(
                                alumnus?.employment_status?.status_name
                            )}
                        </div>

                        {alumnus.currentCompany && (
                            <div className="detail-item-alumini">
                                <UserOutlined />
                                <Text>{alumnus.currentCompany}</Text>
                                <Text type="secondary">
                                    • {alumnus.position}
                                </Text>
                            </div>
                        )}

                        <div className="detail-item-alumini">
                            <EnvironmentOutlined />
                            <Text>{alumnus.address}</Text>
                        </div>

                        {alumnus.salary && (
                            <div className="detail-item-alumini">
                                <DollarOutlined />
                                <Text strong>
                                    ${alumnus.salary.toLocaleString()}
                                </Text>
                                <Text type="secondary">/year</Text>
                            </div>
                        )}

                        <div className="detail-item-alumini">
                            <CalendarOutlined />
                            <Text type="secondary">
                                Last active:{" "}
                                {moment(alumnus.lastActive).fromNow()}
                            </Text>
                        </div>

                        {alumnus.admin_notes && (
                            <div className="detail-item-alumini">
                                <ExclamationCircleOutlined />
                                <Text
                                    type="secondary"
                                    style={{ fontStyle: "italic" }}
                                >
                                    Note: {alumnus.admin_notes}
                                </Text>
                            </div>
                        )}
                    </div>

                    <div className="alumni-skills">
                        {Array.isArray(alumnus?.technical_skills) &&
                            alumnus?.technical_skills
                                ?.slice(0, 4)
                                .map((skill) => (
                                    <Tag key={skill} className="skill-tag">
                                        {skill}
                                    </Tag>
                                ))}
                        {Array.isArray(alumnus?.technical_skills) &&
                            alumnus?.technical_skills.length > 4 && (
                                <Tag className="skill-tag">
                                    +{alumnus?.technical_skills.length - 4} more
                                </Tag>
                            )}
                    </div>

                    <Paragraph ellipsis={{ rows: 2 }} className="alumni-bio">
                        {alumnus.bio}
                    </Paragraph>
                </div>
            </Card>
        </Badge.Ribbon>
    );
};

const AlumniList = () => {
    const { isLoading, data: alumni = [], isFetching, refetch } = useAlumni();
    const { data: statuses } = useEmployeeStatus();
    const [viewMode, setViewMode] = useState("grid");
    const [activeTab, setActiveTab] = useState("all");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
    const [selectedAlumnus, setSelectedAlumnus] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [previewData, setPreviewData] = useState(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const role = secureLocalStorage.getItem("userRole");

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

    const handleView = (values) => {
       const previewData = {
            // Personal Information
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            suffix: values.suffix,
            email: values.email,
            phone: values.phone,
            address: values.address,
            birth_date: values.birth_date,
            gender: values.gender,
            bio: values.bio,

            // Academic Information
            course_id: values.course_id,
            student_id: values.student_id,
            graduation_year: values.graduation_year,
            enrollment_year: values.enrollment_year,
            honors:
                typeof values.honors === "string" && values.honors.trim() !== ""
                    ? JSON.parse(values.honors)
                    : Array.isArray(values.honors)
                    ? values.honors
                    : [],
            thesis_title: values.thesis_title,
            academic_achievements: values.academic_achievements,
            extracurricular: values.extracurricular,
            continue_education: values.continue_education,

            // Career Information
            employment_status_id: values.employment_status_id,
            current_company: values.current_company,
            job_title: values.job_title,
            industry: values.industry,
            years_experience: values.years_experience,
            salary_range: values.salary_range,
            work_location: values.work_location,
            career_goals: values.career_goals,
            previous_companies: values.previous_companies,

            // Social media
            linkedin: values.linkedin,
            github: values.github,
            portfolio: values.portfolio,
            twitter: values.twitter,

            // Preferences
            newsletter: values.newsletter,
            contactPermission: values.contactPermission,
            agreement: values.agreement,

            // Files
            profileImage: values?.profile_image_url,
            idDocuments: values?.document_urls || [],
        };

        setPreviewData(previewData);
        setIsModalVisible(true);
    };




    const handleStatusUpdate = (alumnus, status) => {
        setSelectedAlumnus(alumnus);
        setSelectedStatus(status);
        setIsStatusModalVisible(true);
    };

    const handleStatusSubmit = async (formData) => {
        setStatusUpdateLoading(true);
        formData.id = selectedAlumnus.id;
        try {
            // Simulate delay (optional)
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const response = await axiosConfig.post(
                BASE_URL + "api/alumni/update-stastus",
                formData
            );

            message.success(
                `Successfully updated ${selectedAlumnus.first_name}'s status to ${formData.status}`
            );

            setIsStatusModalVisible(false);
            setSelectedAlumnus(null);
            setSelectedStatus(null);
            form.resetFields();
            // If you're using data-fetching hooks:
            refetch();
        } catch (error) {
            console.error(error);
            message.error("Failed to update status. Please try again.");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Filter and sort alumni
    const filteredAndSortedAlumni = useMemo(() => {
        let filtered = alumni.filter((alumnus) => {
            // Tab filter
            if (activeTab !== "all" && alumnus.status !== activeTab) {
                return false;
            }

            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();

                const firstName = alumnus?.first_name?.toLowerCase() || "";
                const lastName = alumnus?.last_name?.toLowerCase() || "";

                const matchesSearch =
                    firstName.includes(searchLower) ||
                    lastName.includes(searchLower);

                if (!matchesSearch) return false;
            }

            if (
                filters.employmentStatus.toLowerCase() !== "all" &&
                alumnus?.employment_status?.status_name?.toLowerCase() !==
                    filters.employmentStatus?.toLowerCase()
            ) {
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
                    return a?.name?.localeCompare(b.name);
                case "name-desc":
                    return b?.name?.localeCompare(a.name);
                case "graduation-desc":
                    return b?.graduationYear - a?.graduationYear;
                case "graduation-asc":
                    return a?.graduationYear - b?.graduationYear;
                case "salary-desc":
                    return (b?.salary || 0) - (a?.salary || 0);
                case "salary-asc":
                    return (a?.salary || 0) - (b?.salary || 0);
                case "lastActive-desc":
                    return moment(b?.lastActive).diff(moment(a?.lastActive));
                default:
                    return 0;
            }
        });

        return filtered;
    }, [alumni, activeTab, filters, sortBy]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
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

    const stats = {
        total: alumni.length,
        employed: alumni.filter((a) => a.employment_status_id === 1).length,
        unemployed: alumni.filter((a) => a.employment_status_id === 2).length,
        underEmployed: alumni.filter((a) => a.employment_status_id === 3)
            .length,
        graduateSchool: alumni.filter(
            (a) => a.employmentStatus === "graduate_school"
        ).length,
        pending: alumni.filter((a) => a.status === "pending").length,
        approved: alumni.filter((a) => a.status === "approved").length,
        inactive: alumni.filter((a) => a.status === "inactive").length,
    };

    return (
        <Layout>
            <div className="alumni-dashboard">
                {/* Header Section */}
                <Card className="dashboard-header-card">
                    <div className="header-content">
                        <div>
                            <Title level={2}>Alumni Directory</Title>
                            <Text type="secondary">
                                Manage and connect with university alumni. Track
                                employment status and engagement.
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
                        <Col xs={12} sm={8}>
                            <div className="stat-item">
                                <Text strong style={{ color: "#52c41a" }}>
                                    {stats.employed}
                                </Text>
                                <Text
                                    style={{ color: "#fff" }}
                                    type="secondary"
                                >
                                    Employed
                                </Text>
                            </div>
                        </Col>
                        <Col xs={12} sm={8}>
                            <div className="stat-item">
                                <Text strong style={{ color: "#ff4d4f" }}>
                                    {stats.unemployed}
                                </Text>
                                <Text
                                    type="secondary"
                                    style={{ color: "#fff" }}
                                >
                                    Seeking Work
                                </Text>
                            </div>
                        </Col>
                        <Col xs={12} sm={8}>
                            <div className="stat-item">
                                <Text strong style={{ color: "#faad14" }}>
                                    {stats.underEmployed}
                                </Text>
                                <Text
                                    type="secondary"
                                    style={{ color: "#fff" }}
                                >
                                    Under Employed
                                </Text>
                            </div>
                        </Col>
                        {/* <Col xs={12} sm={6}>
                            <div className="stat-item">
                                <Text strong style={{ color: "#1890ff" }}>
                                    {stats.graduateSchool}
                                </Text>
                                <Text type="secondary">Graduate School</Text>
                            </div>
                        </Col> */}
                    </Row>
                </Card>
                <br></br>
                {role === "admin" && (
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
                                        <Badge
                                            count={stats.total}
                                            style={{
                                                backgroundColor: "#52c41a",
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
                                        Pending Review
                                        <Badge
                                            count={stats.pending}
                                            style={{
                                                backgroundColor: "#faad14",
                                                marginLeft: 8,
                                            }}
                                        />
                                    </span>
                                }
                                key="pending"
                            />
                            <TabPane
                                tab={
                                    <span>
                                        <CheckCircleOutlined />
                                        Approved
                                        <Badge
                                            count={stats.approved}
                                            style={{
                                                backgroundColor: "#52c41a",
                                                marginLeft: 8,
                                            }}
                                        />
                                    </span>
                                }
                                key="approved"
                            />
                            <TabPane
                                tab={
                                    <span>
                                        <StopOutlined />
                                        Inactive
                                        <Badge
                                            count={stats.inactive}
                                            style={{
                                                backgroundColor: "#ff4d4f",
                                                marginLeft: 8,
                                            }}
                                        />
                                    </span>
                                }
                                key="inactive"
                            />
                        </Tabs>
                    </Card>
                )}

                {/* Controls Section */}
                <Card className="controls-card">
                    <div className="controls-section">
                        <div className="controls-left">
                            <Input
                                placeholder="Search alumni by name, email, major, skills..."
                                prefix={<SearchOutlined />}
                                value={filters.search}
                                onChange={(e) =>
                                    handleFilterChange("search", e.target.value)
                                }
                                style={{ width: 300 }}
                                size="large"
                            />

                            <Select
                                value={filters.employmentStatus}
                                onChange={(value) =>
                                    handleFilterChange(
                                        "employmentStatus",
                                        value
                                    )
                                }
                                style={{ width: 300 }}
                                placeholder="Employment Status"
                            >
                                {employmentStatusOptions.map((option) => (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        <Tag color={option.color}>
                                            {option.label}
                                        </Tag>
                                    </Option>
                                ))}
                            </Select>

                            {/* <Select
                                value={filters.major}
                                onChange={(value) =>
                                    handleFilterChange("major", value)
                                }
                                style={{ width: 180 }}
                                placeholder="Filter by Major"
                            >
                                <Option value="all">All Majors</Option>
                                {majorOptions.map((major) => (
                                    <Option key={major} value={major}>
                                        {major}
                                    </Option>
                                ))}
                            </Select> */}
                        </div>

                        {/* <div className="controls-right">
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                style={{ width: 200 }}
                                suffixIcon={<SortAscendingOutlined />}
                                placeholder="Sort by"
                            >
                                {sortOptions.map((option) => (
                                    <Option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>

                            <Button.Group>
                                <Button
                                    type={
                                        viewMode === "grid"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => setViewMode("grid")}
                                >
                                    Grid View
                                </Button>
                                <Button
                                    type={
                                        viewMode === "list"
                                            ? "primary"
                                            : "default"
                                    }
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
                        </div> */}
                    </div>
                </Card>
                {/* Alumni Display */}
                <div className="alumni-display">
                    {filteredAndSortedAlumni.length === 0 ? (
                        <Card className="no-alumni-card">
                            <div className="no-alumni-content">
                                <Title level={3}>No alumni found</Title>
                                <Text type="secondary">
                                    Try adjusting your filters or search terms
                                    to find alumni
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
                            {filteredAndSortedAlumni.map((alumnus) => (
                                <Col
                                    xs={24}
                                    sm={12}
                                    lg={8}
                                    xl={6}
                                    key={alumnus.id}
                                >
                                    <AlumniCard
                                        alumnus={alumnus}
                                        handleView={handleView}
                                        handleStatusUpdate={handleStatusUpdate}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

                {/* Alumni Details Modal */}
                <AlumniDetails
                    visible={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                    }}
                    onSubmit={() => {}}
                    previewData={previewData}
                    viewOnly={true}
                />

                {/* Status Update Modal */}
                <StatusUpdateModal
                    visible={isStatusModalVisible}
                    onCancel={() => {
                        setIsStatusModalVisible(false);
                        setSelectedAlumnus(null);
                        setSelectedStatus(null);
                    }}
                    onOk={handleStatusSubmit}
                    alumnus={selectedAlumnus}
                    loading={statusUpdateLoading}
                    statuses={statuses}
                />
            </div>
        </Layout>
    );
};

export default AlumniList;
