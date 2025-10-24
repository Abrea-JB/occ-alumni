import Icon, {
    BarsOutlined,
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined,
    DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { setCookie, getCookie } from "~/utils/helper";

const HeartSvg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-bank"
        viewBox="0 0 16 16"
    >
        {" "}
        <path d="M8 .95 14.61 4h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.379l.5 2A.5.5 0 0 1 15.5 17H.5a.5.5 0 0 1-.485-.621l.5-2A.5.5 0 0 1 1 14V7H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 4h.89L8 .95zM3.776 4h8.447L8 2.05 3.776 4zM2 7v7h1V7H2zm2 0v7h2.5V7H4zm3.5 0v7h1V7h-1zm2 0v7H12V7H9.5zM13 7v7h1V7h-1zm2-1V5H1v1h14zm-.39 9H1.39l-.25 1h13.72l-.25-1z" />{" "}
    </svg>
);
const PeopleSvg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-people"
        viewBox="0 0 16 16"
    >
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
);

const BankIcon = (props) => <Icon component={HeartSvg} {...props} />;

const PeopleIcon = (props) => <Icon component={PeopleSvg} {...props} />;

const { Header, Content, Footer, Sider } = Layout;

const logout = () => {
    localStorage.removeItem("access_token");
    setCookie(["userLogin", ""]);
    window.location = "/login";
};


const role = getCookie("userRole");

const MainLayout = ({ children }) => (
    <Layout hasSider id="components-layout-demo-fixed-sider">
        <Sider
            style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
            }}
            // collapsible
            // collapsed={true}
        >
            <div className="logo" />
            <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                theme="dark"
                //inlineCollapsed={collapsed}
            >
                {role === "admin" && (
                    <>
                        <Menu.Item key="1" icon={<DashboardOutlined />}>
                            <Link to="/admin-dashboard">Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<BankIcon />}>
                            <Link to="/admin-college">College</Link>
                        </Menu.Item>
                        {/*<Menu.Item key="6" icon={<PeopleIcon />}>
                            <Link to="/admin-departments">Departments</Link>
                        </Menu.Item>*/}
                        <Menu.Item key="2" icon={<BarsOutlined />}>
                            <Link to="/admin/employees">Users</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<BarsOutlined />}>
                            <Link to="/admin-students">Students</Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<BarsOutlined />}>
                            <Link to="/admin-faculties">Faculties</Link>
                        </Menu.Item>
                        <Menu.Item key="9" icon={<BarsOutlined />}>
                            <Link to="/admin/schedules">Schedules</Link>
                       </Menu.Item>
                        <Menu.Item key="10" icon={<BankIcon />}>
                            <Link to="/admin/groups">Groups</Link>
                        </Menu.Item>
                        {/*<Menu.Item key="7" icon={<BarsOutlined />}>
                            <Link to="/admin-students">Thesis</Link>
                        </Menu.Item>*/}
                    </>
                )}
                {role === "faculty" && (
                    <>
                        <Menu.Item key="1" icon={<DashboardOutlined />}>
                            <Link to="/admin-dashboard">Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<BankIcon />}>
                            <Link to="/faculty/groups">Groups</Link>
                        </Menu.Item>
                       {<Menu.Item key="7" icon={<BarsOutlined />}>
                            <Link to="/faculty/thesis">Thesis</Link>
                        </Menu.Item>}
                    </>
                )}
                {role === "student" && (
                    <>
                       {<Menu.Item key="7" icon={<BarsOutlined />}>
                            <Link to="/student/thesis">Dashboard</Link>
                        </Menu.Item>}
                    </>
                )}

                <Menu.Item
                    key="8"
                    icon={<BarsOutlined />}
                    onClick={() => {
                        logout();
                    }}
                >
                    <span>Logout</span>
                </Menu.Item>
            </Menu>
            {/* <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={["4"]}
                items={items}
            /> */}
        </Sider>
        <Layout
            className="site-layout"
            style={{
                marginLeft: 200,
            }}
        >
            <Header
                className="site-layout-background"
                style={{
                    padding: 0,
                }}
            />
            <Content
                style={{
                    margin: "0px 16px 0",
                    overflow: "initial",
                }}
            >
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background">{children}</div>
            </Content>
            <Footer className="footer">CAPTONE TRACKER ©2022 USTP</Footer>
        </Layout>
    </Layout>
);

export default MainLayout;
