import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Input, 
  Select, 
  Tag, 
  Avatar, 
  Divider,
  Button,
  Layout,
  Typography,
  Space,
  Badge
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  MailOutlined,
  GlobalOutlined,
  LinkedinOutlined,
  GithubOutlined
} from '@ant-design/icons';
import './AlumniDirectory.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;

// Mock data for alumni
const alumniData = [
  {
    id: 1,
    name: 'Alex Johnson',
    graduationYear: 2020,
    course: 'Computer Science',
    specialization: 'Artificial Intelligence',
    currentRole: 'Software Engineer',
    company: 'TechCorp Inc.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    email: 'alex.johnson@example.com',
    website: 'https://alexjohnson.dev',
    linkedin: 'alexjohnson',
    github: 'alexjohnson',
    skills: ['React', 'Python', 'Machine Learning', 'Node.js'],
    description: 'Passionate about building scalable AI solutions. Open to mentoring opportunities.'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    graduationYear: 2019,
    course: 'Business Administration',
    specialization: 'Marketing',
    currentRole: 'Product Manager',
    company: 'InnovateCo',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'maria.garcia@example.com',
    website: 'https://mariagarcia.com',
    linkedin: 'mariagarcia',
    github: '',
    skills: ['Product Strategy', 'Market Research', 'UX Design', 'Agile'],
    description: 'Focused on creating products that solve real user problems. Love connecting with fellow alumni.'
  },
  {
    id: 3,
    name: 'James Wilson',
    graduationYear: 2021,
    course: 'Electrical Engineering',
    specialization: 'Power Systems',
    currentRole: 'Electrical Engineer',
    company: 'PowerGrid Solutions',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    email: 'james.wilson@example.com',
    website: '',
    linkedin: 'jameswilson',
    github: 'jameswilson',
    skills: ['MATLAB', 'Circuit Design', 'Renewable Energy', 'PLC Programming'],
    description: 'Specializing in sustainable energy solutions. Always excited to discuss new tech in the energy sector.'
  },
  {
    id: 4,
    name: 'Sarah Chen',
    graduationYear: 2018,
    course: 'Computer Science',
    specialization: 'Data Science',
    currentRole: 'Data Scientist',
    company: 'DataInsights LLC',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    email: 'sarah.chen@example.com',
    website: 'https://sarahchen.blog',
    linkedin: 'sarahchen',
    github: 'sarahchen',
    skills: ['Python', 'SQL', 'TensorFlow', 'Data Visualization'],
    description: 'Turning data into actionable insights. Active in the data science community and open to collaborations.'
  },
  {
    id: 5,
    name: 'David Kim',
    graduationYear: 2020,
    course: 'Mechanical Engineering',
    specialization: 'Robotics',
    currentRole: 'Robotics Engineer',
    company: 'AutoBotics Inc.',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    email: 'david.kim@example.com',
    website: '',
    linkedin: 'davidkim',
    github: 'davidkim',
    skills: ['CAD', 'ROS', 'Python', 'Control Systems'],
    description: 'Building the next generation of autonomous systems. Passionate about engineering education.'
  },
  {
    id: 6,
    name: 'Lisa Taylor',
    graduationYear: 2019,
    course: 'Business Administration',
    specialization: 'Finance',
    currentRole: 'Financial Analyst',
    company: 'Global Finance Group',
    image: 'https://randomuser.me/api/portraits/women/26.jpg',
    email: 'lisa.taylor@example.com',
    website: 'https://lisataylorfinance.com',
    linkedin: 'lisataylor',
    github: '',
    skills: ['Financial Modeling', 'Excel', 'Risk Analysis', 'Investment Strategies'],
    description: 'Focused on quantitative finance and investment strategies. Happy to advise students interested in finance careers.'
  }
];

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState(alumniData);
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Extract unique values for filters
  const courses = [...new Set(alumniData.map(item => item.course))];
  const graduationYears = [...new Set(alumniData.map(item => item.graduationYear))].sort((a, b) => b - a);
  const roles = [...new Set(alumniData.map(item => item.currentRole))];

  // Filter alumni based on search and filter criteria
  useEffect(() => {
    let filtered = alumniData;

    if (searchText) {
      filtered = filtered.filter(alum => 
        alum.name.toLowerCase().includes(searchText.toLowerCase()) ||
        alum.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase())) ||
        alum.currentRole.toLowerCase().includes(searchText.toLowerCase()) ||
        alum.company.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (courseFilter !== 'All') {
      filtered = filtered.filter(alum => alum.course === courseFilter);
    }

    if (yearFilter !== 'All') {
      filtered = filtered.filter(alum => alum.graduationYear === parseInt(yearFilter));
    }

    if (roleFilter !== 'All') {
      filtered = filtered.filter(alum => alum.currentRole === roleFilter);
    }

    setAlumni(filtered);
  }, [searchText, courseFilter, yearFilter, roleFilter]);

  const handleResetFilters = () => {
    setSearchText('');
    setCourseFilter('All');
    setYearFilter('All');
    setRoleFilter('All');
  };

  return (
    <Layout className="alumni-directory">
      <Header className="directory-header">
        <div className="header-content">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            Alumni Directory
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
            Connect with graduates from our institution
          </Text>
        </div>
      </Header>
      
      <Content className="directory-content">
        <div className="filters-section">
          <Title level={3}>Find Alumni</Title>
          
          <div className="filters-container">
            <Input
              placeholder="Search by name, skills, role, or company"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              size="large"
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Text strong>Course</Text>
                <Select
                  value={courseFilter}
                  onChange={setCourseFilter}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="All">All Courses</Option>
                  {courses.map(course => (
                    <Option key={course} value={course}>{course}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <Text strong>Graduation Year</Text>
                <Select
                  value={yearFilter}
                  onChange={setYearFilter}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="All">All Years</Option>
                  {graduationYears.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} sm={8}>
                <Text strong>Current Role</Text>
                <Select
                  value={roleFilter}
                  onChange={setRoleFilter}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="All">All Roles</Option>
                  {roles.map(role => (
                    <Option key={role} value={role}>{role}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            
            <Button 
              type="link" 
              onClick={handleResetFilters}
              style={{ marginTop: 16 }}
            >
              Reset Filters
            </Button>
          </div>
          
          <Divider />
        </div>
        
        <div className="results-section">
          <div className="results-header">
            <Title level={4}>
              {alumni.length} {alumni.length === 1 ? 'Alumnus' : 'Alumni'} Found
            </Title>
          </div>
          
          <Row gutter={[24, 24]}>
            {alumni.map(alum => (
              <Col xs={24} sm={12} lg={8} key={alum.id}>
                <Card 
                  className="alumni-card"
                  cover={
                    <div className="card-cover">
                      <Avatar 
                        size={100} 
                        src={alum.image} 
                        icon={<UserOutlined />}
                        className="alumni-avatar"
                      />
                      <Badge 
                        count={`Class of ${alum.graduationYear}`} 
                        className="graduation-badge"
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    </div>
                  }
                  actions={[
                    <MailOutlined key="email" onClick={() => window.location.href = `mailto:${alum.email}`} />,
                    alum.linkedin && <LinkedinOutlined key="linkedin" onClick={() => window.open(`https://linkedin.com/in/${alum.linkedin}`, '_blank')} />,
                    alum.github && <GithubOutlined key="github" onClick={() => window.open(`https://github.com/${alum.github}`, '_blank')} />,
                    alum.website && <GlobalOutlined key="website" onClick={() => window.open(alum.website, '_blank')} />
                  ]}
                >
                  <Meta
                    title={alum.name}
                    description={
                      <div className="alumni-info">
                        <div className="role-company">
                          <Text strong>{alum.currentRole}</Text>
                          <Text type="secondary"> at {alum.company}</Text>
                        </div>
                        
                        <div className="course-info">
                          <Text>{alum.course}</Text>
                          {alum.specialization && (
                            <Text type="secondary"> • {alum.specialization}</Text>
                          )}
                        </div>
                        
                        <div className="alumni-description">
                          <Text type="secondary">{alum.description}</Text>
                        </div>
                        
                        <div className="skills-section">
                          <Divider orientation="left" plain>
                            <Text type="secondary">Skills</Text>
                          </Divider>
                          <div className="skills-tags">
                            {alum.skills.map(skill => (
                              <Tag key={skill} color="blue">{skill}</Tag>
                            ))}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          
          {alumni.length === 0 && (
            <div className="no-results">
              <Title level={4}>No alumni match your search criteria</Title>
              <Text>Try adjusting your filters or search terms</Text>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default AlumniDirectory;