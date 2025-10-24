import React, { useState } from "react";
import {
    Card,
    Button,
    Space,
    Tag,
    Input,
    Modal,
    message,
    Avatar,
    Divider,
    List,
    Checkbox,
} from "antd";
import {
    SearchOutlined,
    DeleteOutlined,
    CheckOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import useRequestTake from "~/hooks/useRequestTake";
import useClassroomStore from "~/states/classroomState";
import { useLoadingStore } from "~/states/loadingState";

const { confirm } = Modal;

const RequestExam = ({ classwork_id }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchText, setSearchText] = useState("");
    const { showLoading, hideLoading } = useLoadingStore();
    const {
        data: studentRequests = [],
        isLoading: isLoadingRequest,
        isFetching: isFetchingRequest,
        refetch: refetchRequest,
    } = useRequestTake(classwork_id);

    const { approveRequest } = useClassroomStore();

    const handleApprove = async (id) => {
        showLoading("Saving data...");
        const students = [];
        students.push(id);
        const response = await approveRequest({
            students,
            classwork_id,
        });
        if (response.error) {
            throw new Error(response.message);
        }
        if (response.status === 200) {
            refetchRequest();
            if (!isFetching) {
                setEditingKey("");
                queryClient.invalidateQueries("classwork-gradesheet-data");
                message.success("Request approved");
            }
        }
        hideLoading();
    };

    const handleBulkApprove = () => {
        confirm({
            title: "Approve selected requests?",
            icon: <ExclamationCircleOutlined />,
            onOk() {
                message.success(`${selectedRowKeys.length} requests approved`);
                setSelectedRowKeys([]);
                refetchRequest();
            },
        });
    };

    const filteredRequests = studentRequests.filter((request) => {
        const fullName =
            `${request.student.fname} ${request.student.lname}`.toLowerCase();
        return fullName.includes(searchText.toLowerCase());
    });

    return (
        <>
            <div style={{ display: "flex", marginBottom: 16 }}>
                <Input
                    placeholder="Search students..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                />
                <div style={{ flex: 1, textAlign: "right" }}>
                    <Button
                        className="approve-button"
                        type="dashed"
                        icon={<CheckOutlined />}
                        onClick={handleBulkApprove}
                        disabled={!selectedRowKeys.length}
                    >
                        Approve Selected
                    </Button>
                </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <List
                dataSource={filteredRequests}
                loading={isLoadingRequest}
                renderItem={(request) => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "12px 16px",
                            borderBottom: "1px solid #f0f2f5",
                        }}
                    >
                        <Checkbox
                            checked={selectedRowKeys.includes(request.id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedRowKeys([
                                        ...selectedRowKeys,
                                        request.id,
                                    ]);
                                } else {
                                    setSelectedRowKeys(
                                        selectedRowKeys.filter(
                                            (id) => id !== request.id
                                        )
                                    );
                                }
                            }}
                            style={{ marginRight: 16 }}
                        />

                        <Avatar
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: "#1877f2",
                                marginRight: 12,
                            }}
                        />

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>
                                {request.student.fname} {request.student.lname}
                            </div>
                            <div style={{ color: "#65676b", fontSize: 13 }}>
                                {new Date(
                                    request.created_at
                                ).toLocaleDateString()}
                            </div>
                        </div>

                        {request.status === "pending" && (
                            <Button
                                type="dashed"
                                icon={<CheckOutlined />}
                                onClick={() => handleApprove(request.student_id)}
                            />
                        )}
                    </div>
                )}
            />
        </>
    );
};

export default RequestExam;
