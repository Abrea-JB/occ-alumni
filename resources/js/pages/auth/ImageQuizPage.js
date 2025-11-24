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
    Tooltip,
    Image,
    Avatar,
    Spin,
    Modal,
} from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    SmileOutlined,
    BulbOutlined,
    ThunderboltOutlined,
    PictureOutlined,
    EyeOutlined,
    StarOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    GlobalOutlined,
    EnvironmentOutlined,
    ExclamationCircleOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import useTakeQuiz from "~/hooks/useTakeQuiz";
import axiosConfig from "~/utils/axiosConfig";
const { Title, Text } = Typography;

const companyInfo = {
    name: "Opol Community College Alumni Association",
    logo: "https://www.sis.occph.com/build/assets/OCC_LOGO-BWCM4zrL.png",
    slogan: "Building tomorrow's leaders, one student at a time.",
    website: "occph.com",
    address: "C. Salva St, Opol, 9016 Misamis Oriental",
};

const ImageQuizPage = () => {
    const {
        isLoading: isLoadingQuizzes,
        data: questions = [],
        isFetching: isFetchingQuizzes,
        refetch: refetchQuizzes,
    } = useTakeQuiz("abcd");

    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState({});

    // Transform API data to match expected format
    useEffect(() => {
        if (questions && questions.length > 0) {
            const transformedQuiz = {
                id: 2,
                title: "Visual Personality & Preference Assessment",
                description:
                    "Discover your personality traits through image selection and visual preferences",
                questions: questions.map((q, index) => ({
                    id: q.id,
                    type: q.type,
                    question: q.question,
                    description: q.description,
                    required: q.required,
                    category: "Visual Assessment", // You can customize this based on your data
                    options: q.choices.map((choice, choiceIndex) => ({
                        id: `${q.id}_${choice.letter}`,
                        image: choice.image, // This should be the full URL to the image
                        label: choice.letter, // Or you can use a different label if available
                        value: choice.letter.toLowerCase(),
                        interpretation: choice.interpretation,
                    })),
                })),
                createdAt: "2024-01-20",
                estimatedTime: 10,
                category: "Visual Personality Assessment",
            };
            setCurrentQuiz(transformedQuiz);
        }
    }, [questions]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];

    const handleImageSelect = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const handleSubmit = async () => {
        if (!allRequiredAnswered()) {
            Modal.warning({
                title: "📋 Incomplete Assessment",
                content: (
                    <div style={{ padding: "10px 0" }}>
                        <p style={{ marginBottom: 8 }}>
                            Please answer all required questions before
                            submitting.
                        </p>
                        <div
                            style={{
                                background: "#fffbf0",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #ffe58f",
                            }}
                        >
                            <Space>
                                <ExclamationCircleOutlined
                                    style={{ color: "#faad14" }}
                                />
                                <Text type="warning">
                                    {completionStatus.requiredTotal -
                                        completionStatus.requiredAnswered}{" "}
                                    required question(s) remaining
                                </Text>
                            </Space>
                        </div>
                    </div>
                ),
                icon: (
                    <ExclamationCircleOutlined style={{ color: "#faad14" }} />
                ),
                okText: "Continue Assessment",
                okType: "primary",
                centered: true,
                style: { borderRadius: "12px" },
            });
            return;
        }

        setIsSubmitting(true);

        // Show submission confirmation modal
        Modal.confirm({
            title: (
                <Space>
                    <ThunderboltOutlined style={{ color: "#722ed1" }} />
                    <span>Ready to Submit?</span>
                </Space>
            ),
            content: (
                <div style={{ padding: "10px 0" }}>
                    <p>You're about to submit your assessment. Make sure:</p>
                    <ul style={{ paddingLeft: 20, margin: "10px 0" }}>
                        <li>All required questions are answered</li>
                        <li>Your responses reflect your honest opinions</li>
                        <li>You won't be able to modify after submission</li>
                    </ul>
                    <div
                        style={{
                            background: "#f6ffed",
                            padding: "12px",
                            borderRadius: "6px",
                            border: "1px solid #b7eb8f",
                            marginTop: "12px",
                        }}
                    >
                        <Space>
                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                            <Text type="success">
                                {completionStatus.answered} of{" "}
                                {completionStatus.total} questions completed
                            </Text>
                        </Space>
                    </div>
                </div>
            ),
            icon: <ExclamationCircleOutlined style={{ color: "#1890ff" }} />,
            okText: "Yes, Submit Now",
            cancelText: "Review Answers",
            okType: "primary",
            centered: true,
            style: { borderRadius: "12px" },
            onOk: async () => {
                try {
                    // Create submission data for ABCD quiz type
                    const submissionData = {
                        type: "abcd",
                        quizId: currentQuiz?.id || "default-quiz-id",
                        timeSpent: timeSpent,
                        answers: Object.entries(answers).map(
                            ([questionId, selectedOptionId]) => {
                                // Extract the letter from the option ID (e.g., "1a" -> "A", "2b" -> "B")
                                const optionLetter = selectedOptionId
                                    .charAt(selectedOptionId.length - 1)
                                    .toUpperCase();

                                return {
                                    questionId: questionId,
                                    rating: optionLetter, // Send as "A", "B", "C", "D"
                                    answeredAt: new Date().toISOString(),
                                };
                            }
                        ),
                    };

                    // Append user info if available
                    const userInfo = localStorage.getItem("userInfo");
                    if (userInfo) {
                        submissionData.userInfo = userInfo;
                    }

                    // Show loading modal
                    const loadingModal = Modal.info({
                        title: (
                            <Space>
                                <LoadingOutlined />
                                <span>Submitting Assessment</span>
                            </Space>
                        ),
                        content: (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px 0",
                                }}
                            >
                                <Progress
                                    percent={100}
                                    status="active"
                                    showInfo={false}
                                    strokeColor={{
                                        "0%": "#722ed1",
                                        "100%": "#52c41a",
                                    }}
                                />
                                <p style={{ marginTop: 16, color: "#666" }}>
                                    Processing your responses...
                                </p>
                            </div>
                        ),
                        okButtonProps: { disabled: true },
                        closable: false,
                        maskClosable: false,
                        centered: true,
                        style: { borderRadius: "12px" },
                    });

                    const response = await axiosConfig.post(
                        "/save-alumni-quiz",
                        submissionData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                            timeout: 30000, // 30 seconds timeout
                        }
                    );

                    // Close loading modal
                    loadingModal.destroy();

                    if (response.data.success) {
                        if (response.data.alumniQuizId) {
                            localStorage.setItem(
                                "lastSubmissionId",
                                response.data.alumniQuizId
                            );
                        }

                        Modal.success({
                            title: (
                                <Space>
                                    <CheckCircleOutlined
                                        style={{ color: "#52c41a" }}
                                    />
                                    <span>Assessment Complete! 🎉</span>
                                </Space>
                            ),
                            content: (
                                <div style={{ padding: "10px 0" }}>
                                    <p style={{ marginBottom: 12 }}>
                                        Thank you for completing the assessment.
                                        Your personality profile has been
                                        analyzed successfully.
                                    </p>
                                    <div
                                        style={{
                                            background: "#f6ffed",
                                            padding: "12px",
                                            borderRadius: "6px",
                                            border: "1px solid #b7eb8f",
                                        }}
                                    >
                                        <Row gutter={16}>
                                            <Col span={8}>
                                                <Statistic
                                                    title="Time Spent"
                                                    value={formatTime(
                                                        timeSpent
                                                    )}
                                                    prefix={
                                                        <ClockCircleOutlined />
                                                    }
                                                    valueStyle={{
                                                        fontSize: "14px",
                                                        color: "#1890ff",
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <Statistic
                                                    title="Questions Answered"
                                                    value={
                                                        Object.keys(answers)
                                                            .length
                                                    }
                                                    suffix={`/ ${completionStatus.total}`}
                                                    valueStyle={{
                                                        fontSize: "14px",
                                                        color: "#52c41a",
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <Statistic
                                                    title="Quiz Type"
                                                    value="ABCD"
                                                    valueStyle={{
                                                        fontSize: "14px",
                                                        color: "#722ed1",
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            ),
                            okText: "Back to Dashboard",
                            onOk: () => (window.location.href = "/"),
                            centered: true,
                            style: { borderRadius: "12px" },
                            width: 500,
                        });
                    } else {
                        throw new Error(
                            response.data.message || "Submission failed"
                        );
                    }
                } catch (error) {
                    console.error("❌ Error submitting quiz:", error);

                    let errorMessage =
                        "Failed to submit quiz. Please try again.";
                    let errorTitle = "Submission Error";

                    if (error.code === "ECONNABORTED") {
                        errorTitle = "⏰ Request Timeout";
                        errorMessage =
                            "The request took too long. Please check your internet connection and try again.";
                    } else if (error.response?.status === 413) {
                        errorTitle = "📁 File Too Large";
                        errorMessage =
                            "The file you uploaded is too large. Please reduce the file size and try again.";
                    } else if (error.response?.status === 429) {
                        errorTitle = "🚦 Too Many Requests";
                        errorMessage =
                            "Please wait a moment before trying again.";
                    } else if (error.response?.status >= 500) {
                        errorTitle = "🔧 Server Error";
                        errorMessage =
                            "Our servers are experiencing issues. Please try again in a few minutes.";
                    } else if (error.response?.data?.error) {
                        errorMessage = error.response.data.error;
                    } else if (error.response?.data?.errors) {
                        // Handle validation errors from backend
                        const validationErrors = error.response.data.errors;
                        errorMessage = Object.values(validationErrors)
                            .flat()
                            .join(", ");
                    }

                    Modal.error({
                        title: errorTitle,
                        content: (
                            <div style={{ padding: "10px 0" }}>
                                <p>{errorMessage}</p>
                                <div
                                    style={{
                                        background: "#fff2f0",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        border: "1px solid #ffccc7",
                                        marginTop: "12px",
                                    }}
                                >
                                    <Text type="secondary">
                                        If this continues, please contact
                                        support.
                                    </Text>
                                </div>
                            </div>
                        ),
                        okText: "Try Again",
                        centered: true,
                        style: { borderRadius: "12px" },
                    });
                } finally {
                    setIsSubmitting(false);
                }
            },
        });
    };

    const getProgress = () => {
        if (!currentQuiz) return 0;
        const answered = Object.keys(answers).length;
        return Math.floor((answered / currentQuiz.questions.length) * 100);
    };

    const getCompletionStatus = () => {
        if (!currentQuiz) return { answered: 0, total: 0 };
        const requiredQuestions = currentQuiz.questions.filter(
            (q) => q.required
        );
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
        const requiredQuestions = currentQuiz.questions.filter(
            (q) => q.required
        );
        return requiredQuestions.every((q) => answers[q.id] !== undefined);
    };

    const getPersonalityTraits = () => {
        if (!currentQuiz)
            return {
                level: "Thinker",
                color: "#fa8c16",
                description:
                    "You're logical and enjoy solving complex problems",
            };

        const selectedOptions = Object.values(answers)
            .map((answerId) => {
                for (let question of currentQuiz.questions) {
                    const option = question.options.find(
                        (opt) => opt.id === answerId
                    );
                    if (option) return option;
                }
                return null;
            })
            .filter((opt) => opt !== null);

        // Simple analysis based on selected options
        const traits = {
            adventurous: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("nature") ||
                    opt.interpretation?.includes("ocean") ||
                    opt.interpretation?.includes("eagle") ||
                    opt.interpretation?.includes("explor")
            ).length,
            social: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("social") ||
                    opt.interpretation?.includes("people") ||
                    opt.interpretation?.includes("community") ||
                    opt.interpretation?.includes("connection")
            ).length,
            creative: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("creative") ||
                    opt.interpretation?.includes("innovative") ||
                    opt.interpretation?.includes("artistic") ||
                    opt.interpretation?.includes("imaginative")
            ).length,
            analytical: selectedOptions.filter(
                (opt) =>
                    opt.interpretation?.includes("analytical") ||
                    opt.interpretation?.includes("logical") ||
                    opt.interpretation?.includes("structured") ||
                    opt.interpretation?.includes("detail")
            ).length,
        };

        const maxTrait = Object.keys(traits).reduce((a, b) =>
            traits[a] > traits[b] ? a : b
        );

        const traitInfo = {
            adventurous: {
                level: "Explorer",
                color: "#52c41a",
                description:
                    "You're naturally curious and love exploring new possibilities",
            },
            social: {
                level: "Connector",
                color: "#1890ff",
                description:
                    "You thrive on relationships and community interactions",
            },
            creative: {
                level: "Innovator",
                color: "#722ed1",
                description: "You're imaginative and bring unique perspectives",
            },
            analytical: {
                level: "Thinker",
                color: "#fa8c16",
                description:
                    "You're logical and enjoy solving complex problems",
            },
        };

        return traitInfo[maxTrait] || traitInfo.analytical;
    };

    const handleNext = () => {
        if (
            currentQuiz &&
            currentQuestionIndex < currentQuiz.questions.length - 1
        ) {
            setCurrentQuestionIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleImageLoad = (optionId) => {
        setImagesLoaded((prev) => ({ ...prev, [optionId]: true }));
    };

    if (isLoadingQuizzes) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!currentQuiz || !currentQuestion) {
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
            <div
                style={{
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    minHeight: "100vh",
                    padding: "40px 20px",
                }}
            >
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <Card
                        style={{
                            borderRadius: "30px",
                            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.2)",
                            border: "none",
                            overflow: "hidden",
                        }}
                    >
                        <Result
                            icon={
                                <SmileOutlined
                                    style={{ color: personality.color }}
                                />
                            }
                            status="success"
                            title="Visual Assessment Complete!"
                            subTitle={
                                <Space direction="vertical">
                                    <Text>
                                        Your personality profile has been
                                        analyzed through your visual
                                        preferences.
                                    </Text>
                                    <Tag
                                        color={personality.color}
                                        icon={<StarOutlined />}
                                    >
                                        {personality.level} Personality
                                    </Tag>
                                </Space>
                            }
                            extra={[
                                <Button
                                    key="another"
                                    onClick={() => window.location.reload()}
                                >
                                    Retake Assessment
                                </Button>,
                                <Button key="home" type="primary">
                                    View Detailed Analysis
                                </Button>,
                            ]}
                        >
                            <div style={{ margin: "40px 0" }}>
                                <Row gutter={32}>
                                    <Col xs={24} sm={8}>
                                        <Card
                                            size="small"
                                            style={{
                                                textAlign: "center",
                                                borderRadius: "16px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            <Statistic
                                                title="Personality Type"
                                                value={personality.level}
                                                valueStyle={{
                                                    color: personality.color,
                                                    fontSize: "24px",
                                                }}
                                                prefix={<EyeOutlined />}
                                            />
                                            <Text type="secondary">
                                                {personality.description}
                                            </Text>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Card
                                            size="small"
                                            style={{
                                                textAlign: "center",
                                                borderRadius: "16px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            <Statistic
                                                title="Completion Rate"
                                                value={(
                                                    (completionStatus.answered /
                                                        completionStatus.total) *
                                                    100
                                                ).toFixed(0)}
                                                suffix="%"
                                                valueStyle={{
                                                    color: "#1890ff",
                                                    fontSize: "24px",
                                                }}
                                                prefix={<CheckCircleOutlined />}
                                            />
                                            <Text type="secondary">
                                                {completionStatus.answered} of{" "}
                                                {completionStatus.total}{" "}
                                                questions
                                            </Text>
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Card
                                            size="small"
                                            style={{
                                                textAlign: "center",
                                                borderRadius: "16px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
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
                                                Estimated:{" "}
                                                {currentQuiz.estimatedTime} min
                                            </Text>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>

                            <Divider />

                            <div>
                                <Title
                                    level={3}
                                    style={{
                                        textAlign: "center",
                                        marginBottom: 24,
                                    }}
                                >
                                    🎨 Your Visual Preferences Analysis
                                </Title>
                                <Row gutter={[16, 16]}>
                                    {currentQuiz.questions.map(
                                        (question, index) => {
                                            const selectedOption =
                                                question.options.find(
                                                    (opt) =>
                                                        opt.id ===
                                                        answers[question.id]
                                                );
                                            return (
                                                <Col
                                                    xs={24}
                                                    lg={12}
                                                    key={question.id}
                                                >
                                                    <Card
                                                        size="small"
                                                        style={{
                                                            borderLeft: `4px solid ${personality.color}`,
                                                            height: "100%",
                                                            borderRadius:
                                                                "16px",
                                                            transition:
                                                                "all 0.3s ease",
                                                        }}
                                                    >
                                                        <Space
                                                            direction="vertical"
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    alignItems:
                                                                        "flex-start",
                                                                }}
                                                            >
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        flex: 1,
                                                                    }}
                                                                >
                                                                    Q{index + 1}
                                                                    :{" "}
                                                                    {
                                                                        question.question
                                                                    }
                                                                </Text>
                                                                <Space>
                                                                    {question.required && (
                                                                        <Tag
                                                                            color="red"
                                                                            size="small"
                                                                        >
                                                                            Required
                                                                        </Tag>
                                                                    )}
                                                                    <Tag
                                                                        color="blue"
                                                                        size="small"
                                                                    >
                                                                        {
                                                                            question.category
                                                                        }
                                                                    </Tag>
                                                                </Space>
                                                            </div>

                                                            {selectedOption && (
                                                                <div>
                                                                    <Row
                                                                        gutter={
                                                                            16
                                                                        }
                                                                        align="middle"
                                                                    >
                                                                        <Col
                                                                            xs={
                                                                                24
                                                                            }
                                                                            sm={
                                                                                8
                                                                            }
                                                                        >
                                                                            <Image
                                                                                src={
                                                                                    selectedOption.image
                                                                                }
                                                                                alt={
                                                                                    selectedOption.label
                                                                                }
                                                                                width="100%"
                                                                                style={{
                                                                                    borderRadius: 8,
                                                                                }}
                                                                                preview={{
                                                                                    mask: (
                                                                                        <EyeOutlined />
                                                                                    ),
                                                                                }}
                                                                            />
                                                                        </Col>
                                                                        <Col
                                                                            xs={
                                                                                24
                                                                            }
                                                                            sm={
                                                                                16
                                                                            }
                                                                        >
                                                                            <Text
                                                                                strong
                                                                            >
                                                                                Option{" "}
                                                                                {
                                                                                    selectedOption.label
                                                                                }
                                                                            </Text>
                                                                            <br />
                                                                            <Text
                                                                                type="secondary"
                                                                                style={{
                                                                                    fontSize:
                                                                                        "13px",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    selectedOption.interpretation
                                                                                }
                                                                            </Text>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            )}

                                                            {!selectedOption && (
                                                                <Text
                                                                    type="secondary"
                                                                    italic
                                                                >
                                                                    Not answered
                                                                </Text>
                                                            )}
                                                        </Space>
                                                    </Card>
                                                </Col>
                                            );
                                        }
                                    )}
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
        <div
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                minHeight: "100vh",
            }}
        >
            <Card>
                {/* Header Banner */}
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

            {/* Progress Stats */}
            <div
                style={{
                    background: "white",
                    padding: "30px 20px",
                    margin: "-30px 20px 30px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    zIndex: 10,
                    marginTop: 40,
                }}
            >
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
                                    {completionStatus.answered}/
                                    {completionStatus.total} questions
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
                                color:
                                    completionStatus.requiredAnswered ===
                                    completionStatus.requiredTotal
                                        ? "#52c41a"
                                        : "#fa8c16",
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
                            title="Current Question"
                            value={currentQuestionIndex + 1}
                            suffix={`/ ${currentQuiz.questions.length}`}
                            valueStyle={{ color: "#722ed1", fontSize: "24px" }}
                            prefix={<BulbOutlined />}
                        />
                    </Col>
                </Row>
            </div>

            {/* Questions with Navigation */}
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    padding: "0 20px 40px",
                }}
            >
                <Card
                    style={{
                        borderRadius: "20px",
                        boxShadow: "0 15px 50px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        overflow: "hidden",
                    }}
                >
                    <div style={{ padding: "40px" }}>
                        <Title
                            level={2}
                            style={{
                                textAlign: "center",
                                marginBottom: 32,
                                color: "#722ed1",
                            }}
                        >
                            🎨 Visual Preference Assessment
                        </Title>

                        {/* Navigation Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "32px",
                                padding: "20px",
                                background:
                                    "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)",
                                borderRadius: "16px",
                            }}
                        >
                            <Button
                                type="default"
                                size="large"
                                icon={<ArrowLeftOutlined />}
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                style={{
                                    minWidth: "120px",
                                    height: "45px",
                                    borderRadius: "10px",
                                }}
                            >
                                Previous
                            </Button>

                            <Space>
                                <Text strong>
                                    Question {currentQuestionIndex + 1} of{" "}
                                    {currentQuiz.questions.length}
                                </Text>
                                <Tag color="blue">
                                    {Math.round(
                                        ((currentQuestionIndex + 1) /
                                            currentQuiz.questions.length) *
                                            100
                                    )}
                                    % Complete
                                </Tag>
                            </Space>

                            <Button
                                type="default"
                                size="large"
                                icon={<ArrowRightOutlined />}
                                onClick={handleNext}
                                disabled={
                                    currentQuestionIndex ===
                                    currentQuiz.questions.length - 1
                                }
                                style={{
                                    minWidth: "120px",
                                    height: "45px",
                                    borderRadius: "10px",
                                }}
                            >
                                Next
                            </Button>
                        </div>

                        {/* Current Question */}
                        <div>
                            <Card
                                style={{
                                    borderLeft: `6px solid #722ed1`,
                                    marginBottom: 24,
                                    transition: "all 0.3s ease",
                                    borderRadius: "16px",
                                    border: "2px solid transparent",
                                    background: answers[currentQuestion.id]
                                        ? "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)"
                                        : "white",
                                }}
                            >
                                <div
                                    style={{
                                        paddingBottom: "16px",
                                        borderBottom: "2px solid #f0f0f0",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <Space
                                        wrap
                                        style={{
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Space>
                                            <div
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg, #667eea, #764ba2)",
                                                    color: "white",
                                                    padding: "8px 16px",
                                                    borderRadius: "12px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                <Text
                                                    strong
                                                    style={{
                                                        fontSize: "18px",
                                                        color: "white",
                                                    }}
                                                >
                                                    Q{currentQuestionIndex + 1}
                                                </Text>
                                            </div>
                                            <Tag
                                                color="purple"
                                                icon={<PictureOutlined />}
                                            >
                                                {currentQuestion.category}
                                            </Tag>
                                            {currentQuestion.required ? (
                                                <Tag color="red">Required</Tag>
                                            ) : (
                                                <Tag color="orange">
                                                    Optional
                                                </Tag>
                                            )}
                                        </Space>
                                        {answers[currentQuestion.id] && (
                                            <Tag
                                                color="green"
                                                icon={<CheckCircleOutlined />}
                                            >
                                                Answered
                                            </Tag>
                                        )}
                                    </Space>
                                </div>

                                <div>
                                    <Title
                                        level={4}
                                        style={{
                                            marginBottom: 16,
                                            color: "#262626",
                                        }}
                                    >
                                        {currentQuestion.question}
                                    </Title>

                                    {currentQuestion.description && (
                                        <Alert
                                            message="Visual Context"
                                            description={
                                                currentQuestion.description
                                            }
                                            type="info"
                                            showIcon
                                            style={{
                                                marginBottom: 20,
                                                background: "#f9f0ff",
                                                border: "1px solid #d3adf7",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    )}

                                    <div style={{ marginTop: 24 }}>
                                        <Text
                                            strong
                                            style={{
                                                display: "block",
                                                marginBottom: 20,
                                                fontSize: "16px",
                                            }}
                                        >
                                            Select the image that best
                                            represents your preference:
                                        </Text>

                                        <Row gutter={[16, 16]} justify="center">
                                            {currentQuestion.options.map(
                                                (option) => (
                                                    <Col
                                                        xs={24}
                                                        sm={12}
                                                        md={6}
                                                        key={option.id}
                                                    >
                                                        <Tooltip
                                                            // title={
                                                            //     option.interpretation
                                                            // }
                                                        >
                                                            <div
                                                                style={{
                                                                    border: `3px solid ${
                                                                        answers[
                                                                            currentQuestion
                                                                                .id
                                                                        ] ===
                                                                        option.id
                                                                            ? "#52c41a"
                                                                            : "#f0f0f0"
                                                                    }`,
                                                                    borderRadius:
                                                                        "16px",
                                                                    overflow:
                                                                        "hidden",
                                                                    cursor: "pointer",
                                                                    transition:
                                                                        "all 0.3s ease",
                                                                    background:
                                                                        "white",
                                                                    position:
                                                                        "relative",
                                                                    transform:
                                                                        answers[
                                                                            currentQuestion
                                                                                .id
                                                                        ] ===
                                                                        option.id
                                                                            ? "translateY(-8px)"
                                                                            : "none",
                                                                    boxShadow:
                                                                        answers[
                                                                            currentQuestion
                                                                                .id
                                                                        ] ===
                                                                        option.id
                                                                            ? "0 15px 30px rgba(82, 196, 26, 0.3)"
                                                                            : "none",
                                                                }}
                                                                onClick={() =>
                                                                    handleImageSelect(
                                                                        currentQuestion.id,
                                                                        option.id
                                                                    )
                                                                }
                                                            >
                                                                <div
                                                                    style={{
                                                                        position:
                                                                            "relative",
                                                                        overflow:
                                                                            "hidden",
                                                                    }}
                                                                >
                                                                    <Image
                                                                        src={
                                                                            option.image
                                                                        }
                                                                        alt={`Option ${option.label}`}
                                                                        width="100%"
                                                                        height={
                                                                            150
                                                                        }
                                                                        style={{
                                                                            objectFit:
                                                                                "cover",
                                                                            borderRadius:
                                                                                "8px 8px 0 0",
                                                                        }}
                                                                        preview={{
                                                                            mask: (
                                                                                <EyeOutlined />
                                                                            ),
                                                                        }}
                                                                        onLoad={() =>
                                                                            handleImageLoad(
                                                                                option.id
                                                                            )
                                                                        }
                                                                    />
                                                                    <div
                                                                        style={{
                                                                            padding:
                                                                                "16px",
                                                                            textAlign:
                                                                                "center",
                                                                            background:
                                                                                "white",
                                                                            position:
                                                                                "relative",
                                                                            zIndex: 2,
                                                                        }}
                                                                    >
                                                                        <Text
                                                                            strong
                                                                        >
                                                                            Option{" "}
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        position:
                                                                            "absolute",
                                                                        top: "12px",
                                                                        right: "12px",
                                                                        zIndex: 3,
                                                                        background:
                                                                            "white",
                                                                        borderRadius:
                                                                            "50%",
                                                                        padding:
                                                                            "4px",
                                                                        boxShadow:
                                                                            "0 4px 12px rgba(0, 0, 0, 0.15)",
                                                                    }}
                                                                >
                                                                    {answers[
                                                                        currentQuestion
                                                                            .id
                                                                    ] ===
                                                                    option.id ? (
                                                                        <CheckCircleOutlined
                                                                            style={{
                                                                                color: "#52c41a",
                                                                                fontSize:
                                                                                    "20px",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                width: "20px",
                                                                                height: "20px",
                                                                                border: "2px solid #d9d9d9",
                                                                                borderRadius:
                                                                                    "50%",
                                                                                background:
                                                                                    "white",
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Tooltip>
                                                    </Col>
                                                )
                                            )}
                                        </Row>

                                        {/* {answers[currentQuestion.id] && (
                                            <Alert
                                                message={
                                                    currentQuestion.options.find(
                                                        (opt) =>
                                                            opt.id ===
                                                            answers[
                                                                currentQuestion
                                                                    .id
                                                            ]
                                                    )?.interpretation
                                                }
                                                type="info"
                                                showIcon
                                                style={{
                                                    marginTop: 20,
                                                    background: "#f6ffed",
                                                    border: "1px solid #b7eb8f",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        )} */}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Submit Section */}
                        {currentQuestionIndex ===
                            currentQuiz.questions.length - 1 && (
                            <div style={{ marginTop: "40px" }}>
                                <Card
                                    style={{
                                        background: allRequiredAnswered()
                                            ? "#f6ffed"
                                            : "#fff2e8",
                                        border: `2px solid ${
                                            allRequiredAnswered()
                                                ? "#b7eb8f"
                                                : "#ffd591"
                                        }`,
                                        textAlign: "center",
                                        borderRadius: "20px",
                                        padding: "30px",
                                    }}
                                >
                                    <Space
                                        direction="vertical"
                                        size="large"
                                        style={{ width: "100%" }}
                                    >
                                        <div>
                                            <Title
                                                level={3}
                                                style={{
                                                    color: allRequiredAnswered()
                                                        ? "#52c41a"
                                                        : "#fa8c16",
                                                }}
                                            >
                                                {allRequiredAnswered()
                                                    ? "🎉 Ready to Discover!"
                                                    : "📋 Complete Required Selections"}
                                            </Title>
                                            <Text>
                                                {allRequiredAnswered()
                                                    ? "All required visual selections have been made. Submit to discover your personality profile."
                                                    : `${
                                                          completionStatus.requiredTotal -
                                                          completionStatus.requiredAnswered
                                                      } required selection(s) remaining.`}
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
                                                background:
                                                    allRequiredAnswered()
                                                        ? "#722ed1"
                                                        : undefined,
                                                borderRadius: "10px",
                                            }}
                                        >
                                            {isSubmitting
                                                ? "Analyzing..."
                                                : "Discover My Personality"}
                                        </Button>

                                        <div
                                            style={{
                                                padding: "16px",
                                                background:
                                                    "rgba(102, 126, 234, 0.05)",
                                                borderRadius: "12px",
                                                border: "1px solid rgba(102, 126, 234, 0.1)",
                                            }}
                                        >
                                            <Space wrap>
                                                <CheckCircleOutlined
                                                    style={{
                                                        color:
                                                            completionStatus.requiredAnswered ===
                                                            completionStatus.requiredTotal
                                                                ? "#52c41a"
                                                                : "#d9d9d9",
                                                    }}
                                                />
                                                <Text>
                                                    Required:{" "}
                                                    {
                                                        completionStatus.requiredAnswered
                                                    }
                                                    /
                                                    {
                                                        completionStatus.requiredTotal
                                                    }
                                                </Text>
                                                <CheckCircleOutlined
                                                    style={{
                                                        color:
                                                            completionStatus.answered ===
                                                            completionStatus.total
                                                                ? "#52c41a"
                                                                : "#d9d9d9",
                                                    }}
                                                />
                                                <Text>
                                                    Total:{" "}
                                                    {completionStatus.answered}/
                                                    {completionStatus.total}
                                                </Text>
                                                <BulbOutlined
                                                    style={{ color: "#722ed1" }}
                                                />
                                                <Text>
                                                    Question:{" "}
                                                    {currentQuestionIndex + 1}/
                                                    {
                                                        currentQuiz.questions
                                                            .length
                                                    }
                                                </Text>
                                            </Space>
                                        </div>
                                    </Space>
                                </Card>
                            </div>
                        )}

                        {/* Help Card */}
                        <Alert
                            message="💡 Visual Assessment Guidance"
                            description="This personality assessment uses visual preferences to understand your traits. Select the images that genuinely resonate with you - there are no right or wrong answers. Your choices reveal your natural inclinations and personality characteristics."
                            type="info"
                            showIcon
                            style={{
                                marginTop: 24,
                                background: "#f9f0ff",
                                border: "1px solid #d3adf7",
                                borderRadius: "8px",
                            }}
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ImageQuizPage;
