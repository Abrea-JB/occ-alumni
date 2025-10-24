import {
    Button,
    Form,
    Input,
    Select,
    Drawer,
    TimePicker,
    message,
    Space,
} from "antd";
import React, { useEffect } from "react";
import useClassroomStore from "~/states/classroomState";
import dayjs from "dayjs";
import useSubjects from "~/hooks/useSubjects";

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

const FormAddClassroom = React.memo(({ submitForm }) => {
    const { isLoading, data: subjects, refetch, isFetching } = useSubjects();
    const { isClear, isSubmit, formClassroom, setField, classroom } =
        useClassroomStore();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        if (classroom) {
            form.setFieldsValue({
                class_name: classroom?.class_name,
                section: classroom?.section,
                subject: classroom?.subject,
                course_code: classroom?.course_code,
                room: classroom?.room,
                day: classroom?.day,
                schedule: [
                    dayjs(classroom?.time_in, "HH:mm:ss"),
                    dayjs(classroom?.time_out, "HH:mm:ss"),
                ],
            });
        } else {
            // form.resetFields();
        }
    }, [classroom]);

    return (
        <Drawer
            title="Create Classroom"
            width={500}
            open={formClassroom}
            onClose={() => {
                if (classroom) {
                    form.resetFields();
                }
                setField("formClassroom", false);
            }}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Space>
                        <Button
                            onClick={() => {
                                if (classroom) {
                                    form.resetFields();
                                }
                                setField("formClassroom", false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            key="submit"
                            type="primary"
                            loading={isSubmit}
                            disabled={isSubmit}
                            onClick={form.submit}
                        >
                            Save
                        </Button>
                    </Space>
                </div>
            }
            bodyStyle={{ paddingBottom: 80 }}
        >
            <Form
                layout="vertical"
                form={form}
                name="form-classroom"
                onFinish={(params) => submitForm(params)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") form.submit();
                }}
                onFinishFailed={() => {
                    message.error("Please check the form and fix errors.");
                }}
            >
                <Form.Item
                    name="class_name"
                    label="Class Name"
                    rules={[
                        { required: true, message: "Please enter class name!" },
                    ]}
                >
                    <Input placeholder="e.g., BSIT 1A" />
                </Form.Item>

                <Form.Item
                    name="section"
                    label="Section"
                    rules={[
                        { required: true, message: "Please enter section!" },
                    ]}
                >
                    <Input placeholder="e.g., A" />
                </Form.Item>

                <Form.Item
                    name="subject_id"
                    label="Subject"
                    rules={[
                        { required: true, message: "Please select  asubject!" },
                    ]}
                >
                    <Select
                        showSearch
                        placeholder="Select a subject"
                        allowClear
                    >
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
                    label="Select Day"
                    rules={[
                        { required: true, message: "Please select a day!" },
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
                            disabledHours: () => [...Array(6).keys()], // disables hours before 6 AM
                        })}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default FormAddClassroom;
