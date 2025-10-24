import React, { useState, useRef, useMemo } from "react";
import { Table, Input, Button, Space, Tag, Modal, Alert, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import useGradeSheet from "~/hooks/useGradeSheet";
import { useParams } from "react-router-dom";
import {
    SyncOutlined,
    ExclamationCircleOutlined,
    FileDoneOutlined,
} from "@ant-design/icons";
import { getStorage } from "~/utils/helper";
import useClassRoomSettings from "~/hooks/useClassRoomSettings";
import useClassroomStore from "~/states/classroomState";

// color palette https://colorhunt.co/palette/cb9df0f0c1e1fddbbbfff9bf

const StudentGradeSheet = () => {
    const { id } = useParams();
    const {
        isLoading,
        data: classroom,
        refetch: refetchSettings,
    } = useClassRoomSettings(id);
    const role = getStorage("userRole");
    const { data: sheet, isFetching: fetchingSheet } = useGradeSheet(id);
    const { storeAcademicRecords } = useClassroomStore();

    const attendances = Array.isArray(sheet?.attendances)
        ? sheet?.attendances
        : [];
    const fattendances = Array.isArray(sheet?.fattendances)
        ? sheet?.fattendances
        : [];
    const distinctDates = [
        ...new Set(attendances.map((att) => att.date_time.split(" ")[0])),
    ];

    const fdistinctDates = [
        ...new Set(fattendances.map((att) => att.date_time.split(" ")[0])),
    ];

    const studentList = sheet?.students ?? [];
    const quizes = sheet?.quizes ?? [];
    const fquizes = sheet?.fquizes ?? [];
    const exercises = sheet?.exercises ?? [];
    const fexercises = sheet?.fexercises ?? [];
    const assignments = sheet?.assignments ?? [];
    const fassignments = sheet?.fassignments ?? [];
    const midterm = sheet?.midterm ?? [];
    const finalExam = sheet?.final ?? [];
    const midtermCount = sheet?.midterm_count || 0;
    const finalCount = sheet?.final_count || 0;
    const studentWithGrades = sheet?.student_with_grades || [];

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [globalSearchText, setGlobalSearchText] = useState("");

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={close}>
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? "#1677ff" : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    function percentageToGrade(percentage) {
        if (percentage >= 100) return 1.0;
        else if (percentage >= 50) {
            return 1.0 + -0.04 * (percentage - 100);
        } else if (percentage >= 0) {
            return 3.0 + -0.04 * (percentage - 50);
        } else {
            return 5.0;
        }
    }

    // Constants for better readability
    const GRADE_COMPONENTS = {
        ATTENDANCE: "ATTENDANCE",
        LABORATORY: "LABORATORY",
        ASSIGNMENT: "ASSIGNMENT",
        MIDTERM: "MIDTERM",
    };

    // Weight configuration (now more explicit)
    const WEIGHTS = {
        MIXED_SCORE: 0.7, // 70% of final grade
        MIDTERM: 0.3, // 30% of final grade 0.25
    };

    const MIXED_SCORE_WEIGHTS = {
        ATTENDANCE: 0.4, // 40% of mixed score
        LABORATORY: 0.4, // 40% of mixed score
        ASSIGNMENT: 0.2, // 20% of mixed score
    };

    function calculateFinalGrade(components) {
        // Calculate mixed score components
        const mixedScore =
            components.reduce((sum, comp) => {
                if (!MIXED_SCORE_WEIGHTS[comp.componentType]) return sum;

                const percentage = (comp.earned / comp.total) * 100;
                const grade = percentageToGrade(percentage);
                return sum + grade * MIXED_SCORE_WEIGHTS[comp.componentType];
            }, 0) * WEIGHTS.MIXED_SCORE;

        // Calculate midterm score
        const midtermComponent = components.find(
            (c) => c.componentType === GRADE_COMPONENTS.MIDTERM
        );
        const midtermPercentage =
            (midtermComponent.earned / midtermComponent.total) * 100;

        const midtermGrade =
            percentageToGrade(midtermPercentage) * WEIGHTS.MIDTERM;

        // Calculate final grade
        const finalGrade = mixedScore + midtermGrade;

        // Prepare detailed component results
        const componentResults = components.map((comp) => {
            const percentage = (comp.earned / comp.total) * 100;
            const unweightedGrade = percentageToGrade(percentage);
            const weight =
                comp.componentType === GRADE_COMPONENTS.MIDTERM
                    ? WEIGHTS.MIDTERM
                    : MIXED_SCORE_WEIGHTS[comp.componentType] *
                      WEIGHTS.MIXED_SCORE;

            return {
                componentType: comp.componentType,
                earned: comp.earned,
                total: comp.total,
                percentage: Math.round(percentage * 10) / 10,
                unweightedGrade: Math.round(unweightedGrade * 10) / 10,
                weight,
                weightedGrade: Math.round(unweightedGrade * weight * 10) / 10,
            };
        });

        return {
            finalGrade: parseFloat(finalGrade.toFixed(1)),
            components: componentResults,
            gradingScale: "1.0–5.0 (1.0 highest, 5.0 lowest)",
        };
    }

    const getGradeTag = (grade) => {
        const isPass = grade <= 3.0;
        return (
            <Tag color={isPass ? "#87d068" : "#f50"}>{grade.toFixed(1)}</Tag>
        );
    };

    // Generate 20 student records
    const generateStudentData = () => {
        const students = [];

        for (let i = 0; i < studentList.length; i++) {
            const student = studentList[i];
            const studentId = student.student_id;

            const attendanceScores = distinctDates.map((date) => {
                const attendance = attendances.find(
                    (att) =>
                        att.student_id === studentId &&
                        att.date_time.startsWith(date)
                );

                if (attendance) {
                    // Check if the attendance was late (you'll need to define what makes it late)
                    // For example, if there's a 'is_late' property or you need to compare times
                    const isLate = attendance.status === "late";
                    return isLate
                        ? classroom?.attendance_points_late
                        : classroom?.attendance_points;
                }

                return 0; // No attendance record for this date
            });

            // Calculate maximum possible points
            const maxAttendancePoints =
                distinctDates.length * classroom?.attendance_points;
            const maxQuizPoints = quizes.reduce(
                (sum, quiz) => sum + (quiz?.points_possible || 0),
                0
            );

            const maxExercisesPoints = (() => {
                const calculated = exercises.reduce(
                    (sum, quiz) => sum + (quiz?.points_possible || 0),
                    0
                );
                return calculated === 0 ? 100 : calculated;
            })();

            const totalExercisesPoints = exercises.reduce((sum, item) => {
                const studentScore = item.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const maxAssignmentPoints =
                assignments.reduce(
                    (sum, quiz) => sum + (quiz?.points_possible || 0),
                    0
                ) || 100;

            const totalAssigmentPoints = assignments.reduce((sum, item) => {
                const studentScore = item.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const maxMidtermPoints =
                midterm.reduce(
                    (sum, quiz) => sum + (quiz?.points_possible || 0),
                    0
                ) || 100;

            const totalMidtermPoints = midterm.reduce((sum, item) => {
                const studentScore = item.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const totalMidtermAttendance =
                parseFloat(maxAttendancePoints) + parseFloat(maxQuizPoints) ||
                100;

            // Calculate total scores
            const totalAttendanceScores = attendanceScores.reduce(
                (sum, score) => sum + score,
                0
            );

            const totalQuizPoints = quizes.reduce((sum, quiz) => {
                const studentScore = quiz.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const totalMidtermQuizPoints = parseFloat(
                totalAttendanceScores + totalQuizPoints
            );

            const result = calculateFinalGrade([
                {
                    componentType: "ATTENDANCE",
                    earned:
                        distinctDates.length === 0 && quizes.length === 0
                            ? 0
                            : totalMidtermQuizPoints,
                    total: totalMidtermAttendance,
                },
                {
                    componentType: "LABORATORY",
                    earned: exercises.length === 0 ? 0 : totalExercisesPoints,
                    total: maxExercisesPoints,
                },
                {
                    componentType: "ASSIGNMENT",
                    earned: assignments.length === 0 ? 0 : totalAssigmentPoints,
                    total: maxAssignmentPoints,
                },
                {
                    componentType: "MIDTERM",
                    earned: midterm.length === 0 ? 0 : totalMidtermPoints,
                    total: maxMidtermPoints,
                },
            ]);

            // final

            const fattendanceScores =
                Array.isArray(fdistinctDates) &&
                fdistinctDates.map((date) => {
                    const hasAttendance = fattendances.some(
                        (att) =>
                            att.student_id === studentId &&
                            att.date_time.startsWith(date)
                    );
                    return hasAttendance ? classroom?.attendance_points : 0;
                });

            const ftotalAttendanceScores = fattendanceScores.reduce(
                (sum, score) => sum + score,
                0
            );

            const ftotalQuizPoints = fquizes.reduce((sum, quiz) => {
                const studentScore = quiz.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const ftotalExercisesPoints = fexercises.reduce((sum, item) => {
                const studentScore = item.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const ftotalAssigmentPoints = fassignments.reduce((sum, item) => {
                const studentScore = item.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const fmaxAssigmentPoints =
                fassignments.reduce(
                    (sum, quiz) => sum + (quiz?.points_possible || 0),
                    0
                ) || 100;

            const totalFinalPoints = finalExam.reduce((sum, item) => {
                const studentScore = item.scores?.find(
                    (s) => s.student_id === studentId
                );
                return sum + (studentScore?.score || 0);
            }, 0);

            const maxFinalPoints =
                finalExam.reduce(
                    (sum, quiz) => sum + (quiz?.points_possible || 0),
                    0
                ) || 100;

            const fmaxAttendancePoints =
                fdistinctDates.length * classroom?.attendance_points;
            const fmaxQuizPoints = fquizes.reduce(
                (sum, quiz) => sum + (quiz?.points_possible || 0),
                0
            );

            const fmaxExercisesPoints =
                fexercises.reduce(
                    (sum, quiz) => sum + (quiz?.points_possible || 0),
                    0
                ) || 100;

            // end final

            const tAttendance = ftotalAttendanceScores + ftotalQuizPoints;
            const tAttendancePoints =
                fmaxAttendancePoints + fmaxQuizPoints || 100;
            const fresult = calculateFinalGrade([
                {
                    componentType: "ATTENDANCE",
                    earned:
                        fdistinctDates.length + fquizes.length === 0
                            ? 0
                            : tAttendance,
                    total: tAttendancePoints,
                },
                {
                    componentType: "LABORATORY",
                    earned: fexercises.length === 0 ? 0 : ftotalExercisesPoints,
                    total: fmaxExercisesPoints,
                },
                {
                    componentType: "ASSIGNMENT",
                    earned:
                        fassignments.length === 0 ? 0 : ftotalAssigmentPoints,
                    total: fmaxAssigmentPoints,
                },
                {
                    componentType: "MIDTERM",
                    earned: finalExam.length === 0 ? 0 : totalFinalPoints,
                    total: maxFinalPoints,
                },
            ]);

            let finalRating = (result.finalGrade + fresult.finalGrade) / 2;

            students.push({
                key: i.toString(),
                number: i + 1 + ".",
                sid: student.student?.id,
                studentId: `S${1000 + i}`,
                studentName: `${student.student?.lname}, ${student.student?.fname}`,
                attendanceScores: attendanceScores,
                totalAttendance: totalAttendanceScores + totalQuizPoints,
                totalExercises: totalExercisesPoints,
                totalAssigments: totalAssigmentPoints,
                midterm: totalMidtermPoints,
                midtermGrade:
                    midtermCount === 0 ? "-" : getGradeTag(result.finalGrade),
                fattendanceScores: fattendanceScores,
                ftotalAttendance: ftotalAttendanceScores + ftotalQuizPoints,
                ftotalExercises: ftotalExercisesPoints,
                ftotalAssigments: ftotalAssigmentPoints,
                final: totalFinalPoints,
                finalGrade:
                    midtermCount === 0 || finalCount === 0
                        ? "-"
                        : getGradeTag(fresult.finalGrade),
                finalRating:
                    midtermCount === 0 || finalCount === 0
                        ? "-"
                        : getGradeTag(finalRating),
                midtermGradeScore: result.finalGrade,
                finalGradeScore: fresult.finalGrade,
                finalRatingScore: finalRating,
            });
        }

        return students;
    };

    const data = studentWithGrades; // generateStudentData()

    const isMobile = window.innerWidth < 768;

    const baseColumns = [
        {
            title: (
                <div>
                    <div className="top-title">#</div>
                </div>
            ),
            dataIndex: "number",
            key: "number",
            width: 50,
            align: "center",
        },
        {
            title: (
                <div>
                    <div className="top-title">Student</div>
                </div>
            ),
            dataIndex: "studentName",
            key: "studentName",
            ...(!isMobile && { fixed: "left" }),
            width: isMobile ? 100 : 200,
            // ...getColumnSearchProps("studentName"),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#CB9DF0",
                },
            }),
            title: (
                <div>
                    <div className="top-title">ATTENDANCE</div>
                    <div className="points-wrapper-quiz-top">
                        {distinctDates.map((date, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#7300d0" }}
                                >
                                    {i + 1}
                                </div>
                                <div className="max-value">
                                    <Tag className="tag-item" color="blue">
                                        {classroom?.attendance_points}
                                    </Tag>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "attendanceScores",
            render: (record) => (
                <div className="points-wrapper-score">
                    {record.attendanceScores.map((score, i) => (
                        <div key={i} className="item-score">
                            {score !== undefined && score !== null ? (
                                <Tag className="tag-item" color="#2db7f5">
                                    {score}
                                </Tag>
                            ) : (
                                <Tag
                                    className="tag-item"
                                    icon={<SyncOutlined spin />}
                                    color="processing"
                                ></Tag>
                            )}
                        </div>
                    ))}
                </div>
            ),
            width: Math.max(distinctDates.length * 50 + 50, 120),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#CB9DF0",
                },
            }),
            title: (
                <div>
                    <div className="top-title"> HANDS-ON QUIZ</div>
                    <div className="points-wrapper-quiz-top">
                        {quizes.map((quize, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#7300d0" }}
                                >
                                    {i + 1}
                                </div>
                                <div>
                                    <Tag color="blue" className="tag-item">
                                        {quize?.points_possible || 0}
                                    </Tag>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "quiz",
            render: (record) => {
                const studentId = parseInt(record.sid);

                return (
                    <div className="points-wrapper-quiz">
                        {quizes.map((quiz, i) => {
                            const studentScore = quiz?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`quiz-${quiz.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            width: Math.max(quizes.length * 50 + 50, 160),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#CB9DF0",
                },
            }),
            title: (
                <div>
                    <div className="top-title">TOTAL(40%)</div>
                    <div className="points-wrapper-quiz-top">
                        (
                        <span className="total-text">
                            {(() => {
                                const totalPointsPossible = quizes.reduce(
                                    (sum, quiz) =>
                                        sum + (quiz?.points_possible || 0),
                                    0
                                );
                                return (
                                    distinctDates.length *
                                        classroom?.attendance_points +
                                    totalPointsPossible
                                );
                            })()}
                        </span>
                        )
                        <small>
                            <i>pts</i>
                        </small>
                    </div>
                </div>
            ),
            key: "totalAttendance",
            render: (record) => (
                <div>
                    <Tag color="cyan">{record?.totalAttendance || 0}</Tag>
                </div>
            ),
            width: 130,
            align: "center",
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#F0C1E1",
                },
            }),
            title: (
                <div>
                    <div className="top-title">
                        LABORATORY EXERCISES/CASE STUDIES
                    </div>
                    <div className="points-wrapper-quiz-top">
                        {exercises.map((item, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#cc1e95" }}
                                >
                                    {i + 1}
                                </div>
                                <Tag className="tag-item" color="blue">
                                    {item?.points_possible || 0}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "exercises",
            render: (record) => {
                const studentId = parseInt(record.sid);
                return (
                    <div className="points-wrapper-quiz-top">
                        {exercises.map((item, i) => {
                            const studentScore = item?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`exercices-${item.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            width: Math.max(exercises.length * 50 + 50, 300),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#F0C1E1",
                },
            }),
            title: (
                <div>
                    <div className="top-title">TOTAL(40%)</div>
                    <div className="points-wrapper-quiz-top">
                        (
                        <span className="total-text">
                            {(() => {
                                const totalPointsPossible = exercises.reduce(
                                    (sum, quiz) =>
                                        sum + (quiz?.points_possible || 0),
                                    0
                                );
                                return totalPointsPossible;
                            })()}
                        </span>
                        )
                        <small>
                            <i>pts</i>
                        </small>
                    </div>
                </div>
            ),
            key: "totalExercises",
            dataIndex: "totalExercises",
            render: (record) => (
                <div>
                    <Tag color="cyan">{record || 0}</Tag>
                </div>
            ),
            width: 130,
            align: "center",
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#FDDBBB",
                },
            }),
            title: (
                <div>
                    <div className="top-title">ASSIGNMENTS</div>
                    <div className="points-wrapper-quiz-top">
                        {assignments.map((item, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#e17e22" }}
                                >
                                    {i + 1}
                                </div>
                                <Tag className="tag-item" color="blue">
                                    {item?.points_possible || 0}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "assignment",
            render: (record) => {
                const studentId = parseInt(record.sid);
                return (
                    <div className="points-wrapper-quiz">
                        {assignments.map((item, i) => {
                            const studentScore = item?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`exercices-${item.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            width: Math.max(assignments.length * 50 + 50, 120),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#FDDBBB",
                },
            }),
            title: (
                <div>
                    <div className="top-title">TOTAL(20%)</div>
                    <div className="points-total">
                        (
                        <span className="total-text">
                            {(() => {
                                const totalPointsPossible = assignments.reduce(
                                    (sum, quiz) =>
                                        sum + (quiz?.points_possible || 0),
                                    0
                                );
                                return totalPointsPossible;
                            })()}
                        </span>
                        )
                        <small>
                            <i>pts</i>
                        </small>
                    </div>
                </div>
            ),
            key: "totalAssigments",
            dataIndex: "totalAssigments",
            render: (record) => (
                <div>
                    <Tag color="cyan">{record || 0}</Tag>
                </div>
            ),
            width: 130,
            align: "center",
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#FFF9BF",
                },
            }),
            width: 180,
            title: (
                <div>
                    <div className="top-title">MIDTERM EXAM(30%)</div>
                    <div style={{ textAlign: "center", marginTop: 0 }}>
                        {midterm.map((item, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#cc1e95" }}
                                >
                                    &nbsp;
                                </div>
                                <Tag className="tag-item" color="blue">
                                    {item?.points_possible || 0}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "midterm",
            render: (record) => {
                const studentId = parseInt(record.sid);

                return (
                    <div style={{ textAlign: "center" }}>
                        {midterm.map((quiz, i) => {
                            const studentScore = quiz?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`quiz-${quiz.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: (
                <div>
                    <div className="top-title">MID TERM GRADE</div>
                </div>
            ),
            dataIndex: "midtermGrade",
            key: "midtermGrade",
            width: 155,
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#03A9F4",
                },
            }),
            render: (value) => {
                if (typeof value === "number" && !isNaN(value)) {
                    return getGradeTag(value); // valid grade
                }
                return value; // fallback if invalid
            },
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#CB9DF0",
                },
            }),
            title: (
                <div>
                    <div className="top-title">ATTENDANCE</div>
                    <div className="points-wrapper-quiz-top">
                        {Array.isArray(fdistinctDates) &&
                            fdistinctDates.map((date, i) => (
                                <div key={i}>
                                    <div
                                        className="item-total"
                                        style={{ color: "#7300d0" }}
                                    >
                                        {i + 1}
                                    </div>
                                    <div className="max-value">
                                        <Tag className="tag-item" color="blue">
                                            {classroom?.attendance_points}
                                        </Tag>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ),
            key: "fattendanceScores",
            render: (record) => (
                <div className="points-wrapper-score">
                    {record.fattendanceScores.map((score, i) => (
                        <div key={i} className="item-score">
                            {score !== undefined && score !== null ? (
                                <Tag className="tag-item" color="#2db7f5">
                                    {score}
                                </Tag>
                            ) : (
                                <Tag
                                    className="tag-item"
                                    icon={<SyncOutlined spin />}
                                    color="processing"
                                ></Tag>
                            )}
                        </div>
                    ))}
                </div>
            ),
            width: Math.max(fdistinctDates.length * 50 + 50, 120),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#CB9DF0",
                },
            }),
            title: (
                <div>
                    <div className="top-title"> HANDS-ON QUIZ</div>
                    <div className="points-wrapper-quiz-top">
                        {fquizes.map((quize, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#7300d0" }}
                                >
                                    {i + 1}
                                </div>
                                <div>
                                    <Tag color="blue" className="tag-item">
                                        {quize?.points_possible || 0}
                                    </Tag>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "fquiz",
            render: (record) => {
                const studentId = parseInt(record.sid);

                return (
                    <div className="points-wrapper-quiz">
                        {fquizes.map((quiz, i) => {
                            const studentScore = quiz?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`quiz-${quiz.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            width: Math.max(fquizes.length * 50 + 50, 160),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#CB9DF0",
                },
            }),
            title: (
                <div>
                    <div className="top-title">TOTAL(40%)</div>
                    <div className="points-wrapper-quiz-top">
                        (
                        <span className="total-text">
                            {(() => {
                                const totalPointsPossible = fquizes.reduce(
                                    (sum, quiz) =>
                                        sum + (quiz?.points_possible || 0),
                                    0
                                );
                                return (
                                    fdistinctDates.length *
                                        classroom?.attendance_points +
                                    totalPointsPossible
                                );
                            })()}
                        </span>
                        )
                        <small>
                            <i>pts</i>
                        </small>
                    </div>
                </div>
            ),
            key: "ftotalAttendance",
            render: (record) => (
                <div>
                    <Tag color="cyan">{record?.ftotalAttendance || 0}</Tag>
                </div>
            ),
            width: 130,
            align: "center",
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#F0C1E1",
                },
            }),
            title: (
                <div>
                    <div className="top-title">
                        LABORATORY EXERCISES/CASE STUDIES
                    </div>
                    <div className="points-wrapper-quiz-top">
                        {fexercises.map((item, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#cc1e95" }}
                                >
                                    {i + 1}
                                </div>
                                <Tag className="tag-item" color="blue">
                                    {item?.points_possible || 0}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "fexercises",
            render: (record) => {
                const studentId = parseInt(record.sid);
                return (
                    <div className="points-wrapper-quiz-top">
                        {fexercises.map((item, i) => {
                            const studentScore = item?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`exercices-${item.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            width: Math.max(fexercises.length * 50 + 50, 300),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#F0C1E1",
                },
            }),
            title: (
                <div>
                    <div className="top-title">TOTAL(40%)</div>
                    <div className="points-wrapper-quiz-top">
                        (
                        <span className="total-text">
                            {(() => {
                                const totalPointsPossible = fexercises.reduce(
                                    (sum, quiz) =>
                                        sum + (quiz?.points_possible || 0),
                                    0
                                );
                                return totalPointsPossible;
                            })()}
                        </span>
                        )
                        <small>
                            <i>pts</i>
                        </small>
                    </div>
                </div>
            ),
            key: "ftotalExercises",
            dataIndex: "ftotalExercises",
            render: (record) => (
                <div>
                    <Tag color="cyan">{record || 0}</Tag>
                </div>
            ),
            width: 130,
            align: "center",
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#FDDBBB",
                },
            }),
            title: (
                <div>
                    <div className="top-title">ASSIGNMENTS</div>
                    <div className="points-wrapper-quiz-top">
                        {fassignments.map((item, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#e17e22" }}
                                >
                                    {i + 1}
                                </div>
                                <Tag className="tag-item" color="blue">
                                    {item?.points_possible || 0}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "fassignment",
            render: (record) => {
                const studentId = parseInt(record.sid);
                return (
                    <div className="points-wrapper-quiz">
                        {fassignments.map((item, i) => {
                            const studentScore = item?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`exercices-${item.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
            width: Math.max(fassignments.length * 50 + 50, 120),
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#FDDBBB",
                },
            }),
            title: (
                <div>
                    <div className="top-title">TOTAL(20%)</div>
                    <div className="points-total">
                        (
                        <span className="total-text">
                            {(() => {
                                const totalPointsPossible = fassignments.reduce(
                                    (sum, quiz) =>
                                        sum + (quiz?.points_possible || 0),
                                    0
                                );
                                return totalPointsPossible;
                            })()}
                        </span>
                        )
                        <small>
                            <i>pts</i>
                        </small>
                    </div>
                </div>
            ),
            key: "ftotalAssigments",
            dataIndex: "ftotalAssigments",
            render: (record) => (
                <div>
                    <Tag color="cyan">{record || 0}</Tag>
                </div>
            ),
            width: 130,
            align: "center",
        },
        {
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#FFF9BF",
                },
            }),
            width: 180,
            title: (
                <div>
                    <div className="top-title">FINAL EXAM(30%)</div>
                    <div style={{ textAlign: "center", marginTop: 0 }}>
                        {finalExam.map((item, i) => (
                            <div key={i}>
                                <div
                                    className="item-total"
                                    style={{ color: "#cc1e95" }}
                                >
                                    &nbsp;
                                </div>
                                <Tag className="tag-item" color="blue">
                                    {item?.points_possible || 0}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ),
            key: "final",
            render: (record) => {
                const studentId = parseInt(record.sid);

                return (
                    <div style={{ textAlign: "center" }}>
                        {finalExam.map((quiz, i) => {
                            const studentScore = quiz?.scores?.find(
                                (s) => s.student_id === studentId
                            );
                            const displayScore = studentScore?.score;

                            return (
                                <div key={`final-${quiz.id}-${i}`}>
                                    {displayScore !== undefined ? (
                                        <Tag
                                            className="tag-item"
                                            color="#2db7f5"
                                        >
                                            {displayScore}
                                        </Tag>
                                    ) : (
                                        <Tag
                                            className="tag-item"
                                            icon={<SyncOutlined spin />}
                                            color="processing"
                                        ></Tag>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            },
        },
        {
            title: (
                <div>
                    <div className="top-title">FINAL TERM GRADE</div>
                </div>
            ),
            dataIndex: "finalGrade",
            key: "finalGrade",
            width: 155,
            align: "center",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#03A9F4",
                },
            }),
            render: (value) => {
                if (typeof value === "number" && !isNaN(value)) {
                    return getGradeTag(value); // valid grade
                }
                return value; // fallback if invalid
            },
        },
        {
            title: (
                <div>
                    <div className="top-title">FINALRATING</div>
                </div>
            ),
            dataIndex: "finalRating",
            key: "finalRating",
            width: 155,
            align: "center",
            fixed: "right",
            onHeaderCell: () => ({
                style: {
                    backgroundColor: "#8BC34A",
                },
            }),
            render: (value) => {
                if (typeof value === "number" && !isNaN(value)) {
                    return getGradeTag(value); // valid grade
                }
                return value; // fallback if invalid
            },
        },
    ];
    const columns = baseColumns.filter(
        (col) => !(role === "student" && col.key === "studentName")
    );

    const handleSubmit = async (selectedKeys, confirm, dataIndex) => {
        const hasExams = midtermCount === 0 || finalCount === 0;

        if (hasExams) {
            message.error("No midterm/final exam yet");
            return;
        }

        const grades = data.map((student) => ({
            sid: student?.sid,
            // studentName: student?.studentName,
            midterm: student?.midtermGradeScore,
            final: student?.finalGradeScore,
            finalRating: student?.finalRatingScore,
        }));
        const res = await storeAcademicRecords({ grades, id });
    };

    const getSummary = () => {
        const grades = data.map((student) => ({
            sid: student?.sid,
            //studentName: student?.studentName,
            midterm: student?.midtermGradeScore,
            final: student?.finalGradeScore,
            finalRating: student?.finalRatingScore,
        }));

        const passingScore = 3.0;
        const passed = grades.filter(
            (g) => g.finalRating <= passingScore
        ).length;
        const failed = grades.filter(
            (g) => g.finalRating > passingScore
        ).length;

        return { passed, failed };
    };

    const filteredData = useMemo(() => {
        if (!globalSearchText) return data;
        return data.filter(
            (item) =>
                item.studentName
                    .toLowerCase()
                    .includes(globalSearchText.toLowerCase()) ||
                item.studentId
                    .toLowerCase()
                    .includes(globalSearchText.toLowerCase())
        );
    }, [data, globalSearchText]);

    return (
        <Card
            title="Grade Sheet"
            extra={[
                <Input
                    placeholder="Search students..."
                    allowClear
                    value={globalSearchText}
                    onChange={(e) => setGlobalSearchText(e.target.value)}
                    style={{ width: 200, marginRight: 16 }}
                    prefix={<SearchOutlined />}
                />,
                <Button
                    type="primary"
                    disabled={midtermCount === 0 || finalCount === 0}
                    onClick={() => {
                        const { passed, failed } = getSummary();

                        Modal.confirm({
                            title: (
                                <span style={{ fontSize: "1.2em" }}>
                                    Final Grade Submission
                                </span>
                            ),
                            icon: <ExclamationCircleOutlined />,
                            content: (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <Alert
                                            message="Important Notice"
                                            type="warning"
                                            showIcon
                                            description="This action will lock grade editing for this classroom."
                                        />
                                    </div>
                                    <p>By submitting, you confirm that:</p>
                                    <ul style={{ marginBottom: 16 }}>
                                        <li>
                                            All grades are accurate and complete
                                        </li>
                                        <li>
                                            The classroom will be locked for
                                            further grade changes
                                        </li>
                                        <li>
                                            Grades will be{" "}
                                            <strong>
                                                pending admin approval
                                            </strong>{" "}
                                            before students can view them
                                        </li>
                                        <li>This action is irreversible</li>
                                    </ul>

                                    <p style={{ marginTop: 16 }}>
                                        <strong>Grade Summary:</strong>
                                        <br />✅ Passed:{" "}
                                        <strong>{passed}</strong>
                                        <br />❌ Failed:{" "}
                                        <strong>{failed}</strong>
                                    </p>

                                    <p
                                        style={{
                                            fontStyle: "italic",
                                            marginTop: 8,
                                        }}
                                    >
                                        A notification will be sent to the
                                        administrator for approval.
                                    </p>
                                </div>
                            ),
                            okText: "Submit for Approval",
                            cancelText: "Cancel",
                            okButtonProps: {
                                danger: true,
                                style: { fontWeight: "bold" },
                            },
                            cancelButtonProps: {
                                style: { borderColor: "#1890ff" },
                            },
                            width: 650,
                            centered: true,
                            onOk: () => handleSubmit(),
                        });
                    }}
                >
                    <FileDoneOutlined /> Submit Final Grades
                </Button>,
            ]}
        >
            <Table
                loading={isLoading}
                columns={columns}
                dataSource={filteredData}
                bordered
                size="middle"
                scroll={{ x: "max-content", y: 420 }}
                pagination={false}
                style={{ margin: 0 }}
            />
        </Card>
    );
};

export default StudentGradeSheet;
