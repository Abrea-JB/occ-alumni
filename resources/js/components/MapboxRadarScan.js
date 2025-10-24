import React, { useState, useMemo, useRef, useEffect } from "react";
import { Input, Table, Tag, Modal, Button, Slider, Alert, Form, Card, Space } from "antd";
import {
    SearchOutlined,
    UserOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    UndoOutlined,
    RadarChartOutlined,
    EnvironmentOutlined,
    CompassOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { TextArea } = Input;

export default function RadarScanModal({ isOpen, onClose }) {
    // Classroom dimensions: Typical classroom is about 10m x 8m
    const CLASSROOM_LENGTH = 10; // meters
    const CLASSROOM_WIDTH = 8; // meters

    // Teacher position (front center of classroom)
    const TEACHER_POSITION = { x: CLASSROOM_WIDTH / 2, y: 1 }; // Front center

    const sampleProfiles = [
        {
            id: 1,
            name: "Alex Chen",
            position: { x: 2.5, y: 2 }, // meters from front-left corner
            note: "Front row, left side",
            status: "present",
            lastActive: "2 min ago",
        },
        {
            id: 2,
            name: "Maya Rivera",
            position: { x: 6.5, y: 7 },
            note: "Back corner, right side",
            status: "present",
            lastActive: "5 min ago",
        },
        {
            id: 3,
            name: "Sam O'Neil",
            position: { x: 4, y: 5 },
            note: "Middle center",
            status: "active",
            lastActive: "Just now",
        },
        {
            id: 4,
            name: "Jordan Lee",
            position: { x: 1.5, y: 6.5 },
            note: "Back left corner",
            status: "present",
            lastActive: "1 min ago",
        },
        {
            id: 5,
            name: "Taylor Kim",
            position: { x: 4, y: 1.5 },
            note: "Front center, near teacher",
            status: "active",
            lastActive: "Just now",
        },
        {
            id: 6,
            name: "Casey Smith",
            position: { x: 7, y: 3 },
            note: "Middle right side",
            status: "present",
            lastActive: "3 min ago",
        },
    ];

    const [filterLocal, setFilterLocal] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentDetailVisible, setStudentDetailVisible] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [radarSize, setRadarSize] = useState(450);

    // Location states
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualLocation, setManualLocation] = useState({ lat: "", lng: "" });
    const [locationVerified, setLocationVerified] = useState(false);
    const [showGoogleMaps, setShowGoogleMaps] = useState(false);

    const radarRef = useRef(null);
    const [form] = Form.useForm();

    // Get current location
    const getLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setShowManualInput(true);
            return;
        }

        setLoading(true);
        setError(null);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setError(null);
                setLoading(false);
                setLocationVerified(true);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Permission denied. Please allow location access or enter manually.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information is unavailable. Please enter manually.");
                        break;
                    case err.TIMEOUT:
                        setError("Request timed out. Please try again or enter manually.");
                        break;
                    default:
                        setError("An unknown error occurred. Please enter location manually.");
                }
                setLoading(false);
                setShowManualInput(true);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    // Manual location submission
    const handleManualLocationSubmit = (values) => {
        const { lat, lng } = values;
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        
        if (isNaN(latNum) || isNaN(lngNum)) {
            setError("Please enter valid latitude and longitude numbers.");
            return;
        }
        
        if (latNum < -90 || latNum > 90) {
            setError("Latitude must be between -90 and 90.");
            return;
        }
        
        if (lngNum < -180 || lngNum > 180) {
            setError("Longitude must be between -180 and 180.");
            return;
        }

        setLocation({ lat: latNum, lng: lngNum });
        setManualLocation({ lat: latNum.toString(), lng: lngNum.toString() });
        setError(null);
        setLocationVerified(true);
        setShowManualInput(false);
    };

    // Open Google Maps for location picking
    const openGoogleMaps = () => {
        const mapsUrl = "https://www.google.com/maps";
        window.open(mapsUrl, "_blank");
        setShowGoogleMaps(true);
    };

    // Get location from Google Maps
    const getLocationFromMaps = () => {
        setShowManualInput(true);
        setShowGoogleMaps(false);
        // In a real app, you would integrate Google Maps API here
        // For now, we'll just show the manual input form
    };

    // Reset location and start over
    const resetLocation = () => {
        setLocation(null);
        setLocationVerified(false);
        setShowManualInput(false);
        setError(null);
        setManualLocation({ lat: "", lng: "" });
        getLocation(); // Try to get location again
    };

    // Initialize location when modal opens
    useEffect(() => {
        if (isOpen && !locationVerified) {
            getLocation();
        }
    }, [isOpen, locationVerified]);

    // Calculate real distances and angles based on classroom coordinates
    const profilesWithCalculations = useMemo(() => {
        return sampleProfiles.map((student) => {
            const dx = student.position.x - TEACHER_POSITION.x;
            const dy = student.position.y - TEACHER_POSITION.y;
            const actualDistance = Math.sqrt(dx * dx + dy * dy);

            const maxDistance = Math.sqrt(
                Math.pow(CLASSROOM_WIDTH, 2) + Math.pow(CLASSROOM_LENGTH, 2)
            );
            const distancePercentage = Math.min(actualDistance / maxDistance, 1);

            let angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
            angle = (angle + 90) % 360;

            let zone = "far";
            if (actualDistance <= 3) zone = "near";
            else if (actualDistance <= 6) zone = "middle";

            return {
                ...student,
                actualDistance,
                distancePercentage,
                angle,
                zone,
            };
        });
    }, []);

    // Cyan color palette
    const colors = {
        primary: "#06b6d4",
        primaryLight: "#22d3ee",
        primaryDark: "#0891b2",
        background: "#f0fdff",
        backgroundLight: "#fafefe",
        text: "#164e63",
        textLight: "#0e7490",
        border: "#a5f3fc",
        sweep: "rgba(6, 182, 212, 0.4)",
        pulse: "rgba(6, 182, 212, 0.3)",
    };

    const toXY = (angleDeg, distFrac, size = 250) => {
        const r = (size / 2 - 30) * distFrac;
        const theta = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: size / 2 + r * Math.cos(theta),
            y: size / 2 + r * Math.sin(theta),
        };
    };

    // Zoom functions
    const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => {
        setZoomLevel(1);
        setRadarSize(250);
    };
    const handleZoomChange = (value) => {
        setZoomLevel(value);
        setRadarSize(250 * value);
    };

    // Filter students
    const filteredProfiles = useMemo(() => {
        let filtered = profilesWithCalculations.filter(
            (student) =>
                student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                student.note.toLowerCase().includes(searchText.toLowerCase())
        );

        if (filterLocal) {
            filtered = filtered.filter((student) => student.zone === "near");
        }

        return filtered;
    }, [searchText, filterLocal, profilesWithCalculations]);

    const visibleProfiles = filterLocal
        ? profilesWithCalculations.filter((student) => student.zone === "near")
        : profilesWithCalculations;

    // Ant Design Table columns
    const columns = [
        {
            title: "Student",
            dataIndex: "name",
            key: "name",
            render: (name, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: activeId === record.id ? colors.primary : colors.primaryDark,
                    }} />
                    <UserOutlined style={{ color: colors.textLight }} />
                    <span style={{ fontWeight: 500 }}>{name}</span>
                </div>
            ),
        },
        {
            title: "Position",
            dataIndex: "note",
            key: "note",
            render: (note) => <span style={{ color: colors.textLight }}>{note}</span>,
        },
        {
            title: "Distance",
            dataIndex: "actualDistance",
            key: "distance",
            render: (distance) => (
                <Tag color={distance <= 3 ? "green" : distance <= 6 ? "blue" : "orange"}>
                    {distance.toFixed(1)}m
                </Tag>
            ),
        },
        {
            title: "Zone",
            dataIndex: "zone",
            key: "zone",
            render: (zone) => (
                <Tag color={zone === "near" ? "green" : zone === "middle" ? "blue" : "orange"}>
                    {zone.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === "active" ? "green" : status === "present" ? "blue" : "red"}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <a onClick={() => { setSelectedStudent(record); setStudentDetailVisible(true); }} style={{ color: colors.primary }}>
                    View Details
                </a>
            ),
        },
    ];

    if (!isOpen) return null;

    // Location Setup Screen
    if (!locationVerified) {
        return (
            <Modal
                title={
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ 
                            margin: 0, 
                            color: colors.text,
                            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            <EnvironmentOutlined style={{ color: "#06b6d4" }} /> Location Setup
                        </h2>
                        <p style={{ margin: "4px 0 0 0", color: colors.textLight }}>
                            We need your location to set up the classroom radar
                        </p>
                    </div>
                }
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={600}
                centered
            >
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <CompassOutlined style={{ fontSize: 64, color: colors.primary, marginBottom: 20 }} />
                    
                    {loading && (
                        <Alert
                            message="Getting your location..."
                            description="Please allow location access when prompted."
                            type="info"
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    {error && (
                        <Alert
                            message="Location Access Required"
                            description={error}
                            type="warning"
                            showIcon
                            style={{ marginBottom: 20 }}
                        />
                    )}

                    {showManualInput ? (
                        <Card title="Enter Location Manually" style={{ marginBottom: 20 }}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleManualLocationSubmit}
                                initialValues={manualLocation}
                            >
                                <Form.Item
                                    name="lat"
                                    label="Latitude"
                                    rules={[
                                        { required: true, message: 'Please enter latitude' },
                                        { pattern: /^-?\d+(\.\d+)?$/, message: 'Please enter a valid number' }
                                    ]}
                                >
                                    <Input placeholder="e.g., 40.7128" prefix="📍" />
                                </Form.Item>
                                
                                <Form.Item
                                    name="lng"
                                    label="Longitude"
                                    rules={[
                                        { required: true, message: 'Please enter longitude' },
                                        { pattern: /^-?\d+(\.\d+)?$/, message: 'Please enter a valid number' }
                                    ]}
                                >
                                    <Input placeholder="e.g., -74.0060" prefix="📍" />
                                </Form.Item>
                                
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    <Button type="primary" htmlType="submit" block>
                                        Use These Coordinates
                                    </Button>
                                    <Button onClick={openGoogleMaps} block icon={<EnvironmentOutlined />}>
                                        Open Google Maps to Find Location
                                    </Button>
                                    <Button onClick={resetLocation} block>
                                        Try Auto-Detect Again
                                    </Button>
                                </Space>
                            </Form>
                        </Card>
                    ) : (
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Button 
                                type="primary" 
                                size="large" 
                                onClick={getLocation}
                                loading={loading}
                                icon={<EnvironmentOutlined />}
                                style={{ width: '100%', height: 50 }}
                            >
                                {loading ? "Detecting Location..." : "Auto-Detect My Location"}
                            </Button>
                            
                            <Button 
                                size="large" 
                                onClick={() => setShowManualInput(true)}
                                icon={<CompassOutlined />}
                                style={{ width: '100%', height: 50 }}
                            >
                                Enter Location Manually
                            </Button>
                        </Space>
                    )}

                    <div style={{ marginTop: 20, fontSize: 12, color: colors.textLight }}>
                        <p>Your location helps us optimize the classroom radar display.</p>
                        <p>You can always change this later in settings.</p>
                    </div>
                </div>
            </Modal>
        );
    }

    // Main Radar Screen
    return (
        <>
            <Modal
                title={
                    <div style={{ textAlign: "center" }}>
                        <h2 style={{ 
                            margin: 0, 
                            color: colors.text,
                            background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}>
                            <RadarChartOutlined style={{ color: "#06b6d4" }} /> Classroom Radar
                        </h2>
                        <p style={{ margin: "4px 0 0 0", color: colors.textLight }}>
                            Real-time positioning • Location: {location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}
                        </p>
                    </div>
                }
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={"90%"}
                style={{ top: 20 }}
                bodyStyle={{ padding: "24px" }}
            >
                {/* Location Info Banner */}
                <Alert
                    message="Location Verified"
                    description={`Using coordinates: ${location?.lat?.toFixed(6)}, ${location?.lng?.toFixed(6)}`}
                    type="success"
                    showIcon
                    action={
                        <Button size="small" onClick={resetLocation}>
                            Change Location
                        </Button>
                    }
                    style={{ marginBottom: 16 }}
                />

                {/* Search and Filter Section */}
                <div style={{ marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
                    <Search
                        placeholder="Search students by name or position..."
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 350 }}
                        prefix={<SearchOutlined style={{ color: colors.textLight }} />}
                    />

                    <button
                        onClick={() => setFilterLocal((prev) => !prev)}
                        style={{
                            padding: "8px 16px",
                            border: `1px solid ${colors.border}`,
                            borderRadius: "6px",
                            background: filterLocal ? colors.primary : "white",
                            color: filterLocal ? "white" : colors.text,
                            cursor: "pointer",
                            fontWeight: "500",
                        }}
                    >
                        {filterLocal ? "Near Zone Only (≤3m)" : "All Zones"}
                    </button>
                </div>

                {/* Classroom Info */}
                <div style={{
                    marginBottom: 16,
                    padding: "12px",
                    background: "rgba(6, 182, 212, 0.05)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: colors.textLight,
                }}>
                    <strong>Classroom Layout:</strong> {CLASSROOM_WIDTH}m wide × {CLASSROOM_LENGTH}m deep • 
                    <strong> Zones:</strong> Near (0-3m) • Middle (3-6m) • Far (6m+)
                </div>

                {/* Main Content Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "500px 1fr", gap: 24 }}>
                    
                    {/* Left Column - Radar Visualization */}
                    <div>
                        {/* Zoom Controls */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 16,
                            padding: "8px 12px",
                            background: "rgba(6, 182, 212, 0.05)",
                            borderRadius: "6px",
                        }}>
                            <span style={{ fontSize: "12px", color: colors.text, fontWeight: "500" }}>
                                Zoom: {Math.round(zoomLevel * 100)}%
                            </span>

                            <Button icon={<ZoomOutOutlined />} size="small" onClick={zoomOut} disabled={zoomLevel <= 0.5} />
                            <Slider min={0.5} max={3} step={0.1} value={zoomLevel} onChange={handleZoomChange} style={{ flex: 1, margin: "0 8px" }} />
                            <Button icon={<ZoomInOutlined />} size="small" onClick={zoomIn} disabled={zoomLevel >= 3} />
                            <Button icon={<UndoOutlined />} size="small" onClick={resetZoom}>Reset</Button>
                        </div>

                        {/* Radar Container */}
                        <div ref={radarRef} style={{
                            position: "relative",
                            width: "100%",
                            height: Math.min(radarSize + 60, 500),
                            overflow: "auto",
                            border: `1px solid ${colors.border}`,
                            borderRadius: "8px",
                            padding: "20px",
                            background: colors.backgroundLight,
                        }}>
                            <div style={{
                                position: "relative",
                                width: radarSize,
                                height: radarSize,
                                borderRadius: "50%",
                                background: colors.background,
                                border: `2px solid ${colors.border}`,
                                margin: "0 auto",
                                boxShadow: "0 4px 12px rgba(6, 182, 212, 0.1)",
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: "center center",
                            }}>
                                {/* Radar content remains the same */}
                                {[
                                    { radius: 0.3, label: "Near", color: "rgba(34, 197, 94, 0.1)" },
                                    { radius: 0.6, label: "Middle", color: "rgba(59, 130, 246, 0.1)" },
                                    { radius: 1.0, label: "Far", color: "rgba(249, 115, 22, 0.1)" },
                                ].map((zone, index) => (
                                    <div key={index} style={{
                                        position: "absolute", left: "50%", top: "50%",
                                        width: `${zone.radius * 100}%`, height: `${zone.radius * 100}%`,
                                        border: `1px dashed ${zone.radius === 0.3 ? "#22c55e" : zone.radius === 0.6 ? "#3b82f6" : "#f97316"}`,
                                        borderRadius: "50%", transform: "translate(-50%, -50%)", background: zone.color, opacity: 0.4,
                                    }} />
                                ))}

                                <div style={{
                                    position: "absolute", inset: 0, borderRadius: "50%",
                                    background: `conic-gradient(transparent, ${colors.sweep}, transparent 40%)`,
                                    animation: "radarSpin 3s linear infinite", opacity: 0.7,
                                }} />

                                <div style={{
                                    position: "absolute", left: "50%", top: "50%",
                                    width: Math.max(16 * zoomLevel, 12), height: Math.max(16 * zoomLevel, 12),
                                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                    borderRadius: "50%", transform: "translate(-50%, -50%)", border: "2px solid white",
                                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)", zIndex: 5,
                                }} />

                                {/* Student dots */}
                                {visibleProfiles.map((student) => {
                                    const { x, y } = toXY(student.angle, student.distancePercentage, radarSize);
                                    const isActive = activeId === student.id;
                                    return (
                                        <div key={student.id} className={`blip ${isActive ? "active" : ""}`}
                                            style={{
                                                position: "absolute", left: x, top: y,
                                                width: Math.max(12 * zoomLevel, 8), height: Math.max(12 * zoomLevel, 8),
                                                background: student.zone === "near" ? "#22c55e" : student.zone === "middle" ? "#3b82f6" : "#f97316",
                                                borderRadius: "50%", transform: "translate(-50%, -50%)", cursor: "pointer",
                                                border: "2px solid white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 10,
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseEnter={() => setActiveId(student.id)}
                                            onMouseLeave={() => setActiveId(null)}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {/* Radar Legend */}
                        <div style={{ marginTop: 16, textAlign: "center", fontSize: "12px" }}>
                            <div style={{ color: colors.textLight, marginBottom: "8px" }}>
                                {filteredProfiles.length} students • Zoom: {Math.round(zoomLevel * 100)}%
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", gap: "12px", fontSize: "10px" }}>
                                <span style={{ color: "#22c55e" }}>● Near (0-3m)</span>
                                <span style={{ color: "#3b82f6" }}>● Middle (3-6m)</span>
                                <span style={{ color: "#f97316" }}>● Far (6m+)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Student Table */}
                    <div>
                        <Table
                            columns={columns}
                            dataSource={filteredProfiles.map((profile) => ({ ...profile, key: profile.id }))}
                            pagination={false}
                            size="small"
                            onRow={(record) => ({
                                onMouseEnter: () => setActiveId(record.id),
                                onMouseLeave: () => setActiveId(null),
                                style: { background: activeId === record.id ? "rgba(6, 182, 212, 0.05)" : "transparent", cursor: "pointer" },
                            })}
                            scroll={{ y: 400 }}
                        />
                    </div>
                </div>
            </Modal>

            {/* Student Detail Modal */}
            <Modal
                title={`Student Details - ${selectedStudent?.name}`}
                open={studentDetailVisible}
                onCancel={() => setStudentDetailVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setStudentDetailVisible(false)} type="primary">
                        Close
                    </Button>,
                ]}
            >
                {selectedStudent && (
                    <div style={{ lineHeight: 2 }}>
                        <p><strong>Name:</strong> {selectedStudent.name}</p>
                        <p><strong>Position:</strong> {selectedStudent.note}</p>
                        <p><strong>Coordinates:</strong> ({selectedStudent.position.x.toFixed(1)}m, {selectedStudent.position.y.toFixed(1)}m)</p>
                        <p><strong>Distance from Teacher:</strong> {selectedStudent.actualDistance.toFixed(1)} meters</p>
                        <p><strong>Zone:</strong>
                            <Tag color={selectedStudent.zone === "near" ? "green" : selectedStudent.zone === "middle" ? "blue" : "orange"} style={{ marginLeft: 8 }}>
                                {selectedStudent.zone.toUpperCase()} ZONE
                            </Tag>
                        </p>
                        <p><strong>Status:</strong>
                            <Tag color={selectedStudent.status === "active" ? "green" : selectedStudent.status === "present" ? "blue" : "red"} style={{ marginLeft: 8 }}>
                                {selectedStudent.status}
                            </Tag>
                        </p>
                        <p><strong>Last Active:</strong> {selectedStudent.lastActive}</p>
                    </div>
                )}
            </Modal>

            {/* CSS Styles */}
            <style>{`
                @keyframes radarSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulseCyan {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
                    70% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                    100% { opacity: 0; }
                }
                .blip.active::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: ${colors.pulse};
                    transform: translate(-50%, -50%);
                    animation: pulseCyan 2s infinite;
                    z-index: -1;
                }
                .blip { transition: all 0.3s ease; }
                .blip:hover { transform: translate(-50%, -50%) scale(1.2); }
            `}</style>
        </>
    );
}