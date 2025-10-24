import React, { useState, useEffect } from "react";
import {
    Button,
    Space,
    Input,
    Tooltip,
    Popover,
    Form,
    Select,
} from "antd";
// import ImgCrop from 'antd-img-crop';
import { FilterOutlined } from "@ant-design/icons";
import { useSchoolYear } from "~/hooks";

const { Option } = Select;

const ThesisFilter = React.memo(({ submitForm }) => {
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
    };
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState("optional");
    const onRequiredTypeChange = ({ requiredMarkValue }) => {
        setRequiredMarkType(requiredMarkValue);
    };

    const submitForms = (data) => {
        submitForm(data);
    };

    const { data: schoolyears } = useSchoolYear();

    // useEffect(() => {
    //     form.setFieldsValue({
    //         sy_id: 1,
    //     });
    // }, [schoolyears]);

    return (
        <Tooltip placement="top" title="Click to Filter">
            <Popover
                placement="bottomRight"
                content={
                    <div className="filter-div">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={(params) => submitForms(params)}
                        >
                            <Form.Item label="Keywords" name="keywords">
                                <Input placeholder="Filter by Keywords" />
                            </Form.Item>
                            <Form.Item label="School Year" name="sy_id">
                                <Select
                                    showSearch
                                    placeholder="Select a schoolyer"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(schoolyears) &&
                                        schoolyears.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.year} - {obj?.year2}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item className="align-right">
                                <Space>
                                    <Button danger>Clear</Button>
                                    <Button
                                        onClick={form.submit}
                                        type="primary"
                                    >
                                        Filter
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                }
                title="Filter Thesis"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
            >
                <Button  shape="circle" icon={<FilterOutlined />} />
            </Popover>
        </Tooltip>
    );
});

export default ThesisFilter;
