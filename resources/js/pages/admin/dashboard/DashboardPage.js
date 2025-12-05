"use client"

import { useEffect, useState } from "react"
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  List,
  Avatar,
  Typography,
  Space,
  Select,
  DatePicker,
  Table,
  Tooltip,
  Rate,
} from "antd"
import { UserOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  LabelList,
} from "recharts"
import { Layout } from "~/components"
import "./AlumniDashboard.css"
import useAdminDashboard from "~/hooks/useAdminDashboard"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

const AlumniDashboard = () => {
  const [timeRange, setTimeRange] = useState("current")
  const [selectedMajor, setSelectedMajor] = useState("all")
  const [year, setSelectedYear] = useState("all")
  const [employmentData, setEmploymentData] = useState(null)
  const [alumniMetrics, setAlumniMetrics] = useState(null)
  const [industryDistribution, setIndustryDistribution] = useState([])
  const [salaryProgression, setSalaryProgression] = useState([])
  const [topEmployers, setTopEmployers] = useState([])
  const [employmentByCourse, setEmploymentByCourse] = useState([])

  const { isLoading, data: alumni = [], isFetching, refetch } = useAdminDashboard(year)

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch()
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [refetch])

  useEffect(() => {
    const processAlumniData = () => {
      if (!Array.isArray(alumni?.alumni)) {
        setEmploymentData(null)
        setAlumniMetrics(null)
        setIndustryDistribution([])
        setSalaryProgression([])
        setTopEmployers([])
        setEmploymentByCourse([])
        return
      }

      try {
        const alumniList = alumni.alumni
        const totalAlumni = alumniList.length
        const course = alumni.course || []

        // Initialize counters for employment data
        let employedCount = 0
        let unemployedCount = 0
        let underEmployedCount = 0
        let activeThisYear = 0
        let totalSalary = 0
        let salaryCount = 0
        const satisfactionTotal = 0
        const satisfactionCount = 0
        const eventParticipationCount = 0
        const mentorshipCount = 0

        const byMajorData = {}
        const graduationYearData = {}
        const industryData = {}
        const employerData = {}
        const salaryByExperience = {}
        const courseEmploymentData = {}

        const currentYear = new Date().getFullYear()

        alumniList.forEach((alum) => {
          console.log(alum)
          const employmentStatus = alum.employment_status_id
          const femploymentStatus = alum.femployment_status_id
          const major = alum.course_id
          const courseData = course.find((item) => item.id === alum.course_id)
          console.log(courseData)
          const courseName = courseData.course_code || `Course ${alum.course_id}`

          const graduationYear = alum.graduation_year
          const industry = alum.industry
          const employer = alum.current_company
          const salary = alum.salary_range
          const yearsExperience = alum.years_experience

          // Count employment status
          if (employmentStatus === 1 || femploymentStatus === 1) {
            employedCount++
          } else if (employmentStatus === 2 || femploymentStatus === 2) {
            unemployedCount++
          } else if (employmentStatus === 3 || femploymentStatus === 3) {
            underEmployedCount++
          }

          // Count active this year (graduated in last 5 years)
          if (graduationYear && graduationYear >= currentYear - 5) {
            activeThisYear++
          }

          // Process salary data
          if (salary) {
            // Extract numbers including commas → "20,000" stays intact
            const salaryMatch = salary.match(/[\d,]+/g)

            if (salaryMatch && salaryMatch.length > 0) {
              // Convert "20,000" → 20000
              const numericValues = salaryMatch.map((num) => Number.parseInt(num.replace(/,/g, "")))

              const avgSalary = numericValues.reduce((sum, num) => sum + num, 0) / numericValues.length

              totalSalary += avgSalary
              salaryCount++
            }
          }

          // // Process salary data
          // if (salary) {
          //     const salaryMatch = salary.match(/\d+/g);
          //     if (salaryMatch && salaryMatch.length > 0) {
          //         const avgSalary =
          //             salaryMatch.reduce(
          //                 (sum, num) => sum + parseInt(num),
          //                 0
          //             ) / salaryMatch.length;
          //         totalSalary += avgSalary;
          //         salaryCount++;
          //     }
          // }

          // Process by course data for the new chart
          if (courseName) {
            if (!courseEmploymentData[courseName]) {
              courseEmploymentData[courseName] = {
                total: 0,
                employed: 0,
                unemployed: 0,
                underEmployed: 0,
                employmentRate: 0,
              }
            }

            courseEmploymentData[courseName].total++

            if (employmentStatus === 1 || femploymentStatus === 1) {
              courseEmploymentData[courseName].employed++
            } else if (employmentStatus === 2 || femploymentStatus === 2) {
              courseEmploymentData[courseName].unemployed++
            } else if (employmentStatus === 3 || femploymentStatus === 3) {
              courseEmploymentData[courseName].underEmployed++
            }
          }

          // Process by major data
          if (major) {
            if (!byMajorData[major]) {
              byMajorData[major] = {
                employed: 0,
                unemployed: 0,
                underEmployed: 0,
                total: 0,
                name: `Major ${major}`,
              }
            }
            byMajorData[major].total++
            if (employmentStatus === 1 || femploymentStatus === 1) {
              byMajorData[major].employed++
            } else if (employmentStatus === 2 || femploymentStatus === 2) {
              byMajorData[major].unemployed++
            } else if (employmentStatus === 3 || femploymentStatus === 3) {
              byMajorData[major].underEmployed++
            }
          }

          // Process graduation year data for trends
          if (graduationYear) {
            if (!graduationYearData[graduationYear]) {
              graduationYearData[graduationYear] = {
                employed: 0,
                unemployed: 0,
                underEmployed: 0,
                total: 0,
              }
            }
            graduationYearData[graduationYear].total++
            if (employmentStatus === 1 || femploymentStatus === 1) {
              graduationYearData[graduationYear].employed++
            } else if (employmentStatus === 2 || femploymentStatus === 2) {
              graduationYearData[graduationYear].unemployed++
            } else if (employmentStatus === 3 || femploymentStatus === 3) {
              graduationYearData[graduationYear].underEmployed++
            }
          }

          // Process industry distribution
          if (industry) {
            industryData[industry] = (industryData[industry] || 0) + 1
          }

          // Process employer data
          if (employer) {
            employerData[employer] = (employerData[employer] || 0) + 1
          }

          // Process salary progression by experience
          if (yearsExperience && salary) {
            const expKey = Math.floor(yearsExperience)

            // Parse salary numbers from string
            const salaryMatch = salary.match(/\d+/g)
            if (salaryMatch && salaryMatch.length > 0) {
              // Calculate midpoint of range
              const avgSalary = salaryMatch.reduce((sum, num) => sum + Number.parseInt(num), 0) / salaryMatch.length
              const roundedSalary = Math.round(avgSalary)

              // Initialize experience year entry
              if (!salaryByExperience[expKey]) {
                salaryByExperience[expKey] = {}
              }

              // Track count for each salary
              if (!salaryByExperience[expKey][roundedSalary]) {
                salaryByExperience[expKey][roundedSalary] = 0
              }
              salaryByExperience[expKey][roundedSalary] += 1
            }
          }
        })

        // Calculate employment rates for each course
        Object.keys(courseEmploymentData).forEach((courseName) => {
          const course = courseEmploymentData[courseName]
          course.employmentRate = course.total > 0 ? Math.round((course.employed / course.total) * 100) : 0
        })

        // Format course employment data for the chart
        const courseEmploymentFormatted = Object.entries(courseEmploymentData)
          .map(([courseName, data]) => ({
            course: courseName,
            total: data.total,
            employed: data.employed,
            unemployed: data.unemployed,
            underEmployed: data.underEmployed,
            employmentRate: data.employmentRate,
            employedPercentage: data.total > 0 ? Math.round((data.employed / data.total) * 100) : 0,
            unemployedPercentage: data.total > 0 ? Math.round((data.unemployed / data.total) * 100) : 0,
            underEmployedPercentage: data.total > 0 ? Math.round((data.underEmployed / data.total) * 100) : 0,
          }))
          .sort((a, b) => b.total - a.total)

        // Calculate employment data
        const currentData = [
          {
            name: "Employed",
            value: totalAlumni > 0 ? Math.round((employedCount / totalAlumni) * 100) : 0,
            color: "#32d1b3",
            count: employedCount,
          },
          {
            name: "Unemployed",
            value: totalAlumni > 0 ? Math.round((unemployedCount / totalAlumni) * 100) : 0,
            color: "#ff4d4f",
            count: unemployedCount,
          },
          {
            name: "Under Employed",
            value: totalAlumni > 0 ? Math.round((underEmployedCount / totalAlumni) * 100) : 0,
            color: "#faad14",
            count: underEmployedCount,
          },
        ]

        // Format trend data (last 6 years)
        const recentYears = Object.keys(graduationYearData)
          .map(Number)
          .filter((year) => year >= currentYear - 6)
          .sort((a, b) => a - b)

        const trendDataFormatted = recentYears.map((year) => ({
          month: year.toString(),
          employed:
            graduationYearData[year].total > 0
              ? Math.round((graduationYearData[year].employed / graduationYearData[year].total) * 100)
              : 0,
          unemployed:
            graduationYearData[year].total > 0
              ? Math.round((graduationYearData[year].unemployed / graduationYearData[year].total) * 100)
              : 0,
          underEmployed:
            graduationYearData[year].total > 0
              ? Math.round((graduationYearData[year].underEmployed / graduationYearData[year].total) * 100)
              : 0,
        }))

        // Format by major data
        const byMajorFormatted = Object.values(byMajorData).map((data) => ({
          major: data.name,
          employed: data.total > 0 ? Math.round((data.employed / data.total) * 100) : 0,
          unemployed: data.total > 0 ? Math.round((data.unemployed / data.total) * 100) : 0,
          underEmployed: data.total > 0 ? Math.round((data.underEmployed / data.total) * 100) : 0,
          totalGraduates: data.total,
        }))

        // Format industry distribution
        const industryColors = ["#1890ff", "#52c41a", "#faad14", "#722ed1", "#fa541c", "#13c2c2"]
        const industryFormatted = Object.entries(industryData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, value], index) => ({
            name,
            value: Math.round((value / totalAlumni) * 100),
            color: industryColors[index] || "#666666",
          }))

        // Format salary progression for chart
        const salaryProgressionFormatted = []

        Object.entries(salaryByExperience)
          .sort(([a], [b]) => a - b)
          .forEach(([years, salariesObj]) => {
            Object.entries(salariesObj).forEach(([salary, count]) => {
              salaryProgressionFormatted.push({
                year: `${years} Year${years > 1 ? "s" : ""}`,
                salary: Number.parseInt(salary),
                alumniCount: count, // Track how many alumni have this salary
              })
            })
          })

        // Format top employers
        const topEmployersFormatted = Object.entries(employerData)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, hires]) => ({
            name,
            hires,
            trend: "up",
          }))

        // Calculate metrics
        const averageSalary = salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0

        setEmploymentData({
          current: currentData,
          trend: trendDataFormatted,
          byMajor: byMajorFormatted,
          summary: {
            totalAlumni,
            employedCount,
            unemployedCount,
            underEmployedCount,
          },
        })

        setAlumniMetrics({
          totalAlumni,
          activeThisYear,
          averageSalary,
          satisfactionRate: 4.7, // You can calculate this from actual data if available
          eventParticipation: 68, // You can calculate this from actual data if available
          mentorshipEngagement: 42, // You can calculate this from actual data if available
        })

        setIndustryDistribution(industryFormatted)
        setSalaryProgression(salaryProgressionFormatted)
        setTopEmployers(topEmployersFormatted)
        setEmploymentByCourse(courseEmploymentFormatted)
      } catch (err) {
        console.error("Error processing alumni data:", err)
        // Set default/fallback data
        setEmploymentData({
          current: [
            {
              name: "Employed",
              value: 0,
              color: "#32d1b3",
              count: 0,
            },
            {
              name: "Unemployed",
              value: 0,
              color: "#ff4d4f",
              count: 0,
            },
            {
              name: "Under Employed",
              value: 0,
              color: "#faad14",
              count: 0,
            },
          ],
          trend: [],
          byMajor: [],
          summary: {
            totalAlumni: 0,
            employedCount: 0,
            unemployedCount: 0,
            underEmployedCount: 0,
          },
        })
        setAlumniMetrics({
          totalAlumni: 0,
          activeThisYear: 0,
          averageSalary: 0,
          satisfactionRate: 0,
          eventParticipation: 0,
          mentorshipEngagement: 0,
        })
        setIndustryDistribution([])
        setSalaryProgression([])
        setTopEmployers([])
        setEmploymentByCourse([])
      }
    }

    processAlumniData()
  }, [alumni])

  // Chart Components
  const EmploymentPieChart = () => (
    <div className="chart-container">
      <Title level={4}>Overall Employment Status</Title>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={employmentData?.current || []}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {(employmentData?.current || []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip formatter={(value, name) => [`${value}%`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend">
        {(employmentData?.current || []).map((item, index) => (
          <div key={index} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: item.color }} />
            <Text>{item.name}</Text>
            <Text strong>{item.value}%</Text>
            <Text type="secondary">({item.count} alumni)</Text>
          </div>
        ))}
      </div>
    </div>
  )

  const EmploymentTrendChart = () => (
    <div className="chart-container">
      <Title level={4}>Employment Trend (Last 6 Years)</Title>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={employmentData?.trend || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <RechartsTooltip formatter={(value) => [`${value}%`, "Percentage"]} />
          <Legend />
          <Area
            type="monotone"
            dataKey="employed"
            stackId="1"
            stroke="#32d1b3"
            fill="#32d1b3"
            fillOpacity={0.6}
            name="Employed"
          />
          <Area
            type="monotone"
            dataKey="underEmployed"
            stackId="1"
            stroke="#faad14"
            fill="#faad14"
            fillOpacity={0.6}
            name="Under Employed"
          />
          <Area
            type="monotone"
            dataKey="unemployed"
            stackId="1"
            stroke="#ff4d4f"
            fill="#ff4d4f"
            fillOpacity={0.6}
            name="Unemployed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )

  const IndustryDistributionChart = () => (
    <div className="chart-container">
      <Title level={4}>Industry Distribution</Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={industryDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip formatter={(value) => [`${value}%`, "Percentage"]} />
          <Bar dataKey="value" name="Percentage">
            {industryDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList dataKey="value" position="top" formatter={(value) => `${value}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
  const SalaryProgressionChart = () => (
    <div className="chart-container">
      <Title level={4}>Average Salary Progression</Title>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salaryProgression}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <RechartsTooltip
            formatter={(value, name, props) => {
              const { payload } = props
              const count = payload.alumniCount || 1 // default 1 if undefined
              return [`₱${value?.toLocaleString() || 0}${count > 1 ? ` (${count} Alumni)` : ""}`, "Salary"]
            }}
          />
          <Line
            type="monotone"
            dataKey="salary"
            stroke="#1890ff"
            strokeWidth={3}
            dot={{ fill: "#1890ff" }}
            name="Salary"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  const EmploymentByMajorTable = () => (
    <div className="chart-container">
      <Title level={4}>Employment by Major</Title>
      <Table
        dataSource={employmentData?.byMajor || []}
        pagination={false}
        size="small"
        loading={!employmentData}
        columns={[
          {
            title: "Major",
            dataIndex: "major",
            key: "major",
          },
          {
            title: "Employed",
            dataIndex: "employed",
            key: "employed",
            render: (value) => <Text strong>{value}%</Text>,
          },
          {
            title: "Unemployed",
            dataIndex: "unemployed",
            key: "unemployed",
            render: (value) => <Text type="secondary">{value}%</Text>,
          },
          {
            title: "Under Employed",
            dataIndex: "underEmployed",
            key: "underEmployed",
            render: (value) => <Text type="secondary">{value}%</Text>,
          },
          {
            title: "Total Graduates",
            dataIndex: "totalGraduates",
            key: "totalGraduates",
            render: (value) => <Text>{value}</Text>,
          },
        ]}
      />
    </div>
  )

  const EmploymentByCourseChart = () => (
    <div className="chart-container" style={{ marginBottom: 20 }}>
      <Title level={4}>Employment Statistics by Course</Title>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={employmentByCourse} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <RechartsTooltip
            formatter={(value, name) => {
              if (name === "Employment Rate") {
                return [`${value}%`, name]
              }
              return [value, name]
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="employed" name="Employed" fill="#32d1b3" barSize={20} />
          <Bar yAxisId="left" dataKey="unemployed" name="Unemployed" fill="#ff4d4f" barSize={20} />
          <Bar yAxisId="left" dataKey="underEmployed" name="Under Employed" fill="#faad14" barSize={20} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="employmentRate"
            name="Employment Rate"
            stroke="#1890ff"
            strokeWidth={3}
            dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Course Employment Summary Table - FIXED */}
      <Table
        dataSource={employmentByCourse}
        pagination={false}
        size="small"
        style={{ marginTop: 20 }}
        scroll={{ x: 600 }}
        rowKey="course"
        columns={[
          {
            title: "Course",
            dataIndex: "course",
            key: "course",
            fixed: "left",
            width: 150,
            render: (text) => (
              <Tooltip title={text}>
                <Text strong>{text.length > 20 ? `${text.substring(0, 20)}...` : text}</Text>
              </Tooltip>
            ),
          },
          {
            title: "Total Alumni",
            dataIndex: "total",
            key: "total",
            render: (value) => <Text>{value}</Text>,
          },
          {
            title: "Employed",
            key: "employed",
            render: (_, record) => (
              <Space>
                <Text strong>{record.employed}</Text>
                <Text type="secondary">({record.employedPercentage}%)</Text>
              </Space>
            ),
          },
          {
            title: "Unemployed",
            key: "unemployed",
            render: (_, record) => (
              <Space>
                <Text type="danger">{record.unemployed}</Text>
                <Text type="secondary">({record.unemployedPercentage}%)</Text>
              </Space>
            ),
          },
          {
            title: "Under Employed",
            key: "underEmployed",
            render: (_, record) => (
              <Space>
                <Text type="warning">{record.underEmployed}</Text>
                <Text type="secondary">({record.underEmployedPercentage}%)</Text>
              </Space>
            ),
          },
          {
            title: "Employment Rate",
            dataIndex: "employmentRate",
            key: "employmentRate",
            render: (value) => (
              <Progress
                percent={value}
                size="small"
                status={value >= 80 ? "success" : value >= 60 ? "normal" : "exception"}
              />
            ),
          },
        ]}
      />
    </div>
  )
  const EmploymentByCourseStackedChart = () => (
    <div className="chart-container">
      <Title level={4}>Employment Distribution by Course (%)</Title>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={employmentByCourse} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
          <YAxis />
          <RechartsTooltip formatter={(value, name) => [`${value}%`, name]} />
          <Legend />
          <Bar dataKey="employedPercentage" name="Employed %" stackId="a" fill="#32d1b3" />
          <Bar dataKey="underEmployedPercentage" name="Under Employed %" stackId="a" fill="#faad14" />
          <Bar dataKey="unemployedPercentage" name="Unemployed %" stackId="a" fill="#ff4d4f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  const TopEmployersList = () => (
    <Card title="Top Employers" className="chart-container">
      <List
        dataSource={topEmployers}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: ["#1890ff", "#52c41a", "#faad14", "#722ed1", "#fa541c", "#13c2c2"][index % 6],
                  }}
                >
                  {item.name.charAt(0)}
                </Avatar>
              }
              title={item.name}
              description={`${item.hires} hires`}
            />
            <div>
              <Tag color={item.trend === "up" ? "green" : item.trend === "down" ? "red" : "orange"}>{item.trend}</Tag>
            </div>
          </List.Item>
        )}
      />
    </Card>
  )

  const getStatusTag = (status) => {
    const statusConfig = {
      employed: { color: "green", text: "Employed" },
      unemployed: { color: "red", text: "Seeking" },
      under_employed: { color: "orange", text: "Under Employed" },
      graduate_school: { color: "blue", text: "Graduate School" },
    }
    const config = statusConfig[status] || {
      color: "default",
      text: status,
    }
    return <Tag color={config.color}>{config.text}</Tag>
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="alumni-dashboard">
          <Card>
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Progress type="circle" percent={30} />
              <Title level={3} style={{ marginTop: 20 }}>
                Loading Alumni Data...
              </Title>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="alumni-dashboard">
        {/* Header Section */}
        <Card className="dashboard-header-card">
          <div className="dashboard-header">
            <div>
              <Title level={2}>Alumni Dashboard</Title>
              <Text type="secondary">
                Comprehensive overview of alumni employment, career progression, and engagement metrics
              </Text>
            </div>
            <div className="header-controls">
              <Select value={year} onChange={setSelectedYear} style={{ width: 120 }} placeholder="Select Year">
                <Option value="all">All Years</Option>
                {Array.from({ length: 25 }, (_, i) => {
                  const yearValue = 2025 - i
                  return (
                    <Option key={yearValue} value={yearValue.toString()}>
                      {yearValue}
                    </Option>
                  )
                })}
              </Select>
            </div>
          </div>
        </Card>

        {/* Metrics Row */}
        <Row gutter={[24, 24]} className="metrics-row">
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Total Alumni"
                value={alumniMetrics?.totalAlumni || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress percent={100} showInfo={false} status="active" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Active This Year"
                value={alumniMetrics?.activeThisYear || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
              <Progress
                percent={
                  alumniMetrics?.totalAlumni
                    ? Math.round((alumniMetrics.activeThisYear / alumniMetrics.totalAlumni) * 100)
                    : 0
                }
                showInfo={false}
                status="active"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Average Salary"
                value={alumniMetrics?.averageSalary || 0}
                // prefix={<DollarOutlined />}
                valueStyle={{ color: "#faad14" }}
                formatter={(value) => `₱${value?.toLocaleString() || 0}`}
              />
              <Text type="secondary">Based on reported salaries</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card">
              <Statistic
                title="Overall Employment Rate"
                value={
                  employmentData?.summary
                    ? Math.round((employmentData.summary.employedCount / employmentData.summary.totalAlumni) * 100)
                    : 0
                }
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
              <Rate disabled value={alumniMetrics?.satisfactionRate || 0} allowHalf />
            </Card>
          </Col>
        </Row>

        {/* New Employment by Course Chart */}
        <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
          <Col xs={24}>
            <EmploymentByCourseChart />
          </Col>
        </Row>

        {/* Charts Row 1 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <EmploymentPieChart />
          </Col>
          <Col xs={24} lg={12}>
            <EmploymentTrendChart />
          </Col>
        </Row>

        {/* Charts Row 2 */}
        <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
          <Col xs={24} lg={12}>
            <IndustryDistributionChart />
          </Col>
          <Col xs={24} lg={12}>
            <SalaryProgressionChart />
          </Col>
        </Row>

        {/* Additional Data */}
        <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
          <Col xs={24} lg={12}>
            <EmploymentByMajorTable />
          </Col>
          <Col xs={24} lg={12}>
            <TopEmployersList />
          </Col>
        </Row>

        {/* Alternative Stacked Chart (optional) */}
        {/* <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
                    <Col xs={24}>
                        <EmploymentByCourseStackedChart />
                    </Col>
                </Row> */}
      </div>
    </Layout>
  )
}

export default AlumniDashboard
