// AttendanceDetails.js
import React from "react";
import { Modal, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useClassroomStore from "~/states/classroomState";
import { formatDate } from "~/utils/helper"
import { useParams } from "react-router-dom";
import useAttendanceDetails from "~/hooks/useAttendanceDetails";


const AttendanceDetails = () => {
    const { setField, attendanceDetails, attendanceCurrent } = useClassroomStore();
    const { id } = useParams();
    const { data: attendance = [], isFetching } = useAttendanceDetails(id, attendanceCurrent);
    
    return (
        <Modal
            title={`Attendance Details (${formatDate(attendanceCurrent)})`}
            open={attendanceDetails}
            width={1000}
            onCancel={()=>setField("attendanceDetails", false) }
            footer={null}
        ></Modal>
    );
};

export default AttendanceDetails;
