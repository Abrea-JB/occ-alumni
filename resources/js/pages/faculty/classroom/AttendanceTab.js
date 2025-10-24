import {
    Card,
    Button,
    Spin,
    Empty,
    Typography,
    Popover,
    Image,
    Table,
    Input,
    Space,
    Tag,
    Radio,
    Modal,
    Form,
    DatePicker,
    Checkbox,
    TimePicker,
    Select,
    message,
    Statistic,
    Row,
    Col,
    Progress,
    Divider,
    List,
    Avatar,
    FloatButton,
    Tooltip,
} from "antd";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";
import useClassroomAttendance from "~/hooks/useClassroomAttendance";
import { useParams } from "react-router-dom";
import {
    CheckOutlined,
    CloseOutlined,
    ClockCircleOutlined,
    SearchOutlined,
    BookOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    BarChartOutlined,
    UserOutlined,
    TeamOutlined,
    CalendarOutlined,
    CheckSquareOutlined,
    CloseSquareOutlined,
    FieldTimeOutlined,
    FilterOutlined,
    RadarChartOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { ATTENDANCE_IMAGE } from "~/utils/constant";
import Highlighter from "react-highlight-words";
import useClassroomStore from "~/states/classroomState";
import { FloatingButton, MapboxRadarScan } from "~/components";

const { Option } = Select;
const { Search } = Input;

const AttendancePopover = React.memo(({ attendanceRecord, onViewDetails }) => {
    const popoverContent = attendanceRecord?.attendace_image ? (
        <Image
            src={`${ATTENDANCE_IMAGE}${attendanceRecord.attendace_image}`}
            alt="Attendance Image"
            width={150}
            height={150}
        />
    ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No image" />
    );

    const popoverTitle = (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {attendanceRecord?.term && (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <BookOutlined
                        style={{
                            marginRight: 6,
                            color:
                                attendanceRecord.term
                                    ?.toString()
                                    .toLowerCase() === "midterm"
                                    ? "#1890ff"
                                    : "#52c41a",
                        }}
                    />
                    <Tag
                        color={
                            attendanceRecord.term?.toString().toLowerCase() ===
                            "midterm"
                                ? "blue"
                                : "green"
                        }
                        style={{ margin: 0 }}
                    >
                        {attendanceRecord.term?.toUpperCase() || "N/A"}
                    </Tag>
                </div>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
                <ClockCircleOutlined style={{ marginRight: 6 }} />
                <span>
                    {attendanceRecord?.date_time &&
                    dayjs(attendanceRecord.date_time).isValid()
                        ? dayjs(attendanceRecord.date_time).format("h:mm A")
                        : "No time recorded"}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <CheckCircleOutlined
                    style={{
                        marginRight: 6,
                        color:
                            attendanceRecord.status
                                ?.toString()
                                .toLowerCase() === "late"
                                ? "#cf1322"
                                : "#52c41a",
                    }}
                />
                <Tag
                    color={
                        attendanceRecord.status?.toString().toLowerCase() ===
                        "late"
                            ? "red"
                            : "green"
                    }
                    style={{ margin: 0 }}
                >
                    {attendanceRecord.status?.toUpperCase() || "N/A"}
                </Tag>
            </div>
        </div>
    );

    return (
        <Popover
            styles={{ width: "200px" }}
            content={popoverContent}
            title={popoverTitle}
            trigger="click"
        >
            <Button
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => onViewDetails(attendanceRecord)}
            />
        </Popover>
    );
});

// Enhanced DaySummaryModal component with better design
const DaySummaryModal = ({
    visible,
    onCancel,
    date,
    attendanceData,
    students,
}) => {
    if (!visible || !date || !attendanceData) return null;

    const dayAttendance = attendanceData.filter(
        (att) =>
            dayjs(att.date_time).isValid() &&
            dayjs(att.date_time).format("YYYY-MM-DD") ===
                dayjs(date).format("YYYY-MM-DD")
    );

    const presentCount = dayAttendance.length;
    const totalStudents = students?.length || 0;
    const absentCount = totalStudents - presentCount;
    const lateCount = dayAttendance.filter(
        (att) => att.status === "late"
    ).length;
    const onTimeCount = presentCount - lateCount;
    const attendanceRate = totalStudents
        ? (presentCount / totalStudents) * 100
        : 0;

    // Get attendance by time slots (morning, afternoon, etc.)
    const getTimeSlot = (time) => {
        const hour = dayjs(time).hour();
        if (hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        return "Evening";
    };

    const timeSlots = dayAttendance.reduce((acc, att) => {
        const slot = getTimeSlot(att.date_time);
        acc[slot] = (acc[slot] || 0) + 1;
        return acc;
    }, {});

    return (
        <Modal
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CalendarOutlined style={{ color: "#1890ff" }} />
                    <span>
                        Attendance Summary -{" "}
                        {dayjs(date).format("dddd, MMMM D, YYYY")}
                    </span>
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    Close
                </Button>,
            ]}
            width={1000}
            bodyStyle={{ padding: "16px 24px" }}
        >
            <div style={{ marginBottom: 20 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card
                            size="small"
                            style={{
                                textAlign: "center",
                                background: "#fafafa",
                            }}
                        >
                            <Statistic
                                title="Total Students"
                                value={totalStudents}
                                prefix={
                                    <TeamOutlined
                                        style={{ color: "#1890ff" }}
                                    />
                                }
                                valueStyle={{ color: "#1890ff" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            size="small"
                            style={{
                                textAlign: "center",
                                background: "#f6ffed",
                            }}
                        >
                            <Statistic
                                title="Present"
                                value={presentCount}
                                prefix={
                                    <CheckSquareOutlined
                                        style={{ color: "#52c41a" }}
                                    />
                                }
                                valueStyle={{ color: "#52c41a" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            size="small"
                            style={{
                                textAlign: "center",
                                background: "#fff2f0",
                            }}
                        >
                            <Statistic
                                title="Absent"
                                value={absentCount}
                                prefix={
                                    <CloseSquareOutlined
                                        style={{ color: "#ff4d4f" }}
                                    />
                                }
                                valueStyle={{ color: "#ff4d4f" }}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            size="small"
                            style={{
                                textAlign: "center",
                                background: "#fff7e6",
                            }}
                        >
                            <Statistic
                                title="Late"
                                value={lateCount}
                                prefix={
                                    <FieldTimeOutlined
                                        style={{ color: "#fa8c16" }}
                                    />
                                }
                                valueStyle={{ color: "#fa8c16" }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12}>
                    <div style={{ marginBottom: 16 }}>
                        <Typography.Title level={5} style={{ marginBottom: 8 }}>
                            Attendance Rate
                        </Typography.Title>
                        <Progress
                            percent={Math.round(attendanceRate)}
                            status={
                                attendanceRate >= 80
                                    ? "success"
                                    : attendanceRate >= 60
                                    ? "normal"
                                    : "exception"
                            }
                            size="large"
                            format={(percent) => `${percent}%`}
                        />
                    </div>

                    {Object.keys(timeSlots).length > 0 && (
                        <div>
                            <Typography.Title
                                level={5}
                                style={{ marginBottom: 8 }}
                            >
                                Attendance by Time Slot
                            </Typography.Title>
                            {Object.entries(timeSlots).map(([slot, count]) => (
                                <div
                                    key={slot}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <span>{slot}</span>
                                    <Tag color="blue">{count} students</Tag>
                                </div>
                            ))}
                        </div>
                    )}
                </Col>

                <Col span={12}>
                    <Typography.Title level={5} style={{ marginBottom: 8 }}>
                        Status Distribution
                    </Typography.Title>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Present</span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Progress
                                    percent={Math.round(
                                        (onTimeCount / totalStudents) * 100
                                    )}
                                    showInfo={false}
                                    size="small"
                                    strokeColor="#52c41a"
                                    style={{ width: 100 }}
                                />
                                <Tag color="green">{onTimeCount}</Tag>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Late</span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Progress
                                    percent={Math.round(
                                        (lateCount / totalStudents) * 100
                                    )}
                                    showInfo={false}
                                    size="small"
                                    strokeColor="#faad14"
                                    style={{ width: 100 }}
                                />
                                <Tag color="orange">{lateCount}</Tag>
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Absent</span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Progress
                                    percent={Math.round(
                                        (absentCount / totalStudents) * 100
                                    )}
                                    showInfo={false}
                                    size="small"
                                    strokeColor="#ff4d4f"
                                    style={{ width: 100 }}
                                />
                                <Tag color="red">{absentCount}</Tag>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {presentCount > 0 && (
                <>
                    <Divider style={{ margin: "16px 0" }} />
                    <div>
                        <Typography.Title
                            level={5}
                            style={{
                                marginBottom: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <UserOutlined />
                            Present Students ({presentCount})
                        </Typography.Title>
                        <List
                            size="small"
                            dataSource={dayAttendance}
                            pagination={
                                dayAttendance.length > 5
                                    ? {
                                          pageSize: 5,
                                          size: "small",
                                          showSizeChanger: false,
                                      }
                                    : false
                            }
                            renderItem={(att) => {
                                const student = students?.find(
                                    (s) => s.student.id === att.student_id
                                );
                                const name = student
                                    ? `${student.student.lname}, ${student.student.fname}`
                                    : "Unknown Student";
                                const time = dayjs(att.date_time).format(
                                    "h:mm A"
                                );

                                return (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    size="small"
                                                    icon={<UserOutlined />}
                                                />
                                            }
                                            title={name}
                                            description={
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <Tag
                                                        color={
                                                            att.status ===
                                                            "late"
                                                                ? "orange"
                                                                : "green"
                                                        }
                                                        size="small"
                                                    >
                                                        {att.status}
                                                    </Tag>
                                                    <span
                                                        style={{
                                                            color: "#999",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {time}
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                    </div>
                </>
            )}
        </Modal>
    );
};

const useAttendanceTableColumns = ({
    attendanceDates,
    filteredAttendances,
    handleViewDetails,
    isXsScreen,
    getColumnSearchProps,
    onShowDaySummary,
}) => {
    return useMemo(() => {
        const dateColumns = (attendanceDates || []).map((date) => {
            // Calculate attendance stats for this date
            const dayAttendance =
                filteredAttendances?.filter(
                    (att) =>
                        dayjs(att?.date_time).isValid() &&
                        dayjs(att?.date_time).format("YYYY-MM-DD") ===
                            dayjs(date).format("YYYY-MM-DD")
                ) || [];

            const presentCount = dayAttendance.length;
            const lateCount = dayAttendance.filter(
                (att) => att.status === "late"
            ).length;

            return {
                title: (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => onShowDaySummary(date)}
                    >
                        <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                            {dayjs(date).isValid()
                                ? dayjs(date).format("MMM D")
                                : "Invalid Date"}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background:
                                    presentCount > 0 ? "#f6ffed" : "#fff2f0",
                                border: `1px solid ${
                                    presentCount > 0 ? "#b7eb8f" : "#ffccc7"
                                }`,
                            }}
                        >
                            <BarChartOutlined
                                style={{
                                    color:
                                        presentCount > 0
                                            ? lateCount > 0
                                                ? "#faad14"
                                                : "#52c41a"
                                            : "#ff4d4f",
                                    fontSize: 16,
                                }}
                            />
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                marginTop: 4,
                                color: "#666",
                            }}
                        >
                            {presentCount > 0
                                ? `${presentCount} present`
                                : "No attendance"}
                        </div>
                    </div>
                ),
                key: date,
                align: "center",
                width: isXsScreen ? 80 : 100,
                render: (_, record) => {
                    const studentId = record?.student?.id;
                    if (!studentId) return null;

                    const attendanceRecord = filteredAttendances?.find(
                        (att) =>
                            att?.student_id === studentId &&
                            dayjs(att?.date_time).isValid() &&
                            dayjs(date).isValid() &&
                            dayjs(att?.date_time).format("YYYY-MM-DD") ===
                                dayjs(date).format("YYYY-MM-DD")
                    );

                    if (!attendanceRecord) {
                        return (
                            <Button
                                className="btn-absent"
                                danger
                                shape="circle"
                                icon={<CloseOutlined />}
                                size="small"
                            />
                        );
                    }

                    return (
                        <AttendancePopover
                            attendanceRecord={attendanceRecord}
                            onViewDetails={handleViewDetails}
                        />
                    );
                },
            };
        });

        return [
            {
                title: "No.",
                key: "index",
                width: 60,
                align: "center",
                render: (_, __, index) => index + 1,
            },
            {
                title: "Name",
                key: "name",
                fixed: isXsScreen ? "left" : false,
                width: isXsScreen ? 150 : undefined,
                ...getColumnSearchProps("name"),
                ellipsis: true,
                fixed: true,
            },
            ...dateColumns,
            {
                title: "Summary",
                key: "summary",
                align: "center",
                fixed: isXsScreen ? "right" : false,
                width: isXsScreen ? 100 : 150,
                render: (_, record) => {
                    const studentId = record?.student?.id;
                    if (!studentId) return null;

                    const presentCount = filteredAttendances?.filter(
                        (att) => att?.student_id === studentId
                    ).length;
                    const totalDays = (attendanceDates || []).length;
                    const attendanceRate =
                        totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Tag
                                color={
                                    presentCount === totalDays
                                        ? "green"
                                        : presentCount > 0
                                        ? "orange"
                                        : "red"
                                }
                                style={{ marginBottom: 4 }}
                            >
                                {presentCount}/{totalDays}
                            </Tag>
                            <Progress
                                percent={Math.round(attendanceRate)}
                                size="small"
                                showInfo={false}
                                status={
                                    attendanceRate >= 80
                                        ? "success"
                                        : attendanceRate >= 60
                                        ? "normal"
                                        : "exception"
                                }
                                style={{ width: 50 }}
                            />
                        </div>
                    );
                },
            },
        ];
    }, [
        attendanceDates,
        filteredAttendances,
        handleViewDetails,
        isXsScreen,
        getColumnSearchProps,
        onShowDaySummary,
    ]);
};

const ManualAttendanceForm = ({
    visible,
    onCancel,
    onSave,
    students,
    loading,
}) => {
    const [form] = Form.useForm();
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Initialize records with all students unchecked (absent by default)
    useEffect(() => {
        if (visible && students) {
            const initialRecords = students.map((student) => ({
                studentId: student.student.id,
                name: `${student.student.lname}, ${student.student.fname} ${student.student.mname}`,
                time: dayjs(),
                status: "present",
                checked: false, // Default to unchecked (absent)
            }));
            setAttendanceRecords(initialRecords);
        }
    }, [visible, students]);

    // Filter attendance records based on search and status
    const filteredRecords = useMemo(() => {
        return attendanceRecords.filter((record) => {
            // Search filter
            const matchesSearch =
                searchText === "" ||
                record.name.toLowerCase().includes(searchText.toLowerCase());

            // Status filter
            let matchesStatus = true;
            if (statusFilter !== "all") {
                matchesStatus =
                    statusFilter === "checked"
                        ? record.checked
                        : !record.checked;
            }

            return matchesSearch && matchesStatus;
        });
    }, [attendanceRecords, searchText, statusFilter]);

    const handleCheckAll = (checked) => {
        setAttendanceRecords((prev) =>
            prev.map((record) => ({
                ...record,
                checked,
                status: checked ? "present" : "absent",
            }))
        );
    };

    const handleCheckboxChange = (studentId, checked) => {
        setAttendanceRecords((prev) =>
            prev.map((record) =>
                record.studentId === studentId
                    ? {
                          ...record,
                          checked,
                          status: checked ? "present" : "absent",
                      }
                    : record
            )
        );
    };

    const handleTimeChange = (studentId, time) => {
        setAttendanceRecords((prev) =>
            prev.map((record) =>
                record.studentId === studentId ? { ...record, time } : record
            )
        );
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceRecords((prev) =>
            prev.map((record) =>
                record.studentId === studentId ? { ...record, status } : record
            )
        );
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Only include checked (present/late) students in submission
            const presentRecords = attendanceRecords
                .filter((record) => record.checked)
                .map((record) => ({
                    studentId: record.studentId,
                    time: record.time.format("HH:mm:ss"),
                    status: record.status,
                    date: values.date.format("YYYY-MM-DD"),
                }));

            if (presentRecords.length === 0) {
                message.warning("No students marked as present");
                return;
            }

            await onSave({
                date: values.date.format("YYYY-MM-DD"),
                records: presentRecords,
            });
            form.resetFields();
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    return (
        <Modal
            title="Add Manual Attendance"
            visible={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={loading}
            width={1000}
            bodyStyle={{ padding: 0 }}
            okText="Save Attendance"
        >
            <Form
                form={form}
                layout="vertical"
                style={{ padding: "24px 24px 0" }}
            >
                <Form.Item
                    name="date"
                    label="Date"
                    rules={[{ required: true, message: "Please select date" }]}
                    initialValue={dayjs()}
                >
                    <DatePicker style={{ width: 200 }} />
                </Form.Item>
            </Form>

            <div style={{ padding: "0 24px", marginBottom: 16 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                        }}
                    >
                        <Button
                            size="small"
                            onClick={() => handleCheckAll(true)}
                        >
                            Mark All Present
                        </Button>
                        <Button
                            size="small"
                            onClick={() => handleCheckAll(false)}
                        >
                            Mark All Absent
                        </Button>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                        }}
                    >
                        <Search
                            placeholder="Search students..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                            allowClear
                        />
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 120 }}
                            placeholder="Filter by"
                        >
                            <Option value="all">All</Option>
                            <Option value="checked">Present</Option>
                            <Option value="unchecked">Absent</Option>
                        </Select>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <span style={{ fontSize: "12px", color: "#666" }}>
                        Showing {filteredRecords.length} of{" "}
                        {attendanceRecords.length} students
                    </span>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                        {attendanceRecords.filter((r) => r.checked).length}{" "}
                        marked as present
                    </span>
                </div>
            </div>

            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    padding: "0 24px",
                }}
            >
                <Table
                    dataSource={filteredRecords}
                    rowKey="studentId"
                    pagination={false}
                    size="small"
                    columns={[
                        {
                            title: "#",
                            key: "number",
                            align: "center",
                            width: 50,
                            render: (_, __, index) => index + 1,
                        },
                        {
                            title: "Present",
                            dataIndex: "checked",
                            key: "select",
                            width: 80,
                            align: "center",
                            render: (checked, record) => (
                                <Checkbox
                                    checked={checked}
                                    onChange={(e) =>
                                        handleCheckboxChange(
                                            record.studentId,
                                            e.target.checked
                                        )
                                    }
                                />
                            ),
                        },
                        {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                            render: (name) => (
                                <span>
                                    {searchText ? (
                                        <Highlighter
                                            highlightStyle={{
                                                backgroundColor: "#ffc069",
                                                padding: 0,
                                            }}
                                            searchWords={[searchText]}
                                            autoEscape
                                            textToHighlight={name || ""}
                                        />
                                    ) : (
                                        name
                                    )}
                                </span>
                            ),
                        },
                        {
                            title: "Time",
                            dataIndex: "time",
                            key: "time",
                            width: 120,
                            render: (time, record) => (
                                <TimePicker
                                    value={time}
                                    onChange={(time) =>
                                        handleTimeChange(record.studentId, time)
                                    }
                                    format="HH:mm"
                                    style={{ width: "100%" }}
                                    disabled={!record.checked}
                                />
                            ),
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            key: "status",
                            width: 120,
                            render: (status, record) => (
                                <Select
                                    value={status}
                                    onChange={(status) =>
                                        handleStatusChange(
                                            record.studentId,
                                            status
                                        )
                                    }
                                    style={{ width: "100%" }}
                                    disabled={!record.checked}
                                >
                                    <Option value="present">Present</Option>
                                    <Option value="late">Late</Option>
                                </Select>
                            ),
                        },
                    ]}
                />
            </div>
        </Modal>
    );
};

const AttendanceTab = () => {
    const isXsScreen = false;
    const { id } = useParams();
    const {
        data: attendance = {},
        isFetching,
        error,
    } = useClassroomAttendance(id, {
        enabled: !!id,
    });
    const { manualAttendance } = useClassroomStore();
    const queryClient = useQueryClient();
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [imageData, setImageData] = useState("");
    const [filters, setFilters] = useState({});
    const [termFilter, setTermFilter] = useState("all");
    const [showManualForm, setShowManualForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [daySummaryModal, setDaySummaryModal] = useState({
        visible: false,
        date: null,
    });
    const [globalSearch, setGlobalSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = useCallback(
        (selectedKeys, confirm, dataIndex) => {
            confirm?.();
            setSearchText(selectedKeys?.[0] || "");
            setSearchedColumn(dataIndex || "");
            setFilters({ ...filters, [dataIndex]: selectedKeys?.[0] });
        },
        [filters]
    );

    const handleReset = useCallback(
        (clearFilters, dataIndex) => {
            clearFilters?.();
            setSearchText("");
            setSearchedColumn("");
            const newFilters = { ...filters };
            delete newFilters[dataIndex];
            setFilters(newFilters);
        },
        [filters]
    );

    const getColumnSearchProps = useCallback(
        (dataIndex) => ({
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys?.[0] || ""}
                        onChange={(e) => {
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            );
                            if (!e.target.value) {
                                handleReset(clearFilters, dataIndex);
                            }
                        }}
                        onPressEnter={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() =>
                                handleSearch(selectedKeys, confirm, dataIndex)
                            }
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters, dataIndex)}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined
                    style={{ color: filtered ? "#1890ff" : undefined }}
                />
            ),
            onFilter: (value, record) => {
                const student = record?.student || {};
                const fullName = `${student.lname || ""}, ${
                    student.fname || ""
                } ${student.mname || ""}`.toLowerCase();
                return fullName.includes((value || "").toLowerCase());
            },
            render: (text, record) => {
                const student = record?.student || {};
                const fullName = `${student.lname || ""}, ${
                    student.fname || ""
                } ${student.mname || ""}`;

                return searchedColumn === "name" && searchText ? (
                    <Highlighter
                        highlightStyle={{
                            backgroundColor: "#ffc069",
                            padding: 0,
                        }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={fullName || ""}
                    />
                ) : (
                    fullName || "N/A"
                );
            },
            filteredValue: filters[dataIndex] ? [filters[dataIndex]] : [],
        }),
        [handleReset, handleSearch, filters, searchText, searchedColumn]
    );

    const handleViewDetails = useCallback((details) => {
        if (!details) return;
        setImageData({
            url: details?.attendance_image
                ? `${ATTENDANCE_IMAGE}${details.attendance_image}`
                : null,
            time: details?.date_time
                ? dayjs(details.date_time).format("h:mm A")
                : null,
        });
    }, []);

    const handleShowDaySummary = useCallback((date) => {
        setDaySummaryModal({
            visible: true,
            date: date,
        });
    }, []);

    const handleCloseDaySummary = useCallback(() => {
        setDaySummaryModal({
            visible: false,
            date: null,
        });
    }, []);

    const attendances = Array.isArray(attendance?.attendances)
        ? attendance?.attendances
        : [];

    const filteredAttendances = useMemo(() => {
        return attendances?.filter((att) => {
            if (!att) return false;
            if (termFilter === "all") return true;
            return (
                att?.term?.toString().toLowerCase() ===
                termFilter?.toString().toLowerCase()
            );
        });
    }, [attendances, termFilter]);

    // Filter students based on global search and status filter
    const filteredStudents = useMemo(() => {
        if (!attendance?.students) return [];

        return attendance.students.filter((studentRecord) => {
            const student = studentRecord.student;
            const fullName = `${student.lname || ""}, ${student.fname || ""} ${
                student.mname || ""
            }`.toLowerCase();

            // Global search filter
            const matchesSearch =
                globalSearch === "" ||
                fullName.includes(globalSearch.toLowerCase());

            // Status filter
            let matchesStatus = true;
            if (statusFilter !== "all") {
                const studentAttendances = filteredAttendances.filter(
                    (att) => att.student_id === student.id
                );
                const presentCount = studentAttendances.length;
                const totalDays = (attendance?.attendance_dates || []).length;

                switch (statusFilter) {
                    case "present":
                        matchesStatus = presentCount > 0;
                        break;
                    case "absent":
                        matchesStatus = presentCount === 0;
                        break;
                    case "good":
                        matchesStatus = presentCount === totalDays;
                        break;
                    case "poor":
                        matchesStatus = presentCount < totalDays * 0.5;
                        break;
                    default:
                        matchesStatus = true;
                }
            }

            return matchesSearch && matchesStatus;
        });
    }, [
        attendance?.students,
        attendance?.attendance_dates,
        globalSearch,
        statusFilter,
        filteredAttendances,
    ]);

    const columns = useAttendanceTableColumns({
        attendanceDates: attendance?.attendance_dates,
        filteredAttendances,
        handleViewDetails,
        isXsScreen,
        getColumnSearchProps,
        onShowDaySummary: handleShowDaySummary,
    });

    if (error) {
        return (
            <Empty
                description={
                    <Typography.Text type="danger">
                        Failed to load attendance data
                    </Typography.Text>
                }
            />
        );
    }

    if (isFetching) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <Spin size="large" />
            </div>
        );
    }

    const tableScroll = {
        x: "max-content",
        y: 500,
        scrollToFirstRowOnChange: true,
    };

    const handleAddManualAttendance = () => {
        setShowManualForm(true);
    };

    const handleSaveManualAttendance = async (attendanceData) => {
        setIsSubmitting(true);
        attendanceData.class_id = id;
        try {
            const response = await manualAttendance(attendanceData);
            if (response?.status === 200) {
                queryClient.invalidateQueries("classroom-aattendance-list-all");
                message.success("Attendance recorded successfully");
                setShowManualForm(false);
            }
        } catch (error) {
            message.error("Failed to record attendance");
            console.error("Error saving manual attendance:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {!attendance ||
            !Array.isArray(attendance?.attendance_dates) ||
            attendance?.attendance_dates?.length === 0 ||
            !Array.isArray(attendance?.students) ||
            attendance?.students?.length === 0 ? (
                <>
                    {!showManualForm && (
                        <>
                            <FloatingButton
                                label="Create  Manual Attendance"
                                onClick={() => handleAddManualAttendance()}
                            />
                        </>
                    )}
                    <Empty description="No attendance data available" />
                    <ManualAttendanceForm
                        visible={showManualForm}
                        onCancel={() => setShowManualForm(false)}
                        onSave={handleSaveManualAttendance}
                        students={attendance?.students || []}
                        loading={isSubmitting}
                    />
                </>
            ) : (
                <Card
                    title="Attendance Sheet"
                    extra={
                        <Space>
                            <Search
                                placeholder="Search students..."
                                value={globalSearch}
                                onChange={(e) =>
                                    setGlobalSearch(e.target.value)
                                }
                                style={{ width: 200 }}
                                allowClear
                            />
                            <Select
                                value={statusFilter}
                                onChange={setStatusFilter}
                                style={{ width: 120 }}
                                placeholder="Status"
                                allowClear
                            >
                                <Option value="all">All Status</Option>
                                <Option value="present">Present</Option>
                                <Option value="absent">Absent</Option>
                                <Option value="good">Good</Option>
                                <Option value="poor">Poor</Option>
                            </Select>
                            <Radio.Group
                                value={termFilter}
                                onChange={(e) =>
                                    setTermFilter(e?.target?.value || "all")
                                }
                            >
                                <Radio.Button value="all">All</Radio.Button>
                                <Radio.Button value="midterm">
                                    Midterm
                                </Radio.Button>
                                <Radio.Button value="final">Final</Radio.Button>
                            </Radio.Group>
                        </Space>
                    }
                >
                    <ManualAttendanceForm
                        visible={showManualForm}
                        onCancel={() => setShowManualForm(false)}
                        onSave={handleSaveManualAttendance}
                        students={attendance?.students || []}
                        loading={isSubmitting}
                    />

                    <DaySummaryModal
                        visible={daySummaryModal.visible}
                        onCancel={handleCloseDaySummary}
                        date={daySummaryModal.date}
                        attendanceData={filteredAttendances}
                        students={attendance?.students}
                    />

                    <Table
                        columns={columns}
                        dataSource={filteredStudents}
                        rowKey={(record) =>
                            record?.student?.id || Math.random()
                        }
                        bordered
                        pagination={false}
                        scroll={tableScroll}
                        size={isXsScreen ? "small" : "middle"}
                        onChange={(pagination, filters, sorter) => {
                            if (!filters || Object.keys(filters).length === 0) {
                                setSearchText("");
                                setSearchedColumn("");
                                setFilters({});
                            }
                        }}
                        locale={{
                            emptyText: (
                                <Empty description="No students found" />
                            ),
                        }}
                        sticky
                    />
                    {!showManualForm && (
                        <>
                            <Tooltip
                                placement="leftTop"
                                title="Create  Manual Attendance"
                            >
                                <FloatButton
                                    icon={<CalendarOutlined />}
                                    onClick={() => handleAddManualAttendance()}
                                />
                            </Tooltip>
                            <Tooltip placement="leftTop" title="Radar Scan">
                                <FloatButton
                                    icon={<RadarChartOutlined />}
                                    style={{ insetBlockEnd: 108 }}
                                    label="Radar Scan"
                                    onClick={() => setIsModalOpen(true)}
                                />
                            </Tooltip>
                        </>
                    )}
                </Card>
            )}
            <MapboxRadarScan
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default React.memo(AttendanceTab);
