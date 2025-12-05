// This is the corrected loginActions.js file
// Replace your existing loginActions.js with this code

import Api from "../utils/api"
import { delay } from "../utils/helper"
import secureLocalStorage from "react-secure-storage"

const checkLogin = async ({ params, set, get }) => {
  const setSubmit = get().setSubmit
  const setError = get().setError
  setSubmit(true)
  setError(null)
  await delay(1000)
  Api.login(params)
    .then((result) => {
      secureLocalStorage.setItem("access_token", result.data.access_token)

      secureLocalStorage.setItem("faculty_id", result?.data?.faculty_id)
      secureLocalStorage.setItem("userID", result?.data?.user?.id)
      secureLocalStorage.setItem("userRole", result?.data?.user?.role)
      secureLocalStorage.setItem("email", result?.data?.user?.email)
      secureLocalStorage.setItem("name", result?.data?.user?.name)

      if (result?.data?.user?.role === "department_head" && result?.data?.course_id) {
        secureLocalStorage.setItem("courseId", result.data.course_id)
      }

      const userRole = result?.data?.user?.role

    //   if (userRole === "admin") {
    //     window.location = "/admin-dashboard"
    //     return
    //   }

      if (userRole === "department_head") {
        window.location = "/department-dashboard"
        return
      }

    //   if (userRole === "faculty") {
    //     window.location = "/classroom"
    //     return
    //   }

    //   if (userRole === "student") {
    //     window.location = "/classroom"
    //     return
    //   }

    //   if (userRole === "alumni") {
    //     window.location = "/profile"
    //     return
    //   }

      // Default fallback
      window.location = "/"
    })
    .catch((error) => {
      setSubmit(false)
      if (error.response) {
        setError(error.response.data.message)
        return
      }
      setError(true)
    })
}

export { checkLogin }
