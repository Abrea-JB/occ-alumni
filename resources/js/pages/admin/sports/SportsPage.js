import {
    PlusOutlined,
    EditOutlined,
    ReloadOutlined,
    ExportOutlined,
    FilterOutlined,
    SearchOutlined,
    EyeOutlined,
    DeleteOutlined,
    TeamOutlined,
    TrophyOutlined,
    FireOutlined,
    CrownOutlined,
    SafetyCertificateOutlined,
    StarFilled,
    CalendarOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import {
    Badge,
    Table,
    Tooltip,
    Button,
    message,
    Space,
    Card,
    Input,
    Dropdown,
    Menu,
    Row,
    Col,
    Avatar,
    Tag,
    Statistic,
    Select,
    Divider,
    Rate,
    Modal,
    Typography,
    Progress,
    Descriptions,
} from "antd";
import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { FloatingButton, Layout, HeaderTitle, Breadcrumb } from "~/components";
import useSports from "~/hooks/useSports";
import useSportsStore from "~/states/sportsState";
import { FormSports } from "./index";
import { ERROR_MESSAGE } from "~/utils/constant";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "green";
        case "inactive":
            return "red";
        case "pending":
            return "orange";
        case "popular":
            return "purple";
        default:
            return "blue";
    }
};

const getCategoryColor = (category) => {
    const colors = {
        "Team Sports": "blue",
        Individual: "green",
        "Water Sports": "cyan",
        Extreme: "red",
        Racquet: "purple",
        Combat: "volcano",
        Athletic: "gold",
        default: "gray",
    };
    return colors[category] || colors.default;
};


 const getLevelColor = (level) => {
        switch (level) {
            case "Professional":
                return "blue";
            case "Amateur":
                return "green";
            case "Elite":
                return "purple";
            case "Olympic":
                return "gold";
            case "Recreational":
                return "orange";
            default:
                return "gray";
        }
    };

// Enhanced sports images with better banners
const sportsBanners = {
    Basketball:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop",
    Volleyball:
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop",
    Taekwondo:
        "https://plus.unsplash.com/premium_photo-1683120902370-0431903fb8b5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Lawn Tennis":
        "https://images.unsplash.com/photo-1641543678408-f0479974f438?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Football:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
    Badminton:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=200&fit=crop",
    Swimming:
        "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=200&fit=crop",
    "Sepak Takraw":
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=200&fit=crop",
    Baseball:
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=200&fit=crop",
    "Table Tennis":
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=200&fit=crop",
    default:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=200&fit=crop",
};

const SportDetailsModal = ({ sport, visible, onClose }) => {
    if (!sport) return null;

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <TrophyOutlined style={{ color: "#1890ff" }} />
                    <span>{sport.name} - Sport Details</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                <Button
                    key="edit"
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setField("visible", true);
                        setField("editData", sport);
                        onClose();
                    }}
                >
                    Edit Sport
                </Button>,
            ]}
            width={900}
            style={{ top: 20 }}
        >
            <div style={{ padding: 0 }}>
                {/* Banner Header */}
                <div
                    style={{
                        height: 200,
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${sport.banner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: "20px",
                        color: "white",
                        position: "relative",
                    }}
                >
                    <div style={{ position: "absolute", top: 20, right: 20 }}>
                        <Tag
                            color={getStatusColor(sport.status)}
                            style={{
                                fontWeight: "bold",
                                border: "2px solid white",
                            }}
                        >
                            {sport.status.toUpperCase()}
                        </Tag>
                    </div>
                    <div>
                        <Title level={2} style={{ color: "white", margin: 0 }}>
                            {sport.name}
                        </Title>
                        <Space size={[8, 8]} wrap style={{ marginTop: 8 }}>
                            <Tag
                                color={getLevelColor(sport.level)}
                                style={{ color: "white", borderColor: "white" }}
                            >
                                {sport.level}
                            </Tag>
                            <Tag
                                color={getCategoryColor(sport.category)}
                                style={{ color: "white", borderColor: "white" }}
                            >
                                {sport.category}
                            </Tag>
                        </Space>
                    </div>
                </div>

                <div style={{ padding: "24px" }}>
                    <Row gutter={[24, 24]}>
                        <Col span={16}>
                            <Card title="Sport Overview" bordered={false}>
                                <Descriptions column={2} bordered>
                                    <Descriptions.Item
                                        label="Sport Name"
                                        span={2}
                                    >
                                        <Text strong>{sport.name}</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Category">
                                        <Tag
                                            color={getCategoryColor(
                                                sport.category
                                            )}
                                        >
                                            {sport.category}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Competition Level">
                                        <Tag color={getLevelColor(sport.level)}>
                                            {sport.level}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Established">
                                        <CalendarOutlined
                                            style={{ marginRight: 8 }}
                                        />
                                        {sport.established}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        <Tag
                                            color={getStatusColor(sport.status)}
                                        >
                                            {sport.status.toUpperCase()}
                                        </Tag>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Success Rate">
                                        <Progress
                                            percent={sport.stats.successRate}
                                            size="small"
                                        />
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card title="Performance Metrics" bordered={false}>
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                    size="large"
                                >
                                    <div>
                                        <Text strong>Overall Rating</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Rate
                                                disabled
                                                defaultValue={
                                                    sport.stats.rating
                                                }
                                                style={{ color: "#faad14" }}
                                            />
                                            <Text
                                                strong
                                                style={{
                                                    marginLeft: 8,
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {sport.stats.rating}
                                            </Text>
                                        </div>
                                    </div>
                                    <Divider style={{ margin: "12px 0" }} />
                                    <Statistic
                                        title="Active Players"
                                        value={sport.stats.players}
                                        prefix={<TeamOutlined />}
                                    />
                                    <Statistic
                                        title="Certified Coaches"
                                        value={sport.stats.coaches}
                                    />
                                    <Statistic
                                        title="Tournaments"
                                        value={sport.stats.tournaments}
                                        prefix={<TrophyOutlined />}
                                    />
                                    <Statistic
                                        title="Matches Played"
                                        value={sport.stats.matches}
                                    />
                                </Space>
                            </Card>
                        </Col>
                    </Row>

                    <Card
                        title="Popularity & Engagement"
                        style={{ marginTop: 24 }}
                        bordered={false}
                    >
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Text strong>Community Popularity</Text>
                                <Progress
                                    percent={sport.stats.popularity}
                                    status={
                                        sport.stats.popularity > 80
                                            ? "active"
                                            : "normal"
                                    }
                                    strokeColor={
                                        sport.stats.popularity > 80
                                            ? "#52c41a"
                                            : "#1890ff"
                                    }
                                />
                            </Col>
                            <Col span={12}>
                                <Text strong>Growth Trend</Text>
                                <Progress
                                    percent={Math.min(
                                        sport.stats.popularity + 15,
                                        100
                                    )}
                                    status="active"
                                    strokeColor="#ff7c45"
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        </Modal>
    );
};

const SportsPage = () => {
    const history = useHistory();
    const queryClient = useQueryClient();
    const { setField, createNewSports } = useSportsStore();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [viewMode, setViewMode] = useState("card");
    const [selectedSport, setSelectedSport] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { isLoading, data, isFetching, refetch } = useSports();

    const mutation = useMutation(createNewSports, {
        onMutate: async (variables) => {
            setField("isSubmit", true);
        },
        onSuccess: (data) => {
            if (data?.error) {
                message.error(ERROR_MESSAGE);
            } else {
                queryClient.invalidateQueries("sports");
                setField("visible", false);
                setField("isSubmit", false);
                setField("shouldClearForm", true);
                setField("editData", null);
                if (data.data === "created") {
                    message.success("New Sports successfully created!");
                }
                if (data.data === "updated") {
                    message.success("Sports updated successfully!");
                }
            }
        },
        onSettled: () => {
            setField("isSubmit", false);
            setField("shouldClearForm", true);
            setField("editData", null);
        },
    });

   

    const getSportBanner = (sportName) => {
        return sportsBanners[sportName] || sportsBanners.default;
    };

    const getSportStats = (sport) => {
        // Enhanced stats with more variety
        return {
            players: Math.floor(Math.random() * 500) + 50,
            coaches: Math.floor(Math.random() * 50) + 5,
            matches: Math.floor(Math.random() * 1000) + 100,
            rating: (Math.random() * 1 + 4).toFixed(1),
            popularity: Math.floor(Math.random() * 100),
            tournaments: Math.floor(Math.random() * 50) + 5,
            successRate: Math.floor(Math.random() * 40) + 60,
        };
    };

    const getSportLevel = () => {
        const levels = [
            "Professional",
            "Amateur",
            "Elite",
            "Olympic",
            "Recreational",
        ];
        return levels[Math.floor(Math.random() * levels.length)];
    };

    const { filteredData, totalCount } = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            return { filteredData: [], totalCount: 0 };
        }

        const filtered = data.filter((item) => {
            const matchesSearch =
                !search ||
                item.name?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || item.status === statusFilter;
            const matchesCategory =
                categoryFilter === "all" || item.category === categoryFilter;
            const matchesLevel =
                levelFilter === "all" || item.level === levelFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCategory &&
                matchesLevel
            );
        });

        return {
            filteredData: filtered.map((item, index) => ({
                ...item,
                key: item.id || `sport-${index}`,
                stats: getSportStats(item),
                level: item.level || getSportLevel(),
                category: item.category || "Team Sports",
                banner: getSportBanner(item.name),
                established: 1900 + Math.floor(Math.random() * 124), // 1900-2024
            })),
            totalCount: filtered.length,
        };
    }, [data, search, statusFilter, categoryFilter, levelFilter]);

    const onSearch = (value) => {
        setSearch(value);
    };

    const handleRefresh = () => {
        refetch();
        message.success("Data refreshed successfully!");
    };

    const handleClearSearch = () => {
        setSearch("");
    };

    const handleViewDetails = (sport) => {
        setSelectedSport(sport);
        setModalVisible(true);
    };

    return (
        <Layout breadcrumb={Breadcrumb.College()}>
            <HeaderTitle title="Sports Management" />
            <div className="tabled">
                <Card
                    title={
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <TrophyOutlined
                                    style={{
                                        fontSize: 24,
                                        color: "#1890ff",
                                        marginRight: 12,
                                    }}
                                />
                                <span style={{ fontSize: 20, fontWeight: 600 }}>
                                    Sports Catalog
                                </span>
                                <Badge
                                    count={totalCount}
                                    showZero
                                    style={{
                                        backgroundColor: "#1890ff",
                                        marginLeft: 12,
                                        fontSize: 12,
                                    }}
                                />
                            </div>

                            <Space>
                                <Button
                                    type={
                                        viewMode === "table"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => setViewMode("table")}
                                    icon={<i>📊</i>}
                                >
                                    Table View
                                </Button>
                                <Button
                                    type={
                                        viewMode === "card"
                                            ? "primary"
                                            : "default"
                                    }
                                    onClick={() => setViewMode("card")}
                                    icon={<i>🃏</i>}
                                    style={{ marginRight: 20 }}
                                >
                                    Card View
                                </Button>
                            </Space>
                        </div>
                    }
                    bordered={false}
                    style={{
                        borderRadius: 16,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    extra={
                        <Space size="middle" wrap>
                            <Search
                                placeholder="Search sports..."
                                allowClear
                                onSearch={onSearch}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: 280 }}
                                value={search}
                                enterButton={<SearchOutlined />}
                                size="large"
                            />

                            <Select
                                placeholder="Status"
                                style={{ width: 120 }}
                                value={statusFilter}
                                onChange={setStatusFilter}
                                suffixIcon={<FilterOutlined />}
                                size="large"
                            >
                                <Option value="all">All Status</Option>
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="popular">Popular</Option>
                            </Select>

                            <Select
                                placeholder="Category"
                                style={{ width: 140 }}
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                suffixIcon={<FilterOutlined />}
                                size="large"
                            >
                                <Option value="all">All Categories</Option>
                                <Option value="Team Sports">Team Sports</Option>
                                <Option value="Individual">Individual</Option>
                                <Option value="Water Sports">
                                    Water Sports
                                </Option>
                                <Option value="Extreme">Extreme</Option>
                                <Option value="Racquet">Racquet</Option>
                                <Option value="Combat">Combat</Option>
                                <Option value="Athletic">Athletic</Option>
                            </Select>

                            <Select
                                placeholder="Level"
                                style={{ width: 130 }}
                                value={levelFilter}
                                onChange={setLevelFilter}
                                suffixIcon={<FilterOutlined />}
                                size="large"
                            >
                                <Option value="all">All Levels</Option>
                                <Option value="Professional">
                                    Professional
                                </Option>
                                <Option value="Amateur">Amateur</Option>
                                <Option value="Elite">Elite</Option>
                                <Option value="Olympic">Olympic</Option>
                                <Option value="Recreational">
                                    Recreational
                                </Option>
                            </Select>

                            <Tooltip title="Refresh Data">
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={handleRefresh}
                                    loading={isFetching}
                                    size="large"
                                >
                                    Refresh
                                </Button>
                            </Tooltip>

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setField("visible", true)}
                                size="large"
                                style={{
                                    background:
                                        "linear-gradient(45deg, #1890ff, #722ed1)",
                                    border: "none",
                                    borderRadius: 8,
                                }}
                            >
                                New Sport
                            </Button>
                        </Space>
                    }
                >
                    {/* Filter Summary */}
                    {(search ||
                        statusFilter !== "all" ||
                        categoryFilter !== "all" ||
                        levelFilter !== "all") && (
                        <div
                            style={{
                                marginBottom: 24,
                                padding: "16px",
                                background:
                                    "linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%)",
                                borderRadius: 12,
                                border: "1px solid #bae7ff",
                            }}
                        >
                            <Space wrap>
                                <Text strong style={{ color: "#1890ff" }}>
                                    Active Filters:
                                </Text>
                                {search && (
                                    <Tag
                                        closable
                                        onClose={handleClearSearch}
                                        color="blue"
                                    >
                                        Search: "{search}"
                                    </Tag>
                                )}
                                {statusFilter !== "all" && (
                                    <Tag
                                        closable
                                        onClose={() => setStatusFilter("all")}
                                        color={getStatusColor(statusFilter)}
                                    >
                                        Status: {statusFilter}
                                    </Tag>
                                )}
                                {categoryFilter !== "all" && (
                                    <Tag
                                        closable
                                        onClose={() => setCategoryFilter("all")}
                                        color={getCategoryColor(categoryFilter)}
                                    >
                                        Category: {categoryFilter}
                                    </Tag>
                                )}
                                {levelFilter !== "all" && (
                                    <Tag
                                        closable
                                        onClose={() => setLevelFilter("all")}
                                        color={getLevelColor(levelFilter)}
                                    >
                                        Level: {levelFilter}
                                    </Tag>
                                )}
                                <Text strong style={{ color: "#52c41a" }}>
                                    {totalCount} sports found
                                </Text>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("all");
                                        setCategoryFilter("all");
                                        setLevelFilter("all");
                                    }}
                                    style={{
                                        color: "#ff4d4f",
                                        fontWeight: 600,
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            </Space>
                        </div>
                    )}

                    {viewMode === "card" ? (
                        // Enhanced Card View with Banner Only
                        <Row gutter={[24, 24]}>
                            {filteredData.map((sport) => (
                                <Col
                                    key={sport.key}
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}
                                >
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            boxShadow:
                                                "0 4px 20px rgba(0, 0, 0, 0.08)",
                                            border: "1px solid #f0f0f0",
                                            height: "100%",
                                            transition: "all 0.3s ease",
                                        }}
                                        bodyStyle={{ padding: 0 }}
                                        onClick={() => handleViewDetails(sport)}
                                    >
                                        {/* Sport Banner */}
                                        <div
                                            style={{
                                                height: 140,
                                                backgroundImage: `url(${sport.banner})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                position: "relative",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    background:
                                                        "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7))",
                                                }}
                                            />

                                            {/* Status Badge */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 12,
                                                    right: 12,
                                                }}
                                            >
                                                <Tag
                                                    color={getStatusColor(
                                                        sport.status
                                                    )}
                                                    style={{
                                                        fontWeight: "bold",
                                                        border: "none",
                                                        borderRadius: 12,
                                                    }}
                                                >
                                                    {sport.status.toUpperCase()}
                                                </Tag>
                                            </div>

                                            {/* Sport Info Overlay */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: 12,
                                                    left: 12,
                                                    right: 12,
                                                    color: "white",
                                                }}
                                            >
                                                <Title
                                                    level={4}
                                                    style={{
                                                        color: "white",
                                                        margin: 0,
                                                        fontSize: 18,
                                                    }}
                                                >
                                                    {sport.name}
                                                </Title>
                                                <Space
                                                    size={[4, 4]}
                                                    wrap
                                                    style={{ marginTop: 4 }}
                                                >
                                                    <Tag
                                                        color={getLevelColor(
                                                            sport.level
                                                        )}
                                                        style={{
                                                            border: "none",
                                                            fontSize: 10,
                                                            padding: "2px 8px",
                                                        }}
                                                    >
                                                        {sport.level}
                                                    </Tag>
                                                    <Tag
                                                        color={getCategoryColor(
                                                            sport.category
                                                        )}
                                                        style={{
                                                            border: "none",
                                                            fontSize: 10,
                                                            padding: "2px 8px",
                                                        }}
                                                    >
                                                        {sport.category}
                                                    </Tag>
                                                </Space>
                                            </div>
                                        </div>

                                        {/* Sport Content */}
                                        <div style={{ padding: "16px" }}>
                                            {/* Rating */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: 12,
                                                }}
                                            >
                                                <Rate
                                                    disabled
                                                    defaultValue={
                                                        sport.stats.rating
                                                    }
                                                    style={{ fontSize: 14 }}
                                                    character={<StarFilled />}
                                                />
                                                <Text
                                                    strong
                                                    style={{
                                                        color: "#faad14",
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {sport.stats.rating}
                                                </Text>
                                            </div>

                                            {/* Statistics */}
                                            <Row
                                                gutter={[8, 8]}
                                                style={{ marginBottom: 16 }}
                                            >
                                                <Col span={8}>
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Text
                                                            strong
                                                            style={{
                                                                display:
                                                                    "block",
                                                                fontSize: 18,
                                                                color: "#1890ff",
                                                            }}
                                                        >
                                                            {
                                                                sport.stats
                                                                    .players
                                                            }
                                                        </Text>
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            <TeamOutlined />{" "}
                                                            Players
                                                        </Text>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Text
                                                            strong
                                                            style={{
                                                                display:
                                                                    "block",
                                                                fontSize: 18,
                                                                color: "#52c41a",
                                                            }}
                                                        >
                                                            {
                                                                sport.stats
                                                                    .coaches
                                                            }
                                                        </Text>
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            Coaches
                                                        </Text>
                                                    </div>
                                                </Col>
                                                <Col span={8}>
                                                    <div
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        <Text
                                                            strong
                                                            style={{
                                                                display:
                                                                    "block",
                                                                fontSize: 18,
                                                                color: "#faad14",
                                                            }}
                                                        >
                                                            {
                                                                sport.stats
                                                                    .tournaments
                                                            }
                                                        </Text>
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize: 11,
                                                            }}
                                                        >
                                                            <TrophyOutlined />{" "}
                                                            Events
                                                        </Text>
                                                    </div>
                                                </Col>
                                            </Row>

                                            {/* Popularity Bar */}
                                            <div style={{ marginBottom: 16 }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-between",
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 11 }}
                                                    >
                                                        Popularity
                                                    </Text>
                                                    <Text
                                                        strong
                                                        style={{ fontSize: 11 }}
                                                    >
                                                        {sport.stats.popularity}
                                                        %
                                                    </Text>
                                                </div>
                                                <Progress
                                                    percent={
                                                        sport.stats.popularity
                                                    }
                                                    size="small"
                                                    showInfo={false}
                                                    strokeColor={{
                                                        from: "#108ee9",
                                                        to: "#87d068",
                                                    }}
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <Space
                                                size="small"
                                                style={{
                                                    width: "100%",
                                                    justifyContent:
                                                        "space-between",
                                                }}
                                            >
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetails(
                                                            sport
                                                        );
                                                    }}
                                                    style={{
                                                        padding: 0,
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    <EyeOutlined /> View Details
                                                </Button>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setField(
                                                            "visible",
                                                            true
                                                        );
                                                        setField(
                                                            "editData",
                                                            sport
                                                        );
                                                    }}
                                                    style={{ fontSize: 12 }}
                                                />
                                            </Space>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        // Table View (Enhanced)
                        <div className="table-responsive">
                            <Table
                                loading={isLoading}
                                columns={[
                                    {
                                        title: "Sport",
                                        dataIndex: "name",
                                        key: "name",
                                        render: (name, record) => (
                                            <Space>
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        backgroundImage: `url(${record.banner})`,
                                                        backgroundSize: "cover",
                                                        backgroundPosition:
                                                            "center",
                                                        borderRadius: 6,
                                                    }}
                                                />
                                                <div>
                                                    <Text strong>{name}</Text>
                                                    <br />
                                                    <Text
                                                        type="secondary"
                                                        style={{ fontSize: 12 }}
                                                    >
                                                        {record.category} •{" "}
                                                        {record.level}
                                                    </Text>
                                                </div>
                                            </Space>
                                        ),
                                    },
                                    {
                                        title: "Level",
                                        dataIndex: "level",
                                        key: "level",
                                        render: (level) => (
                                            <Tag color={getLevelColor(level)}>
                                                {level}
                                            </Tag>
                                        ),
                                    },
                                    {
                                        title: "Category",
                                        dataIndex: "category",
                                        key: "category",
                                        render: (category) => (
                                            <Tag
                                                color={getCategoryColor(
                                                    category
                                                )}
                                            >
                                                {category}
                                            </Tag>
                                        ),
                                    },
                                    {
                                        title: "Players",
                                        dataIndex: "stats",
                                        key: "players",
                                        render: (stats) => (
                                            <Statistic
                                                value={stats.players}
                                                prefix={<TeamOutlined />}
                                                valueStyle={{ fontSize: 14 }}
                                            />
                                        ),
                                    },
                                    {
                                        title: "Rating",
                                        dataIndex: "stats",
                                        key: "rating",
                                        render: (stats) => (
                                            <Space>
                                                <Rate
                                                    disabled
                                                    defaultValue={stats.rating}
                                                    style={{ fontSize: 14 }}
                                                />
                                                <Text strong>
                                                    {stats.rating}
                                                </Text>
                                            </Space>
                                        ),
                                    },
                                    {
                                        title: "Status",
                                        dataIndex: "status",
                                        key: "status",
                                        render: (status) => (
                                            <Tag color={getStatusColor(status)}>
                                                {status.toUpperCase()}
                                            </Tag>
                                        ),
                                    },
                                    {
                                        title: "Actions",
                                        key: "action",
                                        width: 120,
                                        render: (record) => (
                                            <Space>
                                                <Tooltip title="View Details">
                                                    <Button
                                                        type="link"
                                                        icon={<EyeOutlined />}
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                record
                                                            )
                                                        }
                                                        size="small"
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Edit Sport">
                                                    <Button
                                                        type="primary"
                                                        icon={<EditOutlined />}
                                                        onClick={() => {
                                                            setField(
                                                                "visible",
                                                                true
                                                            );
                                                            setField(
                                                                "editData",
                                                                record
                                                            );
                                                        }}
                                                        size="small"
                                                    />
                                                </Tooltip>
                                            </Space>
                                        ),
                                    },
                                ]}
                                dataSource={filteredData}
                                pagination={{
                                    pageSize: 12,
                                    total: totalCount,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} sports`,
                                    pageSizeOptions: ["12", "24", "48", "96"],
                                }}
                                onRow={(record) => ({
                                    onClick: () => handleViewDetails(record),
                                    style: { cursor: "pointer" },
                                })}
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredData.length === 0 && (
                        <Card
                            style={{
                                textAlign: "center",
                                padding: 80,
                                borderRadius: 16,
                                background:
                                    "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
                                border: "2px dashed #d9d9d9",
                            }}
                        >
                            <TrophyOutlined
                                style={{
                                    fontSize: 64,
                                    color: "#bfbfbf",
                                    marginBottom: 24,
                                }}
                            />
                            <Title
                                level={3}
                                type="secondary"
                                style={{ marginBottom: 8 }}
                            >
                                No Sports Found
                            </Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                {search ||
                                statusFilter !== "all" ||
                                categoryFilter !== "all" ||
                                levelFilter !== "all"
                                    ? "Try adjusting your filters or search terms"
                                    : "No sports available in the system"}
                            </Text>
                            <br />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setField("visible", true)}
                                style={{ marginTop: 24 }}
                            >
                                Add First Sport
                            </Button>
                        </Card>
                    )}
                </Card>

                {/* Sport Details Modal */}
                <SportDetailsModal
                    sport={selectedSport}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />

                <FormSports
                    onSubmit={(params) => {
                        mutation.mutate(params);
                    }}
                />
            </div>
        </Layout>
    );
};

export default React.memo(SportsPage);
