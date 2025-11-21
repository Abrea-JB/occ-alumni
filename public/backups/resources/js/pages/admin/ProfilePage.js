import React, { useState, useEffect } from "react";
import { Layout, AlumniDetails } from "~/components";
import useProfile from "~/hooks/useProfile";
import { Card, Row, Col, Typography, Avatar, Tag, Divider, Button, Space, Descriptions, Empty, Spin, Input, DatePicker, Select, message } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined, EditOutlined, BookOutlined, SaveOutlined, CloseOutlined  } from "@ant-design/icons";
import axiosConfig from "~/utils/axiosConfig";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProfilePage = () => {
    const { data: profile, loading, refetch } = useProfile();
    const [previewData, setPreviewData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [detailedProfile, setDetailedProfile] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedValues, setEditedValues] = useState({});
    const [saving, setSaving] = useState(false);
    const [viewOnly, setViewOnly] = useState(true);

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

const toggleEditMode = () => {
    if (!isEditMode) {
        setEditedValues({
            // Personal Information
            first_name: profile?.alumni?.first_name || "",
            last_name: profile?.alumni?.last_name || "",
            middle_name: profile?.alumni?.middle_name || "",
            suffix: profile?.alumni?.suffix || "",
            birth_date: profile?.alumni?.birth_date || "",
            gender: profile?.alumni?.gender || "",
            bio: profile?.alumni?.bio || "",
            
            // Contact Information
            email: profile?.alumni?.email || "",
            phone: profile?.alumni?.phone || "",
            address: profile?.alumni?.address || "",
            
            // Academic Information
            student_id: profile?.alumni?.student_id || "",
            graduation_year: profile?.alumni?.graduation_year || "",
            enrollment_year: profile?.alumni?.enrollment_year || "",
            honors: profile?.alumni?.honors || "",
            thesis_title: profile?.alumni?.thesis_title || "",
            continue_education: profile?.alumni?.continue_education || false,
            
            // Professional Information
            current_company: profile?.alumni?.current_company || "",
            job_title: profile?.alumni?.job_title || "",
            industry: profile?.alumni?.industry || "",
            years_experience: profile?.alumni?.years_experience || "",
            salary_range: profile?.alumni?.salary_range || "",
            work_location: profile?.alumni?.work_location || "",
            previous_companies: profile?.alumni?.previous_companies || "",
        });
    }
    setIsEditMode(!isEditMode);
};

const handleFieldChange = (field, value) => {
    setEditedValues(prev => ({
        ...prev,
        [field]: value
    }));
};

// const handleSave = async () => {
//     setSaving(true);
//     try {
//         console.log("[v0] Sending edited values to backend:", editedValues);
        
//         // Submit the edited values to the backend
//         const response = await axiosConfig.put(`/alumni/${profile?.alumni?.id}`, editedValues);
        
//         console.log("[v0] Backend response:", response.data);
        
//         if (response.data) {
//             message.success('Profile updated successfully!');
//             // Refresh profile data
//             await refetch();
//             // Exit edit mode
//             setIsEditMode(false);
//         }
//     } catch (error) {
//         console.error('[v0] Error updating profile:', error);
//         console.error('[v0] Error response:', error.response?.data);
//         message.error('Failed to update profile. Please try again.');
//     } finally {
//         setSaving(false);
//     }
// };


const handleSave = async () => {
    setSaving(true);
    try {
        console.log("[v0] Sending edited values to backend:", editedValues);

        // Submit the edited values to the backend
        const response = await axiosConfig.put(`/alumni/${profile?.alumni?.id}`, editedValues);

        console.log("[v0] Backend response:", response.data);

        if (response.data?.success) {
            message.success(response.data.message || 'Profile updated successfully!');
            // Refresh profile data
            await refetch();
            // Exit edit mode
            setIsEditMode(false);
        }
    } catch (error) {
        console.error('[v0] Error updating profile:', error);
        console.error('[v0] Error response:', error.response?.data);
        // No need to show message.error here for validation errors
        // axiosConfig interceptor will display modal automatically
    } finally {
        setSaving(false);
    }
};


const handleCancel = () => {
    setIsEditMode(false);
    setEditedValues({});
    message.info('Edit cancelled');
};

const handleEdit = () => {
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
    setViewOnly(false);   // allow editing
    setIsModalVisible(true);
};


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
                                {!isEditMode ? (
                                    <Space>
                                        <Button 
                                            type="primary" 
                                            icon={<EditOutlined />}
                                            onClick={toggleEditMode}
                                        >
                                            Edit Profile
                                        </Button>
                                        {/* <Button 
                                            type="default" 
                                            onClick={() => handleView()}
                                        >
                                            View Full Details
                                        </Button> */}
                                    </Space>
                                ) : (
                                    <Space>
                                        <Button 
                                            type="primary" 
                                            icon={<SaveOutlined />}
                                            onClick={handleSave}
                                            loading={saving}
                                        >
                                            Save Changes
                                        </Button>
                                        <Button 
                                            icon={<CloseOutlined />}
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                    </Space>
                                )}
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
  {isEditMode ? (
    <Input
      type="email"
      value={editedValues.email}
      onChange={(e) => {
        const value = e.target.value;
        handleFieldChange("email", value);
      }}
      onBlur={() => {
        if (editedValues.email && !/^[\w.+-]+@gmail\.com$/i.test(editedValues.email)) {
          message.error("Email must be a valid @gmail.com address");
        }
      }}
      placeholder="Enter email"
    />
  ) : (
    detailedProfile?.contactInfo?.email
  )}
</Descriptions.Item>

<Descriptions.Item label="Phone">
  {isEditMode ? (
    <Input
      value={editedValues.phone}
      onChange={(e) => {
        let value = e.target.value.replace(/\D/g, ""); // remove non-numbers
        if (!value.startsWith("09")) {
          value = "09" + value.replace(/^0+/, "").slice(0, 9);
        }
        value = value.slice(0, 11); // max 11 digits
        handleFieldChange("phone", value);
      }}
      placeholder="Enter phone number"
    />
  ) : (
    detailedProfile?.contactInfo?.phone
  )}
</Descriptions.Item>

                                {/* <Descriptions.Item label="Alternate Phone">
                                    {detailedProfile?.contactInfo?.alternatePhone}
                                </Descriptions.Item> */}
                                <Descriptions.Item label="Address">
                                    {isEditMode ? (
                                        <TextArea
                                            value={editedValues.address}
                                            onChange={(e) => handleFieldChange('address', e.target.value)}
                                            placeholder="Enter address"
                                        />
                                    ) : (
                                        detailedProfile?.contactInfo?.address
                                    )}
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
                {detailedProfile?.academicInfo?.studentId}
              </Descriptions.Item>
              <Descriptions.Item label="Admission Year">
                {detailedProfile?.academicInfo?.admissionYear}
              </Descriptions.Item>
              <Descriptions.Item label="Graduation Year">
                {detailedProfile?.academicInfo?.graduationYear}
              </Descriptions.Item>
              <Descriptions.Item label="Honors">
                {detailedProfile?.academicInfo?.honors}
              </Descriptions.Item>
              <Descriptions.Item label="Thesis Title">
                {detailedProfile?.academicInfo?.thesisTitle}
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
                Carrier Infromation
            </Space>
        }
        bordered={false}
    >
        <Descriptions column={1} size="small">
            <Descriptions.Item label="Current Company">
                {isEditMode ? (
                    <Input
                        value={editedValues.current_company}
                        onChange={(e) => handleFieldChange('current_company', e.target.value)}
                        placeholder="Enter current company"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.currentCompany
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Job Title">
                {isEditMode ? (
                    <Input
                        value={editedValues.job_title}
                        onChange={(e) => handleFieldChange('job_title', e.target.value)}
                        placeholder="Enter job title"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.jobTitle
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Industry">
                {isEditMode ? (
                    <Input
                        value={editedValues.industry}
                        onChange={(e) => handleFieldChange('industry', e.target.value)}
                        placeholder="Enter industry"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.industry
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Years of Experience">
                {isEditMode ? (
                    <Input
                        type="number"
                        value={editedValues.years_experience}
                        onChange={(e) => handleFieldChange('years_experience', e.target.value)}
                        placeholder="Enter years of experience"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.yearsExperience
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Salary Range">
                {isEditMode ? (
                    <Input
                        value={editedValues.salary_range}
                        onChange={(e) => handleFieldChange('salary_range', e.target.value)}
                        placeholder="Enter salary range"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.salaryRange
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Work Location">
                {isEditMode ? (
                    <Input
                        value={editedValues.work_location}
                        onChange={(e) => handleFieldChange('work_location', e.target.value)}
                        placeholder="Enter work location"
                    />
                ) : (
                    detailedProfile?.professionalInfo?.workLocation
                )}
            </Descriptions.Item>

            <Descriptions.Item label="Previous Companies">
                {isEditMode ? (
                    <TextArea
                        value={editedValues.previous_companies}
                        onChange={(e) => handleFieldChange('previous_companies', e.target.value)}
                        placeholder="Enter previous companies (comma separated)"
                        rows={2}
                    />
                ) : (
                    Array.isArray(detailedProfile?.professionalInfo?.previousCompanies)
                        ? detailedProfile.professionalInfo.previousCompanies.join(", ")
                        : detailedProfile?.professionalInfo?.previousCompanies
                )}
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
                    viewOnly={viewOnly}
                />
            </div>
        </Layout>
    );
};

export default ProfilePage;
