"use client"

import React, { useState } from "react"
import { Form, Input, Alert, Row, Col, Modal } from "antd"
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  UserOutlined,
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons"
import { useLoginStore } from "~/states/loginState"
import shallow from "zustand/shallow"
import { Button } from "./index"
import logo from "~/assets/images/site-logo.png"
import bgImage from "~/assets/images/OCC_IMAGE.jpg"

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api"

const Formlogin = () => {
  const [error, isSubmit, submitForm] = useLoginStore(
    (state) => [state.error, state.isSubmit, state.checkLogin],
    shallow,
  )
  const urlParams = new URLSearchParams(window.location.search)
  const type = urlParams.get("type")

  // Password Reset States
  const [currentView, setCurrentView] = useState("login") // login, forgot-password, find-user, reset-password
  const [forgotEmail, setForgotEmail] = useState("")
  const [foundUser, setFoundUser] = useState(null)
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [forgotError, setForgotError] = useState("")

  const [resetToken, setResetToken] = useState("")

  // Reset Password States
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleRegisterRedirect = () => {
    window.location.href = "/register"
  }

  // Mask email helper function
  const maskEmail = (email) => {
    if (!email) return ""
    const [localPart, domain] = email.split("@")
    const maskedLocal =
      localPart.charAt(0) + "*".repeat(Math.max(localPart.length - 2, 1)) + localPart.charAt(localPart.length - 1)
    return `${maskedLocal}@${domain}`
  }

  // Mask name helper function
  const maskName = (name) => {
    if (!name) return ""
    const parts = name.split(" ")
    return parts
      .map((part) => {
        if (part.length <= 1) return part
        return part.charAt(0) + "*".repeat(part.length - 1)
      })
      .join(" ")
  }

  const handleFindAccount = async () => {
    if (!forgotEmail) {
      setForgotError("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotEmail)) {
      setForgotError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setForgotError("")

    try {
      const response = await fetch(`${API_BASE_URL}/password/find-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFoundUser({
          fullName: data.data.full_name,
          email: data.data.email,
        })
        setCurrentView("find-user")
      } else {
        setForgotError(data.message || "No account found with this email address")
      }
    } catch (error) {
      console.error("Find account error:", error)
      setForgotError("Unable to connect to server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendResetLink = async () => {
    setIsLoading(true)
    setForgotError("")

    try {
      const response = await fetch(`${API_BASE_URL}/password/send-reset-link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setEmailSent(true)
      } else {
        setForgotError(data.message || "Failed to send reset link. Please try again.")
      }
    } catch (error) {
      console.error("Send reset link error:", error)
      setForgotError("Unable to connect to server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setForgotError("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match")
      return
    }

    if (!isPasswordValid()) {
      setForgotError("Password does not meet requirements")
      return
    }

    setIsLoading(true)
    setForgotError("")

    try {
      const response = await fetch(`${API_BASE_URL}/password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
          token: resetToken,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResetSuccess(true)
      } else {
        setForgotError(data.message || "Failed to reset password. The link may have expired.")
      }
    } catch (error) {
      console.error("Reset password error:", error)
      setForgotError("Unable to connect to server. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Password validation functions
  const hasMinLength = newPassword.length >= 8
  const hasUppercase = /[A-Z]/.test(newPassword)
  const hasLowercase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  const isPasswordValid = () => {
    return hasMinLength && hasUppercase && hasLowercase && hasNumber
  }

  // Calculate password strength
  const getPasswordStrength = () => {
    let strength = 0
    if (hasMinLength) strength++
    if (hasUppercase) strength++
    if (hasLowercase) strength++
    if (hasNumber) strength++

    if (strength <= 1) return { label: "Weak", color: "#ff4d4f", percent: 25 }
    if (strength === 2) return { label: "Fair", color: "#faad14", percent: 50 }
    if (strength === 3) return { label: "Good", color: "#52c41a", percent: 75 }
    return { label: "Strong", color: "#52c41a", percent: 100 }
  }

  const passwordStrength = getPasswordStrength()

  // Handle back to login
  const handleBackToLogin = () => {
    setCurrentView("login")
    setForgotEmail("")
    setFoundUser(null)
    setEmailSent(false)
    setForgotError("")
    setNewPassword("")
    setConfirmPassword("")
    setResetToken("")
    // Clear URL params
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  // Handle Try Again
  const handleTryAgain = () => {
    setCurrentView("forgot-password")
    setFoundUser(null)
    setEmailSent(false)
    setForgotError("")
  }

  // Success Modal Close Handler
  const handleSuccessModalClose = () => {
    setResetSuccess(false)
    handleBackToLogin()
  }

  const formContainerStyle = {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "24px 20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    maxHeight: "none",
    overflow: "visible",
  }

  const renderForgotPasswordForm = () => (
    <div className="form" style={{ maxWidth: 400, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src={logo || "/placeholder.svg"} alt="OCC Logo" style={{ marginBottom: 15, maxWidth: "80px" }} />
      </div>

      <div style={formContainerStyle}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 6,
            color: "#1a1a2e",
          }}
        >
          Forgot Password?
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 20,
            fontSize: 13,
          }}
        >
          No worries! Enter your Gmail and we'll help you recover your account.
        </p>

        {forgotError && <Alert message={forgotError} type="error" showIcon style={{ marginBottom: 15 }} />}

        <div style={{ marginBottom: 15 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontWeight: 600,
              color: "#1a1a2e",
              fontSize: 14,
            }}
          >
            Gmail Address <span style={{ color: "#ff4d4f" }}>*</span>
          </label>
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Enter your gmail"
            size="large"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            onPressEnter={handleFindAccount}
            style={{
              borderRadius: 8,
              height: 45,
            }}
          />
        </div>

        <Button
          type="primary"
          loading={isLoading}
          onClick={handleFindAccount}
          label={
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <UserOutlined />
              Find My Account
            </span>
          }
          style={{
            width: "100%",
            height: 45,
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 8,
            backgroundColor: "#4f6ef7",
            border: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "18px 0",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, backgroundColor: "#e8e8e8" }} />
          <span style={{ color: "#999", fontSize: 13 }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e8e8e8" }} />
        </div>

        <p style={{ textAlign: "center", color: "#666", marginBottom: 15, fontSize: 14 }}>
          Remember your password?{" "}
          <a
            onClick={handleBackToLogin}
            style={{
              color: "#1890ff",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Sign in here
          </a>
        </p>

        {/* Tip Box */}
        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: 8,
            padding: 10,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
            💡 <strong>Tip:</strong> Your Gmail is the email you use to log in to the system
          </p>
        </div>
      </div>
    </div>
  )

  const renderFindUserForm = () => (
    <div className="form" style={{ maxWidth: 400, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src={logo || "/placeholder.svg"} alt="OCC Logo" style={{ marginBottom: 15, maxWidth: "80px" }} />
      </div>

      <div style={formContainerStyle}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 6,
            color: "#1a1a2e",
          }}
        >
          Forgot Password?
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 15,
            fontSize: 13,
          }}
        >
          We'll send a secure password reset link to your registered email.
        </p>

        {forgotError && <Alert message={forgotError} type="error" showIcon style={{ marginBottom: 12 }} />}

        {/* Email Sent Success Banner */}
        {emailSent && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircleFilled style={{ color: "#22c55e", fontSize: 16 }} />
            <span style={{ color: "#166534", fontWeight: 500, fontSize: 13 }}>
              We have emailed your password reset link!
            </span>
          </div>
        )}

        {/* Account Found Box */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <CheckCircleFilled style={{ color: "#22c55e", fontSize: 18, marginTop: 2 }} />
            <div>
              <p style={{ fontWeight: 700, margin: 0, color: "#166534", fontSize: 14 }}>Account Found!</p>
              <p style={{ margin: "3px 0 0 0", color: "#166534", fontSize: 13 }}>{maskName(foundUser?.fullName)}</p>
              <p
                style={{
                  margin: "2px 0 0 0",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13,
                }}
              >
                <MailOutlined /> {maskEmail(foundUser?.email)}
              </p>
            </div>
          </div>
        </div>

        {/* Ready to Reset Box */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 12,
            marginBottom: 15,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div
              style={{
                backgroundColor: "#dbeafe",
                borderRadius: 8,
                padding: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MailOutlined style={{ color: "#3b82f6", fontSize: 16 }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, margin: 0, color: "#1a1a2e", fontSize: 13 }}>
                Ready to reset your password?
              </p>
              <p style={{ margin: "3px 0 0 0", color: "#666", fontSize: 12 }}>
                Click the button below to receive a secure reset link via email. The link will expire in 60 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <button
            onClick={handleTryAgain}
            style={{
              flex: 1,
              height: 42,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 8,
              backgroundColor: "#fff",
              border: "1px solid #d9d9d9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            ← Try Again
          </button>
          <Button
            type="primary"
            loading={isLoading}
            onClick={handleSendResetLink}
            disabled={emailSent}
            label={
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <MailOutlined />
                {emailSent ? "Link Sent" : "Send Reset Link"}
              </span>
            }
            style={{
              flex: 1.2,
              height: 42,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 8,
              backgroundColor: emailSent ? "#9ca3af" : "#3b82f6",
              border: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "15px 0",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, backgroundColor: "#e8e8e8" }} />
          <span style={{ color: "#999", fontSize: 13 }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e8e8e8" }} />
        </div>

        <p style={{ textAlign: "center", color: "#666", marginBottom: 0, fontSize: 14 }}>
          Remember your password?{" "}
          <a
            onClick={handleBackToLogin}
            style={{
              color: "#1890ff",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )

  const renderResetPasswordForm = () => (
    <div className="form" style={{ maxWidth: 400, width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src={logo || "/placeholder.svg"} alt="OCC Logo" style={{ marginBottom: 15, maxWidth: "80px" }} />
      </div>

      <div style={formContainerStyle}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 4,
            color: "#1a1a2e",
          }}
        >
          Create New Password
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: 18,
            fontSize: 13,
          }}
        >
          Set up a strong and secure password for your account
        </p>

        {forgotError && <Alert message={forgotError} type="error" showIcon style={{ marginBottom: 12 }} />}

        {/* New Password Field */}
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: "block",
              marginBottom: 5,
              fontWeight: 600,
              color: "#1a1a2e",
              fontSize: 13,
            }}
          >
            New Password <span style={{ color: "#ff4d4f" }}>*</span>
          </label>
          <Input
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            suffix={
              <span onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: "pointer" }}>
                {showNewPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            }
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter new password"
            size="large"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              borderRadius: 8,
              height: 42,
            }}
          />

          {/* Password Strength */}
          {newPassword && (
            <div style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: "#666" }}>Password strength:</span>
                <span style={{ fontSize: 11, color: passwordStrength.color, fontWeight: 600 }}>
                  {passwordStrength.label}
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  backgroundColor: "#e8e8e8",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${passwordStrength.percent}%`,
                    backgroundColor: passwordStrength.color,
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: "block",
              marginBottom: 5,
              fontWeight: 600,
              color: "#1a1a2e",
              fontSize: 13,
            }}
          >
            Confirm Password <span style={{ color: "#ff4d4f" }}>*</span>
          </label>
          <Input
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            suffix={
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: "pointer" }}>
                {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            }
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            size="large"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              borderRadius: 8,
              height: 42,
            }}
          />

          {/* Passwords Match Indicator */}
          {confirmPassword && (
            <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
              {passwordsMatch ? (
                <>
                  <CheckCircleFilled style={{ color: "#22c55e", fontSize: 13 }} />
                  <span style={{ color: "#22c55e", fontSize: 12 }}>Passwords match</span>
                </>
              ) : (
                <>
                  <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 13 }} />
                  <span style={{ color: "#ff4d4f", fontSize: 12 }}>Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Password Requirements Box */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 10,
            marginBottom: 15,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <LockOutlined style={{ color: "#3b82f6", fontSize: 13 }} />
            <span style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 12 }}>Password Requirements</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {hasMinLength ? (
                <CheckCircleFilled style={{ color: "#22c55e", fontSize: 12 }} />
              ) : (
                <CloseCircleFilled style={{ color: "#d9d9d9", fontSize: 12 }} />
              )}
              <span style={{ color: hasMinLength ? "#22c55e" : "#666", fontSize: 11 }}>8+ characters</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {hasUppercase ? (
                <CheckCircleFilled style={{ color: "#22c55e", fontSize: 12 }} />
              ) : (
                <CloseCircleFilled style={{ color: "#d9d9d9", fontSize: 12 }} />
              )}
              <span style={{ color: hasUppercase ? "#22c55e" : "#666", fontSize: 11 }}>Uppercase (A-Z)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {hasLowercase ? (
                <CheckCircleFilled style={{ color: "#22c55e", fontSize: 12 }} />
              ) : (
                <CloseCircleFilled style={{ color: "#d9d9d9", fontSize: 12 }} />
              )}
              <span style={{ color: hasLowercase ? "#22c55e" : "#666", fontSize: 11 }}>Lowercase (a-z)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {hasNumber ? (
                <CheckCircleFilled style={{ color: "#22c55e", fontSize: 12 }} />
              ) : (
                <CloseCircleFilled style={{ color: "#d9d9d9", fontSize: 12 }} />
              )}
              <span style={{ color: hasNumber ? "#22c55e" : "#666", fontSize: 11 }}>Number (0-9)</span>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          loading={isLoading}
          onClick={handleResetPassword}
          disabled={!isPasswordValid() || !passwordsMatch}
          label={
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <LockOutlined />
              Reset Password
            </span>
          }
          style={{
            width: "100%",
            height: 42,
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            backgroundColor: !isPasswordValid() || !passwordsMatch ? "#9ca3af" : "#3b82f6",
            border: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "15px 0",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, height: 1, backgroundColor: "#e8e8e8" }} />
          <span style={{ color: "#999", fontSize: 13 }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e8e8e8" }} />
        </div>

        <p style={{ textAlign: "center", color: "#666", fontSize: 14 }}>
          Remember your password?{" "}
          <a
            onClick={handleBackToLogin}
            style={{
              color: "#1890ff",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  )

  // Render Login Form (Original with Forgot Password link)
  const renderLoginForm = () => (
    <div className="form">
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <img src={logo || "/placeholder.svg"} alt="CoachConnect Logo" style={{ marginBottom: 20, maxWidth: "100%" }} />
        <h5
          style={{
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Welcome to OCC Alumni
        </h5>
        <p style={{ color: "#666", margin: 0 }}>Login to continue</p>
      </div>

      {error && (
        <div style={{ marginBottom: 20 }}>
          <Alert message={error} type="error" showIcon />
        </div>
      )}
      {!error && type === "session-expired" && (
        <div style={{ marginBottom: 20 }}>
          <Alert message="Your session has expired." type="error" showIcon />
        </div>
      )}

      <Form name="normal_login" onFinish={submitForm} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input placeholder="Enter your email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <div style={{ textAlign: "right", marginTop: -10, marginBottom: 15 }}>
          <a
            onClick={() => setCurrentView("forgot-password")}
            style={{
              color: "#1890ff",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Forgot Password?
          </a>
        </div>

        <Form.Item style={{ marginTop: 20 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            label="Sign in"
            style={{
              width: "100%",
              height: "45px",
              fontSize: "16px",
              fontWeight: 600,
            }}
          />
        </Form.Item>
      </Form>

      {/* Register redirect section */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <p style={{ color: "#666", margin: 0 }}>
          Don't have an account?{" "}
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault()
              handleRegisterRedirect()
            }}
            style={{
              color: "#1890ff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  )

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const email = urlParams.get("email")

    if (token && email) {
      setCurrentView("reset-password")
      setForgotEmail(decodeURIComponent(email))
      setResetToken(token)
    }
  }, [])

  return (
    <>
      <Row
        style={{
          minHeight: "100vh",
          margin: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Left Side - Image (60%) */}
        <Col xs={0} sm={0} md={14} lg={14} xl={14} />

        {/* Right Side - Form (40%) */}
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={10}
          xl={10}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "40px 20px",
            backgroundColor: "#667eead1",
          }}
        >
          {currentView === "login" && renderLoginForm()}
          {currentView === "forgot-password" && renderForgotPasswordForm()}
          {currentView === "find-user" && renderFindUserForm()}
          {currentView === "reset-password" && renderResetPasswordForm()}
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal open={resetSuccess} footer={null} closable={false} centered width={400}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: "#dcfce7",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <CheckCircleFilled style={{ fontSize: 40, color: "#22c55e" }} />
          </div>

          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1a1a2e",
              marginBottom: 10,
            }}
          >
            Password Reset Successful!
          </h3>

          <p
            style={{
              color: "#666",
              marginBottom: 25,
              fontSize: 14,
            }}
          >
            Your password has been successfully changed. Please sign in with your new password.
          </p>

          <Button
            type="primary"
            onClick={handleSuccessModalClose}
            label="Sign In"
            style={{
              width: "100%",
              height: 45,
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 8,
              backgroundColor: "#3b82f6",
              border: "none",
            }}
          />
        </div>
      </Modal>
    </>
  )
}

export default Formlogin
