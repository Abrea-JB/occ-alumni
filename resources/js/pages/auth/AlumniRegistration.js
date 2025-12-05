"use client"

import { useState } from "react"
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
} from "antd"
import {
  UserOutlined,
  CameraOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  BookOutlined,
  TrophyOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  GithubOutlined,
  TwitterOutlined,
  PlusOutlined,
  DeleteOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  UploadOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"
import moment from "moment"
import "./AlumniRegistration.css"
import axios from "axios"
import { BASE_URL } from "../../utils/constant"
import useCourses from "~/hooks/useCourses"
import useEmployeeStatus from "~/hooks/useEmployeeStatus"
import { AlumniDetails } from "~/components"
import { industryOptions } from "~/utils/constant"
import dayjs from "dayjs";
import logo from "~/assets/images/OCC_LOGO.png"


const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { Step } = Steps

// Company/University Information
const companyInfo = {
  name: "Opol Community College Alumni Association",
  logo:logo,
  slogan: "Building tomorrow's leaders, one student at a time.",
  website: "occ-alumni.online",
  address: "ZONE C. Salva St, Opol, 9016 Misamis Oriental",
}

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
]

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
]

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
]

const statusColors = {
  Employed: "green",
  Unemployed: "red",
  "Under Employed": "orange",
}

const AlumniRegistration = () => {
  const { isLoading, data: courses, isFetching, refetch } = useCourses()
  const { data: statuses } = useEmployeeStatus()
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const [profileImage, setProfileImage] = useState(null)
  const [idDocuments, setIdDocuments] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [selectedGradYear, setSelectedGradYear] = useState(null);
  const [isUnemployed, setIsUnemployed] = useState(false);

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
  ]

  // Profile Image Upload
  const handleProfileImageUpload = (info) => {
    if (info.file.status === "uploading") {
      return
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setProfileImage(url)
        message.success("Profile image uploaded successfully!")
      })
    }
  }

  // ID Documents Upload
  const handleIdDocumentsUpload = (info, documentType) => {
    if (info.file.status === "uploading") {
      return
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
        }

        setIdDocuments((prev) => {
          const filtered = prev.filter((doc) => doc.type !== documentType)
          return [...filtered, newDocument]
        })

        message.success(`${ID_TYPES.find((doc) => doc.value === documentType)?.label} uploaded successfully!`)
      })
    }
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!")
      return Upload.LIST_IGNORE
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!")
      return Upload.LIST_IGNORE
    }
    return isJpgOrPng && isLt5M
  }

  const profileUploadProps = {
    beforeUpload,
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok")
      }, 0)
    },
    onChange: handleProfileImageUpload,
    showUploadList: false,
  }

  const idUploadProps = (documentType) => ({
    beforeUpload,
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok")
      }, 0)
    },
    onChange: (info) => handleIdDocumentsUpload(info, documentType),
    showUploadList: false,
  })

  const removeDocument = (documentId) => {
    setIdDocuments((prev) => prev.filter((doc) => doc.id !== documentId))
    message.success("Document removed successfully!")
  }

  const updateDocumentStatus = (documentId, status) => {
    setIdDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, status } : doc)))
  }

  const profileUploadButton = (
    <div className="upload-button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Photo</div>
    </div>
  )

  const idUploadButton = (documentType) => (
    <div className="id-upload-button">
      <UploadOutlined />
      <div style={{ marginTop: 4, fontSize: "12px" }}>
        Upload {ID_TYPES.find((doc) => doc.value === documentType)?.label}
      </div>
    </div>
  )

  const handleNext = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1)
      })
      .catch((error) => {
        console.log("Validation Failed:", error)
      })
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handlePreview = async () => {
    setCurrentStep("all")
    setTimeout(() => {
      previewShow()
    }, 100)
  }

  const previewShow = async () => {
    const values = await form.validateFields()
    const previewData = {
      // Personal Information
      first_name: values.first_name,
      last_name: values.last_name,
      middle_name: values.middle_name,
      suffix: values.suffix,
      email: values.email,
      phone: values.phone,
      address: values.address,
      birth_date: values.birth_date
        ? values.birth_date.format("YYYY-MM-DD")
        : null,
      gender: values.gender,
      bio: values.bio,

      // Academic Information
      course_id: values.course_id,
      studentId: values.studentId,
      graduationYear: values.graduationYear,
      enrollmentYear: values.enrollmentYear,
      honors: values.honors || [],
      thesisTitle: values.thesisTitle,
      academicAchievements: values.academicAchievements,
      extracurricular: values.extracurricular,
      continueEducation: values.continueEducation,

      // Career Information
      employment_status_id: values.employment_status_id,
      currentCompany: values.currentCompany,
      jobTitle: values.jobTitle,
      industry: values.industry,
      yearsExperience: values.yearsExperience,
      salaryRange: values.salaryRange,
      workLocation: values.workLocation,
      careerGoals: values.careerGoals,
      previousCompanies: values.previousCompanies,

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
      profileImage,
      idDocuments,
    }
    setPreviewData(previewData)
    setIsModalVisible(true)
  }

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  const handleSubmit = async () => {
    let loadingMessage = null

    try {
      setLoading(true)

      // Validate all form fields first
      const values = await form.validateFields()

      // Additional validation for documents
      if (!profileImage) {
        message.error("Please upload a profile photo")
        return
      }

      if (idDocuments.length === 0) {
        message.error("Please upload at least one ID document")
        return
      }

      // Show loading message
      loadingMessage = message.loading("Submitting your application...", 0)

      const formData = new FormData()

      // Append all form fields with proper snake_case formatting
      const allFormValues = form.getFieldsValue(true)

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
      }

      // Format birthDate specifically
      const formattedValues = {
        ...allFormValues,
        birth_date: allFormValues.birth_date
          ? allFormValues.birth_date.format("YYYY-MM-DD")
          : null,
      }


      // Process each field
      Object.keys(formattedValues).forEach((key) => {
        const value = formattedValues[key]
        const snakeCaseKey = fieldMappings[key] || key

        if (value === undefined || value === null || value === "") {
          return // Skip empty values
        }

        if (Array.isArray(value)) {
          // Handle array fields (like honors, skills, etc.)
          value.forEach((item, index) => {
            if (item && item !== "") {
              formData.append(`${snakeCaseKey}[${index}]`, item.toString())
            }
          })
        } else if (typeof value === "boolean") {
          // Handle boolean fields
          formData.append(snakeCaseKey, value ? "1" : "0")
        } else if (typeof value === "object") {
          // Handle object fields (stringify them)
          try {
            formData.append(snakeCaseKey, JSON.stringify(value))
          } catch (error) {
            console.warn(`Could not stringify field ${snakeCaseKey}:`, error)
            formData.append(snakeCaseKey, value.toString())
          }
        } else {
          // Handle string/number fields
          formData.append(snakeCaseKey, value.toString())
        }
      })

      // Append profile image
      if (profileImage) {
        try {
          let profileBlob
          if (profileImage.startsWith("data:")) {
            profileBlob = dataURLToBlobSync(profileImage)
          } else {
            profileBlob = profileImage
          }
          formData.append("profile_image", profileBlob, "profile.jpg")
        } catch (error) {
          console.error("Error processing profile image:", error)
          throw new Error("Error processing profile image")
        }
      }

      // Append ID documents with metadata
      idDocuments.forEach((doc, index) => {
        try {
          let documentBlob

          if (doc.url && doc.url.startsWith("data:")) {
            documentBlob = dataURLToBlobSync(doc.url)
          } else if (doc.file) {
            documentBlob = doc.file
          } else {
            console.warn(`Document ${doc.type} has no valid file data`)
            return
          }

          // Append the actual file
          formData.append(`documents[${index}][file]`, documentBlob, doc.name || `document_${index}.jpg`)

          // Append document metadata
          formData.append(`documents[${index}][type]`, doc.type)
          formData.append(`documents[${index}][name]`, doc.name || `document_${index}`)
        } catch (error) {
          console.error(`Error processing document ${doc.type}:`, error)
        }
      })

      // Debug: Log form data (optional - remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log("FormData contents:")
        for (const [key, value] of formData.entries()) {
          if (key.includes("file") || key.includes("image")) {
            console.log(key, `[File: ${value.name || "Blob"}]`)
          } else {
            console.log(key, value)
          }
        }
      }

      // Submit the form
      const response = await axios.post(BASE_URL + "api/alumni/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds timeout
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

          // Update progress in the message
          if (percentCompleted < 100) {
            message.destroy()
            message.loading(`Uploading... ${percentCompleted}%`, 0)
          }
        },
      })

      // Clear loading message
      if (loadingMessage) {
        message.destroy()
      }

      if (response.data.success) {
        message.success(response.data.message || "Alumni registration submitted successfully!")

        // Reset form state
        form.resetFields()
        setProfileImage(null)
        setIdDocuments([])
        setCurrentStep(0)
        setIsModalVisible(false)

        // Show success message with application ID if available
        if (response.data.application_id) {
          Modal.success({
            title: "Registration Successful!",
            content: (
              <div>
                <p>Your alumni registration has been submitted successfully.</p>
                <p>
                  <strong>Application ID:</strong> {response.data.application_id}
                </p>
                <p>You will receive a confirmation email shortly.</p>
              </div>
            ),
            onOk() {
              // Optional: Redirect to success page or dashboard
              console.log("Application ID:", response.data.application_id)
            },
          })
        }
      } else {
        message.error(response.data.message || "Submission failed. Please try again.")
      }
    } catch (error) {
      // Clear any existing loading messages
      if (loadingMessage) {
        message.destroy()
      }

      console.error("Submission error:", error)

      // Handle different types of errors
      if (error.errorFields) {
        // Form validation errors
        const firstError = error.errorFields[0]
        message.error(`Please check: ${firstError.errors[0]}`)

        // Optional: Scroll to the first error field
        const errorElement = document.querySelector(".ant-form-item-has-error")
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }
      } else if (error.response) {
        // Server responded with error status
        const serverError = error.response.data

        // Handle Laravel validation errors
        if (serverError.errors) {
          const firstErrorKey = Object.keys(serverError.errors)[0]
          const firstErrorMessage = serverError.errors[firstErrorKey][0]
          message.error(firstErrorMessage)

          // Log all validation errors for debugging
          console.log("Validation errors:", serverError.errors)
        } else {
          message.error(serverError.message || serverError.error || "Server error occurred. Please try again.")
        }

        // Handle specific HTTP status codes
        if (error.response.status === 413) {
          message.error("File size too large. Please upload smaller files.")
        } else if (error.response.status === 429) {
          message.error("Too many requests. Please try again later.")
        } else if (error.response.status === 422) {
          // Validation errors are already handled above
          console.log("Validation error details:", serverError)
        } else if (error.response.status === 500) {
          message.error("Server error. Please try again later.")
        }
      } else if (error.request) {
        // Network error - no response received
        message.error("Network error. Please check your internet connection and try again.")
        console.error("Network error details:", error.request)
      } else if (error.code === "ECONNABORTED") {
        // Timeout error
        message.error("Request timeout. Please try again.")
      } else if (error.message) {
        // Other errors with message
        message.error(error.message)
      } else {
        // Unknown error
        message.error("An unexpected error occurred. Please try again.")
      }

      // Log detailed error for debugging
      console.error("Detailed error:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      })
    } finally {
      // Always execute - clean up loading states
      setLoading(false)

      // Ensure loading message is cleared
      if (loadingMessage) {
        message.destroy()
      }

      // Clear any other loading states if needed
      console.log("Form submission process completed")
    }
  }

  // Helper function to convert data URL to Blob
  const dataURLToBlobSync = (dataURL) => {
    try {
      const arr = dataURL.split(",")
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      return new Blob([u8arr], { type: mime })
    } catch (error) {
      console.error("Error converting data URL to blob:", error)
      throw error
    }
  }

  // Async version of dataURLToBlob
  const dataURLToBlob = async (dataURL) => {
    return dataURLToBlobSync(dataURL)
  }

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
    }
    return statusConfig[status] || statusConfig.pending
  }

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
              <Upload {...profileUploadProps} className="avatar-uploader">
                {profileImage ? (
                  <div className="avatar-preview">
                    <img src={profileImage || "/placeholder.svg"} alt="avatar" />
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
                <Button type="link" danger onClick={() => setProfileImage(null)} className="remove-photo-btn">
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
              {
                pattern: /^[A-Za-z\s]+$/,
                message: "First name must contain letters only",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your first name"
              prefix={<UserOutlined />}
              onChange={(e) => {
                let value = e.target.value;

                // Remove numbers & special characters
                value = value.replace(/[^A-Za-z\s]/g, "");

                // Update the form value properly
                form.setFieldsValue({ first_name: value });
              }}
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
              {
                pattern: /^[A-Za-z\s]+$/,
                message: "Last name must contain letters only",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your last name"
              prefix={<UserOutlined />}
              onChange={(e) => {
                let value = e.target.value;

                // Remove numbers & special characters
                value = value.replace(/[^A-Za-z\s]/g, "");

                // Update the form value properly
                form.setFieldsValue({ last_name: value });
              }}
            />
          </Form.Item>
        </Col>


        <Col xs={24} sm={12}>
          <Form.Item
            name="middle_name"
            label="Middle Name"
            rules={[
              {
                pattern: /^[A-Za-z\s]*$/,
                message: "Middle name must contain letters only",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your middle name"
              onChange={(e) => {
                let value = e.target.value;

                // Remove any number or special characters
                value = value.replace(/[^A-Za-z\s]/g, "");

                // Update Ant Design form value properly
                form.setFieldsValue({ middle_name: value });
              }}
            />
          </Form.Item>
        </Col>


        <Col xs={24} sm={12}>
          <Form.Item name="suffix" label="Suffix">
            <Select size="large" placeholder="Select suffix">
              <Option value="">None</Option>
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
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();

                  // Check if Gmail
                  if (!/^[\w.+-]+@gmail\.com$/i.test(value)) {
                    return Promise.reject(new Error("Email must be a @gmail.com address"));
                  }

                  // Check if email already exists in the backend
                  try {
                    const res = await axios.get(`/api/check-email?email=${value}`);
                    if (res.data.exists) {
                      return Promise.reject(new Error("This email is already in use"));
                    }
                    return Promise.resolve();
                  } catch (err) {
                    return Promise.reject(new Error("Unable to verify email"));
                  }
                },
              },
            ]}
            validateTrigger={['onBlur']}
          >
            <Input
              size="large"
              placeholder="your.email@gmail.com"
              prefix={<MailOutlined />}
            />
          </Form.Item>
        </Col>


    <Col xs={24} sm={12}>
  <Form.Item
    name="phone"
    label="Phone Number"
    rules={[
      { required: true, message: "Please enter your phone number" },
      {
        pattern: /^09\d{9}$/,
        message: "Phone number must be 11 digits and start with 09",
      },
      {
        validator: async (_, value) => {
          if (!value) return Promise.resolve();
          try {
            const res = await axios.get(`/api/check-phone?phone=${value}`);
            if (res.data.exists) {
              return Promise.reject(new Error("This phone number is already in use"));
            }
            return Promise.resolve();
          } catch (err) {
            return Promise.reject(new Error("Unable to verify phone number"));
          }
        },
      },
    ]}
    validateTrigger={["onBlur"]}
  >
    <Input
      size="large"
      maxLength={11}
      prefix={<PhoneOutlined />}
      onChange={(e) => {
        // only allow numbers — BUT do not force starting with 09
        const value = e.target.value.replace(/\D/g, "").slice(0, 11);
        form.setFieldsValue({ phone: value });
      }}
      placeholder="09XXXXXXXXX"
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
            <Input size="large" placeholder="Enter your complete address" prefix={<EnvironmentOutlined />} />
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
      disabledDate={(current) => {
        const twentyYearsAgo = dayjs().subtract(20, "year");
        return current && current.isAfter(twentyYearsAgo, "day");
      }}
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
              <Radio value="prefer_not_to_say">Prefer not to say</Radio>
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
      <Row gutter={16}>
        {/* First Column - Password */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" size="large" />
          </Form.Item>
        </Col>

        {/* Second Column - Confirm Password */}
        <Col xs={24} md={12}>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Passwords do not match!"))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" size="large" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )

  const AcademicInfoStep = () => (
    <div className="form-step">
      <Title level={3}>Academic Information</Title>
      <Text type="secondary">Tell us about your educational background</Text>

      <Divider />

      <Row gutter={[24, 16]}>
        <Col xs={24}>
          <Form.Item
            name="course_id"
            label="Course/Degree"
            rules={[
              {
                required: true,
                message: "Please select your course",
              },
            ]}
          >
            <Select size="large" placeholder="Select your course" showSearch optionFilterProp="children">
              {Array.isArray(courses) &&
                courses.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.course_code}({course.course_name})
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="studentId"
            label="Student ID Number"
            rules={[
              {
                required: true,
                message: "Please enter your student ID",
              },
              {
                pattern: /^\d{4}-\d-\d{5}$/,
                message: "Format must be YYYY-S-NNNNN (e.g., 2021-2-04062)",
              },
              {
                validator: async (_, value) => {
                  if (!value) return Promise.resolve();
                  try {
                    const res = await axios.get(`/api/check-student-id?studentId=${value}`);
                    if (res.data.exists) {
                      return Promise.reject(new Error("This student ID is already in use"));
                    }
                    return Promise.resolve();
                  } catch (err) {
                    return Promise.reject(new Error("Unable to verify student ID"));
                  }
                },
              },
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input
              size="large"
              placeholder="2021-2-04062"
              prefix={<IdcardOutlined />}
              maxLength={12}
              onChange={(e) => {
                let value = e.target.value;

                // Remove all characters except numbers
                value = value.replace(/[^0-9]/g, "");

                // Apply formatting as YYYY-S-NNNNN
                if (value.length > 4) value = value.slice(0, 4) + "-" + value.slice(4);
                if (value.length > 6) value = value.slice(0, 6) + "-" + value.slice(6);

                form.setFieldsValue({ studentId: value });
              }}
            />
          </Form.Item>
        </Col>


        <Col xs={24} sm={12}>
          <Form.Item
            name="graduationYear"
            label="Graduation Year (4th Year)"
            rules={[
              {
                required: true,
                message: "Please select graduation year",
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Expected Graduation Year"
              onChange={(value) => {
                setSelectedGradYear(value);
                form.setFieldsValue({ enrollmentYear: value - 1 }); // reset enrollment
              }}
            >
              {Array.from({ length: 30 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
        </Col>

  <Col xs={24} sm={12}>
  <Form.Item
    name="enrollmentYear"
    label="Enrollment Year (4th Year)"
    rules={[{ required: true, message: "Please select your enrollment year" }]}
  >
    <Select
      size="large"
      placeholder="Enrollment year"
      disabled={!selectedGradYear}
    >
      {selectedGradYear && (
        <Option value={selectedGradYear - 1}>
          {selectedGradYear - 1}
        </Option>
      )}
    </Select>
  </Form.Item>
</Col>



        <Col xs={24} sm={12}>
          <Form.Item name="honors" label="Honors/Awards">
            <Select mode="tags" size="large" placeholder="Add honors or awards received" tokenSeparators={[","]} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            name="thesisTitle"
            label="Thesis/Capstone Title"
            rules={[{ required: true, message: "Please enter your thesis or capstone project title" }]}
          >
            <Input
              size="large"
              placeholder="Enter your thesis or capstone project title"
            />
          </Form.Item>
        </Col>


        <Col xs={24}>
          <Form.Item name="academicAchievements" label="Academic Achievements">
            <TextArea
              rows={3}
              placeholder="List any academic achievements, research projects, or notable accomplishments..."
              maxLength={300}
              showCount
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="extracurricular" label="Extracurricular Activities">
            <TextArea
              rows={3}
              placeholder="Describe your involvement in clubs, organizations, sports, or other activities..."
              maxLength={300}
              showCount
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="continueEducation" label="Plan to Continue Education?" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )

  const CareerInfoStep = () => (
    <div className="form-step">
      <Title level={3}>Career Information</Title>
      <Text type="secondary">Tell us about your professional journey</Text>

      <Divider />

      <Row gutter={[24, 16]}>
        <Col xs={24}>
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
            <Select
  size="large"
  placeholder="Select your employment status"
  onChange={(value) => {
    const selected = statuses.find((s) => s.id === value);

    const unemployedSelected = selected?.status_name
      ?.toLowerCase()
      .includes("unemployed");

    setIsUnemployed(unemployedSelected);

    // Clear all fields when unemployed
    if (unemployedSelected) {
      form.setFieldsValue({
        currentCompany: undefined,
        jobTitle: undefined,
        industry: undefined,
        yearsExperience: undefined,
        salaryRange: undefined,
        workLocation: undefined,
        careerGoals: undefined,
        previousCompanies: undefined,
      });
    }
  }}
>

              {Array.isArray(statuses) &&
                statuses.map((status) => (
                  <Option key={status.id} value={status.id}>
                    <Tag color={statusColors[status.status_name] || "blue"}>{status.status_name}</Tag>
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="currentCompany" label="Current Company/Organization">
            <Input size="large" disabled={isUnemployed} placeholder="Enter your current company name" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="jobTitle" label="Job Title/Position">
            <Input size="large" disabled={isUnemployed} placeholder="Enter your current job title" />
          </Form.Item>
        </Col>

   <Col xs={24} sm={12}>
  <Form.Item name="industry" label="Industry">
    <Select
      size="large"
      disabled={isUnemployed}
      placeholder="Select industry"
      showSearch
      filterOption={(input, option) =>
        option?.children?.toLowerCase().includes(input.toLowerCase())
      }
    >
      {industryOptions.map((industry) => (
        <Option key={industry} value={industry}>
          {industry}
        </Option>
      ))}
    </Select>
  </Form.Item>
</Col>

<Col xs={24} sm={12}>
  <Form.Item name="yearsExperience" label="Years of Experience">
    <InputNumber
      style={{ width: "100%" }}
      size="large"
      disabled={isUnemployed}
      min={1}          // minimum 1
      max={10}         // maximum 10
      step={1}         // only whole numbers
      stringMode={false}
      parser={(value) => value.replace(/\D/g, "")} // remove non-numeric characters
      placeholder="1"
    />
  </Form.Item>
</Col>




        <Col xs={24} sm={12}>
          <Form.Item name="salaryRange" label="Current Annual Salary Range (PHP)">
            <Select size="large" disabled={isUnemployed} placeholder="Select annual salary range">
              <Option value="0-150000">₱0 - ₱150,000 per year</Option>
              <Option value="150001-300000">₱150,001 - ₱300,000 per year</Option>
              <Option value="300001-500000">₱300,001 - ₱500,000 per year</Option>
              <Option value="500001-750000">₱500,001 - ₱750,000 per year</Option>
              <Option value="750001-1000000">₱750,001 - ₱1,000,000 per year</Option>
              <Option value="1000001-1250000">₱1,000,001 - ₱1,250,000 per year</Option>
              <Option value="1250001-1500000">₱1,250,001 - ₱1,500,000 per year</Option>
              <Option value="prefer_not_to_say">Prefer not to say</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="workLocation" label="Work Location">
            <Input size="large" disabled={isUnemployed} placeholder="City, State, Country" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="careerGoals" label="Career Goals & Aspirations">
            <TextArea
              rows={3}
              disabled={isUnemployed}
              placeholder="Describe your career goals and where you see yourself in the next 5 years..."
              maxLength={400}
              showCount
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="previousCompanies" label="Previous Companies/Positions">
            <TextArea
              rows={3}
              disabled={isUnemployed}
              placeholder="List your previous work experiences (Company - Position - Duration)..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Title level={5}>Social Media & Professional Profiles</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="linkedin" label="LinkedIn Profile">
                <Input size="large" placeholder="LinkedIn profile URL" prefix={<LinkedinOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="github" label="GitHub Profile">
                <Input size="large" placeholder="GitHub profile URL" prefix={<GithubOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="portfolio" label="Portfolio Website">
                <Input size="large" placeholder="Personal website or portfolio" prefix={<GlobalOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="twitter" label="Twitter Profile">
                <Input size="large" placeholder="Twitter profile URL" prefix={<TwitterOutlined />} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )

  const DocumentsStep = () => (
    <div className="form-step">
      <Title level={3}>Identity Verification</Title>
      <Text type="secondary">Upload required documents for verification</Text>

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
          <Card title="Profile Photo" size="small" className="document-card">
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
                <Upload {...profileUploadProps} className="profile-uploader">
                  {profileImage ? (
                    <div className="document-preview">
                      <img src={profileImage || "/placeholder.svg"} alt="Profile" />
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
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Uploaded
                  </Tag>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* ID Documents Section */}
        <Col span={24}>
          <Card title="Identity Documents" size="small" className="document-card">
            <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
              Upload at least one form of identification for verification
            </Text>

            <Row gutter={[16, 16]}>
              {ID_TYPES.map((docType) => {
                const uploadedDoc = idDocuments.find((doc) => doc.type === docType.value)

                return (
                  <Col xs={24} md={12} lg={8} key={docType.value}>
                    <Card size="small" className={`id-card ${uploadedDoc ? "uploaded" : ""}`}>
                      <div className="id-card-content">
                        <div className="id-icon">{docType.icon}</div>
                        <div className="id-info">
                          <Text strong>{docType.label}</Text>
                          {uploadedDoc ? (
                            <div className="upload-status">
                              <Tag color="green" icon={<CheckCircleOutlined />}>
                                Uploaded
                              </Tag>
                              <div className="document-actions">
                                <Tooltip title="View Document">
                                  <Button
                                    type="link"
                                    icon={<EyeOutlined />}
                                    onClick={() => {
                                      Modal.info({
                                        title: docType.label,
                                        content: (
                                          <Image
                                            width="100%"
                                            src={uploadedDoc.url || "/placeholder.svg"}
                                            alt={docType.label}
                                          />
                                        ),
                                        icon: null,
                                        width: 600,
                                      })
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip title="Remove Document">
                                  <Button
                                    type="link"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeDocument(uploadedDoc.id)}
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          ) : (
                            <Upload {...idUploadProps(docType.value)}>{idUploadButton(docType.value)}</Upload>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Col>
                )
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
                  const docType = ID_TYPES.find((d) => d.value === doc.type)
                  const status = getDocumentStatus(doc.status)

                  return (
                    <List.Item
                      actions={[
                        <Tooltip title="View Document" key="view">
                          <Button
                            icon={<EyeOutlined />}
                            onClick={() => {
                              Modal.info({
                                title: docType?.label,
                                content: (
                                  <Image width="100%" src={doc.url || "/placeholder.svg"} alt={docType?.label} />
                                ),
                                icon: null,
                                width: 600,
                              })
                            }}
                          />
                        </Tooltip>,
                        <Tooltip title="Remove Document" key="remove">
                          <Button danger icon={<DeleteOutlined />} onClick={() => removeDocument(doc.id)} />
                        </Tooltip>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={docType?.icon}
                        title={
                          <Space>
                            <Text>{docType?.label}</Text>
                            <Tag color={status.color} icon={status.icon}>
                              {status.text}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">File: {doc.name}</Text>
                            <Text type="secondary">
                              Uploaded: {moment(doc.uploadDate).format("MMM DD, YYYY HH:mm")}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )
                }}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  )

  const ReviewSubmitStep = () => (
    <div className="form-step">
      <Title level={3}>Review & Submit</Title>
      <Text type="secondary">Please review your information before submitting</Text>

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
            <Text>Profile Photo {profileImage ? "Uploaded" : "Required"}</Text>
          </div>
          <div className="status-item">
            <CheckCircleOutlined
              style={{
                color: idDocuments.length > 0 ? "#52c41a" : "#d9d9d9",
              }}
            />
            <Text>ID Documents {idDocuments.length > 0 ? "Uploaded" : "Required"}</Text>
          </div>
        </Space>
      </div>

      <Divider />

      <div className="review-section">
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            handlePreview()
          }}
          size="large"
          disabled={!profileImage || idDocuments.length === 0}
        >
          Preview Full Application
        </Button>
        {(!profileImage || idDocuments.length === 0) && (
          <Text type="danger" style={{ display: "block", marginTop: 8 }}>
            Please upload both profile photo and at least one ID document to continue
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
              I confirm that all information provided is accurate and truthful. I agree to the{" "}
              <a
                onClick={(e) => {
                  e.preventDefault()
                  setIsPrivacyModalOpen(true)
                }}
                style={{
                  marginLeft: 4,
                  cursor: "pointer",
                  color: "red",
                  textDecoration: "underline",
                }}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                onClick={(e) => {
                  e.preventDefault()
                  setIsTermsModalOpen(true)
                }}
                style={{
                  marginLeft: 4,
                  cursor: "pointer",
                  color: "red",
                  textDecoration: "underline",
                }}
              >
                Terms of Service
              </a>
              .
            </Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="newsletter" valuePropName="checked">
            <Checkbox>I would like to receive updates about alumni events, news, and opportunities</Checkbox>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item name="contactPermission" valuePropName="checked">
            <Checkbox>
              I give permission to be contacted by the university and other alumni for networking opportunities
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  )

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
            <Avatar src={companyInfo.logo} size={60} shape="square" className="company-logo" />
            <div className="company-info">
              <Title level={2} className="company-name">
                {companyInfo.name}
              </Title>
              <Text className="company-slogan">{companyInfo.slogan}</Text>
              <div className="company-details">
                <Space>
                  <GlobalOutlined />
                  <Text type="secondary">{companyInfo.website}</Text>
                  <EnvironmentOutlined />
                  <Text type="secondary">{companyInfo.address}</Text>
                </Space>
              </div>
            </div>
          </div>
          <Divider />
        </div>

        <div className="registration-header">
          <Title level={3}>Alumni Registration Portal</Title>
          <Text type="secondary">
            Join the {companyInfo.name} alumni network and stay connected with your university community
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
          {/* {currentStep === 0 && <PersonalInfoStep />}
                    {currentStep === 1 && <AcademicInfoStep />}
                    {currentStep === 2 && <CareerInfoStep />}
                    {currentStep === 3 && <DocumentsStep />}
                    {currentStep === 4 && <ReviewSubmitStep />} */}
          {(currentStep === 0 || currentStep === "all") && <PersonalInfoStep />}
          {(currentStep === 1 || currentStep === "all") && <AcademicInfoStep />}
          {(currentStep === 2 || currentStep === "all") && <CareerInfoStep />}
          {(currentStep === 3 || currentStep === "all") && <DocumentsStep />}
          {(currentStep === 4 || currentStep === "all") && <ReviewSubmitStep />}
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
              <Button type="primary" size="large" onClick={handleNext}>
                Next
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                onClick={handlePreview}
                disabled={!profileImage || idDocuments.length === 0}
              >
                Submit Application
              </Button>
            )}
          </Space>
        </div>

        {/* Footer */}
        <Divider />
        <div className="registration-footer">
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <Text type="secondary">{companyInfo.name} Alumni Association</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
            </Text>
          </Space>
        </div>
      </Card>

      <AlumniDetails
        visible={isModalVisible}
        onCancel={() => {
          setCurrentStep(4)
          setIsModalVisible(false)
        }}
        onSubmit={handleSubmit}
        previewData={previewData}
        loading={loading}
      />

      {/* Privacy Policy Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SafetyCertificateOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <span>Privacy Policy</span>
          </div>
        }
        open={isPrivacyModalOpen}
        onCancel={() => setIsPrivacyModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsPrivacyModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
        styles={{
          body: { maxHeight: "60vh", overflowY: "auto" },
        }}
      >
        <Divider />

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={5}>
              <SafetyCertificateOutlined /> Information Collection
            </Title>
            <Paragraph>
              We collect personal information that you voluntarily provide when registering as an alumni member. This
              includes your name, contact details, academic history, professional information, and any documents you
              choose to upload. All information is collected with your explicit consent and stored securely in
              compliance with data protection regulations.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <EyeOutlined /> Data Usage
            </Title>
            <Paragraph>
              Your information is used to maintain accurate alumni records, facilitate networking opportunities, send
              relevant updates about university events and news, and improve our services. We analyze aggregated data to
              understand alumni trends and enhance the alumni experience. Your data will never be sold to third parties.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <SafetyCertificateOutlined /> Data Protection
            </Title>
            <Paragraph>
              We implement industry-standard security measures including encryption, secure servers, and regular
              security audits to protect your personal information. Access to your data is restricted to authorized
              personnel only. We maintain strict confidentiality protocols and comply with GDPR and other relevant data
              protection laws.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <UserOutlined /> Your Rights
            </Title>
            <Paragraph>
              You have the right to access, correct, or delete your personal information at any time. You can opt-out of
              communications, request data portability, or withdraw consent for data processing. To exercise these
              rights, please contact our data protection officer at privacy@university.edu. We will respond to all
              requests within 30 days.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <GlobalOutlined /> Information Sharing
            </Title>
            <Paragraph>
              We may share your information with other alumni only with your explicit permission. Limited information
              may be shared with university partners for official alumni events and programs. We will notify you of any
              material changes to our privacy practices and obtain your consent before implementing them.
            </Paragraph>
          </div>
        </Space>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IdcardOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
            <span>Terms of Service</span>
          </div>
        }
        open={isTermsModalOpen}
        onCancel={() => setIsTermsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsTermsModalOpen(false)}>
            Close
          </Button>,
        ]}
        width={700}
        styles={{
          body: { maxHeight: "60vh", overflowY: "auto" },
        }}
      >
        <Divider />

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={5}>
              <CheckCircleOutlined /> Acceptance of Terms
            </Title>
            <Paragraph>
              By registering as an alumni member, you agree to comply with these Terms of Service and all applicable
              laws and regulations. You acknowledge that you have read, understood, and agree to be bound by these
              terms. If you do not agree with any part of these terms, please do not complete the registration process.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <SafetyCertificateOutlined /> Accurate Information
            </Title>
            <Paragraph>
              You agree to provide accurate, current, and complete information during the registration process and to
              update such information as necessary. Providing false or misleading information may result in termination
              of your alumni membership and access to alumni services. You are responsible for maintaining the
              confidentiality of your account credentials.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <GlobalOutlined /> Use of Services
            </Title>
            <Paragraph>
              Alumni services are provided for networking, professional development, and maintaining connections with
              the university community. You agree not to use these services for any unlawful purpose, to spam other
              members, or to engage in any activity that could harm the university's reputation or other members'
              experience.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <BookOutlined /> Intellectual Property
            </Title>
            <Paragraph>
              All content provided through the alumni platform, including but not limited to text, graphics, logos, and
              software, is the property of the university or its content suppliers and is protected by copyright and
              intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit
              permission.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <ClockCircleOutlined /> Modifications and Termination
            </Title>
            <Paragraph>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
              to the platform. Your continued use of alumni services after changes constitutes acceptance of the
              modified terms. We may suspend or terminate your account for violations of these terms or for any reason
              at our discretion.
            </Paragraph>
          </div>

          <div>
            <Title level={5}>
              <MailOutlined /> Limitation of Liability
            </Title>
            <Paragraph>
              The university and its alumni association provide services on an "as is" basis. We make no warranties,
              expressed or implied, regarding the accuracy, reliability, or availability of the services. We shall not
              be liable for any indirect, incidental, or consequential damages arising from your use of alumni services.
            </Paragraph>
          </div>
        </Space>
      </Modal>
    </div>
  )
}

export default AlumniRegistration
