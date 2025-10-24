import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

const StudentLayout = ({ children }) => {
    return (
        <Layout>
            <Content className="sudent-layout" style={{ padding: '20px' }}>{children}</Content>
        </Layout>
    );
};

export default React.memo(StudentLayout);
