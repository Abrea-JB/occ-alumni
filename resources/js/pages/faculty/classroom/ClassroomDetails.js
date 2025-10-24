import {
    Menu,
    Card,
    message,
    Button,
    Spin,
    Empty,
    Typography,
    List,
    Dropdown,
    Popconfirm,
    Tabs,
    Badge,
    Tooltip,
    Input,
} from "antd";
import React, { useState, useEffect } from "react";
import {
    Layout,
    FloatingButton,
    HeaderTitle,
    Breadcrumb,
    UserAvatar,
} from "~/components";
import FormAddStudents from "./FormAddStudents";
import useClassroomStore from "~/states/classroomState";
import { useMutation, useQueryClient } from "react-query";
import useClassroomStudents from "~/hooks/useClassroomStudents";
import useClassroomAttendance from "~/hooks/useClassroomAttendance";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { DeleteOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import AttendanceDetails from "./AttendanceDetails";
import dayjs from "dayjs";
import { ATTENDANCE_IMAGE } from "~/utils/constant";
import ClassworkTab from "./ClassworkTab";
import GradeSheetTab from "./GradeSheetTab";
import CourseSyllabusTab from "./CourseSyllabusTab";
import SettingsTab from "./SettingsTab";
import AttendanceTab from "./AttendanceTab";
import BroadcastTab from "./BroadcastTab";
import OverviewTab from "./OverviewTab";
import QuestionTab from "./QuestionTab";
import QuizForm from "./QuizForm";
import PresentationTab from "./PresentationTab";
import ResearchPaperList from "./ResearchPaperList";
import NotificationPage from "./NotificationPage";
import useGlobalStore from "~/states/globalState";
import { getStorage } from "~/utils/helper";
import { PROFILE } from "~/utils/constant";
import { useLoadingStore } from "~/states/loadingState";

const { Title, Text, Paragraph, Link } = Typography;
const { TabPane } = Tabs;

const ClassroomDetails = () => {
    const history = useHistory();
    const { id } = useParams();
    const { data: students = [], isFetching } = useClassroomStudents(id);
    const { data: attendance, isFetching: fetchingClassroom } =
        useClassroomAttendance(id);
    const { addStudentClassroom, setField, deleteStudentClassroom } =
        useClassroomStore();
    const { setField: setFieldGlobal } = useGlobalStore();
    const queryClient = useQueryClient();
    const role = getStorage("userRole");
    const { showLoading, hideLoading } = useLoadingStore();
    const [searchText, setSearchText] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);

    const [imageData, setImageData] = useState({
        url: null,
        time: null,
    });

    // Filter students based on search text
    useEffect(() => {
        if (searchText.trim() === "") {
            setFilteredStudents(students);
        } else {
            const query = searchText.toLowerCase();
            const filtered = students.filter((student) => {
                const fullName = `${student.student?.fname || ""} ${
                    student.student?.mname || ""
                } ${student.student?.lname || ""}`.toLowerCase();
                const studentId =
                    student.student?.student_id?.toLowerCase() || "";
                const department =
                    student.student?.course?.dept_name?.toLowerCase() || "";

                return (
                    fullName.includes(query) ||
                    studentId.includes(query) ||
                    department.includes(query)
                );
            });
            setFilteredStudents(filtered);
        }
    }, [searchText, students]);

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleDelete = async (studentId) => {
        const response = await deleteStudentClassroom({ id, studentId });
        if (response?.status === 200) {
            queryClient.invalidateQueries("classroom-student-list");
            message.success("Student deleted successfully!");
        }
    };

    const mutation = useMutation(addStudentClassroom, {
        onMutate: () => {
            showLoading("Processing data...");
            setField("isSubmit", true);
        },
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries("classroom-student-list");
                message.success("Student added successfully!");
                setTimeout(() => {
                    setField("formStudent", false);
                    setField("isClear", false);
                    setField("isSubmit", false);
                    hideLoading();
                }, 500);
            } else {
                setField("isSubmit", false);
            }
        },
        onError: () => {
            message.error("Failed to add student. Please try again.");
        },
    });

    // Create the menu for the dropdown
    const menu = (studentId) => (
        <Menu>
            <Menu.Item key="delete">
                <Popconfirm
                    title="Are you sure you want to delete this student?"
                    onConfirm={() => handleDelete(studentId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="link" icon={<DeleteOutlined />} danger>
                        Remove
                    </Button>
                </Popconfirm>
            </Menu.Item>
        </Menu>
    );

    const handleViewDetails = (details) => {
        setImageData({
            url: ATTENDANCE_IMAGE + details?.attendace_image,
            time: dayjs(details?.date_time).format("h:mm A"),
        });
    };

    const attendances = Array.isArray(attendance?.attendances)
        ? attendance.attendances
        : [];

    return (
        <>
            <AttendanceDetails />
            <Layout
                breadcrumb={Breadcrumb.Faculty(["Classroom", "Class Details"])}
            >
                <HeaderTitle
                    title={attendance?.classroom?.class_name || ""}
                    action={() => history.goBack()}
                />

                <Tabs
                    defaultActiveKey="overview"
                    tabBarGutter={32}
                    type="line"
                    className="classroom-tab"
                >
                    <TabPane tab="Overview" key="overview">
                        <OverviewTab />
                    </TabPane>
                    <TabPane tab="Broadcast" key="broadcast">
                        <BroadcastTab />
                    </TabPane>
                    {/* <TabPane tab="Research Paper" key="capstone">
                        <ResearchPaperList />
                    </TabPane> */}
                    <TabPane tab="Classwork" key="classwork">
                        <ClassworkTab />
                    </TabPane>
                    <TabPane tab="Presentation" key="presentation">
                        <PresentationTab />
                    </TabPane>
                    <TabPane tab="Attendance" key="attendance">
                        <AttendanceTab />
                    </TabPane>
                    <TabPane tab="Students" key="students">
                        <Card>
                            {isFetching ? (
                                <Spin />
                            ) : students.length > 0 ? (
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: 16,
                                        }}
                                    >
                                        <Title
                                            level={5}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                margin: 0,
                                            }}
                                        >
                                            Student List
                                            <Badge
                                                count={filteredStudents.length}
                                                style={{
                                                    backgroundColor: "#1890ff",
                                                    fontSize: 12,
                                                    fontWeight: "normal",
                                                    boxShadow: "none",
                                                }}
                                                showZero
                                            />
                                        </Title>
                                        <Input
                                            placeholder="Search students..."
                                            allowClear
                                            value={searchText}
                                            onChange={(e) =>
                                                setSearchText(e.target.value)
                                            }
                                            onSearch={handleSearch}
                                            style={{ width: 250 }}
                                            prefix={<SearchOutlined />}
                                        />
                                    </div>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={filteredStudents}
                                        renderItem={(student) => (
                                            <List.Item
                                                key={student.id}
                                                actions={[
                                                    <Dropdown
                                                        overlay={menu(
                                                            student.student_id
                                                        )}
                                                        trigger={["click"]}
                                                        key={`dropdown-${student.student_id}`}
                                                    >
                                                        <Button
                                                            icon={
                                                                <MoreOutlined />
                                                            }
                                                            
                                                            shape="circle"
                                                        />
                                                    </Dropdown>,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <UserAvatar
                                                            imageUrl={`${PROFILE}${student?.student?.user?.image}`}
                                                        />
                                                    }
                                                    title={
                                                        <Tooltip title="View Details">
                                                            <Link
                                                                onClick={() =>
                                                                    // console.log(
                                                                    //     student
                                                                    //         ?.student
                                                                    //         ?.student_id
                                                                    // )
                                                                    setFieldGlobal(
                                                                        "studentProfile",
                                                                        true
                                                                    )
                                                                }
                                                                className="link"
                                                            >
                                                                {`(${student?.student?.student_id}) - ${student?.student?.lname}, ${student?.student?.fname} ${student?.student?.mname}`}
                                                            </Link>
                                                        </Tooltip>
                                                    }
                                                    description={
                                                        student?.student?.course
                                                            ?.dept_name
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </>
                            ) : (
                                <Empty description="No students yet">
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setField("formStudent", true);
                                        }}
                                    >
                                        Add Student
                                    </Button>
                                </Empty>
                            )}
                        </Card>
                        <FloatingButton
                            label="Add Student"
                            onClick={() => setField("formStudent", true)}
                        />
                    </TabPane>
                    <TabPane tab="Notification" key="notification">
                        <NotificationPage />
                    </TabPane>
                    <TabPane
                        tab={
                            role === "student"
                                ? "Progress Report"
                                : "Grade Sheet"
                        }
                        key="grades"
                    >
                        <GradeSheetTab />
                    </TabPane>
                    {/* <TabPane tab="Questions" key="questions">
                        <QuestionTab />
                    </TabPane>
                    <TabPane tab="Quizzes" key="quizzes">
                        <QuizForm />
                    </TabPane> */}
                    <TabPane tab="Course Syllabus" key="course-syllabus">
                        <CourseSyllabusTab />
                    </TabPane>
                    {role === "faculty" && (
                        <TabPane tab="Settings" key="settings">
                            <SettingsTab />
                        </TabPane>
                    )}
                </Tabs>

                <FormAddStudents
                    submitForm={(params) => {
                        params.class_id = id;
                        mutation.mutate(params);
                    }}
                />
            </Layout>
        </>
    );
};

export default React.memo(ClassroomDetails);
