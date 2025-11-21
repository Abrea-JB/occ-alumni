import React, { useEffect } from "react";
import { Spin, Typography } from "antd";
import { getStorage } from "../../utils/helper";
import logo from "~/assets/images/site-logo.png";

const { Title, Text } = Typography;

const MainPage = () => {
    useEffect(() => {
        setTimeout(() => {
            if (!getStorage("userRole")) {
                window.location = "/login";
            } else {
                if(getStorage("userRole") === 'admin'){
                    window.location = '/admin-dashboard'
                    return
                }
                
                 if(getStorage("userRole") === 'alumni'){
                    window.location = '/profile'
                    return
                }
            }
        }, 3000);
    }, []);

    return (
        <>
            <div className="main-loading-wrapper">
                <div class="logo-container">
                    <div class="logo"> <img src={logo} /></div>
                    <div class="logo-shadow"></div>
                </div>
               
                <Title style={{ marginTop: 50}}  level={1} >
                   OCC Alumni
                </Title>
                <Spin size="large" className="login-spinner" />
            </div>
        </>
    );
};

export default React.memo(MainPage);
