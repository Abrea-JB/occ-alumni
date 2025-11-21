import React, { useState, useEffect } from "react";
import { Layout, AlumniDetails } from "~/components";
import useProfile from "~/hooks/useProfile";
import { Card, Row, Col, Typography, Avatar, Tag, Divider, Button, Space, Descriptions, Empty, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, EditOutlined, BookOutlined  } from "@ant-design/icons";

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
        displayName: profileData.first_name + ' ' + profileData.last_name || "Not provided",
        avatar: profileData.image || null,
        dateOfBirth: (profileData === null || profileData === void 0 ? void 0 : profileData.birth_date) || "Not provided",
        gender: (profileData === null || profileData === void 0 ? void 0 : profileData.gender) || "Not provided",
        nationality: "Filipino"
      },
            
            // Contact Information (to be filled)
            contactInfo: {
                email: profileData.email || "Not provided",
                phone: profileData.phone || "Not provided",
                alternatePhone: "Not provided",
                address: profileData.address || "Not provided",
                socialMedia: {
                    linkedin: "Not provided",
                    twitter: "Not provided",
                    facebook: "Not provided"
                }
            },
            
                professionalInfo: {
      currentCompany: profileData.current_company || "Not provided",
      jobTitle: profileData.job_title || "Not provided",
      industry: profileData.industry || "Not provided",
      yearsExperience: profileData.years_experience || "Not provided",
      salaryRange: profileData.salary_range || "Not provided",
      workLocation: profileData.work_location || "Not provided",
      previousCompanies: Array.isArray(profileData.previous_companies)
        ? profileData.previous_companies
        : [profileData.previous_companies || "Not provided"],
      // linkedin: profileData.linkedin || "Not provided",
      // github: profileData.github || "Not provided",
      // portfolio: profileData.portfolio || "Not provided",
      // twitter: profileData.twitter || "Not provided"
    },


            // Professional Information (to be filled)
           academicInfo: {
  // course_id: profileData.course_id || "Not provided",
  studentId: profileData.student_id || "Not provided",
  admissionYear: profileData.enrollment_year || "Not provided",
  graduationYear: profileData.graduation_year || "Not provided",
  honors: Array.isArray(profileData.honors) 
      ? profileData.honors.join(", ") 
      : profileData.honors || "Not provided",
  thesisTitle: profileData.thesis_title || "Not provided",
  continueEducation: !!profileData.continue_education
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
            student_id: values.student_id,
            graduation_year: values.graduation_year,
            enrollment_year: values.enrollment_year,
            honors:
                typeof values.honors === "string" && values.honors.trim() !== ""
                    ? JSON.parse(values.honors)
                    : Array.isArray(values.honors)
                    ? values.honors
                    : [],
            thesis_title: values.thesis_title,
            academic_achievements: values.academic_achievements,
            extracurricular: values.extracurricular,
            continue_education: values.continue_education,

            // Career Information
            employment_status_id: values.employment_status_id,
            current_company: values.current_company,
            job_title: values.job_title,
            industry: values.industry,
            years_experience: values.years_experience,
            salary_range: values.salary_range,
            work_location: values.work_location,
            career_goals: values.career_goals,
            previous_companies: values.previous_companies,

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

                    {/* Contact Information*/}
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
                                {/* <Descriptions.Item label="Alternate Phone">
                                    {detailedProfile?.contactInfo?.alternatePhone}
                                </Descriptions.Item> */}
                                <Descriptions.Item label="Address">
                                    {detailedProfile?.contactInfo?.address}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col> 

    {/* Academic Information */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BookOutlined />
                Academic Information
              </Space>
            }
            bordered={false}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Student ID">
                {detailedProfile?.academicInfo?.studentId || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Admission Year">
                {detailedProfile?.academicInfo?.admissionYear || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Graduation Year">
                {detailedProfile?.academicInfo?.graduationYear || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Honors">
                {detailedProfile?.academicInfo?.honors || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Thesis Title">
                {detailedProfile?.academicInfo?.thesisTitle || "Not provided"}
              </Descriptions.Item>
              <Descriptions.Item label="Continuing Education">
                {detailedProfile?.academicInfo?.continueEducation ? "Yes" : "No"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>


        {/* Professional Information */}
<Col xs={24} lg={12}>
    <Card
        title={
            <Space>
                <MailOutlined />
                Professional Information
            </Space>
        }
        bordered={false}
    >
        <Descriptions column={1} size="small">
            <Descriptions.Item label="Current Company">
                {detailedProfile?.professionalInfo?.currentCompany}
            </Descriptions.Item>

            <Descriptions.Item label="Job Title">
                {detailedProfile?.professionalInfo?.jobTitle}
            </Descriptions.Item>

            <Descriptions.Item label="Industry">
                {detailedProfile?.professionalInfo?.industry}
            </Descriptions.Item>

            <Descriptions.Item label="Years of Experience">
                {detailedProfile?.professionalInfo?.yearsExperience}
            </Descriptions.Item>

            <Descriptions.Item label="Salary Range">
                {detailedProfile?.professionalInfo?.salaryRange}
            </Descriptions.Item>

            <Descriptions.Item label="Work Location">
                {detailedProfile?.professionalInfo?.workLocation}
            </Descriptions.Item>

            <Descriptions.Item label="Previous Companies">
                {Array.isArray(detailedProfile?.professionalInfo?.previousCompanies)
                    ? detailedProfile.professionalInfo.previousCompanies.join(", ")
                    : detailedProfile?.professionalInfo?.previousCompanies}
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
        <Descriptions column={1} size="small">
            <Descriptions.Item label="Bio">
                {detailedProfile?.additionalInfo?.bio}
            </Descriptions.Item>

            <Descriptions.Item label="Academic Achievements">
                {detailedProfile?.additionalInfo?.academicAchievements}
            </Descriptions.Item>

            <Descriptions.Item label="Extracurricular Activities">
                {detailedProfile?.additionalInfo?.extracurricular}
            </Descriptions.Item>

            <Descriptions.Item label="Career Goals">
                {detailedProfile?.additionalInfo?.careerGoals}
            </Descriptions.Item>

            <Descriptions.Item label="Last Updated">
                {detailedProfile?.basicInfo?.lastUpdated}
            </Descriptions.Item>
        </Descriptions>
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