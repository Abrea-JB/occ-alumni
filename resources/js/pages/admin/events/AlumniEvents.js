"use client"

import { useState, useMemo, useEffect, useRef } from "react"
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
  Tooltip,
  Statistic,
  Upload,
  message,
  Steps,
  InputNumber,
  Carousel,
  Image,
  Alert,
  Progress,
  Table,
  Spin,
} from "antd"
import {
  SearchOutlined,
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
  MoreOutlined,
  VideoCameraOutlined,
  ShareAltOutlined,
  HeartOutlined,
  BookOutlined,
  TrophyOutlined,
  StarOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  PhoneOutlined,
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
  PictureOutlined,
  PhoneFilled,
  MailFilled,
  SafetyCertificateOutlined,
  MessageOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  TagOutlined,
  PrinterOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons"
import moment from "moment"
import "./AlumniEvents.css"
import { Layout } from "~/components"
import axiosConfig from "~/utils/axiosConfig"
import useEvents from "~/hooks/useEvents"
import secureLocalStorage from "react-secure-storage"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { RangePicker } = DatePicker
const { Step } = Steps

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
]

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
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

const sortOptions = [
  { value: "date-asc", label: "Date: Earliest First" },
  { value: "date-desc", label: "Date: Latest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "popularity", label: "Most Popular" },
  { value: "title-asc", label: "Title: A to Z" },
  { value: "capacity", label: "Availability" },
]

const getEventTypeConfig = (type) => {
  return eventTypes.find((et) => et.value === type) || eventTypes[0]
}

const getCategoryLabel = (value) => {
  const category = eventCategories.find((cat) => cat.value === value)
  return category ? category.label : value
}

const RegistrationsModal = ({ event, visible, onClose }) => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [eventData, setEventData] = useState(null)
  const printRef = useRef(null)

  useEffect(() => {
    if (visible && event) {
      fetchRegistrations()
    }
  }, [visible, event])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const response = await axiosConfig.get(`/events/${event.id}/registrations`)
      if (response.data.success) {
        setRegistrations(response.data.data)
        setEventData(response.data.event)
      }
    } catch (error) {
      message.error("Failed to fetch registrations")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    const printContent = printRef.current
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Registrations - ${event?.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1890ff; padding-bottom: 20px; }
          .header h1 { color: #1890ff; margin-bottom: 10px; }
          .event-info { margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          .event-info p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px 8px; text-align: left; }
          th { background-color: #1890ff; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
          .summary { margin-top: 20px; padding: 10px; background: #e6f7ff; border-radius: 5px; }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Event Registration List</h1>
          <h2>${event?.title}</h2>
        </div>
        
      <div class="event-info">
  <p><strong>Date:</strong> ${moment(event?.date).format("MMMM DD, YYYY")}</p>
  <p><strong>Time:</strong> ${moment(event?.start_time, "HH:mm").format("hh:mm A")} - ${moment(event?.end_time, "HH:mm").format("hh:mm A")}</p>
  <p><strong>Location:</strong> ${event?.location}</p>
  <p><strong>Organizer:</strong> ${event?.organizer}</p>
</div>


        <div class="summary">
          <strong>Total Registrations: ${registrations.length} / ${event?.capacity}</strong>
        </div>

        <table>
        <thead>
  <tr>
    <th>#</th>
    <th>Name</th>
    <th>Email</th>
    <th>Contact Number</th>
    <th>Batch Year</th>
    <!-- <th>Course</th> -->
    <th>Registration Date</th>
  </tr>
</thead>
<tbody>
  ${registrations
    .map(
      (reg, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${reg.alumni?.name || "N/A"}</td>
      <td>${reg.alumni?.email || "N/A"}</td>
      <td>${reg.alumni?.contact_number || "N/A"}</td>
      <td>${reg.alumni?.batch_year || "N/A"}</td>
      <!-- <td>${reg.alumni?.course || "N/A"}</td> -->
      <td>${moment(reg.registration_date || reg.created_at).format("MMM DD, YYYY hh:mm A")}</td>
    </tr>
  `,
    )
    .join("")}
</tbody>
        </table>

        <div class="footer">
          <p>Generated on ${moment().format("MMMM DD, YYYY hh:mm A")}</p>
          <p>Alumni Events Management System</p>
        </div>
      </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const columns = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => <Text strong>{record.alumni?.name || "N/A"}</Text>,
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => record.alumni?.email || "N/A",
    },
    {
      title: "Contact",
      key: "contact_number",
      render: (_, record) => record.alumni?.contact_number || "N/A",
    },
    {
      title: "Batch Year",
      key: "batch_year",
      render: (_, record) => record.alumni?.batch_year || "N/A",
    },
    // {
    //   title: "Course",
    //   key: "course",
    //   render: (_, record) => record.alumni?.course || "N/A",
    // },
    {
      title: "Registration Date",
      key: "registration_date",
      render: (_, record) => moment(record.registration_date || record.created_at).format("MMM DD, YYYY hh:mm A"),
    },
  ]

  return (
    <Modal
      title={
        <Space>
          <UsergroupAddOutlined style={{ color: "#1890ff" }} />
          <span>Event Registrations - {event?.title}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          disabled={registrations.length === 0}
        >
          Print List
        </Button>,
      ]}
    >
      <div ref={printRef}>
        {/* Event Summary */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total Registered"
                value={registrations.length}
                suffix={`/ ${event?.capacity}`}
                valueStyle={{ color: "#1890ff" }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Spots Remaining"
                value={(event?.capacity || 0) - registrations.length}
                valueStyle={{ color: registrations.length >= (event?.capacity || 0) ? "#ff4d4f" : "#52c41a" }}
              />
            </Col>
            <Col span={12}>
              <Text type="secondary">Registration Progress</Text>
              <Progress
                percent={Math.round((registrations.length / (event?.capacity || 1)) * 100)}
                status={registrations.length >= (event?.capacity || 0) ? "exception" : "active"}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
              />
            </Col>
          </Row>
        </Card>

        {/* Registrations Table */}
        <Spin spinning={loading}>
          <Table
            dataSource={registrations}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No registrations yet" }}
          />
        </Spin>
      </div>
    </Modal>
  )
}

const EventDetailsModal = ({ event, visible, onClose, onEdit, onDelete, onRefresh }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [phoneModalVisible, setPhoneModalVisible] = useState(false)
  const [emailModalVisible, setEmailModalVisible] = useState(false)
  const [messengerModalVisible, setMessengerModalVisible] = useState(false)
  const [registrationsModalVisible, setRegistrationsModalVisible] = useState(false)
  const [isLoadingRegistrationStatus, setIsLoadingRegistrationStatus] = useState(false)

  const role = secureLocalStorage.getItem("userRole")

  const contactInfo = {
    phone: "09496600923",
    email: "occ.verula.annabelle@gmail.com",
    messenger: "https://www.facebook.com/messages/t/your-page-id",
    title: "Guidance Counselor",
  }

  // Helper function to check if early bird pricing is available
  const isEarlyBirdAvailable = (event) => {
    if (!event.earlyBirdEndDate) return false
    const now = dayjs()
    return now.isBefore(dayjs(event.earlyBirdEndDate))
  }

  const eventId = event?.id
  useEffect(() => {
    const fetchFreshEventData = async () => {
      if (visible && eventId && role === "alumni") {
        setIsLoadingRegistrationStatus(true)
        try {
          const response = await axiosConfig.get(`/events/${eventId}`)
          const freshEvent = response.data
          const backendRegistered = freshEvent.is_user_registered || false
          setIsRegistered(backendRegistered)

          // Sync localStorage with fresh backend value
          const storedRegistrations = JSON.parse(localStorage.getItem("eventRegistrations") || "{}")
          if (backendRegistered) {
            storedRegistrations[eventId] = true
          } else {
            delete storedRegistrations[eventId]
          }
          localStorage.setItem("eventRegistrations", JSON.stringify(storedRegistrations))
        } catch (error) {
          console.error("Failed to fetch fresh event data:", error)
          // Fallback to event prop value if fetch fails
          setIsRegistered(event?.is_user_registered || false)
        } finally {
          setIsLoadingRegistrationStatus(false)
        }
      } else if (event) {
        // For non-alumni users, just use the prop value
        setIsRegistered(event.is_user_registered || false)
      }
    }

    fetchFreshEventData()
  }, [visible, eventId, role, event])

  if (!event) return null

  const handleRegister = async () => {
    setIsRegistering(true)
    try {
      const response = await axiosConfig.post(`/events/${event.id}/register`)
      if (response.data.success) {
        setIsRegistered(true)

        // Persist registration to localStorage
        const storedRegistrations = JSON.parse(localStorage.getItem("eventRegistrations") || "{}")
        storedRegistrations[event.id] = true
        localStorage.setItem("eventRegistrations", JSON.stringify(storedRegistrations))

        message.success(response.data.message || "Successfully registered for this event!")
        if (onRefresh) onRefresh()
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to register for the event")
    } finally {
      setIsRegistering(false)
    }
  }

  const handleCancelRegistration = async () => {
    Modal.confirm({
      title: "Cancel Registration",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel your registration for this event?",
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          const response = await axiosConfig.post(`/events/${event.id}/cancel-registration`)
          if (response.data.success) {
            setIsRegistered(false)

            // Remove registration from localStorage
            const storedRegistrations = JSON.parse(localStorage.getItem("eventRegistrations") || "{}")
            delete storedRegistrations[event.id]
            localStorage.setItem("eventRegistrations", JSON.stringify(storedRegistrations))

            message.success(response.data.message || "Registration cancelled successfully")
            if (onRefresh) onRefresh()
          }
        } catch (error) {
          message.error(error.response?.data?.message || "Failed to cancel registration")
        }
      },
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    message.success(isLiked ? "Removed from favorites" : "Added to favorites")
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    message.success("Event link copied to clipboard!")
  }

  const handleMenuClick = ({ key }) => {
    if (key === "delete") {
      Modal.confirm({
        title: "Delete Event",
        icon: <ExclamationCircleOutlined />,
        content: "Are you sure you want to delete this event? This action cannot be undone.",
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk() {
          onDelete(event)
        },
      })
    } else if (key === "edit") {
      onEdit(event)
    } else if (key === "share") {
      handleShare()
    } else if (key === "registrations") {
      setRegistrationsModalVisible(true)
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        disabled={event.status === "ongoing" || event.status === "completed"}
      >
        Edit Event
      </Menu.Item>
      {/* <Menu.Item key="duplicate" icon={<CopyOutlined />}>
        Duplicate Event
      </Menu.Item>
      <Menu.Divider /> */}
      {/* <Menu.Item key="share" icon={<ShareAltOutlined />}>
        Share Event
      </Menu.Item> */}
      <Menu.Item key="registrations" icon={<UsergroupAddOutlined />}>
        View Registrations
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Delete Event
      </Menu.Item>
    </Menu>
  )

  const registeredCount = event.registered_count || event.registered || 0
  const capacity = event.capacity || 0
  const spotsRemaining = capacity - registeredCount
  const isFull = registeredCount >= capacity

  return (
    <>
      <Modal
        title={
          <div
            className="event-detail-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "48px",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              {event.title}
            </Title>
            <div className="event-header-actions">
              {role === "admin" && (
                <Dropdown overlay={menu} trigger={["click"]}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              )}
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
            <Carousel arrows dots={{ className: "custom-dots" }} className="event-carousel">
              {event.image_urls?.map((image, index) => (
                <div key={index} className="carousel-slide">
                  <Image
                    src={image || "/placeholder.svg"}
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
                <Space size="middle" style={{ marginBottom: 16 }}>
                  <Tag
                    color={getEventTypeConfig(event.eventType || event.event_type).color}
                    icon={getEventTypeConfig(event.eventType || event.event_type).icon}
                  >
                    {getEventTypeConfig(event.eventType || event.event_type).label}
                  </Tag>
                  <Tag icon={<TagOutlined />} color="blue">
                    {getCategoryLabel(event.category)}
                  </Tag>
                  {event.featured && (
                    <Tag icon={<StarOutlined />} color="gold">
                      Featured
                    </Tag>
                  )}
                </Space>

                <Paragraph className="event-description-detailed">{event.description}</Paragraph>

                <Divider />

                {/* Event Details Grid */}
                <Row gutter={[16, 16]} className="event-details-grid">
                  <Col span={12}>
                    <div className="detail-item-large">
                      <CalendarOutlined className="detail-icon" />
                      <div className="detail-content">
                        <Text strong>Date</Text>
                        <Text>{moment(event.date).format("dddd, MMMM DD, YYYY")}</Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="detail-item-large">
                      <ClockCircleOutlined className="detail-icon" />
                      <div className="detail-content">
                        <Text strong>Time</Text>
                        <Text>
                          {event.startTime || event.start_time} - {event.endTime || event.end_time}
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
                        <Text>
                          {registeredCount} / {capacity} registered
                        </Text>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="registration-progress" style={{ marginTop: 20 }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}
                  >
                    <Text strong>Registration Progress</Text>
                    <Text type="secondary">{spotsRemaining} spots remaining</Text>
                  </div>
                  <Progress
                    percent={Math.round((registeredCount / capacity) * 100)}
                    status={isFull ? "exception" : "active"}
                    strokeColor={{
                      from: "#108ee9",
                      to: isFull ? "#ff4d4f" : "#87d068",
                    }}
                  />
                  {role === "admin" && (
                    <Button
                      type="link"
                      icon={<UsergroupAddOutlined />}
                      onClick={() => setRegistrationsModalVisible(true)}
                      style={{ padding: 0, marginTop: 8 }}
                    >
                      View All Registrations ({registeredCount})
                    </Button>
                  )}
                </div>
              </Card>

              {/* Agenda Section */}
              {event.agenda && (
                <Card title="Event Agenda" className="agenda-card">
                  <List
                    dataSource={typeof event.agenda === "string" ? event.agenda.split("\n") : event.agenda}
                    renderItem={(item, index) => {
                      const hasTimeFormat = item.includes(" - ")
                      const timePart = hasTimeFormat ? item.split(" - ")[0] : `Item ${index + 1}`
                      const contentPart = hasTimeFormat ? item.split(" - ")[1] : item

                      return (
                        <List.Item className="agenda-item">
                          <div className="agenda-time">
                            <Text strong>{timePart}</Text>
                          </div>
                          <div className="agenda-content">
                            <Text>{contentPart}</Text>
                          </div>
                        </List.Item>
                      )
                    }}
                  />
                </Card>
              )}

              {/* Speakers Section */}
              {event.speakers && (
                <Card title="Featured Speakers" className="speakers-card">
                  <Row gutter={[16, 16]}>
                    {event.speakers.map((speaker, index) => (
                      <Col span={8} key={index}>
                        <div className="speaker-card">
                          <Avatar size={64} icon={<UserOutlined />} />
                          <div className="speaker-info">
                            <Text strong>{speaker.name}</Text>
                            <Text type="secondary">{speaker.role}</Text>
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
                    {event.price === 0 ? "FREE" : `₱${Number(event.price).toLocaleString()}`}
                  </Title>

                  {event.earlyBirdPrice && isEarlyBirdAvailable(event) && (
                    <div className="early-bird-pricing">
                      <Text delete type="secondary">
                        ₱{Number(event.price).toLocaleString()}
                      </Text>

                      <Text
                        strong
                        style={{
                          color: "#ff4d4f",
                          fontSize: "20px",
                        }}
                      >
                        ₱{Number(event.earlyBirdPrice).toLocaleString()}
                      </Text>

                      <Tag color="red">Early Bird</Tag>
                    </div>
                  )}
                </div>

                {role === "alumni" && event.status === "upcoming" && (
                  <>
                    {isRegistered ? (
                      <Space direction="vertical" style={{ width: "100%", marginTop: 16 }}>
                        <Button
                          type="primary"
                          size="large"
                          block
                          icon={<CheckCircleOutlined />}
                          style={{ background: "#52c41a", borderColor: "#52c41a" }}
                          disabled
                        >
                          Registered
                        </Button>
                        <Button type="default" size="large" block danger onClick={handleCancelRegistration}>
                          Cancel Registration
                        </Button>
                      </Space>
                    ) : (
                      <Button
                        type="primary"
                        size="large"
                        block
                        onClick={handleRegister}
                        disabled={isFull || isLoadingRegistrationStatus}
                        loading={isRegistering}
                        className="register-btn"
                        style={{ marginTop: 16 }}
                      >
                        {isFull ? "Fully Booked" : "Register Now"}
                      </Button>
                    )}
                  </>
                )}

                {isFull && !isRegistered && (
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
                    <Avatar size="large" src={event.organizerAvatar} icon={<UserOutlined />} />
                    <div className="organizer-info">
                      <Text strong>Hosted by {event.organizer}</Text>
                      <Text type="secondary">Event Organizer</Text>
                    </div>
                  </div>
                  <div className="organizer-actions">
                    <Tooltip title="Call">
                      <Button
                        type="text"
                        icon={<PhoneFilled />}
                        size="small"
                        onClick={() => setPhoneModalVisible(true)}
                      />
                    </Tooltip>
                    <Tooltip title="Email">
                      <Button
                        type="text"
                        icon={<MailFilled />}
                        size="small"
                        onClick={() => setEmailModalVisible(true)}
                      />
                    </Tooltip>
                    <Tooltip title="Message">
                      <Button
                        type="text"
                        icon={<MessageOutlined />}
                        size="small"
                        onClick={() => setMessengerModalVisible(true)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </Card>

              {/* Event Tags */}
              <Card title="Event Tags" className="tags-card">
                <div className="event-tags-detailed">
                  {event.tags.map((tag) => (
                    <Tag key={tag} className="event-tag-detailed">
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
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {/* Health & Hygiene */}
                  <div className="guideline-category">
                    <div className="category-header">
                      <HeartOutlined style={{ color: "#ff4d4f" }} />
                      <Text strong>Health & Hygiene</Text>
                    </div>
                    <div className="guideline-item">
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>Hand sanitizing stations throughout venue</Text>
                    </div>
                    <div className="guideline-item">
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>Enhanced cleaning between sessions</Text>
                    </div>
                    <div className="guideline-item">
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>Medical staff and first aid available</Text>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="guideline-category">
                    <div className="category-header">
                      <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
                      <Text strong>Security & Safety</Text>
                    </div>
                    <div className="guideline-item">
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>Professional security personnel on duty</Text>
                    </div>
                    <div className="guideline-item">
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>Bag checks and metal detection at entrance</Text>
                    </div>
                    <div className="guideline-item">
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text>Emergency evacuation procedures in place</Text>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <Alert
                    message="Important Notice"
                    description="By attending this event, you agree to comply with all safety guidelines."
                    type="warning"
                    showIcon
                    closable
                  />
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Contact Modals */}
        <Modal
          title={
            <Space>
              <PhoneFilled style={{ color: "#1890ff", fontSize: "20px" }} />
              <span>Contact via Phone</span>
            </Space>
          }
          open={phoneModalVisible}
          onCancel={() => setPhoneModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setPhoneModalVisible(false)}>
              Close
            </Button>,
            <Button key="call" type="primary" icon={<PhoneOutlined />} href={`tel:${contactInfo.phone}`}>
              Call Now
            </Button>,
          ]}
        >
          <div style={{ padding: "20px 0" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Contact Person</Text>
                <Title level={4} style={{ margin: "8px 0" }}>
                  {contactInfo.title}
                </Title>
              </div>
              <div>
                <Text type="secondary">Phone Number</Text>
                <Title level={3} style={{ margin: "8px 0", color: "#1890ff" }}>
                  {contactInfo.phone}
                </Title>
              </div>
              <Alert
                message="Available Hours"
                description="Monday - Friday: 8:00 AM - 5:00 PM"
                type="info"
                showIcon
                icon={<ClockCircleOutlined />}
              />
            </Space>
          </div>
        </Modal>

        <Modal
          title={
            <Space>
              <MailFilled style={{ color: "#52c41a", fontSize: "20px" }} />
              <span>Contact via Email</span>
            </Space>
          }
          open={emailModalVisible}
          onCancel={() => setEmailModalVisible(false)}
          footer={[
            <Button
              key="copy"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(contactInfo.email)
                message.success("Email copied to clipboard!")
              }}
            >
              Copy Email
            </Button>,
            <Button key="close" onClick={() => setEmailModalVisible(false)}>
              Close
            </Button>,
            <Button key="email" type="primary" icon={<MailFilled />} href={`mailto:${contactInfo.email}`}>
              Send Email
            </Button>,
          ]}
        >
          <div style={{ padding: "20px 0" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Contact Person</Text>
                <Title level={4} style={{ margin: "8px 0" }}>
                  {contactInfo.title}
                </Title>
              </div>
              <div>
                <Text type="secondary">Email Address</Text>
                <Title level={4} style={{ margin: "8px 0", color: "#52c41a" }}>
                  {contactInfo.email}
                </Title>
              </div>
              <Alert
                message="Response Time"
                description="We typically respond within 24-48 hours during business days."
                type="success"
                showIcon
                icon={<InfoCircleOutlined />}
              />
            </Space>
          </div>
        </Modal>

        <Modal
          title={
            <Space>
              <MessageOutlined style={{ color: "#0084ff", fontSize: "20px" }} />
              <span>Contact via Messenger</span>
            </Space>
          }
          open={messengerModalVisible}
          onCancel={() => setMessengerModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setMessengerModalVisible(false)}>
              Close
            </Button>,
            <Button
              key="messenger"
              type="primary"
              icon={<MessageOutlined />}
              href={contactInfo.messenger}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Messenger
            </Button>,
          ]}
        >
          <div style={{ padding: "20px 0" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Contact Person</Text>
                <Title level={4} style={{ margin: "8px 0" }}>
                  {contactInfo.title}
                </Title>
              </div>
              <div>
                <Text type="secondary">Facebook Messenger</Text>
                <Paragraph style={{ margin: "8px 0" }}>
                  Click the button below to start a conversation on Facebook Messenger.
                </Paragraph>
              </div>
              <Alert
                message="Instant Messaging"
                description="Get quick responses to your inquiries through Facebook Messenger during office hours."
                type="info"
                showIcon
                icon={<MessageOutlined />}
              />
            </Space>
          </div>
        </Modal>
      </Modal>

      <RegistrationsModal
        event={event}
        visible={registrationsModalVisible}
        onClose={() => setRegistrationsModalVisible(false)}
      />
    </>
  )
}

const EventCard = ({ event, showEventDetails, onEdit, onDelete }) => {
  const role = secureLocalStorage.getItem("userRole")
  const [registrationsModalVisible, setRegistrationsModalVisible] = useState(false)

  const handleMenuClick = ({ key }) => {
    if (key === "delete") {
      Modal.confirm({
        title: "Delete Event",
        icon: <ExclamationCircleOutlined />,
        content: "Are you sure you want to delete this event? This action cannot be undone.",
        okText: "Yes, Delete",
        okType: "danger",
        cancelText: "Cancel",
        onOk() {
          onDelete(event)
        },
      })
    } else if (key === "edit") {
      if (event.status === "ongoing" || event.status === "completed") {
        message.warning("Cannot edit ongoing or completed events")
        return
      }
      onEdit(event)
    } else if (key === "registrations") {
      setRegistrationsModalVisible(true)
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        disabled={event.status === "ongoing" || event.status === "completed"}
      >
        Edit Event
      </Menu.Item>
      <Menu.Item key="registrations" icon={<UsergroupAddOutlined />}>
        View Registrations
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
        Delete Event
      </Menu.Item>
    </Menu>
  )

  const registeredCount = event.registered_count || event.registered || 0
  const capacity = event.capacity || 0

  return (
    <>
      <Badge.Ribbon text="Featured" color="red" style={{ display: event.featured ? "block" : "none" }}>
        <Card
          className={`event-card ${event.featured ? "has-featured" : ""}`}
          cover={
            <div className="event-cover">
              {event.image_urls?.map((img, i) => (
                <img key={i} alt={event.title} src={img || "/placeholder.svg"} />
              ))}
              <div className="event-cover-overlay">
                <div className="event-type-tag">
                  <Tag color={getEventTypeConfig(event.eventType || event.event_type).color} style={{ fontSize: 10 }}>
                    {getEventTypeConfig(event.eventType || event.event_type).label}
                  </Tag>
                </div>
              </div>
              <div className="event-status-badge">{getStatusTag(event.status)}</div>
            </div>
          }
          actions={[
            <Tooltip title="View Details" key="view">
              <EyeOutlined onClick={() => showEventDetails(event)} />
            </Tooltip>,
            ...(role === "admin"
              ? [
                  <Tooltip title={`${registeredCount} Registered`} key="registrations">
                    <Badge count={registeredCount} size="small" offset={[5, 0]}>
                      <UsergroupAddOutlined onClick={() => setRegistrationsModalVisible(true)} />
                    </Badge>
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

            <Paragraph ellipsis={{ rows: 2 }} className="event-description">
              {event.description}
            </Paragraph>

            <div className="event-organizer">
              <Avatar size="small" icon={<UserOutlined />} />
              <Text type="secondary">Hosted by {event.organizer}</Text>
            </div>

            <Divider />

            <div style={{ marginBottom: 12 }}>
              <Space size={4} wrap>
                <Tag color={getEventTypeConfig(event.eventType || event.event_type).color} style={{ fontSize: 10 }}>
                  {getEventTypeConfig(event.eventType || event.event_type).label}
                </Tag>

                <Tag color="blue" style={{ fontSize: 10 }}>
                  {getCategoryLabel(event.category)}
                </Tag>
              </Space>
            </div>

            <div className="event-details">
              <div className="detail-item">
                <CalendarOutlined />
                <Text>{moment(event.date).format("MMM DD, YYYY")}</Text>
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
                <Text ellipsis={{ tooltip: event.location }}>{event.location}</Text>
              </div>
              <div className="detail-item">
                <TeamOutlined />
                <Text>
                  {registeredCount} / {capacity} registered
                </Text>
              </div>
            </div>

            <div style={{ marginTop: 12, marginBottom: 12 }}>
              <Progress
                percent={Math.round((registeredCount / capacity) * 100)}
                size="small"
                status={registeredCount >= capacity ? "exception" : "active"}
                showInfo={false}
              />
            </div>

            <div className="event-pricing">
              <Text strong className="regular-price">
                {Number.parseFloat(event.price) === 0 ? "FREE" : `₱${Number(event.price).toLocaleString()}`}
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

      <RegistrationsModal
        event={event}
        visible={registrationsModalVisible}
        onClose={() => setRegistrationsModalVisible(false)}
      />
    </>
  )
}

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
  }
  const config = statusConfig[status] || { color: "default", text: status }
  return (
    <Tag color={config.color} icon={config.icon}>
      {config.text}
    </Tag>
  )
}

const normalizeTime = (t) => {
  if (!t) return null
  // Parse both 12-hour (h:mm A) and 24-hour (HH:mm:ss) formats
  const parsed = dayjs(t, ["h:mm A", "hh:mm A", "H:mm", "HH:mm", "HH:mm:ss"], true)
  if (!parsed.isValid()) {
    console.warn("Invalid time format:", t)
    return null
  }
  return parsed.format("HH:mm") // Return in 24-hour format for consistent parsing
}

const computeEventStatus = (event) => {
  const now = dayjs()

  const startTime = normalizeTime(event.start_time)
  const endTime = normalizeTime(event.end_time)

  if (!startTime || !endTime) {
    console.warn("Missing time data:", event)
    return "upcoming"
  }

  // Parse date and combine with time in 24-hour format
  const eventDate = dayjs(event.date).format("YYYY-MM-DD")
  const start = dayjs(`${eventDate} ${startTime}`, "YYYY-MM-DD HH:mm")
  const end = dayjs(`${eventDate} ${endTime}`, "YYYY-MM-DD HH:mm")

  // Debug logging
  console.log("Event Status Calculation:", {
    title: event.title,
    date: event.date,
    eventDate,
    startTime: event.start_time,
    endTime: event.end_time,
    normalizedStart: startTime,
    normalizedEnd: endTime,
    parsedStart: start.format("YYYY-MM-DD HH:mm"),
    parsedEnd: end.format("YYYY-MM-DD HH:mm"),
    currentTime: now.format("YYYY-MM-DD HH:mm"),
    isStartValid: start.isValid(),
    isEndValid: end.isValid(),
    isBeforeStart: now.isBefore(start),
    isBetween: now.isBetween(start, end, null, "[]"),
    isAfterEnd: now.isAfter(end),
  })

  if (!start.isValid() || !end.isValid()) {
    console.warn("Invalid event date/time:", event)
    return "upcoming"
  }

  if (now.isBefore(start)) return "upcoming"
  if (now.isBetween(start, end, null, "[]")) return "ongoing"
  return "completed"
}

const AlumniEvents = () => {
  const { isLoading, data: rawEvents = [], isFetching, refetch: fetchEvents } = useEvents()

  const [now, setNow] = useState(dayjs())
  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 60000)
    return () => clearInterval(interval)
  }, [])

  const events = useMemo(() => {
    return rawEvents.map((e) => ({
      ...e,
      status: computeEventStatus(e),
    }))
  }, [rawEvents, now])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents() // Refresh events from server
    }, 60000) // 1 minute

    return () => clearInterval(interval)
  }, [fetchEvents])

  //const [events, setEvents] = useState(initialEvents);
  const [viewMode, setViewMode] = useState("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const role = secureLocalStorage.getItem("userRole")
  const [fileList, setFileList] = useState([])

  const selectedDate = Form.useWatch("date", form)

  // Trigger re-render every minute for real-time disabling

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 60000)
    return () => clearInterval(interval)
  }, [])

  const disabledTime = () => {
    if (!selectedDate) return {}

    if (dayjs(selectedDate).isSame(now, "day")) {
      const disabledHours = []
      for (let i = 0; i < now.hour(); i++) disabledHours.push(i)

      const disabledMinutes = (hour) => (hour === now.hour() ? Array.from({ length: now.minute() }, (_, i) => i) : [])

      return { disabledHours: () => disabledHours, disabledMinutes }
    }

    return {}
  }

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    eventType: "all",
    category: "all",
    status: "all",
    priceRange: "all",
    featured: "all",
    dateRange: null,
  })

  const [sortBy, setSortBy] = useState("date-asc")

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEvents()
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [fetchEvents])

  const showEventDetails = (event) => {
    console.log({ event })
    setSelectedEvent(event)
    setIsDetailModalVisible(true)
  }

  const handleCloseDetails = () => {
    setIsDetailModalVisible(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = async (event) => {
    try {
      const response = await axiosConfig.delete(`/events/${event.id}`)

      if (response.data.success) {
        message.success("Event deleted successfully!")
        setIsDetailModalVisible(false)
        setSelectedEvent(null)
        fetchEvents()
      }
    } catch (error) {
      message.error("Failed to delete event")
      console.error("Event deletion error:", error)
    }
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setIsDetailModalVisible(false)
    setIsModalVisible(true)

    const existingImages =
      event.image_urls?.map((url, index) => ({
        uid: `existing-${index}`,
        name: `Image ${index + 1}`,
        status: "done",
        url: url,
        thumbUrl: url,
      })) || []

    setFileList(existingImages)

    // Pre-fill the form with event data for editing
    form.setFieldsValue({
      title: event.title,
      description: event.description,
      event_type: event.event_type || event.eventType,
      category: event.category,
      date: moment(event.date),
      timeRange: [
        moment(event.start_time || event.startTime, "HH:mm"),
        moment(event.end_time || event.endTime, "HH:mm"),
      ],
      location: event.location,
      price: event.price,
      capacity: event.capacity,
      organizer: event.organizer,
      tags: event.tags,
      agenda: typeof event.agenda === "string" ? event.agenda : event.agenda?.join("\n"),
      featured: event.featured || false,
      earlyBirdPrice: event.earlyBirdPrice,
      earlyBirdEndDate: event.earlyBirdEndDate ? moment(event.earlyBirdEndDate) : null,
    })
  }

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events
      .filter((event) => {
        if (activeTab === "featured") {
          // Featured tab - only show featured events
          if (!event.featured) return false
        } else if (activeTab !== "all") {
          // Status tabs (upcoming, ongoing, completed) - filter by status
          if (event.status !== activeTab) return false
        }

        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          return (
            event.title.toLowerCase().includes(searchLower) ||
            event.description.toLowerCase().includes(searchLower) ||
            event.location.toLowerCase().includes(searchLower) ||
            event.organizer.toLowerCase().includes(searchLower) ||
            (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(searchLower))) // Added check for event.tags
          )
        }

        return true
      })
      .filter((event) => {
        // Event type filter
        if (filters.eventType !== "all" && (event.eventType || event.event_type) !== filters.eventType) {
          return false
        }

        // Category filter
        if (filters.category !== "all" && event.category !== filters.category) {
          return false
        }

        // Status filter
        if (filters.status !== "all" && event.status !== filters.status) {
          return false
        }

        // Price range filter
        if (filters.priceRange !== "all") {
          switch (filters.priceRange) {
            case "free":
              if (event.price !== 0) return false
              break
            case "0-50":
              if (event.price === 0 || event.price > 50) return false
              break
            case "50-100":
              if (event.price < 50 || event.price > 100) return false
              break
            case "100-200":
              if (event.price < 100 || event.price > 200) return false
              break
            case "200+":
              if (event.price < 200) return false
              break
            default:
              break
          }
        }

        // Featured filter
        if (filters.featured !== "all") {
          const isFeatured = filters.featured === "featured"
          if (event.featured !== isFeatured) return false
        }

        // Date range filter
        // Date range filter
        if (filters.dateRange && filters.dateRange.length === 2) {
          const eventDate = moment(event.date || event.event_date)
          const startDate = filters.dateRange[0]
          const endDate = filters.dateRange[1]

          if (!eventDate.isBetween(startDate, endDate, "day", "[]")) {
            return false
          }
        }

        return true
      })

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return moment(a.date).diff(moment(b.date))
        case "date-desc":
          return moment(b.date).diff(moment(a.date))
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating-desc":
          return b.rating - a.rating
        case "popularity":
          return b.registered - a.registered
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "capacity":
          return a.capacity - a.registered - (b.capacity - b.registered)
        default:
          return 0
      }
    })

    return filtered
  }, [events, activeTab, filters, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      eventType: "all",
      category: "all",
      status: "all",
      priceRange: "all",
      featured: "all",
      dateRange: null,
    })
  }

  const showCreateModal = () => {
    setIsModalVisible(true)
    setCurrentStep(0)
    setSelectedEvent(null)
    form.resetFields()
    setFileList([])
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setSelectedEvent(null)
    setFileList([])
  }

  const handleCreateEvent = async (values) => {
    try {
      const formData = new FormData()

      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("event_type", values.event_type)
      formData.append("category", values.category)
      formData.append("date", values.date.format("YYYY-MM-DD"))
      formData.append("timeRange[0]", values.timeRange[0].format("HH:mm"))
      formData.append("timeRange[1]", values.timeRange[1].format("HH:mm"))
      formData.append("location", values.location)
      formData.append("price", values.price || 0)
      formData.append("capacity", values.capacity)
      formData.append("organizer", values.organizer)
      formData.append("agenda", values.agenda || "")
      formData.append("earlyBirdPrice", values.earlyBirdPrice || 0)
      if (values.earlyBirdEndDate) {
        formData.append("earlyBirdEndDate", values.earlyBirdEndDate.format("YYYY-MM-DD"))
      }

      // ⭐ THE IMPORTANT PART ⭐
      formData.append("featured", values.featured ? 1 : 0)

      // Handle tags
      if (values.tags && values.tags.length > 0) {
        values.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag)
        })
      }

      // Handle new uploaded images
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          // New file being uploaded
          formData.append(`images[]`, file.originFileObj)
        }
      })

      let response
      if (selectedEvent) {
        // Update existing event
        response = await axiosConfig.post(`/events/${selectedEvent.id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        // Create new event
        response = await axiosConfig.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      if (response.data.success) {
        message.success(response.data.message || "Event saved successfully!")
        setIsModalVisible(false)
        form.resetFields()
        setFileList([])
        setSelectedEvent(null)
        fetchEvents()
      }
    } catch (error) {
      console.error("Error creating/updating event:", error)
      message.error(error.response?.data?.message || "Failed to save event")
    }
  }

  const getRegistrationProgress = (registered, capacity) => {
    return (registered / capacity) * 100
  }

  const stats = {
    total: events.length,
    upcoming: events.filter((e) => e.status === "upcoming").length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    completed: events.filter((e) => e.status === "completed").length,
    featured: events.filter((e) => e.featured).length,
    totalRegistrations: events.reduce((sum, event) => sum + event.registered, 0),
  }

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/")
    if (!isImage) {
      message.error("You can only upload image files!")
      return Upload.LIST_IGNORE
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!")
      return Upload.LIST_IGNORE
    }
    return false
  }

  return (
    <Layout>
      <div className="alumni-dashboard">
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
        </Card>

        {/* Status Tabs */}
        <Card className="tabs-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab} className="status-tabs">
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
                      backgroundColor: "#8c8c8c",
                      marginLeft: 8,
                    }}
                  />
                </span>
              }
              key="completed"
            />
            <TabPane
              tab={
                <span>
                  <StarOutlined />
                  Featured
                  <Badge
                    count={stats.featured}
                    style={{
                      backgroundColor: "#faad14",
                      marginLeft: 8,
                    }}
                  />
                </span>
              }
              key="featured"
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
                {eventTypes.map((type) => (
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
                {eventCategories.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="controls-right">
              {role === "admin" && (
                <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} size="large">
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
                <Text type="secondary">Try adjusting your filters or create a new event to get started.</Text>
                <br />
                <Button type="primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredAndSortedEvents.map((event) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
                  <EventCard
                    event={event}
                    showEventDetails={(event) => showEventDetails(event)}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Create/Edit Event Modal */}
        <Modal
          title={selectedEvent ? "Edit Event" : "Create New Event"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={900}
          className="create-event-modal"
          style={{ top: 20 }}
        >
          <div className="event-form-container">
            <Form form={form} layout="vertical" onFinish={handleCreateEvent} className="event-form-full">
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
                          message: "Please enter event title",
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter a compelling event title" className="form-input" />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Event Description"
                      rules={[
                        {
                          required: true,
                          message: "Please enter event description",
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
                              message: "Please select event type",
                            },
                          ]}
                        >
                          <Select size="large" placeholder="Select event type">
                            {eventTypes
                              .filter((et) => et.value !== "all")
                              .map((type) => (
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
                          rules={[
                            {
                              required: true,
                              message: "Please select category",
                            },
                          ]}
                        >
                          <Select size="large" placeholder="Select category">
                            {eventCategories
                              .filter((ec) => ec.value !== "all")
                              .map((category) => (
                                <Option key={category.value} value={category.value}>
                                  {category.label}
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
                          rules={[{ required: true, message: "Please select event date" }]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            size="large"
                            disabledDate={(current) => current && current < dayjs().startOf("day")}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name="timeRange"
                          label="Event Time"
                          rules={[{ required: true, message: "Please select event time" }]}
                        >
                          <TimePicker.RangePicker
                            style={{ width: "100%" }}
                            size="large"
                            format="hh:mm A"
                            disabledTime={disabledTime}
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
                          message: "Please enter event location",
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
                            formatter={(value) => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/₱\s?|(,*)/g, "")}
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
                              message: "Please enter event capacity",
                            },
                            {
                              type: "number",
                              max: 50,
                              message: "Capacity cannot exceed 50",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Capacity must be at least 1",
                            },
                          ]}
                        >
                          <InputNumber
                            style={{ width: "100%" }}
                            size="large"
                            min={1}
                            max={50}
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
                              message: "Please enter organizer name",
                            },
                          ]}
                        >
                          <Input placeholder="Organizer name" size="large" className="form-input" />
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

                {/* Early Bird Pricing Section */}
                <div className="form-section">
                  <div className="section-header">
                    <h3>Early Bird Pricing (Optional)</h3>
                    <div className="section-divider"></div>
                  </div>
                  <div className="section-content">
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item name="earlyBirdPrice" label="Early Bird Price (₱)">
                          <InputNumber
                            style={{ width: "100%" }}
                            size="large"
                            min={0}
                            placeholder="0"
                            className="form-input-number"
                            formatter={(value) => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            parser={(value) => value.replace(/₱\s?|(,*)/g, "")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="earlyBirdEndDate" label="Early Bird End Date">
                          <DatePicker
                            style={{ width: "100%" }}
                            size="large"
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current < dayjs().endOf("day")}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
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
                        <Form.Item name="featured" label="Featured Event" valuePropName="checked" initialValue={false}>
                          <Switch checkedChildren="Featured" unCheckedChildren="Regular" className="featured-switch" />
                        </Form.Item>

                        <span className="switch-label">
                          Mark this event as featured to highlight it on the platform
                        </span>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="images" label="Event Images">
                          <Upload
                            listType="picture-card"
                            multiple
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={handleBeforeUpload}
                            className="event-images-upload"
                          >
                            {fileList.length >= 8 ? null : (
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
                            )}
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>

              <div className="form-actions-full">
                <Button onClick={handleCancel} className="cancel-btn">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={selectedEvent ? <EditOutlined /> : <PlusOutlined />}
                  className="submit-btn"
                  size="large"
                >
                  {selectedEvent ? "Update Event" : "Create Event"}
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
        onRefresh={fetchEvents}
      />
    </Layout>
  )
}

export default AlumniEvents
