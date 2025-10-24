import { useState } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pdfjs } from "react-pdf";
import { Button, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useClassroomStore from "~/states/classroomState";
import { useParams } from "react-router-dom";
import useClassRoomSettings from "~/hooks/useClassRoomSettings";
import { CLASSWORK_ATTACHMENT } from "~/utils/constant";

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function PDFSyllabusUpdater() {
    const { id } = useParams();
    const { updateCourseSyllabus } = useClassroomStore();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const {
        isLoading: loadingSettings,
        data: classroom,
        refetch: refetchSettings,
    } = useClassRoomSettings(id);

    const handleChange = (info) => {
        const uploadFile = info?.fileList[0]?.originFileObj;
        if (info.file.status === "removed") {
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        if (!uploadFile) return;

        const isPDF = uploadFile.type === "application/pdf";
        if (!isPDF) {
            message.error("You can only upload PDF files!");
            return;
        }
        console.log("uploadFile --->", uploadFile);

        setFile(uploadFile);
        setPreviewUrl(URL.createObjectURL(uploadFile));
        setIsModalVisible(true);
        message.success(`${uploadFile.name} ready for review`);
    };

    const handleCancel = () => {
        setFile(null);
        setPreviewUrl(null);
        setIsModalVisible(false);
    };

    const handleUpdate = async () => {
        if (!file) {
            message.error("No file selected");
            return;
        }

        try {
            setIsUploading(true);
            await updateCourseSyllabus({ id, file });
            message.success("Syllabus updated successfully!");
            refetchSettings();
            setFile(null);
            setPreviewUrl(null);
            setIsModalVisible(false);
        } catch (err) {
            message.error("Failed to update syllabus.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <Upload
                accept=".pdf"
                showUploadList={false}
                beforeUpload={() => false} // Prevent automatic upload
                onChange={handleChange}
            >
                <Button icon={<UploadOutlined />}>Update Syllabus</Button>
            </Upload>

            {classroom?.syllabus && (
                <div style={{ height: "100vh", marginTop: "20px" }}>
                    <Viewer
                        fileUrl={`${CLASSWORK_ATTACHMENT}${classroom?.syllabus}`}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={1}
                    />
                </div>
            )}

            <Modal
                title="Review Syllabus Update"
                width="90%"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={isUploading}
                        onClick={handleUpdate}
                    >
                        Confirm Update
                    </Button>,
                ]}
            >
                <div style={{ height: "70vh" }}>
                    {previewUrl && (
                        <Viewer
                            fileUrl={previewUrl}
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default PDFSyllabusUpdater;
