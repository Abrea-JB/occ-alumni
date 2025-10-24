import {
    Menu,
    Dropdown,
    message,
    Tooltip,
    Empty,
    Card,
    Skeleton,
    Avatar,
    Badge,
} from "antd";
import {
    BookOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    MoreOutlined,
    FundViewOutlined,
    LockOutlined,
    CopyOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import React, { useState } from "react";
import {
    Layout,
    FloatingButton,
    HeaderTitle,
    Breadcrumb,
    ImageUploadModal,
} from "~/components";
import FormAddClassroom from "./FormAddClassroom";
import useClassroomStore from "~/states/classroomState";
import { useMutation, useQueryClient } from "react-query";
import useClassroom from "~/hooks/useClassroom";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import { getStorage } from "~/utils/helper";
import { DEFAULT_BANNER, HERO_IMAGE } from "~/utils/constant";
import { PROFILE } from "~/utils/constant";

const { Title, Text } = Typography;

const ClassroomPage = (props) => {
    const history = useHistory();
    const { data: classrooms, isFetching } = useClassroom();
    const { storeClassroom, setField, classroom } = useClassroomStore();
    const [modalVisible, setModalVisible] = useState(false);
    const queryClient = useQueryClient();
    const role = getStorage("userRole");
    // Create Menu for actions: Edit, Copy, Archive
    const handleMenuClick = (action, item) => {
        switch (action) {
            case "edit":
                setField("classroom", item);
                setField("formClassroom", true);
                break;
            case "copy":
                message.info("Copy option selected.");
                break;
            case "background":
                setModalVisible(true);
                break;
            default:
                break;
        }
    };

    const mutation = useMutation(storeClassroom, {
        onMutate: () => {
            setField("isSubmit", true);
        },
        onSuccess: (data) => {
            if (data) {
                if (!data?.error) {
                    queryClient.invalidateQueries("classroom-list");
                    const action = data?.data === "saved" ? "created" : "saved";
                    message.success(`Classroom successfully ${action}!`);
                    setField("formClassroom", false);
                    setField("isClear", true);
                    setField("isSubmit", false);
                    setField("classroom", null);
                } else {
                    setField("isSubmit", false);
                }
            } else {
                setField("isSubmit", false);
            }
        },
        onError: () => {
            message.error("Failed to create classroom. Please try again.");
        },
    });

    const handleNavigate = (slug) => {
        history.push(`/classroom-details/${slug}`);
    };

    const menu = (item) => (
        <Menu>
            <Menu.Item
                key="lock"
                onClick={() => handleMenuClick("background", item)}
                icon={<LockOutlined />}
            >
                Lock
            </Menu.Item>
            <Menu.Item
                key="copy"
                onClick={() => handleMenuClick("copy", item)}
                icon={<CopyOutlined />}
            >
                Copy
            </Menu.Item>
            <Menu.Item
                key="delete"
                onClick={() => handleMenuClick("background", item)}
                icon={<DeleteOutlined />}
            >
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout breadcrumb={Breadcrumb.Faculty("Classroom Page")}>
            <HeaderTitle title="Classroom Page" />

            {Array.isArray(classrooms) && classrooms.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {classrooms.map((item, idx) => (
                        <Col xs={24} sm={12} md={12} lg={8} key={idx}>
                            <div className="classroom-card">
                                {/* Banner */}
                                <div
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        height: 270,
                                        backgroundImage: `url(${
                                            item?.hero_image
                                                ? HERO_IMAGE + item?.hero_image
                                                : DEFAULT_BANNER
                                        })`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                    }}
                                >
                                    <div className="title-header">
                                        <Title
                                            level={4}
                                            style={{
                                                color: "white",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {item?.subject?.subject_name}
                                        </Title>
                                        <Text style={{ color: "white" }}>
                                            {item?.subject?.subject_code}
                                        </Text>
                                    </div>
                                    <div className="menu-actions-button">
                                        <Dropdown
                                            overlay={menu(item)}
                                            trigger={["click"]}
                                            placement="bottomRight"
                                        >
                                            <Button
                                                color="default"
                                                variant="outlined"
                                                shape="circle"
                                                icon={<MoreOutlined />}
                                            />
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div style={{ padding: 20 }}>
                                    <p>
                                        <BookOutlined /> <strong>Class:</strong>{" "}
                                        <span className="class_name">
                                            {item.class_name}
                                        </span>
                                    </p>
                                    <p>
                                        <BookOutlined />{" "}
                                        <strong>Section:</strong> {item.section}
                                    </p>
                                    <p>
                                        <EnvironmentOutlined />{" "}
                                        <strong>Room:</strong> {item.room}
                                    </p>
                                    <p>
                                        <CalendarOutlined />{" "}
                                        <strong>Day:</strong> {item.day}
                                    </p>
                                    <p>
                                        <ClockCircleOutlined />{" "}
                                        <strong>Time:</strong>{" "}
                                        {dayjs(item.time_in, "HH:mm:ss").format(
                                            "h A"
                                        )}{" "}
                                        -{" "}
                                        {dayjs(
                                            item.time_out,
                                            "HH:mm:ss"
                                        ).format("h A")}
                                    </p>
                                </div>

                                {/* Footer */}
                                {/* Footer */}
                                <div className="footer-card">
                                    {item?.students?.length > 0 ? (
                                        <Avatar.Group
                                            maxCount={5}
                                            size="small"
                                            maxStyle={{
                                                color: "#f56a00",
                                                backgroundColor: "#fde3cf",
                                            }}
                                        >
                                            {item.students.map((s, idx) => (
                                                <Tooltip
                                                    key={idx}
                                                    title={`${s?.student_model?.fname} ${s?.student_model?.lname}`}
                                                    placement="top"
                                                >
                                                    <Avatar
                                                        src={
                                                            PROFILE +
                                                                s?.user
                                                                    ?.image ||
                                                            undefined
                                                        }
                                                    >
                                                        {!s?.user
                                                            ?.profile_pic &&
                                                            (s?.student_model
                                                                ?.fname?.[0] ||
                                                                "S")}
                                                    </Avatar>
                                                </Tooltip>
                                            ))}
                                        </Avatar.Group>
                                    ) : (
                                        <small>No students enrolled yet</small>
                                    )}

                                    <Tooltip title="View Details">
                                        <Badge
                                            count={item?.notifications || 0}
                                            offset={[-5, 2]}
                                        >
                                            <Button
                                                shape="circle"
                                                icon={<FundViewOutlined />}
                                                onClick={() =>
                                                    handleNavigate(item?.slug)
                                                }
                                            />
                                        </Badge>
                                    </Tooltip>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            ) : (
                <>
                    {isFetching ? (
                        <Row gutter={[16, 16]}>
                            {[...Array(3)].map((_, index) => (
                                <Col xs={24} sm={12} md={12} lg={8} key={index}>
                                    <Card>
                                        <Skeleton
                                            active
                                            paragraph={{ rows: 3 }}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <>
                            {role === "faculty" && (
                                <Col span={24}>
                                    <Card>
                                        <Empty description="No classroom yet">
                                            <Button
                                                type="primary"
                                                onClick={() =>
                                                    setField(
                                                        "formClassroom",
                                                        true
                                                    )
                                                }
                                            >
                                                Add Classroom
                                            </Button>
                                        </Empty>
                                    </Card>
                                </Col>
                            )}

                            {role === "student" && (
                                <Col span={24}>
                                    <Card>
                                        <Empty description="No classroom yet"></Empty>
                                    </Card>
                                </Col>
                            )}
                        </>
                    )}
                </>
            )}
            {role === "faculty" && (
                <>
                    <FloatingButton
                        label="Create New Classroom"
                        onClick={() => setField("formClassroom", true)}
                    />
                    <FormAddClassroom
                        submitForm={(params) => {
                            params.id = classroom?.id || null;
                            mutation.mutate(params);
                        }}
                    />
                    <ImageUploadModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                </>
            )}
        </Layout>
    );
};

export default React.memo(ClassroomPage);
