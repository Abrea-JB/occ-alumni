import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Select, Drawer, Spin } from "antd";
import { useGroupStore } from "~/states/groupState";
import useClassroomStore from "~/states/classroomState";
import { DebounceSelect } from "~/components";
import secureLocalStorage from "react-secure-storage";

const FormAddStudents = React.memo(({ submitForm }) => {
    // State management
    const [selectedStudents, setSelectedStudents] = useState([]);
    const access_token = secureLocalStorage.getItem("access_token");
    const [form] = Form.useForm();



    const { formStudent, setField , isSubmit, isClear, editData} = useClassroomStore();

    // Effects
    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear, form]);

    useEffect(() => {
        if (editData?.group_name) {
            form.setFieldsValue({
                group_name: editData.group_name,
            });
        }
    }, [editData, form]);

    // Handlers
    const handleCloseDrawer = useCallback(() => {
        setField("formStudent", false);
    }, [setField]);

    const fetchUserList = useCallback(
        async (keywords) => {
            try {
                const response = await fetch("/api/student-search", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access_token}`,
                    },
                    body: JSON.stringify({ keywords }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const { students } = await response.json();
                return students.map((student) => ({
                    label: student?.name || "Unknown",
                    value: student?.id,
                }));
            } catch (error) {
                console.error("Error fetching student list:", error);
                return [];
            }
        },
        [access_token]
    );

    const handleFormSubmit = useCallback(
        (params) => {
            submitForm(params);
        },
        [submitForm]
    );

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter") {
                form.submit();
            }
        },
        [form]
    );

    return (
        <Drawer
            title="Add Students"
            open={formStudent}
            onClose={handleCloseDrawer}
            width={400}
            footer={
                <div style={{ textAlign: "right" }}>
                    <Button
                        onClick={handleCloseDrawer}
                        style={{ marginRight: 8 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        loading={isSubmit}
                        disabled={isSubmit}
                        onClick={() => form.submit()}
                    >
                        Save Changes
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                name="form-student"
                onFinish={handleFormSubmit}
                onKeyPress={handleKeyPress}
                layout="vertical"
            >
                <Form.Item
                    name="students"
                    label="Students"
                    rules={[
                        { required: true, message: "Please select students!" },
                    ]}
                >
                    <DebounceSelect
                        mode="multiple"
                        value={selectedStudents}
                        placeholder="Select students"
                        fetchOptions={fetchUserList}
                        onChange={setSelectedStudents}
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
});

export default React.memo(FormAddStudents);
