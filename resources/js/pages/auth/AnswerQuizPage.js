import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Typography,
    Space,
    Divider,
    Rate,
    Progress,
    Alert,
    Statistic,
    Tag,
    Result,
    Pagination,
    Tooltip,
    Modal,
    Steps,
    Badge,
    Avatar,
} from "antd";
import {
    StarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    SmileOutlined,
    ExclamationCircleOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    UserOutlined,
    QuestionCircleOutlined,
    RocketOutlined,
    TrophyOutlined,
    FireOutlined,
    CalendarOutlined,
    TeamOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    EllipsisOutlined ,
} from "@ant-design/icons";
import "./AnswerQuizPage.css";
import useTakeQuiz from "~/hooks/useTakeQuiz";
import axiosConfig from "~/utils/axiosConfig";

const companyInfo = {
    name: "Opol Community College Alumni Association",
    logo: "https://www.sis.occph.com/build/assets/OCC_LOGO-BWCM4zrL.png",
    slogan: "Building tomorrow's leaders, one student at a time.",
    website: "occph.com",
    address: "C. Salva St, Opol, 9016 Misamis Oriental",
};

const { Title, Text } = Typography;
const { Step } = Steps;

const AnswerQuizPage = () => {
    const {
        isLoading: isLoadingQuizzes,
        data: questions = [],
        isFetching: isFetchingQuizzes,
        refetch: refetchQuizzes,
    } = useTakeQuiz("rating");

    const [currentQuiz, setCurrentQuiz] = useState({
        title: "Behavioral Stress Test",
        description: "Please rate your experiences",
        questions: questions,
        estimatedTime: 5,
        category: "Workplace Wellness",
        difficulty: "Intermediate",
    });

    const [answers, setAnswers] = useState({});
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [questionsPerPage] = useState(1);
    const [visitedQuestions, setVisitedQuestions] = useState(new Set([1]));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Add interpretation to each question dynamically
    const questionsWithInterpretation = questions.map((question, index) => ({
        ...question,
        interpretation: {
            1: "Very often / Very well",
            2: "Often / Well",
            3: "Sometimes / Moderately",
            4: "Rarely / Poorly",
            5: "Very rarely / Very poorly",
        },
        category: "Workplace Wellness",
        sequence: index + 1,
    }));

    // Pagination logic
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questionsWithInterpretation.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
    );

    const totalPages = Math.ceil(
        questionsWithInterpretation.length / questionsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setVisitedQuestions((prev) => new Set([...prev, page]));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleRateChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!allRequiredAnswered()) {
            Modal.warning({
                title: "Incomplete Assessment",
                content:
                    "Please answer all required questions before submitting.",
                icon: <ExclamationCircleOutlined />,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Append quiz metadata
            formData.append("type", "rating");
            formData.append("quizId", currentQuiz.id || "default-quiz-id");
            formData.append("timeSpent", timeSpent.toString());
            formData.append("completedAt", new Date().toISOString());
            formData.append(
                "totalQuestions",
                questionsWithInterpretation.length.toString()
            );
            formData.append(
                "answeredQuestions",
                Object.keys(answers).length.toString()
            );

            // Append user info if available
            const userInfo = localStorage.getItem("userInfo");
            if (userInfo) {
                formData.append("userInfo", userInfo);
            }

            // Append each answer
            Object.entries(answers).forEach(([questionId, rating], index) => {
                formData.append(`answers[${index}][questionId]`, questionId);
                formData.append(`answers[${index}][rating]`, rating.toString());
                formData.append(
                    `answers[${index}][answeredAt]`,
                    new Date().toISOString()
                );

                const additionalData = answers[questionId]?.additionalData;
                if (additionalData) {
                    if (additionalData.comment) {
                        formData.append(
                            `answers[${index}][comment]`,
                            additionalData.comment
                        );
                    }
                    if (additionalData.file) {
                        formData.append(
                            `answers[${index}][file]`,
                            additionalData.file
                        );
                    }
                }
            });

            const response = await axiosConfig.post(
                "/save-alumni-quiz",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                if (response.data.submissionId) {
                    localStorage.setItem(
                        "lastSubmissionId",
                        response.data.submissionId
                    );
                }

                Modal.success({
                    title: "Assessment Complete!",
                    content:
                        "Thank you for completing the assessment. Your responses have been recorded successfully.",
                    onOk: () => (window.location.href = "/"),
                });
            } else {
                throw new Error(response.data.message || "Submission failed");
            }
        } catch (error) {
            console.error("❌ Error submitting quiz:", error);

            let errorMessage = "Failed to submit quiz. Please try again.";

            if (error.code === "ECONNABORTED") {
                errorMessage =
                    "Request timeout. Please check your internet connection and try again.";
            } else if (error.response?.status === 413) {
                errorMessage =
                    "File too large. Please reduce file size and try again.";
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Modal.error({
                title: "Submission Error",
                content: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProgress = () => {
        const answered = Object.keys(answers).length;
        return Math.floor(
            (answered / questionsWithInterpretation.length) * 100
        );
    };

    const getCompletionStatus = () => {
        const requiredQuestions = questionsWithInterpretation.filter(
            (q) => q.required
        );
        const answeredRequired = requiredQuestions.filter(
            (q) => answers[q.id] !== undefined && answers[q.id] !== null
        ).length;

        return {
            answered: Object.keys(answers).length,
            total: questionsWithInterpretation.length,
            requiredAnswered: answeredRequired,
            requiredTotal: requiredQuestions.length,
        };
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const getAverageRating = () => {
        const ratings = Object.values(answers).filter(
            (val) => val !== null && val !== undefined
        );
        if (ratings.length === 0) return 0;
        return (
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        );
    };

    const getStressLevel = () => {
    const average = getAverageRating();

    if (average <= 2) {
        return {
            level: "Low",
            color: "#52c41a",
            description: "Positive experiences",
            icon: <SmileOutlined />,
            indicator: <Badge color="#52c41a" text="Low" /> // color indicator
        };
    } else if (average <= 3) {
        return {
            level: "Moderate",
            color: "#faad14",
            description: "Balanced experiences",
            icon: <UserOutlined />,
            indicator: <Badge color="#faad14" text="Moderate" />
        };
    } else if (average <= 4) {
        return {
            level: "High",
            color: "#fa8c16",
            description: "Challenging experiences",
            icon: <ExclamationCircleOutlined />,
            indicator: <Badge color="#fa8c16" text="High" />
        };
    } else {
        return {
            level: "Critical",
            color: "#f5222d",
            description: "Difficult experiences",
            icon: <FireOutlined />,
            indicator: <Badge color="#f5222d" text="Critical" />
        };
    }
};

    const allRequiredAnswered = () => {
        const requiredQuestions = questionsWithInterpretation.filter(
            (q) => q.required
        );
        return requiredQuestions.every(
            (q) => answers[q.id] !== undefined && answers[q.id] !== null
        );
    };

    const getStarColors = (value) => {
        const colors = {
            1: "#52c41a",
            2: "#73d13d",
            3: "#faad14",
            4: "#fa8c16",
            5: "#f5222d",
        };
        return colors[value] || "#f0f0f0";
    };

    const CustomRate = ({ value, onChange, questionId }) => {
        return (
            <div className="custom-rate">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Tooltip
                        key={star}
                        title={
                            questionsWithInterpretation.find(
                                (q) => q.id === questionId
                            )?.interpretation[star]
                        }
                    >
                        <button
                            type="button"
                            className={`rate-star ${
                                value >= star ? "active" : ""
                            }`}
                            onClick={() => onChange(questionId, star)}
                            style={{
                                color:
                                    value >= star
                                        ? getStarColors(star)
                                        : "#f0f0f0",
                                background:
                                    value >= star
                                        ? `${getStarColors(star)}15`
                                        : "transparent",
                                border: `2px solid ${
                                    value >= star
                                        ? getStarColors(star)
                                        : "#d9d9d9"
                                }`,
                            }}
                        >
                            <StarOutlined />
                            <span className="star-number">{star}</span>
                        </button>
                    </Tooltip>
                ))}
            </div>
        );
    };

    const getQuestionStatus = (questionId) => {
        return answers[questionId] ? "answered" : "unanswered";
    };

    const completionStatus = getCompletionStatus();
    const currentQuestion = currentQuestions[0];
    const questionNumber = (currentPage - 1) * questionsPerPage + 1;

    return (
        <div className="answer-quiz-container">
            <div className="content-data">
                {/* Header Section */}
                <Card>
                    <div className="company-header">
                        <div className="company-logo-section">
                            <Avatar
                                src={companyInfo.logo}
                                size={60}
                                shape="square"
                                className="company-logo"
                            />
                            <div className="company-info">
                                <Title level={2} className="company-name">
                                    {companyInfo.name}
                                </Title>
                                <Text className="company-slogan">
                                    {companyInfo.slogan}
                                </Text>
                                <div className="company-details">
                                    <Space>
                                        <GlobalOutlined />
                                        <Text type="secondary">
                                            {companyInfo.website}
                                        </Text>
                                        <EnvironmentOutlined />
                                        <Text type="secondary">
                                            {companyInfo.address}
                                        </Text>
                                    </Space>
                                </div>
                            </div>
                        </div>
                        <Divider />
                    </div>
                </Card>
                <br></br>
                <Card className="quiz-header-card">
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={12}>
                            <Space direction="vertical" size="small">
                                <div className="quiz-title-section">
                                    <Title level={2} className="quiz-title">
                                        <BulbOutlined /> {currentQuiz.title}
                                    </Title>
                                    <Text className="quiz-description">
                                        {currentQuiz.description}
                                    </Text>
                                </div>
                                <Space size="middle">
                                    {/* <Tag icon={<TeamOutlined />} color="blue">
                                    {currentQuiz.category}
                                </Tag>
                                <Tag icon={<ThunderboltOutlined />} color="orange">
                                    {currentQuiz.difficulty}
                                </Tag>
                                <Tag icon={<CalendarOutlined />} color="purple">
                                    {currentQuiz.estimatedTime} min
                                </Tag> */}
                                </Space>
                            </Space>
                        </Col>
                        <Col xs={24} md={12}>
                            <Row gutter={[16, 16]} justify="end">
                                <Col xs={12} sm={8}>
                                    <Card size="small" className="stats-card">
                                        <Statistic
                                            title="Progress"
                                            value={getProgress()}
                                            suffix="%"
                                            valueStyle={{ color: "#1890ff" }}
                                        />
                                        <Progress
                                            percent={getProgress()}
                                            size="small"
                                            showInfo={false}
                                            strokeColor="#1890ff"
                                        />
                                    </Card>
                                </Col>
                                <Col xs={12} sm={8}>
                                    <Card size="small" className="stats-card">
                                        <Statistic
                                            title="Time"
                                            value={formatTime(timeSpent)}
                                            prefix={<ClockCircleOutlined />}
                                            valueStyle={{ color: "#52c41a" }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={8}>
                                    <Card size="small" className="stats-card">
                                        <Statistic
                                            title="Answered"
                                            value={completionStatus.answered}
                                            suffix={`/ ${completionStatus.total}`}
                                            prefix={<CheckCircleOutlined />}
                                            valueStyle={{ color: "#fa8c16" }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
                <br></br>
                {/* Progress Steps */}
                <Card className="progress-steps-card">
                    <Steps
                        current={currentPage - 1}
                        percent={
                            (getProgress() / 100) *
                            (currentPage / totalPages) *
                            100
                        }
                        size="small"
                    >
                        {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => (
                                <Step
                                    key={i}
                                    title={`Q${i + 1}`}
                                    description={
                                        i + 1 === currentPage ? "Current" : ""
                                    }
                                    icon={
                                        <Badge
                                            count={
                                                answers[
                                                    questionsWithInterpretation[
                                                        i
                                                    ]?.id
                                                ] ? (
                                                    <CheckCircleOutlined
                                                        style={{
                                                            color: "#52c41a",
                                                            fontSize: "12px",
                                                        }}
                                                    />
                                                ) : null
                                            }
                                        >
                                            <Avatar
                                                size="small"
                                                style={{
                                                    backgroundColor:
                                                        i + 1 === currentPage
                                                            ? "#1890ff"
                                                            : answers[
                                                                  questionsWithInterpretation[
                                                                      i
                                                                  ]?.id
                                                              ]
                                                            ? "#52c41a"
                                                            : "#f0f0f0",
                                                    color:
                                                        i + 1 === currentPage
                                                            ? "white"
                                                            : answers[
                                                                  questionsWithInterpretation[
                                                                      i
                                                                  ]?.id
                                                              ]
                                                            ? "white"
                                                            : "#999",
                                                }}
                                            >
                                                {i + 1}
                                            </Avatar>
                                        </Badge>
                                    }
                                />
                            )
                        )}
                        {totalPages > 5 && (
                            <Step
                                title={`+${totalPages - 5} more`}
                                description=""
                                icon={<EllipsisOutlined />}
                            />
                        )}
                    </Steps>
                </Card>
                <br></br>
                {/* Question Card */}
                <Card className="question-card">
                    {/* Question Header */}
                    <div className="question-header">
                        <Space
                            direction="vertical"
                            style={{ width: "100%" }}
                            size="small"
                        >
                            <div className="question-meta">
                                <Badge
                                    count={`Question ${questionNumber} of ${questionsWithInterpretation.length}`}
                                    style={{ backgroundColor: "#1890ff" }}
                                    showZero
                                />
                                {currentQuestion?.required && (
                                    <Tag
                                        color="red"
                                        icon={<ExclamationCircleOutlined />}
                                    >
                                        Required
                                    </Tag>
                                )}
                                <Text
                                    type="secondary"
                                    className="question-category"
                                >
                                    {currentQuestion?.category}
                                </Text>
                            </div>

                            <Title level={3} className="question-text">
                                <QuestionCircleOutlined
                                    style={{ marginRight: 8, color: "#1890ff" }}
                                />
                                {currentQuestion?.question}
                            </Title>

                            {currentQuestion?.description && (
                                <Alert
                                    message={currentQuestion.description}
                                    type="info"
                                    showIcon
                                    closable
                                    className="question-description"
                                />
                            )}
                        </Space>
                    </div>

                    <Divider />

                    {/* Rating Section */}
                    <div className="rating-section">
                        <Title
                            level={4}
                            style={{ textAlign: "center", marginBottom: 32 }}
                        >
                            Please rate your experience:
                        </Title>

                        <div style={{ textAlign: "center" }}>
                            <CustomRate
                                value={answers[currentQuestion?.id]}
                                onChange={handleRateChange}
                                questionId={currentQuestion?.id}
                            />
                        </div>
                        <br></br>
                        {answers[currentQuestion?.id] && (
                            <Alert
                                message={
                                    <Space>
                                        <TrophyOutlined />
                                        {
                                            currentQuestion?.interpretation[
                                                answers[currentQuestion.id]
                                            ]
                                        }
                                    </Space>
                                }
                                type="success"
                                showIcon
                                className="interpretation-alert"
                            />
                        )}
                    </div>

                    <Divider />

                    {/* Navigation Section */}
                    <div className="navigation-section">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handlePrevious}
                            disabled={currentPage === 1}
                            size="large"
                            className="nav-button"
                        >
                            Previous
                        </Button>
                        {currentPage === totalPages ? (
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleSubmit}
                                disabled={!allRequiredAnswered()}
                                loading={isSubmitting}
                                icon={<RocketOutlined />}
                                className="submit-button"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Assessment"}
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                icon={<ArrowRightOutlined />}
                                onClick={handleNext}
                                size="large"
                                className="nav-button"
                            >
                                Next
                            </Button>
                        )}

                        {!allRequiredAnswered() &&
                            currentPage === totalPages && (
                                <Alert
                                    message={`${
                                        completionStatus.requiredTotal -
                                        completionStatus.requiredAnswered
                                    } required question(s) remaining`}
                                    type="warning"
                                    showIcon
                                    style={{ marginTop: 16 }}
                                />
                            )}
                    </div>

                    {/* Quick Stats Footer */}
                    <Divider />
                    <div className="quiz-footer">
                        <Row
                            gutter={[16, 16]}
                            justify="space-between"
                            align="middle"
                        >
                            <Col xs={24} sm={8}>
                                <Space>
                                    <CheckCircleOutlined
                                        style={{ color: "#52c41a" }}
                                    />
                                    <Text strong>
                                        {completionStatus.answered}
                                    </Text>
                                    <Text type="secondary">
                                        questions answered
                                    </Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                                <Space>
                                    <ClockCircleOutlined
                                        style={{ color: "#faad14" }}
                                    />
                                    <Text strong>{formatTime(timeSpent)}</Text>
                                    <Text type="secondary">time spent</Text>
                                </Space>
                            </Col>
                            <Col xs={24} sm={8} style={{ textAlign: "right" }}>
                                <Space>
                                    <Progress
                                        type="circle"
                                        percent={getProgress()}
                                        size={60}
                                        strokeColor={{
                                            "0%": "#108ee9",
                                            "100%": "#87d068",
                                        }}
                                    />
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AnswerQuizPage;
