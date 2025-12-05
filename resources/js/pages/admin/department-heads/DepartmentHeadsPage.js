import { useState } from "react"
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons"
import { Layout } from "~/components"
import {
  useDepartmentHeads,
  useCreateDepartmentHead,
  useUpdateDepartmentHead,
  useDeleteDepartmentHead,
} from "~/hooks/useDepartmentHeads"
import useCourses from "~/hooks/useCourses"
import moment from "moment"

const { Title, Text } = Typography
const { Option } = Select

const courseColors = {
  1: "#f5222d",
  2: "#1890ff",
  3: "#52c41a",
  4: "#faad14",
}

const DepartmentHeadsPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  const { data: departmentHeads = [], isLoading } = useDepartmentHeads()
  const { data: courses = [] } = useCourses()
  const createMutation = useCreateDepartmentHead()
  const updateMutation = useUpdateDepartmentHead()
  const deleteMutation = useDeleteDepartmentHead()

  const handleOpenModal = (record = null) => {
    setEditingRecord(record)
    if (record) {
      form.setFieldsValue({
        name: record.name,
        email: record.email,
        course_id: record.course_id,
      })
    } else {
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setEditingRecord(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editingRecord) {
        await updateMutation.mutateAsync({
          id: editingRecord.id,
          data: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }

      handleCloseModal()
    } catch (error) {
      console.error("Validation failed:", error)
    }
  }

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id)
  }

  const assignedCourseIds = departmentHeads.map((dh) => dh.course_id)

  const getAvailableCourses = () => {
    if (editingRecord) {
      return courses.filter((course) => course.id === editingRecord.course_id || !assignedCourseIds.includes(course.id))
    }
    return courses.filter((course) => !assignedCourseIds.includes(course.id))
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <UserOutlined />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      key: "course",
      render: (_, record) => (
        <Tag color={courseColors[record.course_id] || "default"} icon={<BookOutlined />}>
          {record.course?.course_code || "N/A"} - {record.course?.course_name || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => moment(date).format("MMM DD, YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete Department Head"
            description="Are you sure you want to delete this department head?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Layout>
      <div style={{ padding: "24px" }}>
        <Card style={{ marginBottom: "24px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Department Head Accounts
              </Title>
              <Text type="secondary">Manage department head accounts for each course/program</Text>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenModal()}
                disabled={getAvailableCourses().length === 0}
              >
                Create Department Head
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Department Heads"
                value={departmentHeads.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Courses"
                value={courses.length}
                prefix={<BookOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Assigned"
                value={assignedCourseIds.length}
                suffix={`/ ${courses.length}`}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Unassigned Courses"
                value={courses.length - assignedCourseIds.length}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Department Overview" style={{ marginBottom: "24px" }}>
          <Row gutter={[16, 16]}>
            {courses.map((course) => {
              const head = departmentHeads.find((dh) => dh.course_id === course.id)
              return (
                <Col xs={24} sm={12} md={6} key={course.id}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${courseColors[course.id] || "#d9d9d9"}`,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Tag color={courseColors[course.id]} style={{ marginBottom: "8px" }}>
                        {course.course_code}
                      </Tag>
                      <div>
                        <Text strong style={{ fontSize: "12px" }}>
                          {course.course_name}
                        </Text>
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        {head ? (
                          <Space direction="vertical" size="small">
                            <Tag color="green">Assigned</Tag>
                            <Text type="secondary" style={{ fontSize: "11px" }}>
                              {head.name}
                            </Text>
                          </Space>
                        ) : (
                          <Tag color="red">Not Assigned</Tag>
                        )}
                      </div>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Card>

        <Card title="Department Heads List">
          <Table
            columns={columns}
            dataSource={departmentHeads}
            loading={isLoading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} department heads`,
            }}
          />
        </Card>

        <Modal
          title={editingRecord ? "Edit Department Head" : "Create Department Head"}
          open={isModalVisible}
          onCancel={handleCloseModal}
          onOk={handleSubmit}
          confirmLoading={createMutation.isLoading || updateMutation.isLoading}
          width={500}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter the name" }]}>
              <Input prefix={<UserOutlined />} placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter the email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: !editingRecord,
                  message: "Please enter a password",
                },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder={editingRecord ? "Leave blank to keep current password" : "Enter password"} />
            </Form.Item>

            <Form.Item
              name="course_id"
              label="Department/Course"
              rules={[{ required: true, message: "Please select a course" }]}
            >
              <Select placeholder="Select department/course">
                {getAvailableCourses().map((course) => (
                  <Option key={course.id} value={course.id}>
                    <Tag color={courseColors[course.id]}>{course.course_code}</Tag>
                    {course.course_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  )
}

export default DepartmentHeadsPage