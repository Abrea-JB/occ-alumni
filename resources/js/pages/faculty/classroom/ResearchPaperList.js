import React, { useMemo, useState } from "react";
import {
  Avatar,
  List,
  Typography,
  Tag,
  Space,
  Divider,
  Popover,
  Card,
  Row,
  Col,
  Image,
  Button,
  Input,
  Select,
  Checkbox
} from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  TeamOutlined,
  ReadOutlined,
  CalendarOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;
const { Option } = Select;

// --- Mock dataset with images -----------------------------------------------------------
const MOCK_PAPERS = [
  {
    key: "1",
    title: "React Fiber: A Reconciler for Incremental Rendering",
    authors: ["Dan Abramov", "Andrew Clark"],
    year: 2017,
    venue: "Facebook Engineering Notes",
    topics: ["React", "Rendering", "Scheduling"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    abstract: "A deep dive into React's new reconciliation algorithm that enables incremental rendering and better scheduling capabilities."
  },
  {
    key: "2",
    title: "Concurrent Mode and the Evolution of UI Architectures",
    authors: ["Sebastian Markbåge"],
    year: 2019,
    venue: "Talk / RFC",
    topics: ["Concurrent", "Scheduling", "UI"],
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    abstract: "Exploring how concurrent rendering changes the way we think about UI architecture and user experience."
  },
  {
    key: "3",
    title: "Server Components: Rethinking the Client-Server Boundary",
    authors: ["Dan Abramov", "Lauren Tan"],
    year: 2020,
    venue: "RFC",
    topics: ["Server Components", "Performance", "Bundling"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    abstract: "Introducing a new mental model for component architecture that spans both client and server environments."
  },
  {
    key: "4",
    title: "Signals, State, and the Future of React State Management",
    authors: ["Research Collective"],
    year: 2023,
    venue: "Whitepaper",
    topics: ["State", "Signals", "React"],
    image: "https://images.unsplash.com/photo-1620676044943-24105eca5d56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    abstract: "Examining new approaches to state management that provide fine-grained reactivity with minimal overhead."
  },
  {
    key: "5",
    title: "Streaming SSR and Selective Hydration in Practice",
    authors: ["Ada Lovelace", "Grace Hopper"],
    year: 2022,
    venue: "Web Perf Conf",
    topics: ["SSR", "Hydration", "Performance"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    abstract: "Practical implementation strategies for server-side rendering with streaming and selective hydration techniques."
  },
];

// --- Utilities --------------------------------------------------------------
const topicPalette = {
  React: "geekblue",
  Rendering: "volcano",
  Scheduling: "gold",
  Concurrent: "cyan",
  UI: "purple",
  "Server Components": "green",
  Performance: "lime",
  Bundling: "magenta",
  State: "blue",
  Signals: "orange",
  SSR: "red",
  Hydration: "green",
};

// Group avatar component
const GroupAvatar = ({ authors }) => {
  if (authors.length === 1) {
    return <Avatar size="large" icon={<UserOutlined />} />;
  }
  
  return (
    <Avatar 
      size="large" 
      icon={<TeamOutlined />} 
      style={{ backgroundColor: authors.length > 2 ? '#7265e6' : '#ffbf00' }}
    />
  );
};

// --- Component --------------------------------------------------------------
export default function ResearchPaperList() {
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [searchText, setSearchText] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [yearRange, setYearRange] = useState([2010, 2023]);
  const [showFilters, setShowFilters] = useState(false);

  const allTopics = useMemo(
    () => Array.from(new Set(MOCK_PAPERS.flatMap((p) => p.topics))).sort(),
    []
  );

  // Filter papers based on search and filters
  const filteredPapers = useMemo(() => {
    return MOCK_PAPERS.filter(paper => {
      // Search text filter
      const matchesSearch = searchText === '' || 
        paper.title.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchText.toLowerCase())) ||
        paper.abstract.toLowerCase().includes(searchText.toLowerCase());
      
      // Topic filter
      const matchesTopics = selectedTopics.length === 0 || 
        selectedTopics.some(topic => paper.topics.includes(topic));
      
      // Year filter
      const matchesYear = paper.year >= yearRange[0] && paper.year <= yearRange[1];
      
      return matchesSearch && matchesTopics && matchesYear;
    });
  }, [searchText, selectedTopics, yearRange]);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with search and controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Title level={2} className="!mb-0">Research Papers</Title>
            
            <div className="flex items-center gap-2">
              <Button 
                icon={viewMode === 'list' ? <AppstoreOutlined /> : <UnorderedListOutlined />}
                onClick={toggleViewMode}
              >
                {viewMode === 'list' ? 'Grid View' : 'List View'}
              </Button>
              
              <Button 
                icon={<FilterOutlined />}
                type={showFilters ? "primary" : "default"}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </div>
          </div>
          
          <Search
            placeholder="Search papers, authors, or topics..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="mb-4"
          />
          
          {/* Filter panel */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Text strong className="block mb-2">Topics</Text>
                  <div className="flex flex-wrap gap-2">
                    {allTopics.map(topic => (
                      <Checkbox 
                        key={topic}
                        checked={selectedTopics.includes(topic)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTopics([...selectedTopics, topic]);
                          } else {
                            setSelectedTopics(selectedTopics.filter(t => t !== topic));
                          }
                        }}
                      >
                        <Tag color={topicPalette[topic] || "default"} className="rounded-full px-2">
                          {topic}
                        </Tag>
                      </Checkbox>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Text strong className="block mb-2">Publication Year</Text>
                  <div className="flex items-center gap-2">
                    <Select
                      value={yearRange[0]}
                      onChange={(value) => setYearRange([value, yearRange[1]])}
                      style={{ width: 100 }}
                    >
                      {[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(year => (
                        <Option key={year} value={year}>{year}</Option>
                      ))}
                    </Select>
                    <span>to</span>
                    <Select
                      value={yearRange[1]}
                      onChange={(value) => setYearRange([yearRange[0], value])}
                      style={{ width: 100 }}
                    >
                      {[2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023].map(year => (
                        <Option key={year} value={year}>{year}</Option>
                      ))}
                    </Select>
                  </div>
                  
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={() => setSelectedTopics([])}
                    className="mt-4"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4">
          <Text type="secondary">
            Showing {filteredPapers.length} of {MOCK_PAPERS.length} papers
          </Text>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <Row gutter={[24, 24]}>
            {filteredPapers.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.key}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <Image
                        alt={item.title}
                        src={item.image}
                        height={200}
                        style={{ objectFit: 'cover' }}
                        preview={false}
                      />
                    </div>
                  }
                  actions={[
                    <Button type="link" icon={<ReadOutlined />}>Read Paper</Button>,
                    <Button type="link" icon={<InfoCircleOutlined />}>Abstract</Button>
                  ]}
                >
                  <Meta
                    avatar={<GroupAvatar authors={item.authors} />}
                    title={item.title}
                    description={
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <CalendarOutlined className="mr-1" />
                          {item.year} · {item.venue}
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {item.authors.join(", ")}
                        </div>
                        <div className="mt-2">
                          {item.topics.map((t) => (
                            <Tag 
                              key={t} 
                              color={topicPalette[t] || "default"} 
                              className="rounded-full px-2 mb-1"
                            >
                              {t}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <List
              itemLayout="vertical"
              dataSource={filteredPapers}
              renderItem={(item) => (
                <List.Item
                  extra={
                    <Image
                      width={150}
                      alt={item.title}
                      src={item.image}
                      style={{ borderRadius: 8 }}
                    />
                  }
                  actions={[
                    <Button type="link" icon={<ReadOutlined />}>Read Paper</Button>,
                    <Button type="link" icon={<InfoCircleOutlined />}>View Abstract</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<GroupAvatar authors={item.authors} />}
                    title={<div className="font-medium text-lg">{item.title}</div>}
                    description={
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          {item.authors.join(", ")} · {item.venue} · {item.year}
                        </div>
                        <div className="text-sm mt-2 mb-3">
                          {item.abstract}
                        </div>
                        <Space wrap className="mt-1">
                          {item.topics.map((t) => (
                            <Tag key={t} color={topicPalette[t] || "default"} className="rounded-full px-2">
                              {t}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}

        {/* No results message */}
        {filteredPapers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Title level={4} className="!mb-2">No papers found</Title>
            <Text type="secondary">Try adjusting your search or filters</Text>
          </div>
        )}
      </div>
    </div>
  );
}