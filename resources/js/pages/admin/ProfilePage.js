import React, { useState, useEffect } from "react";
import { Layout, AlumniDetails } from "~/components";
import useProfile from "~/hooks/useProfile";
import { Card, Row, Col, Typography, Avatar, Tag, Divider, Button, Space, Descriptions, Empty, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
    const { data: profile, loading } = useProfile();
    const [previewData, setPreviewData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailedProfile, setDetailedProfile] = useState(null);

    useEffect(() => {
        if (profile?.alumni) {
           // setPreviewData(profile.alumni);
            // Transform API data to detailed profile structure
            transformProfileData(profile.alumni);
        } else if (profile) {
            // Use the main profile data if alumni data isn't available
            transformProfileData(profile);
        }
    }, [profile]);

    const transformProfileData = (profileData) => {
        const enhancedProfile = {
            // Basic Info from API
            basicInfo: {
                name: profileData?.first_name || "Not provided",
                email: profileData.email || "Not provided",
                role:  "alumni",
                status:  "active",
                memberSince: profileData.created_at ? new Date(profileData.created_at).getFullYear() : "N/A",
                lastUpdated: profileData.updated_at ? new Date(profileData.updated_at).toLocaleDateString() : "N/A"
            },
            
            // Personal Information (to be filled)
            personalInfo: {
                firstName: profileData.first_name || "Not provided",
                lastName: profileData.last_name || "Not provided",
                displayName:  profileData.first_name  + ' '  +  profileData.last_name || "Not provided",
                avatar: profileData.image || null,
                dateOfBirth: profileData?.birth_date  || "Not provided",
                gender:  profileData?.gender ||  "Not provided",
                nationality: "Filipino"
            },
            
            // Contact Information (to be filled)
            contactInfo: {
                email: profileData.email || "Not provided",
                phone: "Not provided",
                alternatePhone: "Not provided",
                address: {
                    street: "Not provided",
                    city: "Not provided",
                    state: "Not provided",
                    zipCode: "Not provided",
                    country: "Not provided"
                },
                socialMedia: {
                    linkedin: "Not provided",
                    twitter: "Not provided",
                    facebook: "Not provided"
                }
            },
            
            // Academic Information (to be filled)
            academicInfo: {
                studentId: "Not provided",
                admissionYear: "Not provided",
                graduationYear: "Not provided",
                degree: "Not provided",
                major: "Not provided",
                faculty: "Not provided",
                department: "Not provided",
                gpa: "Not provided",
                honors: "Not provided",
                thesisTitle: "Not provided"
            },
            
            // Professional Information (to be filled)
            professionalInfo: {
                currentPosition: "Not provided",
                company: "Not provided",
                industry: "Not provided",
                employmentType: "Not provided",
                startDate: "Not provided",
                skills: [],
                previousCompanies: []
            },
            
            // Additional Information
            additionalInfo: {
                bio: profileData?.bio || "No biography provided yet.",
                interests: [],
                achievements: []
            }
        };
        
        setDetailedProfile(enhancedProfile);
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }

     const handleView = () => {
        const values = profile.alumni;
        const previewData = {
            // Personal Information
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
            suffix: values.suffix,
            email: values.email,
            phone: values.phone,
            address: values.address,
            birth_date: values.birth_date,
            gender: values.gender,
            bio: values.bio,

            // Academic Information
            course_id: values.course_id,
            studentId: values.studentId,
            graduationYear: values.graduationYear,
            enrollmentYear: values.enrollmentYear,
            honors:
                typeof values.honors === "string" && values.honors.trim() !== ""
                    ? JSON.parse(values.honors)
                    : Array.isArray(values.honors)
                    ? values.honors
                    : [],
            thesisTitle: values.thesisTitle,
            academicAchievements: values.academicAchievements,
            extracurricular: values.extracurricular,
            continueEducation: values.continueEducation,

            // Career Information
            employment_status_id: values.employment_status_id,
            currentCompany: values.currentCompany,
            jobTitle: values.jobTitle,
            industry: values.industry,
            yearsExperience: values.yearsExperience,
            salaryRange: values.salaryRange,
            workLocation: values.workLocation,
            careerGoals: values.careerGoals,
            previousCompanies: values.previousCompanies,

            // Social media
            linkedin: values.linkedin,
            github: values.github,
            portfolio: values.portfolio,
            twitter: values.twitter,

            // Preferences
            newsletter: values.newsletter,
            contactPermission: values.contactPermission,
            agreement: values.agreement,

            // Files
            profileImage: values?.profile_image_url,
            idDocuments: values?.document_urls || [],
        };

        setPreviewData(previewData);
        setIsModalVisible(true);
    };


    return (
        <Layout>
            <div className="alumni-dashboard">
                {/* Header Section */}
                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} sm={8} md={6}>
                            <Avatar 
                                size={100} 
                                icon={<UserOutlined />} 
                                src={profile?.alumni?.profile_image_url}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                        </Col>
                        <Col xs={24} sm={16} md={18}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <Title level={2} style={{ margin: 0 }}>
                                    {detailedProfile?.personalInfo?.displayName}
                                </Title>
                                <Text type="secondary">
                                    <MailOutlined /> {detailedProfile?.contactInfo?.email}
                                </Text>
                                <div>
                                    <Tag color="blue" style={{ textTransform: 'capitalize' }}>
                                        {detailedProfile?.basicInfo?.role}
                                    </Tag>
                                    <Tag color="green">{detailedProfile?.basicInfo?.status}</Tag>
                                    <Tag color="orange">
                                        Member since {detailedProfile?.basicInfo?.memberSince}
                                    </Tag>
                                </div>
                                <Button 
                                    type="primary" 
                                    icon={<EditOutlined />}
                                   onClick={() => handleView()}
                                >
                                    View Profile
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Detailed Information Sections */}
                <Row gutter={[24, 24]}>
                    {/* Personal Information */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <UserOutlined />
                                    Personal Information
                                </Space>
                            }
                            bordered={false}
                        >
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="First Name">
                                    {detailedProfile?.personalInfo?.firstName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Last Name">
                                    {detailedProfile?.personalInfo?.lastName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Date of Birth">
                                    {detailedProfile?.personalInfo?.dateOfBirth}
                                </Descriptions.Item>
                                <Descriptions.Item label="Gender">
                                    {detailedProfile?.personalInfo?.gender}
                                </Descriptions.Item>
                                <Descriptions.Item label="Nationality">
                                    {detailedProfile?.personalInfo?.nationality}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    {/* Contact Information */}
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <MailOutlined />
                                    Contact Information
                                </Space>
                            }
                            bordered={false}
                        >
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Email">
                                    {detailedProfile?.contactInfo?.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {detailedProfile?.contactInfo?.phone}
                                </Descriptions.Item>
                                <Descriptions.Item label="Alternate Phone">
                                    {detailedProfile?.contactInfo?.alternatePhone}
                                </Descriptions.Item>
                                <Descriptions.Item label="Address">
                                    {Object.values(detailedProfile?.contactInfo?.address || {}).some(val => val !== "Not provided") 
                                        ? `${detailedProfile.contactInfo.address.street}, ${detailedProfile.contactInfo.address.city}, ${detailedProfile.contactInfo.address.state} ${detailedProfile.contactInfo.address.zipCode}`
                                        : "Not provided"
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>


                    {/* Additional Information */}
                    <Col xs={24}>
                        <Card 
                            title="Additional Information"
                            bordered={false}
                        >
                            <Paragraph>
                                <Text strong>Bio: </Text>
                                {detailedProfile?.additionalInfo?.bio}
                            </Paragraph>
                            <div>
                                <Text strong>Last Updated: </Text>
                                {detailedProfile?.basicInfo?.lastUpdated}
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Edit Profile Modal */}
                <AlumniDetails
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onSubmit={(data) => {
                        // Handle profile update here
                        console.log('Updated profile data:', data);
                        setIsModalVisible(false);
                    }}
                    previewData={previewData}
                    viewOnly={false}
                />
            </div>
        </Layout>
    );
};

export default ProfilePage;