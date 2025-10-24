import { Menu, Dropdown, message, Tooltip, Empty, Card, Collapse } from "antd";
import {
    PlusOutlined,
    BookOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    MoreOutlined,
    FundViewOutlined,
    CaretRightOutlined,
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
import useArchiveClassroom from "~/hooks/useArchiveClassroom";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
const { Panel } = Collapse;
const { Title, Text } = Typography;

const ArchiveClassroomPage = (props) => {
    const history = useHistory();
    const { data, isFetching } = useArchiveClassroom();
    const { storeClassroom, setField, classroom } = useClassroomStore();
    const [modalVisible, setModalVisible] = useState(false);
    const queryClient = useQueryClient();
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
        },
        onError: () => {
            message.error("Failed to create classroom. Please try again.");
        },
    });

    const handleNavigate = (slug) => {
        history.push(`/faculty/classroom-details/${slug}`);
    };

    const menu = (item) => (
        <Menu>
            <Menu.Item key="edit" onClick={() => handleMenuClick("edit", item)}>
                Edit
            </Menu.Item>
            {/* <Menu.Item key="copy" onClick={() => handleMenuClick("copy", item)}>
                Copy
            </Menu.Item>
            <Menu.Item
                key="archive"
                onClick={() => handleMenuClick("background", item)}
            >
                Update Background
            </Menu.Item> */}
        </Menu>
    );

    return (
        <Layout breadcrumb={Breadcrumb.Faculty("Class Details")}>
            <HeaderTitle title="Archive Classroom Page" />
            <div className="classroom-archive">
                {isFetching ? (
                    <Card loading />
                ) : data && data.length > 0 ? (
                    <Collapse
                        bordered={false}
                        expandIcon={({ isActive }) => (
                            <CaretRightOutlined rotate={isActive ? 90 : 0} />
                        )}
                        className="year-collapse"
                    >
                        {data.map((yearData) => (
                            <Panel
                                header={
                                    <Title level={4} style={{ margin: 0 }}>
                                        {yearData.year}
                                    </Title>
                                }
                                key={yearData.year}
                                className="year-panel"
                            >
                                <Collapse
                                    bordered={false}
                                    expandIcon={({ isActive }) => (
                                        <CaretRightOutlined
                                            rotate={isActive ? 90 : 0}
                                        />
                                    )}
                                    className="semester-collapse"
                                >
                                    {yearData.semesters.map((semester) => (
                                        <Panel
                                            header={
                                                <Title
                                                    level={5}
                                                    style={{ margin: 0 }}
                                                >
                                                    {semester.name}
                                                </Title>
                                            }
                                            key={`${yearData.year}-${semester.name}`}
                                            className="semester-panel"
                                        >
                                            <Row gutter={[16, 16]}>
                                                {semester.classrooms.map(
                                                    (item) => (
                                                        <Col
                                                            xs={24}
                                                            sm={12}
                                                            md={12}
                                                            lg={8}
                                                            key={item.id}
                                                        >
                                                            <div className="classroom-card">
                                                                <div
                                                                    style={{
                                                                        position:
                                                                            "relative",
                                                                        width: "100%",
                                                                        height: 270,
                                                                        backgroundImage: `url('https://images.unsplash.com/photo-1740635341299-3b8e3490f546?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                                                                        backgroundSize:
                                                                            "cover",
                                                                        backgroundPosition:
                                                                            "center",
                                                                        backgroundRepeat:
                                                                            "no-repeat",
                                                                    }}
                                                                >
                                                                    <div className="title-header">
                                                                        <Title
                                                                            level={
                                                                                4
                                                                            }
                                                                            style={{
                                                                                color: "white",
                                                                                marginBottom: 4,
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.subject
                                                                            }
                                                                        </Title>
                                                                        <Text
                                                                            style={{
                                                                                color: "white",
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.course_code
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                    {/* <div className="menu-actions-button">
                                                                        <Dropdown
                                                                            overlay={menu(
                                                                                item
                                                                            )}
                                                                            trigger={[
                                                                                "click",
                                                                            ]}
                                                                            placement="bottomRight"
                                                                        >
                                                                            <Button
                                                                                type="primary"
                                                                                shape="circle"
                                                                                icon={
                                                                                    <MoreOutlined />
                                                                                }
                                                                            />
                                                                        </Dropdown>
                                                                    </div> */}
                                                                </div>

                                                                <div
                                                                    style={{
                                                                        padding: 20,
                                                                    }}
                                                                >
                                                                    <p>
                                                                        <BookOutlined />{" "}
                                                                        <strong>
                                                                            Class:
                                                                        </strong>{" "}
                                                                        <span className="class_name">
                                                                            {
                                                                                item.class_name
                                                                            }
                                                                        </span>{" "}
                                                                        -
                                                                        Section{" "}
                                                                        {
                                                                            item.section
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <EnvironmentOutlined />{" "}
                                                                        <strong>
                                                                            Room:
                                                                        </strong>{" "}
                                                                        {
                                                                            item.room
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <CalendarOutlined />{" "}
                                                                        <strong>
                                                                            Day:
                                                                        </strong>{" "}
                                                                        {
                                                                            item.day
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        <ClockCircleOutlined />{" "}
                                                                        <strong>
                                                                            Time:
                                                                        </strong>{" "}
                                                                        {dayjs(
                                                                            item.time_in,
                                                                            "HH:mm:ss"
                                                                        ).format(
                                                                            "h A"
                                                                        )}{" "}
                                                                        -{" "}
                                                                        {dayjs(
                                                                            item.time_out,
                                                                            "HH:mm:ss"
                                                                        ).format(
                                                                            "h A"
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                <div className="footer-card">
                                                                    <small>
                                                                        {item?.students_count ||
                                                                            0}{" "}
                                                                        students
                                                                        have
                                                                        registered
                                                                    </small>
                                                                    <Tooltip title="View Details">
                                                                        <Button
                                                                            shape="circle"
                                                                            icon={
                                                                                <FundViewOutlined />
                                                                            }
                                                                            onClick={() =>
                                                                                handleNavigate(
                                                                                    item?.slug
                                                                                )
                                                                            }
                                                                        />
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    )
                                                )}
                                            </Row>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Panel>
                        ))}
                    </Collapse>
                ) : (
                    <Card>
                        <Empty description="No archived classrooms found">
                            <Button type="primary">Create New Classroom</Button>
                        </Empty>
                    </Card>
                )}
            </div>
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
        </Layout>
    );
};

export default React.memo(ArchiveClassroomPage);
