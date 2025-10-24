import { Button, Form, Input, Select, Modal, Upload, Spin } from "antd";
import React, { useMemo, useRef, useState, useEffect } from "react";
import shallow from "zustand/shallow";
import { useGroupStore } from "~/states/groupState";
import { useStudentList } from "~/hooks";
import { UploadOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import { DebounceSelect } from "~/components";
import { useFacultyList } from "~/hooks";

const { Option } = Select;



const FormGroups = React.memo(({ submitForm }) => {
    const [value, setValue] = useState([]);

    const [form] = Form.useForm();
    const [isSubmit, isClear, isGroup, setGroup, searchStudents, editData] = useGroupStore(
        (state) => [ 
            state.isSubmit,
            state.isClear,
            state.isGroup,
            state.setGroup,
            state.searchStudents,
            state.editData,
        ],
        shallow
    );

    useEffect(() => {
        if (isClear) form.resetFields();
    }, [isClear]);

    useEffect(() => {
        form.setFieldsValue({
            group_name: editData?.group_name,
        });
    }, [editData]);

    const { data: students } = useStudentList();

    async function fetchUserList(keywords) {
        const token = localStorage.getItem('access_token')
        let _data = {
            keywords:keywords,
          }
    return await fetch("/api/student-search", {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`, // notice the Bearer before your token
        },
        body: JSON.stringify(_data),
    }).then((response) => response.json())
        .then((body) =>
            body.students.map((students) => ({
                label: `${students?.fname} ${students?.lname}`,
                value: students?.id,
            }))
        );

    }

    const {
        data: faculties 
    } = useFacultyList();

    const onChange = (value) => {
   
    };
      
    const onSearch = (value) => {
       
    };
   
    return (
        <Modal
            visible={isGroup}
            onCancel={() => {
                setGroup(false);
            }}
            onOk={form.submit}
            title={`Update Groups`}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmit}
                    onClick={form.submit}
                >
                    {`Save Changes`}
                </Button>,
            ]}
        >
            <Form
                form={form}
                name="form-student"
                onFinish={(params) => submitForm(params)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        form.submit();
                    }
                }}
            >
                <Form.Item
                    name="group_name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Group Name!",
                        },
                    ]}
                >
                    <Input placeholder="Group Name" />
                </Form.Item>
                <Form.Item
                    name="students"
                    rules={[
                        {
                            required: true,
                            message: "Please select students!",
                        },
                    ]}
                >
                    <DebounceSelect
                        mode="multiple"
                        value={value}
                        placeholder="Select students"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>
                <Form.Item
                        name="faculty"
                        rules={[
                            {
                                required: true,
                                message: "Please select adviser!",
                            },
                        ]}
                        >
                        <Select
                            showSearch
                            value={value}
                            placeholder="Select a adviser"
                            optionFilterProp="children"
                            //onChange={onChange}
                            filterOption={(input, option) => option.children.toString().toLowerCase().includes(input.toLowerCase())}
                        >
                            {Array.isArray(faculties) && faculties.map((obj,i) =>{
                            return ( <Option key={i} value={obj?.id}>{obj?.fname} {obj?.lname}</Option>)
                            }) }
                        </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default React.memo(FormGroups);
