import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Typography,
    Space,
    Divider,
    Progress,
    Alert,
    Statistic,
    Tag,
    Result,
    Pagination,
    Tooltip,
    Image,
    Radio,
} from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SmileOutlined,
    ExclamationCircleOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    PictureOutlined,
    EyeOutlined,
    StarOutlined,
} from "@ant-design/icons";
import "./ImageQuizPage.css";

const { Title, Text } = Typography;

const ImageQuizPage = () => {
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(1);

    // Image-based Personality Test Data
    const mockQuiz = {
        id: 2,
        title: "Visual Personality & Preference Assessment",
        description: "Discover your personality traits through image selection and visual preferences",
        questions: [
            {
                id: 1,
                type: "image-choice",
                question: "Which environment makes you feel most at peace?",
                description: "Select the scene that resonates with your ideal peaceful setting",
                required: true,
                category: "Environment Preference",
                options: [
                    {
                        id: "1a",
                        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
                        label: "Mountain Lake",
                        value: "nature_calm",
                        interpretation: "You value tranquility and natural beauty. You're likely introspective and find peace in solitude."
                    },
                    {
                        id: "1b",
                        image: "https://images.unsplash.com/photo-1510798831971-661eb04f3739?w=300&h=200&fit=crop",
                        label: "Urban Cafe",
                        value: "urban_social",
                        interpretation: "You thrive in social settings and enjoy human connections. You're likely energetic and people-oriented."
                    },
                    {
                        id: "1c",
                        image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=300&h=200&fit=crop",
                        label: "Ocean Sunset",
                        value: "ocean_reflective",
                        interpretation: "You're reflective and drawn to vast, open spaces. You likely have a philosophical nature."
                    },
                    {
                        id: "1d",
                        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
                        label: "Cozy Library",
                        value: "intellectual_comfort",
                        interpretation: "You value knowledge and comfort. You're likely analytical and enjoy learning."
                    }
                ]
            },
            {
                id: 2,
                type: "image-choice",
                question: "Which abstract pattern appeals to you most?",
                description: "Choose the pattern that visually resonates with your personality",
                required: true,
                category: "Abstract Thinking",
                options: [
                    {
                        id: "2a",
                        image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=200&fit=crop",
                        label: "Geometric Order",
                        value: "structured_organized",
                        interpretation: "You prefer order and clarity. You're likely methodical and detail-oriented."
                    },
                    {
                        id: "2b",
                        image: "https://images.unsplash.com/photo-1543857778-c4a1a569e45e?w=300&h=200&fit=crop",
                        label: "Fluid Organic",
                        value: "creative_adaptive",
                        interpretation: "You're creative and adaptable. You likely embrace change and think outside the box."
                    },
                    {
                        id: "2c",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
                        label: "Bold Contrast",
                        value: "decisive_strong",
                        interpretation: "You're decisive and confident. You likely have strong opinions and clear boundaries."
                    },
                    {
                        id: "2d",
                        image: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=300&h=200&fit=crop",
                        label: "Soft Gradient",
                        value: "harmonious_balanced",
                        interpretation: "You value harmony and balance. You're likely diplomatic and avoid extremes."
                    }
                ]
            },
            {
                id: 3,
                type: "image-choice",
                question: "Which animal represents your inner spirit?",
                description: "Select the animal that best reflects your personality traits",
                required: true,
                category: "Spirit Animal",
                options: [
                    {
                        id: "3a",
                        image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=200&fit=crop",
                        label: "Majestic Eagle",
                        value: "leader_visionary",
                        interpretation: "You're a natural leader with clear vision. You value freedom and perspective."
                    },
                    {
                        id: "3b",
                        image: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=300&h=200&fit=crop",
                        label: "Wise Elephant",
                        value: "wise_grounded",
                        interpretation: "You're wise, patient, and deeply connected to community and tradition."
                    },
                    {
                        id: "3c",
                        image: "https://images.unsplash.com/photo-1519066629447-267fffa62d4b?w=300&h=200&fit=crop",
                        label: "Curious Fox",
                        value: "clever_adaptive",
                        interpretation: "You're intelligent, adaptable, and resourceful in challenging situations."
                    },
                    {
                        id: "3d",
                        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop",
                        label: "Loyal Dog",
                        value: "loyal_compassionate",
                        interpretation: "You're loyal, compassionate, and value deep connections with others."
                    }
                ]
            },
            {
                id: 4,
                type: "image-choice",
                question: "Which color palette energizes you?",
                description: "Choose the color combination that makes you feel most alive",
                required: false,
                category: "Color Psychology",
                options: [
                    {
                        id: "4a",
                        image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=300&h=200&fit=crop",
                        label: "Warm Sunset",
                        value: "passionate_emotional",
                        interpretation: "You're passionate and emotionally expressive. You likely have strong creative energies."
                    },
                    {
                        id: "4b",
                        image: "https://images.unsplash.com/photo-1565884280295-98eb83a53c4d?w=300&h=200&fit=crop",
                        label: "Cool Ocean",
                        value: "calm_analytical",
                        interpretation: "You're calm, analytical, and maintain composure under pressure."
                    },
                    {
                        id: "4c",
                        image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=200&fit=crop",
                        label: "Earth Tones",
                        value: "grounded_practical",
                        interpretation: "You're practical, reliable, and value authenticity in all aspects of life."
                    },
                    {
                        id: "4d",
                        image: "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=300&h=200&fit=crop",
                        label: "Vibrant Rainbow",
                        value: "energetic_optimistic",
                        interpretation: "You're energetic, optimistic, and bring joy to those around you."
                    }
                ]
            },
            {
                id: 5,
                type: "image-choice",
                question: "Which architectural style feels like home?",
                description: "Select the building that represents your ideal living space",
                required: true,
                category: "Space Preference",
                options: [
                    {
                        id: "5a",
                        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=300&h=200&fit=crop",
                        label: "Modern Minimalist",
                        value: "minimalist_efficient",
                        interpretation: "You value simplicity, efficiency, and clean design. You're likely organized and forward-thinking."
                    },
                    {
                        id: "5b",
                        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop",
                        label: "Classic Traditional",
                        value: "traditional_nostalgic",
                        interpretation: "You appreciate tradition, history, and timeless beauty. You're likely sentimental and value heritage."
                    },
                    {
                        id: "5c",
                        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop",
                        label: "Cozy Cottage",
                        value: "comfort_warmth",
                        interpretation: "You value comfort, warmth, and intimate spaces. You're likely nurturing and family-oriented."
                    },
                    {
                        id: "5d",
                        image: "https://images.unsplash.com/photo-1503174971373-b1f69850bced?w=300&h=200&fit=crop",
                        label: "Industrial Loft",
                        value: "creative_urban",
                        interpretation: "You're creative, urban, and appreciate raw authenticity. You likely embrace uniqueness."
                    }
                ]
            }
        ],
        createdAt: "2024-01-20",
        estimatedTime: 10,
        category: "Visual Personality Assessment",
    };

    useEffect(() => {
        setCurrentQuiz(mockQuiz);
        const timer = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Pagination logic
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = currentQuiz?.questions.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
    );
    const totalPages = Math.ceil(
        currentQuiz?.questions.length / questionsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleImageSelect = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsQuizCompleted(true);
            setIsSubmitting(false);
        }, 2000);
    };

    const getProgress = () => {
        if (!currentQuiz) return 0;
        const answered = Object.keys(answers).length;
        return Math.floor((answered / currentQuiz.questions.length) * 100);
    };

    const getCompletionStatus = () => {
        if (!currentQuiz) return { answered: 0, total: 0 };
        const requiredQuestions = currentQuiz.questions.filter((q) => q.required);
        const answeredRequired = requiredQuestions.filter(
            (q) => answers[q.id] !== undefined
        ).length;
        return {
            answered: Object.keys(answers).length,
            total: currentQuiz.questions.length,
            requiredAnswered: answeredRequired,
            requiredTotal: requiredQuestions.length,
        };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const allRequiredAnswered = () => {
        if (!currentQuiz) return false;
        const requiredQuestions = currentQuiz.questions.filter((q) => q.required);
        return requiredQuestions.every((q) => answers[q.id] !== undefined);
    };

    const getPersonalityTraits = () => {
        const selectedOptions = Object.values(answers).map(answerId => {
            for (let question of currentQuiz.questions) {
                const option = question.options.find(opt => opt.id === answerId);
                if (option) return option;
            }
            return null;
        }).filter(opt => opt !== null);

        // Simple analysis based on selected options
        const traits = {
            adventurous: selectedOptions.filter(opt => 
                opt.value.includes('nature') || opt.value.includes('ocean') || opt.value.includes('eagle')
            ).length,
            social: selectedOptions.filter(opt => 
                opt.value.includes('urban') || opt.value.includes('social') || opt.value.includes('dog')
            ).length,
            creative: selectedOptions.filter(opt => 
                opt.value.includes('creative') || opt.value.includes('fluid') || opt.value.includes('vibrant')
            ).length,
            analytical: selectedOptions.filter(opt => 
                opt.value.includes('structured') || opt.value.includes('minimalist') || opt.value.includes('intellectual')
            ).length
        };

        const maxTrait = Object.keys(traits).reduce((a, b) => traits[a] > traits[b] ? a : b);
        
        const traitInfo = {
            adventurous: { level: "Explorer", color: "#52c41a", description: "You're naturally curious and love exploring new possibilities" },
            social: { level: "Connector", color: "#1890ff", description: "You thrive on relationships and community interactions" },
            creative: { level: "Innovator", color: "#722ed1", description: "You're imaginative and bring unique perspectives" },
            analytical: { level: "Thinker", color: "#fa8c16", description: "You're logical and enjoy solving complex problems" }
        };

        return traitInfo[maxTrait] || traitInfo.analytical;
    };

    if (!currentQuiz) {
        return (
            <div style={{ padding: "50px", textAlign: "center" }}>
                <Result
                    status="404"
                    title="Assessment Not Found"
                    subTitle="Sorry, the visual assessment you are looking for does not exist."
                />
            </div>
        );
    }

    if (isQuizCompleted) {
        const completionStatus = getCompletionStatus();
        const personality = getPersonalityTraits();

        return (
            <div className="image-quiz-page completion-view">
                <div className="completion-container">
                    <Card className="completion-card">
                        <Result
                            icon={<SmileOutlined style={{ color: personality.color }} />}
                            status="success"
                            title="Visual Assessment Complete!"
                            subTitle={
                                <Space direction="vertical">
                                    <Text>Your personality profile has been analyzed through your visual preferences.</Text>
                                    <Tag color={personality.color} icon={<StarOutlined />}>
                                        {personality.level} Personality
                                    </Tag>
                                </Space>
                            }
                            extra={[
                                <Button key="another" onClick={() => window.location.reload()}>
                                    Retake Assessment
                                </Button>,
                                <Button key="home" type="primary">
                                    View Detailed Analysis
                                </Button>,
                            ]}
                        >
                            <div className="completion-stats">
                                <Row gutter={32}>
                                    <Col xs={24} sm={8}>
                                        <Card size="small" style={{ textAlign: "center" }}>
                                            <Statistic
                                                title="Personality Type"
                                                value={personality.level}
                                                valueStyle={{
                                                    color: personality.color,
                                                    fontSize: "24px",
                                                }}
                                                prefix={<EyeOutlined />}
                                            />
                                            <Text type="secondary">{personality.description}</Text>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Card size="small" style={{ textAlign: "center" }}>
                                            <Statistic
                                                title="Completion Rate"
                                                value={((completionStatus.answered / completionStatus.total) * 100).toFixed(0)}
                                                suffix="%"
                                                valueStyle={{
                                                    color: "#1890ff",
                                                    fontSize: "24px",
                                                }}
                                                prefix={<CheckCircleOutlined />}
                                            />
                                            <Text type="secondary">
                                                {completionStatus.answered} of {completionStatus.total} questions
                                            </Text>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Card size="small" style={{ textAlign: "center" }}>
                                            <Statistic
                                                title="Time Spent"
                                                value={formatTime(timeSpent)}
                                                valueStyle={{
                                                    color: "#fa8c16",
                                                    fontSize: "24px",
                                                }}
                                                prefix={<ClockCircleOutlined />}
                                            />
                                            <Text type="secondary">
                                                Estimated: {currentQuiz.estimatedTime} min
                                            </Text>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <div className="answers-summary">
                                <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
                                    🎨 Your Visual Preferences Analysis
                                </Title>
                                <Row gutter={[16, 16]}>
                                    {currentQuiz.questions.map((question, index) => {
                                        const selectedOption = question.options.find(
                                            opt => opt.id === answers[question.id]
                                        );
                                        return (
                                            <Col xs={24} lg={12} key={question.id}>
                                                <Card
                                                    size="small"
                                                    style={{
                                                        borderLeft: `4px solid ${personality.color}`,
                                                        height: "100%",
                                                    }}
                                                >
                                                    <Space direction="vertical" style={{ width: "100%" }}>
                                                        <div className="question-header" style={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "flex-start",
                                                        }}>
                                                            <Text strong style={{ flex: 1 }}>
                                                                Q{index + 1}: {question.question}
                                                            </Text>
                                                            <Space>
                                                                {question.required && (
                                                                    <Tag color="red" size="small">Required</Tag>
                                                                )}
                                                                <Tag color="blue" size="small">{question.category}</Tag>
                                                            </Space>
                                                        </div>
                                                        
                                                        {selectedOption && (
                                                            <div className="selected-answer">
                                                                <Row gutter={16} align="middle">
                                                                    <Col xs={24} sm={8}>
                                                                        <Image
                                                                            src={selectedOption.image}
                                                                            alt={selectedOption.label}
                                                                            width="100%"
                                                                            style={{ borderRadius: 8 }}
                                                                            preview={{
                                                                                mask: <EyeOutlined />,
                                                                            }}
                                                                        />
                                                                    </Col>
                                                                    <Col xs={24} sm={16}>
                                                                        <Text strong>{selectedOption.label}</Text>
                                                                        <br />
                                                                        <Text type="secondary" style={{ fontSize: "13px" }}>
                                                                            {selectedOption.interpretation}
                                                                        </Text>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )}
                                                        
                                                        {!selectedOption && (
                                                            <Text type="secondary" italic>
                                                                Not answered
                                                            </Text>
                                                        )}
                                                    </Space>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </div>
                        </Result>
                    </Card>
                </div>
            </div>
        );
    }

    const completionStatus = getCompletionStatus();

    return (
        <div className="image-quiz-page visual-assessment">
            {/* Header Banner */}
            <div className="quiz-header-banner visual-banner">
                <div className="header-content">
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        <div className="logo-section">
                            <PictureOutlined style={{ fontSize: "32px", color: "#722ed1", marginRight: 12 }} />
                            <Title level={2} style={{ color: "white", margin: 0 }}>
                                Visual Personality Test
                            </Title>
                        </div>
                        <Title level={1} style={{ color: "white", margin: 0, textAlign: "center" }}>
                            {currentQuiz.title}
                        </Title>
                        <Text style={{ color: "rgba(255,255,255,0.9)", textAlign: "center", display: "block" }}>
                            {currentQuiz.description}
                        </Text>
                        <div className="assessment-info">
                            <Tag color="purple" icon={<PictureOutlined />} style={{
                                background: "rgba(255,255,255,0.2)",
                                color: "white",
                                border: "none",
                            }}>
                                Visual Assessment
                            </Tag>
                            <Tag color="blue" style={{
                                background: "rgba(255,255,255,0.2)",
                                color: "white",
                                border: "none",
                            }}>
                                {currentQuiz.questions.length} Visual Questions
                            </Tag>
                            <Tag color="green" style={{
                                background: "rgba(255,255,255,0.2)",
                                color: "white",
                                border: "none",
                            }}>
                                Personality Insights
                            </Tag>
                        </div>
                    </Space>
                </div>
            </div>

            {/* Progress Stats */}
            <div className="progress-stats-bar">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={6}>
                        <Space>
                            <Progress
                                type="circle"
                                percent={getProgress()}
                                size={60}
                                strokeColor={{
                                    "0%": "#722ed1",
                                    "100%": "#52c41a",
                                }}
                            />
                            <div>
                                <Text strong>Assessment Progress</Text>
                                <br />
                                <Text type="secondary">
                                    {completionStatus.answered}/{completionStatus.total} questions
                                </Text>
                            </div>
                        </Space>
                    </Col>
                    <Col xs={24} md={6}>
                        <Statistic
                            title="Required Questions"
                            value={completionStatus.requiredAnswered}
                            suffix={`/ ${completionStatus.requiredTotal}`}
                            valueStyle={{
                                color: completionStatus.requiredAnswered === completionStatus.requiredTotal ? "#52c41a" : "#fa8c16",
                                fontSize: "24px",
                            }}
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Statistic
                            title="Time Spent"
                            value={formatTime(timeSpent)}
                            valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Col>
                    <Col xs={24} md={6}>
                        <Statistic
                            title="Current Page"
                            value={currentPage}
                            suffix={`/ ${totalPages}`}
                            valueStyle={{ color: "#722ed1", fontSize: "24px" }}
                            prefix={<BulbOutlined />}
                        />
                    </Col>
                </Row>
            </div>

            {/* Questions with Pagination */}
            <div className="questions-visual-container">
                <Card className="questions-visual">
                    <div className="visual-content">
                        <Title level={2} style={{ textAlign: "center", marginBottom: 32, color: "#722ed1" }}>
                            🎨 Visual Preference Assessment
                        </Title>

                        {/* Current Page Questions */}
                        <div className="questions-grid">
                            {currentQuestions.map((question, index) => {
                                const globalIndex = (currentPage - 1) * questionsPerPage + index;
                                return (
                                    <Card
                                        key={question.id}
                                        className={`question-card ${answers[question.id] ? "answered" : ""}`}
                                        style={{
                                            borderLeft: `6px solid #722ed1`,
                                            marginBottom: 24,
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        <div className="question-header">
                                            <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                                                <Space>
                                                    <div className="question-number">
                                                        <Text strong style={{ fontSize: "18px", color: "#722ed1" }}>
                                                            Q{globalIndex + 1}
                                                        </Text>
                                                    </div>
                                                    <Tag color="purple" icon={<PictureOutlined />}>
                                                        {question.category}
                                                    </Tag>
                                                    {question.required ? (
                                                        <Tag color="red">Required</Tag>
                                                    ) : (
                                                        <Tag color="orange">Optional</Tag>
                                                    )}
                                                </Space>
                                                {answers[question.id] && (
                                                    <Tag color="green" icon={<CheckCircleOutlined />}>
                                                        Answered
                                                    </Tag>
                                                )}
                                            </Space>
                                        </div>

                                        <div className="question-content">
                                            <Title level={4} style={{ marginBottom: 16, color: "#262626" }}>
                                                {question.question}
                                            </Title>

                                            {question.description && (
                                                <Alert
                                                    message="Visual Context"
                                                    description={question.description}
                                                    type="info"
                                                    showIcon
                                                    style={{
                                                        marginBottom: 20,
                                                        background: "#f9f0ff",
                                                        border: "1px solid #d3adf7",
                                                    }}
                                                />
                                            )}

                                            <div className="image-options-section">
                                                <Text strong style={{ display: "block", marginBottom: 20, fontSize: "16px" }}>
                                                    Select the image that best represents your preference:
                                                </Text>

                                                <Row gutter={[16, 16]} justify="center">
                                                    {question.options.map((option) => (
                                                        <Col xs={24} sm={12} md={6} key={option.id}>
                                                            <Tooltip title={option.interpretation}>
                                                                <div
                                                                    className={`image-option ${answers[question.id] === option.id ? "selected" : ""}`}
                                                                    onClick={() => handleImageSelect(question.id, option.id)}
                                                                >
                                                                    <div className="image-container">
                                                                        <Image
                                                                            src={option.image}
                                                                            alt={option.label}
                                                                            width="100%"
                                                                            height={150}
                                                                            style={{
                                                                                objectFit: "cover",
                                                                                borderRadius: "8px 8px 0 0",
                                                                            }}
                                                                            preview={{
                                                                                mask: <EyeOutlined />,
                                                                            }}
                                                                        />
                                                                        <div className="option-label">
                                                                            <Text strong>{option.label}</Text>
                                                                        </div>
                                                                    </div>
                                                                    <div className="selection-indicator">
                                                                        {answers[question.id] === option.id ? (
                                                                            <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
                                                                        ) : (
                                                                            <div className="radio-placeholder" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Tooltip>
                                                        </Col>
                                                    ))}
                                                </Row>

                                                {answers[question.id] && (
                                                    <Alert
                                                        message={
                                                            question.options.find(opt => opt.id === answers[question.id])?.interpretation
                                                        }
                                                        type="info"
                                                        showIcon
                                                        style={{
                                                            marginTop: 20,
                                                            background: "#f6ffed",
                                                            border: "1px solid #b7eb8f",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="pagination-section" style={{ textAlign: "center", margin: "32px 0" }}>
                            <Pagination
                                current={currentPage}
                                total={currentQuiz.questions.length}
                                pageSize={questionsPerPage}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showQuickJumper
                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} visual questions`}
                            />
                        </div>

                        {/* Submit Section */}
                        <div className="submit-section">
                            <Card
                                style={{
                                    background: allRequiredAnswered() ? "#f6ffed" : "#fff2e8",
                                    border: `2px solid ${allRequiredAnswered() ? "#b7eb8f" : "#ffd591"}`,
                                    textAlign: "center",
                                }}
                            >
                                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                                    <div>
                                        <Title level={3} style={{
                                            color: allRequiredAnswered() ? "#52c41a" : "#fa8c16",
                                        }}>
                                            {allRequiredAnswered() ? "🎉 Ready to Discover!" : "📋 Complete Required Selections"}
                                        </Title>
                                        <Text>
                                            {allRequiredAnswered()
                                                ? "All required visual selections have been made. Submit to discover your personality profile."
                                                : `${completionStatus.requiredTotal - completionStatus.requiredAnswered} required selection(s) remaining.`}
                                        </Text>
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ThunderboltOutlined />}
                                        onClick={handleSubmit}
                                        disabled={!allRequiredAnswered()}
                                        loading={isSubmitting}
                                        style={{
                                            minWidth: 200,
                                            height: 50,
                                            fontSize: "16px",
                                            background: allRequiredAnswered() ? "#722ed1" : undefined,
                                        }}
                                    >
                                        {isSubmitting ? "Analyzing..." : "Discover My Personality"}
                                    </Button>

                                    <div className="completion-info">
                                        <Space wrap>
                                            <CheckCircleOutlined style={{
                                                color: completionStatus.requiredAnswered === completionStatus.requiredTotal ? "#52c41a" : "#d9d9d9",
                                            }} />
                                            <Text>Required: {completionStatus.requiredAnswered}/{completionStatus.requiredTotal}</Text>
                                            <CheckCircleOutlined style={{
                                                color: completionStatus.answered === completionStatus.total ? "#52c41a" : "#d9d9d9",
                                            }} />
                                            <Text>Total: {completionStatus.answered}/{completionStatus.total}</Text>
                                            <BulbOutlined style={{ color: "#722ed1" }} />
                                            <Text>Page: {currentPage}/{totalPages}</Text>
                                        </Space>
                                    </div>
                                </Space>
                            </Card>
                        </div>

                        {/* Help Card */}
                        <Alert
                            message="💡 Visual Assessment Guidance"
                            description="This personality assessment uses visual preferences to understand your traits. Select the images that genuinely resonate with you - there are no right or wrong answers. Your choices reveal your natural inclinations and personality characteristics."
                            type="info"
                            showIcon
                            style={{ marginTop: 24, background: "#f9f0ff", border: "1px solid #d3adf7" }}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ImageQuizPage;