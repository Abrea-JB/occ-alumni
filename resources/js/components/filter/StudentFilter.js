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
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useDepartmentList, useCollegeList } from "~/hooks";

const { Option } = Select;

const StudentFilter = React.memo(({ submitForm, clearFilter, loading }) => {
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

    const { data: colleges } = useCollegeList();

    const { data: departments } = useDepartmentList();

    // const { data: schoolyears } = useSchoolYear();

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
                            <Form.Item label="College" name="college_id">
                                <Select
                                    showSearch
                                    placeholder="Select a college"
                                    optionFilterProp="children"
                                    //onChange={onChange}
                                    //onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(colleges) &&
                                        colleges.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.college_name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Department" name="department_id">
                                <Select
                                    showSearch
                                    placeholder="Select a department"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(departments) &&
                                        departments.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.dept_name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="Status" >
                                <Radio.Group className="radio-group">
                                    <Radio.Button value="optional">Active</Radio.Button>
                                    <Radio.Button value>Inactive</Radio.Button>
                                </Radio.Group>
                            </Form.Item>*/}
                            <Form.Item className="align-right">
                                <Space>
                                    <Button onClick={() => clearFilter()}>Clear</Button>
                                    <Button
                                        onClick={form.submit}
                                        type="primary"
                                        loading={loading}
                                        disabled={loading}
                                    >
                                        Filter
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                }
                title="Filter Student"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
            >
                <Button shape="circle" icon={<FilterOutlined />} />
            </Popover>
        </Tooltip>
    );
});

export default StudentFilter;
