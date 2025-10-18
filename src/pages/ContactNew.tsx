"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { HiMail, HiPhone, HiLocationMarker, HiClock } from "react-icons/hi"
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa"
import emailjs from "@emailjs/browser"
import { useLanguage } from "../contexts/LanguageContext"
import Button from "../components/ui/Button"
import Container from "../components/ui/Container"
import Heading from "../components/ui/Heading"
import Text from "../components/ui/Text"
import PageHeader from "@/components/ui/PageHeader"
import { span } from "framer-motion/client"

const SERVICE_ID = "service_oqtsjvk"
const TEMPLATE_ID = "template_as1f8ef"
const PUBLIC_KEY = "tmtvG3TszApKascvx"

const ContactNew: React.FC = () => {
  const { t } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Map form field names to our state
    const fieldMap: { [key: string]: string } = {
      'user_name': 'fullName',
      'user_email': 'email',
      'message': 'message'
    }
    const stateField = fieldMap[name] || name
    setFormData(prev => ({
      ...prev,
      [stateField]: value
    }))
  }

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current || sending) return

    setSending(true)
    setStatus("idle")
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      setStatus("ok")
      formRef.current.reset()
      setFormData({ fullName: "", email: "", message: "" })
    } catch (err) {
      console.error(err)
      setStatus("fail")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}

      <PageHeader title={t("contact.hero.title")} subtitle={t("contact.hero.subtitle")} backgroundImage="/images/lienhe.jpg" height="h-48" />

      {/* Main Content */}
      <main className="py-5">

        {/* ---------------- Địa chỉ + Bản đồ ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-500 -mt-5">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Heading level={2} className="text-white mt-5 mb-5 px-4 lg:ml-15">
              {t("contactnew.info.title")}
            </Heading>

            <div className="space-y-6 px-4 lg:ml-50">
              <div className="flex items-start space-x-4">
                <HiLocationMarker className="text-blue-900 text-xl mt-1" />
                <Text className="text-white">{t("contactnew.info.address")}</Text>
              </div>

              <div className="flex items-start space-x-4">
                <HiMail className="text-blue-900 text-xl mt-1" />
                <Text className="text-white">{t("contactnew.info.email")}</Text>
              </div>

              <div className="flex items-start space-x-4">
                <HiPhone className="text-blue-900 text-xl mt-1" />
                <Text className="text-white">{t("contactnew.info.phone")}</Text>
              </div>

              <div className="flex items-start space-x-4">
                <HiClock className="text-blue-900 text-xl mt-1" />
                <Text className="text-white">{t("contactnew.info.hours")}</Text>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-3 mb-7 pl-6 pr-4 lg:pr-5"
          >
            <div className="absolute -bottom-6 -left-3 w-[calc(100%-12px)] h-96 bg-blue-800 rounded-xl"></div>

            <div className="relative z-10 h-96 overflow-hidden shadow-lg bg-blue-900 rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0412949539887!2d106.61360347508808!3d10.731298489414739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752dc323e3a63b%3A0xa1469f5f02cd4ab5!2zMTkgOTIsIEFuIEzhuqFjLCBCw6xuaCBUw6JuLCBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1759044258599!5m2!1svi!2s"
                className="w-full h-full block"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

        </div>

        {/* ---------------- Form gửi tin nhắn ---------------- */}
        <div className="-mb-5">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-12"
          >
            <div className="flex justify-center mb-12">
              <Heading level={2} className="text-blue-900 mb-1">
                {t("contactnew.form.title")}
              </Heading>
            </div>

            <form ref={formRef} onSubmit={sendEmail} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  name="user_name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t("contactnew.form.name.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <input
                  type="email"
                  name="user_email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("contactnew.form.email.placeholder")}
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t("contactnew.form.message.placeholder")}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none mb-6"
                required
              />

              <div className="text-center">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={sending}
                  className={`!rounded-none px-12 relative overflow-hidden text-white bg-blue-900 shadow-md before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-yellow-500 before:transition-all before:duration-500 hover:before:left-0 transition-colors duration-300 ${sending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <span className="relative z-10">
                    {sending ? t("contactnew.form.sending") : t("contactnew.form.submit")}
                  </span>
                </Button>
              </div>

              {status === "ok" && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center mt-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("contactnew.form.success")}
                </div>
              )}
              {status === "fail" && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center mt-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("contactnew.form.error")}
                </div>
              )}
            </form>
          </motion.section>
        </div>
      </main>
    </div>
  )
}

export default ContactNew

