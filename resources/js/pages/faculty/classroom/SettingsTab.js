import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Upload,
    Radio,
    Card,
    TimePicker,
    message,
    Space,
    Select,
    Image,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useClassRoomSettings from "~/hooks/useClassRoomSettings";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { DEFAULT_BANNER, HERO_IMAGE } from "~/utils/constant";
import useClassroomStore from "~/states/classroomState";
import useSubjects from "~/hooks/useSubjects";
import { useQueryClient } from "react-query";

const { TextArea } = Input;

const { Option } = Select;
const { RangePicker } = TimePicker;

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const ClassroomSettingsTab = () => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [heroImage, setHeroImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(DEFAULT_BANNER);
    const [examType, setExamType] = useState("midterm");
    const [show_grade, setGradeView] = useState("hide");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateClassroomSettings } = useClassroomStore();
    const { id } = useParams();
    const {
        isLoading,
        data: classroom,
        refetch: refetchSettings,
        isFetching,
    } = useClassRoomSettings(id);
    const { isLoading: loadinSubjects, data: subjects } = useSubjects();

    const onFinish = async (values) => {
        setLoading(true);
        const response = await updateClassroomSettings({
            class_id: id,
            ...values,
            heroImage,
            examType,
            show_grade,
        });
        queryClient.invalidateQueries("classroom-settings");
        queryClient.invalidateQueries("classroom-list");
        queryClient.invalidateQueries("classwork-gradesheet-data");
        setLoading(false);
        message.success(`Settings successfully saved!`);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG files!");
            return Upload.LIST_IGNORE;
        }

        const isLt1MB = file.size / 1024 / 1024 < 1;
        if (!isLt1MB) {
            message.error("Image must be smaller than 1MB!");
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const handleHeroImageChange = (info) => {
        if (info.file.status === "done") {
            // Get this url from response in real world
            const imageUrl = URL.createObjectURL(info.file.originFileObj);
            setHeroImage(info.file.originFileObj);
            setPreviewImage(imageUrl);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    useEffect(() => {
        if (classroom) {
            form.setFieldsValue({
                class_name: classroom?.class_name,
                section: classroom?.section,
                subject: classroom?.subject,
                course_code: classroom?.course_code,
                room: classroom?.room,
                day: classroom?.day?.split(","),
                attendance_points: classroom?.attendance_points,
                attendance_points_late: classroom?.attendance_points_late,
                schedule: [
                    dayjs(classroom?.time_in, "HH:mm:ss"),
                    dayjs(classroom?.time_out, "HH:mm:ss"),
                ],
                term: classroom?.term,
                subject_id: classroom?.subject_id,
                show_grade: classroom?.show_grade || "hide",
            });
            setExamType(classroom?.term || "midterm");
            setGradeView(classroom?.show_grade || "hide");

            // Set the classroom banner if it exists
            if (classroom.hero_image) {
                setPreviewImage(HERO_IMAGE + classroom.hero_image);
            }
        }
    }, [classroom]);

    return (
        <div className="classroom-settings">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                {/* Hero Image Section */}
                <Card
                    title="Classroom Header Image"
                    style={{ marginBottom: 24 }}
                    loading={isLoading}
                >
                    <Form.Item name="heroImage">
                        <Upload
                            name="heroImage"
                            accept="image/jpeg,image/png"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleHeroImageChange}
                            customRequest={({ file, onSuccess }) => {
                                // Simulate successful upload immediately
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                {previewImage !== DEFAULT_BANNER
                                    ? "Change Header Image"
                                    : "Upload Header Image"}
                            </Button>
                        </Upload>
                        <div style={{ marginTop: 10 }}>
                            <Image
                                src={previewImage}
                                alt="Hero Image"
                                width={350}
                                height={200}
                                preview={{
                                    visible: isPreviewOpen,
                                    onVisibleChange: (visible) =>
                                        setIsPreviewOpen(visible),
                                    scaleStep: 0.5,
                                }}
                            />
                        </div>
                    </Form.Item>
                </Card>

                {/* Basic Classroom Info */}
                <Card
                    loading={isLoading}
                    title="Classroom Information"
                    style={{ marginBottom: 24 }}
                >
                    <Form.Item
                        name="class_name"
                        label="Class Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter class name!",
                            },
                        ]}
                    >
                        <Input placeholder="e.g., BSIT 1A" />
                    </Form.Item>

                    <Form.Item
                        name="section"
                        label="Section"
                        rules={[
                            {
                                required: true,
                                message: "Please enter section!",
                            },
                        ]}
                    >
                        <Input placeholder="e.g., A" />
                    </Form.Item>

                    <Form.Item
                        name="subject_id"
                        label="Subject"
                        rules={[
                            {
                                required: true,
                                message: "Please select a subject!",
                            },
                        ]}
                    >
                        <Select placeholder="Select a subject" allowClear>
                            {Array.isArray(subjects) &&
                                subjects.map((subject) => (
                                    <Option key={subject.id} value={subject.id}>
                                        {subject.subject_name} (
                                        {subject.subject_code})
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="room"
                        label="Bldg. and Room No."
                        rules={[
                            {
                                required: true,
                                message: "Please enter room details!",
                            },
                        ]}
                    >
                        <Input placeholder="e.g., Bldg. A, Room 203" />
                    </Form.Item>

                    <Form.Item
                        name="day"
                        label="Select Days"
                        rules={[
                            { required: true, message: "Please select  days!" },
                        ]}
                    >
                        <Select
                            mode="multiple" // This enables multiple selection
                            placeholder="Select days"
                            allowClear // Optional: allows clearing all selections
                        >
                            {daysOfWeek.map((day) => (
                                <Option key={day} value={day}>
                                    {day}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="schedule"
                        label="Schedule Range"
                        rules={[
                            {
                                required: true,
                                message: "Please select a time range!",
                            },
                        ]}
                    >
                        <RangePicker
                            format="h:mm A"
                            minuteStep={30}
                            use12Hours
                            allowClear={false}
                            disabledTime={() => ({
                                disabledHours: () => [...Array(6).keys()],
                            })}
                        />
                    </Form.Item>
                </Card>

                {/* Grading System */}
                <Card
                    loading={isLoading}
                    title="Grading System Settings"
                    style={{ marginBottom: 24 }}
                >
                    <Form.Item name="term" label="Current Exam Period">
                        <Radio.Group
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="midterm">Midterm</Radio.Button>
                            <Radio.Button value="final">Final</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="show_grade" label="Grade Visibility">
                        <Radio.Group
                            value={show_grade} // Use the state variable here
                            onChange={(e) => setGradeView(e.target.value)}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="hide">Hide</Radio.Button>
                            <Radio.Button value="show">Show</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Card>

                {/* Attendance Settings */}
                <Card loading={isLoading} title="Attendance Settings">
                    <Form.Item
                        label="Points per attendance"
                        name="attendance_points"
                        rules={[
                            {
                                required: true,
                                message: "Please enter attendance points",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            min={0}
                            placeholder="Enter points"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Points per attendance(Late)"
                        name="attendance_points_late"
                        rules={[
                            {
                                required: true,
                                message: "Please enter late attendance points",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            min={0}
                            placeholder="Enter points"
                        />
                    </Form.Item>
                </Card>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={loading}
                        disabled={loading}
                    >
                        Save Classroom Settings
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default React.memo(ClassroomSettingsTab);
