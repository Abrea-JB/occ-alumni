"use client"

import React, { useState, useEffect } from "react"
import {
  GroupOutlined,
  UserOutlined,
  CalendarOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  TeamOutlined,
  BellOutlined,
  EyeInvisibleOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  SettingOutlined,
  SoundOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  FormOutlined,
  WarningOutlined,
  AppstoreOutlined,
  UserAddOutlined,
  IdcardOutlined,
} from "@ant-design/icons"
import {
  Layout,
  Menu,
  Tooltip,
  Avatar,
  Dropdown,
  Row,
  Col,
  Drawer,
  Button,
  List,
  Badge,
  Spin,
  Typography,
  Space,
  message,
  Modal,
  Switch,
  Pagination,
  Empty,
  Popconfirm,
  Image,
  Tag,
} from "antd"
import { Link, useLocation } from "react-router-dom"
import logoMini from "../../assets/images/site-logo.png"
import { setCookie } from "~/utils/helper"
import secureLocalStorage from "react-secure-storage"
import { useQueryClient } from "react-query"
import useProfile from "~/hooks/useProfile"
import { useHistory } from "react-router-dom"
import axiosConfig from "~/utils/axiosConfig"
import "./index.css"
import { AlumniDetails } from "~/components"
import avatarGuidance from "~/assets/images/avatar_guidance.png"
import avatarBSIT from "~/assets/images/bsit-logo.jpg"
import avatarBSED from "~/assets/images/educ-logo.png"
import avatarBEED from "~/assets/images/beed-logo.png"
import avatarBSBA from "~/assets/images/bsba-logo.png"

const { Header, Sider, Content, Footer } = Layout
const { Text, Title } = Typography

const MENU_ADMIN = [
  {
    key: 10,
    url: "/admin-dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined className="menu-icon" />,
  },
  {
    key: 120,
    url: "/alumni",
    label: "Alumni",
    icon: <TeamOutlined className="menu-icon" />,
  },
  {
    key: 121,
    url: "/events",
    label: "Events",
    icon: <CalendarOutlined className="menu-icon" />,
  },
  {
    key: 122,
    url: "/questions",
    label: "Questions",
    icon: <QuestionCircleOutlined className="menu-icon" />,
  },
  {
    key: 123,
    url: "/department-heads",
    label: "Create D.H.A",
    icon: <UserAddOutlined className="menu-icon" />,
  },
]

const MENU_ALUMNI = [
  {
    key: 120,
    url: "/alumni",
    label: "Alumni",
    icon: <TeamOutlined className="menu-icon" />,
  },
  {
    key: 121,
    url: "/events",
    label: "Events",
    icon: <CalendarOutlined className="menu-icon" />,
  },
  {
    key: 122,
    url: "/profile",
    label: "Profile",
    icon: <GroupOutlined className="menu-icon" />,
  },
]

const MENU_DEPARTMENT_HEAD = [
  {
    key: 10,
    url: "/department-dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined className="menu-icon" />,
  },
]

const NOTIFICATION_CATEGORIES = {
  all: {
    label: "All",
    icon: <AppstoreOutlined />,
    color: "#1890ff",
    types: [],
  },
  event_registration: {
    label: "Event Registered",
    icon: <CalendarOutlined />,
    color: "#52c41a",
    types: ["event_registration", "new_event"],
  },
  profile_update: {
    label: "Profile Updates",
    icon: <EditOutlined />,
    color: "#722ed1",
    types: ["profile_update"],
  },
  account_login: {
    label: "Login Activity",
    icon: <LoginOutlined />,
    color: "#13c2c2",
    types: ["login", "login_success", "account_login"],
  },
  account_approved: {
    label: "Account Approved",
    icon: <SafetyCertificateOutlined />,
    color: "#faad14",
    types: ["account_approved", "approved", "approval"],
  },
  quiz_submission: {
    label: "Quiz Submissions",
    icon: <FormOutlined />,
    color: "#eb2f96",
    types: ["quiz_submission", "rating_quiz", "abcd_quiz", "quiz"],
  },
  login_attempt: {
    label: "Login Attempts",
    icon: <WarningOutlined />,
    color: "#ff4d4f",
    types: ["login_attempt", "failed_login", "suspicious_login"],
  },
  department_head_login: {
    label: "Dept. Head Login",
    icon: <IdcardOutlined />,
    color: "#9254de",
    types: ["department_head_login"],
  },
}

const MainLayout = ({ children, breadcrumb }) => {
  const queryClient = useQueryClient()
  const { data: profile } = useProfile()
  const { pathname } = useLocation()
  const history = useHistory()
  const basePath = "/" + pathname.split("/").filter(Boolean)[0]
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [alumniQuizzes, setQuizzes] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [animateBell, setAnimateBell] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [allNotifications, setAllNotifications] = useState([])
  const [filterUnread, setFilterUnread] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)
  const [allNotificationsModalVisible, setAllNotificationsModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [perPage] = useState(10)
  const [modalPerPage] = useState(50) // For modal - show more per page
  const [loadingMore, setLoadingMore] = useState(false)
  const [alumniDetailsVisible, setAlumniDetailsVisible] = useState(false)
  const [alumniPreviewData, setAlumniPreviewData] = useState(null)
  const [alumniDetailsLoading, setAlumniDetailsLoading] = useState(false)
  const [eventRegistrationsModalVisible, setEventRegistrationsModalVisible] = useState(false)
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState(null)
  const [eventRegistrations, setEventRegistrations] = useState([])
  const [eventRegistrationsLoading, setEventRegistrationsLoading] = useState(false)
  const [eventDetailsModalVisible, setEventDetailsModalVisible] = useState(false)
  const [selectedEventDetails, setSelectedEventDetails] = useState(null)
  const [eventDetailsLoading, setEventDetailsLoading] = useState(false)

  const logout = () => {
    localStorage.removeItem("access_token")
    secureLocalStorage.removeItem("userRole")
    secureLocalStorage.removeItem("courseId")
    setCookie(["userLogin", ""])
    window.location = "/login"
  }

  const getDepartmentHeadAvatar = () => {
    const courseId = secureLocalStorage.getItem("courseId")
    switch (courseId) {
      case 1:
      case "1":
        return avatarBSIT
      case 2:
      case "2":
        return avatarBSED
      case 3:
      case "3":
        return avatarBEED
      case 4:
      case "4":
        return avatarBSBA
      default:
        return avatarGuidance
    }
  }

  const [userData, setUserData] = useState(() => {
    const role = secureLocalStorage.getItem("userRole")
    return {
      name: secureLocalStorage.getItem("name") || "User Name",
      email: secureLocalStorage.getItem("email") || "",
      avatar: role === "department_head" ? getDepartmentHeadAvatar() : avatarGuidance,
      role: role || "user",
    }
  })

  useEffect(() => {
    if (profile?.alumni) {
      const fullName = `${profile.alumni.first_name || "User"} ${profile.alumni.last_name || "Name"}`

      setUserData((prev) => ({
        ...prev,
        name: fullName,
        email: profile.alumni.email || prev.email,
        avatar: profile.alumni.profile_image_url || prev.avatar,
      }))

      secureLocalStorage.setItem("name", fullName)
      secureLocalStorage.setItem("email", profile.alumni.email || "")
    }
  }, [profile])

  useEffect(() => {
    const role = secureLocalStorage.getItem("userRole")
    if (role === "department_head") {
      setUserData((prev) => ({
        ...prev,
        avatar: getDepartmentHeadAvatar(),
      }))
    }
  }, [])

  const [settings, setSettings] = useState({
    emailNotifications: true,
    soundEnabled: false,
    darkMode: false,
  })

  const handleSettingsChange = async (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    const updatedSettings = { ...settings, [key]: value }
    localStorage.setItem("notificationSettings", JSON.stringify(updatedSettings))
    message.success(`Setting updated successfully`)
  }

  useEffect(() => {
    const savedSettings = localStorage.getItem("notificationSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse notification settings")
      }
    }
  }, [])

  let menus = []
  const role = secureLocalStorage.getItem("userRole")
  if (role === "admin") {
    menus = MENU_ADMIN
  } else if (role === "alumni") {
    menus = MENU_ALUMNI
  } else if (role === "department_head") {
    menus = MENU_DEPARTMENT_HEAD
  } else if (role === "faculty") {
    // menus = MENU_FACULTY;
  }

  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const getNotificationData = (notification) => {
    if (!notification.data) return {}
    if (typeof notification.data === "string") {
      try {
        return JSON.parse(notification.data)
      } catch (e) {
        console.error("Failed to parse notification data:", e)
        return {}
      }
    }
    return notification.data
  }

  const getNotificationCategory = (notification) => {
    const notificationData = getNotificationData(notification)
    const type = notification.notifiable_type || notificationData?.type || ""
    const notificationMessage = (notification.message || notificationData?.message || "").toLowerCase()
    const title = (notification.title || notificationData?.title || "").toLowerCase()

    if (
      type === "department_head_login" ||
      notificationData?.type === "department_head_login" ||
      notificationMessage.includes("department head") ||
      title.includes("department head")
    ) {
      return "department_head_login"
    }

    if (
      type === "event_registration" ||
      type === "new_event" ||
      notificationMessage.includes("event") ||
      notificationMessage.includes("registered for") ||
      title.includes("event")
    ) {
      return "event_registration"
    }

    if (
      type === "profile_update" ||
      notificationMessage.includes("profile") ||
      notificationMessage.includes("updated") ||
      title.includes("profile")
    ) {
      return "profile_update"
    }

    if (
      type === "login_attempt" ||
      type === "failed_login" ||
      notificationMessage.includes("attempt") ||
      notificationMessage.includes("failed login") ||
      notificationMessage.includes("suspicious") ||
      title.includes("attempt")
    ) {
      return "login_attempt"
    }

    if (
      type === "login" ||
      type === "login_success" ||
      type === "account_login" ||
      notificationMessage.includes("logged in") ||
      notificationMessage.includes("login") ||
      title.includes("login")
    ) {
      return "account_login"
    }

    if (
      type === "account_approved" ||
      type === "approved" ||
      type === "approval" ||
      notificationMessage.includes("approved") ||
      notificationMessage.includes("verified") ||
      title.includes("approved")
    ) {
      return "account_approved"
    }

    if (
      type === "quiz_submission" ||
      type === "rating_quiz" ||
      type === "abcd_quiz" ||
      notificationMessage.includes("quiz") ||
      notificationMessage.includes("rating") ||
      notificationMessage.includes("assessment") ||
      title.includes("quiz")
    ) {
      return "quiz_submission"
    }

    return "all"
  }

  const getCategoryInfo = (notification) => {
    const category = getNotificationCategory(notification)
    return NOTIFICATION_CATEGORIES[category] || NOTIFICATION_CATEGORIES.all
  }

  const filterNotificationsByCategory = (notificationsList) => {
    let filtered = notificationsList

    if (filterUnread) {
      filtered = filtered.filter((n) => !n.read)
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((n) => getNotificationCategory(n) === activeCategory)
    }

    return filtered
  }

  const getCategoryCounts = (notificationsList) => {
    const counts = { all: notificationsList.length }
    Object.keys(NOTIFICATION_CATEGORIES).forEach((key) => {
      if (key !== "all") {
        counts[key] = notificationsList.filter((n) => getNotificationCategory(n) === key).length
      }
    })
    return counts
  }

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await axiosConfig.get(`/notifications?page=1&per_page=${perPage}`)

      if (response.data) {
        const notificationsData = response.data.data || []
        setNotifications(notificationsData)
        if (response.data.pagination) {
          setTotalNotifications(response.data.pagination.total)
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllNotifications = async (page = 1) => {
    try {
      setLoadingMore(true)
      // Use larger per_page to get more notifications
      const response = await axiosConfig.get(`/notifications?page=${page}&per_page=${modalPerPage}`)

      if (response.data) {
        const notificationsData = response.data.data || []
        setAllNotifications(notificationsData)
        if (response.data.pagination) {
          setTotalNotifications(response.data.pagination.total)
          setCurrentPage(response.data.pagination.current_page)
        }
      }
    } catch (error) {
      console.error("Failed to fetch all notifications:", error)
      message.error("Failed to load notifications")
    } finally {
      setLoadingMore(false)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axiosConfig.delete(`/notifications/${notificationId}`)
      // Remove from dropdown notifications
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      // Remove from all notifications (modal)
      setAllNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      // Update total count
      setTotalNotifications((prev) => Math.max(0, prev - 1))
      message.success("Notification deleted")
    } catch (error) {
      console.error("Failed to delete notification:", error)
      message.error("Failed to delete notification")
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosConfig.post(`/notifications/${notificationId}/mark-read`)
      const updateRead = (prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n))
      setNotifications(updateRead)
      setAllNotifications(updateRead)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axiosConfig.post("/notifications/mark-all-read")

      if (response.data?.success) {
        const markAllRead = (prev) => prev.map((n) => ({ ...n, read: true, read_at: new Date().toISOString() }))
        setNotifications(markAllRead)
        setAllNotifications(markAllRead)
        message.success("All notifications marked as read")
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
      message.error("Failed to mark notifications as read")
    }
  }

  useEffect(() => {
    fetchNotifications()

    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length
    if (unread > 0) {
      setAnimateBell(true)
      const timeout = setTimeout(() => setAnimateBell(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [notifications])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleViewEventRegistrations = async (eventId, alumniId) => {
    if (!eventId) {
      message.error("Event ID not found")
      return
    }
    try {
      setEventRegistrationsLoading(true)
      const response = await axiosConfig.get(`/events/${eventId}/registrations`)
      if (response.data.success) {
        setEventRegistrations(response.data.data)
        setSelectedEventForRegistrations(response.data.event)
        setEventRegistrations((prev) =>
          prev.map((reg) => ({
            ...reg,
            isHighlighted: reg.alumni_id === alumniId,
          })),
        )
        setEventRegistrationsModalVisible(true)
      }
    } catch (error) {
      console.error("Failed to fetch event registrations:", error)
      message.error("Failed to load event registrations")
    } finally {
      setEventRegistrationsLoading(false)
    }
  }

  const handleViewEventDetails = async (eventId) => {
    if (!eventId) {
      message.error("Event ID not found")
      return
    }
    try {
      setEventDetailsLoading(true)
      const response = await axiosConfig.get(`/events/${eventId}`)
      if (response.data) {
        setSelectedEventDetails(response.data)
        setEventDetailsModalVisible(true)
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error)
      message.error("Failed to load event details")
    } finally {
      setEventDetailsLoading(false)
    }
  }

  const handleViewAlumniProfile = async (alumniId) => {
    try {
      setAlumniDetailsLoading(true)
      const response = await axiosConfig.get(`/alumni/${alumniId}`)
      const values = response.data?.data || response.data
      const previewData = {
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
        employment_status_id: values.employment_status_id,
        current_company: values.current_company,
        job_title: values.job_title,
        industry: values.industry,
        years_experience: values.years_experience,
        salary_range: values.salary_range,
        work_location: values.work_location,
        career_goals: values.career_goals,
        previous_companies: values.previous_companies,
        linkedin: values.linkedin,
        github: values.github,
        portfolio: values.portfolio,
        twitter: values.twitter,
        newsletter: values.newsletter,
        contactPermission: values.contactPermission,
        agreement: values.agreement,
        profileImage: values?.profile_image_url,
        idDocuments: values?.document_urls || [],
      }
      setAlumniPreviewData(previewData)
      setAlumniDetailsVisible(true)
    } catch (error) {
      console.error("Failed to fetch alumni details:", error)
      message.error("Failed to load alumni profile")
    } finally {
      setAlumniDetailsLoading(false)
    }
  }

  const NotificationItem = ({ notification }) => {
    const notificationData = getNotificationData(notification)
    const categoryInfo = getCategoryInfo(notification)

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high":
          return "#ff4d4f"
        case "medium":
          return "#faad14"
        case "low":
          return "#52c41a"
        default:
          return "#1890ff"
      }
    }

    const formatTime = (timestamp) => {
      if (!timestamp) return "Just now"
      const date = new Date(timestamp)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString()
    }

    const handleNotificationClick = () => {
      if (!notification.read) {
        handleMarkAsRead(notification.id)
      }

      if (notificationData?.type === "profile_update" && notificationData?.alumni_id) {
        setDropdownVisible(false)
        handleViewAlumniProfile(notificationData.alumni_id)
      }

      if (notification.notifiable_type === "event_registration" && notificationData?.event_id) {
        setDropdownVisible(false)
        handleViewEventRegistrations(notificationData.event_id, notificationData.alumni_id)
      }

      if (notification.notifiable_type === "new_event" && notificationData?.event_id) {
        setDropdownVisible(false)
        handleViewEventDetails(notificationData.event_id)
      }
    }

    const getAlumniAvatar = () => {
      if (
        notificationData?.type === "department_head_login" ||
        (notification.title && notification.title.toLowerCase().includes("department head")) ||
        (notification.message && notification.message.toLowerCase().includes("department head"))
      ) {
        const courseId = notificationData?.course_id
        switch (courseId) {
          case 1:
          case "1":
            return avatarBSIT
          case 2:
          case "2":
            return avatarBSED
          case 3:
          case "3":
            return avatarBEED
          case 4:
          case "4":
            return avatarBSBA
          default:
            return avatarGuidance
        }
      }

      if (notificationData?.alumni_profile_image) {
        return notificationData.alumni_profile_image
      }
      if (notificationData?.profile_image_url) {
        return notificationData.profile_image_url
      }
      if (notification.sender?.avatar) {
        return notification.sender.avatar
      }
      return null
    }

    const alumniAvatar = getAlumniAvatar()

    const getEventImage = () => {
      if (notification.notifiable_type === "new_event" && notificationData?.event_images?.length > 0) {
        return notificationData.event_images[0]
      }
      return null
    }

    const eventImage = getEventImage()

    const notificationTitle = notification.title || notificationData?.title || "Guidance Counselor (Admin)"
    const notificationMessage = notification.message || notificationData?.message || ""

    return (
      <List.Item
        style={{
          padding: "12px 16px",
          background: notification.read ? "#fff" : "#f0f7ff",
          cursor: "pointer",
          transition: "all 0.2s ease",
          borderBottom: "1px solid #f0f0f0",
          borderLeft: notification.read ? "none" : `3px solid ${getPriorityColor(notification.priority)}`,
          borderRadius: "0",
        }}
        onClick={handleNotificationClick}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {notification.notifiable_type === "new_event" && eventImage ? (
            <div style={{ marginRight: 12, flexShrink: 0 }}>
              <Image
                src={eventImage || "/placeholder.svg"}
                alt="Event"
                width={50}
                height={50}
                style={{ borderRadius: 8, objectFit: "cover" }}
                preview={false}
                fallback="/community-event.png"
              />
            </div>
          ) : (
            <Avatar
              size={40}
              src={role === "alumni" ? avatarGuidance : alumniAvatar}
              icon={!alumniAvatar && role !== "alumni" && <UserOutlined />}
              style={{
                marginRight: 12,
                background: alumniAvatar ? "transparent" : notification.read ? "#d9d9d9" : "#1890ff",
                border: alumniAvatar ? "1px solid #e8e8e8" : "none",
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 4,
                flexWrap: "wrap",
                gap: 4,
              }}
            >
              <Text strong style={{ fontSize: "13px", lineHeight: "1.3" }}>
                {notificationTitle}
              </Text>
              <Tag
                color={categoryInfo.color}
                style={{
                  fontSize: "10px",
                  padding: "0 6px",
                  borderRadius: 10,
                  lineHeight: "18px",
                  margin: 0,
                }}
              >
                {categoryInfo.icon} {categoryInfo.label}
              </Tag>
            </div>
            <Text
              style={{
                fontSize: "12px",
                color: "#666",
                lineHeight: "1.4",
                display: "block",
                marginBottom: 4,
              }}
            >
              {notificationMessage}
            </Text>
            {notification.notifiable_type === "new_event" && notificationData?.event_title && (
              <Text
                strong
                style={{
                  fontSize: "12px",
                  color: "#1890ff",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {notificationData.event_title}
              </Text>
            )}
            {notification.notifiable_type === "new_event" && notificationData?.event_id && (
              <Button
                type="link"
                size="small"
                icon={<EyeOutlined />}
                style={{ padding: 0, fontSize: "11px", height: "auto" }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!notification.read) {
                    handleMarkAsRead(notification.id)
                  }
                  setDropdownVisible(false)
                  handleViewEventDetails(notificationData.event_id)
                }}
              >
                View Details
              </Button>
            )}
            {notification.notifiable_type === "event_registration" && notificationData?.event_id && (
              <Button
                type="link"
                size="small"
                icon={<TeamOutlined />}
                style={{ padding: 0, fontSize: "11px", height: "auto" }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!notification.read) {
                    handleMarkAsRead(notification.id)
                  }
                  setDropdownVisible(false)
                  handleViewEventRegistrations(notificationData.event_id, notificationData.alumni_id)
                }}
              >
                View Registrations
              </Button>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space size="small">
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  {role === "alumni"
                    ? "Guidance Counselor (Admin)"
                    : notification.sender?.name || notificationData?.created_by || notificationData?.alumni_name || ""}
                </Text>
                {!notification.read && <Badge dot color="#1890ff" size="small" />}
              </Space>
              <Text type="secondary" style={{ fontSize: "10px" }}>
                {formatTime(notification.created_at)}
              </Text>
            </div>
          </div>
        </div>
      </List.Item>
    )
  }

  const renderSettingsModal = () => (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>Notification Settings</span>
        </Space>
      }
      open={settingsModalVisible}
      onCancel={() => setSettingsModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setSettingsModalVisible(false)}>
          Close
        </Button>,
      ]}
      width={450}
    >
      <div style={{ padding: "16px 0" }}>
        <List>
          <List.Item
            actions={[
              <Switch
                key="email"
                checked={settings.emailNotifications}
                onChange={(checked) => handleSettingsChange("emailNotifications", checked)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<MailOutlined style={{ fontSize: 20, color: "#1890ff" }} />}
              title="Email Notifications"
              description="Receive notifications via email"
            />
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key="sound"
                checked={settings.soundEnabled}
                onChange={(checked) => handleSettingsChange("soundEnabled", checked)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<SoundOutlined style={{ fontSize: 20, color: "#52c41a" }} />}
              title="Sound Notifications"
              description="Play sound when new notification arrives"
            />
          </List.Item>
          <List.Item
            actions={[
              <Switch
                key="push"
                checked={settings.pushNotifications !== false}
                onChange={(checked) => handleSettingsChange("pushNotifications", checked)}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<BellOutlined style={{ fontSize: 20, color: "#faad14" }} />}
              title="Push Notifications"
              description="Receive push notifications in browser"
            />
          </List.Item>
        </List>
      </div>
    </Modal>
  )

  const getNotificationAlumniAvatar = (notification) => {
    const currentRole = secureLocalStorage.getItem("userRole")
    if (currentRole === "alumni") {
      return avatarGuidance
    }

    const notificationData = getNotificationData(notification)

    if (
      notificationData?.type === "department_head_login" ||
      (notification.title && notification.title.toLowerCase().includes("department head")) ||
      (notification.message && notification.message.toLowerCase().includes("department head"))
    ) {
      const courseId = notificationData?.course_id
      switch (courseId) {
        case 1:
        case "1":
          return avatarBSIT
        case 2:
        case "2":
          return avatarBSED
        case 3:
        case "3":
          return avatarBEED
        case 4:
        case "4":
          return avatarBSBA
        default:
          return avatarGuidance
      }
    }

    if (notificationData?.alumni_profile_image) {
      return notificationData.alumni_profile_image
    }
    if (notificationData?.profile_image_url) {
      return notificationData.profile_image_url
    }
    if (notification.sender?.avatar) {
      return notification.sender.avatar
    }
    return null
  }

  const getNotificationEventImage = (notification) => {
    const notificationData = getNotificationData(notification)
    if (notification.notifiable_type === "new_event" && notificationData?.event_images?.length > 0) {
      return notificationData.event_images[0]
    }
    return null
  }

  const renderAllNotificationsModal = () => {
    const filteredNotifications = filterNotificationsByCategory(allNotifications)
    const categoryCounts = getCategoryCounts(allNotifications)

    return (
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: 24 }}>
            <Space>
              <BellOutlined />
              <span>All Notifications</span>
              <Badge count={totalNotifications} style={{ marginLeft: 8 }} overflowCount={9999} />
            </Space>
          </div>
        }
        open={allNotificationsModalVisible}
        onCancel={() => setAllNotificationsModalVisible(false)}
        footer={null}
        width={800}
        styles={{ body: { padding: 0 } }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <Text strong style={{ display: "block", marginBottom: 8, fontSize: 12, color: "#666" }}>
              Filter by Category:
            </Text>
            <Space wrap size={[8, 8]}>
              {Object.entries(NOTIFICATION_CATEGORIES).map(([key, category]) => (
                <Button
                  key={key}
                  size="small"
                  type={activeCategory === key ? "primary" : "default"}
                  icon={category.icon}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    borderColor: activeCategory === key ? category.color : undefined,
                    background: activeCategory === key ? category.color : undefined,
                  }}
                >
                  {category.label}
                  {categoryCounts[key] > 0 && (
                    <Badge
                      count={categoryCounts[key]}
                      size="small"
                      overflowCount={9999}
                      style={{
                        marginLeft: 6,
                        backgroundColor: activeCategory === key ? "#fff" : category.color,
                        color: activeCategory === key ? category.color : "#fff",
                      }}
                    />
                  )}
                </Button>
              ))}
            </Space>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Space>
              <Button
                size="small"
                type={filterUnread ? "primary" : "default"}
                onClick={() => setFilterUnread(!filterUnread)}
              >
                {filterUnread ? "Show All" : "Show Unread Only"}
              </Button>
              {unreadCount > 0 && (
                <Button size="small" icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </Space>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => fetchAllNotifications(currentPage)}
              loading={loadingMore}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {loadingMore ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <Spin />
              <div style={{ marginTop: 10, color: "#666" }}>Loading notifications...</div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                activeCategory !== "all"
                  ? `No ${NOTIFICATION_CATEGORIES[activeCategory].label.toLowerCase()} notifications`
                  : filterUnread
                    ? "No unread notifications"
                    : "No notifications"
              }
              style={{ padding: 40 }}
            />
          ) : (
            <List
              dataSource={filteredNotifications}
              renderItem={(notification) => {
                const alumniAvatar = getNotificationAlumniAvatar(notification)
                const eventImage = getNotificationEventImage(notification)
                const notificationData = getNotificationData(notification)
                const categoryInfo = getCategoryInfo(notification)

                const notificationTitle = notification.title || notificationData?.title || "Guidance Counselor (Admin)"
                const notificationMessage = notification.message || notificationData?.message || ""

                return (
                  <List.Item
                    style={{
                      padding: "12px 16px",
                      background: notification.read ? "#fff" : "#f0f7ff",
                      borderBottom: "1px solid #f0f0f0",
                      cursor: "pointer",
                    }}
                    actions={[
                      !notification.read && (
                        <Tooltip title="Mark as read" key="read">
                          <Button
                            type="text"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                          />
                        </Tooltip>
                      ),
                      <Popconfirm
                        key="delete"
                        title="Delete this notification?"
                        onConfirm={(e) => {
                          e?.stopPropagation()
                          handleDeleteNotification(notification.id)
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Tooltip title="Delete">
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Tooltip>
                      </Popconfirm>,
                    ].filter(Boolean)}
                    onClick={() => {
                      if (!notification.read) {
                        handleMarkAsRead(notification.id)
                      }
                      if (notificationData?.type === "profile_update" && notificationData?.alumni_id) {
                        setAllNotificationsModalVisible(false)
                        handleViewAlumniProfile(notificationData.alumni_id)
                      }
                      if (notification.notifiable_type === "event_registration" && notificationData?.event_id) {
                        setAllNotificationsModalVisible(false)
                        handleViewEventRegistrations(notificationData.event_id, notificationData.alumni_id)
                      }
                      if (notification.notifiable_type === "new_event" && notificationData?.event_id) {
                        setAllNotificationsModalVisible(false)
                        handleViewEventDetails(notificationData.event_id)
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                      {notification.notifiable_type === "new_event" && eventImage ? (
                        <div style={{ marginRight: 12, flexShrink: 0 }}>
                          <Image
                            src={eventImage || "/placeholder.svg"}
                            alt="Event"
                            width={50}
                            height={50}
                            style={{ borderRadius: 8, objectFit: "cover" }}
                            preview={false}
                            fallback="/community-event.png"
                          />
                        </div>
                      ) : (
                        <Avatar
                          size={40}
                          src={alumniAvatar}
                          icon={!alumniAvatar && <UserOutlined />}
                          style={{
                            marginRight: 12,
                            background: alumniAvatar ? "transparent" : notification.read ? "#d9d9d9" : "#1890ff",
                            border: alumniAvatar ? "1px solid #e8e8e8" : "none",
                          }}
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 4,
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          <Text strong style={{ fontSize: "13px" }}>
                            {notificationTitle}
                          </Text>
                          <Tag
                            color={categoryInfo.color}
                            style={{
                              fontSize: "10px",
                              padding: "0 6px",
                              borderRadius: 10,
                              lineHeight: "18px",
                              margin: 0,
                            }}
                          >
                            {categoryInfo.icon} {categoryInfo.label}
                          </Tag>
                        </div>
                        <Text style={{ fontSize: "12px", color: "#666", display: "block", marginBottom: 4 }}>
                          {notificationMessage}
                        </Text>
                        {notification.notifiable_type === "new_event" && notificationData?.event_title && (
                          <Text
                            strong
                            style={{
                              fontSize: "12px",
                              color: "#1890ff",
                              display: "block",
                              marginBottom: 4,
                            }}
                          >
                            {notificationData.event_title}
                          </Text>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Space size="small">
                            <Text type="secondary" style={{ fontSize: "11px" }}>
                              {notification.sender?.name ||
                                notificationData?.created_by ||
                                notificationData?.alumni_name ||
                                ""}
                            </Text>
                            {!notification.read && <Badge dot color="#1890ff" size="small" />}
                          </Space>
                          <Text type="secondary" style={{ fontSize: "10px" }}>
                            {notification.created_at
                              ? (() => {
                                  const date = new Date(notification.created_at)
                                  const now = new Date()
                                  const diffMs = now - date
                                  const diffMins = Math.floor(diffMs / 60000)
                                  const diffHours = Math.floor(diffMs / 3600000)
                                  const diffDays = Math.floor(diffMs / 86400000)
                                  if (diffMins < 1) return "Just now"
                                  if (diffMins < 60) return `${diffMins}m ago`
                                  if (diffHours < 24) return `${diffHours}h ago`
                                  if (diffDays < 7) return `${diffDays}d ago`
                                  return date.toLocaleDateString()
                                })()
                              : "Just now"}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )
              }}
            />
          )}
        </div>

        {totalNotifications > modalPerPage && (
          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              current={currentPage}
              total={totalNotifications}
              pageSize={modalPerPage}
              onChange={(page) => {
                fetchAllNotifications(page)
              }}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} notifications`}
            />
          </div>
        )}
      </Modal>
    )
  }

  const renderEventRegistrationsModal = () => {
    return (
      <Modal
        title={
          <Space>
            <TeamOutlined style={{ color: "#1890ff" }} />
            <span>Event Registrations: {selectedEventForRegistrations?.title}</span>
          </Space>
        }
        open={eventRegistrationsModalVisible}
        onCancel={() => {
          setEventRegistrationsModalVisible(false)
          setSelectedEventForRegistrations(null)
          setEventRegistrations([])
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setEventRegistrationsModalVisible(false)
              setSelectedEventForRegistrations(null)
              setEventRegistrations([])
            }}
          >
            Close
          </Button>,
          <Button
            key="viewAll"
            type="primary"
            onClick={() => {
              setEventRegistrationsModalVisible(false)
              history.push("/events")
            }}
          >
            Go to Events Page
          </Button>,
        ]}
        width={900}
      >
        <Spin spinning={eventRegistrationsLoading}>
          {selectedEventForRegistrations && (
            <div style={{ marginBottom: 16, padding: 16, background: "#f5f5f5", borderRadius: 8 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Event Date:</Text>
                  <Text strong style={{ display: "block" }}>
                    {new Date(selectedEventForRegistrations.date).toLocaleDateString()}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Location:</Text>
                  <Text strong style={{ display: "block" }}>
                    {selectedEventForRegistrations.location}
                  </Text>
                </Col>
              </Row>
            </div>
          )}
          <List
            dataSource={eventRegistrations}
            locale={{ emptyText: "No registrations yet" }}
            renderItem={(registration, index) => (
              <List.Item
                style={{
                  background: registration.isHighlighted ? "#e6f7ff" : "#fff",
                  borderLeft: registration.isHighlighted ? "3px solid #1890ff" : "none",
                  padding: "12px 16px",
                }}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong>{registration.alumni?.name || "N/A"}</Text>
                      {registration.isHighlighted && (
                        <Badge color="#1890ff" text="Just Registered" style={{ fontSize: 11 }} />
                      )}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Email: {registration.alumni?.email || "N/A"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Contact: {registration.alumni?.contact_number || "N/A"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Batch Year: {registration.alumni?.batch_year || "N/A"}
                      </Text>
                    </Space>
                  }
                />
                <div>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Registered:{" "}
                    {registration.registration_date
                      ? new Date(registration.registration_date).toLocaleString()
                      : new Date(registration.created_at).toLocaleString()}
                  </Text>
                </div>
              </List.Item>
            )}
          />
        </Spin>
      </Modal>
    )
  }

  const renderEventDetailsModal = () => {
    if (!selectedEventDetails) return null

    return (
      <Modal
        title={
          <Space>
            <CalendarOutlined style={{ color: "#1890ff" }} />
            <span>{selectedEventDetails.title}</span>
          </Space>
        }
        open={eventDetailsModalVisible}
        onCancel={() => {
          setEventDetailsModalVisible(false)
          setSelectedEventDetails(null)
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setEventDetailsModalVisible(false)
              setSelectedEventDetails(null)
            }}
          >
            Close
          </Button>,
          <Button
            key="viewAll"
            type="primary"
            onClick={() => {
              setEventDetailsModalVisible(false)
              history.push("/events")
            }}
          >
            Go to Events Page
          </Button>,
        ]}
        width={700}
      >
        <Spin spinning={eventDetailsLoading}>
          {selectedEventDetails && (
            <div>
              {selectedEventDetails.image_urls && selectedEventDetails.image_urls.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Image
                    src={selectedEventDetails.image_urls[0] || "/placeholder.svg"}
                    alt={selectedEventDetails.title}
                    style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }}
                    fallback="/community-event.png"
                  />
                </div>
              )}

              <div style={{ padding: 16, background: "#f5f5f5", borderRadius: 8, marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Space>
                      <CalendarOutlined style={{ color: "#1890ff" }} />
                      <div>
                        <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                          Date
                        </Text>
                        <Text strong>{new Date(selectedEventDetails.date).toLocaleDateString()}</Text>
                      </div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space>
                      <span style={{ fontSize: 16 }}>🕐</span>
                      <div>
                        <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                          Time
                        </Text>
                        <Text strong>
                          {selectedEventDetails.start_time} - {selectedEventDetails.end_time}
                        </Text>
                      </div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space>
                      <span style={{ fontSize: 16 }}>📍</span>
                      <div>
                        <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                          Location
                        </Text>
                        <Text strong>{selectedEventDetails.location}</Text>
                      </div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space>
                      <TeamOutlined style={{ color: "#52c41a" }} />
                      <div>
                        <Text type="secondary" style={{ display: "block", fontSize: 12 }}>
                          Capacity
                        </Text>
                        <Text strong>
                          {selectedEventDetails.registered_count || 0} / {selectedEventDetails.capacity}
                        </Text>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Description</Title>
                <Text>{selectedEventDetails.description}</Text>
              </div>

              <div>
                <Text type="secondary">Organized by: </Text>
                <Text strong>{selectedEventDetails.organizer}</Text>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    )
  }

  const renderNotificationsDropdown = () => {
    const filteredNotifications = filterNotificationsByCategory(notifications)
    const categoryCounts = getCategoryCounts(notifications)

    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          width: isMobile ? "calc(100vw - 32px)" : 450,
          maxWidth: isMobile ? 340 : 450,
          maxHeight: isMobile ? "70vh" : 550,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            padding: isMobile ? "12px" : "16px",
            borderBottom: "1px solid #f0f0f0",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: isMobile ? 8 : 0,
            }}
          >
            <div>
              <Title level={5} style={{ color: "white", margin: 0, fontSize: isMobile ? 14 : 16 }}>
                Notifications
              </Title>
              <Text
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: isMobile ? "11px" : "12px",
                }}
              >
                {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
              </Text>
            </div>
            <Space>
              <Button
                size="small"
                type={filterUnread ? "primary" : "default"}
                onClick={() => setFilterUnread(!filterUnread)}
                style={{
                  background: filterUnread ? "rgba(255,255,255,0.2)" : "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "white",
                  fontSize: isMobile ? 11 : 14,
                }}
              >
                {filterUnread ? "Show All" : "Show Unread"}
              </Button>
            </Space>
          </div>
        </div>

        <div
          style={{
            padding: isMobile ? "6px 8px" : "8px 12px",
            borderBottom: "1px solid #f0f0f0",
            background: "#f8f9fa",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <Space size={4}>
            {Object.entries(NOTIFICATION_CATEGORIES).map(([key, category]) => (
              <Tooltip key={key} title={category.label}>
                <Button
                  size="small"
                  type={activeCategory === key ? "primary" : "text"}
                  icon={category.icon}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    borderColor: activeCategory === key ? category.color : "transparent",
                    background: activeCategory === key ? category.color : "transparent",
                    color: activeCategory === key ? "#fff" : category.color,
                    minWidth: isMobile ? 28 : 32,
                    padding: isMobile ? "0 4px" : "0 8px",
                    fontSize: isMobile ? 10 : 14,
                  }}
                >
                  {categoryCounts[key] > 0 && (
                    <span style={{ marginLeft: 4, fontSize: isMobile ? 9 : 10 }}>{categoryCounts[key]}</span>
                  )}
                </Button>
              </Tooltip>
            ))}
          </Space>
        </div>

        <div
          style={{
            padding: isMobile ? "6px 12px" : "8px 16px",
            borderBottom: "1px solid #f0f0f0",
            background: "#fafafa",
          }}
        >
          <Space>
            {unreadCount > 0 && (
              <Button
                size="small"
                type="link"
                onClick={handleMarkAllAsRead}
                loading={false}
                icon={<EyeInvisibleOutlined />}
                style={{ padding: 0, fontSize: isMobile ? "11px" : "12px" }}
              >
                Mark all as read
              </Button>
            )}
            <Button
              size="small"
              type="link"
              icon={<SettingOutlined />}
              style={{ padding: 0, fontSize: isMobile ? "11px" : "12px" }}
              onClick={() => {
                setDropdownVisible(false)
                setSettingsModalVisible(true)
              }}
            >
              Notification settings
            </Button>
          </Space>
        </div>

        <div style={{ maxHeight: isMobile ? 180 : 250, overflowY: "auto" }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <Spin />
              <div style={{ marginTop: 10, color: "#666" }}>Loading notifications...</div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div
              style={{
                padding: isMobile ? 20 : 40,
                textAlign: "center",
                color: "#999",
              }}
            >
              <BellOutlined
                style={{
                  fontSize: isMobile ? 28 : 32,
                  marginBottom: 16,
                  color: "#d9d9d9",
                }}
              />
              <div style={{ fontSize: isMobile ? "13px" : "14px" }}>
                {activeCategory !== "all"
                  ? `No ${NOTIFICATION_CATEGORIES[activeCategory].label.toLowerCase()}`
                  : filterUnread
                    ? "No unread notifications"
                    : "No notifications yet"}
              </div>
              <Text type="secondary" style={{ fontSize: isMobile ? "10px" : "12px" }}>
                We'll notify you when something arrives
              </Text>
            </div>
          ) : (
            <List
              dataSource={filteredNotifications.slice(0, 5)}
              renderItem={(item) => <NotificationItem notification={item} />}
            />
          )}
        </div>

        {notifications.length > 0 && (
          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: "12px 16px",
              textAlign: "center",
              background: "#fafafa",
            }}
          >
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setDropdownVisible(false)
                setAllNotificationsModalVisible(true)
                fetchAllNotifications(1)
              }}
              style={{ borderRadius: 6 }}
            >
              View All Notifications ({totalNotifications})
            </Button>
          </div>
        )}
      </div>
    )
  }

  const accountItems = [
    {
      label: (
        <div style={{ padding: "8px 0" }}>
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>{userData.name}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>{userData.email}</div>
        </div>
      ),
      key: "profile-header",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      label: "Sign out",
      key: "logout",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]

  const handleAccountItemClick = (e) => {
    switch (e.key) {
      case "view-profile":
        history.push("/profile")
        break
      case "account-settings":
        history.push("/settings")
        break
      case "logout":
        logout()
        break
      default:
        break
    }
  }

  const renderAccountDropdown = () => (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        width: 280,
        padding: "8px 0",
      }}
    >
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Avatar size={64} src={userData.avatar} style={{ marginBottom: 12, border: "3px solid #1890ff" }} />
        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
          {userData.name}
        </Title>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {userData.email}
        </Text>
        <div style={{ marginTop: 8 }}>
          <Badge
            status="success"
            text={userData.role.charAt(0).toUpperCase() + userData.role.slice(1).replace("_", " ")}
            style={{ fontSize: "11px" }}
          />
        </div>
      </div>
      <Menu onClick={handleAccountItemClick} items={accountItems} style={{ border: "none" }} />
    </div>
  )

  const renderMenu = () => (
    <Menu theme="light" mode="inline">
      {menus.map((menu, i) => (
        <React.Fragment key={i}>
          {!menu.subMenu && (
            <Tooltip
              title={isMobile ? null : menu.label}
              placement="right"
              className={
                basePath === menu.url || basePath === menu.subUrl1 || basePath === menu.subUrl2 ? "active-menu" : ""
              }
            >
              <Menu.Item key={menu.key}>
                {menu.icon}
                <Link to={menu.url}>{isMobile ? menu.label : null}</Link>
              </Menu.Item>
            </Tooltip>
          )}
          {menu.subMenu && (
            <Menu.SubMenu key={menu.key} title={isMobile ? menu.label : null} icon={menu.icon}>
              <Menu.ItemGroup key={menu.key}>
                {menu.submenu.map((sub) => (
                  <Menu.Item key={sub.key}>
                    <Link to={sub.path}>{sub?.label}</Link>
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
            </Menu.SubMenu>
          )}
        </React.Fragment>
      ))}
    </Menu>
  )

  useEffect(() => {
    if (Array.isArray(profile?.alumni_quizzes) && profile?.alumni_quizzes?.length !== 2) {
      setQuizzes(profile?.alumni_quizzes)
      setModalVisible(true)
    }
  }, [profile])

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          title={
            <div className="logo">
              <img src={logoMini || "/placeholder.svg"} alt="Logo" />
            </div>
          }
          placement="left"
          closable={true}
          onClose={toggleDrawer}
          visible={drawerVisible}
          width={280}
          bodyStyle={{ padding: 0 }}
        >
          {renderMenu()}
        </Drawer>
      ) : (
        <div id={`sidebar-wrapper`} style={{ width: 80 }}>
          <Sider trigger={null} collapsible collapsed={!isMobile && collapsed}>
            <div className="logo">
              <img src={logoMini || "/placeholder.svg"} style={{ width: 80 }} alt="Logo" />
            </div>
            {renderMenu()}
          </Sider>
        </div>
      )}

      <Layout className="site-layout">
        <Header id="header">
          <Row style={{ flex: 1 }} className="row-header" justify="space-between" align="middle">
            <Col
              className="first"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: isMobile ? 1 : "auto",
                justifyContent: isMobile ? "center" : "flex-start",
                position: "relative",
              }}
            >
              {isMobile && (
                <Button
                  type="text"
                  icon={drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={toggleDrawer}
                  className="burger-menu"
                  style={{ position: "absolute", left: 0, zIndex: 1 }}
                />
              )}

              <Text
                strong
                style={{
                  fontSize: isMobile ? 14 : 28,
                  fontWeight: 800,
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: isMobile ? "calc(100vw - 180px)" : "auto",
                  textAlign: isMobile ? "center" : "left",
                  paddingLeft: isMobile ? 40 : 0,
                  paddingRight: isMobile ? 40 : 0,
                }}
              >
                Alumni Tracing Management System
              </Text>
            </Col>
            <Col
              flex={isMobile ? "auto" : "280px"}
              className="second"
              style={{ position: isMobile ? "absolute" : "relative", right: isMobile ? 8 : 0 }}
            >
              <Space size={isMobile ? 8 : 16}>
                {role !== "department_head" && (
                  <Dropdown
                    placement="bottomRight"
                    trigger={["click"]}
                    dropdownRender={renderNotificationsDropdown}
                    overlayStyle={{ padding: 0 }}
                    visible={dropdownVisible}
                    onVisibleChange={setDropdownVisible}
                  >
                    <Badge
                      count={unreadCount}
                      offset={[-5, 5]}
                      size="small"
                      style={{
                        boxShadow: "0 0 0 2px #fff",
                      }}
                    >
                      <Button
                        shape="circle"
                        icon={<BellOutlined />}
                        type="text"
                        className={`btn-notification ${animateBell ? "bell-animate" : ""}`}
                        loading={isLoading}
                        style={{
                          width: 40,
                          height: 40,
                          minWidth: 40,
                          minHeight: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #f0f0f0",
                          padding: 0,
                        }}
                      />
                    </Badge>
                  </Dropdown>
                )}

                <Dropdown placement="bottomRight" trigger={["click"]} dropdownRender={renderAccountDropdown}>
                  <Button
                    type="text"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      height: 40,
                      padding: isMobile ? "0 8px" : "0 12px",
                      border: "1px solid rgb(102 126 234)",
                      borderRadius: 20,
                      background: "#667eea40",
                    }}
                  >
                    <Avatar size={24} src={userData.avatar} style={{ marginRight: isMobile ? 0 : 8 }} />
                    {!isMobile && (
                      <Text strong style={{ fontSize: "14px" }}>
                        {userData.name.split(" ")[0]}
                      </Text>
                    )}
                  </Button>
                </Dropdown>
              </Space>
            </Col>
          </Row>
        </Header>
        <Content id="content">{children}</Content>
      </Layout>

      {renderSettingsModal()}
      {renderAllNotificationsModal()}
      {renderEventRegistrationsModal()}
      {renderEventDetailsModal()}

      <AlumniDetails
        visible={alumniDetailsVisible}
        onCancel={() => {
          setAlumniDetailsVisible(false)
          setAlumniPreviewData(null)
        }}
        onSubmit={() => {}}
        previewData={alumniPreviewData}
        viewOnly={true}
        loading={alumniDetailsLoading}
      />

      <Modal
        title="Select Quiz Type"
        open={modalVisible}
        onCancel={() => setModalVisible(true)}
        footer={null}
        closable={false}
        maskClosable={false}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#fff2e8",
              border: "1px solid #ffbb96",
              borderRadius: 6,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#fa541c",
                  fontSize: 18,
                  marginRight: 8,
                }}
              >
                ⚠
              </span>
              <span
                style={{
                  color: "#fa541c",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                Required: Complete a quiz to continue using Device
              </span>
            </div>
          </div>

          {Array.isArray(alumniQuizzes) && !alumniQuizzes.find((item) => item.type === "rating") && (
            <Button
              type="dashed"
              size="large"
              style={{ width: "100%", marginBottom: 16 }}
              onClick={() => (window.location.href = "answer-question")}
            >
              Program Experience Rating ✅
            </Button>
          )}

          {Array.isArray(alumniQuizzes) && !alumniQuizzes.find((item) => item.type === "abcd") && (
            <Button
              type="dashed"
              size="large"
              style={{ width: "100%", marginBottom: 16 }}
              onClick={() => (window.location.href = "image-quiz")}
            >
              Behavioral Assessment Questions ✅
            </Button>
          )}

          <Button
            style={{
              width: "100%",
              marginTop: 10,
              backgroundColor: "#fff",
              borderColor: "#ff4d4f",
              color: "#ff4d4f",
            }}
            icon={<LogoutOutlined />}
            onClick={logout}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fa8c16"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.borderColor = "#fa8c16"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff"
              e.currentTarget.style.color = "#ff4d4f"
              e.currentTarget.style.borderColor = "#ff4d4f"
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = "#ff4d4f"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.borderColor = "#ff4d4f"
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = "#fa8c16"
              e.currentTarget.style.color = "#fff"
              e.currentTarget.style.borderColor = "#fa8c16"
            }}
          >
            Logout
          </Button>
        </div>
      </Modal>
    </Layout>
  )
}

export default MainLayout