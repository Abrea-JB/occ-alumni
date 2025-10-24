import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    Upload,
    Avatar,
    Typography,
    Space,
    Divider,
    Steps,
    DatePicker,
    Radio,
    Checkbox,
    InputNumber,
    Switch,
    message,
    Tag,
    Progress,
    Tooltip,
    Alert,
    Modal,
    List,
    Image,
} from "antd";
import {
    UserOutlined,
    CameraOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    BookOutlined,
    TeamOutlined,
    TrophyOutlined,
    GlobalOutlined,
    LinkedinOutlined,
    GithubOutlined,
    TwitterOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    IdcardOutlined,
    SafetyCertificateOutlined,
    EyeOutlined,
    UploadOutlined,
    FileImageOutlined,
    CheckCircleOutlined,
    BankOutlined,
    CrownOutlined,
    ClockCircleOutlined,
    DownloadOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./AlumniRegistration.css";
import axios from "axios";
import { BASE_URL } from "../../utils/constant";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

// Company/University Information
const companyInfo = {
    name: "Opol Community College Alumni Association",
    logo: "https://occph.com/build/assets/OCC_LOGO-BWCM4zrL.png",
    slogan: "Building tomorrow's leaders, one student at a time.",
    website: "occph.com",
    address: "123 University Avenue, Prestige City, PC 12345",
};

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
    {
        value: "BSBA",
        label: "Bachelor of Science in Business Administration",
        college: "College of Business",
    },
    {
        value: "BSEd",
        label: "Bachelor of Science in Education",
        college: "College of Education",
    },
    {
        value: "BSN",
        label: "Bachelor of Science in Nursing",
        college: "College of Nursing",
    },
    {
        value: "BSA",
        label: "Bachelor of Science in Accountancy",
        college: "College of Business",
    },
    {
        value: "BSEE",
        label: "Bachelor of Science in Electrical Engineering",
        college: "College of Engineering",
    },
    {
        value: "BSME",
        label: "Bachelor of Science in Mechanical Engineering",
        college: "College of Engineering",
    },
    {
        value: "BSArch",
        label: "Bachelor of Science in Architecture",
        college: "College of Architecture",
    },
    {
        value: "BSPsych",
        label: "Bachelor of Science in Psychology",
        college: "College of Arts and Sciences",
    },
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

const industryOptions = [
    "Technology & IT",
    "Healthcare",
    "Finance & Banking",
    "Education",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Construction",
    "Marketing & Advertising",
    "Government",
    "Non-Profit",
    "Consulting",
    "Real Estate",
    "Transportation",
    "Energy",
    "Entertainment",
    "Other",
];

const skillOptions = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "Leadership",
    "Communication",
    "Digital Marketing",
    "Sales",
    "Accounting",
    "Teaching",
    "Research",
    "Design",
    "Writing",
    "Public Speaking",
    "Problem Solving",
    "Teamwork",
    "Critical Thinking",
    "Creativity",
];

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

const AlumniRegistration = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [profileImage, setProfileImage] = useState(null);
    const [idDocuments, setIdDocuments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);

    const steps = [
        {
            title: "Personal Info",
            icon: <UserOutlined />,
        },
        {
            title: "Academic Info",
            icon: <BookOutlined />,
        },
        {
            title: "Career Info",
            icon: <TrophyOutlined />,
        },
        {
            title: "Documents",
            icon: <FileImageOutlined />,
        },
        {
            title: "Review & Submit",
            icon: <SafetyCertificateOutlined />,
        },
    ];

    // Profile Image Upload
    const handleProfileImageUpload = (info) => {
        if (info.file.status === "uploading") {
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (url) => {
                setProfileImage(url);
                message.success("Profile image uploaded successfully!");
            });
        }
    };

    // ID Documents Upload
    const handleIdDocumentsUpload = (info, documentType) => {
        if (info.file.status === "uploading") {
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (url) => {
                const newDocument = {
                    id: Date.now(),
                    type: documentType,
                    url: url,
                    name: info.file.name,
                    status: "pending",
                    uploadDate: new Date().toISOString(),
                };

                setIdDocuments((prev) => {
                    const filtered = prev.filter(
                        (doc) => doc.type !== documentType
                    );
                    return [...filtered, newDocument];
                });

                message.success(
                    `${
                        ID_TYPES.find((doc) => doc.value === documentType)
                            ?.label
                    } uploaded successfully!`
                );
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "image/jpg";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG files!");
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error("Image must be smaller than 5MB!");
            return Upload.LIST_IGNORE;
        }
        return isJpgOrPng && isLt5M;
    };

    const profileUploadProps = {
        beforeUpload,
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
        onChange: handleProfileImageUpload,
        showUploadList: false,
    };

    const idUploadProps = (documentType) => ({
        beforeUpload,
        customRequest: ({ file, onSuccess }) => {
            setTimeout(() => {
                onSuccess("ok");
            }, 0);
        },
        onChange: (info) => handleIdDocumentsUpload(info, documentType),
        showUploadList: false,
    });

    const removeDocument = (documentId) => {
        setIdDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        message.success("Document removed successfully!");
    };

    const updateDocumentStatus = (documentId, status) => {
        setIdDocuments((prev) =>
            prev.map((doc) =>
                doc.id === documentId ? { ...doc, status } : doc
            )
        );
    };

    const profileUploadButton = (
        <div className="upload-button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload Photo</div>
        </div>
    );

    const idUploadButton = (documentType) => (
        <div className="id-upload-button">
            <UploadOutlined />
            <div style={{ marginTop: 4, fontSize: "12px" }}>
                Upload{" "}
                {ID_TYPES.find((doc) => doc.value === documentType)?.label}
            </div>
        </div>
    );

    const handleNext = () => {
        form.validateFields()
            .then(() => {
                setCurrentStep(currentStep + 1);
            })
            .catch((error) => {
                console.log("Validation Failed:", error);
            });
    };

    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handlePreview = () => {
        form.validateFields()
            .then((values) => {
                setPreviewData({ ...values, profileImage, idDocuments });
                setIsModalVisible(true);
            })
            .catch((error) => {
                console.log("Validation Failed:", error);
            });
    };

    const calculateProgress = () => {
        return ((currentStep + 1) / steps.length) * 100;
    };

    const handleSubmit = async () => {
        let loadingMessage = null;

        try {
            setLoading(true);

            // Validate all form fields first
            const values = await form.validateFields();

            // Additional validation for documents
            if (!profileImage) {
                message.error("Please upload a profile photo");
                return;
            }

            if (idDocuments.length === 0) {
                message.error("Please upload at least one ID document");
                return;
            }

            // Show loading message
            loadingMessage = message.loading(
                "Submitting your application...",
                0
            );

            const formData = new FormData();

            // Append all form fields with proper snake_case formatting
            const allFormValues = form.getFieldsValue(true);

            // Map field names from camelCase to snake_case
            const fieldMappings = {
                // Personal Information
                firstName: "first_name",
                lastName: "last_name",
                middleName: "middle_name",
                birthDate: "birth_date",
                profileImage: "profile_image",

                // Academic Information
                studentId: "student_id",
                graduationYear: "graduation_year",
                enrollmentYear: "enrollment_year",
                thesisTitle: "thesis_title",
                academicAchievements: "academic_achievements",
                continueEducation: "continue_education",

                // Career Information
                employmentStatus: "employment_status",
                currentCompany: "current_company",
                jobTitle: "job_title",
                yearsExperience: "years_experience",
                salaryRange: "salary_range",
                workLocation: "work_location",
                careerGoals: "career_goals",
                previousCompanies: "previous_companies",

                // Skills
                technicalSkills: "technical_skills",
                softSkills: "soft_skills",
                volunteerInterests: "volunteer_interests",
                willingToMentor: "willing_to_mentor",
                professionalInterests: "professional_interests",

                // Agreements
                contactPermission: "contact_permission",
            };

            // Format birthDate specifically
            const formattedValues = {
                ...allFormValues,
                birthDate: allFormValues.birthDate
                    ? allFormValues.birthDate.format("YYYY-MM-DD")
                    : null,
            };

            // Process each field
            Object.keys(formattedValues).forEach((key) => {
                const value = formattedValues[key];
                const snakeCaseKey = fieldMappings[key] || key;

                if (value === undefined || value === null || value === "") {
                    return; // Skip empty values
                }

                if (Array.isArray(value)) {
                    // Handle array fields (like honors, skills, etc.)
                    value.forEach((item, index) => {
                        if (item && item !== "") {
                            formData.append(
                                `${snakeCaseKey}[${index}]`,
                                item.toString()
                            );
                        }
                    });
                } else if (typeof value === "boolean") {
                    // Handle boolean fields
                    formData.append(snakeCaseKey, value ? "1" : "0");
                } else if (typeof value === "object") {
                    // Handle object fields (stringify them)
                    try {
                        formData.append(snakeCaseKey, JSON.stringify(value));
                    } catch (error) {
                        console.warn(
                            `Could not stringify field ${snakeCaseKey}:`,
                            error
                        );
                        formData.append(snakeCaseKey, value.toString());
                    }
                } else {
                    // Handle string/number fields
                    formData.append(snakeCaseKey, value.toString());
                }
            });

            // Append profile image
            if (profileImage) {
                try {
                    let profileBlob;
                    if (profileImage.startsWith("data:")) {
                        profileBlob = dataURLToBlobSync(profileImage);
                    } else {
                        profileBlob = profileImage;
                    }
                    formData.append(
                        "profile_image",
                        profileBlob,
                        "profile.jpg"
                    );
                } catch (error) {
                    console.error("Error processing profile image:", error);
                    throw new Error("Error processing profile image");
                }
            }

            // Append ID documents with metadata
            idDocuments.forEach((doc, index) => {
                try {
                    let documentBlob;

                    if (doc.url && doc.url.startsWith("data:")) {
                        documentBlob = dataURLToBlobSync(doc.url);
                    } else if (doc.file) {
                        documentBlob = doc.file;
                    } else {
                        console.warn(
                            `Document ${doc.type} has no valid file data`
                        );
                        return;
                    }

                    // Append the actual file
                    formData.append(
                        `documents[${index}][file]`,
                        documentBlob,
                        doc.name || `document_${index}.jpg`
                    );

                    // Append document metadata
                    formData.append(`documents[${index}][type]`, doc.type);
                    formData.append(
                        `documents[${index}][name]`,
                        doc.name || `document_${index}`
                    );
                } catch (error) {
                    console.error(
                        `Error processing document ${doc.type}:`,
                        error
                    );
                }
            });

            // Debug: Log form data (optional - remove in production)
            if (process.env.NODE_ENV === "development") {
                console.log("FormData contents:");
                for (let [key, value] of formData.entries()) {
                    if (key.includes("file") || key.includes("image")) {
                        console.log(key, `[File: ${value.name || "Blob"}]`);
                    } else {
                        console.log(key, value);
                    }
                }
            }

            // Submit the form
            const response = await axios.post(
                BASE_URL + "api/alumni/register",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    timeout: 60000, // 60 seconds timeout
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        // Update progress in the message
                        if (percentCompleted < 100) {
                            message.destroy();
                            message.loading(
                                `Uploading... ${percentCompleted}%`,
                                0
                            );
                        }
                    },
                }
            );

            // Clear loading message
            if (loadingMessage) {
                message.destroy();
            }

            if (response.data.success) {
                message.success(
                    response.data.message ||
                        "Alumni registration submitted successfully!"
                );

                // Reset form state
                form.resetFields();
                setProfileImage(null);
                setIdDocuments([]);
                setCurrentStep(0);
                setIsModalVisible(false);

                // Show success message with application ID if available
                if (response.data.application_id) {
                    Modal.success({
                        title: "Registration Successful!",
                        content: (
                            <div>
                                <p>
                                    Your alumni registration has been submitted
                                    successfully.
                                </p>
                                <p>
                                    <strong>Application ID:</strong>{" "}
                                    {response.data.application_id}
                                </p>
                                <p>
                                    You will receive a confirmation email
                                    shortly.
                                </p>
                            </div>
                        ),
                        onOk() {
                            // Optional: Redirect to success page or dashboard
                            console.log(
                                "Application ID:",
                                response.data.application_id
                            );
                        },
                    });
                }
            } else {
                message.error(
                    response.data.message ||
                        "Submission failed. Please try again."
                );
            }
        } catch (error) {
            // Clear any existing loading messages
            if (loadingMessage) {
                message.destroy();
            }

            console.error("Submission error:", error);

            // Handle different types of errors
            if (error.errorFields) {
                // Form validation errors
                const firstError = error.errorFields[0];
                message.error(`Please check: ${firstError.errors[0]}`);

                // Optional: Scroll to the first error field
                const errorElement = document.querySelector(
                    ".ant-form-item-has-error"
                );
                if (errorElement) {
                    errorElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            } else if (error.response) {
                // Server responded with error status
                const serverError = error.response.data;

                // Handle Laravel validation errors
                if (serverError.errors) {
                    const firstErrorKey = Object.keys(serverError.errors)[0];
                    const firstErrorMessage =
                        serverError.errors[firstErrorKey][0];
                    message.error(firstErrorMessage);

                    // Log all validation errors for debugging
                    console.log("Validation errors:", serverError.errors);
                } else {
                    message.error(
                        serverError.message ||
                            serverError.error ||
                            "Server error occurred. Please try again."
                    );
                }

                // Handle specific HTTP status codes
                if (error.response.status === 413) {
                    message.error(
                        "File size too large. Please upload smaller files."
                    );
                } else if (error.response.status === 429) {
                    message.error("Too many requests. Please try again later.");
                } else if (error.response.status === 422) {
                    // Validation errors are already handled above
                    console.log("Validation error details:", serverError);
                } else if (error.response.status === 500) {
                    message.error("Server error. Please try again later.");
                }
            } else if (error.request) {
                // Network error - no response received
                message.error(
                    "Network error. Please check your internet connection and try again."
                );
                console.error("Network error details:", error.request);
            } else if (error.code === "ECONNABORTED") {
                // Timeout error
                message.error("Request timeout. Please try again.");
            } else if (error.message) {
                // Other errors with message
                message.error(error.message);
            } else {
                // Unknown error
                message.error(
                    "An unexpected error occurred. Please try again."
                );
            }

            // Log detailed error for debugging
            console.error("Detailed error:", {
                message: error.message,
                stack: error.stack,
                response: error.response?.data,
                status: error.response?.status,
            });
        } finally {
            // Always execute - clean up loading states
            setLoading(false);

            // Ensure loading message is cleared
            if (loadingMessage) {
                message.destroy();
            }

            // Clear any other loading states if needed
            console.log("Form submission process completed");
        }
    };

    // Helper function to convert data URL to Blob
    const dataURLToBlobSync = (dataURL) => {
        try {
            const arr = dataURL.split(",");
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new Blob([u8arr], { type: mime });
        } catch (error) {
            console.error("Error converting data URL to blob:", error);
            throw error;
        }
    };

    // Async version of dataURLToBlob
    const dataURLToBlob = async (dataURL) => {
        return dataURLToBlobSync(dataURL);
    };

    const getDocumentStatus = (status) => {
        const statusConfig = {
            pending: {
                color: "orange",
                text: "Pending Review",
                icon: <ClockCircleOutlined />,
            },
            approved: {
                color: "green",
                text: "Approved",
                icon: <CheckCircleOutlined />,
            },
            rejected: {
                color: "red",
                text: "Rejected",
                icon: <DeleteOutlined />,
            },
        };
        return statusConfig[status] || statusConfig.pending;
    };

    const PersonalInfoStep = () => (
        <div className="form-step">
            <Title level={3}>Personal Information</Title>
            <Text type="secondary">Tell us about yourself</Text>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col span={24} className="avatar-upload-section">
                    <div className="avatar-upload">
                        <Text strong>Profile Picture</Text>
                        <div className="avatar-upload-container">
                            <Upload
                                {...profileUploadProps}
                                className="avatar-uploader"
                            >
                                {profileImage ? (
                                    <div className="avatar-preview">
                                        <img src={profileImage} alt="avatar" />
                                        <div className="avatar-edit-overlay">
                                            <CameraOutlined />
                                            <div>Change Photo</div>
                                        </div>
                                    </div>
                                ) : (
                                    profileUploadButton
                                )}
                            </Upload>
                            {profileImage && (
                                <Button
                                    type="link"
                                    danger
                                    onClick={() => setProfileImage(null)}
                                    className="remove-photo-btn"
                                >
                                    Remove
                                </Button>
                            )}
                        </div>
                        <Text type="secondary" className="upload-hint">
                            Recommended: Square image, 500x500px, max 5MB
                        </Text>
                    </div>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your first name",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your first name"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your last name",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your last name"
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="middle_name" label="Middle Name">
                        <Input
                            size="large"
                            placeholder="Enter your middle name"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="suffix" label="Suffix">
                        <Select size="large" placeholder="Select suffix">
                            <Option value="Jr.">Jr.</Option>
                            <Option value="Sr.">Sr.</Option>
                            <Option value="II">II</Option>
                            <Option value="III">III</Option>
                            <Option value="IV">IV</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="your.email@example.com"
                            prefix={<MailOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
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
                            placeholder="+1 (555) 123-4567"
                            prefix={<PhoneOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="address"
                        label="Current Address"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your address",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter your complete address"
                            prefix={<EnvironmentOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="birth_date"
                        label="Date of Birth"
                        rules={[
                            {
                                required: true,
                                message: "Please select your birth date",
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            size="large"
                            placeholder="Select your birth date"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[
                            {
                                required: true,
                                message: "Please select your gender",
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                            <Radio value="other">Other</Radio>
                            <Radio value="prefer_not_to_say">
                                Prefer not to say
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="bio" label="Personal Bio">
                        <TextArea
                            rows={4}
                            placeholder="Tell us about yourself, your interests, and your background..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );

    const AcademicInfoStep = () => (
        <div className="form-step">
            <Title level={3}>Academic Information</Title>
            <Text type="secondary">
                Tell us about your educational background
            </Text>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={24}>
                    <Form.Item
                        name="course"
                        label="Course/Degree"
                        rules={[
                            {
                                required: true,
                                message: "Please select your course",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Select your course"
                            showSearch
                            optionFilterProp="children"
                        >
                            {courseOptions.map((course) => (
                                <Option key={course.value} value={course.value}>
                                    <div>
                                        <Text strong>{course.label}</Text>
                                        <br />
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: "12px" }}
                                        >
                                            {course.college}
                                        </Text>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="studentId" label="Student ID Number">
                        <Input
                            size="large"
                            placeholder="Enter your student ID"
                            prefix={<IdcardOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="graduationYear"
                        label="Graduation Year"
                        rules={[
                            {
                                required: true,
                                message: "Please select graduation year",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Select graduation year"
                        >
                            {Array.from({ length: 30 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="enrollmentYear" label="Enrollment Year">
                        <Select
                            size="large"
                            placeholder="Select enrollment year"
                        >
                            {Array.from({ length: 40 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="honors" label="Honors/Awards">
                        <Select
                            mode="tags"
                            size="large"
                            placeholder="Add honors or awards received"
                            tokenSeparators={[","]}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="thesisTitle" label="Thesis/Capstone Title">
                        <Input
                            size="large"
                            placeholder="Enter your thesis or capstone project title"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="academicAchievements"
                        label="Academic Achievements"
                    >
                        <TextArea
                            rows={3}
                            placeholder="List any academic achievements, research projects, or notable accomplishments..."
                            maxLength={300}
                            showCount
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="extracurricular"
                        label="Extracurricular Activities"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Describe your involvement in clubs, organizations, sports, or other activities..."
                            maxLength={300}
                            showCount
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="continueEducation"
                        label="Plan to Continue Education?"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );

    const CareerInfoStep = () => (
        <div className="form-step">
            <Title level={3}>Career Information</Title>
            <Text type="secondary">
                Tell us about your professional journey
            </Text>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={24}>
                    <Form.Item
                        name="employmentStatus"
                        label="Current Employment Status"
                        rules={[
                            {
                                required: true,
                                message: "Please select employment status",
                            },
                        ]}
                    >
                        <Select
                            size="large"
                            placeholder="Select your employment status"
                        >
                            {employmentStatusOptions.map((status) => (
                                <Option key={status.value} value={status.value}>
                                    <Tag color={status.color}>
                                        {status.label}
                                    </Tag>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="currentCompany"
                        label="Current Company/Organization"
                    >
                        <Input
                            size="large"
                            placeholder="Enter your current company name"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="jobTitle" label="Job Title/Position">
                        <Input
                            size="large"
                            placeholder="Enter your current job title"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="industry" label="Industry">
                        <Select size="large" placeholder="Select industry">
                            {industryOptions.map((industry) => (
                                <Option key={industry} value={industry}>
                                    {industry}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        name="yearsExperience"
                        label="Years of Experience"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            size="large"
                            min={0}
                            max={50}
                            placeholder="0"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="salaryRange" label="Current Salary Range">
                        <Select size="large" placeholder="Select salary range">
                            <Option value="0-30000">$0 - $30,000</Option>
                            <Option value="30000-50000">
                                $30,000 - $50,000
                            </Option>
                            <Option value="50000-75000">
                                $50,000 - $75,000
                            </Option>
                            <Option value="75000-100000">
                                $75,000 - $100,000
                            </Option>
                            <Option value="100000-150000">
                                $100,000 - $150,000
                            </Option>
                            <Option value="150000+">$150,000+</Option>
                            <Option value="prefer_not_to_say">
                                Prefer not to say
                            </Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item name="workLocation" label="Work Location">
                        <Input
                            size="large"
                            placeholder="City, State, Country"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="careerGoals"
                        label="Career Goals & Aspirations"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Describe your career goals and where you see yourself in the next 5 years..."
                            maxLength={400}
                            showCount
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        name="previousCompanies"
                        label="Previous Companies/Positions"
                    >
                        <TextArea
                            rows={3}
                            placeholder="List your previous work experiences (Company - Position - Duration)..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Title level={5}>
                        Social Media & Professional Profiles
                    </Title>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="linkedin" label="LinkedIn Profile">
                                <Input
                                    size="large"
                                    placeholder="LinkedIn profile URL"
                                    prefix={<LinkedinOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="github" label="GitHub Profile">
                                <Input
                                    size="large"
                                    placeholder="GitHub profile URL"
                                    prefix={<GithubOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="portfolio"
                                label="Portfolio Website"
                            >
                                <Input
                                    size="large"
                                    placeholder="Personal website or portfolio"
                                    prefix={<GlobalOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="twitter" label="Twitter Profile">
                                <Input
                                    size="large"
                                    placeholder="Twitter profile URL"
                                    prefix={<TwitterOutlined />}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );

    const DocumentsStep = () => (
        <div className="form-step">
            <Title level={3}>Identity Verification</Title>
            <Text type="secondary">
                Upload required documents for verification
            </Text>

            <Alert
                message="Document Requirements"
                description="Please upload clear photos or scans of your documents. All documents will be verified before approval."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Divider />

            <Row gutter={[24, 24]}>
                {/* Profile Photo Section */}
                <Col span={24}>
                    <Card
                        title="Profile Photo"
                        size="small"
                        className="document-card"
                    >
                        <div className="document-upload-section">
                            <div className="upload-instructions">
                                <Text strong>Requirements:</Text>
                                <ul>
                                    <li>Recent, clear headshot</li>
                                    <li>Plain background preferred</li>
                                    <li>File size: max 5MB</li>
                                    <li>Formats: JPG, PNG</li>
                                </ul>
                            </div>
                            <div className="upload-area">
                                <Upload
                                    {...profileUploadProps}
                                    className="profile-uploader"
                                >
                                    {profileImage ? (
                                        <div className="document-preview">
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                            />
                                            <div className="document-overlay">
                                                <EyeOutlined />
                                                <div>View/Change</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="document-upload-button">
                                            <CameraOutlined />
                                            <div>Upload Profile Photo</div>
                                        </div>
                                    )}
                                </Upload>
                                {profileImage && (
                                    <Tag
                                        color="green"
                                        icon={<CheckCircleOutlined />}
                                    >
                                        Uploaded
                                    </Tag>
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* ID Documents Section */}
                <Col span={24}>
                    <Card
                        title="Identity Documents"
                        size="small"
                        className="document-card"
                    >
                        <Text
                            type="secondary"
                            style={{ display: "block", marginBottom: 16 }}
                        >
                            Upload at least one form of identification for
                            verification
                        </Text>

                        <Row gutter={[16, 16]}>
                            {ID_TYPES.map((docType) => {
                                const uploadedDoc = idDocuments.find(
                                    (doc) => doc.type === docType.value
                                );

                                return (
                                    <Col
                                        xs={24}
                                        md={12}
                                        lg={8}
                                        key={docType.value}
                                    >
                                        <Card
                                            size="small"
                                            className={`id-card ${
                                                uploadedDoc ? "uploaded" : ""
                                            }`}
                                        >
                                            <div className="id-card-content">
                                                <div className="id-icon">
                                                    {docType.icon}
                                                </div>
                                                <div className="id-info">
                                                    <Text strong>
                                                        {docType.label}
                                                    </Text>
                                                    {uploadedDoc ? (
                                                        <div className="upload-status">
                                                            <Tag
                                                                color="green"
                                                                icon={
                                                                    <CheckCircleOutlined />
                                                                }
                                                            >
                                                                Uploaded
                                                            </Tag>
                                                            <div className="document-actions">
                                                                <Tooltip title="View Document">
                                                                    <Button
                                                                        type="link"
                                                                        icon={
                                                                            <EyeOutlined />
                                                                        }
                                                                        onClick={() => {
                                                                            Modal.info(
                                                                                {
                                                                                    title: docType.label,
                                                                                    content:
                                                                                        (
                                                                                            <Image
                                                                                                width="100%"
                                                                                                src={
                                                                                                    uploadedDoc.url
                                                                                                }
                                                                                                alt={
                                                                                                    docType.label
                                                                                                }
                                                                                            />
                                                                                        ),
                                                                                    icon: null,
                                                                                    width: 600,
                                                                                }
                                                                            );
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                                <Tooltip title="Remove Document">
                                                                    <Button
                                                                        type="link"
                                                                        danger
                                                                        icon={
                                                                            <DeleteOutlined />
                                                                        }
                                                                        onClick={() =>
                                                                            removeDocument(
                                                                                uploadedDoc.id
                                                                            )
                                                                        }
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Upload
                                                            {...idUploadProps(
                                                                docType.value
                                                            )}
                                                        >
                                                            {idUploadButton(
                                                                docType.value
                                                            )}
                                                        </Upload>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Card>
                </Col>

                {/* Uploaded Documents List */}
                {idDocuments.length > 0 && (
                    <Col span={24}>
                        <Card title="Uploaded Documents" size="small">
                            <List
                                dataSource={idDocuments}
                                renderItem={(doc) => {
                                    const docType = ID_TYPES.find(
                                        (d) => d.value === doc.type
                                    );
                                    const status = getDocumentStatus(
                                        doc.status
                                    );

                                    return (
                                        <List.Item
                                            actions={[
                                                <Tooltip
                                                    title="View Document"
                                                    key="view"
                                                >
                                                    <Button
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            Modal.info({
                                                                title: docType?.label,
                                                                content: (
                                                                    <Image
                                                                        width="100%"
                                                                        src={
                                                                            doc.url
                                                                        }
                                                                        alt={
                                                                            docType?.label
                                                                        }
                                                                    />
                                                                ),
                                                                icon: null,
                                                                width: 600,
                                                            });
                                                        }}
                                                    />
                                                </Tooltip>,
                                                <Tooltip
                                                    title="Remove Document"
                                                    key="remove"
                                                >
                                                    <Button
                                                        danger
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                        onClick={() =>
                                                            removeDocument(
                                                                doc.id
                                                            )
                                                        }
                                                    />
                                                </Tooltip>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={docType?.icon}
                                                title={
                                                    <Space>
                                                        <Text>
                                                            {docType?.label}
                                                        </Text>
                                                        <Tag
                                                            color={status.color}
                                                            icon={status.icon}
                                                        >
                                                            {status.text}
                                                        </Tag>
                                                    </Space>
                                                }
                                                description={
                                                    <Space
                                                        direction="vertical"
                                                        size={0}
                                                    >
                                                        <Text type="secondary">
                                                            File: {doc.name}
                                                        </Text>
                                                        <Text type="secondary">
                                                            Uploaded:{" "}
                                                            {moment(
                                                                doc.uploadDate
                                                            ).format(
                                                                "MMM DD, YYYY HH:mm"
                                                            )}
                                                        </Text>
                                                    </Space>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );

    const ReviewSubmitStep = () => (
        <div className="form-step">
            <Title level={3}>Review & Submit</Title>
            <Text type="secondary">
                Please review your information before submitting
            </Text>

            <Divider />

            <Alert
                message="Almost Done!"
                description="Please review all your information carefully. Once submitted, you'll be able to update your profile later."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            {/* Document Status Check */}
            <div className="document-status-check">
                <Space direction="vertical" style={{ width: "100%" }}>
                    <div className="status-item">
                        <CheckCircleOutlined
                            style={{
                                color: profileImage ? "#52c41a" : "#d9d9d9",
                            }}
                        />
                        <Text>
                            Profile Photo{" "}
                            {profileImage ? "Uploaded" : "Required"}
                        </Text>
                    </div>
                    <div className="status-item">
                        <CheckCircleOutlined
                            style={{
                                color:
                                    idDocuments.length > 0
                                        ? "#52c41a"
                                        : "#d9d9d9",
                            }}
                        />
                        <Text>
                            ID Documents{" "}
                            {idDocuments.length > 0 ? "Uploaded" : "Required"}
                        </Text>
                    </div>
                </Space>
            </div>

            <Divider />

            <div className="review-section">
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    size="large"
                    disabled={!profileImage || idDocuments.length === 0}
                >
                    Preview Full Application
                </Button>
                {(!profileImage || idDocuments.length === 0) && (
                    <Text
                        type="danger"
                        style={{ display: "block", marginTop: 8 }}
                    >
                        Please upload both profile photo and at least one ID
                        document to continue
                    </Text>
                )}
            </div>

            <Divider />

            <Row gutter={[24, 16]}>
                <Col xs={24}>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: "Please agree to the terms",
                            },
                        ]}
                    >
                        <Checkbox>
                            I confirm that all information provided is accurate
                            and truthful. I agree to the
                            <a href="#privacy" style={{ marginLeft: 4 }}>
                                Privacy Policy
                            </a>{" "}
                            and
                            <a href="#terms" style={{ marginLeft: 4 }}>
                                Terms of Service
                            </a>
                            .
                        </Checkbox>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="newsletter" valuePropName="checked">
                        <Checkbox>
                            I would like to receive updates about alumni events,
                            news, and opportunities
                        </Checkbox>
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item name="contactPermission" valuePropName="checked">
                        <Checkbox>
                            I give permission to be contacted by the university
                            and other alumni for networking opportunities
                        </Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    );

    const PreviewModal = () => {
        const [zoomImage, setZoomImage] = useState(null);
        const [zoomVisible, setZoomVisible] = useState(false);

        const handleImageZoom = (imageUrl) => {
            setZoomImage(imageUrl);
            setZoomVisible(true);
        };

        return (
            <>
                <Modal
                    title={
                        <Space>
                            <BankOutlined />
                            Alumni Registration Preview - {companyInfo.name}
                        </Space>
                    }
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={[
                        <Button
                            key="back"
                            onClick={() => setIsModalVisible(false)}
                        >
                            Cancel
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleSubmit}
                        >
                            Submit Application
                        </Button>,
                    ]}
                    width="90%"
                    className="preview-modal"
                    bodyStyle={{ padding: 0 }}
                >
                    {previewData && (
                        <div className="preview-content">
                            {/* Header Section */}
                            <div className="preview-header">
                                <div className="preview-profile-section">
                                    <div className="profile-image-container">
                                        {previewData.profileImage ? (
                                            <div className="profile-image-wrapper">
                                                <img
                                                    src={
                                                        previewData.profileImage
                                                    }
                                                    alt="Profile"
                                                    className="preview-profile-img"
                                                />
                                                <div
                                                    className="image-zoom-overlay"
                                                    onClick={() =>
                                                        handleImageZoom(
                                                            previewData.profileImage
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
                                        <Title
                                            level={2}
                                            className="preview-name"
                                        >
                                            {previewData.first_name}{" "}
                                            {previewData.middle_name}{" "}
                                            {previewData.last_name}{" "}
                                            {previewData.suffix}
                                        </Title>
                                        <Text className="preview-title">
                                            {previewData.jobTitle || "Alumni"}
                                            {previewData.currentCompany &&
                                                ` at ${previewData.currentCompany}`}
                                        </Text>
                                        <div className="preview-contact-info">
                                            <Row gutter={[16, 8]}>
                                                {previewData.email && (
                                                    <Col xs={24} sm={12} md={8}>
                                                        <div className="contact-item">
                                                            <MailOutlined className="contact-icon" />
                                                            <div className="contact-details">
                                                                <Text className="contact-label">
                                                                    Email
                                                                </Text>
                                                                <Text className="contact-value">
                                                                    {
                                                                        previewData.email
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )}
                                                {previewData.phone && (
                                                    <Col xs={24} sm={12} md={8}>
                                                        <div className="contact-item">
                                                            <PhoneOutlined className="contact-icon" />
                                                            <div className="contact-details">
                                                                <Text className="contact-label">
                                                                    Phone
                                                                </Text>
                                                                <Text className="contact-value">
                                                                    {
                                                                        previewData.phone
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )}
                                                {previewData.address && (
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
                                                                            previewData.address,
                                                                    }}
                                                                >
                                                                    {
                                                                        previewData.address
                                                                    }
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
                                        {/* Personal Summary */}
                                        {previewData.bio && (
                                            <Card
                                                className="preview-card"
                                                size="small"
                                            >
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
                                                    {previewData.bio}
                                                </Paragraph>
                                            </Card>
                                        )}

                                        {/* Career Information */}
                                        <Card
                                            className="preview-card"
                                            size="small"
                                        >
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
                                                    <Col xs={24} sm={12}>
                                                        <div className="detail-item">
                                                            <Text strong>
                                                                Employment
                                                                Status:
                                                            </Text>
                                                            <Tag
                                                                color={
                                                                    employmentStatusOptions.find(
                                                                        (s) =>
                                                                            s.value ===
                                                                            previewData.employmentStatus
                                                                    )?.color ||
                                                                    "blue"
                                                                }
                                                            >
                                                                {employmentStatusOptions.find(
                                                                    (s) =>
                                                                        s.value ===
                                                                        previewData.employmentStatus
                                                                )?.label ||
                                                                    previewData.employmentStatus}
                                                            </Tag>
                                                        </div>
                                                    </Col>
                                                    {previewData.currentCompany && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Current
                                                                    Company:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.currentCompany
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.jobTitle && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Position:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.jobTitle
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.industry && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Industry:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.industry
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.yearsExperience && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Experience:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.yearsExperience
                                                                    }{" "}
                                                                    years
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.workLocation && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Work
                                                                    Location:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.workLocation
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.salaryRange && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Salary
                                                                    Range:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.salaryRange
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>

                                                {/* Career Goals */}
                                                {previewData.careerGoals && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Career Goals
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {
                                                                previewData.careerGoals
                                                            }
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {/* Previous Experience */}
                                                {previewData.previousCompanies && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Previous Experience
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {
                                                                previewData.previousCompanies
                                                            }
                                                        </Paragraph>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>

                                        {/* Academic Information */}
                                        <Card
                                            className="preview-card"
                                            size="small"
                                        >
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
                                                    {previewData.course && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Course/Degree:
                                                                </Text>
                                                                <Text>
                                                                    {courseOptions.find(
                                                                        (c) =>
                                                                            c.value ===
                                                                            previewData.course
                                                                    )?.label ||
                                                                        previewData.course}
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.graduationYear && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Graduation
                                                                    Year:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.graduationYear
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.enrollmentYear && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Enrollment
                                                                    Year:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.enrollmentYear
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                    {previewData.studentId && (
                                                        <Col xs={24} sm={12}>
                                                            <div className="detail-item">
                                                                <Text strong>
                                                                    Student ID:
                                                                </Text>
                                                                <Text>
                                                                    {
                                                                        previewData.studentId
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </Col>
                                                    )}
                                                </Row>

                                                {/* Academic Achievements */}
                                                {previewData.academicAchievements && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Academic
                                                            Achievements
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {
                                                                previewData.academicAchievements
                                                            }
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {/* Extracurricular Activities */}
                                                {previewData.extracurricular && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Extracurricular
                                                            Activities
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {
                                                                previewData.extracurricular
                                                            }
                                                        </Paragraph>
                                                    </div>
                                                )}

                                                {/* Thesis/Capstone */}
                                                {previewData.thesisTitle && (
                                                    <div className="subsection">
                                                        <Text
                                                            strong
                                                            className="subsection-title"
                                                        >
                                                            Thesis/Capstone
                                                            Project
                                                        </Text>
                                                        <Paragraph className="preview-text">
                                                            {
                                                                previewData.thesisTitle
                                                            }
                                                        </Paragraph>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </Col>

                                    {/* Right Column - Sidebar */}
                                    <Col xs={24} lg={8}>
                                        {/* Quick Info Card */}
                                        <Card
                                            className="sidebar-card"
                                            size="small"
                                        >
                                            {/* Personal Information */}
                                            <div className="sidebar-section">
                                                <Title
                                                    level={5}
                                                    className="sidebar-title"
                                                >
                                                    <IdcardOutlined /> Personal
                                                    Info
                                                </Title>
                                                <div className="sidebar-items">
                                                    {previewData.birth_date && (
                                                        <div className="sidebar-item">
                                                            <CalendarOutlined className="sidebar-icon" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    Birth Date
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    {moment(
                                                                        previewData.birth_date
                                                                    ).format(
                                                                        "MMM DD, YYYY"
                                                                    )}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {previewData.gender && (
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
                                                                    {previewData.gender.replace(
                                                                        "_",
                                                                        " "
                                                                    )}
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
                                                    <GlobalOutlined /> Social
                                                    Profiles
                                                </Title>
                                                <div className="sidebar-items">
                                                    {previewData.linkedin && (
                                                        <div className="sidebar-item clickable">
                                                            <LinkedinOutlined className="sidebar-icon linkedin" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    LinkedIn
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    Profile
                                                                    Connected
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {previewData.github && (
                                                        <div className="sidebar-item clickable">
                                                            <GithubOutlined className="sidebar-icon github" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    GitHub
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    Profile
                                                                    Connected
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {previewData.portfolio && (
                                                        <div className="sidebar-item clickable">
                                                            <GlobalOutlined className="sidebar-icon portfolio" />
                                                            <div className="sidebar-content">
                                                                <Text className="sidebar-label">
                                                                    Portfolio
                                                                </Text>
                                                                <Text className="sidebar-value">
                                                                    Website
                                                                    Added
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
                                                    <div className="document-item uploaded">
                                                        <CheckCircleOutlined className="doc-icon" />
                                                        <Text>
                                                            Profile Photo
                                                        </Text>
                                                    </div>
                                                    {previewData.idDocuments &&
                                                        previewData.idDocuments.map(
                                                            (doc, index) => {
                                                                const docType =
                                                                    ID_TYPES.find(
                                                                        (d) =>
                                                                            d.value ===
                                                                            doc.type
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
                                                                                    doc.url
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
                                                    {previewData.newsletter && (
                                                        <div className="preference-item">
                                                            <CheckCircleOutlined className="pref-icon" />
                                                            <Text>
                                                                Newsletter
                                                                Subscribed
                                                            </Text>
                                                        </div>
                                                    )}
                                                    {previewData.contactPermission && (
                                                        <div className="preference-item">
                                                            <CheckCircleOutlined className="pref-icon" />
                                                            <Text>
                                                                Contact
                                                                Permission
                                                                Granted
                                                            </Text>
                                                        </div>
                                                    )}
                                                    {previewData.continueEducation && (
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
                                </Row>

                                {/* Honors & Awards Section */}
                                {previewData.honors &&
                                    previewData.honors.length > 0 && (
                                        <Card
                                            className="preview-card"
                                            size="small"
                                        >
                                            <div className="section-header">
                                                <TrophyOutlined className="section-icon" />
                                                <Title
                                                    level={4}
                                                    className="section-title"
                                                >
                                                    Honors & Awards
                                                </Title>
                                            </div>
                                            <div className="honors-container">
                                                <Row gutter={[8, 8]}>
                                                    {previewData.honors.map(
                                                        (honor, index) => (
                                                            <Col
                                                                key={index}
                                                                xs={24}
                                                                sm={12}
                                                                md={8}
                                                                lg={6}
                                                            >
                                                                <div className="honor-item">
                                                                    <TrophyOutlined className="honor-icon" />
                                                                    <Text>
                                                                        {honor}
                                                                    </Text>
                                                                </div>
                                                            </Col>
                                                        )
                                                    )}
                                                </Row>
                                            </div>
                                        </Card>
                                    )}
                            </div>
                        </div>
                    )}
                </Modal>

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
                                        // Download functionality would go here
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
            </>
        );
    };
    return (
        <div className="alumni-registration">
            <Card className="registration-card">
                <div className="back-to-login-section">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => (window.location.href = "/login")} // or use your navigation method
                        className="back-to-login-btn"
                    >
                        Back to Login
                    </Button>
                </div>
                {/* Company Header */}
                <div className="company-header">
                    <div className="company-logo-section">
                        <Avatar
                            src={companyInfo.logo}
                            size={60}
                            shape="square"
                            className="company-logo"
                        />
                        <div className="company-info">
                            <Title level={2} className="company-name">
                                {companyInfo.name}
                            </Title>
                            <Text className="company-slogan">
                                {companyInfo.slogan}
                            </Text>
                            <div className="company-details">
                                <Space>
                                    <GlobalOutlined />
                                    <Text type="secondary">
                                        {companyInfo.website}
                                    </Text>
                                    <EnvironmentOutlined />
                                    <Text type="secondary">
                                        {companyInfo.address}
                                    </Text>
                                </Space>
                            </div>
                        </div>
                    </div>
                    <Divider />
                </div>

                <div className="registration-header">
                    <Title level={3}>Alumni Registration Portal</Title>
                    <Text type="secondary">
                        Join the {companyInfo.name} alumni network and stay
                        connected with your university community
                    </Text>
                </div>

                <Divider />

                {/* Progress Bar */}
                <div className="progress-section">
                    <Progress
                        percent={calculateProgress()}
                        showInfo={false}
                        strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                        }}
                    />
                    <Text type="secondary">
                        Step {currentStep + 1} of {steps.length}
                    </Text>
                </div>

                {/* Stepper */}
                <Steps current={currentStep} className="registration-steps">
                    {steps.map((step, index) => (
                        <Step key={index} title={step.title} icon={step.icon} />
                    ))}
                </Steps>

                <Divider />

                {/* Form Content */}
                <Form
                    form={form}
                    layout="vertical"
                    className="registration-form"
                    initialValues={{
                        gender: "male",
                        newsletter: true,
                        contactPermission: true,
                    }}
                >
                    {currentStep === 0 && <PersonalInfoStep />}
                    {currentStep === 1 && <AcademicInfoStep />}
                    {currentStep === 2 && <CareerInfoStep />}
                    {currentStep === 3 && <DocumentsStep />}
                    {currentStep === 4 && <ReviewSubmitStep />}
                </Form>

                {/* Navigation Buttons */}
                <Divider />

                <div className="navigation-buttons">
                    <Space size="large">
                        {currentStep > 0 && (
                            <Button size="large" onClick={handlePrev}>
                                Previous
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleNext}
                            >
                                Next
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={handlePreview}
                                disabled={
                                    !profileImage || idDocuments.length === 0
                                }
                            >
                                Submit Application
                            </Button>
                        )}
                    </Space>
                </div>

                {/* Footer */}
                <Divider />
                <div className="registration-footer">
                    <Space
                        direction="vertical"
                        align="center"
                        style={{ width: "100%" }}
                    >
                        <Text type="secondary">
                            {companyInfo.name} Alumni Association
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            © {new Date().getFullYear()} {companyInfo.name}. All
                            rights reserved.
                        </Text>
                    </Space>
                </div>
            </Card>

            <PreviewModal />
        </div>
    );
};

export default AlumniRegistration;
