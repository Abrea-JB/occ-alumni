import { Button, Form, Input, Modal, Space, InputNumber, message } from "antd";
import React, { useEffect } from "react";
import shallow from "zustand/shallow";
import useSportsStore from "~/states/sportsState";

const FormSports = React.memo(({ onSubmit }) => {
    const [form] = Form.useForm();

    const { visible, editData, isSubmit, shouldClearForm, setField } =
        useSportsStore();

    // Set form values when editData changes
    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                name: editData.name,
            });
        }
    }, [editData, form]);

    // Clear form when flag is set
    useEffect(() => {
        if (shouldClearForm) {
            form.resetFields();
            setField("shouldClearForm", false);
        }
    }, [shouldClearForm, form]);

    const handleSubmit = (values) => {
        console.log({ values });
        onSubmit({
            ...values,
            id: editData?.id, // Include ID if editing
        });
    };

    const formTitle = editData ? "Edit Subject" : "Create Sports";
    const submitButtonText = editData ? "Save Changes" : "Create Sports";

    const closeForm = () => {
        setField("editData", null);
        if (editData) {
            form.resetFields();
        }
        setField("visible", false);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        // Check if form has been modified
        const fieldsValue = form.getFieldsValue();
        const isFormModified = Object.values(fieldsValue).some(
            (value) => value !== undefined && value !== "" && value !== null
        );

        if (isFormModified) {
            Modal.confirm({
                title: "Discard Changes?",
                content:
                    "You have unsaved changes. Are you sure you want to close?",
                okText: "Yes, Discard",
                cancelText: "Cancel",
                onOk: closeForm,
            });
        } else {
            closeForm();
        }
    };

    return (
        <Modal
            title={formTitle}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
            style={{ top: 20 }}
            footer={
                <Space>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                        type="primary"
                        loading={isSubmit}
                        disabled={isSubmit}
                        onClick={handleOk}
                    >
                        {submitButtonText}
                    </Button>
                </Space>
            }
            maskClosable={false}
            keyboard={false}
            destroyOnClose={true}
        >
            <Form
                form={form}
                name="subject-form"
                onFinish={handleSubmit}
                layout="vertical"
                autoComplete="off"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input name!",
                        },
                        {
                            max: 100,
                            message: "Name must be less than 100 characters",
                        },
                    ]}
                >
                    <Input placeholder="Enter  name" autoFocus />
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default FormSports;
