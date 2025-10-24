import React, { useState, useEffect } from "react";
import {
    Button,
    message,
    Space,
    Input,
    Tooltip,
    Popover,
    Form,
    Radio,
    Select,
} from "antd";
// import ImgCrop from 'antd-img-crop';
import { FilterOutlined } from "@ant-design/icons";
import {
    useDepartmentList,
    useCollegeList,
    useSchoolYear,
    useSemesters,
} from "~/hooks";
import { useScheduleStore } from "~/states/scheduleState";
import { isArray } from "lodash";
import shallow from "zustand/shallow";

const { Option } = Select;

const ScheduleFilter = React.memo(({ submitForm, clearFilter }) => {
    const [open, setOpen] = useState(false);
    const [department_list, setDeparment] = useState([]);

    const [
        isLoading,
        setLoading,
        sy,
        setSy,
        sem,
        setSem,
        category,
        setCategory,
        college,
        setCollege,
        dept,
        setDept
    ] = useScheduleStore(
        (state) => [
            state.isLoading,
            state.setLoading,
            state.sy,
            state.setSy,
            state.sem,
            state.setSem,
            state.category,
            state.setCategory,
            state.college,
            state.setCollege,
            state.dept,
            state.setDept
        ],
        shallow

    );
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



    const { data: semesters } = useSemesters();

    useEffect(() => {
        setDeparment(departments);
    }, [departments]);

    const { data: schoolyears } = useSchoolYear();

    const onChangeCollege = (college) => {
        const department = departments.filter(
            (item) => parseInt(item.college_id) === parseInt(college)
        );
        setDeparment(isArray(department) ? department : []);
        form.setFieldsValue({
            department_id: null,
        });
    };

   const handleFinish = (params) => {
        setSy(null);
        setSem(null);
        setCategory(null);
        setCollege(null);
        setDept(null);
        setLoading(true);
        submitForm(params);
        setSy(params.sy);
        setSem(params.sem);
        setCategory(params.category);
        setCollege(params.college_id);
        setDept(params.department_id);
        setTimeout(() => {
            setLoading(false)
        }, 4000)
    };

    return (
        <Tooltip placement="top" title="Click to Filter">
            <Popover
                placement="bottomRight"
                content={
                    <div className="filter-div">
                        <Form
                           
                            form={form}
                            layout="vertical"
                            // onFinish={(params) => {submitForm(params);setSubmit(true);}}
                            onFinish={(params) => {handleFinish(params)}}
                        >
                            {/* <Form.Item label="Keywords" name="keywords">
                                <Input placeholder="Filter by Keywords" />
                            </Form.Item> */}
                            <Form.Item label="Schoolyear" name="sy">
                                <Select
                                    showSearch
                                    placeholder="Schoolyear"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please select schoolyear!",
                                        },
                                    ]}
                                >
                                    {Array.isArray(schoolyears) &&
                                        schoolyears.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.year}-{obj?.year2}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="sem" label="Semester">
                                <Select
                                    showSearch
                                    placeholder="Select a semester"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(semesters) &&
                                        semesters.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.semester}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item name="category" label="Category">
                                <Select
                                    showSearch
                                    placeholder="Select a category"
                                    optionFilterProp="children"
                                    // onChange={(value) => {
                                    //     let new_groups = []
                                    //     for (let index = 0; index < groupList.length; index++) {
                                    //         if(groupList[index]?.stage_id == parseInt(value)){
                                    //             new_groups.push(groupList[index])
                                    //         }
                                    //     }
                                    //     setGroupListNew(new_groups);
                                    // }}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {Array.isArray(stages) &&
                                        stages.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item label="College" name="college_id">
                                <Select
                                    showSearch
                                    placeholder="Select a college"
                                    optionFilterProp="children"
                                    onChange={onChangeCollege}
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
                                    {Array.isArray(department_list) &&
                                        department_list.map((obj, i) => {
                                            return (
                                                <Option key={i} value={obj?.id}>
                                                    {obj?.dept_name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            </Form.Item>
                            <Form.Item className="align-right">
                                <Space>
                                    <Button onClick={() => clearFilter()}>
                                        Clear
                                    </Button>
                                    <Button
                                        onClick={form.submit}
                                        type="primary"
                                        loading={isLoading}
                                        disabled={false}
                                        
                                    >
                                        Filter
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                }
                title="Filter Schedule"
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
            >
                <Button shape="circle" icon={<FilterOutlined />} />
            </Popover>
        </Tooltip>
    );
});

export default ScheduleFilter;
