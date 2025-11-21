import React, { useState } from "react";
import {
    Drawer,
    Image,
    Button,
    Space,
    Row,
    Col,
    Card,
    Tag,
    Typography,
    Divider,
    Avatar,
    Modal,
} from "antd";
import {
    BankOutlined,
    EyeOutlined,
    DownloadOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    TrophyOutlined,
    BookOutlined,
    IdcardOutlined,
    GlobalOutlined,
    LinkedinOutlined,
    GithubOutlined,
    FileImageOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    TrophyOutlined as TrophyIcon,
    CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import secureLocalStorage from "react-secure-storage";

const { Title, Text, Paragraph } = Typography;

const companyInfo = {
    name: "Opol Community College Alumni Association",
    logo: "https://occph.com/build/assets/OCC_LOGO-BWCM4zrL.png",
};

const ID_TYPES = [
    { value: "student_id", label: "Student ID Card", icon: <IdcardOutlined /> },
    { value: "alumni_id", label: "Alumni ID Card", icon: <UserOutlined /> },
    {
        value: "government_id",
        label: "Government ID",
        icon: <FileImageOutlined />,
    },
    { value: "diploma", label: "Diploma", icon: <SafetyCertificateOutlined /> },
    { value: "transcript", label: "Transcript", icon: <BookOutlined /> },
];

const employmentStatusOptions = [
    { value: "employed", label: "Employed", color: "green" },
    { value: "unemployed", label: "Unemployed", color: "red" },
    { value: "self-employed", label: "Self-Employed", color: "orange" },
    { value: "freelancer", label: "Freelancer", color: "blue" },
    { value: "graduate_student", label: "Graduate Student", color: "purple" },
    { value: "entrepreneur", label: "Entrepreneur", color: "cyan" },
    {
        value: "seeking_opportunities",
        label: "Seeking Opportunities",
        color: "gold",
    },
];

const courseOptions = [
    {
        value: "BSIT",
        label: "Bachelor of Science in Information Technology",
        college: "College of Computer Studies",
    },
    {
        value: "BSCS",
        label: "Bachelor of Science in Computer Science",
        college: "College of Computer Studies",
    },
    // ... other courses
];

const AlumniDetails = ({
    visible,
    onCancel,
    onSubmit,
    previewData,
    loading = false,
    viewOnly = false,
}) => {
    const [zoomImage, setZoomImage] = useState(null);
    const [zoomVisible, setZoomVisible] = useState(false);
    const role = secureLocalStorage.getItem("userRole");

    const handleImageZoom = (imageUrl) => {
        setZoomImage(imageUrl);
        setZoomVisible(true);
    };

    // Safe data access with fallbacks
    const getData = (path, defaultValue = "") => {
        return path
            .split(".")
            .reduce((obj, key) => obj?.[key] ?? defaultValue, previewData);
    };

    const formatName = () => {
        const firstName = getData("first_name");
        const middleName = getData("middle_name");
        const lastName = getData("last_name");
        const suffix = getData("suffix");

        return `${firstName} ${middleName} ${lastName} ${suffix}`
            .replace(/\s+/g, " ")
            .trim();
    };

    const getEmploymentStatus = () => {
        const statusValue = getData("employment_status");
        return (
            employmentStatusOptions.find((s) => s.value === statusValue)
                ?.label || statusValue
        );
    };

    const getEmploymentStatusColor = () => {
        const statusValue = getData("employment_status");
        return (
            employmentStatusOptions.find((s) => s.value === statusValue)
                ?.color || "blue"
        );
    };

    const getCourseName = () => {
        const courseValue = getData("course");
        return (
            courseOptions.find((c) => c.value === courseValue)?.label ||
            courseValue
        );
    };

    const honors = getData("honors", []);

    if (!previewData) return null;

    return (
        <>
            <Drawer
                title={
                    <Space>
                        <BankOutlined />
                        Alumni Registration Preview - {companyInfo.name}
                    </Space>
                }
                open={visible}
                onClose={onCancel}
                width="100%"
                height="100%"
                className="preview-drawer"
                placement="right"
                extra={
                    <Space>
                        <Button
                            icon={<CloseOutlined />}
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Close
                        </Button>
                        {/* {!viewOnly && (
                            <Button
                                type="primary"
                                onClick={onSubmit}
                                loading={loading}
                            >
                                Submit Application
                            </Button>
                        )} */}
                    </Space>
                }
                styles={{
                    body: { padding: 0 },
                    header: { borderBottom: "1px solid #f0f0f0" },
                }}
            >
                <div className=" drawer-content">
                    {/* Header Section */}
                    <div className="preview-header">
                        <div className="preview-profile-section">
                            <div className="profile-image-container">
                                {getData("profileImage") ? (
                                    <div className="profile-image-wrapper">
                                        <img
                                            src={getData("profileImage")}
                                            alt="Profile"
                                            className="preview-profile-img"
                                        />
                                        <div
                                            className="image-zoom-overlay"
                                            onClick={() =>
                                                handleImageZoom(
                                                    getData("profileImage")
                                                )
                                            }
                                        >
                                            <EyeOutlined />
                                            <span>Click to Zoom</span>
                                        </div>
                                    </div>
                                ) : (
                                    <Avatar
                                        size={120}
                                        icon={<UserOutlined />}
                                        className="default-avatar"
                                    />
                                )}
                            </div>
                            <div className="profile-info">
                                <Title level={2} className="preview-name">
                                    {formatName()}
                                </Title>
                                <Text className="preview-title">
                                    {getData("job_title") || "Alumni"}
                                    {getData("current_company") &&
                                        ` at ${getData("current_company")}`}
                                </Text>
                                <div className="preview-contact-info">
                                    <Row gutter={[16, 8]}>
                                        {getData("email") && (
                                            <Col xs={24} sm={12} md={8}>
                                                <div className="contact-item">
                                                    <MailOutlined className="contact-icon" />
                                                    <div className="contact-details">
                                                        <Text className="contact-label">
                                                            Email
                                                        </Text>
                                                        <Text className="contact-value">
                                                            {getData("email")}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {getData("phone") && (
                                            <Col xs={24} sm={12} md={8}>
                                                <div className="contact-item">
                                                    <PhoneOutlined className="contact-icon" />
                                                    <div className="contact-details">
                                                        <Text className="contact-label">
                                                            Phone
                                                        </Text>
                                                        <Text className="contact-value">
                                                            {getData("phone")}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                        {getData("address") && (
                                            <Col xs={24} sm={12} md={8}>
                                                <div className="contact-item">
                                                    <EnvironmentOutlined className="contact-icon" />
                                                    <div className="contact-details">
                                                        <Text className="contact-label">
                                                            Address
                                                        </Text>
                                                        <Text
                                                            className="contact-value"
                                                            ellipsis={{
                                                                tooltip:
                                                                    getData(
                                                                        "address"
                                                                    ),
                                                            }}
                                                        >
                                                            {getData("address")}
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Main Content */}
                    <div className="preview-body">
                        <Row gutter={[32, 24]}>
                            {/* Left Column - Main Content */}
                            <Col xs={24} lg={16}>

                                {role === "admin" && (
                                    <>
                                        {/* Personal Summary */}
                                        {getData("bio") && (


                                            <Card className="preview-card" size="small">
                                                <div className="section-header">
                                                    <UserOutlined className="section-icon" />
                                                    <Title
                                                        level={4}
                                                        className="section-title"
                                                    >
                                                        Personal Summary
                                                    </Title>
                                                </div>
                                                <Paragraph className="preview-bio">
                                                    {getData("bio")}
                                                </Paragraph>
                                            </Card>
                                        )}

                                        {/* Career Information */}
                                        <Card className="preview-card" size="small">
                                            <div className="section-header">
                                                <TrophyOutlined className="section-icon" />
                                                <Title
                                                    level={4}
                                                    className="section-title"
                                                >
                                                    Career Information
                                                </Title>
                                            </div>
                                            <div className="career-details">
                                                <Row gutter={[16, 12]}>
                                                    {getData("employment_status") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Employment Status:
                                                                </Text>
                                                                <Tag
                                                                    color={getEmploymentStatusColor()}
                                                                >
                                                                    {getEmploymentStatus()}
                                                                </Tag>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("current_company") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Current Company:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "current_company"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("job_title") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Position:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "job_title"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("industry") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Industry:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "industry"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("years_experience") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Experience:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "years_experience"
                                                                    )}{" "}
                                                                    years
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("work_location") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Work Location:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "work_location"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("salary_range") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Salary Range:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "salary_range"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}

                                                </Row>

                                                {/* Career Goals */}
                                                {getData("career_goals") && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Career Goals
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {getData("career_goals")}
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {/* Previous Experience */}
                                                {getData("previous_companies") && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Previous Experience
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {getData(
                                                                "previous_companies"
                                                            )}
                                                        </Paragraph>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>

                                        {/* Academic Information */}
                                        <Card className="preview-card" size="small">
                                            <div className="section-header">
                                                <BookOutlined className="section-icon" />
                                                <Title
                                                    level={4}
                                                    className="section-title"
                                                >
                                                    Academic Background
                                                </Title>
                                            </div>

                                            <div className="academic-details">
                                                <Row gutter={[16, 12]}>
                                                    {getData("course") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Course/Degree:
                                                                </Text>
                                                                <Text>
                                                                    {getCourseName()}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("graduation_year") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Graduation Year:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "graduation_year"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("enrollment_year") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Enrollment Year:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "enrollment_year"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {getData("student_id") && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Student ID:
                                                                </Text>
                                                                <Text>
                                                                    {getData(
                                                                        "student_id"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>

                                                {/* Academic Achievements */}
                                                {getData("academic_achievements") && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Academic Achievements
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {getData(
                                                                "academic_achievements"
                                                            )}
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {/* Extracurricular Activities */}
                                                {getData("extracurricular") && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Extracurricular Activities
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {getData("extracurricular")}
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {/* Thesis/Capstone */}
                                                {getData("thesis_title") && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Thesis/Capstone Project
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {getData("thesis_title")}
                                                        </Paragraph>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </>
                                )}
                            </Col>

                            {/* Right Column - Sidebar */}

                            {role === "admin" && (
                                <>
                                    <Col xs={24} lg={8}>
                                        {/* Quick Info Card */}
                                        <Card className="sidebar-card" size="small">


                                            {/* Personal Information */}
                                            <div className="sidebar-section">
                                                <Title
                                                    level={5}
                                                    className="sidebar-title"
                                                >
                                                    <IdcardOutlined /> Personal Info
                                                </Title>
                                                <div className="sidebar-items">
                                                    {getData("birth_date") && (
                                                        <div className="sidebar-item">
                                                            <CalendarOutlined className="sidebar-icon" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    Birth Date
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    {moment(
                                                                        getData(
                                                                            "birth_date"
                                                                        )
                                                                    ).format(
                                                                        "MMM DD, YYYY"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {getData("gender") && (
                                                        <div className="sidebar-item">
                                                            <UserOutlined className="sidebar-icon" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    Gender
                                                                </Text>
                                                                <Text
                                                                    className="sidebar-value"
                                                                    style={{
                                                                        textTransform:
                                                                            "capitalize",
                                                                    }}
                                                                >
                                                                    {getData(
                                                                        "gender"
                                                                    ).replace("_", " ")}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Social Profiles */}
                                            <div className="sidebar-section">
                                                <Title
                                                    level={5}
                                                    className="sidebar-title"
                                                >
                                                    <GlobalOutlined /> Social Profiles
                                                </Title>
                                                <div className="sidebar-items">
                                                    {getData("linkedin") && (
                                                        <div className="sidebar-item clickable">
                                                            <LinkedinOutlined className="sidebar-icon linkedin" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    LinkedIn
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    Profile Connected
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {getData("github") && (
                                                        <div className="sidebar-item clickable">
                                                            <GithubOutlined className="sidebar-icon github" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    GitHub
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    Profile Connected
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {getData("portfolio") && (
                                                        <div className="sidebar-item clickable">
                                                            <GlobalOutlined className="sidebar-icon portfolio" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    Portfolio
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    Website Added
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Document Status */}
                                            <div className="sidebar-section">
                                                <Title
                                                    level={5}
                                                    className="sidebar-title"
                                                >
                                                    <FileImageOutlined />{" "}
                                                    Documents
                                                </Title>
                                                <div className="document-status">
                                                    {!viewOnly && (
                                                        <div className="document-item uploaded">
                                                            <CheckCircleOutlined className="doc-icon" />
                                                            <Text>
                                                                Profile Photo
                                                            </Text>
                                                        </div>
                                                    )}

                                                    {!viewOnly &&
                                                        getData(
                                                            "idDocuments"
                                                        ) &&
                                                        getData(
                                                            "idDocuments"
                                                        ).map((doc, index) => {
                                                            const docType =
                                                                ID_TYPES.find(
                                                                    (d) =>
                                                                        d.value ===
                                                                        doc.type
                                                                );
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="document-item uploaded"
                                                                >
                                                                    <CheckCircleOutlined className="doc-icon" />
                                                                    <Text>
                                                                        {
                                                                            docType?.label
                                                                        }
                                                                    </Text>
                                                                    <Button
                                                                        type="link"
                                                                        size="small"
                                                                        icon={
                                                                            <EyeOutlined />
                                                                        }
                                                                        onClick={() =>
                                                                            handleImageZoom(
                                                                                doc.url
                                                                            )
                                                                        }
                                                                        className="doc-view-btn"
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    {viewOnly &&
                                                        Array.isArray(
                                                            previewData?.idDocuments
                                                        ) &&
                                                        previewData?.idDocuments.map(
                                                            (doc, index) => {
                                                                const docType =
                                                                    ID_TYPES.find(
                                                                        (d) =>
                                                                            d.value ===
                                                                            doc.document_type
                                                                    );
                                                                return (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="document-item uploaded"
                                                                    >
                                                                        <CheckCircleOutlined className="doc-icon" />
                                                                        <Text>
                                                                            {
                                                                                docType?.label
                                                                            }
                                                                        </Text>
                                                                        <Button
                                                                            type="link"
                                                                            size="small"
                                                                            icon={
                                                                                <EyeOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                handleImageZoom(
                                                                                    doc.file_url
                                                                                )
                                                                            }
                                                                            className="doc-view-btn"
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                </div>
                                            </div>

                                            {/* Preferences */}
                                            <div className="sidebar-section">
                                                <Title
                                                    level={5}
                                                    className="sidebar-title"
                                                >
                                                    <SafetyCertificateOutlined />{" "}
                                                    Preferences
                                                </Title>
                                                <div className="preference-items">
                                                    <div className="preference-item">
                                                        <CheckCircleOutlined className="pref-icon" />
                                                        <Text>
                                                            Terms & Conditions
                                                            Accepted
                                                        </Text>
                                                    </div>
                                                    {getData("newsletter") && (
                                                        <div className="preference-item">
                                                            <CheckCircleOutlined className="pref-icon" />
                                                            <Text>
                                                                Newsletter
                                                                Subscribed
                                                            </Text>
                                                        </div>
                                                    )}
                                                    {getData(
                                                        "contactPermission"
                                                    ) && (
                                                            <div className="preference-item">
                                                                <CheckCircleOutlined className="pref-icon" />
                                                                <Text>
                                                                    Contact
                                                                    Permission
                                                                    Granted
                                                                </Text>
                                                            </div>
                                                        )}
                                                    {getData(
                                                        "continueEducation"
                                                    ) && (
                                                            <div className="preference-item">
                                                                <CheckCircleOutlined className="pref-icon" />
                                                                <Text>
                                                                    Planning Further
                                                                    Education
                                                                </Text>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>

                                        </Card>

                                    </Col>
                                </>
                            )}
                        </Row>

                        {role === "alumni" && (
                            <>
                                <Card
                                    className="preview-card"
                                    size="small"
                                    style={{ marginTop: 10, borderColor: "red" }}
                                >
                                    <div
                                        className="section-header"
                                        style={{ justifyContent: "center", flexDirection: "column" }}
                                    >
                                        <Title
                                            level={3}
                                            style={{
                                                color: "red",
                                                textAlign: "center",
                                                marginBottom: 0,
                                                letterSpacing: 2,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            CONFIDENTIAL
                                        </Title>
                                        <Text style={{ textAlign: "center", fontStyle: "italic" }}>
                                            Admin Access Only
                                        </Text>
                                    </div>

                                    <div
                                        style={{
                                            marginTop: 20,
                                            textAlign: "center",
                                            padding: "10px 20px",
                                        }}
                                    >
                                        <Text style={{ fontSize: 16 }}>
                                            This section contains confidential information.
                                        </Text>
                                    </div>
                                </Card>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                {/* Honors & Awards Section */}
                                {honors.length > 0 && (
                                    <Card
                                        className="preview-card"
                                        size="small"
                                        style={{ marginTop: 10 }}
                                    >
                                        <div className="section-header">
                                            <TrophyIcon className="section-icon" />
                                            <Title level={4} className="section-title">
                                                Honors & Awards
                                            </Title>
                                        </div>
                                        <div className="honors-container">
                                            <Row gutter={[8, 8]}>
                                                {Array.isArray(honors) &&
                                                    honors.map((honor, index) => (
                                                        <Col
                                                            key={index}
                                                            xs={24}
                                                            sm={12}
                                                            md={8}
                                                            lg={6}
                                                        >
                                                            <div className="honor-item">
                                                                <TrophyIcon className="honor-icon" />
                                                                <Text>{honor}</Text>
                                                            </div>
                                                        </Col>
                                                    ))}
                                            </Row>
                                        </div>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Drawer>

            {/* Image Zoom Modal */}
            <Modal
                open={zoomVisible}
                onCancel={() => setZoomVisible(false)}
                footer={null}
                width="auto"
                className="image-zoom-modal"
                closable={true}
                style={{ top: 20 }}
            >
                {zoomImage && (
                    <div className="zoom-container">
                        <Image
                            src={zoomImage}
                            alt="Zoomed Document"
                            style={{ maxWidth: "100%", maxHeight: "80vh" }}
                            preview={false}
                        />
                        <div className="zoom-actions">
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={() => {
                                    message.info(
                                        "Download functionality would be implemented here"
                                    );
                                }}
                            >
                                Download
                            </Button>
                            <Button onClick={() => setZoomVisible(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            <style jsx>{`
                .preview-drawer .ant-drawer-body {
                    padding: 0;
                    background: #f5f5f5;
                }

                .drawer-content {
                    height: 100%;
                    overflow-y: auto;
                }

                .preview-content {
                    padding: 0;
                }

                .preview-header {
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                    );
                    padding: 40px;
                    color: white;
                }

                .preview-profile-section {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .profile-image-wrapper {
                    position: relative;
                    cursor: pointer;
                }

                .preview-profile-img {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    object-fit: cover;
                }

                .image-zoom-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .profile-image-wrapper:hover .image-zoom-overlay {
                    opacity: 1;
                }

                .preview-name {
                    color: white !important;
                    margin-bottom: 8px !important;
                }

                .preview-title {
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 16px;
                }

                .preview-contact-info {
                    margin-top: 20px;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .contact-icon {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                }

                .contact-details {
                    display: flex;
                    flex-direction: column;
                }

                .contact-label {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 12px;
                }

                .contact-value {
                    color: white;
                    font-size: 14px;
                }

                .preview-body {
                    padding: 30px;
                }

                .preview-card {
                    margin-bottom: 24px;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .section-icon {
                    color: #1890ff;
                    font-size: 18px;
                }

                .section-title {
                    margin: 0 !important;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .subsection {
                    margin-top: 20px;
                }

                .subsection-title {
                    display: block;
                    margin-bottom: 8px;
                    color: #1890ff;
                }

                .preview-text {
                    margin: 0;
                    line-height: 1.6;
                }

                .sidebar-card {
                    position: sticky;
                    top: 20px;
                }

                .sidebar-section {
                    margin-bottom: 24px;
                }

                .sidebar-section:last-child {
                    margin-bottom: 0;
                }

                .sidebar-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px !important;
                    color: #1890ff;
                }

                .sidebar-items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                }

                .sidebar-item.clickable {
                    cursor: pointer;
                }

                .sidebar-item.clickable:hover {
                    background: #f5f5f5;
                    border-radius: 6px;
                    padding: 8px 12px;
                    margin: 0 -12px;
                }

                .sidebar-icon {
                    font-size: 16px;
                    color: #666;
                    width: 20px;
                }

                .sidebar-icon.linkedin {
                    color: #0077b5;
                }
                .sidebar-icon.github {
                    color: #333;
                }
                .sidebar-icon.portfolio {
                    color: #1890ff;
                }

                .sidebar-content {
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-label {
                    font-size: 12px;
                    color: #666;
                }

                .sidebar-value {
                    font-size: 14px;
                    color: #333;
                }

                .document-status,
                .preference-items {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .document-item,
                .preference-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 0;
                }

                .document-item.uploaded {
                    color: #52c41a;
                }

                .doc-icon,
                .pref-icon {
                    font-size: 16px;
                }

                .doc-view-btn {
                    margin-left: auto;
                }

                .honors-container {
                    margin-top: 16px;
                }

                .honor-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #f0f8ff;
                    border-radius: 6px;
                    border: 1px solid #d6e4ff;
                }

                .honor-icon {
                    color: #faad14;
                }

                /* Image Zoom Modal */
                .image-zoom-modal .ant-modal-body {
                    padding: 0;
                }

                .zoom-container {
                    text-align: center;
                }

                .zoom-actions {
                    margin-top: 20px;
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .preview-profile-section {
                        flex-direction: column;
                        text-align: center;
                    }

                    .preview-header {
                        padding: 20px;
                    }

                    .preview-body {
                        padding: 20px;
                    }

                    .sidebar-card {
                        position: static;
                    }
                }
            `}</style>
        </>
    );
};

export default AlumniDetails;
