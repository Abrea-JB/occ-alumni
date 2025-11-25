import React from "react";
import { Form, Input, Alert, Row, Col } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useLoginStore } from "~/states/loginState";
import shallow from "zustand/shallow";
import { Button } from "./index";
import logo from "~/assets/images/site-logo.png";
import loginImage from "~/assets/images/login-image.jpg"; // Add your image path here

const Formlogin = () => {
    const [error, isSubmit, submitForm] = useLoginStore(
        (state) => [state.error, state.isSubmit, state.checkLogin],
        shallow
    );
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");

    const handleRegisterRedirect = () => {
        // Redirect to register page - adjust the path as needed
        window.location.href = "/register"; // or use react-router navigation if you're using it
    };

    return (
        <Row
            style={{
                minHeight: "100vh",
                margin: 0,
                backgroundImage: `url(https://scontent.fcgm1-1.fna.fbcdn.net/v/t39.30808-6/514405810_1301740068624399_2900765982442406081_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=tvlzRxtCkcoQ7kNvwElQZJY&_nc_oc=AdnE3QOHzZiEg968Sgyf40erukwqtMZnHdGBW9ExDwWawFWuLfapIqnxyDTjFHtcqjMob8XszOCbwC7vSPoPZH0f&_nc_zt=23&_nc_ht=scontent.fcgm1-1.fna&_nc_gid=cob1f9bzK9mQaJSWkFmxYQ&oh=00_AfgNGwvaqi_fmrvgaiJRlwycCUEGk72KVGj4KdF1Xe1xEg&oe=692B73BB)`,
                backgroundSize: "cover",
                backgroundPosition: "left",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
            }}
        >
            {/* Left Side - Image (60%) */}
            <Col
                xs={0} // Hidden on mobile
                sm={0} // Hidden on tablet
                md={14} // 60% width on desktop (14/24 = 58.33%)
                lg={14}
                xl={14}
            />

            {/* Right Side - Login Form (40%) */}
            <Col
                xs={24} // Full width on mobile
                sm={24} // Full width on tablet
                md={10} // 40% width on desktop (10/24 = 41.67%)
                lg={10}
                xl={10}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: "40px 20px",
                    backgroundColor: '#667eead1'
                }}
            >
                <div className="form">
                    <div style={{ textAlign: "center", marginBottom: 30 }}>
                        <img
                            src={logo}
                            alt="CoachConnect Logo"
                            style={{ marginBottom: 20, maxWidth: "100%" }}
                        />
                        <h5
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                marginBottom: 8,
                            }}
                        >
                            Welcome to OCC Alumni
                        </h5>
                        <p style={{ color: "#666", margin: 0 }}>
                            Login to continue
                        </p>
                    </div>

                    {error && (
                        <div style={{ marginBottom: 20 }}>
                            <Alert message={error} type="error" showIcon />
                        </div>
                    )}
                    {!error && type === "session-expired" && (
                        <div style={{ marginBottom: 20 }}>
                            <Alert
                                message="Your session has expired."
                                type="error"
                                showIcon
                            />
                        </div>
                    )}

                    <Form
                        name="normal_login"
                        onFinish={submitForm}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Email!",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Enter your email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Password!",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                size="large"
                                iconRender={(visible) =>
                                    visible ? (
                                        <EyeTwoTone />
                                    ) : (
                                        <EyeInvisibleOutlined />
                                    )
                                }
                            />
                        </Form.Item>

                        <Form.Item style={{ marginTop: 30 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmit}
                                label="Sign in"
                                style={{
                                    width: "100%",
                                    height: "45px",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                }}
                            />
                        </Form.Item>
                    </Form>

                    {/* Register redirect section */}
                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <p style={{ color: "#666", margin: 0 }}>
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRegisterRedirect();
                                }}
                                style={{
                                    color: "#1890ff",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Sign up here
                            </a>
                        </p>
                    </div>
                     {/* <div style={{ textAlign: "center", marginTop: 20 }}>
                        <p style={{ color: "#666", margin: 0 }}>
                            For Forth Year Students
                            <a
                                href="/answer-question"
                                onClick={(e) => {
                                    e.preventDefault();
                                     window.location.href = "/answer-question";
                                }}
                                style={{
                                    color: "#1890ff",
                                    fontWeight: 600,
                                    textDecoration: "none",
                                }}
                            >
                                Sign up here
                            </a>
                        </p>
                    </div> */}
                </div>
            </Col>
        </Row>
    );
};

export default Formlogin;
