"use client"

import { useState, useMemo, useEffect } from "react"
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
  Modal,
  Form,
  Tooltip,
  Statistic,
  message,
  Table,
} from "antd"
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  FolderOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import moment from "moment"
import "./AlumniList.css"
import { Layout, AlumniDetails } from "~/components"
import useAlumni from "~/hooks/useAlumni"
import useEmployeeStatus from "~/hooks/useEmployeeStatus"
import axiosConfig from "~/utils/axiosConfig"
import { BASE_URL } from "~/utils/constant"
import secureLocalStorage from "react-secure-storage"
import logo from "~/assets/images/OCC_LOGO.png"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

const statusColors = {
  Employed: "green",
  Unemployed: "red",
  "Under Employed": "orange",
}

const employmentStatusOptions = [
  { value: "all", label: "All Employment", color: "default" },
  { value: "employed", label: "Employed", color: "green" },
  { value: "unemployed", label: "Unemployed", color: "red" },
  { value: "under_employed", label: "Under Employed", color: "orange" },
  // { value: "graduate_school", label: "Graduate School", color: "blue" },
]

const statusOptions = [
  { value: "all", label: "All Status", color: "default" },
  { value: "pending", label: "Pending Review", color: "orange" },
  { value: "approved", label: "Approved", color: "green" },
  // { value: "inactive", label: "Inactive", color: "red" },
]

const majorOptions = [
  "Computer Science",
  "Business Administration",
  "Engineering",
  "Biology",
  "Psychology",
  "Marketing",
  "Finance",
  "Arts & Sciences",
]

const sortOptions = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "graduation-desc", label: "Graduation: Recent First" },
  { value: "graduation-asc", label: "Graduation: Oldest First" },
  { value: "salary-desc", label: "Salary: High to Low" },
  { value: "salary-asc", label: "Salary: Low to High" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "lastActive-desc", label: "Recently Active" },
]

const courseFolders = [
  { id: 1, code: "BSIT", name: "Bachelor of Science in Information Technology", color: "#f5222d" },
  { id: 2, code: "BSEd", name: "Bachelor in Teacher Education", color: "#1890ff" },
  { id: 3, code: "BEED", name: "Bachelor of Elementary Education", color: "#1890ff" },
  { id: 4, code: "BSBA", name: "Bachelor of Science in Business Administration", color: "#faad14" },
]

const getStatusIcon = (status) => {
  switch (status) {
    case "approved":
      return <CheckCircleOutlined style={{ color: "#52c41a" }} />
    case "pending":
      return <ClockCircleOutlined style={{ color: "#faad14" }} />
    // case "inactive":
    //   return <StopOutlined style={{ color: "#ff4d4f" }} />
    default:
      return <UserOutlined />
  }
}

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
  }
  const statusConfig = config[status] || {
    color: "default",
    text: status,
  }
  return (
    <Tag color={statusConfig.color} icon={statusConfig.icon}>
      {statusConfig.text}
    </Tag>
  )
}

const StatusUpdateModal = ({ visible, onCancel, onOk, alumnus, loading, statuses }) => {
  const [form] = Form.useForm()
  const [selectedStatus, setSelectedStatus] = useState("pending")

  useEffect(() => {
    if (alumnus) {
      form.setFieldsValue({
        status: alumnus.status || "pending",
        employment_status_id: alumnus.employment_status_id,
        admin_notes: alumnus.admin_notes || "",
      })

      setSelectedStatus(alumnus.status || "pending")
    }
  }, [alumnus, form])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onOk({
        ...values,
        status: selectedStatus,
      })
    })
  }

  const handleClose = () => {
    form.resetFields()
    onCancel()
  }

  const getStatusDescription = (status) => {
    const descriptions = {
      approved: "Alumni will be visible in the directory and can be contacted by other users.",
      pending: "Alumni profile will be under review and not visible to others until approved.",
      // inactive: "Alumni profile will be hidden from the directory and marked as inactive.",
    }
    return descriptions[status] || ""
  }
  return (
    <Modal
      title={`Update Status - ${alumnus?.first_name ?? ""} ${alumnus?.last_name ?? ""}`}
      open={visible}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="New Status" name="status" rules={[{ required: true, message: "Please select a status" }]}>
          <Select onChange={setSelectedStatus}>
            <Option value="approved">
              <Space>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                Approved
              </Space>
            </Option>
            <Option value="pending">
              <Space>
                <ClockCircleOutlined style={{ color: "#faad14" }} />
                Pending Review
              </Space>
            </Option>
            {/* <Option value="inactive">
              <Space>
                <StopOutlined style={{ color: "#ff4d4f" }} />
                Inactive
              </Space>
            </Option> */}
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
            <Text type="secondary">{getStatusDescription(selectedStatus)}</Text>
          </div>
        )}

        <Form.Item
          label="Admin Notes"
          name="admin_notes"
          rules={[
            {
              required: true,
              message: "Please provide notes for this status change",
            },
          ]}
        >
          <TextArea rows={4} maxLength={500} showCount placeholder="Explain the reason for the status change" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

const AlumniCard = ({ alumnus, handleView, handleStatusUpdate }) => {
  const role = secureLocalStorage.getItem("userRole")

  const isRecentlyUpdated = useMemo(() => {
    if (!alumnus.updated_at) return false
    const updated = moment(alumnus.updated_at)
    const now = moment()

    return now.diff(updated, "seconds") < 30 && alumnus.created_at !== alumnus.updated_at
  }, [alumnus.updated_at, alumnus.created_at])

  return (
    <Badge.Ribbon text="Featured" color="red" style={{ display: alumnus.isFeatured ? "block" : "none" }}>
      <Card
        className="alumni-card"
        actions={[
          <Tooltip key="view" onClick={() => handleView(alumnus)} title="View Profile">
            <EyeOutlined />
          </Tooltip>,
          ...(role === "admin"
            ? [
              <Tooltip title="Edit Status" key="edit" onClick={() => handleStatusUpdate(alumnus, "approved")}>
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
                {alumnus.major} • Class of {alumnus.graduation_year}
              </Text>

              {/* {role === "admin" && isRecentlyUpdated && (
                <div style={{ marginTop: 8 }}>
                  <Tag color="blue" icon={<BellOutlined />}>
                    New Updated Information
                  </Tag>
                </div>
              )} */}
            </div>
          </div>

          <Divider />

          <div className="alumni-details">
            <div className="detail-item-alumini">
              <TeamOutlined />
              <Text strong>Employment:</Text>
              {getEmploymentStatusTag(alumnus?.employment_status?.status_name)}
            </div>

            {alumnus.currentCompany && (
              <div className="detail-item-alumini">
                <UserOutlined />
                <Text>{alumnus.currentCompany}</Text>
                <Text type="secondary">• {alumnus.position}</Text>
              </div>
            )}

            <div className="detail-item-alumini">
              <EnvironmentOutlined />
              <Text>{alumnus.address}</Text>
            </div>

            {alumnus.salary && (
              <div className="detail-item-alumini">
                <DollarOutlined />
                <Text strong>${alumnus.salary.toLocaleString()}</Text>
                <Text type="secondary">/year</Text>
              </div>
            )}

            <div className="detail-item-alumini">
              <CalendarOutlined />
              <Text type="secondary">Last active: {moment(alumnus.lastActive).fromNow()}</Text>
            </div>

            {alumnus.admin_notes && (
              <div className="detail-item-alumini">
                <ExclamationCircleOutlined />
                <Text type="secondary" style={{ fontStyle: "italic" }}>
                  Note: {alumnus.admin_notes}
                </Text>
              </div>
            )}
          </div>

          <div className="alumni-skills">
            {Array.isArray(alumnus?.technical_skills) &&
              alumnus?.technical_skills?.slice(0, 4).map((skill) => (
                <Tag key={skill} className="skill-tag">
                  {skill}
                </Tag>
              ))}
            {Array.isArray(alumnus?.technical_skills) && alumnus?.technical_skills.length > 4 && (
              <Tag className="skill-tag">+{alumnus?.technical_skills.length - 4} more</Tag>
            )}
          </div>

          <Paragraph ellipsis={{ rows: 2 }} className="alumni-bio">
            {alumnus.bio}
          </Paragraph>
        </div>
      </Card>
    </Badge.Ribbon>
  )
}

const CourseFolderModal = ({ visible, onCancel, course, alumni, handleView }) => {
  const [folderSearch, setFolderSearch] = useState("")
  const [folderEmploymentFilter, setFolderEmploymentFilter] = useState("all")
  const [printPreviewVisible, setPrintPreviewVisible] = useState(false)

  // Filter alumni by course_id and search/employment filters
  const filteredCourseAlumni = useMemo(() => {
    let filtered = alumni.filter((a) => a.course_id === course.id)

    // Apply search filter
    if (folderSearch) {
      const searchLower = folderSearch.toLowerCase()
      filtered = filtered.filter((a) => {
        const firstName = a?.first_name?.toLowerCase() || ""
        const lastName = a?.last_name?.toLowerCase() || ""
        return firstName.includes(searchLower) || lastName.includes(searchLower)
      })
    }

    // Apply employment status filter
    if (folderEmploymentFilter !== "all") {
      const statusMap = {
        employed: 1,
        unemployed: 2,
        under_employed: 3,
      }
      filtered = filtered.filter((a) => a.employment_status_id === statusMap[folderEmploymentFilter])
    }

    return filtered
  }, [alumni, course.id, folderSearch, folderEmploymentFilter])

  const handlePrint = () => {
    setPrintPreviewVisible(true)
  }

  const handleActualPrint = () => {
    // Small delay to ensure the printable area is fully rendered
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <>
      <Modal
        title={
          <Space>
            <FolderOutlined style={{ color: course.color }} />
            <span>
              {course.code} - {course.name}
            </span>
          </Space>
        }
        open={visible}
        onCancel={onCancel}
        width={1200}
        footer={[
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print Preview
          </Button>,
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Search and Filter Controls */}
          <Row gutter={16}>
            <Col span={12}>
              <Input
                placeholder="Search alumni by name..."
                prefix={<SearchOutlined />}
                value={folderSearch}
                onChange={(e) => setFolderSearch(e.target.value)}
                size="large"
                allowClear
              />
            </Col>
            <Col span={12}>
              <Select
                value={folderEmploymentFilter}
                onChange={setFolderEmploymentFilter}
                style={{ width: "100%" }}
                size="large"
                placeholder="Employment Status"
              >
                <Option value="all">
                  <Tag color="default">All Employment</Tag>
                </Option>
                <Option value="employed">
                  <Tag color="green">Employed</Tag>
                </Option>
                <Option value="unemployed">
                  <Tag color="red">Unemployed</Tag>
                </Option>
                <Option value="under_employed">
                  <Tag color="orange">Under Employed</Tag>
                </Option>
              </Select>
            </Col>
          </Row>

          {/* Statistics */}
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="Total Alumni" value={filteredCourseAlumni.length} prefix={<TeamOutlined />} />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Employed"
                  value={filteredCourseAlumni.filter((a) => a.employment_status_id === 1).length}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Unemployed"
                  value={filteredCourseAlumni.filter((a) => a.employment_status_id === 2).length}
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Under Employed"
                  value={filteredCourseAlumni.filter((a) => a.employment_status_id === 3).length}
                  valueStyle={{ color: "#faad14" }}
                />
              </Col>
            </Row>
          </Card>

          {/* Alumni List */}
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {filteredCourseAlumni.length === 0 ? (
              <Card>
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Title level={4}>No alumni found</Title>
                  <Text type="secondary">No alumni match your search criteria for this course</Text>
                </div>
              </Card>
            ) : (
              <List
                dataSource={filteredCourseAlumni}
                renderItem={(alumnus) => (
                  <List.Item
                    key={alumnus.id}
                    actions={[
                      <Button key="view" type="link" icon={<EyeOutlined />} onClick={() => handleView(alumnus)}>
                        View
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar size={50} src={alumnus.profile_image_url} />}
                      title={
                        <Space>
                          <span>
                            {alumnus.first_name} {alumnus.last_name}
                          </span>
                          {getStatusIcon(alumnus.status)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary">Class of {alumnus.graduation_year}</Text>
                          {getEmploymentStatusTag(alumnus?.employment_status?.status_name)}
                          {alumnus.current_company && (
                            <Text>
                              {alumnus.job_title} at {alumnus.current_company}
                            </Text>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </Space>
      </Modal>

      {/* Print Preview Modal */}
      <Modal
        title="Print Preview - A4 Layout"
        open={printPreviewVisible}
        onCancel={() => setPrintPreviewVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setPrintPreviewVisible(false)}>
            Cancel
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handleActualPrint}>
            Print
          </Button>,
        ]}
      >
        <div
          id="printable-area"
          style={{
            padding: "40px",
            backgroundColor: "#fff",
            minHeight: "297mm",
            width: "210mm",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #000", paddingBottom: "20px" }}
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="OCC Logo"
              style={{ width: "80px", height: "80px", marginBottom: "10px", objectFit: "contain" }}
            />
            <Title level={2} style={{ margin: 0, color: "#000" }}>
              Alumni Directory Report
            </Title>
            <Title level={4} style={{ margin: "10px 0", color: course.color }}>
              {course.code} - {course.name}
            </Title>
            <Text type="secondary" style={{ color: "#666" }}>
              Generated on: {moment().format("MMMM DD, YYYY")}
            </Text>
          </div>

          {/* Print Statistics */}
          <Card style={{ marginBottom: "20px", border: "1px solid #d9d9d9" }}>
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#000" }}>
                    {filteredCourseAlumni.length}
                  </Title>
                  <Text style={{ color: "#000" }}>Total Alumni</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#52c41a" }}>
                    {filteredCourseAlumni.filter((a) => a.employment_status_id === 1).length}
                  </Title>
                  <Text style={{ color: "#000" }}>Employed</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#ff4d4f" }}>
                    {filteredCourseAlumni.filter((a) => a.employment_status_id === 2).length}
                  </Title>
                  <Text style={{ color: "#000" }}>Unemployed</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#faad14" }}>
                    {filteredCourseAlumni.filter((a) => a.employment_status_id === 3).length}
                  </Title>
                  <Text style={{ color: "#000" }}>Under Employed</Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Print Table */}
          <Table
            dataSource={filteredCourseAlumni}
            pagination={false}
            size="small"
            rowKey="id"
            style={{ width: "100%" }}
            columns={[
              {
                title: "No.",
                key: "index",
                width: 50,
                render: (_, __, index) => index + 1,
              },
              {
                title: "Name",
                key: "name",
                render: (alumnus) => `${alumnus.first_name} ${alumnus.last_name}`,
              },
              {
                title: "Graduation Year",
                dataIndex: "graduation_year",
                key: "graduation_year",
                width: 120,
              },
              {
                title: "Employment Status",
                key: "employment",
                width: 150,
                render: (alumnus) => alumnus?.employment_status?.status_name || "N/A",
              },
              {
                title: "Company",
                dataIndex: "current_company",
                key: "current_company",
                render: (text) => text || "N/A",
              },
              {
                title: "Position",
                dataIndex: "job_title",
                key: "job_title",
                render: (text) => text || "N/A",
              },
            ]}
          />

          {/* Print Footer */}
          <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #d9d9d9", textAlign: "center" }}>
            <Text type="secondary" style={{ color: "#666" }}>
              This is an official document generated from the Alumni Management System
            </Text>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        @media print {
          /* Hide everything except printable area */
          body * {
            visibility: hidden !important;
          }
          
          /* Make printable area and its contents visible */
          #printable-area,
          #printable-area * {
            visibility: visible !important;
          }
          
          /* Position and size the printable area correctly */
          #printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 15mm !important;
            margin: 0 !important;
            background: #fff !important;
            box-sizing: border-box !important;
            z-index: 999999 !important;
          }
          
          /* Hide all modal elements */
          .ant-modal-mask,
          .ant-modal-wrap {
            position: static !important;
            background: none !important;
          }
          
          .ant-modal,
          .ant-modal-content {
            position: static !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }
          
          .ant-modal-header,
          .ant-modal-footer,
          .ant-modal-close {
            display: none !important;
          }
          
          .ant-modal-body {
            padding: 0 !important;
          }
          
          /* Ensure colors print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Print header styling */
          #printable-area > div:first-child {
            text-align: center !important;
            margin-bottom: 20px !important;
            border-bottom: 2px solid #000 !important;
            padding-bottom: 15px !important;
          }
          
          #printable-area img {
            width: 80px !important;
            height: 80px !important;
            display: block !important;
            margin: 0 auto 10px auto !important;
          }
          
          /* Statistics card styling */
          #printable-area .ant-card {
            border: 1px solid #d9d9d9 !important;
            box-shadow: none !important;
            background: #fff !important;
            margin-bottom: 15px !important;
            page-break-inside: avoid !important;
          }
          
          #printable-area .ant-card-body {
            padding: 16px !important;
          }
          
          /* Row and column layout for statistics */
          #printable-area .ant-row {
            display: flex !important;
            flex-wrap: wrap !important;
            width: 100% !important;
          }
          
          #printable-area .ant-col {
            display: block !important;
            float: left !important;
          }
          
          #printable-area .ant-col-6 {
            width: 25% !important;
            flex: 0 0 25% !important;
            max-width: 25% !important;
          }
          
          /* Typography colors */
          #printable-area h1,
          #printable-area h2,
          #printable-area h3,
          #printable-area h4,
          #printable-area .ant-typography {
            color: #000 !important;
            margin: 0 !important;
          }
          
          /* Preserve colored statistics text */
          #printable-area h3[style*="color: rgb(82, 196, 26)"],
          #printable-area h3[style*="color: #52c41a"] {
            color: #52c41a !important;
          }
          
          #printable-area h3[style*="color: rgb(245, 34, 45)"],
          #printable-area h3[style*="color: #f5222d"] {
            color: #f5222d !important;
          }
          
          #printable-area h3[style*="color: rgb(250, 173, 20)"],
          #printable-area h3[style*="color: #faad14"] {
            color: #faad14 !important;
          }
          
          /* Table styling */
          #printable-area table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
          }
          
          #printable-area .ant-table {
            font-size: 10px !important;
          }
          
          #printable-area .ant-table-container {
            border: 1px solid #d9d9d9 !important;
          }
          
          #printable-area .ant-table-thead > tr > th {
            background: #fafafa !important;
            border-bottom: 1px solid #d9d9d9 !important;
            padding: 8px 6px !important;
            font-weight: 600 !important;
            font-size: 10px !important;
            color: #000 !important;
          }
          
          #printable-area .ant-table-tbody > tr > td {
            border-bottom: 1px solid #d9d9d9 !important;
            padding: 6px !important;
            font-size: 9px !important;
            color: #000 !important;
            background: #fff !important;
          }
          
          #printable-area .ant-table-tbody > tr {
            page-break-inside: avoid !important;
          }
          
          /* Tags styling */
          #printable-area .ant-tag {
            font-size: 8px !important;
            padding: 0 4px !important;
            line-height: 16px !important;
            border: 1px solid !important;
          }
          
          /* Page setup */
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
        }
      `}</style>
    </>
  )
}

const AlumniList = () => {
  const { isLoading, data: alumni = [], isFetching, refetch } = useAlumni()
  const { data: statuses } = useEmployeeStatus()
  const [viewMode, setViewMode] = useState("grid")
  const [activeTab, setActiveTab] = useState("all")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false)
  const [selectedAlumnus, setSelectedAlumnus] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const role = secureLocalStorage.getItem("userRole")

  const [courseFolderVisible, setCourseFolderVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  const [form] = Form.useForm()

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    employmentStatus: "all",
    status: "all",
    major: "all",
    graduationYear: "all",
    featured: "all",
  })

  const [sortBy, setSortBy] = useState("name-asc")

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
    }

    setPreviewData(previewData)
    setIsModalVisible(true)
  }

  const handleOpenCourseFolder = (course) => {
    setSelectedCourse(course)
    setCourseFolderVisible(true)
  }

  const handleStatusUpdate = (alumnus, status) => {
    setSelectedAlumnus(alumnus)
    setSelectedStatus(status)
    setIsStatusModalVisible(true)
  }

  const handleStatusSubmit = async (formData) => {
    setStatusUpdateLoading(true)
    formData.id = selectedAlumnus.id
    try {
      // Simulate delay (optional)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await axiosConfig.post(BASE_URL + "api/alumni/update-stastus", formData)

      message.success(`Successfully updated ${selectedAlumnus.first_name}'s status to ${formData.status}`)

      setIsStatusModalVisible(false)
      setSelectedAlumnus(null)
      setSelectedStatus(null)
      form.resetFields()
      // If you're using data-fetching hooks:
      refetch()
    } catch (error) {
      console.error(error)
      message.error("Failed to update status. Please try again.")
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  // Filter and sort alumni
  const filteredAndSortedAlumni = useMemo(() => {
    const filtered = alumni.filter((alumnus) => {
      // Tab filter
      if (activeTab !== "all" && alumnus.status !== activeTab) {
        return false
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()

        const firstName = alumnus?.first_name?.toLowerCase() || ""
        const lastName = alumnus?.last_name?.toLowerCase() || ""

        const matchesSearch = firstName.includes(searchLower) || lastName.includes(searchLower)

        if (!matchesSearch) return false
      }

      if (
        filters.employmentStatus.toLowerCase() !== "all" &&
        alumnus?.employment_status?.status_name?.toLowerCase() !== filters.employmentStatus?.toLowerCase()
      ) {
        return false
      }

      // Status filter
      if (filters.status !== "all" && alumnus.status !== filters.status) {
        return false
      }

      // Major filter
      if (filters.major !== "all" && alumnus.major !== filters.major) {
        return false
      }

      // Featured filter
      if (filters.featured !== "all") {
        const isFeatured = filters.featured === "featured"
        if (alumnus.isFeatured !== isFeatured) return false
      }

      return true
    })

    // Sort alumni
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a?.name?.localeCompare(b.name)
        case "name-desc":
          return b?.name?.localeCompare(a.name)
        case "graduation-desc":
          return b?.graduationYear - a?.graduationYear
        case "graduation-asc":
          return a?.graduationYear - b?.graduationYear
        case "salary-desc":
          return (b?.salary || 0) - (a?.salary || 0)
        case "salary-asc":
          return (a?.salary || 0) - (b?.salary || 0)
        case "lastActive-desc":
          return moment(b?.lastActive).diff(moment(a?.lastActive))
        default:
          return 0
      }
    })

    return filtered
  }, [alumni, activeTab, filters, sortBy])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      employmentStatus: "all",
      status: "all",
      major: "all",
      graduationYear: "all",
      featured: "all",
    })
  }

  const stats = {
    total: alumni.length,
    employed: alumni.filter((a) => a.employment_status_id === 1).length,
    unemployed: alumni.filter((a) => a.employment_status_id === 2).length,
    underEmployed: alumni.filter((a) => a.employment_status_id === 3).length,
    graduateSchool: alumni.filter((a) => a.employmentStatus === "graduate_school").length,
    pending: alumni.filter((a) => a.status === "pending").length,
    approved: alumni.filter((a) => a.status === "approved").length,
    // inactive: alumni.filter((a) => a.status === "inactive").length,
  }

  return (
    <Layout>
      <div className="alumni-dashboard">
        {/* Header Section */}
        <Card className="dashboard-header-card">
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
            <Col xs={12} sm={8}>
              <div className="stat-item">
                <Text strong style={{ color: "#52c41a" }}>
                  {stats.employed}
                </Text>
                <Text style={{ color: "#fff" }} type="secondary">
                  Employed
                </Text>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div className="stat-item">
                <Text strong style={{ color: "#ff4d4f" }}>
                  {stats.unemployed}
                </Text>
                <Text type="secondary" style={{ color: "#fff" }}>
                  Seeking Work
                </Text>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div className="stat-item">
                <Text strong style={{ color: "#faad14" }}>
                  {stats.underEmployed}
                </Text>
                <Text type="secondary" style={{ color: "#fff" }}>
                  Under Employed
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
        <br></br>

        {role === "admin" && (
          <>
            <Card
              title={
                <Space>
                  <FolderOutlined />
                  <span>Course Folders</span>
                </Space>
              }
              style={{ marginBottom: "20px" }}
            >
              <Row gutter={[16, 16]}>
                {courseFolders.map((course) => {
                  const courseAlumniCount = alumni.filter((a) => a.course_id === course.id).length
                  const employedCount = alumni.filter(
                    (a) => a.course_id === course.id && a.employment_status_id === 1,
                  ).length
                  const unemployedCount = alumni.filter(
                    (a) => a.course_id === course.id && a.employment_status_id === 2,
                  ).length
                  const underEmployedCount = alumni.filter(
                    (a) => a.course_id === course.id && a.employment_status_id === 3,
                  ).length

                  return (
                    <Col xs={24} sm={12} md={6} key={course.id}>
                      <Card
                        hoverable
                        onClick={() => handleOpenCourseFolder(course)}
                        style={{
                          borderLeft: `4px solid ${course.color}`,
                          cursor: "pointer",
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <div style={{ textAlign: "center" }}>
                            <FolderOutlined
                              style={{
                                fontSize: "48px",
                                color: course.color,
                              }}
                            />
                          </div>
                          <Title
                            level={4}
                            style={{
                              margin: 0,
                              textAlign: "center",
                              color: course.color,
                            }}
                          >
                            {course.code}
                          </Title>
                          <Text
                            type="secondary"
                            style={{
                              textAlign: "center",
                              display: "block",
                              fontSize: "12px",
                            }}
                          >
                            {course.name}
                          </Text>
                          <Divider style={{ margin: "8px 0" }} />
                          <div>
                            <Space direction="vertical" size="small" style={{ width: "100%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text strong>Total:</Text>
                                <Badge
                                  count={courseAlumniCount}
                                  style={{
                                    backgroundColor: course.color,
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text type="secondary">Employed:</Text>
                                <Text style={{ color: "#52c41a" }}>{employedCount}</Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text type="secondary">Unemployed:</Text>
                                <Text style={{ color: "#ff4d4f" }}>{unemployedCount}</Text>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text type="secondary">Under Emp:</Text>
                                <Text style={{ color: "#faad14" }}>{underEmployedCount}</Text>
                              </div>
                            </Space>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            </Card>
          </>
        )}

        {role === "admin" && (
          <Card className="tabs-card">
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="status-tabs">
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
              {/* <TabPane
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
              /> */}
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
                onChange={(e) => handleFilterChange("search", e.target.value)}
                style={{ width: 300 }}
                size="large"
              />

              <Select
                value={filters.employmentStatus}
                onChange={(value) => handleFilterChange("employmentStatus", value)}
                style={{ width: 300 }}
                placeholder="Employment Status"
              >
                {employmentStatusOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    <Tag color={option.color}>{option.label}</Tag>
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Alumni Display */}
        <div className="alumni-display">
          {filteredAndSortedAlumni.length === 0 ? (
            <Card className="no-alumni-card">
              <div className="no-alumni-content">
                <Title level={3}>No alumni found</Title>
                <Text type="secondary">Try adjusting your filters or search terms to find alumni</Text>
                <br />
                <Button type="primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredAndSortedAlumni.map((alumnus) => (
                <Col xs={24} sm={12} lg={8} xl={6} key={alumnus.id}>
                  <AlumniCard alumnus={alumnus} handleView={handleView} handleStatusUpdate={handleStatusUpdate} />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Alumni Details Modal */}
        <AlumniDetails
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false)
          }}
          onSubmit={() => { }}
          previewData={previewData}
          viewOnly={true}
        />

        {/* Status Update Modal */}
        <StatusUpdateModal
          visible={isStatusModalVisible}
          onCancel={() => {
            setIsStatusModalVisible(false)
            setSelectedAlumnus(null)
            setSelectedStatus(null)
          }}
          onOk={handleStatusSubmit}
          alumnus={selectedAlumnus}
          loading={statusUpdateLoading}
          statuses={statuses}
        />

        {selectedCourse && (
          <CourseFolderModal
            visible={courseFolderVisible}
            onCancel={() => {
              setCourseFolderVisible(false)
              setSelectedCourse(null)
            }}
            course={selectedCourse}
            alumni={alumni}
            handleView={handleView}
          />
        )}
      </div>
    </Layout>
  )
}

export default AlumniList
