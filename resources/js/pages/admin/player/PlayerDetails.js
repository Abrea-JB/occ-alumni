import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Avatar, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Select, 
  Typography,
  Badge,
  Tooltip,
  Modal,
  Statistic,
  Divider
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  FilterOutlined,
  PlusOutlined,
  StarFilled,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Meta } = Card;

// Sample player registration data
const registeredPlayersData = [
  {
    id: 'PL001',
    name: 'Cristiano Ronaldo',
    email: 'cr7@example.com',
    phone: '+1-555-0101',
    sport: 'Football',
    position: 'Forward',
    status: 'active',
    registrationDate: '2024-01-15',
    bookings: 12,
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=300',
    level: 'Professional',
    rating: 4.8,
    matches: 156,
    fee: '$2,500'
  },
  {
    id: 'PL002',
    name: 'LeBron James',
    email: 'lebron@example.com',
    phone: '+1-555-0102',
    sport: 'Basketball',
    position: 'Small Forward',
    status: 'active',
    registrationDate: '2024-01-20',
    bookings: 8,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300',
    level: 'Professional',
    rating: 4.9,
    matches: 89,
    fee: '$3,000'
  },
  {
    id: 'PL003',
    name: 'Serena Williams',
    email: 'serena@example.com',
    phone: '+1-555-0103',
    sport: 'Tennis',
    position: 'Singles',
    status: 'pending',
    registrationDate: '2024-02-01',
    bookings: 5,
    image: 'https://images.unsplash.com/photo-1587280501635-68baa78855c0?w=300',
    level: 'Professional',
    rating: 4.7,
    matches: 67,
    fee: '$2,800'
  },
  {
    id: 'PL004',
    name: 'Lionel Messi',
    email: 'messi@example.com',
    phone: '+1-555-0104',
    sport: 'Football',
    position: 'Attacking Midfielder',
    status: 'active',
    registrationDate: '2024-01-10',
    bookings: 15,
    image: 'https://images.unsplash.com/photo-1551958219-acbc040a737f?w=300',
    level: 'Professional',
    rating: 4.9,
    matches: 189,
    fee: '$2,700'
  },
  {
    id: 'PL005',
    name: 'Simone Biles',
    email: 'biles@example.com',
    phone: '+1-555-0105',
    sport: 'Gymnastics',
    position: 'All-around',
    status: 'inactive',
    registrationDate: '2024-02-05',
    bookings: 3,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
    level: 'Elite',
    rating: 4.6,
    matches: 45,
    fee: '$3,200'
  },
  {
    id: 'PL006',
    name: 'Novak Djokovic',
    email: 'novak@example.com',
    phone: '+1-555-0106',
    sport: 'Tennis',
    position: 'Singles',
    status: 'active',
    registrationDate: '2024-01-25',
    bookings: 7,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=300',
    level: 'Professional',
    rating: 4.8,
    matches: 78,
    fee: '$2,900'
  },
  {
    id: 'PL007',
    name: 'Katie Ledecky',
    email: 'katie@example.com',
    phone: '+1-555-0107',
    sport: 'Swimming',
    position: 'Freestyle',
    status: 'active',
    registrationDate: '2024-02-10',
    bookings: 6,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=300',
    level: 'Olympic',
    rating: 4.5,
    matches: 56,
    fee: '$2,600'
  },
  {
    id: 'PL008',
    name: 'Stephen Curry',
    email: 'steph@example.com',
    phone: '+1-555-0108',
    sport: 'Basketball',
    position: 'Point Guard',
    status: 'pending',
    registrationDate: '2024-02-15',
    bookings: 4,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300',
    level: 'Professional',
    rating: 4.7,
    matches: 92,
    fee: '$3,100'
  }
];

const PlayerDetails = () => {
  const [searchText, setSearchText] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'pending': return 'orange';
      case 'inactive': return 'red';
      default: return 'blue';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Professional': return 'blue';
      case 'Elite': return 'purple';
      case 'Olympic': return 'gold';
      default: return 'green';
    }
  };

  // Filter players based on search and filters
  const filteredPlayers = registeredPlayersData.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesSport = sportFilter === 'all' || player.sport === sportFilter;
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  const handleViewPlayer = (playerId) => {
    Modal.info({
      title: 'Player Details',
      content: `View details for player ${playerId}`,
    });
  };

  const handleEditPlayer = (playerId) => {
    Modal.info({
      title: 'Edit Player',
      content: `Edit player ${playerId}`,
    });
  };

  const handleDeletePlayer = (playerId) => {
    Modal.confirm({
      title: 'Delete Player',
      content: `Are you sure you want to delete player ${playerId}?`,
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Registered Players</Title>
            <Text type="secondary">Manage all players registered on your platform</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Add New Player
          </Button>
        </div>
        
        {/* Filters and Search */}
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search by name or email..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="All Sports"
                style={{ width: '100%' }}
                value={sportFilter}
                onChange={setSportFilter}
                suffixIcon={<FilterOutlined />}
                size="large"
              >
                <Option value="all">All Sports</Option>
                <Option value="Football">Football</Option>
                <Option value="Basketball">Basketball</Option>
                <Option value="Tennis">Tennis</Option>
                <Option value="Swimming">Swimming</Option>
                <Option value="Gymnastics">Gymnastics</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="All Status"
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
                suffixIcon={<FilterOutlined />}
                size="large"
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="pending">Pending</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8} style={{ textAlign: 'right' }}>
              <Statistic 
                title="Total Players" 
                value={filteredPlayers.length} 
                valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      {/* Players Grid */}
      <Row gutter={[24, 24]}>
        {filteredPlayers.map((player) => (
          <Col 
            key={player.id}
            xs={24}      // 1 per row on mobile
            sm={12}      // 2 per row on small screens
            md={8}       // 3 per row on medium screens
            lg={6}       // 4 per row on large screens
          >
            <Card
              hoverable
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              bodyStyle={{ padding: '16px' }}
              cover={
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img
                    alt={player.name}
                    src={player.image}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.7)',
                    borderRadius: '4px',
                    padding: '2px 6px'
                  }}>
                    <Text strong style={{ color: 'white', fontSize: '10px' }}>
                      ID: {player.id}
                    </Text>
                  </div>
                  <Badge.Ribbon 
                    text={player.level} 
                    color={getLevelColor(player.level)}
                    style={{ top: '8px' }}
                  >
                    <div></div>
                  </Badge.Ribbon>
                </div>
              }
              actions={[
                <Tooltip title="View Profile">
                  <EyeOutlined 
                    onClick={() => handleViewPlayer(player.id)}
                    style={{ color: '#1890ff' }}
                  />
                </Tooltip>,
                <Tooltip title="Edit Player">
                  <EditOutlined 
                    onClick={() => handleEditPlayer(player.id)}
                    style={{ color: '#52c41a' }}
                  />
                </Tooltip>,
                <Tooltip title="Delete Player">
                  <DeleteOutlined 
                    onClick={() => handleDeletePlayer(player.id)}
                    style={{ color: '#ff4d4f' }}
                  />
                </Tooltip>
              ]}
            >
              {/* Player Header */}
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
                  {player.name}
                </Title>
                <Space>
                  <Tag color="blue">{player.sport}</Tag>
                  <Tag color={getStatusColor(player.status)}>{player.status}</Tag>
                </Space>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              {/* Player Details */}
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Position:</Text>
                  <Text>{player.position}</Text>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Bookings:</Text>
                  <Tag color={player.bookings > 10 ? 'red' : player.bookings > 5 ? 'orange' : 'green'}>
                    {player.bookings} sessions
                  </Tag>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Rating:</Text>
                  <Space size={2}>
                    <StarFilled style={{ color: '#faad14' }} />
                    <Text>{player.rating}</Text>
                  </Space>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Fee:</Text>
                  <Text type="success" strong>{player.fee}</Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Matches:</Text>
                  <Text>{player.matches}</Text>
                </div>
              </Space>

              <Divider style={{ margin: '12px 0' }} />

              {/* Contact Info */}
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MailOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: '12px' }}>{player.email}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PhoneOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ fontSize: '12px' }}>{player.phone}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarOutlined style={{ color: '#faad14' }} />
                  <Text style={{ fontSize: '12px' }}>
                    Joined: {new Date(player.registrationDate).toLocaleDateString()}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <Title level={4} type="secondary">No players found</Title>
          <Text type="secondary">Try adjusting your search or filters</Text>
        </Card>
      )}
    </div>
  );
};

export default PlayerDetails;